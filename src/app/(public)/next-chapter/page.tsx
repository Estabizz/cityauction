import Link from "next/link";
import { Sparkles, Shield, Building2, TrendingUp, Handshake, Lock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Next Chapter | Strategic Capital, JV & Monetisation for Distressed Businesses",
  description: "For companies and developers facing financial or liquidity pressure but still holding fundamental asset value. Explore strategic investor induction, project sales, JV partnerships, and confidential private mandates.",
};

export default function NextChapterPage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen py-16">
      <div className="estabizz-container space-y-12">
        {/* Banner */}
        <div className="max-w-3xl">
          <div className="eyebrow-text">CityAuction Next Chapter</div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-[#182129] tracking-tight mt-3">
            Some Assets Need a Buyer.<br />
            <em className="text-[#b49361] not-italic">Some Businesses Need a Next Chapter.</em>
          </h1>
          <p className="lead-text mt-4">
            A project can stop because capital stopped. A business can face financial pressure
            while still owning substantial real asset value. Sometimes the answer is not another
            auction. It is the right investor, partner, developer or new owner.
          </p>
          <div className="quote-block mt-6">
            “We do not begin with what went wrong. We begin with what still holds value.”
          </div>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-[#e6dfd4] shadow-sm space-y-4" id="companies">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#182129]">
                For Companies & Operating Businesses
              </h3>
            </div>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              When debt restructuring or operational distress threatens an otherwise viable enterprise:
            </p>
            <ul className="space-y-2 text-xs text-[#182129]">
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Business Sale / Takeover:</strong> Finding a well-capitalised strategic buyer to acquire the entity or operating division.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Strategic Investor Induction:</strong> Bringing in growth or turnaround equity to de-leverage bank balance sheets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Surplus Asset Monetisation:</strong> Carving out non-core industrial land, machinery or commercial units to inject liquidity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Dignified Promoter Exit:</strong> Facilitating structured settlement with lenders and transitioning management smoothly.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e6dfd4] shadow-sm space-y-4" id="developers">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#182129]">
                For Real Estate Developers & Projects
              </h3>
            </div>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Stalled residential or commercial developments requiring capital injection and delivery muscle:
            </p>
            <ul className="space-y-2 text-xs text-[#182129]">
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Project Outright Sale:</strong> Selling the development rights and mortgaged parcel to active tier-1 developers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Joint Development (JD / JV):</strong> Partnering with a reputed delivery sponsor while retaining land equity upside.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Last-Mile Completion Finance:</strong> Structuring SWAMIH-style or private credit tranches to finish construction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Development Management (DM):</strong> Handing over construction, sales and brand execution to established builders.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e6dfd4] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#182129]">
                For Strategic Investors & Funds
              </h3>
            </div>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Access pre-screened off-market special situation opportunities before public auction dissipation:
            </p>
            <ul className="space-y-2 text-xs text-[#182129]">
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Direct Asset Backing:</strong> Every transaction is anchored by verified freehold or leasehold land and physical machinery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Attractive Entry Valuations:</strong> Substantial margin of safety compared to replacement cost or open market rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Consensual Resolution:</strong> Reduced litigation risk compared to contentious multi-year recovery tribunal battles.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e6dfd4] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#091118] text-[#d9c39c] flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#182129]">
                Private & Confidential Mandates
              </h3>
            </div>
            <p className="text-xs text-[#6f777d] leading-relaxed">
              Strict Non-Disclosure Agreements (NDA) protecting commercial sensitivity:
            </p>
            <ul className="space-y-2 text-xs text-[#182129]">
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>No Public Distress Marketing:</strong> The situation is not posted on public job boards or general listing portals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Pre-screened Counterparties:</strong> Disclosures made exclusively to verified institutional funds and established principals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b49361] font-bold">✓</span>
                <span><strong>Secure Virtual Data Room:</strong> Audited access tracking for all financial schedules and legal documents.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091118] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-semibold">
              Discuss a Private Company or Project Situation
            </h3>
            <p className="text-xs text-[#aeb9c1] mt-2 max-w-xl">
              Connect directly with Estabizz Fintech advisory partners for an initial confidential discussion.
            </p>
          </div>
          <Link className="btn-pill btn-gold text-xs whitespace-nowrap" href="/#contact">
            Request Confidential Discussion
          </Link>
        </div>
      </div>
    </div>
  );
}
