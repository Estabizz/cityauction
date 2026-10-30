"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Honeypot, SubmitErrorNotice, submitEnquiry } from "./lead-submit";

export function AuctionAlertsForm() {
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("Any Asset Type");
  const [budget, setBudget] = useState("Any Budget");
  const [channel, setChannel] = useState("All Opportunities");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitEnquiry(e.currentTarget, {
      source: "auction-alerts",
      name,
      email,
      phone: mobile,
      subject: `Auction alert: ${assetType} in ${location || "All India"} (${budget})`,
      fields: {
        Location: location || "All India",
        "Asset type": assetType,
        Budget: budget,
        "Opportunity type": channel,
      },
    });

    setLoading(false);
    if (result.ok) setSubmitted(true);
    else setError(result.error);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-[#3f6b57] mx-auto" />
        <h3 className="font-serif-heading text-2xl font-bold text-[#182129]">
          Personalised Alert Activated
        </h3>
        <p className="text-sm text-[#6f777d] max-w-sm mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Your mandate preferences for <strong>{assetType}</strong> in <strong>{location || "All India"}</strong> ({budget}) have been recorded. You will receive direct updates on <strong>{mobile}</strong>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setLocation("");
            setName("");
            setMobile("");
            setEmail("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Create Another Alert
        </button>
      </div>
    );
  }

  return (
    <form id="alert-form" onSubmit={handleSubmit}>
      <div className="eyebrow-text">Build your mandate</div>
      <h3 className="font-serif-heading text-2xl font-bold text-[#182129] mt-2">
        What Should CityAuction Watch For?
      </h3>
      <p className="text-xs text-[#6f777d] mt-2">Keep the alert broad or make it very specific.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="field-custom">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            placeholder="City / State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="field-custom">
          <label htmlFor="asset">Asset Type</label>
          <select
            id="asset"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option>Any Asset Type</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
            <option>Land / Plot</option>
            <option>Plant &amp; Machinery</option>
            <option>Vehicle</option>
            <option>Customs Goods</option>
            <option>Business / Project Opportunity</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="budget">Budget</label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option>Any Budget</option>
            <option>Below ₹25 Lakh</option>
            <option>₹25–50 Lakh</option>
            <option>₹50 Lakh–₹1 Crore</option>
            <option>₹1–5 Crore</option>
            <option>₹5 Crore+</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="channel">Auction / Opportunity Type</label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option>All Opportunities</option>
            <option>SARFAESI</option>
            <option>DRT</option>
            <option>ARC</option>
            <option>IBC / Liquidation</option>
            <option>Customs Auction</option>
            <option>Government / Court</option>
            <option>Next Chapter</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-custom">
          <label htmlFor="mobile">Mobile / WhatsApp</label>
          <input
            id="mobile"
            inputMode="tel"
            required
            placeholder="+91..."
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Optional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Honeypot />
      {error && <SubmitErrorNotice message={error} />}

      <button
        className="btn-pill btn-dark w-full mt-6 flex items-center justify-center gap-2 cursor-pointer"
        type="submit"
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Activating Alert..." : "Create Personalised Alert"}
      </button>

      <div className="micro text-[11px] text-[#8a9195] mt-3 leading-relaxed">
        Personalised alerts are delivered over WhatsApp and email when matched inventory is discovered.
      </div>
    </form>
  );
}
