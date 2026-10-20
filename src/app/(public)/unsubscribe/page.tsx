import type { Metadata } from "next";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop receiving CityAuction auction opportunity and city update emails.",
  alternates: { canonical: "/unsubscribe" },
  robots: { index: false, follow: true },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { email } = await searchParams;

  return (
    <section className="estabizz-section ivory-bg">
      <div className="estabizz-container">
        <div className="max-w-xl mx-auto bg-white border border-[#e6dfd4] rounded-[22px] p-6 sm:p-10">
          <div className="eyebrow-text">Email updates</div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-[#182129] mt-3 leading-tight">
            Unsubscribe from CityAuction Updates
          </h1>
          <p className="text-sm text-[#6f777d] mt-3 leading-relaxed">
            Enter the email address you subscribed with and we&apos;ll stop sending auction
            opportunity and city update emails to it.
          </p>
          <UnsubscribeForm initialEmail={typeof email === "string" ? email : ""} />
        </div>
      </div>
    </section>
  );
}
