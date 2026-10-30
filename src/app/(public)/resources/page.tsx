import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  HelpCircle,
  FileText,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bidder Resources, Guides & FAQs | CityAuction",
  description:
    "Comprehensive guides, FAQs, SARFAESI legal procedures, and bidder manuals for purchasing Indian bank auction properties.",
};

const RESOURCE_SECTIONS = [
  { icon: <HelpCircle className="h-8 w-8 text-primary" />, title: "Frequently Asked Questions", desc: "Answers to common questions about auction discovery, documents, inspections and participation.", link: "/resources/faqs", cta: "Read FAQs" },
  { icon: <BookOpen className="h-8 w-8 text-primary" />, title: "How auctions work", desc: "Understand the buyer journey, from finding a property to preparing for the official auction process.", link: "/how-it-works", cta: "Explore the process" },
  { icon: <FileText className="h-8 w-8 text-primary" />, title: "Understanding verified information", desc: "See what source verification covers and which checks remain your responsibility.", link: "/verified-information-policy", cta: "Read the verification policy" },
  { icon: <ShieldAlert className="h-8 w-8 text-primary" />, title: "Buyer due diligence support", desc: "Learn how the Investor Desk can help you evaluate a property and prepare questions before participating.", link: "/investor-desk", cta: "Explore buyer support" },
];

export default function ResourcesPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">Resources</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Knowledge Hub & Bidder Resources
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
            Everything you need to successfully navigate, evaluate, and win Indian bank auction properties with total confidence.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {RESOURCE_SECTIONS.map((res, idx) => (
            <Link
              key={idx}
              href={res.link}
              className="bg-white rounded-2xl border border-border p-8 shadow-sm hover:shadow-card hover:border-primary/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {res.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {res.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
                  {res.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                <span>{res.cta}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Digital Signature (DSC) Information Box */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="px-2.5 py-1 bg-accent-100 text-accent-800 text-[11px] font-bold rounded-md uppercase">
                Digital Signature Certificates (Class 3 DSC)
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                Do I need a Digital Signature Certificate to bid?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Under the Information Technology Act, 2000 and institutional guidelines, certain high-value bank e-auctions require a Class 3 Signing & Encryption Digital Signature Certificate (DSC) on a cryptographic USB token. Our DSC support team can assist you in procuring or renewing compliant DSC tokens.
              </p>
            </div>
            <Link
              href="/contact?subject=DSC%20Procurement%20Inquiry"
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-xs whitespace-nowrap"
            >
              Enquire About Class 3 DSC
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
