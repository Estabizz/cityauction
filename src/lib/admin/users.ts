import type { Prisma } from "@prisma/client";
import { ADMIN_ROLES } from "@/lib/auth";
import type { AdminActor } from "./guard";

type Tx = Prisma.TransactionClient;

export async function loadTarget(tx: Tx, id: string) {
  const user = await tx.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      isActive: true,
      deletedAt: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
  if (!user || user.deletedAt) return null;
  return { ...user, roleNames: user.roles.map((r) => r.role.name) };
}

export function isAdminAccount(roleNames: string[]) {
  return roleNames.some((role) => ADMIN_ROLES.includes(role));
}

// Plain admins may manage ordinary accounts; admin accounts (and therefore who
// can sign in to this panel) are managed by a SUPER_ADMIN only.
export function canManage(actor: AdminActor, targetRoles: string[]) {
  return actor.isSuperAdmin || !isAdminAccount(targetRoles);
}

// Active SUPER_ADMIN accounts other than `excludeId`. Used so the last one can
// never be demoted or deactivated.
export function otherActiveSuperAdmins(tx: Tx, excludeId: string) {
  return tx.user.count({
    where: {
      id: { not: excludeId },
      isActive: true,
      deletedAt: null,
      roles: { some: { role: { name: "SUPER_ADMIN" } } },
    },
  });
}

export class AdminRuleError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}
