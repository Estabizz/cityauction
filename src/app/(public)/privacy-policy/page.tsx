import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CityAuction",
  description:
    "Privacy Policy governing the collection, use, processing, disclosure, retention and protection of personal data by CityAuction, a venture of Estabizz Fintech Private Limited.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    type: "website",
    title: "Privacy Policy | CityAuction",
    description:
      "Privacy Policy governing personal data processing under the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025 by CityAuction / Estabizz Fintech Private Limited.",
    url: "/privacy-policy",
    siteName: "CityAuction",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1218] to-[#172631] text-white py-20">
        <div className="container">
          <div className="eyebrow !text-[#d9c39c]">Legal &amp; Data Governance</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-base text-[#c4ced4] max-w-3xl mt-4 leading-relaxed">
            This Privacy Policy describes how Estabizz Fintech Private Limited, operating the “CityAuction” venture, may collect, receive, access, record, organise, store, use, analyse, disclose, transmit, retain, erase or otherwise process information and personal data in connection with the CityAuction website, marketplace, applications, alerts, investor services, institutional services, communications and related digital or assisted channels.
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
        <aside className="privacy-toc">
          <h3>Contents</h3>
          <a href="#scope">1. Scope</a>
          <a href="#definitions">2. Definitions</a>
          <a href="#data">3. Data We May Process</a>
          <a href="#sources">4. Sources of Data</a>
          <a href="#purposes">5. Purposes of Processing</a>
          <a href="#basis">6. Basis / Authorisation</a>
          <a href="#cookies">7. Cookies &amp; Tracking</a>
          <a href="#sharing">8. Disclosure &amp; Processors</a>
          <a href="#third-party">9. Third-Party Data</a>
          <a href="#retention">10. Retention</a>
          <a href="#security">11. Security</a>
          <a href="#crossborder">12. Cross-Border Processing</a>
          <a href="#rights">13. Your Rights</a>
          <a href="#children">14. Children</a>
          <a href="#communications">15. Communications</a>
          <a href="#public">16. Public / Auction Information</a>
          <a href="#automation">17. Automated Tools</a>
          <a href="#liability">18. Privacy &amp; Liability Limitations</a>
          <a href="#changes">19. Changes</a>
          <a href="#grievance">20. Grievance / Contact</a>
        </aside>

        {/* Policy Document Body */}
        <article className="privacy-content-card">
          <div className="privacy-notice">
            <strong>Important:</strong> This Policy is intended to operate together with the Terms &amp; Conditions, Disclaimer, Risk Disclosure, Verified Information Policy, cookie/consent controls and any transaction-specific notice displayed at the point of collection. Nothing in this Policy excludes or limits any right, obligation or liability that cannot lawfully be excluded or limited under applicable law.
          </div>

          <section id="scope" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4] first:border-0 first:pt-0">
              1. Scope and Application
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              This Policy applies to information processed in connection with CityAuction-operated websites, webpages, dashboards, forms, alerts, marketing interfaces, investor-support workflows, institutional workflows, Customs-auction information services, “Next Chapter” enquiries, customer support, CRM records, call/WhatsApp/email interactions and any other channel through which CityAuction or Estabizz Fintech Private Limited receives information relating to an identified or identifiable individual.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where a separate notice is displayed for a specific service, transaction, statutory requirement, professional engagement, institutional mandate, document upload, auction workflow or third-party integration, that notice may supplement this Policy and, to the extent of inconsistency, the more specific notice shall govern for that processing activity.
            </p>
          </section>

          <section id="definitions" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              2. Definitions and Interpretative Framework
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              For purposes of this Policy, references to “CityAuction”, “we”, “us” or “our” mean Estabizz Fintech Private Limited acting through the CityAuction venture, unless a context-specific notice states otherwise. “User”, “you” or “your” includes visitors, registered users, buyers, investors, bidders, institutional representatives, promoters, developers, professionals, counterparties and other persons interacting with CityAuction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Terms such as “personal data”, “processing”, “Data Principal”, “Data Fiduciary”, “Data Processor”, “consent” and related expressions shall, where applicable, have the meanings assigned to them under the Digital Personal Data Protection Act, 2023, the Digital Personal Data Protection Rules, 2025 and other applicable data-protection, information-technology, cybersecurity or sectoral laws, <strong>to the extent such provisions are in force from time to time</strong>.
            </p>
          </section>

          <section id="data" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              3. Categories of Information We May Process
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Depending on how you interact with CityAuction, we may process some or all of the following categories:
            </p>

            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Illustrative Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Identity &amp; Contact</td>
                    <td>Name, mobile number, email address, correspondence address, organisation, designation and contact preferences.</td>
                  </tr>
                  <tr>
                    <td>Account &amp; Authentication</td>
                    <td>User ID, authentication metadata, account settings, login events and security logs.</td>
                  </tr>
                  <tr>
                    <td>Transaction / Opportunity Preferences</td>
                    <td>Asset classes, locations, budgets, investor mandates, auction categories, institutional requirements and alert preferences.</td>
                  </tr>
                  <tr>
                    <td>KYC / Eligibility Information</td>
                    <td>Documents or particulars voluntarily provided or required for a specific service, bidder-support workflow, transaction or third-party process.</td>
                  </tr>
                  <tr>
                    <td>Asset / Company / Project Information</td>
                    <td>Property details, sale notices, project details, corporate information, transaction context and supporting documents submitted by users or institutional counterparties.</td>
                  </tr>
                  <tr>
                    <td>Communications</td>
                    <td>Emails, support tickets, form submissions, meeting notes, call-related records, WhatsApp communications and complaint/grievance records.</td>
                  </tr>
                  <tr>
                    <td>Technical / Device Data</td>
                    <td>IP address, browser, operating system, device identifiers, access times, session information, referral source, security events and diagnostic logs.</td>
                  </tr>
                  <tr>
                    <td>Usage &amp; Interaction Data</td>
                    <td>Pages viewed, searches, filters, saved opportunities, clicks, alert interactions, document-access events and navigation patterns.</td>
                  </tr>
                  <tr>
                    <td>Marketing / Attribution Data</td>
                    <td>Campaign source, medium, referral information, communication response and consent/opt-out status.</td>
                  </tr>
                  <tr>
                    <td>Payment / Billing Metadata</td>
                    <td>Invoice references, payment status, transaction identifiers and limited payment metadata; payment credentials may be processed directly by third-party payment providers.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="sources" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              4. Sources From Which Information May Be Obtained
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">Information may be obtained:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>directly from you through forms, registration, calls, messages, uploads, meetings or service requests;</li>
              <li>from your employer, authorised representative, adviser, agent, institution or counterparty;</li>
              <li>from Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals, government authorities, auction platforms, custodians or other institutional sources;</li>
              <li>from publicly available notices, registries, websites, legal publications, court/tribunal records, governmental databases or other lawful public sources;</li>
              <li>from service providers, analytics providers, CRM systems, hosting/security vendors, communication providers or other processors;</li>
              <li>through cookies, logs, device interactions and similar digital technologies.</li>
            </ul>
          </section>

          <section id="purposes" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              5. Purposes for Which Information May Be Processed
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              We may process information where reasonably connected with one or more of the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>operating, administering, securing, maintaining and improving CityAuction;</li>
              <li>creating and managing user accounts, preferences, alerts and saved searches;</li>
              <li>presenting, matching, categorising or communicating auction, asset, project, company, Customs or strategic opportunities;</li>
              <li>responding to enquiries and providing requested information or support;</li>
              <li>providing or coordinating Investor Desk, due diligence, inspection, valuation, legal-support, bidder-readiness, institutional, liquidation or transaction-support workflows;</li>
              <li>facilitating introductions to institutions, advisers, professionals, lenders, buyers, investors, developers or other counterparties where requested or relevant;</li>
              <li>fraud prevention, misuse detection, security monitoring, access control, audit logging and incident response;</li>
              <li>analytics, service development, product improvement, user-experience optimisation and internal research;</li>
              <li>billing, accounting, taxation, compliance, audit, dispute handling and record keeping;</li>
              <li>sending service communications, requested alerts and, where legally permitted, promotional communications;</li>
              <li>complying with law, court/tribunal directions, regulatory requirements, government requests or enforcement obligations;</li>
              <li>establishing, exercising, defending or preserving legal rights and claims.</li>
            </ul>
          </section>

          <section id="basis" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              6. Processing Basis, Consent and Other Lawful Uses
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Personal data may be processed on the basis of consent, for certain legitimate uses recognised under applicable law, for compliance with legal obligations, for performing requested services or taking steps at your request, or under another lawful ground available to CityAuction.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where processing is based on consent, consent may be obtained through digital interfaces, forms, checkboxes, communications or other legally permissible mechanisms. Where required, you may withdraw consent using the method stated at the relevant collection point or by contacting us; withdrawal shall not affect processing already lawfully undertaken before such withdrawal and may affect our ability to provide a service that necessarily requires the relevant data.
            </p>
          </section>

          <section id="cookies" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              7. Cookies, Analytics, Logs and Similar Technologies
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may use necessary cookies, session technologies, security tokens, analytics identifiers, pixels, local storage, tags or similar technologies for authentication, fraud prevention, security, preference storage, performance measurement, analytics, attribution and service improvement.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Non-essential technologies should be deployed subject to applicable consent requirements and available cookie controls. Blocking certain technologies may reduce or disable functionality. Third-party analytics or advertising technologies, if enabled, may operate under their own privacy terms and technical controls.
            </p>
          </section>

          <section id="sharing" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              8. Disclosure, Data Processors and Service Providers
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              We may disclose or make information available to employees, affiliates, professional advisers, vendors, hosting providers, cloud services, CRM providers, communication providers, analytics vendors, cybersecurity providers, payment processors, document-management providers, verification providers, institutional counterparties and other persons where reasonably necessary for the relevant purpose.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where CityAuction coordinates legal, valuation, financing, inspection, registration, due diligence or transaction support, relevant information may be shared with the engaged or proposed professional, institution or counterparty. Such third parties may act as independent controllers/fiduciaries for their own processing and may be subject to separate professional, statutory or contractual duties.
            </p>
            <div className="privacy-legal-box">
              <p><strong>No onward-use guarantee:</strong> CityAuction cannot control independent processing undertaken by a third party outside CityAuction’s instructions or systems. Users should review the privacy terms and professional engagement terms of such third parties where applicable.</p>
            </div>
          </section>

          <section id="third-party" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              9. Third-Party Information and Information Submitted About Other Persons
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              If you provide information relating to another individual, you represent that you are lawfully authorised to provide such information and that any required notice, consent or other legal prerequisite has been satisfied. CityAuction may rely on that representation unless circumstances reasonably indicate otherwise.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction is not responsible for the accuracy, completeness or lawful provenance of information supplied by users, institutions, counterparties or public sources, except to the extent applicable law imposes a non-excludable obligation on CityAuction.
            </p>
          </section>

          <section id="retention" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              10. Retention and Deletion
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Information may be retained for as long as reasonably necessary for the relevant purpose, account administration, transaction history, legal compliance, taxation, audit, fraud prevention, security, dispute resolution, enforcement of agreements, defence of claims, business continuity or other lawful requirements.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Retention periods may vary by category and context. Where deletion or erasure is legally required, data may be deleted, anonymised, de-identified, restricted or rendered inaccessible in accordance with applicable technical and legal requirements. Residual copies may persist temporarily in backup, disaster-recovery or security systems until overwritten or retired under normal system cycles.
            </p>
          </section>

          <section id="security" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              11. Information Security and Security Limitations
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may implement administrative, contractual, organisational and technical safeguards considered reasonable and appropriate having regard to the nature of the data, processing, systems and risks involved, including access controls, authentication, logging, vendor controls, backups and other safeguards.
            </p>
            <div className="privacy-legal-box">
              <p><strong>No absolute-security representation:</strong> No internet transmission, electronic storage environment, software system, cloud infrastructure, third-party service or security control can be represented as completely secure or error-free. To the maximum extent permitted by law, CityAuction does not warrant that unauthorised access, interception, malware, infrastructure failure, credential compromise, third-party compromise or other security incidents can never occur.</p>
            </div>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where a personal-data breach triggers legally applicable notification or remedial obligations, CityAuction will act in accordance with the law then in force and the scope of its role in relation to the affected processing.
            </p>
          </section>

          <section id="crossborder" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              12. Hosting, Remote Access and Cross-Border Processing
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction and its service providers may use systems, personnel, infrastructure or cloud services located in India or other jurisdictions. Personal data may therefore be accessed, processed, backed up or stored outside the user’s location, subject to restrictions, transfer conditions or prohibitions applicable under law from time to time.
            </p>
          </section>

          <section id="rights" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              13. Data Principal / User Rights
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Subject to applicable law and to the extent the relevant statutory provisions are in force, eligible individuals may have rights relating to access to information about processing, correction, completion, updating, erasure, withdrawal of consent, grievance redressal, nomination or other rights prescribed by law.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A request may be subject to verification of identity, authority, legal exceptions, record-retention obligations and technical feasibility. CityAuction may request information reasonably necessary to authenticate and process a request and may decline or limit requests where permitted by law.
            </p>
          </section>

          <section id="children" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              14. Children and Persons Requiring Lawful Guardian Action
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction is principally intended for adults, businesses, investors, professionals and institutional users. We do not intentionally design auction-investment, institutional or transaction-support services for children. Where applicable law requires verifiable parental or guardian consent or imposes restrictions concerning processing relating to children or persons represented by lawful guardians, CityAuction will apply such requirements to the extent legally applicable.
            </p>
          </section>

          <section id="communications" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              15. Alerts, Service Messages and Marketing Communications
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users may receive communications relating to account activity, requested alerts, saved mandates, service enquiries, document requests, security matters, transaction workflows or similar operational purposes. Promotional communications may be sent where lawfully permitted and subject to applicable consent/opt-out requirements.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unsubscribing from marketing does not necessarily prevent operational, legal, security or transaction-related communications that are necessary for an active service or relationship.
            </p>
          </section>

          <section id="public" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              16. Public Records, Auction Notices and Institutional Information
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may collect, index, structure, summarise, link to or display information appearing in auction notices, public records, institutional publications, public websites or governmental/tribunal/court sources. Such information may contain names, addresses, borrower/guarantor references, property details or other information lawfully made public or supplied by an authorised institution.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The fact that information appears on CityAuction does not mean that CityAuction originated, independently verified, owns or controls the underlying source information. Requests concerning correction, removal or restriction of public/institution-supplied information will be assessed having regard to source authority, legal obligations, public-record status, platform role and applicable law.
            </p>
          </section>

          <section id="automation" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              17. Search, Matching, Analytics and Automated Tools
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may use software, algorithms, rules, analytics, search ranking, recommendation systems or AI-assisted tools to organise information, identify potential matches, classify opportunities, detect anomalies, prioritise leads, personalise alerts or support internal workflows.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Such outputs may be probabilistic, incomplete or dependent on source data. They do not constitute legal, investment, valuation, credit or professional advice and should not be treated as determinative of suitability, title, value, risk or transaction outcome.
            </p>
          </section>

          <section id="liability" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              18. Privacy-Specific Disclaimers and Limitation of Liability
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              To the maximum extent permitted by applicable law, and without limiting any non-excludable statutory duty, CityAuction shall not be responsible for loss, damage, liability, claim, cost or consequence arising solely from:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>information supplied by a user, institution, professional, public source or third-party system that is inaccurate, incomplete, outdated, unlawfully supplied or subsequently changed;</li>
              <li>a third party’s independent use, retention, disclosure, security practices or failure after data is lawfully transmitted to that third party for a requested or permitted purpose;</li>
              <li>user-side credential compromise, device compromise, phishing, impersonation, malware, insecure networks or failure to maintain account security;</li>
              <li>temporary system outages, infrastructure failures, force-majeure events, telecommunications failures, cloud/service-provider incidents or cyber events beyond CityAuction’s reasonable control;</li>
              <li>the user’s reliance on public-source, auction-source, algorithmic, matched or summarised information without reviewing the authoritative source or undertaking independent diligence;</li>
              <li>communications or transactions initiated outside CityAuction systems or with persons falsely representing an association with CityAuction.</li>
            </ul>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where liability cannot legally be excluded, any limitation shall operate only to the extent, form and amount permitted under applicable law. Nothing in this Policy limits liability for any matter for which limitation or exclusion is prohibited by law.
            </p>
            <div className="privacy-legal-box">
              <p><strong>Policy allocation of risk:</strong> This Policy does not create a warranty that information will always remain confidential, available, accurate, recoverable or immune from lawful disclosure, cyber risk or third-party processing. It allocates responsibilities subject to mandatory law and must be read with the Terms &amp; Conditions and other CityAuction legal policies.</p>
            </div>
          </section>

          <section id="changes" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              19. Amendments to this Privacy Policy
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              We may amend this Policy to reflect legal, regulatory, operational, technical, product, security or business changes. The updated version may be published on this page with a revised effective date. Where applicable law requires additional notice or consent for a material change, such steps will be taken to the extent required.
            </p>
          </section>

          <section id="grievance" className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              20. Privacy Requests, Grievance Redressal and Contact
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Privacy questions, consent-withdrawal requests, correction/erasure requests, complaints or grievances may be submitted using the contact details below. Requests will be handled subject to identity verification, legal requirements, applicable exemptions and the statutory framework in force at the relevant time.
            </p>
            <div className="p-5 border border-[#e6dfd4] rounded-2xl bg-[#faf8f4] text-sm text-[#253039] space-y-1 mt-3">
              <strong className="block text-base text-[#182129]">CityAuction – Estabizz Fintech Private Limited</strong>
              <p>Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India</p>
              <p>Email: <a href="mailto:info@estabizz.com" className="text-[#80643d] font-bold hover:underline">info@estabizz.com</a></p>
              <p>Phone: <a href="tel:+919825669668" className="text-[#80643d] font-bold hover:underline">+91 98256 69668</a></p>
            </div>
            <p className="text-xs text-[#7e868b] mt-3">
              Any specifically designated grievance officer, privacy contact, Data Protection Officer or statutory contact required by applicable law may be separately identified on CityAuction once such designation becomes applicable or is formally made.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
