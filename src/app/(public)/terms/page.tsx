import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | CityAuction",
  description:
    "Terms and Conditions governing access to and use of CityAuction, including auction information, marketplace features, alerts, investor support, institutional services and strategic opportunity services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    title: "Terms & Conditions | CityAuction",
    description:
      "Terms and Conditions governing access to and use of CityAuction, including auction information, marketplace features, alerts, investor support, institutional services and strategic opportunity services.",
    url: "/terms",
    siteName: "CityAuction",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1218] to-[#172631] text-white py-20">
        <div className="container">
          <div className="eyebrow !text-[#d9c39c]">Legal Terms of Use</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-base text-[#c4ced4] max-w-3xl mt-4 leading-relaxed">
            These Terms &amp; Conditions govern access to and use of the CityAuction website, marketplace, auction-information services, alerts, investor-support features, institutional services, Customs-auction information, “Next Chapter” opportunities, communication channels and other services operated by Estabizz Fintech Private Limited through the CityAuction venture.
          </p>

          <div className="mt-6 p-4 border border-[rgba(255,255,255,0.12)] rounded-2xl bg-[rgba(255,255,255,0.03)] flex gap-7 flex-wrap text-xs text-[#c4ced4]">
            <span><strong className="text-white">Effective Date:</strong> 27 September 2026</span>
            <span><strong className="text-white">Version:</strong> 1.0</span>
            <span><strong className="text-white">Operator:</strong> Estabizz Fintech Private Limited</span>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <main className="container privacy-layout">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="toc">
          <h3>Contents</h3>
          <a href="#acceptance">1. Acceptance</a>
          <a href="#definitions">2. Definitions</a>
          <a href="#role">3. CityAuction&apos;s Role</a>
          <a href="#eligibility">4. Eligibility &amp; Accounts</a>
          <a href="#information">5. Auction Information</a>
          <a href="#verification">6. Verified Information</a>
          <a href="#diligence">7. Due Diligence</a>
          <a href="#thirdparty">8. Third Parties</a>
          <a href="#auction">9. Auction Participation</a>
          <a href="#emd">10. EMD / Payments</a>
          <a href="#services">11. Paid / Professional Services</a>
          <a href="#alerts">12. Alerts &amp; Matching</a>
          <a href="#institutional">13. Institutional Services</a>
          <a href="#nextchapter">14. Next Chapter</a>
          <a href="#customs">15. Customs Auctions</a>
          <a href="#conduct">16. User Conduct</a>
          <a href="#content">17. User Content</a>
          <a href="#ip">18. Intellectual Property</a>
          <a href="#availability">19. Availability</a>
          <a href="#warranties">20. Disclaimer of Warranties</a>
          <a href="#liability">21. Limitation of Liability</a>
          <a href="#indemnity">22. Indemnity</a>
          <a href="#suspension">23. Suspension / Termination</a>
          <a href="#force">24. Force Majeure</a>
          <a href="#law">25. Governing Law</a>
          <a href="#changes">26. Changes</a>
          <a href="#misc">27. Miscellaneous</a>
          <a href="#contact">28. Contact</a>
        </aside>

        {/* Policy Body */}
        <article className="policy">
          <div className="notice">
            <strong>Please read carefully.</strong> By accessing, browsing, registering with, submitting information to, purchasing or requesting a service from, or otherwise using CityAuction, you agree to be bound by these Terms. If you do not agree, do not use the relevant service. These Terms must be read with the Privacy Policy, Disclaimer, Risk Disclosure, Verified Information Policy and any transaction-specific, institutional, professional or third-party terms applicable to a particular opportunity.
          </div>

          <section id="acceptance" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4] first:border-0 first:pt-0">
              1. Acceptance and Electronic Contract
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              These Terms constitute an electronic record and contractual arrangement between you and Estabizz Fintech Private Limited in relation to CityAuction. Your affirmative action, registration, continued use, form submission, service request, payment, document upload, click acceptance or other legally recognised electronic conduct may constitute acceptance.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where you use CityAuction on behalf of a company, LLP, partnership, trust, institution, fund, bank, NBFC, ARC, corporate debtor, developer, professional firm or other entity, you represent that you have authority to bind that entity.
            </p>
          </section>

          <section id="definitions" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              2. Definitions
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              “CityAuction”, “we”, “us” and “our” mean Estabizz Fintech Private Limited acting through the CityAuction venture unless otherwise stated. “Platform” includes CityAuction websites, dashboards, forms, alerts, databases, interfaces, apps and assisted channels. “Opportunity” includes auction assets, properties, movable assets, businesses, projects, Customs lots, institutional disposals, strategic transactions and other listings or introductions.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              “Auctioning Authority” means the Bank, NBFC, ARC, Liquidator, Insolvency Professional, Recovery Officer, Customs authority, government department, court-appointed person, secured creditor, seller, custodian, e-auction platform or other competent authority responsible for the relevant sale or auction process.
            </p>
          </section>

          <section id="role" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              3. Nature and Limited Role of CityAuction
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction is primarily an auction-information, discovery, marketplace, buyer-engagement and transaction-support platform. Unless expressly stated for a particular transaction in a separate written engagement, CityAuction is <strong>not</strong> the owner of listed assets, borrower, guarantor, secured creditor, lender, seller, Liquidator, Resolution Professional, Recovery Officer, Customs authority, statutory auctioning authority, trustee, broker, auctioneer, e-auction service provider, title insurer or fiduciary of any user.
            </p>
            <div className="legal-box">
              <p><strong>No assumption of statutory functions:</strong> Publication, discovery, marketing, enquiry handling, document organisation, inspection coordination, data-room facilitation, bidder support or other assistance by CityAuction does not transfer to CityAuction the legal or statutory responsibilities of the competent Auctioning Authority.</p>
            </div>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may introduce users to institutions, sellers, professionals, lenders, valuers, lawyers, service providers or other counterparties. An introduction does not constitute endorsement, guarantee, agency, partnership or responsibility for that party&apos;s conduct.
            </p>
          </section>

          <section id="eligibility" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              4. Eligibility, Authority, Accounts and Credentials
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              You must be legally competent to contract and satisfy any eligibility conditions applicable to the relevant service or auction. Auction-specific eligibility may differ and is determined by the Auctioning Authority or sale notice.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              You are responsible for maintaining the confidentiality of login credentials, devices, authentication factors and communications. Activity occurring through your account or credentials may be treated as authorised by you unless promptly reported and otherwise established.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              You must provide accurate, complete and current information. CityAuction may request verification and may reject, restrict or suspend access if information is materially inaccurate, unverifiable, misleading or potentially unlawful.
            </p>
          </section>

          <section id="information" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              5. Auction, Asset and Opportunity Information
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may reproduce, structure, summarise, classify or display information received from institutions, public notices, Auctioning Authorities, authorised representatives, public registries, sellers, professional advisers, users or other sources.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Information displayed on CityAuction may be delayed, incomplete, amended, withdrawn, corrected, superseded or inconsistent with later official material. The authoritative auction notice, corrigendum, addendum, sale terms, Auctioning Authority communication and designated auction platform shall prevail over CityAuction summaries or presentation layers.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not warrant that every auction, amendment, cancellation, extension, reserve-price change, inspection update, litigation development or institutional instruction will be reflected immediately or at all.
            </p>
          </section>

          <section id="verification" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              6. Meaning of “Verified Auction Information”
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where CityAuction uses the expression “Verified Auction Information”, “Verified” or similar wording, it ordinarily means that specified auction particulars have been cross-checked against an institution-provided or publicly available source identified by CityAuction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unless a separate written professional engagement expressly states otherwise, “Verified” does <strong>not</strong> mean or imply independent certification of title, ownership, physical possession, vacant possession, absence of tenancy, absence of litigation, absence of encumbrances, market value, structural condition, legality of construction, land use, regulatory compliance, statutory dues, tax treatment or investment suitability.
            </p>
          </section>

          <section id="diligence" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              7. User Due Diligence and Independent Decision-Making
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              You are solely responsible for determining whether an Opportunity is suitable for you and for undertaking such legal, financial, technical, tax, physical, commercial and regulatory diligence as is appropriate.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Before participating, users should independently review, as applicable, title and ownership records, possession status, encumbrances, mortgages, attachments, litigation, tenancy/occupancy, municipal or society dues, utility dues, land use, approvals, licences, physical condition, access, valuation, taxes, transaction costs and the complete sale notice.
            </p>
            <div className="legal-box">
              <p><strong>No investment recommendation:</strong> CityAuction may organise facts, provide search or comparison tools and coordinate professional services, but does not decide for a user whether to bid, what price to bid, whether an asset is safe, or whether an Opportunity is financially suitable.</p>
            </div>
          </section>

          <section id="thirdparty" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              8. Third-Party Websites, Platforms, Institutions and Professionals
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may contain links to or integrate with Auctioning Authorities, banks, e-auction providers, payment services, government portals, registries, document services, lenders, lawyers, valuers, inspectors, analytics providers or other third parties.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Third-party services are governed by their own terms, eligibility rules, privacy practices, fees, service levels and legal obligations. To the maximum extent permitted by law, CityAuction is not responsible for third-party availability, conduct, professional advice, delay, error, rejection, security, service quality or transaction outcome.
            </p>
          </section>

          <section id="auction" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              9. Auction Participation and Bidder Responsibility
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unless expressly stated otherwise, bidding takes place through the Auctioning Authority or its authorised platform. The user is responsible for timely registration, KYC, document submission, EMD, inspection, bid submission, bidding strategy, payment, compliance and adherence to the governing auction terms.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not guarantee that a user will be registered, accepted as an eligible bidder, permitted to bid, declared highest bidder, confirmed as successful purchaser or issued a sale certificate.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Being the highest bidder may not itself create an unconditional right to purchase. Bid acceptance, confirmation, approval, rejection, cancellation, extension, reserve-price treatment and sale completion remain governed by the relevant sale terms and competent authority.
            </p>
          </section>

          <section id="emd" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              10. EMD, Payments, Refunds, Forfeiture and Transaction Money
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              EMD, bid security, deposits, balance consideration, taxes, charges and other transaction money must be paid strictly through the mechanism identified in the relevant sale notice or by the competent institution. CityAuction does not collect or hold such money unless explicitly identified as the authorised collecting party for a specific transaction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not represent that EMD is always a fixed percentage, that unsuccessful-bidder refunds will occur within a fixed period, or that deposits are unconditionally refundable. Refund, forfeiture, default and payment consequences are controlled by the applicable notice and authority.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users must independently confirm bank-account details and payment instructions from authoritative sources. CityAuction shall not be responsible, to the maximum extent permitted by law, for payments made to fraudulent, impersonated, substituted or unauthorised accounts where the payment channel was not operated or expressly authorised by CityAuction.
            </p>
          </section>

          <section id="services" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              11. Paid Services and Professional-Service Boundaries
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may charge fees for premium alerts, due-diligence coordination, document review support, inspection coordination, valuation coordination, bidder support, institutional marketing, data-room support, transaction support, enterprise services or other products.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The exact scope, deliverables, exclusions, responsibility, fee, timeline and refund treatment may be set out in a separate engagement, proposal, order form, invoice, statement of work or professional mandate. Such document shall prevail for that engagement if inconsistent with these general Terms.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Legal opinions, statutory certifications, valuation reports, technical opinions, tax advice, lending decisions or regulated professional services should be provided by appropriately eligible professionals or institutions. CityAuction&apos;s coordination of such services does not make CityAuction the author or guarantor of the professional conclusion.
            </p>
          </section>

          <section id="alerts" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              12. Personalised Alerts, Search Results and Matching
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Alerts and search results are generated using criteria, source data, rules, software or manual workflows and may not identify every potentially relevant opportunity. A match indicates only that available information appears to correspond with some stated preferences.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Alerts do not constitute a recommendation, suitability assessment, valuation, legal opinion, assurance of availability or guarantee that the user can participate.
            </p>
          </section>

          <section id="institutional" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              13. Institutional Services
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Institutional services may include asset onboarding, digital presentation, buyer discovery, lead management, enquiry coordination, controlled document access, inspection coordination, bidder readiness, auction connectivity, communication support and MIS.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unless expressly contracted otherwise, CityAuction does not determine reserve price, bidder eligibility, statutory notice content, acceptance or rejection of bids, sale confirmation, EMD treatment, statutory compliance or final transfer of the asset. Those responsibilities remain with the competent institution or authorised person.
            </p>
          </section>

          <section id="nextchapter" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              14. “Next Chapter” and Strategic Opportunities
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may facilitate introductions or market discovery for company sales, project sales, joint ventures, investor induction, asset monetisation, strategic capital, promoter exits or other special situations.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Such activities are exploratory unless governed by a separate mandate. CityAuction does not guarantee funding, valuation, transaction completion, investor interest, buyer capability, turnaround, restructuring outcome or continuation of a business or project.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Any activity requiring a licence, registration, regulated intermediary, securities-law compliance, insolvency authorisation, legal representation or other professional authority must be undertaken in accordance with applicable law and through appropriately authorised persons where required.
            </p>
          </section>

          <section id="customs" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              15. Customs Auction Information
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction is not CBIC, ICEGATE, MSTC or any Custom House and does not conduct Customs auctions unless expressly authorised for a specific transaction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Customs goods may be sold on an “as-is-where-is”, “no complaint” or similar basis and may be subject to inspection risk, quantity variation, testing, licensing, FSSAI, BIS, Legal Metrology, Plant/Animal Quarantine, hazardous-waste, environmental, vehicle, end-use, destruction, re-export or other requirements depending on the lot.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The successful bid amount may not represent the total acquisition cost. Taxes, duties, handling, storage, demurrage, transport, testing, compliance, lifting and other costs may apply.
            </p>
          </section>

          <section id="conduct" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              16. Prohibited and Restricted Conduct
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">You shall not:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>use CityAuction for unlawful, fraudulent, deceptive, abusive or unauthorised purposes;</li>
              <li>impersonate another person, institution or CityAuction representative;</li>
              <li>upload false, misleading, infringing, defamatory, confidential or unlawfully obtained material;</li>
              <li>attempt unauthorised access, scraping at scale, circumvention, credential harvesting, malware deployment, interference or security testing without written permission;</li>
              <li>misrepresent CityAuction information as an official auction notice or independent professional certification;</li>
              <li>use platform data to facilitate fraud, harassment, unlawful discrimination or illegal transactions;</li>
              <li>copy, republish, commercially exploit or systematically extract proprietary CityAuction content except as lawfully permitted.</li>
            </ul>
          </section>

          <section id="content" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              17. User-Submitted Content and Documents
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              You retain responsibility for material submitted by you. By submitting content, you represent that you have the right and authority to provide it and permit CityAuction to process, store, reproduce, format, transmit and use it to provide the requested service.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may remove, restrict, reject or preserve material where reasonably necessary for legal compliance, security, disputes, fraud prevention, rights protection or platform integrity.
            </p>
          </section>

          <section id="ip" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              18. Intellectual Property
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction&apos;s software, interfaces, original text, designs, branding, databases, taxonomy, workflows, graphics and other proprietary materials are owned by or licensed to Estabizz Fintech Private Limited except for third-party materials and public-source content.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              No licence is granted except the limited, revocable, non-exclusive right to use the Platform for its intended purpose in accordance with these Terms.
            </p>
          </section>

          <section id="availability" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              19. Platform Availability, Changes and Technical Risk
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may modify, suspend, withdraw, test, replace or discontinue features, content, integrations or services. Maintenance, software defects, cyber incidents, third-party outages, telecommunications failures, cloud interruptions or other events may affect availability.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not guarantee uninterrupted, error-free, real-time or continuously available service. Users remain responsible for using the authoritative auction channel and should not rely solely on CityAuction for deadline-sensitive participation.
            </p>
          </section>

          <section id="warranties" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              20. Disclaimer of Warranties
            </h2>
            <p className="caps text-xs text-[#525d64] uppercase font-mono bg-[#fcfaf6] p-4 border border-[#e6dfd4] rounded-xl leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CITYAUCTION, THE PLATFORM, CONTENT, ALERTS, SEARCH RESULTS, LISTINGS, SUMMARIES, DATA, INTRODUCTIONS, SUPPORT FEATURES AND SERVICES ARE PROVIDED ON AN “AS AVAILABLE” AND, WHERE APPROPRIATE, “AS IS” BASIS WITHOUT ANY EXPRESS OR IMPLIED WARRANTY OF ACCURACY, COMPLETENESS, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AVAILABILITY, PROFITABILITY, INVESTMENT PERFORMANCE, SUCCESSFUL ACQUISITION OR TRANSACTION COMPLETION.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Nothing in these Terms excludes an express written obligation accepted by CityAuction in a separate signed or otherwise validly concluded service engagement.
            </p>
          </section>

          <section id="liability" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              21. Limitation of Liability
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              To the maximum extent permitted by applicable law, CityAuction and Estabizz Fintech Private Limited shall not be liable for indirect, incidental, special, exemplary, punitive or consequential loss; loss of profit, opportunity, revenue, anticipated savings, goodwill, use or data; financing cost; business interruption; missed auction; unsuccessful bid; overbid; underbid; title defect; possession delay; litigation; encumbrance; unpaid dues; tax consequence; regulatory consequence; asset deterioration; third-party default; or transaction failure arising from or connected with use of the Platform or an Opportunity.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Without limiting the foregoing, CityAuction shall not be responsible, to the maximum extent permitted by law, for loss arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>reliance on a listing, summary, alert, algorithmic match or source that is inaccurate, delayed, incomplete or superseded;</li>
              <li>failure to review the authoritative auction notice or undertake independent diligence;</li>
              <li>conduct of an Auctioning Authority, seller, bidder, borrower, tenant, lender, professional or other third party;</li>
              <li>auction cancellation, extension, postponement, reserve-price change, rejection, forfeiture or non-confirmation;</li>
              <li>cyber incidents, infrastructure failure, unauthorised access or service interruption outside CityAuction&apos;s reasonable control;</li>
              <li>user-side mistakes, missed deadlines, incorrect payments, inadequate funding or failure to satisfy eligibility conditions.</li>
            </ul>
            <div className="legal-box">
              <p><strong>Aggregate cap:</strong> Where liability cannot lawfully be excluded but may lawfully be limited, the aggregate liability of CityAuction arising from a specific paid Platform service shall, unless a separate written engagement expressly provides otherwise, not exceed the fees actually paid to CityAuction for that specific affected service during the three months immediately preceding the event giving rise to the claim. For a free Platform service, liability shall be limited to the minimum amount, if any, required by applicable law. This cap does not apply where limitation is prohibited by law.</p>
            </div>
          </section>

          <section id="indemnity" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              22. User Indemnity
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              To the extent permitted by law, you agree to indemnify, defend and hold harmless Estabizz Fintech Private Limited, CityAuction, their directors, officers, employees and authorised representatives from third-party claims, losses, costs, liabilities, penalties and reasonable legal expenses arising from your unlawful use of CityAuction, breach of these Terms, misrepresentation, infringement, fraudulent conduct, unauthorised submission of information, violation of another person&apos;s rights or breach of auction-specific obligations.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              This indemnity does not require a consumer to waive any non-waivable right or indemnify CityAuction for liability that applicable law prohibits CityAuction from transferring.
            </p>
          </section>

          <section id="suspension" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              23. Restriction, Suspension and Termination
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may restrict, suspend or terminate access where reasonably necessary for security, suspected fraud, misuse, legal compliance, non-payment, infringement, abuse, false information, platform integrity, third-party request having lawful basis or material breach of these Terms.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Termination does not extinguish accrued payment obligations, confidentiality duties, indemnities, intellectual-property provisions, disclaimers, liability limitations, dispute provisions or other clauses intended by their nature to survive.
            </p>
          </section>

          <section id="force" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              24. Force Majeure and Events Beyond Reasonable Control
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              To the maximum extent permitted by law, CityAuction shall not be liable for delay, interruption or failure caused by events beyond reasonable control, including natural disasters, fire, flood, epidemic, war, civil disturbance, governmental action, court orders, regulatory changes, internet or telecom failure, power failure, cloud or data-centre failure, cyberattack, ransomware, third-party platform outage, banking disruption, industrial action or similar events.
            </p>
          </section>

          <section id="law" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              25. Governing Law, Dispute Resolution and Jurisdiction
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              These Terms shall be governed by the laws of India.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Before initiating formal proceedings, the parties should first attempt in good faith to resolve a dispute through written notice and reasonable discussion for at least 30 days, unless urgent interim relief is required.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Subject to any mandatory consumer forum, statutory tribunal, regulator or jurisdiction that cannot lawfully be excluded, courts having competent jurisdiction at Gandhinagar, Gujarat shall have jurisdiction over disputes arising from or relating to CityAuction and these Terms.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A separate institutional, enterprise or professional engagement may contain an arbitration clause or different agreed dispute-resolution mechanism, in which case that specific agreement shall govern that engagement.
            </p>
          </section>

          <section id="changes" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              26. Changes to These Terms
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may update these Terms to reflect product, legal, regulatory, security, commercial or operational changes. Updated Terms may be posted with a revised effective date. Where law requires additional notice, consent or other action for a material change, CityAuction will take such steps to the extent required.
            </p>
          </section>

          <section id="misc" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              27. Miscellaneous
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              If any provision is held invalid, illegal or unenforceable, the remaining provisions shall continue to the extent permitted by law. Failure to enforce a provision is not a waiver. Headings are for convenience only.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              No partnership, joint venture, employment, fiduciary, agency, brokerage or other relationship is created merely by use of CityAuction except where expressly established by a separate written arrangement.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              These Terms, together with incorporated policies and service-specific terms, constitute the general agreement governing Platform use. In case of conflict, a transaction-specific signed engagement, statutory auction term or mandatory law shall prevail to the extent applicable.
            </p>
          </section>

          <section id="contact" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              28. Contact
            </h2>
            <div className="p-5 border border-[#e6dfd4] rounded-2xl bg-[#faf8f4] text-sm text-[#253039] space-y-1 mt-3">
              <strong className="block text-base text-[#182129]">CityAuction – Estabizz Fintech Private Limited</strong>
              <p>Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India</p>
              <p>Email: <a href="mailto:info@estabizz.com" className="text-[#80643d] font-bold hover:underline">info@estabizz.com</a></p>
              <p>Phone: <a href="tel:+919825669668" className="text-[#80643d] font-bold hover:underline">+91 98256 69668</a></p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
