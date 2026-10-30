import type { Metadata } from "next";
import { getAccount } from "@/components/account/dashboard-data";
import { safeNextPath } from "@/components/account/safe-next";
import { DbErrorNote } from "@/components/account/dashboard-ui";
import { WelcomeFlow } from "@/components/account/welcome-flow";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function WelcomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { session, user, dbError } = await getAccount();
  const next = safeNextPath((await searchParams).next) || "/dashboard";
  const firstName = (user?.fullName || session.fullName).split(/\s+/)[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {dbError && <DbErrorNote />}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#84663c]">Step 2 of 2 · Optional</p>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-[#091118] mt-1">Welcome, {firstName}. What are you looking for?</h1>
        <p className="text-sm text-[#59636a] mt-2">
          Tell us roughly what you want to buy and we&apos;ll suggest matching auctions on your dashboard. Every field is optional, and you can
          add more requirements or change this later.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[#e6dfd4] p-5 sm:p-7">
        <WelcomeFlow hasEmail={!!(user?.email || session.email)} next={next} />
      </div>
    </div>
  );
}
