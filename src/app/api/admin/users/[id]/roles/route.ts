import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin/audit";
import { MANAGED_ROLES } from "@/lib/admin/constants";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { AdminRuleError, loadTarget, otherActiveSuperAdmins } from "@/lib/admin/users";

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({ role: z.enum(MANAGED_ROLES), grant: z.boolean() });

// Grant or remove ADMIN / SUPER_ADMIN. Super admins only, and the last active
// super admin always keeps the role.
export async function POST(req: Request, ctx: Ctx) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;
  if (!actor.isSuperAdmin) return jsonError("Only a super admin can change admin roles.", 403);

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Send a role (ADMIN or SUPER_ADMIN) and grant true/false.");
  const { role, grant } = parsed.data;

  try {
    const { id } = await ctx.params;
    const roles = await db.$transaction(async (tx) => {
      const target = await loadTarget(tx, id);
      if (!target) throw new AdminRuleError("User not found.", 404);
      const has = target.roleNames.includes(role);
      if (has === grant) return target.roleNames;

      if (!grant && role === "SUPER_ADMIN" && (await otherActiveSuperAdmins(tx, id)) === 0) {
        throw new AdminRuleError("This is the last active super admin, so the role cannot be removed.");
      }

      const roleRow = await tx.role.upsert({ where: { name: role }, update: {}, create: { name: role } });
      if (grant) {
        await tx.userRole.create({ data: { userId: id, roleId: roleRow.id } });
      } else {
        await tx.userRole.delete({ where: { userId_roleId: { userId: id, roleId: roleRow.id } } });
      }

      const next = grant ? [...target.roleNames, role] : target.roleNames.filter((r) => r !== role);
      await writeAudit(actor, req, {
        action: grant ? "ROLE_GRANTED" : "ROLE_REMOVED",
        entity: "User",
        entityId: id,
        previousValue: { email: target.email, roles: target.roleNames },
        newValue: { email: target.email, roles: next, role },
      }, tx);
      return next;
    });

    return NextResponse.json({ success: true, data: { id, roles } });
  } catch (err) {
    if (err instanceof AdminRuleError) return jsonError(err.message, err.status);
    console.error("[admin] role change failed", err);
    return jsonError("Could not change roles.", 500);
  }
}
