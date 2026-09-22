import Link from "next/link";
import type { Metadata } from "next";
import { HelpCircle, Phone, ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/resources/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Bank E-Auctions | CityAuction",
  description:
    "Find answers to common questions about SARFAESI property auctions, EMD refunds, KYC requirements, physical vs symbolic possession, and live bidding.",
};

export default function FaqsPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <Link href="/resources" className="hover:text-primary">Resources</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">FAQs</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Everything you need to know about bank property auctions, legal due diligence, EMD deposits, and the online bidding process.
          </p>
        </div>

        {/* FAQ Interactive Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
          <div className="lg:col-span-2">
            <FaqAccordion />
          </div>

          {/* Help Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Can&apos;t find the answer you&apos;re looking for? Our dedicated bidder support specialists are on call to assist you with specific property questions.
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-xs"
                >
                  Contact Support Desk
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="tel:+911244302020"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-xs"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call: +91-124-4302020
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
