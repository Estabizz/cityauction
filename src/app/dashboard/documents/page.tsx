"use client";

import { useState } from "react";
import {
  FolderLock,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  AlertCircle,
  KeyRound,
} from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  fileSize: string;
  uploadedAt: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Permanent Account Number (PAN Card).pdf",
    type: "PAN_CARD",
    status: "VERIFIED",
    fileSize: "1.2 MB",
    uploadedAt: "15 Sep 2026",
  },
  {
    id: "doc-2",
    name: "Aadhaar Card (Identity & Address Proof).pdf",
    type: "AADHAAR",
    status: "VERIFIED",
    fileSize: "2.4 MB",
    uploadedAt: "15 Sep 2026",
  },
  {
    id: "doc-3",
    name: "Cancelled Cheque for EMD Refund Routing.pdf",
    type: "BANK_STATEMENT",
    status: "VERIFIED",
    fileSize: "850 KB",
    uploadedAt: "16 Sep 2026",
  },
  {
    id: "doc-4",
    name: "Board Resolution & Signatory Authorization.pdf",
    type: "AUTHORIZATION_LETTER",
    status: "VERIFIED",
    fileSize: "1.8 MB",
    uploadedAt: "16 Sep 2026",
  },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [uploading, setUploading] = useState(false);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);

      setTimeout(() => {
        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: "OTHER",
          status: "PENDING",
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: "Just now",
        };
        setDocs([newDoc, ...docs]);
        setUploading(false);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC & Document Vault</h1>
          <p className="text-xs text-gray-500 mt-1">
            Secure, encrypted vault for your statutory identity proofs, PAN card, and digital certificates
          </p>
        </div>

        {/* Upload Trigger */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer self-start sm:self-auto">
          <Upload className="h-4 w-4" />
          <span>{uploading ? "Uploading Document..." : "Upload New Document"}</span>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulateUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Class 3 DSC Status Card */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
            <KeyRound className="h-4 w-4" />
            Class 3 Digital Signature Certificate (DSC)
          </div>
          <h2 className="text-lg font-bold">Cryptographic USB Token Connected</h2>
          <p className="text-xs text-primary-200">
            Certificate Serial: <strong>7F39-A1B2-C3D4-E5F6</strong> • Issued to: Vikramaditya Sharma • Valid until: <strong>14 Aug 2027</strong>
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-success-500/20 border border-success-400 text-success-300">
          Active & Valid
        </span>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">Uploaded KYC Records ({docs.length})</h2>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">{doc.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>Size: {doc.fileSize}</span>
                  <span>•</span>
                  <span>Uploaded: {doc.uploadedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {doc.status === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-50 text-success-700 border border-success-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="h-3.5 w-3.5" />
                  Under Review
                </span>
              )}

              <button
                type="button"
                className="p-2 rounded-lg border border-border bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Download verified document"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
