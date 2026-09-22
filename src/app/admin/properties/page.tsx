"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Search, PlusCircle, ExternalLink, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { MOCK_AUCTIONS } from "@/services/mock-data";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");

  const properties = MOCK_AUCTIONS.map((a) => ({
    id: `prop-${a.id}`,
    title: a.title,
    category: a.categoryType,
    address: a.address,
    city: a.city,
    state: a.state,
    area: a.area ? `${a.area} ${a.areaUnit}` : "On Request",
    possession: a.possessionStatus,
    estimatedValue: Number(a.reservePrice) * 1.25,
    bank: a.organizationName,
    auctionId: a.id,
  }));

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.bank.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distressed Property Inventory</h1>
          <p className="text-xs text-gray-500 mt-1">
            Registered mortgaged assets, legal possession status, and estimated open market valuations
          </p>
        </div>

        <Link
          href="/admin/auctions/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property title, city, or bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Property Inventory Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Property & Address</th>
                <th className="p-4">Category</th>
                <th className="p-4">Lender Institution</th>
                <th className="p-4">Built-up Area</th>
                <th className="p-4">Possession</th>
                <th className="p-4">Estimated Value</th>
                <th className="p-4 text-right">Auction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 max-w-xs">
                    <span className="font-bold text-gray-900 block line-clamp-1">{prop.title}</span>
                    <span className="text-[11px] text-gray-500 line-clamp-1">{prop.address}</span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800">
                      {prop.category}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {prop.bank}
                  </td>

                  <td className="p-4 text-gray-600 font-mono">
                    {prop.area}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-success-50 text-success-700 border border-success-200">
                      {prop.possession}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-primary">
                    {formatCurrency(prop.estimatedValue)}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/auctions/${prop.auctionId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-primary-50 transition-colors"
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
