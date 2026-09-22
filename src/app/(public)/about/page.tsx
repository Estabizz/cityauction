import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Scale,
  Building2,
  Users,
  Award,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | CityAuction — India's Premier Bank E-Auction Platform",
  description:
    "Learn about CityAuction, our mission to bring transparency to Indian bank property auctions, SARFAESI compliance, and our institutional banking network.",
};

const HIGHLIGHTS = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "300+ Banking Institutions",
    desc: "Partnered with premier public sector banks, private lenders, NBFCs, and ARCs across India.",
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: "Strict SARFAESI Compliance",
    desc: "Engineered under Rule 8 & 9 of the Security Interest (Enforcement) Rules, 2002 and CVC guidelines.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Enterprise Security & Encryption",
    desc: "End-to-end encrypted bid submissions, audit trails, and bank-grade digital authentication.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "₹15,000+ Cr Recovered",
    desc: "Assisting Indian lending institutions in non-performing asset resolution and capital recovery.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">About Us</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Digitizing & Transforming Bank E-Auctions in India
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-3 leading-relaxed">
            CityAuction is India&apos;s state-of-the-art digital portal for Non-Performing Assets (NPAs), SARFAESI property auctions, and Debts Recovery Tribunal (DRT) sales.
          </p>
        </div>

        {/* Mission & Background */}
        <div className="bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
                Our Foundation
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bridging Institutional Lenders & Discerning Real Estate Buyers
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed">
                <p>
                  Traditionally, bank auction notices were buried in regional newspaper classifieds with cumbersome physical tender submission procedures, opaque bid opening ceremonies, and limited accessibility for regular citizens.
                </p>
                <p>
                  CityAuction was founded to dismantle these informational barriers. We provide a single, unified, institutional-grade discovery engine where every legally sanctioned bank auction notice, property schedule, valuation report, and title document is structured, searchable, and verified.
                </p>
                <p>
                  By standardizing property documentation, enabling automated KYC verification, and facilitating server-authoritative live bidding, we empower individual home buyers, business owners, and corporate investors to acquire prime real estate at significant market discounts with complete legal peace of mind.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-gray-50 border border-border space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two-sided Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <span className="px-3 py-1 bg-accent-100 text-accent-800 text-xs font-bold rounded-md">
              For Property Buyers & Investors
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3">
              Unmatched Value, Transparency & Due Diligence
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>20% to 40% Below Market Pricing:</strong> Direct distressed asset acquisition without real estate broker commissions or hidden markups.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Full Document Access:</strong> Free inspection of SARFAESI Form IV, Encumbrance Certificates, Valuation Reports, and Site layouts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Guaranteed EMD Protection:</strong> Automated, seamless refund of Earnest Money directly to your verified bank account if outbid.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-md">
              For Banks & Lending Institutions
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3">
              Rapid NPA Resolution & Broadest Market Outreach
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Maximum Pan-India Outreach:</strong> Connect your distressed inventory with qualified bidders nationwide, boosting competitive bidding and recovery value.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Auditable & Tamper-proof:</strong> Every bid timestamp, IP address, and transaction log is cryptographically preserved for CVC audit compliance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Seamless Recovery Officer Console:</strong> Manage publication, bidder approval, tender document downloads, and auction schedules from a unified back-office.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-900 text-white rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold">Join India&apos;s Fastest Growing Bank Auction Community</h2>
          <p className="text-xs md:text-sm text-primary-200 mt-2 max-w-lg mx-auto">
            Whether you are looking for your dream residence, commercial office space, or industrial expansion plot, find your next asset on CityAuction.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/auctions"
              className="px-6 py-3 bg-accent text-primary-900 font-bold rounded-xl hover:bg-accent-300 transition-colors text-sm"
            >
              Browse Auction Catalog
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
