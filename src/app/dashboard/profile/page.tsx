import Link from "next/link";
import type { Metadata } from "next";
import { KeyRound, Megaphone, ShieldCheck, Mail, UserRound } from "lucide-react";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading, Panel } from "@/components/account/dashboard-ui";
import { ChangePasswordForm, LogoutEverywhere, MarketingPreferences, EmailForm, ProfileForm } from "@/components/account/profile-forms";

export const metadata: Metadata = { title: "My profile & security" };

export default async function ProfilePage() {
  const { session, user, dbError } = await getAccount();
  return <div className="max-w-5xl space-y-6">
    <PageHeading title="My profile & security" subtitle="Manage your details, sign-in email and password." />
    {dbError && <DbErrorNote />}
    {!user ? <Panel title="Profile details"><p className="text-sm text-[#687480]">Your saved details could not be loaded. Refresh the page to try again.</p></Panel> : <>
      <Panel title="Verification status" icon={<ShieldCheck className="h-4 w-4" />}>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-[#e4e8ec] p-4"><h3 className="text-xs font-medium text-[#687480]">Sign-in email</h3><p className="mt-1 break-all text-sm font-medium">{user.email || "Not set"}</p><p className={`mt-2 text-xs font-semibold ${user.isEmailVerified && user.email ? "text-emerald-800" : "text-amber-800"}`}>{user.isEmailVerified && user.email ? "Verified" : "Not verified"}</p><p className="mt-2 text-xs leading-relaxed text-[#687480]">Email verification protects your sign-in and password recovery.</p></div>
          <div className="min-w-0 rounded-xl border border-[#e4e8ec] p-4"><h3 className="text-xs font-medium text-[#687480]">Contact phone</h3><p className="mt-1 break-all text-sm font-medium">{user.phone || "Not added"}</p><p className="mt-2 text-xs font-semibold text-[#46525d]">{user.phone && user.isPhoneVerified ? "Previously verified" : user.phone ? "Not verified" : "No contact number"}</p><p className="mt-2 text-xs leading-relaxed text-[#687480]">Mobile OTP verification is not available. This number is for contact, not sign-in.</p></div>
        </div>
      </Panel>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel className="min-w-0" title="Personal & company details" icon={<UserRound className="h-4 w-4" />}>
          <ProfileForm emailVerified={user.isEmailVerified} companyLocked={Boolean(user.bidderProfile && user.bidderProfile.status !== "INCOMPLETE")}
            initial={{ fullName: user.fullName || session.fullName, email: user.email || "", phone: user.phone || "", accountType: user.accountType || "INDIVIDUAL", companyName: user.bidderProfile?.companyName || "", gstNumber: user.bidderProfile?.gstNumber || "", buyerCategory: user.buyerCategory || "", address: user.address || "", city: user.city || "", state: user.state || "", pincode: user.pincode || "", updatedAt: user.updatedAt.toISOString() }} />
        </Panel>
        <div className="min-w-0 space-y-6">
          <Panel title={user.isEmailVerified ? "Change sign-in email" : "Verify sign-in email"} icon={<Mail className="h-4 w-4" />}><EmailForm email={user.email} /></Panel>
          <Panel title={user.hasPassword ? "Change password" : "Set a password"} icon={<KeyRound className="h-4 w-4" />}>{user.hasPassword ? <ChangePasswordForm /> : <div className="space-y-3 text-sm text-[#687480]"><p>Verify your email to set a password for this account.</p><Link href="/forgot-password" className="inline-flex min-h-11 items-center rounded-xl bg-[#132330] px-4 font-semibold text-white">Set password with email verification</Link></div>}</Panel>
          <Panel title="Signed-in devices" icon={<ShieldCheck className="h-4 w-4" />}><LogoutEverywhere /></Panel>
        </div>
      </div>
      <Panel title="Promotional messages" icon={<Megaphone className="h-4 w-4" />}><MarketingPreferences hasEmail={!!user.email} initial={{ EMAIL: user.marketingEmail, SMS: user.marketingSms, WHATSAPP: user.marketingWhatsapp }} /></Panel>
    </>}
    <Panel title="Your data"><p className="text-sm leading-relaxed text-[#687480]">Request a copy, correction or deletion of your account data through <Link href="/dashboard/requests" className="font-semibold underline">My enquiries</Link>. Read our <Link href="/privacy-policy" className="font-semibold underline">Privacy Notice</Link> for details.</p></Panel>
  </div>;
}
