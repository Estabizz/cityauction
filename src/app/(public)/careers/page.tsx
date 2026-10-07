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
      <section className="careers-hero">
        <div className="estabizz-container careers-hero-row">
          <div>
            <div className="eyebrow-text">Careers at CityAuction</div>
            <h1 className="text-4xl sm:text-6xl font-serif-heading font-semibold text-white tracking-tight mt-3">
              Build the Market<br />
              <em className="text-[#dbc39a] not-italic">Behind the Opportunity.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              CityAuction is building a new way to discover, understand, distribute and transact institutional assets. We are looking for people who combine curiosity, discipline, commercial judgement and respect for process.
            </p>

            <div className="quote-block">
              “We are not building another listing portal. We are building the operating layer around auction and asset opportunity.”
            </div>

            <div className="actions-row">
              <a className="btn-pill btn-gold" href="#open-roles">
                Explore Career Tracks
              </a>
              <a className="btn-pill btn-ghost" href="#apply">
                Send Your Profile
              </a>
            </div>
          </div>

          <aside className="about-hero-card">
            <div className="eyebrow-text">Who fits here</div>
            <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
              People Who Think Beyond the Listing.
            </h3>
            <p className="text-sm text-[#6f777d] mt-2">
              We value clarity, ownership and execution over titles alone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Commercial Thinkers</strong>
                <span className="text-xs text-[#6f777d]">Understand buyers, assets and market behaviour.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Execution People</strong>
                <span className="text-xs text-[#6f777d]">Follow through on details, timelines and outcomes.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Problem Solvers</strong>
                <span className="text-xs text-[#6f777d]">Work comfortably across incomplete and complex situations.</span>
              </div>
              <div className="about-fact">
                <strong className="text-sm font-bold font-sans text-[#182129]">Process Builders</strong>
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
              <h2>Where You Could Build With Us.</h2>
              <p className="lead-text mt-4">
                Openings can change over time. Even where a specific position is not currently advertised, strong profiles may be considered for future requirements.
              </p>
            </div>
          </div>

          <div className="careers-roles-grid">
            <article className="careers-role-card">
              <small>Business</small>
              <h3>Institutional Relationships</h3>
              <p>Work with Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals and institutional asset owners.</p>
            </article>
            <article className="careers-role-card">
              <small>Marketplace</small>
              <h3>Buyer &amp; Investor Desk</h3>
              <p>Understand investor mandates, auction assets, buyer questions and transaction-support workflows.</p>
            </article>
            <article className="careers-role-card">
              <small>Operations</small>
              <h3>Auction Operations</h3>
              <p>Manage auction information, documentation, alerts, deadlines, enquiry tracking and bidder-support processes.</p>
            </article>
            <article className="careers-role-card">
              <small>Research</small>
              <h3>Asset &amp; Auction Intelligence</h3>
              <p>Research asset opportunities, institutional notices, market information and transaction context.</p>
            </article>
            <article className="careers-role-card">
              <small>Technology</small>
              <h3>Product &amp; Engineering</h3>
              <p>Build marketplace, search, alerts, CRM, automation, data-room and AI-assisted workflow capabilities.</p>
            </article>
            <article className="careers-role-card">
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
              <div className="eyebrow-text">How we work</div>
            </div>
            <div>
              <h2 className="text-white">Judgement Matters. So Does Discipline.</h2>
            </div>
          </div>

          <div className="culture-grid">
            <article className="culture-card">
              <h3>Ownership</h3>
              <p>Take responsibility for the outcome, not only the assigned task.</p>
            </article>
            <article className="culture-card">
              <h3>Clarity</h3>
              <p>Complex transactions still need simple, precise communication.</p>
            </article>
            <article className="culture-card">
              <h3>Integrity</h3>
              <p>Do not overstate an opportunity, a fact or what we can deliver.</p>
            </article>
            <article className="culture-card">
              <h3>Learning</h3>
              <p>Markets, regulation and technology change. Curiosity is part of the role.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="estabizz-section bg-[#f6f2ea]" id="apply">
        <div className="estabizz-container">
          <div className="contact-wrap-box">
            <div className="contact-info-panel">
              <div className="eyebrow-text">Join CityAuction</div>
              <h2 className="text-3xl font-serif-heading font-semibold text-white mt-2">
                Think You Can Add Value?
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-3 leading-relaxed">
                Tell us where you fit best and what you have built, sold, researched, managed or improved before. We are more interested in evidence of ownership than a long introduction.
              </p>

              <div className="actions-row mt-6">
                <a
                  className="btn-pill btn-gold"
                  href="mailto:info@estabizz.com?subject=Career%20Application%20-%20CityAuction"
                >
                  Email Your Profile
                </a>
              </div>
            </div>

            <div className="contact-form-panel">
              <CareerForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
