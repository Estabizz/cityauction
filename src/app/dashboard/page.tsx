import Link from "next/link";
import type { Metadata } from "next";
import {
  Gavel,
  Heart,
  FileCheck,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Building2,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AuctionStatusBadge, Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Bidder Dashboard Overview | CityAuction",
  description: "User dashboard overview showing active bids, saved properties, and KYC status.",
};

const STATS = [
  {
    title: "Active Bids",
    value: "2",
    subtext: "Highest bidder on 1 property",
    icon: <Gavel className="h-5 w-5 text-primary" />,
    link: "/dashboard/bids",
  },
  {
    title: "Saved Properties",
    value: "5",
    subtext: "3 auctions commencing this week",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    link: "/dashboard/favourites",
  },
  {
    title: "Auction Applications",
    value: "3",
    subtext: "2 Approved • 1 Under Review",
    icon: <FileCheck className="h-5 w-5 text-amber-500" />,
    link: "/dashboard/applications",
  },
  {
    title: "KYC & Verification",
    value: "Approved",
    subtext: "Class 3 DSC Active (Valid 2027)",
    icon: <ShieldCheck className="h-5 w-5 text-success" />,
    link: "/dashboard/documents",
  },
];

const WATCHLIST_AUCTIONS = [
  {
    id: "auc-101",
    auctionNumber: "CA-MH-2026-101",
    title: "3 BHK Luxury Apartment in Lodha Bellissimo, Mahalaxmi",
    city: "Mumbai, Maharashtra",
    bank: "State Bank of India",
    reservePrice: 48500000,
    emd: 4850000,
    date: "2026-10-04T11:00:00Z",
    status: "UPCOMING",
    daysLeft: "12 Days",
  },
  {
    id: "auc-102",
    auctionNumber: "CA-HR-2026-102",
    title: "Grade-A Commercial Office in DLF Cyber City Phase II, Gurugram",
    city: "Gurugram, Haryana",
    bank: "Punjab National Bank",
    reservePrice: 32000000,
    emd: 3200000,
    date: "2026-09-23T11:00:00Z",
    status: "LIVE",
    daysLeft: "Live Now",
  },
  {
    id: "auc-108",
    auctionNumber: "CA-KA-2026-108",
    title: "Fertile Agricultural Farmland of 4.5 Acres near Devanahalli",
    city: "Bangalore, Karnataka",
    bank: "State Bank of India",
    reservePrice: 38000000,
    emd: 3800000,
    date: "2026-09-24T11:00:00Z",
    status: "CLOSING_SOON",
    daysLeft: "24 Hours Left",
  },
];

const RECENT_BIDS = [
  {
    id: "bid-1",
    auctionTitle: "Grade-A Commercial Office in DLF Cyber City Phase II",
    auctionNumber: "CA-HR-2026-102",
    bidAmount: 32150000,
    status: "WINNING",
    timestamp: "10 mins ago",
  },
  {
    id: "bid-2",
    auctionTitle: "3 BHK Apartment in Goregaon East, Mumbai",
    auctionNumber: "CA-MH-2026-088",
    bidAmount: 21500000,
    status: "OUTBID",
    timestamp: "Yesterday, 4:20 PM",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Verified Bidder Account
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Vikramaditya</h1>
          <p className="text-xs md:text-sm text-primary-200 mt-1 max-w-xl leading-relaxed">
            Your KYC is fully verified. You are authorized to submit EMD and bid on active SARFAESI and DRT auctions.
          </p>
        </div>

        <Link
          href="/auctions"
          className="px-5 py-2.5 bg-accent text-primary-900 font-bold rounded-xl hover:bg-accent-300 transition-colors text-xs shrink-0 flex items-center gap-1.5"
        >
          <span>Find New Auctions</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:shadow-card hover:border-primary/30 transition-all block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="p-2 rounded-xl bg-gray-50">{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{stat.value}</div>
            <p className="text-[11px] text-gray-500 mt-1">{stat.subtext}</p>
          </Link>
        ))}
      </div>

      {/* Main Grid: Watchlist & Active Bids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Watchlist Auctions (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Watchlist Auctions</h2>
            <Link
              href="/dashboard/favourites"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All (5)
            </Link>
          </div>

          <div className="space-y-3">
            {WATCHLIST_AUCTIONS.map((auc) => (
              <div
                key={auc.id}
                className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-primary/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {auc.auctionNumber}
                    </span>
                    <AuctionStatusBadge status={auc.status} />
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 font-medium">{auc.bank}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{auc.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span>Reserve: <strong className="text-primary font-mono">{formatCurrency(auc.reservePrice)}</strong></span>
                    <span>EMD: <strong className="text-gray-800 font-mono">{formatCurrency(auc.emd)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="block text-[11px] text-gray-400 uppercase">Starts in</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" />
                      {auc.daysLeft}
                    </span>
                  </div>
                  <Link
                    href={`/auctions/${auc.id}`}
                    className="px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bids Feed & Quick Actions (1 Col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Bids */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Active Bids</h3>
              <Link href="/dashboard/bids" className="text-xs font-semibold text-primary hover:underline">
                History
              </Link>
            </div>

            <div className="space-y-3">
              {RECENT_BIDS.map((bid) => (
                <div key={bid.id} className="p-3.5 rounded-xl bg-gray-50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-500">{bid.auctionNumber}</span>
                    {bid.status === "WINNING" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-100 text-success-700">
                        Highest Bidder
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-100 text-error-700">
                        Outbid
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{bid.auctionTitle}</p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
                    <span className="text-gray-500">My Bid:</span>
                    <span className="font-mono font-bold text-primary">{formatCurrency(bid.bidAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EMD & Verification Checklist */}
          <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5 space-y-3">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Bidder Compliance Checklist
            </span>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center gap-2 text-success-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Identity & PAN Card Verified</span>
              </li>
              <li className="flex items-center gap-2 text-success-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Bank Account for EMD Refund Added</span>
              </li>
              <li className="flex items-center gap-2 text-success-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Class 3 DSC Token Connected</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
