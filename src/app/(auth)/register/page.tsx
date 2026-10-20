import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthShell } from "@/components/account/auth-ui";
import { RegisterForm } from "@/components/account/register-form";
import { safeNextPath } from "@/components/account/safe-next";
import { authLinkClass } from "@/components/account/styles";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a free CityAuction account to track your enquiries and auction alerts.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = safeNextPath((await searchParams).next) ?? undefined;

  if (await getCurrentUser()) redirect(next || "/dashboard");

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free. Track your enquiries and get auction updates in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link href={loginHref} className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
