import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | CityAuction",
  description:
    "Important disclaimer governing auction information, title and possession, valuation, due diligence, third-party platforms, payments, Customs auctions, professional services and strategic opportunities on CityAuction.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    type: "website",
    title: "Disclaimer | CityAuction",
    description:
      "Important disclaimer governing auction information, title and possession, valuation, due diligence, third-party platforms, payments, Customs auctions, professional services and strategic opportunities on CityAuction.",
    url: "/disclaimer",
    siteName: "CityAuction",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero */}
      <section className="disclaimer-hero">
        <div className="container max-w-4xl mx-auto px-5">
          <div className="eyebrow-text">Important Legal Notice</div>
          <h1 className="text-4xl sm:text-6xl font-serif-heading font-semibold text-white tracking-tight mt-3">
            Disclaimer
          </h1>
          <p className="text-[#c4ced4] text-base sm:text-lg mt-3 leading-relaxed">
            This Disclaimer explains the limits of CityAuction’s role and the assumptions users must not make when viewing auction information, asset opportunities, alerts, due diligence support, institutional services, Customs-auction information or strategic opportunities.
          </p>

          <div className="disclaimer-meta">
            <span><strong>Effective Date:</strong> 27 September 2026</span>
            <span><strong>Version:</strong> 1.0</span>
            <span><strong>Operator:</strong> Estabizz Fintech Private Limited</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-5 py-16">
        <article className="disclaimer-policy-wrap">
          <div className="notice p-5 border border-[#e2d6c2] bg-[#fbf7ef] rounded-2xl mb-8 text-[#665a49] text-sm leading-relaxed">
            <strong>Core Principle:</strong> CityAuction is primarily an information, discovery, marketplace and transaction-support platform. Unless expressly stated otherwise in a specific written engagement, CityAuction does not own the asset, conduct the statutory auction, guarantee the asset, certify title, confirm possession, fix reserve price, approve bidders, hold EMD, provide investment advice or guarantee transaction completion.
          </div>

          <section>
            <h2>1. Auction Information Is Not the Authoritative Sale Document</h2>
            <p>
              Auction details, summaries, dates, reserve prices, possession descriptions, photographs, institution names, asset particulars and other information displayed on CityAuction may be sourced from auction notices, institutions, public records, authorised stakeholders or other sources.
            </p>
            <p>
              The relevant auction notice, corrigendum, addendum, institutional communication and designated auction platform are the authoritative sources. If any CityAuction content differs from the authoritative source, the authoritative source shall prevail.
            </p>
            <p>
              Auction information may change, be corrected, withdrawn, postponed, cancelled or superseded without prior notice to CityAuction.
            </p>
          </section>

          <section>
            <h2>2. No Title, Ownership or Encumbrance Guarantee</h2>
            <p>
              CityAuction does not guarantee that any listed asset has clear, marketable or transferable title. A listing must not be interpreted as confirmation that ownership is undisputed or that the asset is free from mortgages, charges, liens, attachments, claims, easements, litigation, tenancy rights, government restrictions, statutory dues or third-party interests.
            </p>
            <p>
              Users should obtain independent legal review before bidding or acquiring an asset.
            </p>
          </section>

          <section>
            <h2>3. Possession Is Not Assured</h2>
            <p>
              References to physical possession, symbolic possession, occupied status, vacant status or similar descriptions are based on available source information. CityAuction does not independently guarantee possession and does not warrant that possession can be obtained immediately, peacefully or without legal, administrative or practical difficulty.
            </p>
          </section>

          <section>
            <h2>4. Reserve Price Is Not Market Value</h2>
            <p>
              Reserve price, upset price, starting price or institutional valuation must not be treated as CityAuction’s opinion of fair market value or investment worth. The reserve price may have been determined for a specific statutory, recovery or sale process.
            </p>
            <p>
              Any statement that an asset may be available below prevailing market indications is illustrative and opportunity-specific. No discount, appreciation, return, profit or resale value is guaranteed.
            </p>
          </section>

          <section>
            <h2>5. Meaning of “Verified Auction Information”</h2>
            <p>
              “Verified Auction Information” ordinarily means that specified auction particulars have been cross-checked against an institution-provided or publicly available auction source.
            </p>
            <div className="legal-box">
              <p>
                <strong>It does not mean:</strong> clear title, vacant possession, absence of encumbrances, absence of litigation, accurate valuation, physical-condition certification, statutory-compliance certification, guaranteed eligibility or guaranteed acquisition.
              </p>
            </div>
          </section>

          <section>
            <h2>6. Due Diligence Remains the User’s Responsibility</h2>
            <p>
              Users must independently evaluate all material aspects of an Opportunity, including title, possession, litigation, encumbrances, dues, zoning, approvals, land use, physical condition, access, structural condition, taxation, applicable laws, financing, valuation and sale terms.
            </p>
            <p>
              CityAuction may coordinate or facilitate legal, valuation, technical, inspection or other professional services, but the responsible professional’s scope and conclusion govern that work.
            </p>
          </section>

          <section>
            <h2>7. No Investment, Legal, Tax or Financial Advice</h2>
            <p>
              Information, comparisons, search results, alerts, insights, summaries, due-diligence coordination and other CityAuction content are provided for information and transaction-support purposes.
            </p>
            <p>
              Nothing on CityAuction constitutes personalised investment advice, legal advice, tax advice, credit advice, financial planning, valuation certification or a recommendation to buy, bid, sell, finance or hold an asset.
            </p>
          </section>

          <section>
            <h2>8. Auction Participation, EMD and Bid Risk</h2>
            <p>
              Unless expressly stated otherwise, users participate through the competent Auctioning Authority or its authorised e-auction platform.
            </p>
            <p>
              CityAuction does not guarantee bidder registration, bid acceptance, successful bidding, confirmation of sale, refund of EMD, issuance of sale certificate or completion of transfer.
            </p>
            <p>
              EMD amount, refund, forfeiture, balance-payment deadlines and other payment consequences are governed by the relevant auction terms. Users must verify payment instructions directly from authoritative sources.
            </p>
          </section>

          <section>
            <h2>9. Third-Party Platforms and Professionals</h2>
            <p>
              CityAuction may provide links, introductions or integrations involving Banks, NBFCs, ARCs, Liquidators, MSTC, Customs authorities, auction platforms, lenders, lawyers, valuers, inspectors, registries, payment providers or other third parties.
            </p>
            <p>
              CityAuction does not control such third parties and, to the maximum extent permitted by law, is not responsible for their acts, omissions, advice, availability, rejection, delay, data handling, security, fees or transaction outcomes.
            </p>
          </section>

          <section>
            <h2>10. Customs Auction Disclaimer</h2>
            <p>
              CityAuction is not CBIC, ICEGATE, MSTC or a Custom House unless expressly authorised for a specific service.
            </p>
            <p>
              Customs lots may be sold on “as-is-where-is” or similar conditions and may involve quantity risk, inspection risk, testing, product-specific licences, BIS, FSSAI, Legal Metrology, quarantine, environmental, waste-management, transport, re-export, destruction or other compliance requirements.
            </p>
            <p>
              Buyers are solely responsible for determining whether the goods may lawfully be possessed, transported, processed, resold, consumed, imported, exported or otherwise used.
            </p>
          </section>

          <section>
            <h2>11. “Next Chapter” / Company / Project Opportunity Disclaimer</h2>
            <p>
              CityAuction may facilitate introductions relating to company sales, project sales, joint ventures, investor induction, strategic capital, asset monetisation or promoter exits.
            </p>
            <p>
              Such introductions do not constitute a commitment to invest, buy, fund, restructure, complete a project or continue a business. CityAuction does not guarantee valuation, transaction completion, investor capability, funding, turnaround, restructuring success or future business performance.
            </p>
          </section>

          <section>
            <h2>12. Personalised Alerts and Matching</h2>
            <p>
              An alert means only that available information appears to correspond with certain criteria provided by the user. It does not mean the Opportunity is suitable, legally safe, financially attractive, correctly valued or available at the time the alert is opened.
            </p>
            <p>
              CityAuction does not guarantee that every relevant opportunity will be captured, matched or delivered.
            </p>
          </section>

          <section>
            <h2>13. Photographs, Maps, Illustrations and Property Descriptions</h2>
            <p>
              Photographs, maps, plans, measurements, illustrations, descriptions and location indicators may be supplied by third parties or used for presentation purposes. They may not reflect current physical condition, exact boundaries, exact dimensions, legal identity or present occupancy.
            </p>
            <p>
              Users must verify the asset physically and legally where appropriate.
            </p>
          </section>

          <section>
            <h2>14. Website and Technical Availability</h2>
            <p>
              CityAuction does not warrant uninterrupted, error-free or real-time availability. Maintenance, network interruption, cloud failure, cyberattack, third-party outage, software error or other technical events may delay or prevent access.
            </p>
            <p>
              Users must not rely solely on CityAuction for auction deadlines, EMD deadlines, bid submission or other time-sensitive statutory actions.
            </p>
          </section>

          <section>
            <h2>15. No Warranty</h2>
            <p className="text-xs uppercase tracking-wider text-[#525d64] leading-relaxed font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CITYAUCTION AND ALL INFORMATION, CONTENT, ALERTS, MATCHES, SEARCH RESULTS, LISTINGS, TOOLS, SUPPORT FEATURES AND SERVICES ARE PROVIDED ON AN “AS AVAILABLE” AND, WHERE APPROPRIATE, “AS IS” BASIS WITHOUT WARRANTY OF ACCURACY, COMPLETENESS, TITLE, POSSESSION, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AVAILABILITY, PROFITABILITY, INVESTMENT PERFORMANCE OR TRANSACTION SUCCESS.
            </p>
          </section>

          <section>
            <h2>16. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, CityAuction and Estabizz Fintech Private Limited shall not be liable for indirect, incidental, consequential, special, exemplary or punitive loss, or for loss of profit, opportunity, capital, revenue, goodwill, data, financing cost or anticipated return arising from reliance on or use of CityAuction.
            </p>
            <p>
              Without limiting the above, CityAuction shall not be responsible for losses connected with:
            </p>
            <ul className="list-disc">
              <li>incorrect, delayed, incomplete or superseded auction information;</li>
              <li>title defects, possession disputes, occupants, tenants, encumbrances, litigation or dues;</li>
              <li>auction cancellation, postponement, rejection, extension or non-confirmation;</li>
              <li>EMD forfeiture, payment error, missed deadline or inadequate funding;</li>
              <li>asset deterioration, quantity variation or physical-condition issues;</li>
              <li>third-party professional, institutional or platform conduct;</li>
              <li>Customs, regulatory or compliance restrictions;</li>
              <li>failure of an investor, buyer, seller, promoter, lender or other counterparty;</li>
              <li>technical outages, cyber incidents or events beyond reasonable control;</li>
              <li>investment or bidding decisions made without independent diligence.</li>
            </ul>

            <div className="legal-box">
              <p>
                <strong>Mandatory-law carve-out:</strong> Nothing in this Disclaimer excludes, restricts or limits any liability, right or remedy that applicable law does not permit to be excluded, restricted or limited.
              </p>
            </div>
          </section>

          <section>
            <h2>17. User Responsibility</h2>
            <p>
              By using CityAuction, users acknowledge that auction and special-situation transactions can involve material legal, commercial, financial, possession, regulatory and execution risk.
            </p>
            <p>
              The user remains responsible for deciding whether to proceed and for obtaining such independent legal, financial, valuation, tax, technical or other professional advice as the user considers necessary.
            </p>
          </section>

          <section>
            <h2>18. Relationship with Other CityAuction Policies</h2>
            <p>
              This Disclaimer must be read together with the Terms &amp; Conditions, Privacy Policy, Risk Disclosure, Verified Information Policy and any service-specific engagement, auction notice or third-party terms.
            </p>
            <p>
              In case of conflict, mandatory law and the authoritative auction or transaction document shall prevail to the extent applicable.
            </p>
          </section>

          <section>
            <h2>19. Contact</h2>
            <p className="leading-relaxed">
              <strong>CityAuction – Estabizz Fintech Private Limited</strong><br />
              Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India<br />
              Email: <a href="mailto:info@estabizz.com" className="text-[#80643d] font-bold hover:underline">info@estabizz.com</a><br />
              Phone: <a href="tel:+919825669668" className="text-[#80643d] font-bold hover:underline">+91 98256 69668</a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
