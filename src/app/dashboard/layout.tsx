import type { Metadata } from "next";
import { DashboardShell } from "@/components/account/dashboard-shell";
import { formatMobile } from "@/lib/mobile";
import { AccountLive } from "@/components/account/account-live";
import { getAccount, initials } from "@/components/account/dashboard-data";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, user, admin } = await getAccount();
  const name = user?.fullName || session.fullName;
  const email = user?.email || session.email || formatMobile(user?.mobile || session.mobile);

  return (
    <DashboardShell name={name} email={email} initials={initials(name)} admin={admin}>
      {children}
      <AccountLive />
    </DashboardShell>
  );
}
