"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PaymentRecord } from "@/services/payment.service";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [metrics, setMetrics] = useState({
    totalDeposited: "₹0",
    activeInBidding: "₹0",
    refundedToBank: "₹0",
    pendingClearance: "₹0",
    transactionCount: 0,
  });
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/payments/history");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setPayments(data.payments || []);
            setMetrics(data.metrics || metrics);
          }
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPayments = payments.filter((p) => {
    if (filterType === "EMD" && p.type !== "EMD") return false;
    if (filterType === "REFUND" && p.status !== "REFUNDED") return false;
    if (filterType === "FEE" && p.type !== "APPLICATION_FEE") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.auctionNumber.toLowerCase().includes(q) ||
        p.propertyTitle.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        (p.utrNumber && p.utrNumber.toLowerCase().includes(q)) ||
        (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Payments & EMD Escrow Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track statutory Earnest Money Deposits (EMD), tender application fees, and RBI
            72-hour refund reconciliations.
          </p>
        </div>
      </div>

      {/* Statutory Refund Guarantee Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            RBI & SARFAESI Act Statutory Refund Guarantee
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            All Earnest Money Deposits (EMD) remain in designated bank escrow accounts.
            Unsuccessful bidders receive <strong>100% automatic refund</strong> directly to
            their verified bank account within <strong>72 banking hours</strong> of auction
            conclusion without any deductions.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Total Deposited</span>
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono text-gray-900 block">
            {metrics.totalDeposited}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Cumulative across all auctions
          </span>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Active in Bidding</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-xl font-bold font-mono text-amber-600 block">
            {metrics.activeInBidding}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Locked in ongoing live rooms
          </span>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Refunded to Bank</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xl font-bold font-mono text-emerald-600 block">
            {metrics.refundedToBank}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Processed via RTGS to verified A/C
          </span>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Verified Refund Route</span>
            <Building2 className="h-4 w-4 text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-900 block truncate mt-1">
            SBI ••••4012
          </span>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
            <Check className="h-3 w-3" /> Auto-credit routing active
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl">
            {[
              { id: "ALL", label: "All Records" },
              { id: "EMD", label: "EMD Deposits" },
              { id: "REFUND", label: "EMD Refunds" },
              { id: "FEE", label: "Tender Fees" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref, auction no, UTR..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-border rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 border-y border-border">
              <tr>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Auction / Asset</th>
                <th className="py-3 px-4 font-semibold">Type & Channel</th>
                <th className="py-3 px-4 font-semibold">Ref / UTR</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading statutory ledger records...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No transactions found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <span className="block text-[10px] text-gray-400">
                        {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        href={`/auctions/${p.auctionId}`}
                        className="font-bold text-gray-900 hover:text-primary transition line-clamp-1 block"
                      >
                        {p.propertyTitle}
                      </Link>
                      <span className="text-[11px] font-mono text-gray-500">
                        {p.auctionNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800 block">
                        {p.type === "EMD" ? "Earnest Money Deposit" : "Application Fee"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {p.gateway === "RAZORPAY" ? "Online Gateway (Razorpay)" : "Bank RTGS Escrow"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600">
                      {p.utrNumber || p.gatewayPaymentId || p.orderId}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {p.formattedAmount}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Check className="h-3 w-3" /> Paid / Admitted
                        </span>
                      )}
                      {p.status === "REFUNDED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Refunded (100%)
                        </span>
                      )}
                      {p.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Reconciling
                        </span>
                      )}
                      {p.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                        title="Download Statutory Tax / EMD Receipt"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
