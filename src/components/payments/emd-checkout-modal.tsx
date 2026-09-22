"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  CreditCard,
  ArrowRight,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface EmdCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: {
    id: string;
    auctionNumber: string;
    title: string;
    emd: number | string;
    reservePrice: number | string;
    bankName?: string;
  };
  onSuccess?: (payment: any) => void;
}

export function EmdCheckoutModal({
  isOpen,
  onClose,
  auction,
  onSuccess,
}: EmdCheckoutModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"RAZORPAY" | "RTGS">("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // RTGS Challan form fields
  const [remitterBank, setRemitterBank] = useState("State Bank of India");
  const [utrNumber, setUtrNumber] = useState("");

  // Completed payment state
  const [completedPayment, setCompletedPayment] = useState<any | null>(null);

  if (!isOpen) return null;

  const emdAmount = typeof auction.emd === "number" ? auction.emd : parseFloat(auction.emd) || 0;
  const reserveAmount =
    typeof auction.reservePrice === "number"
      ? auction.reservePrice
      : parseFloat(auction.reservePrice) || 0;

  const cleanCode = auction.auctionNumber.replace(/[^A-Z0-9]/gi, "").slice(-6);
  const virtualAccount = {
    beneficiaryName: `CityAuction Escrow Client A/C - ${auction.auctionNumber}`,
    accountNumber: `CAEMD${cleanCode}9041`,
    ifsc: "PUNB0001200",
    bankName: "Punjab National Bank",
    branch: "Corporate Large Recovery Branch, New Delhi",
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: auction.id,
          auctionNumber: auction.auctionNumber,
          propertyTitle: auction.title,
          amount: emdAmount,
          type: "EMD",
          gateway: "RAZORPAY",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // Simulate gateway authorization time
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const mockPaymentId = `pay_Rzp${Math.floor(100000000 + Math.random() * 900000000)}`;

      // 2. Verify payment
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          gatewayPaymentId: mockPaymentId,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      setCompletedPayment(verifyData.payment);
      if (onSuccess) onSuccess(verifyData.payment);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleRtgsSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 8) {
      setError("Please enter a valid 16 to 22 digit Bank UTR / Transaction Reference.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: auction.id,
          auctionNumber: auction.auctionNumber,
          propertyTitle: auction.title,
          amount: emdAmount,
          type: "EMD",
          gateway: "RTGS",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to generate RTGS order");
      }

      // Simulate clearance
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          utrNumber: utrNumber.trim().toUpperCase(),
          remitterBank,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "UTR verification failed");
      }

      setCompletedPayment(verifyData.payment);
      if (onSuccess) onSuccess(verifyData.payment);
    } catch (err: any) {
      setError(err.message || "Failed to submit UTR acknowledgement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SARFAESI Statutory EMD
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {auction.auctionNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              Deposit Earnest Money (EMD)
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {auction.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {completedPayment ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  EMD Successfully Deposited!
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  Your payment of{" "}
                  <strong className="text-gray-900">{formatCurrency(emdAmount)}</strong>{" "}
                  has been verified and credited to the secured escrow account.
                </p>
              </div>

              <div className="bg-slate-50 border border-border rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {completedPayment.gatewayPaymentId || completedPayment.utrNumber || completedPayment.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bidding Clearance:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Admitted (Class-3)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statutory Refund Guarantee:</span>
                  <span className="text-gray-700">100% within 72 hrs if unsuccessful</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/bidding/${auction.id}`);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-md text-sm"
                >
                  Enter Live Bidding Room
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition text-sm"
                >
                  <Download className="h-4 w-4" />
                  Print EMD Receipt
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Steps */
            <>
              {/* Financial Snapshot */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
                    Mandatory EMD Amount (10%)
                  </span>
                  <span className="text-2xl font-bold font-mono text-primary tabular-nums">
                    {formatCurrency(emdAmount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 block">Reserve Price</span>
                  <span className="text-xs font-mono font-medium text-gray-700">
                    {formatCurrency(reserveAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-2">
                  Select Statutory Remittance Channel
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("RAZORPAY")}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      activeTab === "RAZORPAY"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        activeTab === "RAZORPAY" ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <span className="block text-xs font-bold text-gray-900">
                        Online Payment Gateway
                      </span>
                      <span className="text-[11px] text-gray-500">
                        NetBanking, Corporate Cards, UPI
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("RTGS")}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      activeTab === "RTGS"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:bg-gray-50"
                    }`}
                  >
                    <Building2
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        activeTab === "RTGS" ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <span className="block text-xs font-bold text-gray-900">
                        Bank RTGS / NEFT Challan
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Virtual Escrow Account Mandate
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab 1: Razorpay Gateway View */}
              {activeTab === "RAZORPAY" && (
                <div className="space-y-4 pt-2">
                  <div className="border border-border rounded-xl p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Gateway Processor</span>
                      <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> Razorpay Enterprise (AES-256)
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-2 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 bg-gray-50">
                        SBI Corporate
                      </div>
                      <div className="p-2 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 bg-gray-50">
                        HDFC Bank
                      </div>
                      <div className="p-2 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 bg-gray-50">
                        ICICI NetBanking
                      </div>
                      <div className="p-2 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 bg-gray-50">
                        All UPI & Cards
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Instant settlement with real-time clearance. Your participation rights
                      will be approved automatically upon authorization.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRazorpayPayment}
                    className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authorizing Payment with Bank Gateway...
                      </>
                    ) : (
                      <>
                        Pay {formatCurrency(emdAmount)} via Secure Gateway
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab 2: RTGS / NEFT Virtual Escrow View */}
              {activeTab === "RTGS" && (
                <div className="space-y-4 pt-2">
                  <div className="border border-border rounded-xl p-4 bg-slate-50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        Designated Bank Escrow Account Details
                      </span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" /> Print Challan
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">
                            Account Number
                          </span>
                          <span className="font-mono font-bold text-gray-900">
                            {virtualAccount.accountNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(virtualAccount.accountNumber, "acc")}
                          className="p-1 text-gray-400 hover:text-primary"
                        >
                          {copiedField === "acc" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">
                            IFSC Code
                          </span>
                          <span className="font-mono font-bold text-gray-900">
                            {virtualAccount.ifsc}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(virtualAccount.ifsc, "ifsc")}
                          className="p-1 text-gray-400 hover:text-primary"
                        >
                          {copiedField === "ifsc" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-1 pt-1">
                      <div>
                        <strong>Beneficiary:</strong> {virtualAccount.beneficiaryName}
                      </div>
                      <div>
                        <strong>Bank & Branch:</strong> {virtualAccount.bankName},{" "}
                        {virtualAccount.branch}
                      </div>
                    </div>
                  </div>

                  {/* UTR Submission Form */}
                  <form onSubmit={handleRtgsSubmission} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Remitting Bank
                        </label>
                        <select
                          value={remitterBank}
                          onChange={(e) => setRemitterBank(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-white focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="HDFC Bank">HDFC Bank Ltd</option>
                          <option value="ICICI Bank">ICICI Bank Ltd</option>
                          <option value="Axis Bank">Axis Bank Ltd</option>
                          <option value="Canara Bank">Canara Bank</option>
                          <option value="Other Commercial Bank">Other Commercial Bank</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          16/22-Digit UTR Number
                        </label>
                        <input
                          type="text"
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                          placeholder="e.g. PUNBR2026092200192842"
                          className="w-full px-3 py-2 text-xs font-mono border border-border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow text-xs flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting UTR for Instant Clearance...
                        </>
                      ) : (
                        <>
                          Submit UTR for Bidding Clearance
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Statutory Note */}
              <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                Under SARFAESI Act Rule 9, EMD remains secured in the bank's escrow.
                100% of EMD is refunded to unsuccessful bidders within 72 banking hours.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
