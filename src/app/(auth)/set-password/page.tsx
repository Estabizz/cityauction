import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AuthShell, FormAlert } from "@/components/account/auth-ui";
import { SetPasswordForm } from "@/components/account/set-password-form";
import { authLinkClass } from "@/components/account/styles";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

type LinkState = { status: "ok"; email: string } | { status: "invalid" } | { status: "unknown" };

// Check the link before showing the form, so an expired one says so up front.
async function checkToken(token: string): Promise<LinkState> {
  if (!/^[a-f0-9]{64}$/i.test(token)) return { status: "invalid" };
  try {
    const user = await db.user.findUnique({
      where: { passwordSetToken: token },
      select: { email: true, passwordSetExpires: true, isActive: true, deletedAt: true },
    });
    if (!user || !user.isActive || user.deletedAt || !user.passwordSetExpires || user.passwordSetExpires <= new Date()) {
      return { status: "invalid" };
    }
    return { status: "ok", email: user.email };
  } catch (error) {
    // Database unreachable: still show the form; the save step reports the problem.
    console.error("[set-password page]", error);
    return { status: "unknown" };
  }
}

export default async function SetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";
  const state = await checkToken(token);

  if (state.status === "invalid") {
    return (
      <AuthShell title="This link has expired" subtitle="Set-password links work once and only for 24 hours.">
        <div className="space-y-4">
          <FormAlert>This link is invalid, expired, or was already used.</FormAlert>
          <p className="text-sm text-[#59636a]">
            Ask for a new link and our team will send one. If you already set your password, just sign in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <Link href="/forgot-password" className={authLinkClass}>Request a new link</Link>
            <span className="hidden sm:inline text-[#c9c1b4]">·</span>
            <Link href="/login" className={authLinkClass}>Go to sign in</Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set your password" subtitle="Choose a password for your CityAuction account.">
      <SetPasswordForm token={token} email={state.status === "ok" ? state.email : undefined} />
    </AuthShell>
  );
}
