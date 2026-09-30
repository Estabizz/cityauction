import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclosure | CityAuction",
  description: "Statutory risk disclosure statement for bidders participating in distressed asset and bank property auctions.",
};

export default function RiskDisclosurePage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen py-16">
      <div className="estabizz-container max-w-4xl space-y-8">
        <div>
          <div className="eyebrow-text">Statutory disclosure</div>
          <h1 className="font-serif-heading text-4xl sm:text-5xl font-semibold text-[#182129] tracking-tight mt-2">
            Risk Disclosure Statement
          </h1>
          <p className="text-xs text-[#6f777d] mt-2">
            Important regulatory disclosures for bidders participating in SARFAESI, DRT, and Insolvency Auctions
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e6dfd4] p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#182129] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              1. &quot;As Is Where Is&quot; and &quot;Whatever There Is&quot; Principle
            </h2>
            <p className="text-[#6f777d]">
              All properties, plant & machinery, vehicles, and assets offered through CityAuction
              are sold strictly on &quot;As is where is&quot;, &quot;As is what is&quot;, and
              &quot;Whatever there is&quot; basis under the Securitisation and Reconstruction of
              Financial Assets and Enforcement of Security Interest (SARFAESI) Act, 2002 and the
              Insolvency and Bankruptcy Code (IBC), 2016. Neither the Authorised Officer, the
              secured creditor, the liquidator, nor CityAuction warrants or guarantees the
              physical condition, title perfection, boundary demarcation, or structural fitness
              of the asset.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              2. Independent Legal & Physical Due Diligence Mandate
            </h2>
            <p className="text-[#6f777d]">
              Prospective bidders are solely responsible for conducting independent physical site
              inspections during the permitted window, title search at the jurisdictional Sub-Registrar
              office, review of municipal tax dues, electricity and water utility arrears, society
              maintenance liabilities, and pending litigation before the Debt Recovery Tribunal
              (DRT), High Court, or NCLT prior to submitting bids.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              3. Nature of Possession (Physical vs. Symbolic)
            </h2>
            <p className="text-[#6f777d]">
              Bidders must carefully ascertain whether the secured creditor holds <strong>Physical
              Possession</strong> (the property has been physically taken over under Section 13(4)
              or Section 14 with Magistrate assistance) or <strong>Symbolic Possession</strong>
              (actual physical possession remains with the borrower or third-party occupants). In
              cases of symbolic possession, obtaining physical handover may require subsequent
              statutory procedures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              4. Mandatory Payment Milestones & Forfeiture Risk
            </h2>
            <p className="text-[#6f777d]">
              Under Rule 9 of the Security Interest (Enforcement) Rules, 2002, the successful
              Highest Bidder (H1) is legally obligated to deposit 25% of the total purchase price
              (inclusive of the Earnest Money Deposit) on the same day or by the close of the next
              working day. The balance 75% must be paid within 15 days of confirmation of sale or
              such extended period as agreed in writing by the secured creditor. Failure to adhere
              to these statutory timelines results in immediate forfeiture of all deposited amounts
              and cancellation of sale.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-heading text-xl font-bold text-[#182129]">
              5. Role of CityAuction as Electronic Facilitator
            </h2>
            <p className="text-[#6f777d]">
              CityAuction operates solely as an electronic publication, buyer discovery, and
              transaction facilitation platform. CityAuction does not act as an agent, broker,
              auctioneer, or legal guarantor for either the lending institution or the bidder. The
              contract of sale is strictly between the Authorised Officer / Liquidator and the
              successful bidder.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
