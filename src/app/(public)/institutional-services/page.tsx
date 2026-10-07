import Link from "next/link";
import type { Metadata } from "next";
import { InstitutionalMandateForm } from "@/components/forms/institutional-mandate-form";

export const metadata: Metadata = {
  title: "Institutional Services | CityAuction",
  description:
    "CityAuction Institutional Services helps Banks, NBFCs, ARCs, Liquidators and Financial Institutions improve asset presentation, investor discovery, bidder engagement, data-room access, inspection coordination and auction MIS.",
  alternates: {
    canonical: "/institutional-services",
  },
  openGraph: {
    type: "website",
    title: "Institutional Services | Reach the Right Buyer Market",
    description:
      "Structured buyer discovery and transaction-support workflows for institutional asset sales.",
    url: "/institutional-services",
    siteName: "CityAuction",
  },
};

export default function InstitutionalServicesPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero */}
      <section className="careers-hero">
        <div className="estabizz-container careers-hero-row">
          <div>
            <div className="eyebrow-text">Institutional Services</div>
            <h1 className="text-4xl sm:text-6xl font-serif-heading font-semibold text-white tracking-tight mt-3">
              Publication Is a Step.<br />
              <em className="text-[#dbc39a] not-italic">Buyer Discovery Is the Strategy.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              CityAuction helps Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals and Financial Institutions improve how assets are presented, distributed and taken to the buyer market around the authorised auction process.
            </p>

            <div className="quote-block">
              “The objective is not more visibility. It is relevant visibility—to people capable of acquiring the asset.”
            </div>

            <div className="actions-row">
              <a className="btn-pill btn-gold" href="#institutional-desk">
                Discuss an Institutional Mandate
              </a>
              <a className="btn-pill btn-ghost" href="#services">
                See Institutional Services
              </a>
            </div>
          </div>

          <aside className="about-hero-card">
            <div className="eyebrow-text">Who we support</div>
            <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
              Institutional Asset Sales Need More Than a Listing.
            </h3>
            <p className="text-sm text-[#6f777d] mt-1">
              CityAuction supports the market-facing layer while the competent institution or authorised auction platform retains the statutory sale functions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Banks</strong>
                <span className="text-xs text-[#6f777d]">NPA / secured asset distribution.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">NBFCs</strong>
                <span className="text-xs text-[#6f777d]">Recovery-linked asset sales.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">ARCs</strong>
                <span className="text-xs text-[#6f777d]">Resolution and recovery assets.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Liquidators / IPs</strong>
                <span className="text-xs text-[#6f777d]">IBC and liquidation sale support.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Financial Institutions</strong>
                <span className="text-xs text-[#6f777d]">Institutional asset monetisation.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Corporates</strong>
                <span className="text-xs text-[#6f777d]">Surplus or non-core asset sale support.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Institutional Services */}
      <section className="estabizz-section bg-white" id="services">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Institutional services</div>
            </div>
            <div>
              <h2>Everything Around the Auction That Helps the Market Work Better.</h2>
              <p className="lead-text mt-4">
                CityAuction focuses on the buyer-discovery, information and engagement layer around the authorised sale process.
              </p>
            </div>
          </div>

          <div className="careers-roles-grid">
            <article className="careers-role-card">
              <h3>Asset Onboarding</h3>
              <p>Structure asset particulars, documents, photographs, timelines and sale information into a consistent digital profile.</p>
            </article>
            <article className="careers-role-card">
              <h3>Asset Positioning</h3>
              <p>Translate technical information into a buyer-friendly opportunity presentation without diluting legal disclosures.</p>
            </article>
            <article className="careers-role-card">
              <h3>Investor Discovery</h3>
              <p>Reach relevant buyers, developers, HNIs, strategic acquirers and businesses by asset type and geography.</p>
            </article>
            <article className="careers-role-card">
              <h3>Lead &amp; Enquiry Management</h3>
              <p>Capture interest, qualification status, information requests, site visits and bidder intent.</p>
            </article>
            <article className="careers-role-card">
              <h3>Data Room Support</h3>
              <p>Organise seller-approved documents and controlled access for qualified prospects.</p>
            </article>
            <article className="careers-role-card">
              <h3>Inspection Coordination</h3>
              <p>Support permitted site-visit scheduling, buyer communication and inspection tracking.</p>
            </article>
            <article className="careers-role-card">
              <h3>Bidder Readiness</h3>
              <p>Help prospects understand KYC, EMD, registration and other process requirements stated in the sale notice.</p>
            </article>
            <article className="careers-role-card">
              <h3>Auction Connectivity</h3>
              <p>Connect eligible buyers to the Bank, ARC, Liquidator, Recovery Officer or appointed auction platform.</p>
            </article>
            <article className="careers-role-card">
              <h3>Institutional MIS</h3>
              <p>Provide agreed reporting on reach, enquiries, qualified buyers, inspections and the participation funnel.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How it works</div>
            </div>
            <div>
              <h2 className="text-white">From Asset Onboarding to Buyer Conversion.</h2>
            </div>
          </div>

          <div className="hiw-journey-grid">
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">01</div>
              <h3 className="text-white">Onboard</h3>
              <p className="text-[#adb7be]">Receive asset, sale, legal-route and timeline information.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">02</div>
              <h3 className="text-white">Position</h3>
              <p className="text-[#adb7be]">Prepare the asset for clearer investor-facing presentation.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">03</div>
              <h3 className="text-white">Distribute</h3>
              <p className="text-[#adb7be]">Take the opportunity to the relevant buyer universe.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">04</div>
              <h3 className="text-white">Engage</h3>
              <p className="text-[#adb7be]">Capture enquiries, data-room interest and inspection requests.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">05</div>
              <h3 className="text-white">Qualify</h3>
              <p className="text-[#adb7be]">Separate general interest from buyers preparing to participate.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">06</div>
              <h3 className="text-white">Connect</h3>
              <p className="text-[#adb7be]">Route eligible buyers into the authorised auction process.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">07</div>
              <h3 className="text-white">Coordinate</h3>
              <p className="text-[#adb7be]">Support agreed communication and post-auction workflows.</p>
            </article>
            <article className="hiw-step-card bg-transparent border-white/10 text-white">
              <div className="hiw-step-no text-[#d2b78c]">08</div>
              <h3 className="text-white">Report</h3>
              <p className="text-[#adb7be]">Provide institutional MIS on market reach and buyer funnel activity.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Institutional Dashboard */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container marketing-grid">
          <div>
            <div className="eyebrow-text">Institutional visibility</div>
            <h2 className="mt-2.5">Know What Happens After the Notice Goes Live.</h2>
            <p className="text-sm text-[#6f777d] mt-3 leading-relaxed">
              A meaningful institutional workflow should show the activity between publication and auction—not merely host an asset page.
            </p>
            <div className="actions-row mt-6">
              <Link className="btn-pill btn-dark" href="/liquidate-an-asset">
                Liquidate an Asset
              </Link>
            </div>
          </div>

          <div className="channels-grid">
            <div className="channel-box">
              <strong>Market Reach</strong><br />
              Listing views, alert distribution and campaign reach.
            </div>
            <div className="channel-box">
              <strong>Lead Funnel</strong><br />
              Enquiries, qualified prospects and buyer stage.
            </div>
            <div className="channel-box">
              <strong>Data Room</strong><br />
              Document-access interest and controlled buyer engagement.
            </div>
            <div className="channel-box">
              <strong>Inspection</strong><br />
              Site-visit requests and inspection status.
            </div>
            <div className="channel-box">
              <strong>Bid Readiness</strong><br />
              Prospects moving toward KYC, EMD and registration.
            </div>
            <div className="channel-box">
              <strong>Outcome Reporting</strong><br />
              Agreed post-auction activity and closure status.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Institutional Desk */}
      <section className="estabizz-section bg-white" id="institutional-desk">
        <div className="estabizz-container">
          <div className="contact-wrap-box">
            <div className="contact-info-panel">
              <div className="eyebrow-text">Institutional Desk</div>
              <h2 className="text-3xl font-serif-heading font-semibold text-white mt-2">
                Have an Asset or Portfolio That Needs the Right Market?
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-3 leading-relaxed">
                Share the asset class, location, sale stage and institutional objective. CityAuction can structure the buyer-discovery and engagement layer around the authorised process.
              </p>

              <div className="actions-row mt-6">
                <a className="btn-pill btn-gold" href="tel:+919825669668">
                  Call +91 98256 69668
                </a>
                <a
                  className="btn-pill btn-ghost"
                  href="mailto:info@estabizz.com?subject=CityAuction%20Institutional%20Services"
                >
                  Email Institutional Desk
                </a>
              </div>
            </div>

            <div className="contact-form-panel">
              <InstitutionalMandateForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
