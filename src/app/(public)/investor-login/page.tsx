import Link from "next/link";
import type { Metadata } from "next";
import { InvestorLoginForm } from "@/components/forms/investor-login-form";

export const metadata: Metadata = {
  title: "Investor Login | CityAuction",
  description:
    "Secure investor login for CityAuction users to access saved opportunities, personalised alerts, diligence requests, watchlists and transaction support.",
  robots: "noindex,nofollow",
  alternates: {
    canonical: "/investor-login",
  },
};

export default function InvestorLoginPage() {
  return (
    <div className="bg-[#fbf9f5] min-h-screen text-[#182129] font-sans antialiased">
      {/* Top Utility Bar */}
      <div className="topbar">
        <div className="container flex justify-between items-center py-2 text-xs">
          <div>
            <strong>CityAuction Investor Access</strong> · A venture of Estabizz Fintech Private Limited
          </div>
          <div>
            <a href="mailto:info@estabizz.com" className="hover:text-white">Investor Support</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[rgba(251,249,245,0.97)] border-b border-[rgba(24,33,41,0.07)]">
        <div className="container flex items-center justify-between min-h-[80px]">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="CityAuction Logo" className="h-16 sm:h-20 w-auto object-contain" />
          </Link>

          <Link href="/auctions" className="text-xs text-[#59636a] hover:text-[#7f623b] flex items-center gap-1 font-medium">
            ← Back to Auction Opportunities
          </Link>
        </div>
      </header>

      {/* Main Login Shell */}
      <main className="login-shell">
        <div className="container login-grid">
          {/* Left Hero Context */}
          <section className="text-white py-4">
            <div className="eyebrow-text !text-[#d9c39c]">Investor Portal</div>
            <h1 className="font-serif-heading text-4xl sm:text-6xl font-semibold text-white tracking-tight mt-3 leading-tight">
              Your Opportunities.<br />
              <em className="text-[#dbc39a] not-italic font-normal">One Investor Workspace.</em>
            </h1>

            <p className="text-base text-[#c5cfd5] max-w-xl mt-5 leading-relaxed">
              Sign in to manage saved auction opportunities, personalised alerts, diligence requests, watchlists and transaction-support activity within the CityAuction ecosystem.
            </p>

            <div className="quote-block !text-[#eadfcd] !border-[#c9aa78] mt-6">
              Discover once. Track intelligently. Evaluate with context.
            </div>

            <div className="login-trust-grid mt-7">
              <div className="login-trust-item">
                <strong>Saved Opportunities</strong>
                Keep auction assets, Customs lots and strategic opportunities in one shortlist.
              </div>
              <div className="login-trust-item">
                <strong>Personalised Alerts</strong>
                Manage location, category, budget and opportunity preferences.
              </div>
              <div className="login-trust-item">
                <strong>Investor Desk</strong>
                Track diligence, inspection, valuation and pre-bid support requests.
              </div>
              <div className="login-trust-item">
                <strong>Transaction Readiness</strong>
                Organise bidder information, documents and status for supported workflows.
              </div>
            </div>
          </section>

          {/* Right Login Card */}
          <section>
            <InvestorLoginForm />
          </section>
        </div>
      </main>
    </div>
  );
}
