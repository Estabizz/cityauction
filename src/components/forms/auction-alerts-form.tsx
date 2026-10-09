"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || "alerts@estabizz.com",
          phone: mobile,
          subject: `[Personalised Alert Mandate] ${assetType} - ${location} (${budget})`,
          message: `Mandate Details:\nLocation: ${location || "All India"}\nAsset Type: ${assetType}\nBudget Range: ${budget}\nOpportunity Type: ${channel}\nName: ${name}\nMobile/WhatsApp: ${mobile}\nEmail: ${email || "Not specified"}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to register alert");
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="alert-card text-center space-y-4">
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
    <form className="alert-card" id="alert-form" onSubmit={handleSubmit}>
      <div className="eyebrow">Build your mandate</div>
      <h3 className="font-serif-heading text-2xl font-bold text-[#182129] mt-2">
        What Should CityAuction Watch For?
      </h3>
      <p className="text-xs text-[#6f777d] mt-1">Keep the alert broad or make it very specific.</p>

      <div className="contact-inputs-grid">
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

      <button
        className="btn-pill btn-dark w-full mt-6 flex items-center justify-center gap-2 cursor-pointer"
        type="submit"
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Activating Alert..." : "Create Personalised Alert"}
      </button>

      <div className="micro text-[11px] text-[#8a9195] mt-2.5">
        Personalised alerts are delivered over WhatsApp and email when matched inventory is discovered.
      </div>
    </form>
  );
}
