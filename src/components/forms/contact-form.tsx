"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Honeypot, SubmitErrorNotice, submitEnquiry } from "./lead-submit";

export function ContactForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitEnquiry(e.currentTarget, {
      source: "contact",
      name,
      email,
      phone: mobile,
      subject: subject || `${enquiry} - ${name}`,
      message,
      fields: { "Help with": enquiry },
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
          Enquiry Received
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Your enquiry regarding <strong>{enquiry}</strong> has been logged. The relevant CityAuction desk at Estabizz Fintech will respond shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setMobile("");
            setEmail("");
            setEnquiry("");
            setSubject("");
            setMessage("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
      <div className="eyebrow-text">Send an enquiry</div>
      <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
        How Can CityAuction Help?
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
          <label htmlFor="enquiry">I Need Help With</label>
          <select
            id="enquiry"
            value={enquiry}
            onChange={(e) => setEnquiry(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Buying / Investing in Auction Asset</option>
            <option>Investor Desk / Due Diligence</option>
            <option>Personalised Auction Alerts</option>
            <option>Institutional Services</option>
            <option>Liquidating an Asset</option>
            <option>Customs Auction</option>
            <option>Company Sale / Investor / Promoter Exit</option>
            <option>Developer Project / JV / Investor</option>
            <option>Careers</option>
            <option>Login / Account Support</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short subject"
          />
        </div>

        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="message">Tell Us the Situation</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share the asset, opportunity, mandate or support issue in brief."
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
            Sending Enquiry...
          </>
        ) : (
          "Send Enquiry"
        )}
      </button>

      <div className="text-[11px] text-[#8a9195] mt-2.5 text-center">
        Enquiries are routed directly to the specialized CityAuction desk at Estabizz Fintech.
      </div>
    </form>
  );
}
