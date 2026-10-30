import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | CityAuction",
  description:
    "Contact CityAuction for auction opportunities, investor support, due diligence, personalised alerts, institutional services, asset liquidation, Customs auctions, strategic opportunities and support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    title: "Contact Us | CityAuction",
    description:
      "Contact CityAuction for auction opportunities, investor support, due diligence, personalised alerts, institutional services, asset liquidation, Customs auctions, strategic opportunities and support.",
    url: "/contact",
    siteName: "CityAuction",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero */}
      <section className="contact-hero">
        <div className="estabizz-container contact-hero-row">
          <div>
            <div className="eyebrow-text !text-[#d9c39c]">Contact CityAuction</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Tell Us What You’re<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Trying to Move Forward.</em>
            </h1>

            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              Whether you are searching for an auction opportunity, evaluating an asset, trying to reach buyers, exploring Customs lots, or looking for capital or a strategic partner—start with the situation.
            </p>

            <div className="quote-block mt-6 text-[#d9c39c]">
              “The right conversation usually starts with the objective, not the form.”
            </div>

            <div className="actions-row mt-6">
              <a className="btn-pill btn-gold" href="#contact-form">
                Send an Enquiry
              </a>
              <a className="btn-pill btn-ghost" href="tel:+919825669668">
                Call CityAuction
              </a>
            </div>
          </div>

          <aside className="nc-hero-card text-[#182129]">
            <div className="eyebrow-text">Quick contact</div>
            <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>
              CityAuction
            </h3>
            <p className="text-sm text-[#6f777d] mt-1">
              A venture of Estabizz Fintech Private Limited
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6">
              <div className="about-fact">
                <strong className="text-xs uppercase text-[#8e7149]">Phone</strong>
                <a href="tel:+919825669668" className="text-sm font-bold text-[#182129] block mt-1 hover:underline">
                  +91 98256 69668
                </a>
              </div>
              <div className="about-fact">
                <strong className="text-xs uppercase text-[#8e7149]">Email</strong>
                <a href="mailto:info@estabizz.com" className="text-sm font-bold text-[#182129] block mt-1 hover:underline">
                  info@estabizz.com
                </a>
              </div>
              <div className="about-fact col-span-1 sm:col-span-2">
                <strong className="text-xs uppercase text-[#8e7149]">Office</strong>
                <span className="text-xs text-[#525d64] block mt-1">
                  Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India
                </span>
              </div>
              <div className="about-fact col-span-1 sm:col-span-2">
                <strong className="text-xs uppercase text-[#8e7149]">Support Areas</strong>
                <span className="text-xs text-[#525d64] block mt-1">
                  Auctions · Investors · Institutions · Strategic Opportunities
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                className="btn-pill btn-dark w-full text-center flex items-center justify-center"
                href="https://wa.me/919825669668"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* 8 Routes Grid */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="contact-routes-grid">
            <article className="contact-route-card">
              <div>
                <h3>Buy / Invest</h3>
                <p>Looking for auction assets or institutional opportunities.</p>
              </div>
              <Link href="/auctions">Explore Auctions →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Investor Desk</h3>
                <p>Need due diligence, valuation, inspection or pre-bid support.</p>
              </div>
              <a href="#contact-form">Speak to Investor Desk →</a>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Institutional Services</h3>
                <p>Bank, NBFC, ARC, Liquidator or institutional asset mandate.</p>
              </div>
              <Link href="/liquidate-an-asset">Institutional Desk →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Liquidate an Asset</h3>
                <p>Need qualified buyer discovery and sale support.</p>
              </div>
              <Link href="/liquidate-an-asset">Start Liquidation Discussion →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Customs Auctions</h3>
                <p>Looking for Customs lots or process guidance.</p>
              </div>
              <Link href="/customs-auction">Explore Customs →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Next Chapter</h3>
                <p>Company sale, project sale, JV, investor or strategic capital.</p>
              </div>
              <Link href="/next-chapter">Explore Next Chapter →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Careers</h3>
                <p>Interested in building with CityAuction.</p>
              </div>
              <Link href="/careers">View Careers →</Link>
            </article>

            <article className="contact-route-card">
              <div>
                <h3>Technical / Account Support</h3>
                <p>Login, alerts, account access or platform assistance.</p>
              </div>
              <a href="#contact-form">Contact Support →</a>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="estabizz-section bg-[#f6f2ea]" id="contact-form">
        <div className="estabizz-container">
          <div className="nc-cta" style={{ background: "radial-gradient(circle at 78% 15%,rgba(180,147,97,.16),transparent 24%), linear-gradient(145deg,#0f1921,#152833)" }}>
            <div className="max-w-xl text-white">
              <div className="eyebrow-text !text-[#d9c39c]">Contact details</div>
              <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Start with the Situation.
              </h2>
              <p className="text-sm text-[#b7c1c8] mt-3 leading-relaxed">
                Share enough context for us to route the enquiry to the right CityAuction desk.
              </p>

              <div className="mt-8 space-y-4">
                <div className="pb-3 border-b border-white/10">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Phone</small>
                  <strong className="block text-white mt-1">
                    <a href="tel:+919825669668" className="hover:underline">+91 98256 69668</a>
                  </strong>
                </div>
                <div className="pb-3 border-b border-white/10">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Email</small>
                  <strong className="block text-white mt-1">
                    <a href="mailto:info@estabizz.com" className="hover:underline">info@estabizz.com</a>
                  </strong>
                </div>
                <div className="pb-3 border-b border-white/10">
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Office</small>
                  <strong className="block text-white mt-1 font-normal text-sm">
                    Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India
                  </strong>
                </div>
                <div>
                  <small className="text-xs uppercase text-[#cdb187] font-bold">Entity</small>
                  <strong className="block text-white mt-1 font-normal text-sm">
                    CityAuction · A venture of Estabizz Fintech Private Limited
                  </strong>
                </div>
              </div>

              <div className="actions-row mt-8">
                <a className="btn-pill btn-gold" href="tel:+919825669668">
                  Call
                </a>
                <a
                  className="btn-pill btn-ghost border-white/20 hover:border-white text-white"
                  href="https://wa.me/919825669668"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e6dfd4] bg-white text-xs text-[#5c676d] mt-5 leading-relaxed">
            <strong>Office:</strong> Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India. For meetings, institutional discussions or document submissions, confirm an appointment before visiting.
          </div>
        </div>
      </section>
    </div>
  );
}
