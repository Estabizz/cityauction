import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CityAuction",
  description: "Privacy policy and data protection framework of CityAuction.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide max-w-4xl">
        <nav className="text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy & Data Security</h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: September 2026</p>

        <div className="bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm space-y-6 text-xs md:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              To comply with statutory anti-money laundering (AML) directives, RBI Know-Your-Customer (KYC) guidelines, and bidding eligibility verifications, we collect personal and financial identity information including Full Legal Name, Email Address, Verified Mobile Number, Permanent Account Number (PAN), Identity & Address Proofs (Aadhaar, Passport), Company Incorporation Certificates, and Bank Account details for EMD refund routing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. How We Use Your Data</h2>
            <p>
              Your data is utilized exclusively for: authenticating bidder identity; verifying KYC eligibility with participating lending institutions; enabling EMD deposit reconciliation and automated refund disbursement; delivering critical auction alert notifications; and maintaining statutory audit logs mandated by judicial regulatory authorities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Document Security & Zero Public Exposure</h2>
            <p>
              Sensitive personal documents (such as PAN cards and identity proofs) are stored on encrypted, access-controlled S3-compatible cloud storage with pre-signed temporary URLs. Sensitive documents are never indexed by public search engines and are accessible only to authorized institutional compliance officers reviewing your application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. Third-Party Sharing Restrictions</h2>
            <p>
              We do not sell, monetize, or trade your personal information. Data is disclosed only to the specific secured creditor bank or tribunal overseeing an auction in which you formally participate, or when legally compelled by an order of a court of competent jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
