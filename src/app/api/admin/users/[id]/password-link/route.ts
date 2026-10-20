import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin/audit";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { AdminRuleError, canManage, loadTarget } from "@/lib/admin/users";

type Ctx = { params: Promise<{ id: string }> };

const LINK_HOURS = 24;

function siteOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

// One-time "set your password" link, valid for 24 hours. Generating a new one
// replaces any earlier link. The token is shown once and never logged.
export async function POST(req: Request, ctx: Ctx) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;

  try {
    const { id } = await ctx.params;
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + LINK_HOURS * 60 * 60 * 1000);

    const target = await db.$transaction(async (tx) => {
      const user = await loadTarget(tx, id);
      if (!user) throw new AdminRuleError("User not found.", 404);
      // Otherwise a plain admin could take over a super admin's account.
      if (!canManage(actor, user.roleNames)) {
        throw new AdminRuleError("Only a super admin can create a password link for an admin account.", 403);
      }
      await tx.user.update({ where: { id }, data: { passwordSetToken: token, passwordSetExpires: expiresAt } });
      await writeAudit(actor, req, {
        action: "PASSWORD_LINK_CREATED",
        entity: "User",
        entityId: id,
        newValue: { email: user.email, expiresAt: expiresAt.toISOString() },
      }, tx);
      return user;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          email: target.email,
          isActive: target.isActive,
          url: `${siteOrigin(req)}/set-password?token=${token}`,
          expiresAt,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (err instanceof AdminRuleError) return jsonError(err.message, err.status);
    console.error("[admin] password link failed", err);
    return jsonError("Could not create a password link.", 500);
  }
}
