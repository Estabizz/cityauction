"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, CheckCircle2, Clock, XCircle, Search, ExternalLink, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ParticipantItem {
  id: string;
  auctionNumber: string;
  auctionTitle: string;
  bidderName: string;
  bidderPan: string;
  emdAmount: number;
  paymentMode: string;
  utrNumber: string;
  status: "REGISTERED" | "APPROVED" | "REJECTED";
  appliedAt: string;
}

const INITIAL_PARTICIPANTS: ParticipantItem[] = [
  {
    id: "part-1",
    auctionNumber: "CA-MH-2026-101",
    auctionTitle: "3 BHK Luxury Apartment in Lodha Bellissimo, Mahalaxmi",
    bidderName: "Vikramaditya Sharma",
    bidderPan: "VWXYZ5678G",
    emdAmount: 4850000,
    paymentMode: "RTGS (State Bank of India)",
    utrNumber: "SBINR520260918112233",
    status: "APPROVED",
    appliedAt: "18 Sep 2026, 11:20 AM",
  },
  {
    id: "part-2",
    auctionNumber: "CA-HR-2026-102",
    auctionTitle: "Grade-A Commercial Office in DLF Cyber City Phase II, Gurugram",
    bidderName: "Vikramaditya Sharma",
    bidderPan: "VWXYZ5678G",
    emdAmount: 3200000,
    paymentMode: "Online Gateway (HDFC NetBanking)",
    utrNumber: "PUNBR520260920998877",
    status: "APPROVED",
    appliedAt: "20 Sep 2026, 02:40 PM",
  },
  {
    id: "part-3",
    auctionNumber: "CA-KA-2026-108",
    auctionTitle: "Fertile Agricultural Farmland of 4.5 Acres near Devanahalli",
    bidderName: "Apex Infrastructure Pvt Ltd",
    bidderPan: "AAACA1234D",
    emdAmount: 3800000,
    paymentMode: "NEFT (ICICI Bank)",
    utrNumber: "ICICR520260922883344",
    status: "REGISTERED",
    appliedAt: "Today, 10:15 AM",
  },
  {
    id: "part-4",
    auctionNumber: "CA-KA-2026-103",
    auctionTitle: "Industrial Manufacturing Factory, Peenya Industrial Area",
    bidderName: "Trident Logistics LLP",
    bidderPan: "AABFT5432E",
    emdAmount: 6500000,
    paymentMode: "RTGS (Axis Bank)",
    utrNumber: "UTIBR520260921776655",
    status: "REGISTERED",
    appliedAt: "Yesterday, 04:30 PM",
  },
];

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<ParticipantItem[]>(INITIAL_PARTICIPANTS);
  const [search, setSearch] = useState("");

  const handleApprove = (id: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p))
    );
  };

  const filtered = participants.filter(
    (p) =>
      p.bidderName.toLowerCase().includes(search.toLowerCase()) ||
      p.auctionNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.utrNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participant EMD Approvals</h1>
          <p className="text-xs text-gray-500 mt-1">
            Reconcile incoming EMD payments with bank RTGS logs and admit eligible bidders to live bidding rooms
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by bidder name, auction ID, or UTR number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Auction Ref</th>
                <th className="p-4">Bidder Details</th>
                <th className="p-4">EMD Amount</th>
                <th className="p-4">Payment UTR</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 max-w-xs">
                    <span className="font-mono text-[10px] text-gray-400 block mb-0.5 font-bold">
                      {item.auctionNumber}
                    </span>
                    <span className="font-bold text-gray-900 block line-clamp-1">{item.auctionTitle}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-gray-900 block">{item.bidderName}</span>
                    <span className="text-[11px] text-gray-500 font-mono">PAN: {item.bidderPan}</span>
                  </td>

                  <td className="p-4 font-mono font-bold text-primary text-sm">
                    {formatCurrency(item.emdAmount)}
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-gray-800 font-bold block">{item.utrNumber}</span>
                    <span className="text-[11px] text-gray-400">{item.paymentMode}</span>
                  </td>

                  <td className="p-4">
                    {item.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Admitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3.5 w-3.5" />
                        Awaiting Verification
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {item.status !== "APPROVED" ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 bg-success text-white text-xs font-semibold rounded-lg hover:bg-success-700 transition-colors cursor-pointer shadow-xs"
                      >
                        Verify & Admit
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Approved</span>
                    )}
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
