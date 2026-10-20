import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getAdminActor, type AdminActor } from "@/lib/admin/guard";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · CityAuction Admin" },
  robots: { index: false, follow: false },
};

// proxy.ts already turns away anyone without an admin session; this re-checks
// the account in the database (still active, still an admin) before rendering.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/admin/dashboard");
  if (!isAdmin(session)) redirect("/dashboard");

  let actor: AdminActor | null = null;
  let databaseDown = false;
  try {
    actor = await getAdminActor();
  } catch (error) {
    console.error("[admin] layout check failed", error);
    databaseDown = true;
  }

  if (databaseDown) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] p-6">
        <div className="max-w-md rounded-2xl border border-[#e6dfd4] bg-white p-8 text-center">
          <p className="font-serif-heading text-3xl font-semibold text-[#091118]">Database not reachable</p>
          <p className="mt-2 text-sm text-[#6f777d]">
            The admin panel could not connect to the database. Check DATABASE_URL in the Hostinger environment and that
            the MySQL database is running, then reload this page.
          </p>
        </div>
      </div>
    );
  }
  if (!actor) redirect("/dashboard");

  return (
    <AdminShell
      admin={{
        name: actor.fullName || actor.email,
        email: actor.email,
        roleLabel: actor.isSuperAdmin ? "Super admin" : "Admin",
      }}
    >
      {children}
    </AdminShell>
  );
}
