"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function InstitutionalMandateForm() {
  const [entity, setEntity] = useState("");
  const [asset, setAsset] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact,
          email: "institutional@estabizz.com",
          phone: "N/A",
          subject: `[Institutional Mandate] ${entity} - ${asset} (${location || "N/A"})`,
          message: `Institution Type: ${entity}\nAsset Type: ${asset}\nLocation: ${location}\nContact Person: ${contact}\n\nMandate Details / Sale Stage:\n${details}`,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#fcfaf6] border border-[#e6dfd4] rounded-2xl p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-[#3f6b57] mx-auto" />
        <h4 className="font-serif-heading text-2xl font-bold text-[#182129]">
          Mandate Received
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{contact}</strong>. Your institutional inquiry for <strong>{entity}</strong> ({asset}) has been transmitted to our Institutional Desk. An asset resolution partner will connect with you within 1 business day.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setEntity("");
            setAsset("");
            setLocation("");
            setContact("");
            setDetails("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Submit Another Mandate
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" id="institutionalForm" onSubmit={handleSubmit}>
      <div className="eyebrow-text">Start a discussion</div>
      <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
        Tell Us About the Mandate.
      </h3>

      <div className="search-form-grid mt-4">
        <div className="field-custom">
          <label htmlFor="entity">Institution Type</label>
          <select
            id="entity"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Bank</option>
            <option>NBFC</option>
            <option>ARC</option>
            <option>Liquidator / IP</option>
            <option>Financial Institution</option>
            <option>Corporate</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="asset">Asset Type</label>
          <input
            id="asset"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            placeholder="Property / industrial / business / portfolio"
            required
          />
        </div>

        <div className="field-custom">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / State"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="contact">Contact Person</label>
          <input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Officer Name & Designation"
            required
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="details">Mandate / Current Sale Stage</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Auction date, reserve value, current sale stage, buyer-discovery challenge, portfolio size, etc."
          />
        </div>
      </div>

      <button
        className="btn-pill btn-dark w-full mt-4 flex items-center justify-center gap-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Mandate...
          </>
        ) : (
          "Request Institutional Discussion"
        )}
      </button>

      <div className="text-[11px] text-[#8a9195] mt-2.5 text-center">
        Mandates are handled under institutional confidentiality by Estabizz Fintech.
      </div>
    </form>
  );
}
