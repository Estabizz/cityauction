import Link from "next/link";
import type { Metadata } from "next";
import { LiquidateAssetForm } from "@/components/forms/liquidate-asset-form";

export const metadata: Metadata = {
  title: "Liquidate an Asset | CityAuction Institutional Asset Sale & Buyer Discovery",
  description:
    "Submit institutional assets for structured liquidation support, investor discovery, asset presentation, bidder engagement, auction connectivity and transaction coordination through CityAuction.",
  alternates: {
    canonical: "/liquidate-an-asset",
  },
  openGraph: {
    type: "website",
    title: "Liquidate an Asset | Reach the Right Buyer Market with CityAuction",
    description:
      "For Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals, Financial Institutions, Corporates and Asset Owners.",
    url: "/liquidate-an-asset",
    siteName: "CityAuction",
  },
};

export default function LiquidateAnAssetPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero with Live Intake Form */}
      <section className="liq-hero" id="submit">
        <div className="estabizz-container liq-hero-row">
          <div>
            <div className="eyebrow-text">Liquidate an Asset</div>
            <h1>
              Your Asset Deserves More Than Publication.<br />
              <em>It Deserves the Right Buyer Market.</em>
            </h1>
            <p className="liq-hero-copy">
              CityAuction helps Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals, Financial Institutions, Corporates and asset owners take assets to market through structured presentation, targeted buyer discovery, bidder engagement and transaction coordination.
            </p>
            <div className="liq-hero-promise">
              We do not replace the statutory seller, Liquidator, Recovery Officer or authorised e-auction platform. We help the asset reach the market more intelligently.
            </div>
            <div className="actions-row">
              <a href="#assetForm" className="btn-pill btn-gold">
                Submit an Asset
              </a>
              <a
                href="mailto:info@estabizz.com?subject=CityAuction%20Liquidation%20Strategy%20Discussion"
                className="btn-pill btn-ghost"
              >
                Discuss a Liquidation Strategy
              </a>
            </div>
          </div>

          <aside className="liq-submit-card" id="assetForm">
            <div className="eyebrow-text">Institutional onboarding</div>
            <h3>Tell Us What Needs to Reach the Market.</h3>
            <p>Use this as the front-end intake for your Institutional Desk / CRM workflow.</p>
            <div className="mt-4">
              <LiquidateAssetForm />
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Audience Strip */}
      <div className="audience-strip">
        <div className="estabizz-container">
          <div className="audiences-grid">
            <div className="audience-item">
              <strong>Banks</strong>
              <span>Secured assets / NPA sales</span>
            </div>
            <div className="audience-item">
              <strong>NBFCs</strong>
              <span>Recovery-linked asset sales</span>
            </div>
            <div className="audience-item">
              <strong>ARCs</strong>
              <span>Resolution & recovery assets</span>
            </div>
            <div className="audience-item">
              <strong>Liquidators / IPs</strong>
              <span>IBC / liquidation sales</span>
            </div>
            <div className="audience-item">
              <strong>Corporates</strong>
              <span>Surplus / non-core assets</span>
            </div>
            <div className="audience-item">
              <strong>Asset Owners</strong>
              <span>Specialised asset monetisation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. What can be liquidated */}
      <section className="estabizz-section bg-white" id="assets">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">What can be liquidated</div>
            </div>
            <div>
              <h2>Far More Than Property.</h2>
              <p className="lead-text mt-4">
                Institutional liquidation can involve individual assets, asset clusters, businesses, financial assets and rights. CityAuction should be capable of presenting each category in a format buyers can understand.
              </p>
            </div>
          </div>

          <div className="liq-asset-grid">
            <article className="liq-asset-card">
              <small>Immovable</small>
              <h3>Land & Buildings</h3>
              <p>Residential, commercial, industrial, agricultural and other immovable assets.</p>
            </article>
            <article className="liq-asset-card">
              <small>Industrial</small>
              <h3>Plant & Machinery</h3>
              <p>Production lines, equipment, utility assets, scrap and specialised machinery.</p>
            </article>
            <article className="liq-asset-card">
              <small>Business Sale</small>
              <h3>Going Concern</h3>
              <p>Corporate debtor / business operations offered as a going concern, subject to applicable process terms.</p>
            </article>
            <article className="liq-asset-card">
              <small>Composite Sale</small>
              <h3>Slump Sale / Set of Assets</h3>
              <p>Land, building, machinery, financial assets or multiple asset parcels sold collectively.</p>
            </article>
            <article className="liq-asset-card">
              <small>Movable</small>
              <h3>Vehicles & Other Assets</h3>
              <p>Cars, commercial vehicles, inventory, furniture, fixtures and other movable assets.</p>
            </article>
            <article className="liq-asset-card">
              <small>Financial</small>
              <h3>Securities & Investments</h3>
              <p>Shares, investments, financial interests and other transferable securities where lawfully saleable.</p>
            </article>
            <article className="liq-asset-card">
              <small>Recovery Assets</small>
              <h3>Receivables & Claims</h3>
              <p>Loans, advances, receivables and other recoverable financial claims offered for assignment or transfer.</p>
            </article>
            <article className="liq-asset-card">
              <small>Special Situations</small>
              <h3>NRRA / Litigation-Linked Rights</h3>
              <p>Not readily realisable assets, avoidance-related claims and similar rights, where permitted under the governing framework.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. How liquidation support works */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg" id="process">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How liquidation support works</div>
            </div>
            <div>
              <h2 className="text-white">From Asset Onboarding to Buyer Conversion.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                The statutory sale process remains with the competent seller or authorised auction route. CityAuction focuses on making the asset easier to discover, understand and engage with.
              </p>
            </div>
          </div>

          <div className="liq-process-grid">
            <article className="liq-process-card">
              <div className="liq-num">01</div>
              <h3>Onboard</h3>
              <p>Collect asset particulars, legal route, reserve / indicative value, images, documents, inspection terms and auction timeline.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">02</div>
              <h3>Structure</h3>
              <p>Convert technical source material into a buyer-friendly asset profile without diluting legal disclosures.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">03</div>
              <h3>Position</h3>
              <p>Define buyer segments, use cases, location context, commercial potential and the right presentation strategy.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">04</div>
              <h3>Distribute</h3>
              <p>Take the asset to relevant buyers, investors, developers, businesses, HNIs and strategic acquirers.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">05</div>
              <h3>Engage</h3>
              <p>Capture enquiries, manage lead stages, coordinate permitted inspections and respond to information requests.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">06</div>
              <h3>Qualify</h3>
              <p>Organise bidder KYC / eligibility workflow and connect prospects to the authorised EMD and auction process.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">07</div>
              <h3>Auction Connectivity</h3>
              <p>Route eligible bidders to the Bank, Liquidator, Recovery Officer or appointed e-auction service provider.</p>
            </article>
            <article className="liq-process-card">
              <div className="liq-num">08</div>
              <h3>Close & Report</h3>
              <p>Support communication, post-auction coordination and institutional MIS on the buyer funnel and outcome.</p>
            </article>
          </div>

          <div className="quote-block">
            “Publication satisfies a process. Market discovery creates participation.”
          </div>
        </div>
      </section>

      {/* 5. All-in-one liquidation services */}
      <section className="estabizz-section bg-[#f6f2ea]" id="services">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">All-in-one liquidation services</div>
            </div>
            <div>
              <h2>Everything Around the Auction That Helps the Market Work Better.</h2>
              <p className="lead-text mt-4">
                The page should allow an institution to understand, in one place, exactly where CityAuction can add value around the authorised sale process.
              </p>
            </div>
          </div>

          <div className="liq-services-grid">
            <article className="liq-service-card">
              <h3>Asset Intelligence & Packaging</h3>
              <p>Build a structured digital asset profile from scattered source material.</p>
              <ul>
                <li>Asset summary</li>
                <li>Photo / video organisation</li>
                <li>Location & access context</li>
                <li>Reserve / indicative value display</li>
                <li>Sale-stage timeline</li>
              </ul>
            </article>
            <article className="liq-service-card">
              <h3>Investor Marketing</h3>
              <p>Move beyond passive publication to targeted market discovery.</p>
              <ul>
                <li>Buyer segmentation</li>
                <li>Digital distribution</li>
                <li>Investor alerts</li>
                <li>Direct outreach</li>
                <li>Campaign landing page</li>
              </ul>
            </article>
            <article className="liq-service-card">
              <h3>Lead & Enquiry Management</h3>
              <p>Give the seller visibility into the buyer funnel.</p>
              <ul>
                <li>Lead capture</li>
                <li>Interest qualification</li>
                <li>Follow-up status</li>
                <li>Site-visit requests</li>
                <li>Bid-intent tracking</li>
              </ul>
            </article>
            <article className="liq-service-card">
              <h3>Bidder Onboarding Support</h3>
              <p>Help prospective bidders understand the required process.</p>
              <ul>
                <li>KYC document checklist</li>
                <li>Eligibility documentation</li>
                <li>Process-document support</li>
                <li>EMD guidance</li>
                <li>Auction-route connectivity</li>
              </ul>
            </article>
            <article className="liq-service-card">
              <h3>Inspection Coordination</h3>
              <p>Organise controlled asset access where the seller permits inspection.</p>
              <ul>
                <li>Appointment requests</li>
                <li>Seller coordination</li>
                <li>Attendance tracking</li>
                <li>Buyer questions</li>
                <li>Inspection feedback</li>
              </ul>
            </article>
            <article className="liq-service-card">
              <h3>Institutional MIS & Reporting</h3>
              <p>Track what happened between publication and auction.</p>
              <ul>
                <li>Views & enquiries</li>
                <li>Qualified leads</li>
                <li>Data-room access</li>
                <li>Inspection requests</li>
                <li>Participation funnel</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 6. Buyer Due Diligence Room */}
      <section className="estabizz-section bg-white" id="dataroom">
        <div className="estabizz-container">
          <div className="data-room-box">
            <div className="room-left-panel">
              <div className="eyebrow-text">Buyer due diligence room</div>
              <h3>Give Serious Buyers the Information They Need to Decide.</h3>
              <p>
                A controlled data room can reduce repetitive queries and help eligible prospects understand the asset before the bid deadline.
              </p>
              <div className="quote-block">
                “Better information does not guarantee a bid. It improves the quality of the buyer&apos;s decision.”
              </div>
            </div>

            <div className="room-items-grid">
              <div className="room-item-box">
                <strong>Auction / Sale Notice</strong>
                Latest notice, corrigenda and process documents.
              </div>
              <div className="room-item-box">
                <strong>Asset Schedule</strong>
                Description, survey details, lot composition and inventory.
              </div>
              <div className="room-item-box">
                <strong>Title / Ownership Records</strong>
                Documents made available by the authorised seller.
              </div>
              <div className="room-item-box">
                <strong>Valuation Material</strong>
                Valuation or reserve-price support where permitted for sharing.
              </div>
              <div className="room-item-box">
                <strong>Photographs / Videos</strong>
                Current available visual records of the asset.
              </div>
              <div className="room-item-box">
                <strong>Inspection Information</strong>
                Dates, access procedure and authorised contact details.
              </div>
              <div className="room-item-box">
                <strong>Bidder Documents</strong>
                KYC, eligibility, undertaking and bid-submission requirements.
              </div>
              <div className="room-item-box">
                <strong>Q&amp;A / Clarifications</strong>
                Seller-approved responses, addenda and material updates.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sale Structures */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Sale structures</div>
            </div>
            <div>
              <h2 className="text-white">One Asset-Sale Page Should Support Multiple Liquidation Structures.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                The governing legal framework and authorised seller determine the method used. CityAuction should be able to present and support the workflow around each structure.
              </p>
            </div>
          </div>

          <div className="methods-grid">
            <article className="method-card">
              <h3>E-Auction</h3>
              <p>Buyer discovery, bidder preparation and connectivity to the authorised online auction platform.</p>
            </article>
            <article className="method-card">
              <h3>Re-Auction / Revised Sale</h3>
              <p>Refresh the campaign when reserve price, timeline, lot structure or other sale terms are revised by the competent seller.</p>
            </article>
            <article className="method-card">
              <h3>Going Concern / Slump Sale</h3>
              <p>Present the business, asset perimeter and process documents in a format appropriate for strategic acquirers.</p>
            </article>
            <article className="method-card">
              <h3>Other Permitted Sale Routes</h3>
              <p>Support buyer discovery around private sale, negotiated sale or other lawful disposal methods where the governing process permits.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. Buyer Discovery & Distribution */}
      <section className="estabizz-section bg-[#f6f2ea]" id="marketing">
        <div className="estabizz-container marketing-grid">
          <div>
            <div className="eyebrow-text">Buyer discovery &amp; distribution</div>
            <h2 className="mt-3">Do Not Market Every Asset to Everyone.</h2>
            <p>
              A residential property needs a different audience from a running factory. A wind turbine needs a different buyer pool from a portfolio of receivables. A going-concern sale requires strategic acquirers, not ordinary property leads.
            </p>
            <p>
              CityAuction should build a buyer-discovery plan around the asset—not force every asset into the same marketing template.
            </p>
            <div className="quote-block">
              “The objective is not maximum impressions. It is maximum relevance.”
            </div>
          </div>

          <div className="channels-grid">
            <div className="channel-box">
              <strong>CityAuction Marketplace</strong><br />
              Structured searchable listing and asset page.
            </div>
            <div className="channel-box">
              <strong>Personalised Buyer Alerts</strong><br />
              Notify users whose mandates match the opportunity.
            </div>
            <div className="channel-box">
              <strong>Strategic Buyer Outreach</strong><br />
              Direct engagement with relevant businesses and acquirers.
            </div>
            <div className="channel-box">
              <strong>Developer / Investor Network</strong><br />
              Reach buyers by asset class and geography.
            </div>
            <div className="channel-box">
              <strong>Professional Network</strong><br />
              Engage advocates, CAs, CSs, IPs, brokers and intermediaries where relevant.
            </div>
            <div className="channel-box">
              <strong>Digital Campaigns</strong><br />
              Targeted campaign pages, search visibility and permitted digital outreach.
            </div>
            <div className="channel-box">
              <strong>WhatsApp / Email Alerts</strong><br />
              Consent-based communication to matched prospects.
            </div>
            <div className="channel-box">
              <strong>Site Visit Funnel</strong><br />
              Convert interest into qualified inspection requests.
            </div>
          </div>
        </div>
      </section>

      {/* 9. Institutional Dashboard */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Institutional dashboard</div>
            </div>
            <div>
              <h2>Know What Is Happening After the Notice Goes Live.</h2>
              <p className="lead-text mt-4">
                A meaningful institutional product should show activity, not merely host a listing.
              </p>
            </div>
          </div>

          <div className="mis-grid">
            <article className="mis-card">
              <h3>Market Reach</h3>
              <p>Track listing views, alert delivery, campaign reach and buyer-source channels.</p>
            </article>
            <article className="mis-card">
              <h3>Buyer Funnel</h3>
              <p>Track enquiries, qualified prospects, document requests, inspection interest and bidder readiness.</p>
            </article>
            <article className="mis-card">
              <h3>Process Status</h3>
              <p>Track notices, corrigenda, key dates, seller actions, auction connectivity and post-auction status.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 10. Institutional FAQs */}
      <section className="estabizz-section bg-[#f6f2ea]" id="faq">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Institutional FAQs</div>
            </div>
            <div>
              <h2>What Sellers Usually Want to Know.</h2>
            </div>
          </div>

          <div className="faq-accordion space-y-1">
            <details>
              <summary>Does CityAuction itself conduct the statutory auction?</summary>
              <p>
                Not by default. The competent Bank, ARC, Liquidator, Recovery Officer, authorised seller or appointed e-auction service provider conducts the sale process as applicable. CityAuction&apos;s role is market discovery, presentation, bidder engagement, transaction-support workflows and auction connectivity unless a separate authorised role is expressly established.
              </p>
            </details>
            <details>
              <summary>Can CityAuction list liquidation assets other than property?</summary>
              <p>
                Yes. The page is designed to support land and building, plant and machinery, vehicles, securities, receivables, asset sets, going-concern sales, slump-sale structures and other transferable assets or rights, subject to the governing legal process.
              </p>
            </details>
            <details>
              <summary>Can a Liquidator use CityAuction even if the auction happens on another portal?</summary>
              <p>
                Yes. CityAuction can operate as the discovery, asset-presentation and bidder-engagement layer while eligible bidders are ultimately directed to the designated auction portal or process specified by the Liquidator.
              </p>
            </details>
            <details>
              <summary>Can CityAuction support re-auctions and corrigenda?</summary>
              <p>
                Yes. The asset page and campaign can be updated to reflect revised dates, reserve price, lot structure or other changes approved and published by the competent seller. Prior versions and material updates should be clearly controlled.
              </p>
            </details>
            <details>
              <summary>Can buyers be given access to a data room?</summary>
              <p>
                Yes, subject to seller approval, confidentiality controls and the nature of the information. The platform can be designed to manage registration, access controls, document acknowledgements and Q&amp;A workflows.
              </p>
            </details>
            <details>
              <summary>What reporting can the seller receive?</summary>
              <p>
                Potential reporting can include buyer reach, enquiries, lead source, data-room access, inspection requests, qualified-bidder funnel, campaign status and other agreed MIS without representing such data as guaranteed auction participation.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 11. CTA */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="about-cta-panel">
            <div>
              <div className="eyebrow-text">Start the conversation</div>
              <h2 className="mt-2.5">Have an Asset That Needs the Right Market?</h2>
              <p>
                Share the asset, sale context and current stage with the CityAuction Institutional Desk. We can structure the buyer-discovery and transaction-support layer around the authorised sale process.
              </p>
            </div>
            <div className="actions-row mt-0">
              <a href="#assetForm" className="btn-pill btn-gold">
                Submit Asset
              </a>
              <a
                href="mailto:info@estabizz.com?subject=CityAuction%20Liquidation%20Strategy%20Discussion"
                className="btn-pill btn-ghost"
              >
                Speak With Institutional Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
