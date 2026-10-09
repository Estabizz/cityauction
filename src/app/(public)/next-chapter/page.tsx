import Link from "next/link";
import type { Metadata } from "next";
import { NextChapterForm } from "@/components/forms/next-chapter-form";

export const metadata: Metadata = {
  title: "CityAuction Next Chapter | Strategic Capital, Project Sale, JV & Business Transition",
  description:
    "CityAuction Next Chapter helps asset-backed companies, developers and projects explore strategic options including business sale, project sale, JV, investor induction, capital partnership, asset monetisation and promoter exit.",
  alternates: { canonical: "/next-chapter" },
  openGraph: {
    type: "website",
    title: "CityAuction Next Chapter | A Difficult Chapter Does Not Have to Be the Final One",
    description:
      "Strategic pathways for businesses and projects facing capital pressure but still holding underlying value.",
    url: "/next-chapter",
    siteName: "CityAuction",
  },
};

export default function NextChapterPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129]">

      {/* ─── 1. Hero ──────────────────────────────────────────── */}
      <section className="nc-hero">
        <div className="estabizz-container">
          <div className="nc-hero-row">
            {/* Left copy */}
            <div>
              <div className="eyebrow-text" style={{ color: "#d9c39c" }}>
                <span className="eyebrow-line" style={{ background: "#d9c39c" }} />
                CityAuction Next Chapter
              </div>
              <h1 className="font-serif-heading text-white mt-4 leading-tight"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
                A Difficult Chapter<br />
                <em className="not-italic" style={{ color: "#dbc39a", fontWeight: 400 }}>
                  Does Not Have to Be the Final One.
                </em>
              </h1>
              <p className="mt-5 text-[#b0bcc4] leading-relaxed" style={{ fontSize: "1.05rem", maxWidth: "560px" }}>
                A company can face liquidity pressure and still own valuable land, projects, factories,
                licences, receivables or an operating business. A developer can be short of capital while
                the project itself still holds substantial potential.
              </p>
              <div className="nc-hero-promise">
                We do not begin with what went wrong. We begin with what still holds value—and who may be
                able to take it forward.
              </div>
              <div className="nc-hero-actions">
                <a className="btn-pill btn-gold" href="#solutions">Explore Strategic Options</a>
                <a className="btn-pill btn-ghost" href="#mandate">Discuss Your Situation Privately</a>
              </div>
            </div>

            {/* Right card */}
            <div className="nc-hero-card">
              <div className="eyebrow-text">
                <span className="eyebrow-line" />
                Choose your pathway
              </div>
              <h3 className="font-serif-heading mt-3 text-[#182129]" style={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.2 }}>
                What needs its next chapter?
              </h3>
              <p className="mt-2 text-[#6f777d] leading-relaxed" style={{ fontSize: ".85rem" }}>
                CityAuction separates company-level situations from development-project situations so the
                right buyer, investor or partner universe can be built around the opportunity.
              </p>
              <div className="path-grid">
                <a className="path" href="#companies">
                  <small>For Companies</small>
                  <strong>Business under financial pressure</strong>
                  <span>Company sale · investor · asset monetisation · promoter exit</span>
                </a>
                <a className="path" href="#developers">
                  <small>For Developers</small>
                  <strong>Project needs capital or a new partner</strong>
                  <span>Project sale · JV · developer induction · completion capital</span>
                </a>
                <a className="path" href="#investors">
                  <small>For Investors</small>
                  <strong>Looking for special opportunities</strong>
                  <span>Strategic acquisition · turnaround · land-backed opportunities</span>
                </a>
                <a className="path" href="#confidentiality">
                  <small>Private Mandates</small>
                  <strong>Discreetly test the market</strong>
                  <span>NDA-led outreach · controlled disclosure · selected counterparties</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Philosophy ────────────────────────────────────── */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text"><span className="eyebrow-line" />The philosophy</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Financial Pressure Changes the Situation. It Does Not Automatically Destroy the Value.
              </h2>
              <p className="lead-text mt-4">
                When liquidity becomes difficult, the instinct is often to focus on the problem. CityAuction
                Next Chapter focuses first on the underlying value—then on the transaction structure that may
                preserve, transfer or unlock it.
              </p>
            </div>
          </div>

          <div className="core-grid">
            <article className="core">
              <small>Value</small>
              <h3>What Still Works?</h3>
              <p>Land, project rights, licences, customers, brand, plant, receivables, approvals, inventory and operating infrastructure may still carry strategic value.</p>
            </article>
            <article className="core">
              <small>Structure</small>
              <h3>What Could Change?</h3>
              <p>The promoter, capital structure, ownership, project partner, asset mix or funding model may need to change even when the underlying opportunity remains viable.</p>
            </article>
            <article className="core">
              <small>Market</small>
              <h3>Who Could Take It Forward?</h3>
              <p>Strategic buyers, developers, funds, family offices, HNIs, industry participants and other investors may see value differently from the existing capital structure.</p>
            </article>
          </div>

          <div className="nc-quote">
            "Value does not disappear because liquidity does."
          </div>
        </div>
      </section>

      {/* ─── 3. Story ─────────────────────────────────────────── */}
      <section className="estabizz-section ivory-bg">
        <div className="estabizz-container">
          <div className="story-grid">
            <div className="story-visual">
              <div className="story-note">
                <p>"Sometimes protecting what you built means finding the capital, partner or owner who can take it further."</p>
              </div>
            </div>
            <div className="story-copy">
              <div className="eyebrow-text"><span className="eyebrow-line" />What CityAuction sees</div>
              <h2 className="font-serif-heading text-[#182129] mt-3"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Behind the Stress, There May Still Be a Business Worth Buying—or a Project Worth Completing.
              </h2>
              <p>A difficult balance sheet can sit on valuable land. A stalled project can have approvals, inventory and future cash flow. A promoter seeking an exit may still own an operating business, customers and infrastructure that a strategic buyer would value.</p>
              <p>That is why CityAuction Next Chapter is not designed as a "distressed company listing" page.</p>
              <p>It is a strategic marketplace for situations where ownership, capital or execution may need to change so that underlying value can continue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Strategic Options ─────────────────────────────── */}
      <section className="estabizz-section dark-bg" id="solutions">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text" style={{ color: "#d9c39c" }}><span className="eyebrow-line" style={{ background: "#d9c39c" }} />Strategic options</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                One Difficult Situation Can Have More Than One Way Forward.
              </h2>
              <p className="lead-text mt-4" style={{ color: "#aeb9c1" }}>
                The objective is not to force every situation into a sale. The objective is to identify the
                structure that may preserve the most commercial value.
              </p>
            </div>
          </div>

          <div className="solution-grid">
            {[
              ["Sell the Company", "Explore a full or controlling-stake sale where a strategic buyer or investor can take the business forward."],
              ["Sell the Project", "Transfer a development or operating project to a buyer capable of funding and completing it."],
              ["Joint Venture", "Combine existing land, approvals, rights or operating capability with incoming capital and execution strength."],
              ["Investor Induction", "Bring in strategic or financial capital without necessarily transferring full control of the business or project."],
              ["Asset Monetisation", "Release liquidity from land, buildings, inventory, factories, machinery or non-core assets."],
              ["Promoter Exit", "Structure an orderly full or partial exit where the promoter prefers a transition rather than continued capital commitment."],
              ["Strategic Partnership", "Introduce an operating, development, distribution or industry partner who contributes more than capital."],
              ["Turnaround Capital", "Explore special-situation capital for viable businesses or projects where the funding gap is the primary constraint."],
            ].map(([title, desc]) => (
              <article className="solution" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>

          <div className="nc-quote light">
            "Sometimes the best resolution is not to sell the asset. It is to find the capital, partner or owner who can take it forward."
          </div>
        </div>
      </section>

      {/* ─── 5. Two Paths ─────────────────────────────────────── */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text"><span className="eyebrow-line" />Two distinct journeys</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Companies and Development Projects Need Different Conversations.
              </h2>
            </div>
          </div>

          <div className="two-path">
            <article className="big-path">
              <small>Path 01</small>
              <h3>For Companies</h3>
              <p>A company may have debt or cash-flow pressure while still owning a viable business, real estate, machinery, licences, receivables or strategic market access.</p>
              <ul>
                <li>Company / business sale</li>
                <li>Strategic investor induction</li>
                <li>Promoter stake sale or exit</li>
                <li>Non-core asset monetisation</li>
                <li>Strategic partner search</li>
                <li>Turnaround / special-situation capital</li>
              </ul>
              <div className="actions-row">
                <a className="btn-pill btn-dark" href="#companies">Explore Company Path →</a>
              </div>
            </article>

            <article className="big-path alt">
              <small>Path 02</small>
              <h3>For Developers &amp; Projects</h3>
              <p>A project can stop because capital has stopped—not because the land, approvals, construction or development potential has disappeared.</p>
              <ul>
                <li>Project sale</li>
                <li>Joint venture / development partner</li>
                <li>Project-level investor induction</li>
                <li>Completion / structured capital</li>
                <li>Land or inventory monetisation</li>
                <li>Developer / sponsor transition</li>
              </ul>
              <div className="actions-row">
                <a className="btn-pill btn-gold" href="#developers">Explore Developer Path →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 6. For Companies ─────────────────────────────────── */}
      <section className="estabizz-section ivory-bg" id="companies">
        <div className="estabizz-container">
          <div className="company-grid">
            <div className="case-copy">
              <div className="eyebrow-text"><span className="eyebrow-line" />For companies</div>
              <h2 className="font-serif-heading text-[#182129] mt-3"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", fontWeight: 600, lineHeight: 1.15 }}>
                A Business Can Be Financially Stressed and Commercially Valuable at the Same Time.
              </h2>
              <p>The existing capital structure may no longer work, but the company may still have customers, assets, licences, infrastructure, receivables, intellectual property, operating capability or strategic market access.</p>
              <p>CityAuction Next Chapter helps organise that value into a transaction story that can be presented to selected buyers, investors and strategic partners.</p>
              <div className="nc-quote">"A difficult balance sheet can still sit on a valuable business."</div>
            </div>
            <div className="case-items">
              {[
                ["Business Sale", "Full business or controlling interest to a strategic acquirer."],
                ["Equity / Strategic Investment", "Capital infusion alongside existing promoters where appropriate."],
                ["Promoter Exit", "Full or partial stake transition to a suitable counterparty."],
                ["Asset-Backed Opportunity", "Present land, factory, commercial assets and operating business together where commercially relevant."],
                ["Non-Core Asset Sale", "Monetise selected assets to release liquidity without selling the entire company."],
                ["Strategic Partnership", "Bring in an industry participant capable of adding capital, execution, distribution or operating strength."],
                ["Turnaround Capital", "Introduce capital providers interested in special situations where a viable path forward exists."],
                ["Transaction Preparation", "Build an investor-ready information pack, asset schedule and controlled diligence process."],
              ].map(([title, desc]) => (
                <div className="case-item" key={title}>
                  <strong>{title}</strong>
                  {desc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. For Developers ────────────────────────────────── */}
      <section className="estabizz-section white-bg" id="developers">
        <div className="estabizz-container">
          <div className="developer-grid">
            <div className="case-items">
              {[
                ["Sell the Project", "Transfer the project to another developer, investor or strategic acquirer."],
                ["Joint Venture / Joint Development", "Retain participation while bringing in capital and execution capability."],
                ["Project-Level Investor", "Raise equity or structured capital against the project's future potential."],
                ["Completion Capital", "Explore funding for construction completion where the underlying project remains viable."],
                ["Land Monetisation", "Sell or partly monetise surplus or non-core land to fund the main project."],
                ["Inventory Monetisation", "Explore structured sale of unsold residential, commercial or other inventory."],
                ["Development Partner", "Bring in a stronger developer / sponsor with execution and market capability."],
                ["Project Transition", "Structure a new path where the current promoter no longer wishes or is unable to continue."],
              ].map(([title, desc]) => (
                <div className="case-item" key={title}>
                  <strong>{title}</strong>
                  {desc}
                </div>
              ))}
            </div>
            <div className="case-copy">
              <div className="eyebrow-text"><span className="eyebrow-line" />For developers &amp; projects</div>
              <h2 className="font-serif-heading text-[#182129] mt-3"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", fontWeight: 600, lineHeight: 1.15 }}>
                The Building Stopped. The Opportunity Didn&apos;t.
              </h2>
              <p>A developer may already have acquired the land, obtained approvals, created project infrastructure, completed part of the construction or sold inventory—then face a funding gap that slows or stops execution.</p>
              <p>CityAuction Next Chapter helps reposition that situation as a project opportunity for another developer, capital partner, fund, family office or strategic investor.</p>
              <div className="nc-quote">"Partially created value does not have to become permanently stranded value."</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Process ───────────────────────────────────────── */}
      <section className="estabizz-section ivory-bg" id="process">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text"><span className="eyebrow-line" />How CityAuction supports the next chapter</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                From Financial Pressure to Strategic Options.
              </h2>
              <p className="lead-text mt-4">The process is designed to understand the situation before approaching the market.</p>
            </div>
          </div>

          <div className="framework">
            {[
              ["01", "Understand", "Review the company/project, assets, liabilities, current funding position, stakeholder pressure and promoter objective."],
              ["02", "Map the Value", "Identify land, project rights, business operations, licences, receivables, inventory and other strategic assets."],
              ["03", "Design the Options", "Compare sale, JV, investor induction, asset monetisation, strategic partnership or promoter-exit routes."],
              ["04", "Prepare the Story", "Create a controlled transaction profile, investment summary and supporting information package."],
              ["05", "Identify the Market", "Define the right universe of strategic buyers, developers, funds, family offices or special-situation investors."],
              ["06", "Approach Discreetly", "Use public, confidential or private-mandate outreach depending on the sensitivity of the situation."],
              ["07", "Evaluate Interest", "Coordinate NDA, management discussions, site visits, indicative offers and preliminary transaction structures."],
              ["08", "Move Toward Closing", "Coordinate due diligence and the agreed transaction process with relevant legal, tax, financial and technical advisers."],
            ].map(([num, title, desc]) => (
              <article className="frame" key={num}>
                <div className="num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Confidentiality ───────────────────────────────── */}
      <section className="estabizz-section dark-bg" id="confidentiality">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text" style={{ color: "#d9c39c" }}><span className="eyebrow-line" style={{ background: "#d9c39c" }} />Discreet by design</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-white"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Not Every Situation Belongs on a Public Marketplace.
              </h2>
              <p className="lead-text mt-4" style={{ color: "#aeb9c1" }}>
                Financial stress, promoter transition and capital discussions can be highly sensitive.
                CityAuction Next Chapter supports different levels of market visibility.
              </p>
            </div>
          </div>

          <div className="conf">
            <article className="conf-card">
              <h3>Public Opportunity</h3>
              <p>A carefully prepared opportunity profile can be visible to the wider marketplace where public distribution is commercially appropriate.</p>
            </article>
            <article className="conf-card">
              <h3>Confidential Opportunity</h3>
              <p>Only limited information is shown initially. Identity and sensitive materials are shared with qualified parties after NDA and approval.</p>
            </article>
            <article className="conf-card">
              <h3>Private Mandate</h3>
              <p>No public listing. CityAuction approaches a selected universe of strategic buyers, investors or developers on a controlled basis.</p>
            </article>
          </div>

          <div className="nc-quote light">
            "Sometimes the most valuable part of the process is knowing who should hear the opportunity—and who should not."
          </div>
        </div>
      </section>

      {/* ─── 10. For Investors ────────────────────────────────── */}
      <section className="estabizz-section white-bg" id="investors">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text"><span className="eyebrow-line" />For investors &amp; strategic buyers</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Special Situations Can Create Entry Points the Conventional Market Does Not.
              </h2>
              <p className="lead-text mt-4">
                Financial stress is not itself an investment thesis. The opportunity must make sense after
                liabilities, capital requirement, legal position and execution risk are understood.
              </p>
            </div>
          </div>

          <div className="investor-grid">
            {[
              ["Strategic Acquisition", "Acquire a business, competitor, licence, operating platform or asset base that complements an existing business."],
              ["Land-Backed Opportunities", "Evaluate companies or projects where underlying land and development potential form an important part of the value proposition."],
              ["Project Revival", "Enter projects where capital, execution or sponsorship needs to change for development to continue."],
              ["Turnaround Situations", "Evaluate operating businesses where the commercial core remains viable but the current capital structure is under pressure."],
              ["JV Opportunities", "Partner with landowners, promoters or developers where each side contributes different strategic strengths."],
              ["Promoter Transition", "Acquire full or partial ownership where an existing promoter is seeking an orderly exit."],
              ["Asset Monetisation", "Acquire non-core assets being sold to release liquidity for the seller's continuing operations."],
              ["Structured Capital", "Explore equity or structured investment opportunities where project or business fundamentals support further diligence."],
            ].map(([title, desc]) => (
              <article className="investor" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. Mandate Form ─────────────────────────────────── */}
      <section className="estabizz-section ivory-bg" id="mandate">
        <div className="estabizz-container">
          <div className="mandate">
            <div className="mandate-copy">
              <div className="eyebrow-text" style={{ color: "#d9c39c" }}><span className="eyebrow-line" style={{ background: "#d9c39c" }} />Start privately</div>
              <h3>Tell Us What Still Holds Value.</h3>
              <p>You do not need to arrive with the transaction structure decided. Start with the company, project, assets, current pressure and what you want to achieve.</p>
              <div className="nc-quote light mt-6">
                "The first conversation is not about selling. It is about understanding what options may still exist."
              </div>
            </div>
            <div className="mandate-form">
              <NextChapterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ ──────────────────────────────────────────── */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container">
          <div className="nc-section-head">
            <div className="nc-label">
              <div className="eyebrow-text"><span className="eyebrow-line" />Important perspective</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-[#182129]"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, lineHeight: 1.15 }}>
                Next Chapter Is About Options—not Promises.
              </h2>
            </div>
          </div>

          <div className="nc-faq">
            <details>
              <summary>Does CityAuction guarantee an investor, buyer or JV partner?</summary>
              <p>No. CityAuction can support opportunity preparation, market mapping, introductions, buyer/investor discovery and transaction coordination. Investor appetite, valuation, funding, diligence and final transaction decisions remain with the relevant parties.</p>
            </details>
            <details>
              <summary>Does CityAuction provide investment banking, legal or financial advice?</summary>
              <p>CityAuction&apos;s role should be defined by the specific engagement. Where regulated, legal, tax, valuation or other specialist advice is required, such work should be undertaken through appropriately qualified or authorised professionals.</p>
            </details>
            <details>
              <summary>Can a project be marketed privately?</summary>
              <p>Yes. A private mandate can be structured so that the opportunity is approached only to selected counterparties and sensitive information is released progressively under confidentiality arrangements.</p>
            </details>
            <details>
              <summary>Can the promoter remain involved after a transaction?</summary>
              <p>Potentially. The structure may involve full exit, partial exit, continuing minority ownership, JV participation or another negotiated arrangement depending on the parties and transaction context.</p>
            </details>
            <details>
              <summary>Can CityAuction help if the company is already in insolvency or a formal lender-led process?</summary>
              <p>The governing legal process and authority of the Resolution Professional, Liquidator, lenders, committee of creditors, tribunal or other competent stakeholder will control what can be done. CityAuction can only act within the scope lawfully permitted and expressly engaged.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ─── 13. CTA ──────────────────────────────────────────── */}
      <section className="estabizz-section ivory-bg">
        <div className="estabizz-container">
          <div className="nc-cta">
            <div style={{ maxWidth: "600px" }}>
              <div className="eyebrow-text" style={{ color: "#d9c39c" }}><span className="eyebrow-line" style={{ background: "#d9c39c" }} />CityAuction Next Chapter</div>
              <h2 className="font-serif-heading text-white mt-3"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontWeight: 600, lineHeight: 1.15 }}>
                What You Built May Still Deserve a Future.
              </h2>
              <p className="mt-3 leading-relaxed" style={{ fontSize: ".95rem", color: "#bac4ca" }}>
                Whether the right answer is a new investor, a joint venture, a strategic buyer, a project
                sale or a structured exit, the next step begins by understanding what still holds value.
              </p>
            </div>
            <div className="nc-cta-actions">
              <a className="btn-pill btn-gold" href="#mandate">Start a Private Discussion</a>
              <a className="btn-pill btn-ghost" href="mailto:info@estabizz.com?subject=CityAuction%20Next%20Chapter">
                Contact Next Chapter Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 14. Statutory Disclosure ─────────────────────────── */}
      <section className="bg-[#060b0f] text-[#87939c] text-xs py-10 border-t border-[#1a242b]">
        <div className="estabizz-container">
          <div className="p-5 border border-[#1a242b] rounded-2xl bg-[#0a1116] leading-relaxed">
            <strong className="text-[#c9d2d7]">Important:</strong> CityAuction Next Chapter is intended as a
            strategic opportunity-discovery, introduction and transaction-support offering. It does not
            guarantee funding, sale, valuation, restructuring or transaction completion. Any legal, tax,
            valuation, securities, investment-banking, insolvency, financing or other regulated/specialist
            work must be undertaken within the applicable legal framework and, where required, through
            appropriately qualified or authorised professionals. Formal insolvency, lender-enforcement or
            tribunal-led processes remain subject to the authority of the relevant statutory stakeholders and
            governing law.
          </div>
        </div>
      </section>

    </div>
  );
}

