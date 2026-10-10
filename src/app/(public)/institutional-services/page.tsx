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
      <section className="nc-hero">
        <div className="estabizz-container nc-hero-row">
          <div>
            <div className="eyebrow-text !text-[#d9c39c]">Institutional Services</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Publication Is a Step.<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Buyer Discovery Is the Strategy.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
              CityAuction helps Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals and Financial Institutions improve how assets are presented, distributed and taken to the buyer market around the authorised auction process.
            </p>

            <div className="quote-block mt-8 text-[#d9c39c]">
              “The objective is not more visibility. It is relevant visibility—to people capable of acquiring the asset.”
            </div>

            <div className="actions-row mt-8">
              <a className="btn-pill btn-gold" href="#institutional-desk">
                Discuss an Institutional Mandate
              </a>
              <a className="btn-pill btn-ghost border-white/20 hover:border-white text-white" href="#services">
                See Institutional Services
              </a>
            </div>
          </div>

          <aside className="nc-hero-card text-[#182129]">
            <div className="eyebrow-text">Who we support</div>
            <h3 className="font-serif-heading font-semibold text-[#182129] mt-3" style={{ fontSize: "1.75rem", lineHeight: 1.2 }}>
              Institutional Asset Sales Need More Than a Listing.
            </h3>
            <p className="text-sm text-[#6f777d] mt-2 leading-relaxed">
              CityAuction supports the market-facing layer while the competent institution or authorised auction platform retains the statutory sale functions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">Banks</strong>
                <span className="block text-xs text-[#59636a] leading-tight">NPA / secured asset distribution.</span>
              </div>
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">NBFCs</strong>
                <span className="block text-xs text-[#59636a] leading-tight">Recovery-linked asset sales.</span>
              </div>
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">ARCs</strong>
                <span className="block text-xs text-[#59636a] leading-tight">Resolution and recovery assets.</span>
              </div>
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">Liquidators / IPs</strong>
                <span className="block text-xs text-[#59636a] leading-tight">IBC and liquidation sale support.</span>
              </div>
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">Financial Institutions</strong>
                <span className="block text-xs text-[#59636a] leading-tight">Institutional asset monetisation.</span>
              </div>
              <div className="p-3 border border-[#e6dfd4] rounded-xl bg-[#fbf9f5]">
                <strong className="block text-sm font-bold text-[#182129] mb-1">Corporates</strong>
                <span className="block text-xs text-[#59636a] leading-tight">Surplus or non-core asset sale support.</span>
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
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Everything Around the Auction That Helps the Market Work Better.
              </h2>
              <p className="lead-text mt-4 text-[#59636a]">
                CityAuction focuses on the buyer-discovery, information and engagement layer around the authorised sale process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Asset Onboarding</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Structure asset particulars, documents, photographs, timelines and sale information into a consistent digital profile.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Asset Positioning</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Translate technical information into a buyer-friendly opportunity presentation without diluting legal disclosures.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Investor Discovery</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Reach relevant buyers, developers, HNIs, strategic acquirers and businesses by asset type and geography.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Lead &amp; Enquiry Management</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Capture interest, qualification status, information requests, site visits and bidder intent.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Data Room Support</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Organise seller-approved documents and controlled access for qualified prospects.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Inspection Coordination</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Support permitted site-visit scheduling, buyer communication and inspection tracking.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Bidder Readiness</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Help prospects understand KYC, EMD, registration and other process requirements stated in the sale notice.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Auction Connectivity</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Connect eligible buyers to the Bank, ARC, Liquidator, Recovery Officer or appointed auction platform.</p>
            </article>
            <article className="p-6 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <h3 className="font-serif-heading text-[#182129]" style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>Institutional MIS</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Provide agreed reporting on reach, enquiries, qualified buyers, inspections and the participation funnel.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text !text-[#d9c39c]">How it works</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                From Asset Onboarding to Buyer Conversion.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">01</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Onboard</h3>
              <p className="text-[#adb7be] text-sm">Receive asset, sale, legal-route and timeline information.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">02</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Position</h3>
              <p className="text-[#adb7be] text-sm">Prepare the asset for clearer investor-facing presentation.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">03</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Distribute</h3>
              <p className="text-[#adb7be] text-sm">Take the opportunity to the relevant buyer universe.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">04</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Engage</h3>
              <p className="text-[#adb7be] text-sm">Capture enquiries, data-room interest and inspection requests.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">05</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Qualify</h3>
              <p className="text-[#adb7be] text-sm">Separate general interest from buyers preparing to participate.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">06</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Connect</h3>
              <p className="text-[#adb7be] text-sm">Route eligible buyers into the authorised auction process.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">07</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Coordinate</h3>
              <p className="text-[#adb7be] text-sm">Support agreed communication and post-auction workflows.</p>
            </article>
            <article className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-[#d2b78c] font-bold text-xs tracking-wider mb-3">08</div>
              <h3 className="font-serif-heading text-white text-xl font-semibold mb-2">Report</h3>
              <p className="text-[#adb7be] text-sm">Provide institutional MIS on market reach and buyer funnel activity.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Institutional Dashboard */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="eyebrow-text">Institutional visibility</div>
            <h2 className="font-serif-heading text-[#182129] mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
              Know What Happens After the Notice Goes Live.
            </h2>
            <p className="text-[#59636a] mt-4 leading-relaxed">
              A meaningful institutional workflow should show the activity between publication and auction—not merely host an asset page.
            </p>
            <div className="actions-row mt-8">
              <Link className="btn-pill btn-dark" href="/liquidate-an-asset">
                Liquidate an Asset
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Market Reach</strong>
              <span className="text-sm text-[#59636a]">Listing views, alert distribution and campaign reach.</span>
            </div>
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Lead Funnel</strong>
              <span className="text-sm text-[#59636a]">Enquiries, qualified prospects and buyer stage.</span>
            </div>
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Data Room</strong>
              <span className="text-sm text-[#59636a]">Document-access interest and controlled buyer engagement.</span>
            </div>
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Inspection</strong>
              <span className="text-sm text-[#59636a]">Site-visit requests and inspection status.</span>
            </div>
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Bid Readiness</strong>
              <span className="text-sm text-[#59636a]">Prospects moving toward KYC, EMD and registration.</span>
            </div>
            <div className="p-5 border border-[#e6dfd4] rounded-xl bg-white shadow-sm">
              <strong className="block text-[#182129] mb-1">Outcome Reporting</strong>
              <span className="text-sm text-[#59636a]">Agreed post-auction activity and closure status.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Institutional Desk */}
      <section className="estabizz-section bg-[#f6f2ea]" id="institutional-desk">
        <div className="estabizz-container">
          <div className="nc-cta" style={{ background: "radial-gradient(circle at 78% 15%,rgba(180,147,97,.16),transparent 24%), linear-gradient(145deg,#0f1921,#152833)" }}>
            <div className="max-w-xl text-white">
              <div className="eyebrow-text !text-[#d9c39c]">Institutional Desk</div>
              <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Have an Asset or Portfolio That Needs the Right Market?
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-4 leading-relaxed">
                Share the asset class, location, sale stage and institutional objective. CityAuction can structure the buyer-discovery and engagement layer around the authorised process.
              </p>
              
              <div className="actions-row mt-8">
                <a className="btn-pill btn-gold" href="tel:+919825669668">
                  Call +91 98256 69668
                </a>
                <a
                  className="btn-pill btn-ghost border-white/20 hover:border-white text-white"
                  href="mailto:info@estabizz.com?subject=CityAuction%20Institutional%20Services"
                >
                  Email Institutional Desk
                </a>
              </div>
            </div>

            <div>
              <InstitutionalMandateForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
