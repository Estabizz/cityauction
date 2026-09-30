import Link from "next/link";
import { Anchor, ShieldAlert, FileCheck, CheckCircle2, ArrowRight, Clock, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Customs Auctions | Port Cargo, Seized Lots & Institutional Goods",
  description: "Discover official Customs auctions across Indian ports. Understand the MSTC bidding process, physical inspection protocols, compliance clearances, and lifting rules.",
};

export default function CustomsAuctionPage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen py-16">
      <div className="estabizz-container space-y-12">
        {/* Banner */}
        <div className="max-w-3xl">
          <div className="eyebrow-text">CityAuction Customs</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-[#182129] tracking-tight mt-3">
            Goods Enter the Auction.<br />
            <em className="text-[#b49361] not-italic">Prepared Buyers See the Opportunity.</em>
          </h1>
          <p className="lead-text mt-4">
            Customs auctions require more than finding a low starting price. Buyers need to
            understand the lot, inspection window, eligibility, compliance, EMD, bidding
            mechanics, post-bid payment and lifting obligations.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd4] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#182129]">
              Customs Lot Discovery
            </h3>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Search Uncleared, Unclaimed, Confiscated and Seized cargo across major Indian ports,
              ICDs, and Air Cargo Complexes by category and port location.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd4] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#182129]">
              MSTC Process Guidance
            </h3>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Step-by-step advisory on MSTC portal registration, Class 3 Digital Signature
              Certificates (DSC), buyer pre-bid EMD submission, and statutory e-tender bidding
              rules.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd4] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#182129]">
              Inspection Readiness
            </h3>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Guidelines for conducting on-site inspection inside port customs bonded warehouses
              on &quot;As is where is&quot; terms before committing financial bids.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd4] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#182129]">
              Compliance & Clearances
            </h3>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Pre-identifying product-specific regulatory approvals, BIS certifications, FSSAI
              clearances, EPR authorizations, or restricted export/import criteria.
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e6dfd4] shadow-sm space-y-6">
          <div className="eyebrow-text">Step-by-step lifecycle</div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#182129]">
            The 6 Stages of Customs Auction Participation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 1</span>
              <strong className="text-sm text-[#182129] block">Notice & Lot Catalog Publication</strong>
              <p className="text-xs text-[#6f777d]">Official notice published by Customs Commissionerate and MSTC with lot descriptions and reserve guidelines.</p>
            </div>

            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 2</span>
              <strong className="text-sm text-[#182129] block">Physical Cargo Inspection</strong>
              <p className="text-xs text-[#6f777d]">Bidders visit designated Container Freight Stations (CFS) or bonded warehouses during permitted inspection windows.</p>
            </div>

            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 3</span>
              <strong className="text-sm text-[#182129] block">Pre-Bid EMD Submission</strong>
              <p className="text-xs text-[#6f777d]">Deposit required Earnest Money Deposit into MSTC e-wallet before the auction start cutoff.</p>
            </div>

            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 4</span>
              <strong className="text-sm text-[#182129] block">Live Electronic Bidding</strong>
              <p className="text-xs text-[#6f777d]">Participate in live forward bidding on MSTC portal with dynamic auto-extension rules.</p>
            </div>

            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 5</span>
              <strong className="text-sm text-[#182129] block">STA / Confirmation & Payment</strong>
              <p className="text-xs text-[#6f777d]">Upon bid acceptance (Subject to Approval), remit balance price along with applicable Customs Duty and GST.</p>
            </div>

            <div className="p-5 bg-[#fbf9f5] rounded-xl border border-[#e6dfd4] space-y-2">
              <span className="text-xs font-bold text-[#b49361] uppercase tracking-wider block">Stage 6</span>
              <strong className="text-sm text-[#182129] block">Delivery Order & Cargo Lifting</strong>
              <p className="text-xs text-[#6f777d]">Obtain Out-of-Charge from Customs and lift the container/cargo within free-time limits to avoid demurrage.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e6dfd4] flex flex-wrap gap-4 items-center justify-between">
            <p className="text-xs text-[#6f777d] max-w-xl">
              CityAuction provides discovery and procedural intelligence. Actual bidding takes
              place exclusively through authorized government portals (MSTC / Customs e-Auction).
            </p>
            <Link className="btn-pill btn-dark text-xs" href="/#contact">
              Inquire with Customs Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
