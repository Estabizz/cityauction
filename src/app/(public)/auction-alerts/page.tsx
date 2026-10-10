import Link from "next/link";
import type { Metadata } from "next";
import { AuctionAlertsForm } from "@/components/forms/auction-alerts-form";

export const metadata: Metadata = {
  title: "Personalised Auction Alerts | CityAuction",
  description:
    "Create personalised CityAuction alerts for auction properties, institutional assets, Customs lots and strategic opportunities based on your location, category and budget preferences.",
  alternates: {
    canonical: "/auction-alerts",
  },
  openGraph: {
    type: "website",
    title: "Personalised Auction Alerts | Define the Opportunity Once",
    description:
      "Tell CityAuction what you are looking for and receive relevant auction opportunities through supported alert channels.",
    url: "/auction-alerts",
    siteName: "CityAuction",
  },
};

export default function AuctionAlertsPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero Section with Alert Form */}
      <section className="about-hero" id="create-alert">
        <div className="estabizz-container about-hero-row">
          <div>
            <div className="eyebrow-text !text-[#d9c39c]">Personalised Auction Alerts</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Define the Opportunity Once.<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Let CityAuction Keep Looking.</em>
            </h1>

            <p className="about-hero-copy">
              Tell us the location, asset type, budget and auction category that matter to you. CityAuction Alerts is designed to surface relevant opportunities through supported alert channels when matching inventory is identified.
            </p>

            <div className="quote-block mt-6 text-[#d9c39c]">
              “Spend your time evaluating opportunities—not repeatedly searching for them.”
            </div>

            <div className="actions-row mt-6">
              <a className="btn-pill btn-gold" href="#alert-form">
                Create My Alert
              </a>
              <Link className="btn-pill btn-ghost" href="/auctions">
                Explore Auctions
              </Link>
            </div>
          </div>

          <aside className="about-hero-card">
            <AuctionAlertsForm />
          </aside>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How it works</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Simple by Design.
              </h2>
              <p className="lead-text mt-4 text-[#59636a]">
                CityAuction Alerts should make opportunity discovery easier without flooding users with irrelevant notifications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <article className="p-8 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <small className="text-[#b49361] font-bold tracking-wider text-xs uppercase">01</small>
              <h3 className="font-serif-heading mt-4 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>Tell Us Your Mandate</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Choose the location, asset class, budget and opportunity type that matter to you.</p>
            </article>

            <article className="p-8 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <small className="text-[#b49361] font-bold tracking-wider text-xs uppercase">02</small>
              <h3 className="font-serif-heading mt-4 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>CityAuction Matches Opportunities</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Relevant opportunities can be matched against supported inventory and alert logic.</p>
            </article>

            <article className="p-8 border border-[#e6dfd4] rounded-2xl bg-[#fbf9f5] shadow-sm">
              <small className="text-[#b49361] font-bold tracking-wider text-xs uppercase">03</small>
              <h3 className="font-serif-heading mt-4 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>You Decide What Deserves Attention</h3>
              <p className="mt-3 text-[#59636a] text-sm leading-relaxed">Open the opportunity, review the notice and proceed only after your own evaluation and diligence.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Trust & Perspective Section */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text !text-[#d9c39c]">Your alert, your decision</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Relevant Discovery. No Promise of Suitability.
              </h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                An alert means an opportunity matches the preferences you provided. It does not mean CityAuction has certified title, possession, market value, legal safety or investment suitability. The relevant auction notice and independent due diligence still matter.
              </p>
            </div>
          </div>
          <div className="actions-row mt-8">
            <a className="btn-pill btn-gold" href="#alert-form">
              Create Alert
            </a>
            <Link className="btn-pill btn-ghost" href="/investor-desk">
              Investor Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
