import Link from "next/link";
import type { Metadata } from "next";
import {
  FileSearch,
  UserCheck,
  CreditCard,
  Gavel,
  CheckCircle,
  Key,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Scale,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How Indian Bank Auctions Work | Complete Bidder Guide | CityAuction",
  description:
    "Learn how bank property auctions, SARFAESI proceedings, and DRT auctions work in India. A step-by-step guide from property search to possession.",
};

const STEPS = [
  {
    step: "01",
    icon: <FileSearch className="h-7 w-7" />,
    title: "Discover & Inspect Properties",
    description:
      "Search our verified listings of residential, commercial, industrial, or land assets. Download the official Sale Notice (Form IV) to inspect title papers and schedule a physical property site visit with the authorized recovery officer.",
  },
  {
    step: "02",
    icon: <UserCheck className="h-7 w-7" />,
    title: "Register & Submit KYC",
    description:
      "Create your free CityAuction account and submit your PAN Card, Aadhaar Card, address proof, and cancelled cheque. For corporate entities, upload Certificate of Incorporation and Board Resolution.",
  },
  {
    step: "03",
    icon: <CreditCard className="h-7 w-7" />,
    title: "Deposit Earnest Money (EMD)",
    description:
      "Remit the mandatory Earnest Money Deposit (typically 10% of the reserve price) before the sealed submission deadline via RTGS, NEFT, or our integrated secure payment gateway. EMD is 100% refundable if you do not win.",
  },
  {
    step: "04",
    icon: <Gavel className="h-7 w-7" />,
    title: "Participate in Live E-Auction",
    description:
      "Log in to the secure bidding room on the auction date. Place competitive bids above the reserve price in predefined bid increments. Real-time auto-extension ensures fair opportunity for all participants.",
  },
  {
    step: "05",
    icon: <CheckCircle className="h-7 w-7" />,
    title: "Payment & Confirmation of Sale",
    description:
      "If you are declared the Highest Bidder (H1), deposit 25% of the total purchase consideration (inclusive of EMD) immediately or by the next business day. Remit the remaining 75% balance within 15 days.",
  },
  {
    step: "06",
    icon: <Key className="h-7 w-7" />,
    title: "Sale Certificate & Physical Possession",
    description:
      "Upon receipt of full consideration, the authorized officer issues the registered Sale Certificate under Rule 9 of the Security Interest (Enforcement) Rules, 2002, conveying complete, clear ownership and physical handover.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">How It Works</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            How Bank E-Auctions Work in India
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
            A comprehensive, transparent walkthrough of the legal and financial process for participating in Indian bank property auctions.
          </p>
        </div>

        {/* Legal Comparison: SARFAESI vs DRT */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Understanding the Two Major Auction Frameworks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-gray-50 border border-border">
              <span className="px-2.5 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-md">
                SARFAESI Act, 2002
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-3 mb-1">
                Direct Bank Enforcement
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Secured creditors (Banks, NBFCs, ARCs) auction non-performing collateral without civil court intervention. Sales are conducted by an Authorised Officer under Rule 8 & 9 of the Security Interest Rules. Turnaround is faster, with clean Sale Certificates issued directly by the bank.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 border border-border">
              <span className="px-2.5 py-1 bg-accent-100 text-accent-800 text-xs font-bold rounded-md">
                DRT (Debts Recovery Tribunal)
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-3 mb-1">
                Judicial Tribunal Auctions
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Conducted under the Recovery of Debts and Bankruptcy Act, 1993 via a court-appointed Recovery Officer. Applicable for loan dues exceeding ₹20 Lakhs where recovery certificates have been granted. Offers absolute judicial finality against borrower objections.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Step Interactive Process */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gray-900">The 6-Step Bidding Journey</h2>
            <p className="text-xs text-gray-500 mt-1">
              From finding an auction property to key handover
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-mono text-2xl font-bold text-gray-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Bidding Safeguards */}
        <div className="bg-primary-900 text-white rounded-2xl p-8 md:p-10 mb-12">
          <div className="max-w-3xl">
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-2">
              Buyer Protection
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Key Safeguards for Bidders</h2>
            <div className="mt-6 space-y-4 text-xs md:text-sm text-primary-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>100% EMD Refund Guarantee:</strong> If another bidder outbids you, your Earnest Money Deposit is refunded in full without deduction directly to your bank account within 3-7 business days.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Encumbrance Clearance:</strong> Sale Notices disclose all known statutory charges. The Authorised Officer provides an indemnity confirming sale is free of borrower mortgage encumbrance.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Bank Inspection Right:</strong> Every bidder has the statutory right to visit and inspect the property on scheduled inspection dates prior to bidding.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to find verified bank auction properties?</h3>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/auctions"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm"
            >
              Browse Active Auctions
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-accent text-primary-900 font-bold rounded-xl hover:bg-accent-300 transition-colors text-sm"
            >
              Register as Bidder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
