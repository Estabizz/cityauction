import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin/audit";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { AdminRuleError, canManage, loadTarget, otherActiveSuperAdmins } from "@/lib/admin/users";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({ isActive: z.boolean() });

// Activate or deactivate an account. A deactivated account cannot use the
// admin panel (checked on every admin request).
export async function PATCH(req: Request, ctx: Ctx) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("isActive must be true or false.");
  const { isActive } = parsed.data;

  try {
    const { id } = await ctx.params;
    const updated = await db.$transaction(async (tx) => {
      const target = await loadTarget(tx, id);
      if (!target) throw new AdminRuleError("User not found.", 404);
      if (target.isActive === isActive) return target;
      if (!isActive && target.id === actor.id) throw new AdminRuleError("You cannot deactivate your own account.");
      if (!canManage(actor, target.roleNames)) {
        throw new AdminRuleError("Only a super admin can change an admin account.", 403);
      }
      if (!isActive && target.roleNames.includes("SUPER_ADMIN") && (await otherActiveSuperAdmins(tx, id)) === 0) {
        throw new AdminRuleError("This is the last active super admin, so it cannot be deactivated.");
      }

      await writeAudit(actor, req, {
        action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        entity: "User",
        entityId: id,
        previousValue: { email: target.email, isActive: target.isActive },
        newValue: { email: target.email, isActive },
      }, tx);
      return tx.user.update({ where: { id }, data: { isActive }, select: { id: true, isActive: true } });
    });

    return NextResponse.json({ success: true, data: { id: updated.id, isActive: updated.isActive } });
  } catch (err) {
    if (err instanceof AdminRuleError) return jsonError(err.message, err.status);
    console.error("[admin] user update failed", err);
    return jsonError("Could not update this user.", 500);
  }
}
