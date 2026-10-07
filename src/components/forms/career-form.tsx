"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function CareerForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [profile, setProfile] = useState("");
  const [message, setMessage] = useState("");

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
          email,
          phone: mobile,
          subject: `[Career Application] ${name} - ${track}`,
          message: `Career Track: ${track}\nExperience: ${experience}\nLocation: ${location}\nProfile/LinkedIn: ${profile}\n\nWhy CityAuction:\n${message}`,
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
          Application Received
        </h4>
        <p className="text-sm text-[#6f777d] max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. Your profile for <strong>{track}</strong> has been submitted to the CityAuction Talent Desk at Estabizz Fintech. We will contact you at <strong>{email}</strong> if your background aligns with active or upcoming requirements.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setMobile("");
            setEmail("");
            setTrack("");
            setExperience("");
            setLocation("");
            setProfile("");
            setMessage("");
          }}
          className="btn-pill btn-dark text-xs py-2 px-5 mt-2"
        >
          Submit Another Profile
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" id="careerForm" onSubmit={handleSubmit}>
      <div className="eyebrow-text">Career application</div>
      <h3 className="text-2xl font-serif-heading font-semibold text-[#182129] mt-2">
        Share Your Profile.
      </h3>

      <div className="search-form-grid mt-4">
        <div className="field-custom">
          <label htmlFor="name">Full Name</label>
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
            required
            placeholder="you@domain.com"
          />
        </div>
        <div className="field-custom">
          <label htmlFor="track">Career Track</label>
          <select
            id="track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Institutional Relationships">Institutional Relationships</option>
            <option value="Buyer & Investor Desk">Buyer &amp; Investor Desk</option>
            <option value="Auction Operations">Auction Operations</option>
            <option value="Asset & Auction Intelligence">Asset &amp; Auction Intelligence</option>
            <option value="Product & Engineering">Product &amp; Engineering</option>
            <option value="Content & Market Development">Content &amp; Market Development</option>
            <option value="Other / General Application">Other / General Application</option>
          </select>
        </div>
        <div className="field-custom">
          <label htmlFor="experience">Experience</label>
          <input
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 5 years"
          />
        </div>
        <div className="field-custom">
          <label htmlFor="location">Current Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
          />
        </div>
        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="profile">LinkedIn / Portfolio / Resume Link</label>
          <input
            id="profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="Paste URL"
          />
        </div>
        <div className="field-custom col-span-1 sm:col-span-2">
          <label htmlFor="message">Why CityAuction?</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us briefly what you can contribute."
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
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Profile...
          </>
        ) : (
          "Submit Career Interest"
        )}
      </button>
      <div className="text-[11px] text-[#8a9195] mt-2.5 text-center">
        Connects your application to CityAuction Talent &amp; HR desk at Estabizz Fintech.
      </div>
    </form>
  );
}
