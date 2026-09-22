"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface UploadedFile {
  type: string;
  name: string;
  size: number;
  mimeType: string;
}

export default function KycSubmissionPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateFile = (type: string, file: File) => {
    setUploads({
      ...uploads,
      [type]: {
        type,
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/pdf",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploads["PAN_CARD"]) {
      setError("Permanent Account Number (PAN Card) is legally mandatory.");
      return;
    }
    if (!uploads["AADHAAR"]) {
      setError("Address proof (Aadhaar or Passport) is mandatory.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: Object.values(uploads),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/documents");
        }, 2000);
      } else {
        setError(data.error || "Submission failed. Please check files.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: "PAN_CARD",
      title: "1. Permanent Account Number (PAN Card)",
      desc: "Mandatory statutory requirement under Section 139A of Income Tax Act and SARFAESI rules.",
      required: true,
      icon: CreditCard,
    },
    {
      id: "AADHAAR",
      title: "2. Identity & Address Proof (Aadhaar / Passport)",
      desc: "Valid Government of India identity card displaying your registered residential address.",
      required: true,
      icon: FileText,
    },
    {
      id: "BANK_STATEMENT",
      title: "3. Cancelled Cheque for EMD Refunds",
      desc: "Personalized cancelled cheque or recent bank statement showing Account Number and IFSC.",
      required: true,
      icon: Building2,
    },
    {
      id: "AUTHORIZATION_LETTER",
      title: "4. Board Resolution (For Companies / LLPs)",
      desc: "Certified board resolution authorizing the designated bidder to submit bids on behalf of the company.",
      required: false,
      icon: ShieldCheck,
    },
  ];

  const uploadedCount = Object.keys(uploads).length;
  const progressPercent = Math.min(100, Math.round((uploadedCount / 3) * 100));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statutory KYC Verification</h1>
        <p className="text-xs text-gray-500 mt-1">
          Upload required identification documents for compliance verification and live auction eligibility
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-gray-700">Verification Readiness</span>
          <span className="text-primary font-mono">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error-50 border border-error-200 text-error-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-success-50 border border-success-200 text-success-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>KYC submitted successfully! Redirecting to Document Vault...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {steps.map((step) => {
          const isUploaded = Boolean(uploads[step.id]);
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUploaded
                  ? "bg-success-50/20 border-success-200"
                  : "bg-white border-border hover:border-primary/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isUploaded
                        ? "bg-success-100 text-success-700"
                        : "bg-primary-50 text-primary"
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                      {step.required && (
                        <span className="text-[10px] font-bold text-red-600 uppercase">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    {isUploaded && (
                      <p className="text-xs font-mono text-success-700 mt-1.5 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Uploaded: {uploads[step.id].name}
                      </p>
                    )}
                  </div>
                </div>

                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shrink-0 self-start sm:self-center transition-colors">
                  <Upload className="h-3.5 w-3.5 text-primary" />
                  <span>{isUploaded ? "Replace File" : "Choose File"}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSimulateFile(step.id, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          );
        })}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading || success}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-60 cursor-pointer text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting for Verification...</span>
              </>
            ) : (
              <>
                <span>Submit KYC for Officer Approval</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
