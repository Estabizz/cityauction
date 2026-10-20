import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/account/auth-ui";
import { ForgotPasswordForm } from "@/components/account/forgot-password-form";
import { authLinkClass } from "@/components/account/styles";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a new password for your CityAuction account.",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and our team will send you a link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className={authLinkClass}>
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
