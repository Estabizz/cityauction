"use client";

import { useState } from "react";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  Building2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

interface KycApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  pan: string;
  city: string;
  state: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED";
  submittedAt: string;
  documents: { type: string; name: string; url: string }[];
}

const INITIAL_APPLICANTS: KycApplicant[] = [
  {
    id: "kyc-101",
    name: "Apex Infrastructure Pvt Ltd",
    email: "legal@apexinfra.in",
    phone: "+91-9820112233",
    accountType: "ORGANIZATION",
    pan: "AAACA1234D",
    city: "Mumbai",
    state: "Maharashtra",
    status: "SUBMITTED",
    submittedAt: "25 mins ago",
    documents: [
      { type: "Company PAN", name: "Company_PAN_AAACA1234D.pdf", url: "#" },
      { type: "Incorporation", name: "Certificate_of_Incorporation.pdf", url: "#" },
      { type: "Board Resolution", name: "Board_Resolution_Authorised_Signatory.pdf", url: "#" },
      { type: "Cancelled Cheque", name: "Apex_HDFC_Cancelled_Cheque.pdf", url: "#" },
    ],
  },
  {
    id: "kyc-102",
    name: "Rohit Deshmukh",
    email: "rohit.deshmukh@gmail.com",
    phone: "+91-9876501234",
    accountType: "INDIVIDUAL",
    pan: "BKRPD9876K",
    city: "Pune",
    state: "Maharashtra",
    status: "SUBMITTED",
    submittedAt: "1 hour ago",
    documents: [
      { type: "PAN Card", name: "PAN_BKRPD9876K.pdf", url: "#" },
      { type: "Aadhaar Card", name: "Aadhaar_Front_Back.pdf", url: "#" },
      { type: "Cancelled Cheque", name: "SBI_Cancelled_Cheque.pdf", url: "#" },
    ],
  },
  {
    id: "kyc-103",
    name: "Trident Logistics LLP",
    email: "finance@tridentlogistics.com",
    phone: "+91-9988776655",
    accountType: "ORGANIZATION",
    pan: "AABFT5432E",
    city: "Gurugram",
    state: "Haryana",
    status: "SUBMITTED",
    submittedAt: "3 hours ago",
    documents: [
      { type: "LLP PAN", name: "LLP_PAN_Card.pdf", url: "#" },
      { type: "Partnership Deed", name: "LLP_Agreement_Partnership.pdf", url: "#" },
      { type: "Cancelled Cheque", name: "ICICI_Cheque.pdf", url: "#" },
    ],
  },
  {
    id: "kyc-104",
    name: "Vikramaditya Sharma",
    email: "bidder@cityauction.com",
    phone: "+91-9876543211",
    accountType: "INDIVIDUAL",
    pan: "VWXYZ5678G",
    city: "Mumbai",
    state: "Maharashtra",
    status: "APPROVED",
    submittedAt: "15 Sep 2026",
    documents: [
      { type: "PAN Card", name: "PAN_Verified.pdf", url: "#" },
      { type: "Aadhaar Card", name: "Aadhaar_Verified.pdf", url: "#" },
    ],
  },
];

export default function AdminKycPage() {
  const [applicants, setApplicants] = useState<KycApplicant[]>(INITIAL_APPLICANTS);
  const [filter, setFilter] = useState("ALL");
  const [activeModal, setActiveModal] = useState<KycApplicant | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setActiveModal(null);
    setRemarks("");
  };

  const filtered = applicants.filter((a) => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bidder KYC Verification Queue</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review identity documents, PAN validation, and approve bidders for SARFAESI auction eligibility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filter === "ALL" ? "bg-primary text-white" : "bg-white border border-border text-gray-700"
            }`}
          >
            All ({applicants.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("SUBMITTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filter === "SUBMITTED"
                ? "bg-amber-600 text-white"
                : "bg-white border border-border text-gray-700"
            }`}
          >
            Pending Review ({applicants.filter((a) => a.status === "SUBMITTED").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("APPROVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filter === "APPROVED"
                ? "bg-success-600 text-white"
                : "bg-white border border-border text-gray-700"
            }`}
          >
            Approved ({applicants.filter((a) => a.status === "APPROVED").length})
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Applicant Name</th>
                <th className="p-4">Account Type</th>
                <th className="p-4">Permanent Account Number</th>
                <th className="p-4">Location</th>
                <th className="p-4">Attached Docs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-gray-900 block text-xs">{item.name}</span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {item.email} • {item.phone}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800">
                      {item.accountType}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-gray-900">
                    {item.pan}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.city}, {item.state}
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-primary">{item.documents.length} Files</span>
                  </td>

                  <td className="p-4">
                    {item.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    ) : item.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-error-50 text-error-700 border border-error-200">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveModal(item)}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                    >
                      Examine Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-border">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  Statutory KYC Inspection
                </span>
                <h3 className="text-lg font-bold text-gray-900">{activeModal.name}</h3>
                <p className="text-xs text-gray-500 font-mono">PAN: {activeModal.pan} • {activeModal.city}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Document Links */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Attached Identification Records
              </label>
              <div className="space-y-2">
                {activeModal.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-50 border border-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-bold text-gray-900 block">{doc.type}</span>
                        <span className="text-gray-500 text-[11px]">{doc.name}</span>
                      </div>
                    </div>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      Inspect
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Officer Remarks (Sent to Bidder)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Identity and cancelled cheque verified. Approved for bidding."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-gray-50 text-xs text-gray-800"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleUpdateStatus(activeModal.id, "REJECTED")}
                className="px-4 py-2 bg-error-50 text-error-700 hover:bg-error-100 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(activeModal.id, "APPROVED")}
                className="px-5 py-2 bg-success text-white hover:bg-success-700 font-semibold rounded-lg text-xs shadow-sm cursor-pointer"
              >
                Approve & Issue Bidding Rights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
