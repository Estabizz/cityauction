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
      <section className="hero" id="create-alert">
        <div className="container hero-row">
          <div>
            <div className="eyebrow !text-[#d9c39c]">Personalised Auction Alerts</div>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
              Define the Opportunity Once.<br />
              <em className="text-[#dbc39a] not-italic font-normal">Let CityAuction Keep Looking.</em>
            </h1>

            <p className="hero-copy">
              Tell us the location, asset type, budget and auction category that matter to you. CityAuction Alerts is designed to surface relevant opportunities through supported alert channels when matching inventory is identified.
            </p>

            <div className="quote">
              Spend your time evaluating opportunities—not repeatedly searching for them.
            </div>

            <div className="actions">
              <a className="btn btn-gold" href="#alert-form">
                Create My Alert
              </a>
              <Link className="btn btn-light" href="/auctions">
                Explore Auctions
              </Link>
            </div>
          </div>

          <div>
            <AuctionAlertsForm />
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">How it works</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                Simple by Design.
              </h2>
              <p className="lead mt-3">
                CityAuction Alerts should make opportunity discovery easier without flooding users with irrelevant notifications.
              </p>
            </div>
          </div>

          <div className="alert-steps-grid">
            <article className="alert-step">
              <small>01</small>
              <h3>Tell Us Your Mandate</h3>
              <p>Choose the location, asset class, budget and opportunity type that matter to you.</p>
            </article>

            <article className="alert-step">
              <small>02</small>
              <h3>CityAuction Matches Opportunities</h3>
              <p>Relevant opportunities can be matched against supported inventory and alert logic.</p>
            </article>

            <article className="alert-step">
              <small>03</small>
              <h3>You Decide What Deserves Attention</h3>
              <p>Open the opportunity, review the notice and proceed only after your own evaluation and diligence.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Trust & Perspective Section */}
      <section className="section bg-[#091118] text-[#edf2f5]">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <div className="eyebrow !text-[#d9c39c]">Your alert, your decision</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-white mt-3 leading-tight">
              Relevant Discovery. No Promise of Suitability.
            </h2>
            <p className="text-sm text-[#aeb9c1] mt-3 leading-relaxed">
              An alert means an opportunity matches the preferences you provided. It does not mean CityAuction has certified title, possession, market value, legal safety or investment suitability. The relevant auction notice and independent due diligence still matter.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap flex-shrink-0">
            <a className="btn btn-gold" href="#alert-form">
              Create Alert
            </a>
            <Link className="btn btn-ghost" href="/investor-desk">
              Investor Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
