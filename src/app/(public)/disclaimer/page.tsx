import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Scale, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Statutory Disclaimer | CityAuction",
  description: "Statutory legal disclaimer regarding bank property auctions and notice representations.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide max-w-4xl">
        <nav className="text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">Disclaimer</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statutory Auction Disclaimer</h1>
        <p className="text-xs text-gray-500 mb-8">Notice to Bidders and Prospective Purchasers</p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 text-xs md:text-sm mb-8 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Regulatory Notice:</strong> All properties and assets showcased on CityAuction are auctioned by and under the sole statutory authority of the respective secured creditors, Authorised Officers, or Debts Recovery Tribunals. CityAuction does not guarantee physical title, condition, boundary measurements, or freedom from third-party encumbrances.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm space-y-6 text-xs md:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Sourcing of Auction Information</h2>
            <p>
              The auction notices, tender documents, reserve prices, and property descriptions published on this platform are reproduced based on official notifications issued by lending institutions under Rule 8(6) and Rule 9 of the Security Interest (Enforcement) Rules, 2002. While CityAuction takes utmost care to ensure accurate transcription, in the event of any discrepancy, the official newspaper publication and physical tender notice signed by the Authorised Officer shall prevail.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. Independent Verification Prerequisite</h2>
            <p>
              Prospective bidders are advised in their own interest to satisfy themselves regarding the physical condition of the property, structural soundness, town planning compliance, clear title deeds, approved building plans, and existence of any statutory dues such as property taxes, electricity arrears, water charges, society maintenance, or prior legal encumbrances before depositing EMD.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Postponement, Modification, or Cancellation Rights</h2>
            <p>
              The Authorised Officer / Lending Institution reserves the unconditional right to postpone, withdraw, cancel, or modify any auction event at any stage before or after submission of bids without assigning any reason whatsoever. In the event of auction cancellation by the bank, EMD remittances will be refunded without interest.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. No Real Estate Agency or Brokerage Relationship</h2>
            <p>
              CityAuction does not act as a real estate broker, intermediary agent, or advisor. No commission or brokerage fee is levied on buyers for purchasing properties through our platform. All financial remittances are transacted directly between the bidder and the designated bank escrow / recovery account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
