import Link from "next/link";
import type { Metadata } from "next";
import { NextChapterForm } from "@/components/forms/next-chapter-form";

export const metadata: Metadata = {
  title: "CityAuction Next Chapter | Strategic Capital, Project Sale, JV & Business Transition",
  description:
    "CityAuction Next Chapter helps asset-backed companies, developers and projects explore strategic options including business sale, project sale, JV, investor induction, capital partnership, asset monetisation and promoter exit.",
  alternates: {
    canonical: "/next-chapter",
  },
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
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="container hero-row">
          <div>
            <div className="eyebrow !text-[#d9c39c]">CityAuction Next Chapter</div>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
              A Difficult Chapter<br />
              <em className="text-[#dbc39a] not-italic font-normal">Does Not Have to Be the Final One.</em>
            </h1>
            <p className="hero-copy">
              A company can face liquidity pressure and still own valuable land, projects, factories, licences, receivables or an operating business. A developer can be short of capital while the project itself still holds substantial potential.
            </p>
            <div className="hero-promise">
              We do not begin with what went wrong. We begin with what still holds value—and who may be able to take it forward.
            </div>
            <div className="actions">
              <a className="btn btn-gold" href="#solutions">
                Explore Strategic Options
              </a>
              <a className="btn btn-ghost" href="#mandate">
                Discuss Your Situation Privately
              </a>
            </div>
          </div>

          <aside className="hero-card">
            <div className="eyebrow">Choose your pathway</div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#182129] mt-2">
              What needs its next chapter?
            </h3>
            <p className="text-xs text-[#6f777d] mt-2">
              CityAuction separates company-level situations from development-project situations so the right buyer, investor or partner universe can be built around the opportunity.
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
          </aside>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The philosophy</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                Financial Pressure Changes the Situation. It Does Not Automatically Destroy the Value.
              </h2>
              <p className="lead mt-4">
                When liquidity becomes difficult, the instinct is often to focus on the problem. CityAuction Next Chapter focuses first on the underlying value—then on the transaction structure that may preserve, transfer or unlock it.
              </p>
            </div>
          </div>

          <div className="core-grid">
            <article className="core">
              <small>Value</small>
              <h3>What Still Works?</h3>
              <p>
                Land, project rights, licences, customers, brand, plant, receivables, approvals, inventory and operating infrastructure may still carry strategic value.
              </p>
            </article>
            <article className="core">
              <small>Structure</small>
              <h3>What Could Change?</h3>
              <p>
                The promoter, capital structure, ownership, project partner, asset mix or funding model may need to change even when the underlying opportunity remains viable.
              </p>
            </article>
            <article className="core">
              <small>Market</small>
              <h3>Who Could Take It Forward?</h3>
              <p>
                Strategic buyers, developers, funds, family offices, HNIs, industry participants and other investors may see value differently from the existing capital structure.
              </p>
            </article>
          </div>

          <div className="quote">“Value does not disappear because liquidity does.”</div>
        </div>
      </section>

      {/* 3. Story Section */}
      <section className="section ivory">
        <div className="container story-grid">
          <div className="story-visual">
            <div className="story-note">
              <p>
                “Sometimes protecting what you built means finding the capital, partner or owner who can take it further.”
              </p>
            </div>
          </div>
          <div className="story-copy">
            <div className="eyebrow">What CityAuction sees</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129] mt-3">
              Behind the Stress, There May Still Be a Business Worth Buying—or a Project Worth Completing.
            </h2>
            <p>
              A difficult balance sheet can sit on valuable land. A stalled project can have approvals, inventory and future cash flow. A promoter seeking an exit may still own an operating business, customers and infrastructure that a strategic buyer would value.
            </p>
            <p>
              That is why CityAuction Next Chapter is not designed as a “distressed company listing” page.
            </p>
            <p>
              It is a strategic marketplace for situations where ownership, capital or execution may need to change so that underlying value can continue.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Strategic Options */}
      <section className="section dark" id="solutions">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow !text-[#d9c39c]">Strategic options</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-white">
                One Difficult Situation Can Have More Than One Way Forward.
              </h2>
              <p className="lead !text-[#aeb9c1] mt-4">
                The objective is not to force every situation into a sale. The objective is to identify the structure that may preserve the most commercial value.
              </p>
            </div>
          </div>

          <div className="solution-grid">
            <article className="solution">
              <h3>Sell the Company</h3>
              <p>Explore a full or controlling-stake sale where a strategic buyer or investor can take the business forward.</p>
            </article>
            <article className="solution">
              <h3>Sell the Project</h3>
              <p>Transfer a development or operating project to a buyer capable of funding and completing it.</p>
            </article>
            <article className="solution">
              <h3>Joint Venture</h3>
              <p>Combine existing land, approvals, rights or operating capability with incoming capital and execution strength.</p>
            </article>
            <article className="solution">
              <h3>Investor Induction</h3>
              <p>Bring in strategic or financial capital without necessarily transferring full control of the business or project.</p>
            </article>
            <article className="solution">
              <h3>Asset Monetisation</h3>
              <p>Release liquidity from land, buildings, inventory, factories, machinery or non-core assets.</p>
            </article>
            <article className="solution">
              <h3>Promoter Exit</h3>
              <p>Structure an orderly full or partial exit where the promoter prefers a transition rather than continued capital commitment.</p>
            </article>
            <article className="solution">
              <h3>Strategic Partnership</h3>
              <p>Introduce an operating, development, distribution or industry partner who contributes more than capital.</p>
            </article>
            <article className="solution">
              <h3>Turnaround Capital</h3>
              <p>Explore special-situation capital for viable businesses or projects where the funding gap is the primary constraint.</p>
            </article>
          </div>

          <div className="quote !text-[#e7d7bd]">
            “Sometimes the best resolution is not to sell the asset. It is to find the capital, partner or owner who can take it forward.”
          </div>
        </div>
      </section>

      {/* 5. Two Distinct Journeys */}
      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Two distinct journeys</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                Companies and Development Projects Need Different Conversations.
              </h2>
            </div>
          </div>

          <div className="two-path">
            <article className="big-path">
              <small>Path 01</small>
              <h3>For Companies</h3>
              <p>
                A company may have debt or cash-flow pressure while still owning a viable business, real estate, machinery, licences, receivables or strategic market access.
              </p>
              <ul>
                <li>Company / business sale</li>
                <li>Strategic investor induction</li>
                <li>Promoter stake sale or exit</li>
                <li>Non-core asset monetisation</li>
                <li>Strategic partner search</li>
                <li>Turnaround / special-situation capital</li>
              </ul>
              <div className="actions mt-6">
                <a className="btn btn-dark" href="#companies">
                  Explore Company Path →
                </a>
              </div>
            </article>

            <article className="big-path alt">
              <small>Path 02</small>
              <h3>For Developers &amp; Projects</h3>
              <p>
                A project can stop because capital has stopped—not because the land, approvals, construction or development potential has disappeared.
              </p>
              <ul>
                <li>Project sale</li>
                <li>Joint venture / development partner</li>
                <li>Project-level investor induction</li>
                <li>Completion / structured capital</li>
                <li>Land or inventory monetisation</li>
                <li>Developer / sponsor transition</li>
              </ul>
              <div className="actions mt-6">
                <a className="btn btn-gold" href="#developers">
                  Explore Developer Path →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6. For Companies */}
      <section className="section ivory" id="companies">
        <div className="container company-grid">
          <div className="case-copy">
            <div className="eyebrow">For companies</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129] mt-3">
              A Business Can Be Financially Stressed and Commercially Valuable at the Same Time.
            </h2>
            <p>
              The existing capital structure may no longer work, but the company may still have customers, assets, licences, infrastructure, receivables, intellectual property, operating capability or strategic market access.
            </p>
            <p>
              CityAuction Next Chapter helps organise that value into a transaction story that can be presented to selected buyers, investors and strategic partners.
            </p>
            <div className="quote">“A difficult balance sheet can still sit on a valuable business.”</div>
          </div>

          <div className="case-items">
            <div className="case-item">
              <strong>Business Sale</strong>
              Full business or controlling interest to a strategic acquirer.
            </div>
            <div className="case-item">
              <strong>Equity / Strategic Investment</strong>
              Capital infusion alongside existing promoters where appropriate.
            </div>
            <div className="case-item">
              <strong>Promoter Exit</strong>
              Full or partial stake transition to a suitable counterparty.
            </div>
            <div className="case-item">
              <strong>Asset-Backed Opportunity</strong>
              Present land, factory, commercial assets and operating business together where commercially relevant.
            </div>
            <div className="case-item">
              <strong>Non-Core Asset Sale</strong>
              Monetise selected assets to release liquidity without selling the entire company.
            </div>
            <div className="case-item">
              <strong>Strategic Partnership</strong>
              Bring in an industry participant capable of adding capital, execution, distribution or operating strength.
            </div>
            <div className="case-item">
              <strong>Turnaround Capital</strong>
              Introduce capital providers interested in special situations where a viable path forward exists.
            </div>
            <div className="case-item">
              <strong>Transaction Preparation</strong>
              Build an investor-ready information pack, asset schedule and controlled diligence process.
            </div>
          </div>
        </div>
      </section>

      {/* 7. For Developers & Projects */}
      <section className="section white" id="developers">
        <div className="container developer-grid">
          <div className="case-items">
            <div className="case-item">
              <strong>Sell the Project</strong>
              Transfer the project to another developer, investor or strategic acquirer.
            </div>
            <div className="case-item">
              <strong>Joint Venture / Joint Development</strong>
              Retain participation while bringing in capital and execution capability.
            </div>
            <div className="case-item">
              <strong>Project-Level Investor</strong>
              Raise equity or structured capital against the project&apos;s future potential.
            </div>
            <div className="case-item">
              <strong>Completion Capital</strong>
              Explore funding for construction completion where the underlying project remains viable.
            </div>
            <div className="case-item">
              <strong>Land Monetisation</strong>
              Sell or partly monetise surplus or non-core land to fund the main project.
            </div>
            <div className="case-item">
              <strong>Inventory Monetisation</strong>
              Explore structured sale of unsold residential, commercial or other inventory.
            </div>
            <div className="case-item">
              <strong>Development Partner</strong>
              Bring in a stronger developer / sponsor with execution and market capability.
            </div>
            <div className="case-item">
              <strong>Project Transition</strong>
              Structure a new path where the current promoter no longer wishes or is unable to continue.
            </div>
          </div>

          <div className="case-copy">
            <div className="eyebrow">For developers &amp; projects</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129] mt-3">
              The Building Stopped. The Opportunity Didn&apos;t.
            </h2>
            <p>
              A developer may already have acquired the land, obtained approvals, created project infrastructure, completed part of the construction or sold inventory—then face a funding gap that slows or stops execution.
            </p>
            <p>
              CityAuction Next Chapter helps reposition that situation as a project opportunity for another developer, capital partner, fund, family office or strategic investor.
            </p>
            <div className="quote">“Partially created value does not have to become permanently stranded value.”</div>
          </div>
        </div>
      </section>

      {/* 8. Process */}
      <section className="section ivory" id="process">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">How CityAuction supports the next chapter</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                From Financial Pressure to Strategic Options.
              </h2>
              <p className="lead mt-4">The process is designed to understand the situation before approaching the market.</p>
            </div>
          </div>

          <div className="framework">
            <article className="frame">
              <div className="num">01</div>
              <h3>Understand</h3>
              <p>Review the company/project, assets, liabilities, current funding position, stakeholder pressure and promoter objective.</p>
            </article>
            <article className="frame">
              <div className="num">02</div>
              <h3>Map the Value</h3>
              <p>Identify land, project rights, business operations, licences, receivables, inventory and other strategic assets.</p>
            </article>
            <article className="frame">
              <div className="num">03</div>
              <h3>Design the Options</h3>
              <p>Compare sale, JV, investor induction, asset monetisation, strategic partnership or promoter-exit routes.</p>
            </article>
            <article className="frame">
              <div className="num">04</div>
              <h3>Prepare the Story</h3>
              <p>Create a controlled transaction profile, investment summary and supporting information package.</p>
            </article>
            <article className="frame">
              <div className="num">05</div>
              <h3>Identify the Market</h3>
              <p>Define the right universe of strategic buyers, developers, funds, family offices or special-situation investors.</p>
            </article>
            <article className="frame">
              <div className="num">06</div>
              <h3>Approach Discreetly</h3>
              <p>Use public, confidential or private-mandate outreach depending on the sensitivity of the situation.</p>
            </article>
            <article className="frame">
              <div className="num">07</div>
              <h3>Evaluate Interest</h3>
              <p>Coordinate NDA, management discussions, site visits, indicative offers and preliminary transaction structures.</p>
            </article>
            <article className="frame">
              <div className="num">08</div>
              <h3>Move Toward Closing</h3>
              <p>Coordinate due diligence and the agreed transaction process with the relevant legal, tax, financial and technical advisers.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 9. Confidentiality */}
      <section className="section dark" id="confidentiality">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow !text-[#d9c39c]">Discreet by design</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-white">
                Not Every Situation Belongs on a Public Marketplace.
              </h2>
              <p className="lead !text-[#aeb9c1] mt-4">
                Financial stress, promoter transition and capital discussions can be highly sensitive. CityAuction Next Chapter should support different levels of market visibility.
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

          <div className="quote !text-[#e7d7bd]">
            “Sometimes the most valuable part of the process is knowing who should hear the opportunity—and who should not.”
          </div>
        </div>
      </section>

      {/* 10. For Investors & Strategic Buyers */}
      <section className="section white" id="investors">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">For investors &amp; strategic buyers</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                Special Situations Can Create Entry Points the Conventional Market Does Not.
              </h2>
              <p className="lead mt-4">
                Financial stress is not itself an investment thesis. The opportunity must make sense after liabilities, capital requirement, legal position and execution risk are understood.
              </p>
            </div>
          </div>

          <div className="investor-grid">
            <article className="investor">
              <h3>Strategic Acquisition</h3>
              <p>Acquire a business, competitor, licence, operating platform or asset base that complements an existing business.</p>
            </article>
            <article className="investor">
              <h3>Land-Backed Opportunities</h3>
              <p>Evaluate companies or projects where underlying land and development potential form an important part of the value proposition.</p>
            </article>
            <article className="investor">
              <h3>Project Revival</h3>
              <p>Enter projects where capital, execution or sponsorship needs to change for development to continue.</p>
            </article>
            <article className="investor">
              <h3>Turnaround Situations</h3>
              <p>Evaluate operating businesses where the commercial core remains viable but the current capital structure is under pressure.</p>
            </article>
            <article className="investor">
              <h3>JV Opportunities</h3>
              <p>Partner with landowners, promoters or developers where each side contributes different strategic strengths.</p>
            </article>
            <article className="investor">
              <h3>Promoter Transition</h3>
              <p>Acquire full or partial ownership where an existing promoter is seeking an orderly exit.</p>
            </article>
            <article className="investor">
              <h3>Asset Monetisation</h3>
              <p>Acquire non-core assets being sold to release liquidity for the seller&apos;s continuing operations.</p>
            </article>
            <article className="investor">
              <h3>Structured Capital</h3>
              <p>Explore equity or structured investment opportunities where project or business fundamentals support further diligence.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 11. Intake Mandate Form */}
      <section className="section ivory" id="mandate">
        <div className="container">
          <div className="mandate">
            <div className="mandate-copy">
              <div className="eyebrow !text-[#d9c39c]">Start privately</div>
              <h3 className="font-serif-heading text-3xl font-semibold text-white mt-2">
                Tell Us What Still Holds Value.
              </h3>
              <p className="text-sm text-[#b7c1c8] mt-3">
                You do not need to arrive with the transaction structure decided. Start with the company, project, assets, current pressure and what you want to achieve.
              </p>
              <div className="quote !text-[#e7d7bd] mt-6">
                “The first conversation is not about selling. It is about understanding what options may still exist.”
              </div>
            </div>

            <div className="mandate-form">
              <NextChapterForm />
            </div>
          </div>
        </div>
      </section>

      {/* 12. Important Perspective FAQs */}
      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Important perspective</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold text-[#182129]">
                Next Chapter Is About Options—not Promises.
              </h2>
            </div>
          </div>

          <div className="faq-accordion space-y-1">
            <details>
              <summary>Does CityAuction guarantee an investor, buyer or JV partner?</summary>
              <p>
                No. CityAuction can support opportunity preparation, market mapping, introductions, buyer/investor discovery and transaction coordination. Investor appetite, valuation, funding, diligence and final transaction decisions remain with the relevant parties.
              </p>
            </details>
            <details>
              <summary>Does CityAuction provide investment banking, legal or financial advice?</summary>
              <p>
                CityAuction&apos;s role should be defined by the specific engagement. Where regulated, legal, tax, valuation or other specialist advice is required, such work should be undertaken through appropriately qualified or authorised professionals.
              </p>
            </details>
            <details>
              <summary>Can a project be marketed privately?</summary>
              <p>
                Yes. A private mandate can be structured so that the opportunity is approached only to selected counterparties and sensitive information is released progressively under confidentiality arrangements.
              </p>
            </details>
            <details>
              <summary>Can the promoter remain involved after a transaction?</summary>
              <p>
                Potentially. The structure may involve full exit, partial exit, continuing minority ownership, JV participation or another negotiated arrangement depending on the parties and transaction context.
              </p>
            </details>
            <details>
              <summary>Can CityAuction help if the company is already in insolvency or a formal lender-led process?</summary>
              <p>
                The governing legal process and authority of the Resolution Professional, Liquidator, lenders, committee of creditors, tribunal or other competent stakeholder will control what can be done. CityAuction can only act within the scope lawfully permitted and expressly engaged.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 13. CTA Section */}
      <section className="section ivory">
        <div className="container">
          <div className="cta">
            <div>
              <div className="eyebrow !text-[#d9c39c]">CityAuction Next Chapter</div>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-white mt-2.5">
                What You Built May Still Deserve a Future.
              </h2>
              <p className="text-sm text-[#bac4ca] mt-3 max-w-xl">
                Whether the right answer is a new investor, a joint venture, a strategic buyer, a project sale or a structured exit, the next step begins by understanding what still holds value.
              </p>
            </div>
            <div className="actions mt-0">
              <a className="btn btn-gold" href="#mandate">
                Start a Private Discussion
              </a>
              <a
                className="btn btn-ghost"
                href="mailto:info@estabizz.com?subject=CityAuction%20Next%20Chapter"
              >
                Contact Next Chapter Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Statutory Disclosure */}
      <section className="bg-[#060b0f] text-[#87939c] text-xs py-8 border-t border-[#1a242b]">
        <div className="container">
          <div className="p-5 border border-[#1a242b] rounded-2xl bg-[#0a1116] leading-relaxed">
            <strong className="text-[#c9d2d7]">Important:</strong> CityAuction Next Chapter is intended as a strategic opportunity-discovery, introduction and transaction-support offering. It does not guarantee funding, sale, valuation, restructuring or transaction completion. Any legal, tax, valuation, securities, investment-banking, insolvency, financing or other regulated/specialist work must be undertaken within the applicable legal framework and, where required, through appropriately qualified or authorised professionals. Formal insolvency, lender-enforcement or tribunal-led processes remain subject to the authority of the relevant statutory stakeholders and governing law.
          </div>
        </div>
      </section>
    </div>
  );
}
