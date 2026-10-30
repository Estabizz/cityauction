import type { Metadata } from "next";
import { KeyRound, UserRound } from "lucide-react";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading, Panel } from "@/components/account/dashboard-ui";
import { ChangePasswordForm, ProfileForm } from "@/components/account/profile-forms";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const { session, user, dbError } = await getAccount();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeading title="My Profile" subtitle="Keep your contact details up to date so our team can reach you." />
      {dbError && <DbErrorNote />}

      <Panel title="Personal details" icon={<UserRound className="h-4 w-4" />}>
        {/* Without the saved details the form would show blanks and could wipe them on save. */}
        {dbError ? (
          <p className="text-sm text-[#59636a]">Your details will appear here once they load.</p>
        ) : (
          <ProfileForm
            email={user?.email || session.email}
            initial={{
              fullName: user?.fullName || session.fullName,
              phone: user?.phone || "",
              city: user?.city || "",
              state: user?.state || "",
            }}
          />
        )}
      </Panel>

      <Panel title="Change password" icon={<KeyRound className="h-4 w-4" />}>
        <ChangePasswordForm />
      </Panel>
    </div>
  );
}
