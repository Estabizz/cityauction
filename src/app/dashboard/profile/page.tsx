import Link from "next/link";
import type { Metadata } from "next";
import { FileLock2, KeyRound, Megaphone, ShieldCheck, Mail, UserRound } from "lucide-react";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading, Panel } from "@/components/account/dashboard-ui";
import { ChangePasswordForm, LogoutEverywhere, MarketingPreferences, EmailForm, ProfileForm } from "@/components/account/profile-forms";

export const metadata: Metadata = {
  title: "Profile & Security",
};

export default async function ProfilePage() {
  const { session, user, dbError } = await getAccount();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeading title="Profile & Security" subtitle="Your details, how we contact you, and who's signed in to your account." />
      {dbError && <DbErrorNote />}

      {/* Without the saved details the forms would show blanks and could wipe them on save. */}
      {!user ? (
        <Panel title="Personal details" icon={<UserRound className="h-4 w-4" />}>
          <p className="text-sm text-[#59636a]">Your details will appear here once they load.</p>
        </Panel>
      ) : (
        <>
          <Panel title="Personal details" icon={<UserRound className="h-4 w-4" />}>
            <ProfileForm
              emailVerified={user.isEmailVerified}
              initial={{
                fullName: user.fullName || session.fullName,
                email: user.email || "",
                phone: user.phone || "",
                buyerCategory: user.buyerCategory || "",
                city: user.city || "",
                state: user.state || "",
              }}
            />
          </Panel>

          <Panel title="Email verification" icon={<Mail className="h-4 w-4" />}>
            <EmailForm email={user.email} />
          </Panel>

          <Panel title="Promotional messages" icon={<Megaphone className="h-4 w-4" />}>
            <MarketingPreferences
              hasEmail={!!user.email}
              initial={{ EMAIL: user.marketingEmail, SMS: user.marketingSms, WHATSAPP: user.marketingWhatsapp }}
            />
          </Panel>

          {user.hasPassword && (
            <Panel title="Change password" icon={<KeyRound className="h-4 w-4" />}>
              <ChangePasswordForm />
            </Panel>
          )}
        </>
      )}

      <Panel title="Security" icon={<ShieldCheck className="h-4 w-4" />}>
        <LogoutEverywhere />
      </Panel>

      <Panel title="Your data" icon={<FileLock2 className="h-4 w-4" />}>
        <p className="text-sm text-[#59636a]">
          You can ask for a copy of the data we hold about you, ask us to correct it, or ask us to delete your account. Send a request from{" "}
          <Link href="/dashboard/requests" className="font-semibold text-[#84663c] hover:underline">
            My enquiries
          </Link>{" "}
          or read our{" "}
          <Link href="/privacy-policy" className="font-semibold text-[#84663c] hover:underline">
            Privacy Notice
          </Link>
          . We never show your budget, requirements or contact details to other buyers or brokers.
        </p>
      </Panel>
    </div>
  );
}
