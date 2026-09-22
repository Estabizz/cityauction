import Link from "next/link";
import type { Metadata } from "next";
import {
  Gavel,
  Building,
  UserCheck,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AuctionStatusBadge } from "@/components/ui/badge";
import { MOCK_AUCTIONS } from "@/services/mock-data";

export const metadata: Metadata = {
  title: "Bank Officer & Admin Dashboard | CityAuction",
  description: "Administrative console for managing SARFAESI auctions, bidder approvals, and statutory logs.",
};

const KPI_STATS = [
  {
    title: "Total Listed Auctions",
    value: "142",
    subtext: "+18 new this week",
    icon: <Gavel className="h-5 w-5 text-primary" />,
  },
  {
    title: "Live Bidding Today",
    value: "4",
    subtext: "2 closing in next 2 hours",
    icon: <Clock className="h-5 w-5 text-amber-600" />,
  },
  {
    title: "Cumulative Asset Value",
    value: "₹485 Cr",
    subtext: "Across 16 partner banks",
    icon: <TrendingUp className="h-5 w-5 text-success" />,
  },
  {
    title: "KYC Verifications Pending",
    value: "7",
    subtext: "Requires officer review",
    icon: <UserCheck className="h-5 w-5 text-red-600" />,
  },
];

export default function AdminDashboardPage() {
  const liveAuctions = MOCK_AUCTIONS.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Institutional Officer Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time control center for SARFAESI notices, bidder admission, and recovery monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/auctions/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Publish New Auction</span>
          </Link>
          <Link
            href="/admin/kyc"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Review KYC (7)</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_STATS.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="p-2 rounded-xl bg-gray-50">{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{stat.value}</div>
            <p className="text-[11px] text-gray-500 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Live & Upcoming Auctions Table */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Active & Upcoming E-Auctions Under Resolution
            </h2>
            <p className="text-xs text-gray-500">
              Real-time monitoring of live bid rooms and tender submission deadlines
            </p>
          </div>

          <Link
            href="/admin/auctions"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Auctions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Auction Notice</th>
                <th className="p-3">Lending Bank</th>
                <th className="p-3">Reserve Price</th>
                <th className="p-3">EMD (10%)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Auction Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {liveAuctions.map((auc) => (
                <tr key={auc.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3 max-w-xs">
                    <span className="font-mono text-[10px] text-gray-400 block mb-0.5 font-semibold">
                      {auc.auctionNumber} • {auc.auctionType}
                    </span>
                    <span className="font-bold text-gray-900 line-clamp-1">{auc.title}</span>
                    <span className="text-[11px] text-gray-500">{auc.city}, {auc.state}</span>
                  </td>

                  <td className="p-3 font-semibold text-gray-800">
                    {auc.organizationName}
                  </td>

                  <td className="p-3 font-mono font-bold text-primary">
                    {formatCurrency(auc.reservePrice)}
                  </td>

                  <td className="p-3 font-mono font-medium text-gray-800">
                    {formatCurrency(auc.emd)}
                  </td>

                  <td className="p-3">
                    <AuctionStatusBadge status={auc.status} />
                  </td>

                  <td className="p-3 text-gray-600">
                    {formatDate(auc.startDateTime)}
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      href={`/auctions/${auc.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-primary-50 transition-colors"
                    >
                      <span>Manage</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Grid: KYC Queue & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KYC Queue Preview */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Pending Bidder Verifications
            </h3>
            <Link href="/admin/kyc" className="text-xs font-semibold text-primary hover:underline">
              Review Queue
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "Apex Infrastructure Pvt Ltd", pan: "AAACA1234D", type: "COMPANY", time: "25 mins ago" },
              { name: "Rohit Deshmukh", pan: "BKRPD9876K", type: "INDIVIDUAL", time: "1 hour ago" },
              { name: "Trident Logistics LLP", pan: "AABFT5432E", type: "LLP", time: "3 hours ago" },
            ].map((bidder, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-border flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{bidder.name}</h4>
                  <p className="text-[11px] text-gray-500 font-mono">
                    PAN: {bidder.pan} • {bidder.type}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block mb-1">{bidder.time}</span>
                  <Link
                    href="/admin/kyc"
                    className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-md hover:bg-primary-700"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CVC & Compliance Vigilance Notice */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Statutory Compliance & Audit Status
            </h3>
            <Link href="/admin/audit-logs" className="text-xs font-semibold text-primary hover:underline">
              View Logs
            </Link>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <p className="p-3 rounded-xl bg-gray-50 border border-border leading-relaxed">
              <strong>CVC Audit Active:</strong> All bid timestamps, IP origins, and encrypted transactions are continuously mirrored to the statutory audit ledger for regulatory oversight.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-success-50 border border-success-200">
                <span className="text-[10px] font-bold text-success-800 uppercase block">Auction Server</span>
                <span className="text-xs font-bold text-success-700">100% Authoritative</span>
              </div>
              <div className="p-3 rounded-xl bg-primary-50 border border-primary-200">
                <span className="text-[10px] font-bold text-primary-800 uppercase block">DSC Verification</span>
                <span className="text-xs font-bold text-primary-700">Class 3 Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
