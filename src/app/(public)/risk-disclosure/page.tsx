import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclosure | CityAuction",
  description:
    "Risk Disclosure for CityAuction users covering auction property, title, possession, encumbrance, valuation, financing, Customs auctions, industrial assets, business/project opportunities and transaction execution risks.",
  alternates: {
    canonical: "/risk-disclosure",
  },
  openGraph: {
    type: "website",
    title: "Risk Disclosure | CityAuction",
    description:
      "Risk Disclosure for CityAuction users covering auction property, title, possession, encumbrance, valuation, financing, Customs auctions, industrial assets, business/project opportunities and transaction execution risks.",
    url: "/risk-disclosure",
    siteName: "CityAuction",
  },
};

export default function RiskDisclosurePage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1218] to-[#172631] text-white py-20">
        <div className="container">
          <div className="eyebrow !text-[#d9c39c]">Transaction Risk Notice</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
            Risk Disclosure
          </h1>
          <p className="text-base text-[#c4ced4] max-w-3xl mt-4 leading-relaxed">
            Auction assets, institutional disposals, Customs lots, distressed or special-situation companies, development projects and strategic transactions can involve material legal, financial, physical, regulatory and execution risks. This Risk Disclosure is intended to explain the principal categories of risk that users should consider before committing capital, EMD, time or transaction resources.
          </p>

          <div className="mt-6 p-4 border border-[rgba(255,255,255,0.12)] rounded-2xl bg-[rgba(255,255,255,0.03)] flex gap-7 flex-wrap text-xs text-[#c4ced4]">
            <span><strong className="text-white">Effective Date:</strong> 27 September 2026</span>
            <span><strong className="text-white">Version:</strong> 1.0</span>
            <span><strong className="text-white">Operator:</strong> Estabizz Fintech Private Limited</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16">
        <article className="policy max-w-4xl mx-auto">
          <div className="notice">
            <strong>Important:</strong> This Risk Disclosure is general in nature and does not identify every possible risk. Risk varies by asset, legal process, jurisdiction, institution, possession status, transaction structure and user circumstances. Users should independently assess each Opportunity and obtain appropriate professional advice where required.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4] first:border-0 first:pt-0">
              1. Auction Assets Are Not Conventional Retail Purchases
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Auction assets may arise through recovery, enforcement, insolvency, liquidation, Customs disposal, court process or other non-standard sale mechanisms. Documentation, inspection rights, representations, warranties, timelines and remedies may differ materially from a negotiated private-market transaction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should not assume that ordinary retail or negotiated-sale expectations apply to an auction transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              2. Title and Ownership Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The ownership history, title chain, conveyance documents, mutation, leasehold/freehold rights, development rights or other interests may be incomplete, disputed, imperfect or subject to claims.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A sale notice or institutional sale process does not by itself guarantee that the title is clear, marketable or free from challenge.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              3. Encumbrance, Charge and Attachment Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              An asset may be subject to mortgages, charges, liens, attachments, easements, statutory claims, other lender interests, third-party claims or restrictions that are not obvious from a listing summary.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The legal effect of a sale on such interests should be independently examined in the context of the specific transaction and governing law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              4. Possession and Occupancy Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Physical possession, symbolic possession, tenancy, unauthorised occupation, disputed access, borrower occupation or third-party possession can materially affect the timing, cost and practical value of an acquisition.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A successful auction bid does not necessarily mean immediate vacant or peaceful possession.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              5. Litigation and Legal-Proceeding Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Assets or underlying borrowers may be involved in litigation, tribunal proceedings, writ petitions, insolvency proceedings, recovery proceedings, attachment proceedings, criminal complaints, tenancy disputes or other legal matters.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Proceedings may continue, be appealed, be stayed or produce outcomes that affect transfer, possession, use or value.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              6. Dues and Liability Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Municipal tax, society charges, maintenance, electricity, water, industrial authority dues, lease rent, ground rent, GST, other taxes, penalties, statutory charges or utility liabilities may exist.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Who ultimately bears such dues can depend on the sale terms, law and factual circumstances. Users should not assume all prior liabilities automatically disappear upon purchase.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              7. Physical Condition and Inspection Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Assets may be damaged, poorly maintained, obsolete, incomplete, inaccessible or materially different from photographs or historic records.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Inspection opportunities may be limited, and some auction processes may proceed on an “as-is-where-is”, “as-is-what-is”, “whatever-there-is” or similar basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              8. Valuation and Market Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Reserve price is not necessarily equal to current market value, forced-sale value, replacement cost or future resale value.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Property and asset markets can move adversely. Location, condition, liquidity, zoning, future development, interest rates, regulation and buyer demand may affect value.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed font-medium text-[#182129]">
              No discount, appreciation, resale ability or investment return is guaranteed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              9. Bidding and Price-Discovery Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Competitive bidding can result in a purchase price materially above the reserve price or above the level originally intended by the bidder.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should establish their own bidding discipline and should not rely on CityAuction to determine the maximum bid or commercial suitability of an asset.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              10. EMD, Payment and Forfeiture Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              EMD, bid security, balance consideration and other payments may be subject to strict deadlines and forfeiture conditions.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Failure to make payment, satisfy eligibility, complete documentation or comply with auction conditions can result in rejection, cancellation or forfeiture, depending on the governing notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              11. Financing and Liquidity Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Auction timelines may be shorter than normal loan-sanction timelines. A lender may refuse financing, reduce the sanctioned amount, impose additional collateral conditions or decline the asset as acceptable security.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should not bid assuming financing will necessarily be available after becoming the successful bidder.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              12. Post-Auction Completion Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Even after a successful bid, completion may involve sale confirmation, balance payment, sale certificate, stamping, registration, mutation, possession, society transfer, utility transfer, authority approvals and other procedural steps.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Delay, documentation gaps or third-party dependencies may affect completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              13. Industrial Asset and Machinery Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Industrial properties, factories, machinery and equipment may involve additional risks including plant condition, obsolescence, dismantling cost, environmental obligations, licences, utility connections, hazardous material, labour issues and transport/removal cost.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Machinery may not be operational, complete, calibrated or suitable for the buyer’s intended use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              14. Customs Auction Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Customs lots can involve uncertainty regarding quantity, quality, usability, condition, product classification, regulatory approvals, testing, standards, import/export restrictions, end-use requirements and lifting obligations.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Goods may require BIS, FSSAI, Legal Metrology, quarantine, pollution-control, hazardous-waste, vehicle, transport, re-export, destruction or other compliance depending on the lot.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The winning bid may represent only one component of the total acquisition cost.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              15. Going Concern / Business Acquisition Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A business or going-concern opportunity may carry operational, employee, contractual, licensing, tax, environmental, customer, supplier, litigation, debt and working-capital risks.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Historical revenue, profitability or asset value does not guarantee future performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              16. Company / Project / “Next Chapter” Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Companies and development projects facing financial stress may have lender claims, project delays, cost overruns, incomplete approvals, RERA or other regulatory obligations, unsold inventory, customer claims, contractor disputes, title issues, tax liabilities or promoter-level constraints.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A proposed investor, JV partner, strategic buyer or capital provider may withdraw, change terms, fail diligence or decline to complete.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              17. Joint Venture and Strategic Partner Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              JV and partnership transactions involve counterparty, governance, funding, control, execution, dilution, exit and alignment risks.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A strong asset does not by itself ensure a successful JV structure or satisfactory partner relationship.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              18. Information and Source Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Information may come from institutions, public notices, sellers, professionals, users, government sources or third-party systems and may be incomplete, delayed, amended or inaccurate.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should always verify material facts from the authoritative source before acting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              19. Technology and Platform Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Website downtime, communication failure, delayed alerts, cyber incidents, third-party platform outage, API failure or software defects may affect access to information.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction should not be used as the sole channel for deadline-sensitive statutory auction actions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              20. Regulatory and Legal-Change Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Laws, regulations, tax treatment, auction procedures, financing norms, insolvency rules, Customs requirements, land-use rules and other regulatory conditions may change.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Such changes can affect eligibility, cost, timing, enforceability, use, resale or expected transaction structure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              21. Counterparty and Fraud Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Fraudulent payment instructions, impersonation, unauthorised brokers, fake documents, false websites, substituted bank accounts and other scams may occur in the wider market.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should independently verify payment instructions and communicate through authoritative institutional channels before transferring funds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              22. No Risk Elimination by CityAuction
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may provide information organisation, due-diligence coordination, inspection support, valuation coordination, professional introductions, buyer discovery or transaction-support services.
            </p>
            <div className="legal-box">
              <p>
                <strong>However, these services do not eliminate transaction risk.</strong> A reviewed asset may still involve legal, financial, physical, possession, market, regulatory or execution risk. The final decision remains with the user.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              23. User Acknowledgement
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              By using CityAuction or participating in an Opportunity, the user acknowledges that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>auction and special-situation transactions can involve substantial risk;</li>
              <li>the user is responsible for independent evaluation and professional advice where required;</li>
              <li>CityAuction does not guarantee title, possession, valuation, financing, regulatory clearance, successful bidding or transaction outcome;</li>
              <li>past or indicative value does not guarantee future value;</li>
              <li>the user should proceed only after understanding the applicable auction or transaction documents.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              24. Relationship with Other Policies
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              This Risk Disclosure forms part of the wider CityAuction legal framework and should be read with the Terms &amp; Conditions, Disclaimer, Privacy Policy, Verified Information Policy and any transaction-specific notice or professional engagement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              25. Contact
            </h2>
            <div className="p-5 border border-[#e6dfd4] rounded-2xl bg-[#faf8f4] text-sm text-[#253039] space-y-1 mt-3">
              <strong className="block text-base text-[#182129]">CityAuction – Estabizz Fintech Private Limited</strong>
              <p>Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India</p>
              <p>Email: <a href="mailto:info@estabizz.com" className="text-[#80643d] font-bold hover:underline">info@estabizz.com</a></p>
              <p>Phone: <a href="tel:+919825669668" className="text-[#80643d] font-bold hover:underline">+91 98256 69668</a></p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
