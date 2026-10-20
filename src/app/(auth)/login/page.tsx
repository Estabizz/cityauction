import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { AuthShell } from "@/components/account/auth-ui";
import { LoginForm } from "@/components/account/login-form";
import { safeNextPath } from "@/components/account/safe-next";
import { authLinkClass } from "@/components/account/styles";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your CityAuction account.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = safeNextPath((await searchParams).next) ?? undefined;

  const user = await getCurrentUser();
  if (user) redirect(next || (isAdmin(user) ? "/admin/dashboard" : "/dashboard"));

  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see your enquiries, alerts and account."
      footer={
        <>
          New to CityAuction?{" "}
          <Link href={registerHref} className={authLinkClass}>
            Create a free account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
