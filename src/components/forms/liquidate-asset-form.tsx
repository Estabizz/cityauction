"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Honeypot, SubmitErrorNotice, submitEnquiry } from "./lead-submit";

export function LiquidateAssetForm() {
  const [sellerType, setSellerType] = useState("");
  const [assetType, setAssetType] = useState("");
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitEnquiry(e.currentTarget, {
      source: "liquidate-asset",
      name: contact,
      email,
      subject: `Liquidation intake: ${sellerType} - ${assetType} (${location})`,
      message: details,
      fields: {
        "Seller type": sellerType,
        "Asset type": assetType,
        Location: location,
        "Indicative / reserve value": value,
      },
    });

    setLoading(false);
    if (result.ok) setSubmitted(true);
    else setError(result.error);
  };

  if (submitted) {
    return (
      <div className="bg-[#fcfaf6] border border-[#e6dfd4] rounded-2xl p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-[#3f6b57] mx-auto" />
        <h4 className="font-serif-heading text-2xl font-bold text-[#182129]">
          Asset Particulars Received
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{contact}</strong>. Your asset submission for <strong>{assetType}</strong> ({location}) has been routed to the CityAuction Institutional Desk. An asset resolution specialist will reach out to <strong>{email}</strong>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setSellerType("");
            setAssetType("");
            setLocation("");
            setValue("");
            setContact("");
            setEmail("");
            setDetails("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Submit Another Asset
        </button>
      </div>
    );
  }

  return (
    <form id="submitAssetForm" onSubmit={handleSubmit}>
      <div className="search-form-grid">
        <div className="field-custom">
          <label htmlFor="sellerType">Seller / Stakeholder</label>
          <select
            id="sellerType"
            value={sellerType}
            onChange={(e) => setSellerType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Bank">Bank</option>
            <option value="NBFC">NBFC</option>
            <option value="ARC">ARC</option>
            <option value="Liquidator / IP">Liquidator / IP</option>
            <option value="Financial Institution">Financial Institution</option>
            <option value="Corporate">Corporate</option>
            <option value="Developer / Asset Owner">Developer / Asset Owner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="assetType">Asset Type</label>
          <select
            id="assetType"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Land & Building">Land & Building</option>
            <option value="Residential Property">Residential Property</option>
            <option value="Commercial Property">Commercial Property</option>
            <option value="Industrial Property">Industrial Property</option>
            <option value="Plant & Machinery">Plant & Machinery</option>
            <option value="Vehicle / Movable Asset">Vehicle / Movable Asset</option>
            <option value="Going Concern / Business">Going Concern / Business</option>
            <option value="Slump Sale / Set of Assets">Slump Sale / Set of Assets</option>
            <option value="Securities / Financial Assets">Securities / Financial Assets</option>
            <option value="Receivables / Claims / NRRA">Receivables / Claims / NRRA</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="City / State"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="value">Indicative / Reserve Value</label>
          <input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="₹"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="contact">Contact Person</label>
          <input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="Name & Designation"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="official@institution.com"
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="details">Asset / Sale Context</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Brief asset details, current sale stage, auction date if fixed, possession status, legal route, etc."
          />
        </div>
      </div>

      <Honeypot />
      {error && <SubmitErrorNotice message={error} />}

      <button
        className="btn-pill btn-dark w-full mt-4 flex items-center justify-center gap-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting to Institutional Desk...
          </>
        ) : (
          "Submit to Institutional Desk"
        )}
      </button>

      <div className="text-[11px] text-[#8b9195] mt-2.5 text-center">
        Front-end intake connected to CityAuction Institutional Desk & CRM workflow.
      </div>
    </form>
  );
}
