import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | CityAuction",
  description: "Terms and conditions governing use of CityAuction e-auction platform and bidder portal.",
};

export default function TermsPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide max-w-4xl">
        <nav className="text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions of Use</h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: September 2026</p>

        <div className="bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm space-y-6 text-xs md:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, registering, or participating in auctions on CityAuction (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, alongside our Privacy Policy and all applicable statutory regulations under the SARFAESI Act 2002, the Recovery of Debts and Bankruptcy Act 1993, and the Information Technology Act 2000.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. Nature of Platform & Role</h2>
            <p>
              CityAuction functions as an electronic facilitation intermediary and portal hosting notices, documentation, and digital bidding infrastructure on behalf of secured creditors (including Public & Private Sector Banks, NBFCs, and Asset Reconstruction Companies). CityAuction is not the owner or seller of the mortgaged assets. The contractual relationship of sale is exclusively between the Authorised Officer / Lending Institution and the successful bidder.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. &quot;As Is Where Is&quot; Basis & Due Diligence</h2>
            <p>
              All auction properties are offered on &quot;As is where is&quot;, &quot;As is what is&quot;, and &quot;Whatever there is&quot; basis under Rule 8 & 9 of the Security Interest (Enforcement) Rules, 2002. Bidders are solely responsible for conducting independent due diligence, title search, encumbrance verification, physical site inspection, and municipal tax assessment prior to bidding.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. Earnest Money Deposit (EMD) & Forfeiture</h2>
            <p>
              Submission of EMD within prescribed timelines is a non-negotiable prerequisite for bidding eligibility. If a bidder is declared the Highest Bidder (H1) and fails to deposit the mandatory 25% purchase price (inclusive of EMD) within the stipulated timeframe, the EMD amount shall be forfeited by the lending bank in accordance with statutory SARFAESI provisions. Unsuccessful bidders receive 100% EMD refunds without interest.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">5. Bidding Integrity & Server Authority</h2>
            <p>
              Bids submitted through the platform are irrevocable financial commitments. The server timestamp recorded by CityAuction shall be final and authoritative. Any collusion, unauthorized automated bidding scripts, or fraudulent misrepresentation of identity or credentials shall result in immediate account termination, forfeiture of deposits, and reporting to relevant law enforcement authorities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
