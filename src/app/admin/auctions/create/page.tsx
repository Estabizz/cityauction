"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Gavel,
  Building2,
  Calendar,
  IndianRupee,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { INDIAN_STATES, PROPERTY_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function CreateAuctionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    // Step 1: Property
    title: "",
    category: "RESIDENTIAL",
    address: "",
    city: "Mumbai",
    state: "Maharashtra",
    area: "1200",
    areaUnit: "sq ft",
    possessionStatus: "PHYSICAL",

    // Step 2: Auction
    bankName: "State Bank of India",
    auctionType: "SARFAESI",
    reservePrice: "25000000",
    emd: "2500000",
    bidIncrement: "50000",
    startDate: "2026-10-15",
    startTime: "11:00",
    endDate: "2026-10-15",
    endTime: "15:00",
    submissionDeadline: "2026-10-13",
    inspectionDate: "2026-10-08",

    // Step 3: Officer & Notice
    officerName: "Mr. Rajesh Saxena (Chief Manager)",
    officerPhone: "+91-22-22741234",
    officerEmail: "sarb.mumbai@sbi.co.in",
    noticeFileName: "Form_IV_Sale_Notice_SARFAESI.pdf",
    terms: '1. The property is sold strictly on "As is where is", "As is what is", and "Whatever there is" basis under Rule 8 & 9 of Security Interest Rules, 2002.\n2. EMD must be submitted via RTGS/NEFT prior to the deadline.\n3. Highest bidder must deposit 25% purchase price immediately on confirmation.',
  });

  const handleNext = () => {
    if (currentStep === 1 && !form.title.trim()) {
      setError("Please enter property title.");
      return;
    }
    setError(null);
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    // Simulate creation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/auctions");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-gray-500 mb-1">
            <Link href="/admin/auctions" className="hover:text-primary">Auctions</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">Publish New</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Publish Bank Auction Notice</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            4-step statutory publishing wizard under SARFAESI Act / DRT e-auction rules
          </p>
        </div>
      </div>

      {/* Wizard Progress Tabs */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {[
            { step: 1, label: "1. Asset Details" },
            { step: 2, label: "2. Pricing & Dates" },
            { step: 3, label: "3. Officer & Notice" },
            { step: 4, label: "4. Review & Publish" },
          ].map((item) => (
            <div
              key={item.step}
              className={`py-2 px-2 rounded-xl transition-all ${
                currentStep === item.step
                  ? "bg-primary text-white shadow-xs"
                  : currentStep > item.step
                  ? "bg-success-50 text-success-700 border border-success-200"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {item.label}
            </div>
          ))}
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
          <span>Auction published successfully! Redirecting to auctions list...</span>
        </div>
      )}

      {/* Step 1: Asset Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Step 1: Property / Asset Information</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Property Title / Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3 BHK Luxury Apartment in Lodha Bellissimo, Mahalaxmi"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Property Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {PROPERTY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Possession Status
              </label>
              <select
                value={form.possessionStatus}
                onChange={(e) => setForm({ ...form, possessionStatus: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="PHYSICAL">Physical Possession (Bank has keys)</option>
                <option value="SYMBOLIC">Symbolic Possession (Sec. 13(4))</option>
                <option value="NOT_IN_POSSESSION">Not in Possession</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Property Address / Schedule *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Flat No. 2402, 24th Floor, Tower B, Lodha Bellissimo, Mahalaxmi, Mumbai - 400011"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                City / District
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Built-up Area (Sq Ft)
              </label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Pricing & Dates */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Step 2: Auction Pricing & Scheduling</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Lending Bank / Institution
              </label>
              <select
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="State Bank of India">State Bank of India</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="Union Bank of India">Union Bank of India</option>
                <option value="HDFC Bank Ltd">HDFC Bank Ltd</option>
                <option value="ICICI Bank Ltd">ICICI Bank Ltd</option>
                <option value="Omkara Assets Reconstruction Pvt Ltd">Omkara ARC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Statutory Legal Framework
              </label>
              <select
                value={form.auctionType}
                onChange={(e) => setForm({ ...form, auctionType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="SARFAESI">SARFAESI Act, 2002 (Sec. 13)</option>
                <option value="DRT">Debts Recovery Tribunal (DRT)</option>
                <option value="NPA">NPA Direct Portfolio Sale</option>
                <option value="FORWARD">Forward Auction</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Reserve Price (₹) *
              </label>
              <input
                type="number"
                value={form.reservePrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({
                    ...form,
                    reservePrice: val,
                    emd: String(Math.round(Number(val) * 0.1)), // Auto-calculate 10% EMD
                  });
                }}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                EMD Amount (10%) *
              </label>
              <input
                type="number"
                value={form.emd}
                onChange={(e) => setForm({ ...form, emd: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Bid Increment (₹)
              </label>
              <input
                type="number"
                value={form.bidIncrement}
                onChange={(e) => setForm({ ...form, bidIncrement: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Auction Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                EMD Submission Deadline
              </label>
              <input
                type="date"
                value={form.submissionDeadline}
                onChange={(e) => setForm({ ...form, submissionDeadline: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Physical Inspection Date
              </label>
              <input
                type="date"
                value={form.inspectionDate}
                onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Officer & Notice */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">Step 3: Authorised Officer & Official Notice</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Authorised Officer Name
              </label>
              <input
                type="text"
                value={form.officerName}
                onChange={(e) => setForm({ ...form, officerName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Officer Phone
              </label>
              <input
                type="tel"
                value={form.officerPhone}
                onChange={(e) => setForm({ ...form, officerPhone: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Officer Email
              </label>
              <input
                type="email"
                value={form.officerEmail}
                onChange={(e) => setForm({ ...form, officerEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Upload Official SARFAESI Form IV Sale Notice (PDF)
            </label>
            <div className="p-4 rounded-xl border border-dashed border-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">{form.noticeFileName}</span>
                  <span className="text-[11px] text-gray-400">PDF Notice • Form IV Compliant</span>
                </div>
              </div>
              <label className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-semibold text-primary cursor-pointer hover:bg-gray-100">
                Replace File
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Statutory Terms & Conditions
            </label>
            <textarea
              rows={4}
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="w-full p-3 rounded-lg border border-border bg-gray-50 text-xs text-gray-800 font-mono leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Final Statutory Verification
            </span>
            <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{form.address} • {form.city}, {form.state}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-border">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">Reserve Price</span>
              <span className="text-base font-bold text-primary font-mono">{formatCurrency(form.reservePrice)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">EMD (10%)</span>
              <span className="text-base font-bold text-gray-900 font-mono">{formatCurrency(form.emd)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">Auction Date</span>
              <span className="text-xs font-bold text-gray-900">{form.startDate}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 uppercase">Legal Basis</span>
              <span className="text-xs font-bold text-gray-900">{form.auctionType}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              By publishing this notice, you certify that the property is authorized for sale under Rule 8 & 9 of the Security Interest (Enforcement) Rules, 2002 and the notice has appeared in mandatory newspaper editions.
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={loading || success}
            onClick={handlePublish}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-primary-950 text-xs font-bold rounded-lg hover:bg-accent-300 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing to Portal...</span>
              </>
            ) : (
              <>
                <Gavel className="h-4 w-4" />
                <span>Publish Auction Publicly</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
