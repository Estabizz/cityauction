"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gavel,
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Building2,
  Eye,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AuctionStatusBadge } from "@/components/ui/badge";
import { MOCK_AUCTIONS } from "@/services/mock-data";

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState(MOCK_AUCTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = auctions.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.auctionNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auctions Inventory Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage published SARFAESI notices, schedule bidding windows, and review participant admissions
          </p>
        </div>

        <Link
          href="/admin/auctions/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Publish New Auction</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, ref no., city, or bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-gray-50 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="LIVE">Live Now</option>
            <option value="CLOSING_SOON">Closing Soon</option>
            <option value="CLOSED">Closed</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Ref / Title</th>
                <th className="p-4">Lender</th>
                <th className="p-4">Reserve Price</th>
                <th className="p-4">EMD</th>
                <th className="p-4">Status</th>
                <th className="p-4">Auction Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {filtered.map((auc) => (
                <tr key={auc.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 max-w-xs">
                    <span className="font-mono text-[10px] text-gray-400 block mb-0.5 font-bold">
                      {auc.auctionNumber} • {auc.auctionType}
                    </span>
                    <span className="font-bold text-gray-900 block line-clamp-1">{auc.title}</span>
                    <span className="text-[11px] text-gray-500">{auc.city}, {auc.state}</span>
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {auc.organizationName}
                  </td>

                  <td className="p-4 font-mono font-bold text-primary">
                    {formatCurrency(auc.reservePrice)}
                  </td>

                  <td className="p-4 font-mono font-medium text-gray-800">
                    {formatCurrency(auc.emd)}
                  </td>

                  <td className="p-4">
                    <AuctionStatusBadge status={auc.status} />
                  </td>

                  <td className="p-4 text-gray-600">
                    {formatDate(auc.startDateTime)}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/auctions/${auc.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-border bg-white text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/participants?auctionId=${auc.id}`}
                        className="px-2 py-1 rounded-lg border border-primary/20 bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors font-semibold text-[11px]"
                      >
                        Bidders
                      </Link>
                    </div>
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
