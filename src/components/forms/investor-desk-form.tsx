"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function InvestorDeskForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [assetType, setAssetType] = useState("Residential Property");
  const [location, setLocation] = useState("");
  const [auctionDate, setAuctionDate] = useState("");
  const [auctionLink, setAuctionLink] = useState("");
  const [concern, setConcern] = useState("");

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
          name,
          email: email || "info@estabizz.com",
          phone: mobile,
          subject: `[Investor Desk Review] ${assetType} (${location || "N/A"}) - ${name}`,
          message: `Asset Type: ${assetType}\nLocation: ${location}\nAuction Date: ${auctionDate}\nAuction Link / Notice: ${auctionLink}\n\nKey Concerns / Due Diligence Requirements:\n${concern}`,
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
          Diligence Request Logged
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Your asset evaluation request for <strong>{assetType}</strong> has been assigned to the CityAuction Investor Desk. A diligence coordinator will review the notice and connect with you at <strong>{mobile}</strong>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setMobile("");
            setEmail("");
            setLocation("");
            setAuctionDate("");
            setAuctionLink("");
            setConcern("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" id="investorDeskForm" onSubmit={handleSubmit}>
      <div className="eyebrow-text">Request review</div>
      <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
        Tell Us About the Opportunity.
      </h3>

      <div className="search-form-grid mt-4">
        <div className="field-custom">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="mobile">Mobile</label>
          <input
            id="mobile"
            type="tel"
            inputMode="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            placeholder="+91 Mobile number"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="assetType">Asset Type</label>
          <select
            id="assetType"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            required
          >
            <option>Residential Property</option>
            <option>Commercial Property</option>
            <option>Industrial Property</option>
            <option>Land / Plot</option>
            <option>Plant & Machinery</option>
            <option>Business / Going Concern</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field-custom">
          <label htmlFor="location">Asset Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
          />
        </div>

        <div className="field-custom">
          <label htmlFor="auctionDate">Auction Date</label>
          <input
            id="auctionDate"
            type="date"
            value={auctionDate}
            onChange={(e) => setAuctionDate(e.target.value)}
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="auctionLink">Auction Link / Notice Reference</label>
          <input
            id="auctionLink"
            value={auctionLink}
            onChange={(e) => setAuctionLink(e.target.value)}
            placeholder="Paste auction URL or notice reference"
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="concern">What Do You Need Help With?</label>
          <textarea
            id="concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="Title, possession, dues, litigation, valuation, inspection, bidder registration, funding, post-auction support, etc."
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
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
          </>
        ) : (
          "Request Investor Desk Review"
        )}
      </button>

      <div className="text-[11px] text-[#8a9195] mt-2.5 text-center">
        Diligence requests are confidential and managed under Estabizz professional protocols.
      </div>
    </form>
  );
}
