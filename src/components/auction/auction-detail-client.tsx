"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Download,
  Share2,
  Heart,
  FileText,
  ShieldAlert,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Gavel,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { AuctionStatusBadge, Badge } from "@/components/ui/badge";
import type { DetailedAuction } from "@/services/mock-data";
import { EmdCheckoutModal } from "@/components/payments/emd-checkout-modal";

interface AuctionDetailClientProps {
  auction: DetailedAuction;
}

export function AuctionDetailClient({ auction }: AuctionDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "location" | "terms" | "documents" | "officer">("description");
  const [isFavourited, setIsFavourited] = useState(auction.isFavourited || false);
  const [shareCopied, setShareCopied] = useState(false);
  const [emdModalOpen, setEmdModalOpen] = useState(false);

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const targetDate = new Date(auction.startDateTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.startDateTime]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const images = auction.images && auction.images.length > 0 ? auction.images : [auction.primaryImage || ''];

  return (
    <div>
      {/* Top Header */}
      <div className="bg-white border-b border-border py-6">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>&gt;</span>
            <Link href="/auctions" className="hover:text-primary">Auctions</Link>
            <span>&gt;</span>
            <Link href={`/auctions?state=${encodeURIComponent(auction.state)}`} className="hover:text-primary">
              {auction.state}
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{auction.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                  {auction.auctionNumber}
                </span>
                <Badge variant="primary">{auction.auctionType}</Badge>
                <AuctionStatusBadge status={auction.status} />
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {auction.city}, {auction.state}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {auction.title}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>{shareCopied ? "Copied!" : "Share"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFavourited(!isFavourited)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isFavourited
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-border text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="Toggle favourite"
              >
                <Heart className={`h-5 w-5 ${isFavourited ? "fill-red-600" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Center Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold rounded-md flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Photo {selectedImageIndex + 1} of {images.length}</span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-3 flex items-center gap-3 overflow-x-auto bg-gray-50 border-t border-border">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-primary shadow-xs ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Information Summary Grid */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-border flex items-center justify-between">
                <span>Auction & Asset Overview</span>
                <span className="text-xs font-normal text-gray-500">SARFAESI Ref ID: {auction.auctionNumber}</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Reserve Price
                  </span>
                  <span className="text-xl font-bold text-primary font-mono tabular-nums">
                    {formatCurrency(auction.reservePrice)}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    EMD (10%)
                  </span>
                  <span className="text-base font-semibold text-gray-900 font-mono tabular-nums">
                    {formatCurrency(auction.emd)}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Bid Increment
                  </span>
                  <span className="text-base font-semibold text-gray-900 font-mono tabular-nums">
                    {formatCurrency(auction.bidIncrement || 50000)}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Possession Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {auction.possessionStatus}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Auction Date
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(auction.startDateTime)}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Auction Time
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    11:00 AM – 03:00 PM
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Submission Deadline
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatDate(auction.submissionDeadline)} (05:00 PM)
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Built-up Area
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {auction.area ? `${auction.area.toLocaleString()} ${auction.areaUnit}` : 'Refer Notice'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border bg-gray-50 overflow-x-auto">
                {[
                  { id: "description", label: "Description" },
                  { id: "location", label: "Location & Address" },
                  { id: "terms", label: "Terms & Conditions" },
                  { id: "documents", label: `Documents (${auction.documents.length})` },
                  { id: "officer", label: "Auction Officer" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-primary text-primary bg-white"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Property Details & Schedule</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {auction.description}
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong>Statutory Disclaimer:</strong> Bidders are strongly advised to inspect the property physically and verify the title, revenue records, society no-dues, and local municipal charges independently prior to submitting their bids.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Official Registered Address</h3>
                    <div className="p-4 rounded-xl bg-gray-50 border border-border text-sm text-gray-800 flex items-start gap-2.5">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">{auction.title}</p>
                        <p className="text-gray-600">{auction.address}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          District: {auction.city} | State: {auction.state}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="space-y-4 text-sm text-gray-700">
                    <h3 className="text-base font-bold text-gray-900">E-Auction Legal Rules & Guidelines</h3>
                    <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed">
                      {auction.terms}
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 mb-2">Downloadable Auction Documents</h3>
                    {auction.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-gray-900">{doc.name}</span>
                            <span className="text-xs text-gray-500">
                              Format: PDF • File size: {doc.size}
                            </span>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-semibold text-primary hover:bg-primary-50 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "officer" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Authorised Recovery Officer</h3>
                    <div className="p-5 rounded-xl border border-border bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {auction.organization.name}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 mt-1">{auction.contactOfficerName}</h4>
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${auction.contactOfficerPhone}`} className="hover:text-primary">
                              {auction.contactOfficerPhone}
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${auction.contactOfficerEmail}`} className="hover:text-primary">
                              {auction.contactOfficerEmail}
                            </a>
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/contact?subject=Auction%20Inquiry%20${auction.auctionNumber}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                      >
                        Send Direct Enquiry
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Bidding & Action Card */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            {/* Live Countdown Card */}
            {timeLeft && (
              <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white rounded-2xl p-5 shadow-lg border border-primary-700">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Auction Commences In</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/10 rounded-xl p-2">
                    <span className="block text-2xl font-bold font-mono">{timeLeft.days}</span>
                    <span className="text-[10px] text-primary-200 uppercase">Days</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <span className="block text-2xl font-bold font-mono">{timeLeft.hours}</span>
                    <span className="text-[10px] text-primary-200 uppercase">Hours</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <span className="block text-2xl font-bold font-mono">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-primary-200 uppercase">Mins</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2">
                    <span className="block text-2xl font-bold font-mono">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-primary-200 uppercase">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bidding Participation Card */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider block font-medium">
                  Current Reserve Price
                </span>
                <span className="text-2xl font-bold text-primary font-mono tabular-nums block mt-1">
                  {formatCurrency(auction.reservePrice)}
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  Mandatory EMD: <strong>{formatCurrency(auction.emd)}</strong>
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                {auction.status === "LIVE" ? (
                  <Link
                    href={`/bidding/${auction.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-sm"
                  >
                    <Gavel className="h-4 w-4" />
                    Enter Live Bidding Room
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEmdModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-md text-sm cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Deposit EMD & Register to Bid
                  </button>
                )}

                {auction.status === "LIVE" && (
                  <button
                    type="button"
                    onClick={() => setEmdModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-50 text-amber-900 border border-amber-200 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-xs cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                    Deposit Statutory EMD ({formatCurrency(auction.emd)})
                  </button>
                )}

                <Link
                  href={`/contact?subject=Auction%20${auction.auctionNumber}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-xs"
                >
                  Request Property Inspection
                </Link>
              </div>

              {/* Institution badge */}
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                {auction.organization.logo && (
                  <img
                    src={auction.organization.logo}
                    alt={auction.organization.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                )}
                <div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Lender / Institution</span>
                  <span className="text-xs font-bold text-gray-900 block">{auction.organization.name}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-gray-50 rounded-2xl border border-border p-5 space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>100% Verified SARFAESI Notice:</strong> Auction conducted by authorized bank officers under judicial oversight.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic EMD Refund:</strong> 100% EMD refund directly to source account if you do not win the auction.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory EMD Checkout Modal */}
      <EmdCheckoutModal
        isOpen={emdModalOpen}
        onClose={() => setEmdModalOpen(false)}
        auction={{
          id: auction.id,
          auctionNumber: auction.auctionNumber,
          title: auction.title,
          emd: auction.emd,
          reservePrice: auction.reservePrice,
          bankName: auction.organization.name,
        }}
      />
    </div>
  );
}
