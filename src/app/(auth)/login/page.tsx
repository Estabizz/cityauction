import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { AccountAccess } from "@/components/account/account-access";
import { accountView } from "@/components/account/access-route";
import { safeNextPath } from "@/components/account/safe-next";

export const metadata: Metadata = {
  title: "Sign in or create an account",
  description: "Access your CityAuction account with secure email verification.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next) ?? undefined;
  const user = await getCurrentUser();
  if (user) redirect(next || (isAdmin(user) ? "/admin/dashboard" : "/dashboard"));
  return <AccountAccess initialView={accountView(params.view)} next={next} />;
}
