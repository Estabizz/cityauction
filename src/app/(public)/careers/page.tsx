import Link from "next/link";
import type { Metadata } from "next";
import { CareerForm } from "@/components/forms/career-form";

export const metadata: Metadata = {
  title: "Careers | CityAuction",
  description:
    "Explore career opportunities at CityAuction, a venture of Estabizz Fintech Private Limited. Join a team working across auction intelligence, institutional assets, investor support, technology and transaction operations.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    type: "website",
    title: "Careers | CityAuction",
    description:
      "Build at the intersection of institutional assets, investor discovery, technology and transaction operations.",
    url: "/careers",
    siteName: "CityAuction",
  },
};

export default function CareersPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero */}
      <section className="nc-hero">
        <div className="estabizz-container nc-hero-row">
          <div>
            <div className="eyebrow-text !text-[#d9c39c]">Careers at CityAuction</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Build the Market<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Behind the Opportunity.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              CityAuction is building a new way to discover, understand, distribute and transact institutional assets. We are looking for people who combine curiosity, discipline, commercial judgement and respect for process.
            </p>

            <div className="quote-block mt-6 text-[#d9c39c]">
              “We are not building another listing portal. We are building the operating layer around auction and asset opportunity.”
            </div>

            <div className="actions-row mt-6">
              <a className="btn-pill btn-gold" href="#open-roles">
                Explore Career Tracks
              </a>
              <a className="btn-pill btn-ghost" href="#apply">
                Send Your Profile
              </a>
            </div>
          </div>

          <aside className="nc-hero-card text-[#182129]">
            <div className="eyebrow-text">Who fits here</div>
            <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>
              People Who Think Beyond the Listing.
            </h3>
            <p className="text-sm text-[#6f777d] mt-2">
              We value clarity, ownership and execution over titles alone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6">
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129] block">Commercial Thinkers</strong>
                <span className="text-xs text-[#6f777d]">Understand buyers, assets and market behaviour.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129] block">Execution People</strong>
                <span className="text-xs text-[#6f777d]">Follow through on details, timelines and outcomes.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129] block">Problem Solvers</strong>
                <span className="text-xs text-[#6f777d]">Work comfortably across incomplete and complex situations.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129] block">Process Builders</strong>
                <span className="text-xs text-[#6f777d]">Turn knowledge into repeatable systems and technology.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Career Tracks */}
      <section className="estabizz-section bg-white" id="open-roles">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Career tracks</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Where You Could Build With Us.</h2>
              <p className="lead-text mt-4">
                Openings can change over time. Even where a specific position is not currently advertised, strong profiles may be considered for future requirements.
              </p>
            </div>
          </div>

          <div className="core-grid mt-10">
            <article className="core">
              <small>Business</small>
              <h3>Institutional Relationships</h3>
              <p>Work with Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals and institutional asset owners.</p>
            </article>
            <article className="core">
              <small>Marketplace</small>
              <h3>Buyer &amp; Investor Desk</h3>
              <p>Understand investor mandates, auction assets, buyer questions and transaction-support workflows.</p>
            </article>
            <article className="core">
              <small>Operations</small>
              <h3>Auction Operations</h3>
              <p>Manage auction information, documentation, alerts, deadlines, enquiry tracking and bidder-support processes.</p>
            </article>
            <article className="core">
              <small>Research</small>
              <h3>Asset &amp; Auction Intelligence</h3>
              <p>Research asset opportunities, institutional notices, market information and transaction context.</p>
            </article>
            <article className="core">
              <small>Technology</small>
              <h3>Product &amp; Engineering</h3>
              <p>Build marketplace, search, alerts, CRM, automation, data-room and AI-assisted workflow capabilities.</p>
            </article>
            <article className="core">
              <small>Growth</small>
              <h3>Content &amp; Market Development</h3>
              <p>Translate complex auction and asset opportunities into clear, high-quality investor communication.</p>
            </article>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text !text-[#d9c39c]">How we work</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Judgement Matters. So Does Discipline.</h2>
            </div>
          </div>

          <div className="core-grid mt-10">
            <article className="core" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-white">Ownership</h3>
              <p className="text-[#aeb9c1]">Take responsibility for the outcome, not only the assigned task.</p>
            </article>
            <article className="core" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-white">Clarity</h3>
              <p className="text-[#aeb9c1]">Complex transactions still need simple, precise communication.</p>
            </article>
            <article className="core" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-white">Integrity</h3>
              <p className="text-[#aeb9c1]">Do not overstate an opportunity, a fact or what we can deliver.</p>
            </article>
            <article className="core" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="text-white">Learning</h3>
              <p className="text-[#aeb9c1]">Markets, regulation and technology change. Curiosity is part of the role.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="estabizz-section bg-[#f6f2ea]" id="apply">
        <div className="estabizz-container">
          <div className="nc-cta" style={{ background: "radial-gradient(circle at 78% 15%,rgba(180,147,97,.16),transparent 24%), linear-gradient(145deg,#0f1921,#152833)" }}>
            <div className="max-w-xl">
              <div className="eyebrow-text !text-[#d9c39c]">Join CityAuction</div>
              <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Think You Can Add Value?
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-4 leading-relaxed">
                Tell us where you fit best and what you have built, sold, researched, managed or improved before. We are more interested in evidence of ownership than a long introduction.
              </p>
            </div>

            <div>
              <CareerForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
