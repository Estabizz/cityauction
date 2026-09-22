import Link from "next/link";
import type { Metadata } from "next";
import { Gavel, ExternalLink, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Bids & Bidding History | CityAuction",
  description: "Track your active e-auction bids, current standings, and past auction outcomes.",
};

const BIDS_DATA = [
  {
    id: "bid-101",
    auctionId: "auc-102",
    auctionNumber: "CA-HR-2026-102",
    title: "Grade-A Commercial Office in DLF Cyber City Phase II, Gurugram",
    bank: "Punjab National Bank",
    myBid: 32150000,
    currentHighest: 32150000,
    status: "WINNING",
    auctionStatus: "LIVE",
    timestamp: "22 Sep 2026, 03:15 PM",
  },
  {
    id: "bid-102",
    auctionId: "auc-101",
    auctionNumber: "CA-MH-2026-088",
    title: "3 BHK Apartment in Goregaon East, Mumbai",
    bank: "Bank of Baroda",
    myBid: 21500000,
    currentHighest: 21800000,
    status: "OUTBID",
    auctionStatus: "CLOSED",
    timestamp: "18 Sep 2026, 04:20 PM",
  },
  {
    id: "bid-103",
    auctionId: "auc-105",
    auctionNumber: "CA-GJ-2026-054",
    title: "Prime Commercial Retail Shop on Ashram Road, Ahmedabad",
    bank: "State Bank of India",
    myBid: 14500000,
    currentHighest: 14500000,
    status: "WON",
    auctionStatus: "CLOSED",
    timestamp: "02 Sep 2026, 02:45 PM",
  },
];

export default function MyBidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bids & History</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time tracking of your active bid submissions, winning standings, and closed auction records
          </p>
        </div>

        <Link
          href="/auctions?status=LIVE"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors self-start sm:self-auto"
        >
          <Gavel className="h-3.5 w-3.5" />
          View Live Bidding Rooms
        </Link>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Auction Details</th>
                <th className="p-4">My Submitted Bid</th>
                <th className="p-4">Current Highest</th>
                <th className="p-4">My Standing</th>
                <th className="p-4">Submission Time</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {BIDS_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 max-w-xs">
                    <span className="font-mono text-[10px] text-gray-400 block mb-0.5">
                      {item.auctionNumber} • {item.bank}
                    </span>
                    <Link
                      href={`/auctions/${item.auctionId}`}
                      className="font-bold text-gray-900 hover:text-primary line-clamp-1 text-xs"
                    >
                      {item.title}
                    </Link>
                  </td>

                  <td className="p-4 font-mono font-bold text-gray-900 text-sm">
                    {formatCurrency(item.myBid)}
                  </td>

                  <td className="p-4 font-mono font-bold text-primary text-sm">
                    {formatCurrency(item.currentHighest)}
                  </td>

                  <td className="p-4">
                    {item.status === "WINNING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-success-600 animate-pulse" />
                        Highest Bidder
                      </span>
                    )}
                    {item.status === "OUTBID" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-error-50 text-error-700 border border-error-200">
                        Outbid
                      </span>
                    )}
                    {item.status === "WON" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-100 text-accent-800 border border-accent-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent-700" />
                        Sale Confirmed
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-500 font-mono text-[11px]">
                    {item.timestamp}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/auctions/${item.auctionId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-primary-50 transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
