import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customs Auctions in India | CityAuction Customs Auction Marketplace Guide",
  description:
    "Explore Customs auction opportunities in India, understand MSTC registration, inspection, EMD, bidding, payment, lifting, statutory compliance and buyer risks with CityAuction.",
  alternates: {
    canonical: "/customs-auction",
  },
  openGraph: {
    type: "website",
    title: "Customs Auctions | Discover Goods. Understand the Process. Bid Prepared.",
    description:
      "A CityAuction guide to Indian Customs e-auctions, MSTC registration, lot inspection, bidding, payments, lifting and compliance.",
    url: "/customs-auction",
    siteName: "CityAuction",
  },
};

export default function CustomsAuctionPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* 1. Hero */}
      <section className="customs-hero">
        <div className="estabizz-container customs-hero-row">
          <div>
            <div className="eyebrow-text">Customs Auctions in India</div>
            <h1 className="text-4xl sm:text-6xl font-serif-heading font-semibold text-white tracking-tight mt-3">
              Goods Enter the Auction.<br />
              <em className="text-[#dbc39a] not-italic">Prepared Buyers See the Opportunity.</em>
            </h1>
            <p className="hero-copy text-[#c7d0d7] text-base sm:text-lg max-w-xl mt-4 leading-relaxed">
              Customs auctions can include unclaimed, uncleared, confiscated, seized, abandoned or otherwise lawfully disposable cargo and goods. CityAuction helps you discover opportunities, understand the lot, prepare for inspection and navigate the authorised auction process with greater clarity.
            </p>
            <div className="quote-block">
              “A Customs lot can look attractive on paper. The real question is what you know about the goods, the compliance and the lifting obligation before you bid.”
            </div>
            <div className="actions-row">
              <Link className="btn-pill btn-gold" href="/auctions?type=OTHER">
                Explore Customs Opportunities
              </Link>
              <a className="btn-pill btn-ghost" href="#process">
                Understand the Process
              </a>
            </div>
          </div>

          <aside className="about-hero-card" id="searchCustoms">
            <div className="eyebrow-text">Customs auction discovery</div>
            <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
              Search by Goods, Port and Auction Stage.
            </h3>
            <p className="text-sm text-[#6f777d] mt-1">
              Filter available Customs inventory and setup alert workflows.
            </p>

            <form action="/auctions" method="GET" className="search-form-grid mt-4">
              <input type="hidden" name="type" value="OTHER" />
              <div className="field-custom">
                <label htmlFor="port">Port / Custom House</label>
                <select id="port" name="city">
                  <option value="">All Locations</option>
                  <option value="Nhava Sheva">JNCH / Nhava Sheva</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Mundra">Mundra</option>
                  <option value="Kandla">Kandla / Deendayal</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="category">Goods Category</label>
                <select id="category" name="category">
                  <option value="">All Goods</option>
                  <option value="INDUSTRIAL">Metal / Scrap</option>
                  <option value="COMMERCIAL">Machinery / Equipment</option>
                  <option value="OTHER">Vehicles</option>
                  <option value="COMMERCIAL">Electronics</option>
                  <option value="AGRICULTURAL">Food / Agri</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="auctionType">Auction Type</label>
                <select id="auctionType" name="auctionType">
                  <option value="">All</option>
                  <option value="FORWARD">E-Auction</option>
                  <option value="SARFAESI">E-Tender</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="status">Stage</label>
                <select id="status" name="status">
                  <option value="UPCOMING">Upcoming</option>
                  <option value="LIVE">Live / Bidding</option>
                  <option value="CLOSED">Result / Post-Bid</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <button className="btn-pill btn-dark w-full mt-2" type="submit">
                  Search Customs Auctions
                </button>
              </div>
            </form>
          </aside>
        </div>
      </section>

      {/* 2. What is a Customs auction? */}
      <section className="estabizz-section bg-white" id="customs">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">What is a Customs auction?</div>
            </div>
            <div>
              <h2>Not a Retail Sale. A Regulated Disposal Process.</h2>
              <p className="lead-text mt-4">
                Customs auctions arise when goods lawfully become available for disposal through the competent Customs authority or custodian process. The authorised Custom House, seller/custodian and auction platform determine what is offered, who may bid, how inspection happens and how delivery is released.
              </p>
            </div>
          </div>

          <div className="customs-what-grid">
            <article className="customs-what-card">
              <small>Why goods reach auction</small>
              <h3>Unclaimed / Uncleared Cargo</h3>
              <p>Imported cargo may become eligible for disposal when it remains uncleared beyond the applicable process and statutory requirements.</p>
            </article>
            <article className="customs-what-card">
              <small>Enforcement &amp; Adjudication</small>
              <h3>Seized / Confiscated Goods</h3>
              <p>Certain goods may be disposed after adjudication or other lawful Customs action, subject to restrictions and disposal instructions.</p>
            </article>
            <article className="customs-what-card">
              <small>Other Disposal Cases</small>
              <h3>Abandoned / Relinquished / Departmental Goods</h3>
              <p>Other categories may enter auction or disposal depending on the legal status of the goods and the competent authority&apos;s directions.</p>
            </article>
          </div>

          <div className="quote-block">
            “In Customs auctions, the lot description starts the enquiry. Inspection and compliance complete it.”
          </div>
        </div>
      </section>

      {/* 3. Customs auction universe */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg" id="goods">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Customs auction universe</div>
            </div>
            <div>
              <h2 className="text-white">The Goods Can Change Completely From One Auction to the Next.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                Current and recent Customs notices demonstrate how varied the inventory can be—from metal scrap and used vehicles to agricultural commodities and other imported cargo.
              </p>
            </div>
          </div>

          <div className="customs-goods-grid">
            <article className="customs-good-card">
              <h3>Metal &amp; Scrap</h3>
              <p>Heavy melting scrap, steel scrap, wire scrap, baled rubber scrap and other recyclable materials.</p>
            </article>
            <article className="customs-good-card">
              <h3>Vehicles</h3>
              <p>Old or used cars and other vehicles where sale is permitted under the applicable Customs and transport conditions.</p>
            </article>
            <article className="customs-good-card">
              <h3>Food &amp; Agricultural Goods</h3>
              <p>Products such as pulses, peas, nuts and other commodities, subject to condition, shelf life and statutory approvals.</p>
            </article>
            <article className="customs-good-card">
              <h3>Machinery &amp; Equipment</h3>
              <p>Industrial machinery, equipment, tools and imported production assets.</p>
            </article>
            <article className="customs-good-card">
              <h3>Electronics &amp; Electrical Goods</h3>
              <p>Electronic items, components and equipment where lawful sale and required standards/compliance permit.</p>
            </article>
            <article className="customs-good-card">
              <h3>Textiles &amp; Consumer Goods</h3>
              <p>Garments, fabrics, packaged commodities and other consumer merchandise.</p>
            </article>
            <article className="customs-good-card">
              <h3>Industrial Raw Materials</h3>
              <p>Polymers, paper, chemicals, rubber, metal products and other commercial inputs, subject to statutory conditions.</p>
            </article>
            <article className="customs-good-card">
              <h3>Special / Restricted Categories</h3>
              <p>Certain goods require specific licences, NOCs, testing, destruction conditions or may not be freely saleable to every bidder.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. How a Customs auction works */}
      <section className="estabizz-section bg-[#f6f2ea]" id="process">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How a Customs auction works</div>
            </div>
            <div>
              <h2>From Registration to Lifting—Know Every Stage Before You Bid.</h2>
              <p className="lead-text mt-4">
                The auction catalogue and sale notice always prevail. This is the practical journey a bidder should expect in a typical Customs e-auction / e-tender environment.
              </p>
            </div>
          </div>

          <div className="hiw-journey-grid">
            <article className="hiw-step-card">
              <div className="hiw-step-no">01</div>
              <h3>Register</h3>
              <p>Create and activate the required buyer/bidder account on the designated auction portal.</p>
              <div className="micro">Verify current KYC &amp; registration conditions.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">02</div>
              <h3>Find the Lot</h3>
              <p>Review auction notice, lot number, description, quantity, warehouse/CFS, EMD and auction date.</p>
              <div className="micro">Do not rely only on a summary listing.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">03</div>
              <h3>Check Eligibility</h3>
              <p>Confirm whether the lot requires a particular licence, registration, product approval, user status or statutory NOC.</p>
              <div className="micro">Some lots are not open to every buyer.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">04</div>
              <h3>Inspect</h3>
              <p>Visit the designated CFS, warehouse, port or storage location within the inspection window permitted by the notice.</p>
              <div className="micro">Inspection is critical for “as-is-where-is” lots.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">05</div>
              <h3>Deposit Required EMD</h3>
              <p>Pay pre-bid EMD/caution money/security deposit where prescribed, using only the method stated in the auction notice.</p>
              <div className="micro">Amount varies by auction and lot.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">06</div>
              <h3>Bid Online</h3>
              <p>Participate through the authorised e-auction/e-tender portal. Lot-wise bidding and auto-extension rules may apply.</p>
              <div className="micro">Never assume the first scheduled close is final.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">07</div>
              <h3>Post-Bid Payment</h3>
              <p>If sold/accepted or subject to approval, follow the portal&apos;s post-bid security deposit and balance-payment timelines.</p>
              <div className="micro">Missing deadlines can lead to forfeiture/debarment.</div>
            </article>
            <article className="hiw-step-card">
              <div className="hiw-step-no">08</div>
              <h3>Release &amp; Lift</h3>
              <p>Obtain the required delivery/release documentation and remove goods within the prescribed period from the seller&apos;s premises.</p>
              <div className="micro">Storage, handling and delay costs can matter.</div>
            </article>
          </div>
        </div>
      </section>

      {/* 5. MSTC Gateway */}
      <section className="estabizz-section bg-white" id="mstc">
        <div className="estabizz-container">
          <div className="data-room-box">
            <div className="room-left-panel">
              <div className="eyebrow-text">MSTC &amp; Indian Customs</div>
              <h3>A Centralised Auction Gateway.</h3>
              <p>
                Indian Customs and MSTC operate a centralised e-auction/e-tender environment so bidders can access Customs auctions through a common registration route rather than registering separately with every Custom House.
              </p>
              <div className="quote-block">
                “One registration can open the door to multiple Customs auction opportunities—but every auction still has its own lot conditions.”
              </div>
            </div>

            <div className="room-items-grid">
              <div className="room-item-box">
                <strong>Buyer Registration</strong>
                Create and activate the required bidder profile and complete current KYC/document requirements.
              </div>
              <div className="room-item-box">
                <strong>Current Portal Fee</strong>
                MSTC&apos;s Customs portal presently states ₹10,000 + GST for registration valid for 10 years. Always confirm current terms before payment.
              </div>
              <div className="room-item-box">
                <strong>Live &amp; Forthcoming Auctions</strong>
                Registered buyers can access scheduled and live auction/e-tender events.
              </div>
              <div className="room-item-box">
                <strong>Lot-Wise Bidding</strong>
                Each lot is bid separately in the e-auction workflow.
              </div>
              <div className="room-item-box">
                <strong>Auto Bid</strong>
                The portal&apos;s bidder guide describes an auto-bid function subject to the stated incremental value and upper limit.
              </div>
              <div className="room-item-box">
                <strong>Auto Extension</strong>
                The bidder guide states that late bids can extend a lot&apos;s closing time under the applicable auction logic.
              </div>
              <div className="room-item-box">
                <strong>Sale / STA Status</strong>
                Some outcomes may be sold, subject to approval (STA) or pending depending on reserve-price comparison and seller decision.
              </div>
              <div className="room-item-box">
                <strong>Payment Deadlines</strong>
                The portal publishes post-bid security and balance-payment timelines; auction-specific notice and system status must be followed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How bidding behaves */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How bidding behaves</div>
            </div>
            <div>
              <h2 className="text-white">Customs E-Auctions Reward Prepared Bidders, Not Last-Minute Guesswork.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                The official MSTC bidder guide describes multiple mechanics that materially affect strategy and settlement.
              </p>
            </div>
          </div>

          <div className="methods-grid">
            <article className="method-card">
              <h3>Upward Bidding Only</h3>
              <p>In e-auction mode, a bidder may increase a bid multiple times, but downward revision is not permitted.</p>
            </article>
            <article className="method-card">
              <h3>H1 Visibility</h3>
              <p>The auction floor may display the current highest price for the lot, while bidder identity remains undisclosed.</p>
            </article>
            <article className="method-card">
              <h3>Auto Extension</h3>
              <p>Late bids can extend the lot closing time. Bid based on your value ceiling, not on an assumption that the clock will simply expire.</p>
            </article>
            <article className="method-card">
              <h3>Auto Bid Facility</h3>
              <p>The portal may allow the system to bid on your behalf up to a specified ceiling and increment under stated conditions.</p>
            </article>
            <article className="method-card">
              <h3>Reserve Price Comparison</h3>
              <p>Final system/seller treatment can depend on whether the net highest price meets reserve or falls within an approval range.</p>
            </article>
            <article className="method-card">
              <h3>Default Has Consequences</h3>
              <p>Failure to complete prescribed post-bid payments can lead to forfeiture, login deactivation and restrictions on future participation.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 7. Before you bid */}
      <section className="estabizz-section bg-[#f6f2ea]" id="before-bid">
        <div className="estabizz-container marketing-grid">
          <div>
            <div className="eyebrow-text">Before you bid</div>
            <h2 className="mt-3">Inspect the Goods. Then Inspect the Compliance.</h2>
            <p>
              A low bid on the wrong lot can become expensive after transport, testing, statutory approvals, reconditioning, taxes, storage, packaging and lifting costs are considered.
            </p>
            <p>
              Customs auctions are particularly sensitive to product-specific restrictions. The sale notice, applicable law and competent authority determine whether a bidder can buy, use, resell, process, scrap or otherwise deal with the goods.
            </p>
            <div className="quote-block">
              “The winning bid is not the final cost. The final cost is what it takes to lawfully take possession and put the goods to use.”
            </div>
          </div>

          <div className="channels-grid">
            <div className="channel-box">
              <strong>Lot Description</strong><br />
              Confirm commodity, model, quantity, weight, package count and lot composition.
            </div>
            <div className="channel-box">
              <strong>Physical Condition</strong><br />
              Inspect deterioration, rust, damage, missing components, contamination and storage exposure.
            </div>
            <div className="channel-box">
              <strong>Quantity Risk</strong><br />
              Understand whether weight/quantity is approximate and how shortages/excesses are treated.
            </div>
            <div className="channel-box">
              <strong>Statutory NOCs</strong><br />
              Check FSSAI, Plant Quarantine, Animal Quarantine, ADC, BIS or other PGA conditions where applicable.
            </div>
            <div className="channel-box">
              <strong>Packaged Commodities</strong><br />
              Check Legal Metrology / LMPC requirements where the goods fall within packaged-commodity rules.
            </div>
            <div className="channel-box">
              <strong>Vehicle Compliance</strong><br />
              For vehicles, examine registration, homologation, roadworthiness, age/import restrictions and RTO feasibility.
            </div>
            <div className="channel-box">
              <strong>Taxes &amp; Charges</strong><br />
              Model applicable taxes/duties, portal charges, handling, storage, transport and other payable amounts.
            </div>
            <div className="channel-box">
              <strong>Lifting Logistics</strong><br />
              Confirm equipment, labour, gate permissions, packaging, loading, transport and removal deadline.
            </div>
          </div>
        </div>
      </section>

      {/* 8. Compliance */}
      <section className="estabizz-section bg-white">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Compliance can decide the deal</div>
            </div>
            <div>
              <h2>Some Lots Need More Than the Highest Bid.</h2>
              <p className="lead-text mt-4">
                Product-specific laws, participating government agency approvals and auction-notice conditions can determine whether a sale proceeds and what the successful bidder must do.
              </p>
            </div>
          </div>

          <div className="liq-services-grid">
            <article className="liq-service-card">
              <h3>Food &amp; Agricultural Cargo</h3>
              <p>Quality, expiry/shelf life, food-safety permissions, plant/animal quarantine and end-use conditions may materially affect sale and lifting.</p>
            </article>
            <article className="liq-service-card">
              <h3>Packaged Consumer Goods</h3>
              <p>Legal Metrology, labelling, import compliance, BIS or other product standards can be relevant depending on the goods.</p>
            </article>
            <article className="liq-service-card">
              <h3>Scrap / Waste / Hazardous Material</h3>
              <p>Environment, waste-management, pollution-control and authorised-user requirements may apply to purchase, processing or disposal.</p>
            </article>
            <article className="liq-service-card">
              <h3>Vehicles &amp; Machinery</h3>
              <p>Registration feasibility, import status, fitness, dismantling conditions, standards and end-use can be decisive.</p>
            </article>
            <article className="liq-service-card">
              <h3>Restricted / Sensitive Goods</h3>
              <p>Certain categories may need licences, special permissions or may be sold only to eligible entities under specific conditions.</p>
            </article>
            <article className="liq-service-card">
              <h3>Notice-Specific Conditions</h3>
              <p>A Custom House can prescribe inspection, delivery and other conditions beyond general portal guidance. The specific notice governs the lot.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 9. Why CityAuction Customs */}
      <section className="estabizz-section bg-[#091118] text-[#edf2f5] dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Why CityAuction Customs</div>
            </div>
            <div>
              <h2 className="text-white">Because Customs Auctions Should Be Easier to Discover—and Harder to Misunderstand.</h2>
              <p className="lead-text mt-4 text-[#aeb9c1]">
                CityAuction does not replace Customs or MSTC. We organise discovery, explain the process and help serious buyers prepare before they enter the authorised auction environment.
              </p>
            </div>
          </div>

          <div className="customs-goods-grid">
            <article className="customs-good-card">
              <h3>Customs Auction Discovery</h3>
              <p>Bring upcoming Customs lots across locations into one searchable CityAuction category.</p>
            </article>
            <article className="customs-good-card">
              <h3>Personalised Lot Alerts</h3>
              <p>Notify buyers when cargo matches their commodity, geography, budget or industry mandate.</p>
            </article>
            <article className="customs-good-card">
              <h3>Notice Interpretation</h3>
              <p>Present dates, EMD, inspection, warehouse, eligibility and special conditions more clearly.</p>
            </article>
            <article className="customs-good-card">
              <h3>Inspection Readiness</h3>
              <p>Help buyers build a lot-specific inspection checklist before visiting the CFS or warehouse.</p>
            </article>
            <article className="customs-good-card">
              <h3>Compliance Intelligence</h3>
              <p>Flag areas where product approvals, licences or specialist review may be needed before participation.</p>
            </article>
            <article className="customs-good-card">
              <h3>Auction Connectivity</h3>
              <p>Direct eligible users to the correct Customs/MSTC auction route rather than presenting CityAuction as the auctioning authority.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 10. Official resources */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Official resources</div>
            </div>
            <div>
              <h2>Know Where the Authoritative Information Lives.</h2>
              <p className="lead-text mt-4">
                CityAuction can simplify discovery, but the authorised notice and government/auction-platform sources remain essential.
              </p>
            </div>
          </div>

          <div className="resource-grid">
            <a
              className="resource-card"
              href="https://www.mstcecommerce.com/auctionhome/customs/index.jsp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Indian Customs / MSTC Portal</strong>
              <span>Registration, auction login and authorised e-auction/e-tender access.</span>
            </a>
            <a
              className="resource-card"
              href="https://www.mstcecommerce.com/auctionhome/customs/BiddersManual.jsp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>MSTC Bidder Guide</strong>
              <span>Official process guidance for Customs e-auction/e-tender buyers.</span>
            </a>
            <a
              className="resource-card"
              href="https://www.icegate.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>ICEGATE</strong>
              <span>Indian Customs National Trade Portal, Customs guidance and trade information.</span>
            </a>
            <a
              className="resource-card"
              href="https://www.jawaharcustoms.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Custom House Notices</strong>
              <span>Check individual Custom House / Commissionerate websites for current auction notices and inspection details.</span>
            </a>
          </div>
        </div>
      </section>

      {/* 11. FAQs */}
      <section className="estabizz-section bg-white" id="faq">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Customs auction FAQs</div>
            </div>
            <div>
              <h2>The Questions a Serious Buyer Should Ask Before Bidding.</h2>
            </div>
          </div>

          <div className="faq-accordion space-y-1">
            <details>
              <summary>Does CityAuction conduct the Customs auction?</summary>
              <p>No. CityAuction is intended to operate as a discovery, information and buyer-support layer. The competent Customs authority, custodian/seller and authorised e-auction platform conduct the auction as specified in the official notice.</p>
            </details>
            <details>
              <summary>Where do Indian Customs e-auctions take place?</summary>
              <p>MSTC operates the centralised Customs e-auction/e-tender portal used for Indian Customs auctions. Individual Custom Houses also publish lot notices and auction information. Always use the auction link specified in the official notice.</p>
            </details>
            <details>
              <summary>Do I need separate registration for every Custom House?</summary>
              <p>MSTC&apos;s Customs portal states that the centralised system allows participation across Custom Houses through a common registration, subject to current portal activation and eligibility requirements.</p>
            </details>
            <details>
              <summary>Is inspection optional?</summary>
              <p>You may decide whether to inspect, but for goods sold on an “as-is-where-is” basis, bidding without inspection can expose you to significant condition, quantity and usability risk. CityAuction strongly recommends inspection where permitted.</p>
            </details>
            <details>
              <summary>Is Customs auction EMD always the same percentage?</summary>
              <p>No. Pre-bid EMD/caution money can be stated as a lot-specific amount or under the relevant auction terms. Never assume a fixed percentage. Follow the official catalogue/notice.</p>
            </details>
            <details>
              <summary>What happens if I win but fail to make the required payment?</summary>
              <p>Official portal conditions can provide for forfeiture, bidder deactivation/debarment and other consequences. Follow the post-bid status and payment deadlines immediately after the auction.</p>
            </details>
            <details>
              <summary>Can I bid on food or packaged goods and simply resell them?</summary>
              <p>Not automatically. Food safety, quarantine, Legal Metrology, labelling, product standards and other statutory conditions may apply. The auction notice and competent authority&apos;s conditions must be checked before bidding.</p>
            </details>
            <details>
              <summary>Does “as-is-where-is” mean Customs guarantees the quality?</summary>
              <p>No. It generally means the goods are offered in their existing condition and location subject to the sale terms. Buyers should inspect and independently assess usability, quantity, quality and compliance.</p>
            </details>
            <details>
              <summary>Can the auction be cancelled even after I show interest?</summary>
              <p>Yes. Auction notices may provide for cancellation, withdrawal, statutory non-compliance, seller approval or other conditions. Participation does not guarantee that a lot will ultimately be sold.</p>
            </details>
            <details>
              <summary>What should I include in my maximum bid calculation?</summary>
              <p>Do not calculate only the hammer/auction price. Include taxes, duties or other applicable charges, loading, handling, storage, transport, compliance/testing, repairs/reconditioning, insurance, finance cost and the margin required for your intended use or resale.</p>
            </details>
          </div>
        </div>
      </section>

      {/* 12. CTA */}
      <section className="estabizz-section bg-[#f6f2ea]">
        <div className="estabizz-container">
          <div className="about-cta-panel">
            <div>
              <div className="eyebrow-text">CityAuction Customs</div>
              <h2 className="mt-2.5">Find the Lot. Understand the Conditions. Bid Prepared.</h2>
              <p>
                Use CityAuction to discover Customs auction opportunities and create commodity-specific alerts. Use the authorised Customs/MSTC route for registration, bidding, payment and official sale completion.
              </p>
            </div>
            <div className="actions-row mt-0">
              <Link href="/auctions?type=OTHER" className="btn-pill btn-gold">
                Explore Customs Auctions
              </Link>
              <Link href="/#alerts" className="btn-pill btn-ghost">
                Create Auction Alert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
