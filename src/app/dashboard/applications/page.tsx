import Link from "next/link";
import type { Metadata } from "next";
import { FileCheck, Download, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Auction Applications & EMD Status | CityAuction",
  description: "Track your submitted auction tender applications, EMD receipts, and officer approvals.",
};

const APPLICATIONS = [
  {
    id: "app-101",
    refNumber: "APP-2026-8812",
    auctionId: "auc-101",
    auctionNumber: "CA-MH-2026-101",
    title: "3 BHK Luxury Apartment in Lodha Bellissimo, Mahalaxmi",
    bank: "State Bank of India",
    emdAmount: 4850000,
    utrNumber: "SBINR520260918112233",
    status: "APPROVED",
    date: "18 Sep 2026",
    remarks: "EMD payment verified via RTGS. Bidder approved for live e-auction room.",
  },
  {
    id: "app-102",
    refNumber: "APP-2026-8890",
    auctionId: "auc-102",
    auctionNumber: "CA-HR-2026-102",
    title: "Grade-A Commercial Office in DLF Cyber City Phase II, Gurugram",
    bank: "Punjab National Bank",
    emdAmount: 3200000,
    utrNumber: "PUNBR520260920998877",
    status: "APPROVED",
    date: "20 Sep 2026",
    remarks: "Bidder KYC & DSC verified. Admitted to live bidding.",
  },
  {
    id: "app-103",
    refNumber: "APP-2026-8945",
    auctionId: "auc-108",
    auctionNumber: "CA-KA-2026-108",
    title: "Fertile Agricultural Farmland of 4.5 Acres near Devanahalli",
    bank: "State Bank of India",
    emdAmount: 3800000,
    utrNumber: "SBINR520260922445566",
    status: "UNDER_REVIEW",
    date: "Today, 11:30 AM",
    remarks: "EMD received. Authorised officer currently reviewing agricultural status certificate.",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auction Participation & EMD Applications</h1>
          <p className="text-xs text-gray-500 mt-1">
            Status of submitted tender forms, EMD remittances, and bank authorization approvals
          </p>
        </div>

        <Link
          href="/auctions"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors self-start sm:self-auto"
        >
          Apply for New Auction
        </Link>
      </div>

      <div className="space-y-4">
        {APPLICATIONS.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-primary/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded">
                  {app.refNumber}
                </span>
                <span className="font-mono text-xs text-gray-500">
                  Auction: {app.auctionNumber}
                </span>
                <span className="text-xs font-semibold text-primary">
                  • {app.bank}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900">{app.title}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600 pt-1">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">EMD Remitted</span>
                  <span className="font-mono font-bold text-primary">{formatCurrency(app.emdAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Payment UTR Ref</span>
                  <span className="font-mono text-gray-800">{app.utrNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Application Date</span>
                  <span className="text-gray-800">{app.date}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-1.5">
                <span className="font-semibold text-gray-700 shrink-0">Officer Remarks:</span>
                <span>{app.remarks}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
              {app.status === "APPROVED" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-50 text-success-700 border border-success-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Application Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="h-4 w-4" />
                  Under Officer Review
                </span>
              )}

              <Link
                href={`/auctions/${app.auctionId}`}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Auction Room
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
