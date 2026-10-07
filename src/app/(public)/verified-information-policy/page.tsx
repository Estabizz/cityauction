import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Information Policy | CityAuction",
  description:
    "CityAuction Verified Information Policy explains what the Verified badge means, source hierarchy, verification methodology, timestamps, update handling, exclusions, correction procedures and user reliance limitations.",
  alternates: {
    canonical: "/verified-information-policy",
  },
  openGraph: {
    type: "website",
    title: "Verified Information Policy | CityAuction",
    description:
      "CityAuction Verified Information Policy explains what the Verified badge means, source hierarchy, verification methodology, timestamps, update handling, exclusions, correction procedures and user reliance limitations.",
    url: "/verified-information-policy",
    siteName: "CityAuction",
  },
};

export default function VerifiedInformationPolicyPage() {
  return (
    <div className="bg-[#fbf9f5] text-[#182129] font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1218] to-[#172631] text-white py-20">
        <div className="container">
          <div className="eyebrow !text-[#d9c39c]">Data Quality &amp; Source Governance</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
            Verified Information Policy
          </h1>
          <p className="text-base text-[#c4ced4] max-w-3xl mt-4 leading-relaxed">
            This Policy defines what CityAuction means when it marks auction or opportunity information as “Verified”, how source-level checks may be performed, which information is outside the scope of verification, and how users should interpret and rely on a Verified badge.
          </p>

          <div className="mt-6 p-4 border border-[rgba(255,255,255,0.12)] rounded-2xl bg-[rgba(255,255,255,0.03)] flex gap-7 flex-wrap text-xs text-[#c4ced4]">
            <span><strong className="text-white">Effective Date:</strong> 27 September 2026</span>
            <span><strong className="text-white">Version:</strong> 1.0</span>
            <span><strong className="text-white">Operator:</strong> Estabizz Fintech Private Limited</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16">
        <article className="policy max-w-4xl mx-auto">
          <div className="notice">
            <strong>Core Meaning:</strong> A CityAuction “Verified” badge is a source-verification indicator. It is not a legal opinion, title certificate, valuation certificate, possession certificate, due-diligence report, investment recommendation or guarantee of transaction outcome.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4] first:border-0 first:pt-0">
              1. Purpose of the Verified Information Framework
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may receive auction and opportunity information from multiple channels, including auction notices, Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals, Recovery Officers, government authorities, public records, auction platforms, sellers and other authorised sources.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              The Verified Information framework is intended to distinguish information that has undergone a defined source-level cross-check from information that has merely been indexed, submitted, imported or otherwise displayed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              2. What “Verified” Ordinarily Means
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unless a listing or service-specific notice states otherwise, “Verified Auction Information” means that CityAuction has cross-checked selected core particulars of an auction or opportunity against one or more identified source documents or authoritative source channels available at the time of review.
            </p>
            <div>
              <div className="badge-verified">
                <i /> Verified Auction Information
              </div>
            </div>
            <p className="text-sm text-[#525d64] leading-relaxed mt-2">
              The exact fields checked may vary depending on source availability, asset type, auction process and the service through which the information is received.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              3. Source Hierarchy
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where multiple sources exist, CityAuction may generally apply the following order of preference:
            </p>

            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Source Type</th>
                    <th>Illustrative Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Level 1</td>
                    <td>Official / institutional source</td>
                    <td>Auction notice, corrigendum, addendum or information directly published or supplied by the competent Bank, ARC, Liquidator, Recovery Officer, Customs authority, government authority or authorised auction platform.</td>
                  </tr>
                  <tr>
                    <td>Level 2</td>
                    <td>Institution-authorised communication</td>
                    <td>Written communication, mandate data, seller-approved document or authorised representative input.</td>
                  </tr>
                  <tr>
                    <td>Level 3</td>
                    <td>Recognised public record</td>
                    <td>Government, statutory, tribunal, court, registry or other publicly accessible official records.</td>
                  </tr>
                  <tr>
                    <td>Level 4</td>
                    <td>Secondary / market source</td>
                    <td>Third-party publication, user submission, broker input or other non-authoritative source requiring caution or additional verification.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-[#525d64] leading-relaxed">
              Where an authoritative source conflicts with a secondary source, the authoritative source should ordinarily prevail unless a later authoritative update states otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              4. Information Fields That May Be Verified
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">Depending on the available source document, CityAuction may cross-check fields such as:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>name of the Bank, ARC, Liquidator or other Auctioning Authority;</li>
              <li>asset or property description;</li>
              <li>location and schedule details;</li>
              <li>reserve price;</li>
              <li>EMD amount;</li>
              <li>auction date and time;</li>
              <li>inspection date or inspection window;</li>
              <li>bid submission or EMD deadline;</li>
              <li>auction platform or official bidding channel;</li>
              <li>possession description exactly as stated in the source notice;</li>
              <li>contact details stated in the source notice;</li>
              <li>notice reference, publication date or related auction identifier.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              5. Information Not Automatically Verified by the Badge
            </h2>
            <div className="legal-box">
              <p>
                <strong>The Verified badge does not certify:</strong> legal title, marketable title, ownership validity, vacant possession, physical possession, absence of tenants, absence of litigation, absence of mortgages or charges, absence of statutory dues, physical condition, measurement accuracy, market value, future appreciation, construction legality, zoning, land use, regulatory approvals, environmental compliance, tax treatment, financing eligibility or investment suitability.
              </p>
            </div>
            <p className="text-sm text-[#525d64] leading-relaxed">
              These matters may require independent legal, valuation, technical, tax, physical or regulatory review.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              6. Verification Is Point-in-Time
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Verification reflects the source material available at the time CityAuction performs the check. Auction terms can change after verification through corrigenda, postponements, extensions, cancellations, court orders, institutional decisions or other updates.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Accordingly, a Verified badge must not be interpreted as a guarantee that the displayed information remains current indefinitely.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              7. Corrigenda, Amendments and Superseding Information
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where CityAuction becomes aware of a later corrigendum, addendum, cancellation, extension or material source update, it may revise, suspend or remove the Verified designation and update the affected information.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not guarantee that every update will be detected or reflected immediately. Users should re-check the official source before acting on any time-sensitive auction information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              8. Verified Source vs. Verified Asset
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A distinction must be maintained between verifying the <strong>source information</strong> and verifying the <strong>asset itself</strong>.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may verify that a notice states a reserve price of a particular amount, but that does not verify that the asset is worth that amount. CityAuction may verify that a notice describes possession as “physical”, but that does not amount to a physical-possession certificate. CityAuction may verify that a notice describes a property schedule, but that does not independently certify boundaries or ownership.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              9. Documents Uploaded by Institutions or Users
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Where information is supplied directly by an institution, seller, professional or user, CityAuction may treat the submitting party as the source and may verify consistency between the submitted document and the displayed information.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Unless separately agreed, CityAuction does not warrant that the submitting party had complete information or that the underlying document is genuine, legally sufficient, current or free from error.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              10. Automated Extraction and Human Review
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may use software, OCR, structured-data extraction, APIs, rules, AI-assisted tools or manual review to extract or compare auction particulars.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Automated systems can misread, omit or incorrectly classify information. Accordingly, the presence of automation does not create a representation that extraction is infallible.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may apply manual review or exception handling to material fields depending on the internal verification workflow.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              11. Verification Levels May Differ by Service
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              A basic marketplace listing may receive source-field verification only. A separately engaged Investor Desk or due-diligence service may involve broader document review, legal coordination, inspection, valuation or specialist inputs.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users must not assume that the verification scope of a general listing is equivalent to a paid due-diligence engagement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              12. “Verified” Does Not Equal “Recommended”
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction does not use the Verified badge to express an opinion that an asset is attractive, safe, undervalued, suitable, profitable or appropriate for a particular buyer.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed font-medium text-[#182129]">
              Verified status is a data-quality indicator only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              13. User Reliance and Independent Check
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Users should use Verified information as a convenience layer and starting point, not as a substitute for reviewing the authoritative auction notice and performing appropriate diligence.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Before paying EMD, submitting a bid or committing capital, users should re-check the current official source and satisfy themselves regarding all material facts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              14. Correction and Challenge Procedure
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              If a user, institution, Auctioning Authority or other authorised party believes that Verified information is incorrect, outdated or incomplete, a correction request may be submitted to CityAuction with sufficient supporting material.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may review the challenged information, request additional evidence, compare the source hierarchy and either maintain, amend, suspend or remove the Verified designation.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction is not required to accept a correction request solely because a user disputes the information; the decision will ordinarily depend on the quality and authority of the supporting source.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              15. Removal or Suspension of Verified Status
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction may remove, suspend or qualify a Verified badge where:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#525d64]">
              <li>the underlying source is withdrawn, superseded or materially amended;</li>
              <li>a credible conflict arises between authoritative sources;</li>
              <li>CityAuction cannot reconfirm a material field;</li>
              <li>a legal or institutional dispute affects the displayed information;</li>
              <li>the listing is cancelled, expired or materially changed;</li>
              <li>continued display could be misleading.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              16. Verified Information and Liability
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              To the maximum extent permitted by applicable law, the Verified designation does not create a warranty, guarantee, indemnity or assumption of liability beyond the specific source-level verification actually performed.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              CityAuction shall not be responsible merely because a user treated a Verified badge as a substitute for legal, financial, valuation, technical or physical due diligence.
            </p>
            <div className="legal-box">
              <p><strong>Mandatory-law carve-out:</strong> Nothing in this Policy excludes or limits any liability, right or remedy that applicable law does not permit to be excluded or limited.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              17. Relationship With Other Policies
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              This Policy should be read together with the Terms &amp; Conditions, Disclaimer, Risk Disclosure, Privacy Policy and any listing-specific or service-specific terms.
            </p>
            <p className="text-sm text-[#525d64] leading-relaxed">
              In case of conflict, mandatory law, the authoritative auction notice and any transaction-specific binding document shall prevail to the extent applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading text-2xl font-bold text-[#182129] mt-8 pt-4 border-t border-[#e6dfd4]">
              18. Contact and Correction Requests
            </h2>
            <p className="text-sm text-[#525d64] leading-relaxed">
              Requests relating to Verified information may be submitted to:
            </p>
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
