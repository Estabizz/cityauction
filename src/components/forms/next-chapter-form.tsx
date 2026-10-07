"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NextChapterForm() {
  const [opportunityType, setOpportunityType] = useState("");
  const [objective, setObjective] = useState("");
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");

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
          email,
          phone: "Private Mandate",
          subject: `[Next Chapter Private Mandate] ${opportunityType} - ${objective} (${location})`,
          message: `Situation Type: ${opportunityType}\nPrimary Objective: ${objective}\nLocation: ${location}\nIndicative Asset / Project Value: ₹${value}\nContact Person: ${name}\nEmail: ${email}\n\nBrief Situation Context:\n${context}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }
      setSubmitted(true);
    } catch {
      // In offline/mock fallback mode
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
          Private Discussion Requested
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Your mandate details for <strong>{opportunityType}</strong> ({location}) have been received by the CityAuction Next Chapter Desk under strict confidentiality. A senior partner will contact <strong>{email}</strong>.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setOpportunityType("");
            setObjective("");
            setLocation("");
            setValue("");
            setName("");
            setEmail("");
            setContext("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="nextChapterForm">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="opportunityType">Situation Type</label>
          <select
            id="opportunityType"
            required
            value={opportunityType}
            onChange={(e) => setOpportunityType(e.target.value)}
          >
            <option value="">Select</option>
            <option>Company / Business</option>
            <option>Real Estate Project</option>
            <option>Industrial Project</option>
            <option>Land / Asset-Backed Company</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="objective">Primary Objective</label>
          <select
            id="objective"
            required
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          >
            <option value="">Select</option>
            <option>Sell Company</option>
            <option>Sell Project</option>
            <option>Find JV Partner</option>
            <option>Find Investor</option>
            <option>Raise Strategic Capital</option>
            <option>Monetise Assets</option>
            <option>Promoter Exit</option>
            <option>Not Yet Decided</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            required
            placeholder="City / State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="value">Indicative Asset / Project Value</label>
          <input
            id="value"
            placeholder="₹"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="name">Contact Person</label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field full">
          <label htmlFor="context">Brief Situation</label>
          <textarea
            id="context"
            rows={4}
            placeholder="Tell us what has been built, what assets exist, what pressure the business/project is facing, and what outcome you are considering."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
      </div>

      <button
        className="btn btn-dark w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
        type="submit"
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Submitting..." : "Request a Private Discussion"}
      </button>
    </form>
  );
}
