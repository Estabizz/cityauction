import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ADMIN_ROLES, getCurrentUser, isAdmin } from "@/lib/auth";

export interface AdminActor {
  id: string;
  email: string;
  fullName: string | null;
  roles: string[];
  isSuperAdmin: boolean;
}

// proxy.ts already blocks non-admin sessions, but the session token keeps its
// roles for 7 days. Re-check the account in the database on every admin call so
// a deactivated or demoted admin loses access straight away.
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await getCurrentUser();
  if (!session || !isAdmin(session)) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      deletedAt: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
  if (!user || !user.isActive || user.deletedAt) return null;

  const roles = user.roles.map((r) => r.role.name);
  if (!roles.some((role) => ADMIN_ROLES.includes(role))) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: user.fullName,
    roles,
    isSuperAdmin: roles.includes("SUPER_ADMIN"),
  };
}

type GuardResult = { actor: AdminActor; error?: never } | { actor?: never; error: NextResponse };

// For /api/admin/** route handlers: returns the admin, or a 401/403/503 response.
export async function requireAdminApi(): Promise<GuardResult> {
  try {
    const actor = await getAdminActor();
    if (!actor) {
      return { error: jsonError("Admin access required.", 403) };
    }
    return { actor };
  } catch (error) {
    console.error("[admin] guard failed", error);
    return { error: jsonError("The database is not reachable right now.", 503) };
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// For admin server pages that read the database themselves. The layout does the
// same check, but layouts and pages render in parallel, so the page must not
// query anything before the visitor is confirmed as an admin. A database
// failure is left to the layout, which shows a "database not reachable" screen.
export async function requireAdminPage(): Promise<void> {
  let actor: AdminActor | null;
  try {
    actor = await getAdminActor();
  } catch {
    throw new Error("Admin access could not be verified. Please try again.");
  }
  if (!actor) redirect("/login?next=/admin/dashboard");
}
