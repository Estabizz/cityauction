import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CityAuction | Built from Auction-Market Experience",
  description:
    "Learn why CityAuction exists, the auction-market experience behind it, who we serve, what we believe, and how we are building a clearer marketplace for institutional auction assets.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    title: "About CityAuction | Built from Experience. Designed for What Comes Next.",
    description:
      "CityAuction is a specialised auction and asset-resolution marketplace connecting institutional assets with serious buyers and investors.",
    url: "/about",
    siteName: "CityAuction",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero */}
      <section className="about-hero">
        <div className="estabizz-container about-hero-row">
          <div>
            <div className="eyebrow-text">About CityAuction</div>
            <h1>
              Built from Experience.<br />
              <em>Designed for What Comes Next.</em>
            </h1>
            <p className="about-hero-copy">
              CityAuction was born from a simple observation: valuable institutional assets often struggle to find the right audience, while serious buyers struggle to find, understand and evaluate those opportunities.
            </p>
            <div className="about-hero-promise">
              We are building CityAuction to bring those two sides closer—with better discovery, clearer information and a more connected transaction journey.
            </div>
            <div className="actions-row">
              <a href="#story" className="btn-pill btn-gold">
                Discover Our Story
              </a>
              <Link href="/auctions" className="btn-pill btn-ghost">
                Explore Auctions
              </Link>
            </div>
          </div>

          <aside className="about-hero-card">
            <div className="eyebrow-text">The experience behind the platform</div>
            <h3>A digital chapter built on years inside the auction ecosystem.</h3>
            <p>
              CityAuction is a proposed brand initiative of Estabizz Fintech Private Limited. The experience behind the platform dates to 2016 and includes work across auction properties, financial institutions, buyer coordination and transaction support.
            </p>
            <div className="about-hero-facts">
              <div className="about-fact">
                <strong>2016</strong>
                <span>Journey in auction-property services began</span>
              </div>
              <div className="about-fact">
                <strong>10+ Years</strong>
                <span>Cumulative auction-market experience</span>
              </div>
              <div className="about-fact">
                <strong>100+</strong>
                <span>Banks & institutions across our experience</span>
              </div>
              <div className="about-fact">
                <strong>5,000+</strong>
                <span>Auction opportunities across our experience</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Why CityAuction exists */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Why CityAuction exists</div>
            </div>
            <div>
              <h2>The Auction Market Has Information. What It Often Lacks Is Connection.</h2>
              <p className="lead-text mt-4">
                The auction ecosystem is not short of notices. It is short of structured discovery, context and relevant buyer access.
              </p>
            </div>
          </div>

          <div className="about-problem-grid">
            <article className="about-problem-card">
              <small>The Buyer Problem</small>
              <h3>Opportunities are fragmented.</h3>
              <p>
                Buyers often search across newspapers, bank websites, e-auction portals and statutory notices—then still need to understand what the opportunity actually means.
              </p>
            </article>
            <article className="about-problem-card">
              <small>The Institution Problem</small>
              <h3>Publication does not always create discovery.</h3>
              <p>
                An asset can be properly advertised and still fail to reach the people who have the capital, intent and ability to acquire it.
              </p>
            </article>
            <article className="about-problem-card">
              <small>The CityAuction Opportunity</small>
              <h3>Bring the market closer together.</h3>
              <p>
                CityAuction is being built as the connection layer between institutional assets, serious buyers, professional support and the authorised auction process.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Our Story */}
      <section className="estabizz-section bg-[#f6f2ea]" id="story">
        <div className="estabizz-container about-story-grid">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82"
            alt="Professional workspace representing the experience behind CityAuction"
            className="about-story-img"
            loading="lazy"
          />
          <div className="about-story-copy">
            <div className="eyebrow-text">Our story</div>
            <h2>Ten Years of Seeing What Others Often Overlook.</h2>
            <p>
              Our journey with auction properties began in 2016—through years of working around properties, sale notices, financial institutions, documents, bidder queries, inspections and buyers trying to make sense of an unfamiliar process.
            </p>
            <p>
              We saw potentially valuable assets remain unnoticed because the right buyer never found them. We saw serious buyers step away because the process looked more complicated than it really was. And we saw institutions complete every required publication step while still struggling to generate meaningful market attention.
            </p>
            <p>
              Those experiences shaped CityAuction.
            </p>
            <p>
              Not as another page carrying auction notices, but as a marketplace built around discovery, understanding and better market access.
            </p>
            <div className="quote-block">
              “For someone, it is an asset under auction. For someone else, it could be the beginning of something remarkable.”
            </div>
          </div>
        </div>
      </section>

      {/* 4. Experience in numbers */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Experience in numbers</div>
            </div>
            <div>
              <h2>Experience Gives Perspective. Technology Gives It Scale.</h2>
              <p className="lead-text mt-4">
                These numbers reflect the cumulative experience and network associated with the promoters/team, including work preceding the launch of CityAuction.
              </p>
            </div>
          </div>

          <div className="about-metrics-grid">
            <div className="about-metric-item">
              <strong>10+ Years</strong>
              <span>Auction-market experience</span>
            </div>
            <div className="about-metric-item">
              <strong>100+</strong>
              <span>Banks & institutions across our experience</span>
            </div>
            <div className="about-metric-item">
              <strong>5,000+</strong>
              <span>Auction properties / opportunities across our experience</span>
            </div>
            <div className="about-metric-item">
              <strong>5,000+</strong>
              <span>Buyer & investor network</span>
            </div>
          </div>
          <p className="text-center text-xs text-[#8e959a] mt-3">
            The above should not be construed as the number of current CityAuction institutional partners unless specifically identified as such.
          </p>
        </div>
      </section>

      {/* 5. What we believe */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg" id="beliefs">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">What we believe</div>
            </div>
            <div>
              <h2 className="text-white">The Principles Behind CityAuction.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                The brand is being built around a few simple ideas that guide how we present opportunities and how we want users to experience the market.
              </p>
            </div>
          </div>

          <div className="about-beliefs-grid">
            <article className="about-belief-card">
              <h3>Opportunity Over Distress</h3>
              <p>
                An institutional asset may have entered the market through recovery or liquidation, but its future value is defined by what the next owner can do with it.
              </p>
            </article>
            <article className="about-belief-card">
              <h3>Clarity Over Noise</h3>
              <p>
                More listings do not automatically create better decisions. We want to make the information that matters easier to find and understand.
              </p>
            </article>
            <article className="about-belief-card">
              <h3>Knowledge Before Participation</h3>
              <p>
                Reserve price alone should never be the basis of an acquisition. Title, possession, dues, condition and auction terms matter.
              </p>
            </article>
            <article className="about-belief-card">
              <h3>Relevant Reach Over Mere Visibility</h3>
              <p>
                For institutions, the goal is not simply to show an asset to more people. It is to show it to people capable of acquiring it.
              </p>
            </article>
            <article className="about-belief-card">
              <h3>Human Judgement Remains Central</h3>
              <p>
                Technology can organise information and reduce friction. The investment decision remains with the buyer.
              </p>
            </article>
            <article className="about-belief-card">
              <h3>Trust Must Be Earned</h3>
              <p>
                We prefer precise disclosures, defined verification and qualified professional support over broad marketing assurances.
              </p>
            </article>
          </div>

          <div className="quote-block">
            “Price creates interest. Understanding creates conviction.”
          </div>
        </div>
      </section>

      {/* 6. Who we serve */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Who we serve</div>
            </div>
            <div>
              <h2>Built for Both Sides of the Transaction.</h2>
              <p className="lead-text mt-4">
                CityAuction is intended to serve the people looking for opportunities and the institutions looking for the right market.
              </p>
            </div>
          </div>

          <div className="about-audience-grid">
            <article className="about-aud-card">
              <h3>Buyers & Investors</h3>
              <p>
                Individuals, HNIs, businesses and investors searching for residential, commercial, industrial, land and other auction opportunities.
              </p>
            </article>
            <article className="about-aud-card">
              <h3>Developers & Corporates</h3>
              <p>
                Businesses seeking land, industrial assets, commercial premises, machinery or strategic acquisition opportunities.
              </p>
            </article>
            <article className="about-aud-card">
              <h3>Banks, NBFCs & ARCs</h3>
              <p>
                Institutions seeking better asset presentation, relevant buyer discovery and structured distribution support.
              </p>
            </article>
            <article className="about-aud-card">
              <h3>Liquidators & Professionals</h3>
              <p>
                Liquidators, Insolvency Professionals and other authorised stakeholders looking to improve market reach for eligible assets.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 7. The CityAuction ecosystem */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">The CityAuction ecosystem</div>
            </div>
            <div>
              <h2>One Marketplace. Two Journeys.</h2>
            </div>
          </div>

          <div className="about-eco-grid">
            <article className="about-eco-card">
              <small>For Buyers & Investors</small>
              <h3>From Discovery to Acquisition</h3>
              <p>
                Find relevant opportunities, understand the asset, access optional professional support and connect to the authorised auction process.
              </p>
              <div className="about-eco-flow">
                <span className="about-eco-pill">Discover</span>
                <span className="about-eco-pill">Understand</span>
                <span className="about-eco-pill">Evaluate</span>
                <span className="about-eco-pill">Prepare</span>
                <span className="about-eco-pill">Participate</span>
                <span className="about-eco-pill">Acquire</span>
              </div>
            </article>
            <article className="about-eco-card">
              <small>For Institutions</small>
              <h3>From Asset Onboarding to Market Reach</h3>
              <p>
                Structure the asset, present it clearly, distribute it to relevant buyers and support the transaction workflow around the authorised sale process.
              </p>
              <div className="about-eco-flow">
                <span className="about-eco-pill">Onboard</span>
                <span className="about-eco-pill">Position</span>
                <span className="about-eco-pill">Distribute</span>
                <span className="about-eco-pill">Engage</span>
                <span className="about-eco-pill">Connect</span>
                <span className="about-eco-pill">Coordinate</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 8. Where we are going */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg" id="vision">
        <div className="estabizz-container about-vision-grid">
          <div className="about-vision-copy">
            <div className="eyebrow-text">Where we are going</div>
            <h2 className="text-white mt-3">The Future Is Not Another Listing Portal.</h2>
            <p>
              Our ambition is to build CityAuction into a connected digital infrastructure for institutional asset discovery and transaction support.
            </p>
            <p>
              For buyers, that means a journey where search, alerts, documents, diligence, financing support, auction participation and post-auction completion can increasingly sit within one connected experience.
            </p>
            <p>
              For institutions, that means a platform capable of supporting asset onboarding, investor discovery, bidder engagement, auction connectivity, MIS and post-auction workflows.
            </p>
            <div className="quote-block">
              “Our ambition is not to digitise auction notices. It is to modernise how institutional assets are discovered, evaluated and taken to market.”
            </div>
          </div>

          <div className="about-vision-panel">
            <div className="about-vision-point">
              <strong>CityAuction Marketplace</strong>
              <span>Discovery of institutional auction assets.</span>
            </div>
            <div className="about-vision-point">
              <strong>CityAuction Investor Desk</strong>
              <span>Due diligence, valuation and acquisition support through eligible professionals and service partners where engaged.</span>
            </div>
            <div className="about-vision-point">
              <strong>CityAuction Alerts</strong>
              <span>Personalised opportunity discovery based on a buyer&apos;s mandate.</span>
            </div>
            <div className="about-vision-point">
              <strong>CityAuction Institutional</strong>
              <span>Asset distribution, buyer engagement and workflow support for Banks, NBFCs, ARCs and Liquidators.</span>
            </div>
            <div className="about-vision-point">
              <strong>CityAuction Enterprise</strong>
              <span>Future institutional technology and e-auction infrastructure capabilities, subject to applicable requirements and implementation.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Our promise */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Our promise</div>
            </div>
            <div>
              <h2>What You Should Expect from CityAuction.</h2>
            </div>
          </div>

          <div className="about-promise-grid">
            <article className="about-promise-card">
              <h3>We Will Explain Our Role Clearly.</h3>
              <p>
                CityAuction will distinguish between marketplace support and functions legally performed by the auctioning institution, Liquidator, Recovery Officer or authorised e-auction provider.
              </p>
            </article>
            <article className="about-promise-card">
              <h3>We Will Not Treat “Verified” as a Guarantee.</h3>
              <p>
                Verification of auction information will not be presented as automatic certification of title, possession, encumbrances or market value.
              </p>
            </article>
            <article className="about-promise-card">
              <h3>We Will Keep the Decision with You.</h3>
              <p>
                CityAuction may help you find and understand an opportunity, but the decision to participate and acquire remains entirely yours.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="about-cta-panel">
            <div>
              <div className="eyebrow-text">CityAuction</div>
              <h2 className="mt-2.5">See Beyond the Auction.</h2>
              <p>
                Discover institutional asset opportunities if you are looking to acquire. Bring an asset to CityAuction if you are looking for the right buyer market.
              </p>
            </div>
            <div className="actions-row mt-0">
              <Link href="/auctions" className="btn-pill btn-gold">
                Explore Auctions
              </Link>
              <Link href="/liquidate-an-asset" className="btn-pill btn-ghost">
                Liquidate an Asset
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
