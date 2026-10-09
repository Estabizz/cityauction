import Link from "next/link";
import type { Metadata } from "next";
import { InvestorDeskForm } from "@/components/forms/investor-desk-form";

export const metadata: Metadata = {
  title: "Investor Desk & Due Diligence | CityAuction",
  description:
    "CityAuction Investor Desk helps auction buyers understand assets before bidding through auction notice review, title and encumbrance checks, valuation support, inspection coordination, bidder preparation and acquisition support.",
  alternates: {
    canonical: "/investor-desk",
  },
  openGraph: {
    type: "website",
    title: "Investor Desk & Due Diligence | Understand Before You Commit",
    description:
      "A structured pre-bid diligence and acquisition-support desk for auction buyers and investors.",
    url: "/investor-desk",
    siteName: "CityAuction",
  },
};

export default function InvestorDeskPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero */}
      <section className="careers-hero">
        <div className="estabizz-container careers-hero-row">
          <div>
            <div className="eyebrow-text">Investor Desk &amp; Due Diligence</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Find the Opportunity.<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Understand It Before You Commit.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              Auction assets can look attractive at first glance. The real decision begins after the listing—when you understand the sale notice, title trail, possession position, encumbrances, dues, litigation, physical condition, market value and the obligations that may continue after purchase.
            </p>

            <div className="quote-block">
              “Price gets your attention. Due diligence tells you whether the opportunity deserves your capital.”
            </div>

            <div className="actions-row">
              <a className="btn-pill btn-gold" href="#desk">
                Request Due Diligence Support
              </a>
              <a className="btn-pill btn-ghost" href="#scope">
                See What We Check
              </a>
            </div>
          </div>

          <aside className="about-hero-card">
            <div className="eyebrow-text">Before you bid</div>
            <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>
              Eight Questions Worth Answering.
            </h3>
            <p className="text-sm text-[#6f777d] mt-1">
              CityAuction Investor Desk helps you organise these questions before the EMD becomes the point of no return.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">What is being sold?</strong>
                <span className="text-[11px] text-[#6f777d]">Asset, rights, possession and notice terms.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">Who holds title?</strong>
                <span className="text-[11px] text-[#6f777d]">Ownership chain and available title records.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">What sits on the asset?</strong>
                <span className="text-[11px] text-[#6f777d]">Charges, encumbrances, dues and claims.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">Who has possession?</strong>
                <span className="text-[11px] text-[#6f777d]">Physical, symbolic, occupied or disputed status.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">What is the legal risk?</strong>
                <span className="text-[11px] text-[#6f777d]">Litigation, attachments and proceedings.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">What is it worth today?</strong>
                <span className="text-[11px] text-[#6f777d]">Independent valuation and market context.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">What will acquisition cost?</strong>
                <span className="text-[11px] text-[#6f777d]">Stamp duty, registration, taxes &amp; charges.</span>
              </div>
              <div className="about-fact">
                <strong className="text-xs font-bold font-sans text-[#182129]">Can you complete on time?</strong>
                <span className="text-[11px] text-[#6f777d]">EMD, funding and sale-payment readiness.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Diagnostic Scenarios */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">When should you use the Investor Desk?</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>When the Listing Looks Interesting—but the Decision Still Feels Incomplete.</h2>
              <p className="lead-text mt-4">
                The Investor Desk is most useful when the buyer has identified a specific opportunity and needs structured clarity before committing further capital.
              </p>
            </div>
          </div>

          <div className="diagnostic-grid">
            <article className="diag-card">
              <small>Scenario 01</small>
              <h3>First-Time Auction Buyer</h3>
              <p>You understand the asset but not the auction process, notice conditions or EMD/bidding workflow.</p>
            </article>
            <article className="diag-card">
              <small>Scenario 02</small>
              <h3>High-Value Property</h3>
              <p>The reserve price is meaningful enough that title, possession, dues and valuation need deeper review.</p>
            </article>
            <article className="diag-card">
              <small>Scenario 03</small>
              <h3>Industrial / Commercial Asset</h3>
              <p>The transaction involves land, plant, licences, utility connections, operational or technical considerations.</p>
            </article>
            <article className="diag-card">
              <small>Scenario 04</small>
              <h3>Complex Legal Situation</h3>
              <p>There are tenants, litigation, attachments, society issues, leasehold rights, pending dues or other red flags.</p>
            </article>
          </div>

          <div className="quote-block">
            “The objective is not to make an auction asset look safer than it is. The objective is to make the risk easier to understand.”
          </div>
        </div>
      </section>

      {/* 3. Due Diligence Scope */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg" id="scope">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Due diligence universe</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>What CityAuction Investor Desk Can Help You Review.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                The exact scope depends on the asset and engagement. Specialist reviews should be performed through appropriately qualified legal, valuation, technical, tax or lending professionals where required.
              </p>
            </div>
          </div>

          <div className="scope-grid-custom">
            <article className="scope-card">
              <h3>Auction Notice Review</h3>
              <p>Understand the terms before treating the reserve price as the whole opportunity.</p>
              <ul>
                <li>Reserve price</li>
                <li>EMD</li>
                <li>Inspection dates</li>
                <li>Payment timelines</li>
                <li>Possession description</li>
                <li>Special conditions</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Title &amp; Ownership Review</h3>
              <p>Organise available title records and identify matters requiring legal verification.</p>
              <ul>
                <li>Ownership documents</li>
                <li>Conveyance / sale deeds</li>
                <li>Revenue / property records</li>
                <li>Leasehold/freehold position</li>
                <li>Society / association documents</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Encumbrance &amp; Charge Review</h3>
              <p>Identify visible charges, mortgages, liens or other burdens requiring examination.</p>
              <ul>
                <li>Encumbrance records</li>
                <li>CERSAI references</li>
                <li>ROC charge context</li>
                <li>Attachment / charge indicators</li>
                <li>Other disclosed claims</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Possession &amp; Occupancy</h3>
              <p>Understand whether possession status may affect the transaction after successful bidding.</p>
              <ul>
                <li>Physical possession</li>
                <li>Symbolic possession</li>
                <li>Tenant / occupant position</li>
                <li>Access / site status</li>
                <li>Possession-related risk flags</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Litigation &amp; Search Review</h3>
              <p>Coordinate available court/tribunal search and identify matters requiring legal interpretation.</p>
              <ul>
                <li>Known litigation</li>
                <li>Tribunal proceedings</li>
                <li>Attachment / stay indicators</li>
                <li>Disputes disclosed in records</li>
                <li>Material legal red flags</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Dues &amp; Statutory Exposure</h3>
              <p>Check what liabilities may need to be clarified before acquisition.</p>
              <ul>
                <li>Municipal/property tax</li>
                <li>Society dues</li>
                <li>Utility dues</li>
                <li>Industrial authority dues</li>
                <li>Other statutory charges</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Physical Inspection</h3>
              <p>Coordinate inspection where permitted and document material physical observations.</p>
              <ul>
                <li>Condition</li>
                <li>Access</li>
                <li>Usage</li>
                <li>Visible occupancy</li>
                <li>Major defects / deterioration</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Independent Valuation</h3>
              <p>Compare reserve price with an independent view of market indications where appropriate.</p>
              <ul>
                <li>Comparable market data</li>
                <li>Location context</li>
                <li>Condition adjustment</li>
                <li>Income / industrial context</li>
                <li>Valuation professional support</li>
              </ul>
            </article>

            <article className="scope-card">
              <h3>Bidder &amp; Acquisition Readiness</h3>
              <p>Prepare the process side so a sound opportunity is not lost through avoidable execution errors.</p>
              <ul>
                <li>KYC checklist</li>
                <li>Bidder registration</li>
                <li>EMD readiness</li>
                <li>Funding readiness</li>
                <li>Post-auction timeline planning</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Decision Room */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="data-room-box">
            <div className="room-left-panel">
              <div className="eyebrow-text">The diligence file</div>
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.2 }}>Bring the Important Information Into One Decision Room.</h3>
              <p>
                The Investor Desk should organise the documents, observations and open questions into a single buyer-side diligence file rather than leaving the investor to navigate disconnected records.
              </p>
              <div className="quote-block">
                “The purpose of diligence is not more paperwork. It is fewer unanswered questions.”
              </div>
            </div>

            <div className="room-items-grid">
              <div className="room-item-box">
                <strong>Auction Notice &amp; Corrigenda</strong>
                Current notice, addenda and material auction terms.
              </div>
              <div className="room-item-box">
                <strong>Property / Asset Documents</strong>
                Available ownership, schedule and identification records.
              </div>
              <div className="room-item-box">
                <strong>Encumbrance / Charge Material</strong>
                Available EC, CERSAI, ROC or other relevant charge references.
              </div>
              <div className="room-item-box">
                <strong>Possession Material</strong>
                Notice description, inspection observations and available possession records.
              </div>
              <div className="room-item-box">
                <strong>Litigation Search Notes</strong>
                Available search outputs and questions requiring counsel review.
              </div>
              <div className="room-item-box">
                <strong>Dues Checklist</strong>
                Property tax, society, utility, authority and other known dues.
              </div>
              <div className="room-item-box">
                <strong>Inspection Record</strong>
                Photographs, visible condition and key physical observations.
              </div>
              <div className="room-item-box">
                <strong>Valuation / Market Context</strong>
                Independent valuation or market indication material.
              </div>
              <div className="room-item-box">
                <strong>Open Issues Register</strong>
                Questions that remain unanswered before EMD or bidding.
              </div>
              <div className="room-item-box">
                <strong>Bid Readiness Checklist</strong>
                KYC, EMD, funding and completion timeline readiness.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process */}
      <section className="estabizz-section bg-white" id="process">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How the Investor Desk works</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>From Interesting Listing to Informed Decision.</h2>
              <p className="lead-text mt-4">
                The process is designed around decision gates. The buyer can stop, proceed or deepen the review as material information emerges.
              </p>
            </div>
          </div>

          <div className="hiw-journey-grid">
            <article className="hiw-step-card">
              <div className="hiw-step-no">01</div>
              <h3>Share the Opportunity</h3>
              <p>Send the auction link, sale notice or asset details to CityAuction Investor Desk.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">02</div>
              <h3>Scope the Review</h3>
              <p>Identify the asset type, auction stage, key concerns and level of diligence required.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">03</div>
              <h3>Review the Notice</h3>
              <p>Extract dates, EMD, payment conditions, possession wording and material sale terms.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">04</div>
              <h3>Collect the Records</h3>
              <p>Organise available title, charge, dues, litigation, inspection and valuation material.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">05</div>
              <h3>Flag the Gaps</h3>
              <p>Separate what is known, what needs independent verification and what remains unavailable.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">06</div>
              <h3>Coordinate Specialists</h3>
              <p>Where engaged, route legal, valuation, technical or financing work to qualified professionals.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">07</div>
              <h3>Prepare Bid Readiness</h3>
              <p>Organise KYC, EMD, bidder-registration and funding requirements before deadlines.</p>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">08</div>
              <h3>Decide with Clarity</h3>
              <p>The buyer makes the final decision after considering facts, unresolved risks and commercial context.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 6. Red Flags */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Red flags worth respecting</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>A Low Reserve Price Does Not Neutralise a Difficult Asset.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                Some issues may be manageable. Others can materially change value, timeline, funding or the buyer&apos;s ability to take possession.
              </p>
            </div>
          </div>

          <div className="scope-grid-custom">
            <article className="scope-card">
              <h3>Symbolic Possession</h3>
              <p>The secured creditor may not have delivered physical possession. The practical path after purchase needs separate understanding.</p>
            </article>
            <article className="scope-card">
              <h3>Occupants / Tenants</h3>
              <p>Actual occupancy, tenancy rights or possession disputes can materially affect execution.</p>
            </article>
            <article className="scope-card">
              <h3>Unclear Title Trail</h3>
              <p>Missing, inconsistent or incomplete title documents require legal review rather than assumption.</p>
            </article>
            <article className="scope-card">
              <h3>Multiple Charges / Claims</h3>
              <p>Other lenders, authorities, associations or claimants may need to be examined depending on the asset and sale process.</p>
            </article>
            <article className="scope-card">
              <h3>Material Dues</h3>
              <p>Municipal, society, electricity, authority or other dues can change the economic outcome.</p>
            </article>
            <article className="scope-card">
              <h3>Litigation / Attachments</h3>
              <p>Pending proceedings, stays, attachments or competing claims may affect timing, transfer or possession.</p>
            </article>
            <article className="scope-card">
              <h3>Physical Deterioration</h3>
              <p>The asset&apos;s present condition may differ significantly from photographs or assumptions.</p>
            </article>
            <article className="scope-card">
              <h3>Financing Constraints</h3>
              <p>Auction timelines can be shorter than conventional financing cycles. Funding must be planned before bidding.</p>
            </article>
            <article className="scope-card">
              <h3>Notice-Specific Conditions</h3>
              <p>EMD, payment, inspection, forfeiture and sale-certificate terms differ. The specific sale notice governs.</p>
            </article>
          </div>

          <div className="quote-block">
            “The best due diligence outcome is not always &lsquo;proceed&rsquo;. Sometimes clarity is valuable because it tells you not to.”
          </div>
        </div>
      </section>

      {/* 7. Packages */}
      <section className="estabizz-section bg-[#f6f2ea]" id="packages">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Choose the level of support</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Start with the Question You Need Answered.</h2>
              <p className="lead-text mt-4">
                Final scope, fee and responsible professional should be agreed before work begins. The structures below are service architecture, not fixed pricing.
              </p>
            </div>
          </div>

          <div className="packages-grid">
            <article className="package-card">
              <div>
                <small>Level 01</small>
                <h3>Auction Readiness Review</h3>
                <p>For buyers who mainly need help understanding the auction process and notice before EMD.</p>
                <ul>
                  <li>Auction notice interpretation</li>
                  <li>Timeline &amp; EMD checklist</li>
                  <li>Possession wording review</li>
                  <li>Bidder-document checklist</li>
                  <li>Open-question list</li>
                </ul>
              </div>
              <div className="actions-row mt-6">
                <a className="btn-pill btn-light w-full text-center" href="#desk">
                  Request Scope
                </a>
              </div>
            </article>

            <article className="package-card featured">
              <div>
                <small>Level 02 · Most Comprehensive</small>
                <h3>Pre-Bid Due Diligence</h3>
                <p>For buyers seeking a structured view of legal, possession, dues, physical and valuation considerations.</p>
                <ul>
                  <li>Everything in Auction Readiness</li>
                  <li>Title/ownership coordination</li>
                  <li>Encumbrance/charge review support</li>
                  <li>Dues &amp; litigation checklist</li>
                  <li>Inspection coordination</li>
                  <li>Independent valuation coordination</li>
                  <li>Risk &amp; open-issues register</li>
                </ul>
              </div>
              <div className="actions-row mt-6">
                <a className="btn-pill btn-dark w-full text-center" href="#desk">
                  Discuss Due Diligence
                </a>
              </div>
            </article>

            <article className="package-card">
              <div>
                <small>Level 03</small>
                <h3>Acquisition Support</h3>
                <p>For investors who need process support beyond diligence through bidder preparation and post-auction coordination.</p>
                <ul>
                  <li>Pre-bid diligence coordination</li>
                  <li>Bidder/KYC readiness</li>
                  <li>EMD process support</li>
                  <li>Funding facilitation where available</li>
                  <li>Post-auction documentation support</li>
                  <li>Registration / possession coordination</li>
                </ul>
              </div>
              <div className="actions-row mt-6">
                <a className="btn-pill btn-light w-full text-center" href="#desk">
                  Discuss Acquisition Support
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 8. Desk Form Section */}
      <section className="estabizz-section bg-white" id="desk">
        <div className="estabizz-container">
          <div className="contact-wrap-box">
            <div className="contact-info-panel">
              <div className="eyebrow-text">CityAuction Investor Desk</div>
              <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Already Found an Asset?
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-3 leading-relaxed">
                Share the auction opportunity before you commit EMD. We will help identify the diligence questions, documents and specialist support that may be relevant.
              </p>

              <div className="contact-items-list mt-6 space-y-3">
                <div className="contact-item-row">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Phone</small>
                  <strong className="block text-white mt-1">
                    <a href="tel:+919825669668" className="hover:underline">+91 98256 69668</a>
                  </strong>
                </div>
                <div className="contact-item-row">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Email</small>
                  <strong className="block text-white mt-1">
                    <a href="mailto:info@estabizz.com" className="hover:underline">info@estabizz.com</a>
                  </strong>
                </div>
                <div className="contact-item-row">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Office</small>
                  <strong className="block text-white mt-1 font-normal text-sm">
                    Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India
                  </strong>
                </div>
                <div className="contact-item-row">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">What to Share</small>
                  <strong className="block text-white mt-1 font-normal text-sm">
                    Auction Link · Sale Notice · Asset Location · Auction Date · Your Main Concern
                  </strong>
                </div>
              </div>

              <div className="actions-row mt-6">
                <a className="btn-pill btn-gold" href="tel:+919825669668">
                  Call Investor Desk
                </a>
                <a
                  className="btn-pill btn-ghost"
                  href="https://wa.me/919825669668"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-form-panel">
              <InvestorDeskForm />
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Investor Desk FAQs</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>What Buyers Usually Ask Before Engaging.</h2>
            </div>
          </div>

          <div className="faq-accordion space-y-1">
            <details>
              <summary>Does CityAuction certify that an auction property has clear title?</summary>
              <p>No. CityAuction should not represent a listing or a diligence review as an automatic title guarantee. Title review, legal opinion and certification must be undertaken within the agreed scope by appropriately qualified legal professionals.</p>
            </details>
            <details>
              <summary>Does “Verified Auction Information” mean the asset is legally safe?</summary>
              <p>No. Verified Auction Information means key auction particulars have been cross-checked against an institution-provided or published auction notice. It does not independently certify title, possession, encumbrances, litigation, dues, physical condition or market value.</p>
            </details>
            <details>
              <summary>Can CityAuction help before I pay EMD?</summary>
              <p>Yes. The Investor Desk is specifically designed to help buyers review the notice, identify available documents, organise questions and coordinate optional diligence before the EMD deadline where time permits.</p>
            </details>
            <details>
              <summary>Can you arrange legal due diligence?</summary>
              <p>CityAuction can coordinate legal due diligence through appropriately qualified legal professionals where separately engaged. The scope, responsibility and opinion should be clearly documented in the professional engagement.</p>
            </details>
            <details>
              <summary>Can you arrange valuation and physical inspection?</summary>
              <p>Yes, where available and permitted. Valuation should be performed through appropriately qualified professionals, and physical inspection remains subject to the auctioning institution&apos;s inspection process and access conditions.</p>
            </details>
            <details>
              <summary>Can CityAuction tell me the maximum amount I should bid?</summary>
              <p>CityAuction can help organise relevant facts, costs, valuation context and risk considerations. The final investment decision and bid amount must remain the buyer&apos;s own decision.</p>
            </details>
            <details>
              <summary>Can CityAuction help with loan or funding?</summary>
              <p>CityAuction may facilitate introductions to lenders or financing sources where available, but funding remains subject to lender eligibility, credit appraisal, collateral acceptance, timing and other applicable conditions.</p>
            </details>
            <details>
              <summary>What if the diligence finds a serious issue?</summary>
              <p>The purpose of diligence is to surface material information before commitment. Depending on the issue, the buyer may seek clarification, deepen the review, change commercial assumptions or decide not to participate.</p>
            </details>
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="about-cta-panel">
            <div>
              <div className="eyebrow-text">Before the EMD</div>
              <h2 className="font-serif-heading text-[#182129] mt-2.5" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Understand the Asset Before the Clock Starts Working Against You.</h2>
              <p>
                If an auction opportunity has caught your attention, share it with CityAuction Investor Desk and identify the questions worth answering before you commit.
              </p>
            </div>
            <div className="actions-row mt-0">
              <a href="#desk" className="btn-pill btn-gold">
                Request Due Diligence Support
              </a>
              <Link href="/auctions" className="btn-pill btn-ghost">
                Explore Auctions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
