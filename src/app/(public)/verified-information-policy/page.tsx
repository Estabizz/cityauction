import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Information Policy | CityAuction",
  description: "Standards and protocols for Verified Auction Information on the CityAuction platform.",
};

export default function VerifiedInformationPolicyPage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen py-16">
      <div className="estabizz-container max-w-4xl space-y-8">
        <div>
          <div className="eyebrow-text">Verification standards</div>
          <h1 className="font-serif-heading text-4xl sm:text-5xl font-semibold text-[#182129] tracking-tight mt-2">
            Verified Information Policy
          </h1>
          <p className="text-xs text-[#6f777d] mt-2">
            How CityAuction verifies auction notices and source particulars across lending institutions
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e6dfd4] p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#182129] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              1. What &quot;Verified Auction Information&quot; Means
            </h2>
            <p className="text-[#6f777d]">
              When an auction listing on CityAuction displays the &quot;Verified Information&quot;
              badge, it signifies that our editorial and data processing team has cross-verified
              the core auction parameters—including Reserve Price, EMD amount, Bid Increment,
              Inspection Dates, Submission Deadlines, and Authorised Officer contact details—directly
              against an authentic newspaper publication, institution-issued Form IV statutory
              notice, or official Gazette notification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              2. Source-Level Verification vs. Independent Title Certification
            </h2>
            <p className="text-[#6f777d]">
              <strong>Important Limitation:</strong> Source-level verification means confirming
              that the information published on our platform accurately mirrors what the lending
              institution or liquidator has declared. It <strong>does NOT</strong> constitute:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#6f777d] text-xs">
              <li>An independent certification or legal opinion on the perfection of the borrower&apos;s title;</li>
              <li>A verification that no third-party tenancy, easement, or encumbrance exists;</li>
              <li>A certification of municipal property tax, water, electricity or society dues;</li>
              <li>A physical assessment of building structural integrity or permissible floor area.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              3. Continuous Syncing & Addenda Updates
            </h2>
            <p className="text-[#6f777d]">
              Lending institutions occasionally publish corrigenda, extension notices, or stay
              orders issued by Debt Recovery Tribunals or appellate courts. CityAuction makes
              diligent efforts to monitor and reflect such addenda promptly. However, bidders are
              always advised to examine the latest tender document available in the virtual data
              room or with the Authorised Officer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              4. Reporting Inaccuracies
            </h2>
            <p className="text-[#6f777d]">
              If you identify any discrepancy between a published auction notice and the details
              shown on CityAuction, please immediately notify our compliance desk at{" "}
              <a href="mailto:info@estabizz.com" className="text-[#b49361] underline font-semibold">
                info@estabizz.com
              </a>
              . Such reports are prioritized and investigated within 4 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
