import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How CityAuction Works | Auction Journey, Due Diligence & Asset Resolution",
  description:
    "Understand how CityAuction helps buyers discover, evaluate and participate in auction opportunities, and how institutions can reach serious buyers through structured asset liquidation support.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    type: "website",
    title: "How CityAuction Works | From Discovery to Completion",
    description:
      "A practical guide to auction discovery, due diligence, EMD, bidding, acquisition and institutional asset liquidation.",
    url: "/how-it-works",
    siteName: "CityAuction",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero */}
      <section className="hiw-hero">
        <div className="estabizz-container hiw-hero-row">
          <div>
            <div className="eyebrow-text">How CityAuction works</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              From Discovery to Completion.<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Know What Happens Next.</em>
            </h1>
            <p className="hiw-hero-copy">
              Auction opportunities can look complicated from the outside. CityAuction is designed to make the journey easier to understand—whether you are exploring an asset, preparing to bid, completing an acquisition, or taking an institutional asset to market.
            </p>
            <div className="hiw-hero-promise">
              We do not make the decision for you. We help you understand the process well enough to make your own decision with greater confidence.
            </div>
            <div className="actions-row">
              <a href="#buyer-journey" className="btn-pill btn-gold">
                I Want to Buy / Invest
              </a>
              <a href="#institution" className="btn-pill btn-ghost">
                I Want to Liquidate an Asset
              </a>
            </div>
          </div>

          <aside className="hiw-hero-panel">
            <div className="eyebrow-text">Choose your journey</div>
            <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>What brings you to CityAuction?</h3>
            <p>Start from the path that is relevant to you.</p>
            <div className="hiw-role-grid">
              <a className="hiw-role-card" href="#buyer-journey">
                <small>Buyer / Investor</small>
                <strong>Discover and participate in auction opportunities</strong>
              </a>
              <a className="hiw-role-card" href="#before-bid">
                <small>First-Time Bidder</small>
                <strong>Understand what to check before paying EMD</strong>
              </a>
              <a className="hiw-role-card" href="#institution">
                <small>Bank / NBFC / ARC</small>
                <strong>Improve buyer discovery and auction distribution</strong>
              </a>
              <a className="hiw-role-card" href="#institution">
                <small>Liquidator / Asset Owner</small>
                <strong>Take an asset to the right buyer market</strong>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Two sides of one marketplace */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Two sides of one marketplace</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>One Process. Different Objectives.</h2>
              <p className="lead-text mt-4">
                A buyer wants to find, understand and acquire the right asset. An institution wants the asset to reach relevant buyers and move efficiently through the auction process. CityAuction is built to support both sides.
              </p>
            </div>
          </div>

          <div className="hiw-choice-grid">
            <article className="hiw-choice-card">
              <small>For Buyers &amp; Investors</small>
              <h3>Discover → Evaluate → Participate → Acquire</h3>
              <p>
                Use CityAuction to find opportunities, understand the notice, access optional diligence support and prepare for participation.
              </p>
              <ul>
                <li>Search and filter auction assets</li>
                <li>Review verified auction information</li>
                <li>Create personalised alerts</li>
                <li>Access due diligence and valuation support</li>
                <li>Understand documentation and EMD requirements</li>
              </ul>
            </article>

            <article className="hiw-choice-card">
              <small>For Institutions &amp; Asset Owners</small>
              <h3>Onboard → Position → Reach → Engage → Resolve</h3>
              <p>
                Use CityAuction to present assets more effectively and connect them with a more relevant buyer universe.
              </p>
              <ul>
                <li>Structured asset onboarding</li>
                <li>Investor-friendly asset presentation</li>
                <li>Targeted buyer outreach</li>
                <li>Lead and site-visit coordination</li>
                <li>Auction and post-auction workflow support</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Buyer Journey */}
      <section className="estabizz-section bg-[#f6f2ea]" id="buyer-journey">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Buyer journey</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Seven Steps From Interest to Acquisition.</h2>
              <p className="lead-text mt-4">
                The exact requirements differ from auction to auction. The concerned sale notice and institution&apos;s terms always prevail, but this is the practical journey most buyers should expect.
              </p>
            </div>
          </div>

          <div className="hiw-journey-grid">
            <article className="hiw-step-card">
              <div className="hiw-step-no">01</div>
              <h3>Discover</h3>
              <p>Search by location, asset type, reserve-price range, institution and auction category.</p>
              <div className="micro">CityAuction role: Discovery</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">02</div>
              <h3>Understand</h3>
              <p>Read the sale notice carefully. Note reserve price, EMD, possession status, inspection dates and auction conditions.</p>
              <div className="micro">CityAuction role: Information clarity</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">03</div>
              <h3>Evaluate</h3>
              <p>Assess title, encumbrances, dues, physical condition, market value and litigation risk before committing capital.</p>
              <div className="micro">Optional professional support</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">04</div>
              <h3>Prepare</h3>
              <p>Complete bidder registration, KYC and documentation exactly as required by the concerned auction notice.</p>
              <div className="micro">CityAuction role: Process support</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">05</div>
              <h3>Pay EMD</h3>
              <p>Deposit Earnest Money only through the method and account specified in the relevant auction notice.</p>
              <div className="micro">Payment goes as prescribed by the institution</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">06</div>
              <h3>Participate</h3>
              <p>Bid through the concerned Bank, ARC, Liquidator, Recovery Officer or authorised e-auction platform, as applicable.</p>
              <div className="micro">Auction terms govern</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">07</div>
              <h3>Complete</h3>
              <p>If successful, comply with payment timelines and complete Sale Certificate, registration, possession and related formalities.</p>
              <div className="micro">Post-auction support available</div>
            </article>
          </div>

          <div className="quote-block">
            “The right question is not only &lsquo;What is the reserve price?&rsquo; It is &lsquo;What do I need to understand before I commit?&rsquo;”
          </div>
        </div>
      </section>

      {/* 4. Before You Bid */}
      <section className="estabizz-section bg-white" id="before-bid">
        <div className="estabizz-container">
          <div className="hiw-checkpoint-box">
            <div className="hiw-checkpoint-left">
              <div className="eyebrow-text">Before you bid</div>
              <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.2 }}>Price is only one part of the decision.</h3>
              <p>
                Auction assets require independent judgement. Before paying EMD, understand the asset, the documents, the possession position and the obligations that may continue after purchase.
              </p>
              <div className="quote-block">
                “Discount attracts attention. Due diligence protects capital.”
              </div>
            </div>

            <div className="hiw-check-list">
              <div className="hiw-check-item">
                <strong>Sale Notice</strong>
                Read the entire notice, including bidder eligibility, payment timelines and default consequences.
              </div>
              <div className="hiw-check-item">
                <strong>Title Documents</strong>
                Review available title records and transaction history through eligible professionals where required.
              </div>
              <div className="hiw-check-item">
                <strong>Possession Status</strong>
                Understand whether possession is physical, symbolic or otherwise described in the auction documents.
              </div>
              <div className="hiw-check-item">
                <strong>Encumbrances &amp; Dues</strong>
                Check known mortgages, statutory dues, society dues, taxes, utilities and other liabilities.
              </div>
              <div className="hiw-check-item">
                <strong>Litigation Search</strong>
                Assess material litigation or proceedings that may affect the asset or transfer process.
              </div>
              <div className="hiw-check-item">
                <strong>Physical Inspection</strong>
                Inspect the property or asset where inspection is permitted and practically available.
              </div>
              <div className="hiw-check-item">
                <strong>Independent Valuation</strong>
                Compare reserve price against realistic market value and asset condition.
              </div>
              <div className="hiw-check-item">
                <strong>Funding Readiness</strong>
                Ensure you can meet auction payment timelines if you are declared successful.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Auction Frameworks */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Auction frameworks</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Different Legal Routes. Different Transaction Context.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                CityAuction may feature opportunities arising through multiple legal and institutional channels. The applicable sale notice, statute, rules, tribunal directions and authorised stakeholder process govern each transaction.
              </p>
            </div>
          </div>

          <div className="hiw-frameworks-grid">
            <article className="hiw-framework-card">
              <h3>SARFAESI</h3>
              <p>
                Secured-creditor enforcement and sale processes under the SARFAESI framework and applicable Security Interest (Enforcement) Rules.
              </p>
            </article>
            <article className="hiw-framework-card">
              <h3>DRT / Recovery Officer</h3>
              <p>
                Sales arising through recovery proceedings and execution of Recovery Certificates under the applicable recovery framework.
              </p>
            </article>
            <article className="hiw-framework-card">
              <h3>IBC / Liquidation</h3>
              <p>
                Assets sold through insolvency or liquidation processes conducted by the authorised Insolvency Professional / Liquidator.
              </p>
            </article>
            <article className="hiw-framework-card">
              <h3>Institutional / Other Auctions</h3>
              <p>
                Other lawful auction or disposal processes conducted by competent financial institutions, authorities or asset owners.
              </p>
            </article>
          </div>

          <div className="quote-block">
            “CityAuction explains the pathway. The relevant auction notice and competent authority define the transaction.”
          </div>
        </div>
      </section>

      {/* 6. For Banks, NBFCs, ARCs & Liquidators */}
      <section className="estabizz-section text-[#edf2f5] dark-bg" id="institution" style={{ background: "#111b23" }}>
        <div className="estabizz-container hiw-institution-box">
          <div>
            <div className="eyebrow-text">For Banks, NBFCs, ARCs &amp; Liquidators</div>
            <h2 className="font-serif-heading text-white mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Your Asset Should Reach More Than an Auction Notice.</h2>
            <p>
              Publishing an auction notice is a regulatory or procedural step. Reaching relevant buyers is a market-discovery challenge.
            </p>
            <p>
              CityAuction helps institutions and authorised stakeholders improve how assets are presented, distributed and taken to the buyer market—without displacing the legal functions of the competent institution, Liquidator, Recovery Officer or authorised e-auction provider.
            </p>
            <div className="actions-row">
              <Link href="/liquidate-an-asset" className="btn-pill btn-gold">
                View Liquidation Services
              </Link>
              <a
                href="mailto:info@estabizz.com?subject=CityAuction%20Institutional%20Discussion"
                className="btn-pill btn-ghost"
              >
                Speak with Institutional Desk
              </a>
            </div>
          </div>

          <div className="hiw-inst-grid">
            <div className="hiw-inst-item">
              <strong>01 · Onboard</strong>
              Structure asset information, images and transaction particulars.
            </div>
            <div className="hiw-inst-item">
              <strong>02 · Position</strong>
              Present the asset in a commercially understandable format.
            </div>
            <div className="hiw-inst-item">
              <strong>03 · Distribute</strong>
              Take the opportunity to a relevant buyer and investor network.
            </div>
            <div className="hiw-inst-item">
              <strong>04 · Engage</strong>
              Capture enquiries and coordinate eligible site visits.
            </div>
            <div className="hiw-inst-item">
              <strong>05 · Connect</strong>
              Direct eligible bidders to the authorised auction route.
            </div>
            <div className="hiw-inst-item">
              <strong>06 · Coordinate</strong>
              Support communication and post-auction workflow where engaged.
            </div>
          </div>
        </div>
      </section>

      {/* 7. Risk & Responsibility */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Risk &amp; responsibility</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>CityAuction Helps You Understand. The Decision Remains Yours.</h2>
              <p className="lead-text mt-4">
                Auction assets can involve legal, financial, possession and execution risks. CityAuction&apos;s role is to improve information access and facilitate support—not to replace independent professional advice or the buyer&apos;s own decision-making.
              </p>
            </div>
          </div>

          <div className="hiw-risk-grid">
            <article className="hiw-risk-card">
              <h3>No Guarantee of Discount</h3>
              <p>
                Reserve price and market value are different concepts. A lower reserve price does not by itself establish an investment gain or market discount.
              </p>
            </article>
            <article className="hiw-risk-card">
              <h3>No Automatic Title Assurance</h3>
              <p>
                A verified auction notice does not amount to independent verification of title, possession, encumbrances or absence of litigation.
              </p>
            </article>
            <article className="hiw-risk-card">
              <h3>Notice-Specific Terms Prevail</h3>
              <p>
                EMD amount, refund process, bid increments, payment timelines, inspection rights and transfer documentation depend on the relevant sale notice and applicable legal framework.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="estabizz-section bg-[#f6f2ea]" id="faq">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Frequently asked questions</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>The Questions Serious Bidders Usually Ask.</h2>
            </div>
          </div>

          <div className="faq-accordion space-y-1">
            <details>
              <summary>Does CityAuction itself conduct every auction?</summary>
              <p>
                No. Unless expressly stated for a specific transaction, the auction is conducted by the concerned Bank, ARC, Liquidator, Recovery Officer, Financial Institution or its authorised e-auction service provider. CityAuction acts as an information, marketplace and transaction-support platform.
              </p>
            </details>
            <details>
              <summary>Where should I pay the EMD?</summary>
              <p>
                Only in accordance with the relevant auction notice and to the account or mechanism prescribed by the competent institution or authorised auction platform. CityAuction should not be treated as the default EMD collection point.
              </p>
            </details>
            <details>
              <summary>Is the EMD always 10% of reserve price?</summary>
              <p>
                No blanket percentage should be assumed. The applicable EMD is whatever is stated in the relevant auction notice and governing process.
              </p>
            </details>
            <details>
              <summary>Does a “Verified” badge mean the title is clear?</summary>
              <p>
                No. It means the primary auction particulars have been cross-checked against a relevant institution-provided or published auction notice. It does not independently certify title, possession, encumbrances, dues or market value.
              </p>
            </details>
            <details>
              <summary>Can CityAuction help with legal due diligence and valuation?</summary>
              <p>
                CityAuction can coordinate such services through appropriately eligible legal, valuation and other professionals where engaged. Their scope, opinion and responsibility remain subject to the relevant professional engagement.
              </p>
            </details>
            <details>
              <summary>What happens after I win an auction?</summary>
              <p>
                You must comply with the payment and completion timelines specified in the auction notice and applicable process. Depending on the transaction, further steps may include Sale Certificate, registration, documentation and possession-related formalities.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="about-cta-panel">
            <div>
              <div className="eyebrow-text">Your next step</div>
              <h2 className="font-serif-heading text-[#182129] mt-2.5" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>Know the Process. Then Decide.</h2>
              <p>
                Explore auction opportunities if you are looking to acquire. Speak with the Institutional Desk if you are looking to take an asset to the buyer market.
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
