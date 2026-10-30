"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Honeypot, SubmitErrorNotice, postLead, readHoneypot } from "@/components/forms/lead-submit";

type SubscribeBoxProps = {
  /** "footer": compact strip in the site footer. "section": homepage band (inside a dark-bg section). */
  variant: "footer" | "section";
  /** Stored on the subscriber so the admin panel can tell where people signed up. */
  source: "footer" | "homepage";
};

const HEADING = "Stay informed with CityAuction";
const BLURB =
  "Sign up for occasional news and auction updates.";

// Both variants sit on a dark ground, so the inputs share one dark style.
// Border colours need "!": globals.css sets border-color on * outside Tailwind's layers.
const inputClass =
  "w-full h-[52px] rounded-[11px] border border-white/15! bg-white/[0.04] px-4 text-sm text-white placeholder:text-[#7d8a93] outline-none transition-colors focus:border-[#b49361]! focus:bg-white/[0.07]";

// The footer styles every <a> as a block link; keep these inline.
const inlineLink = "inline! m-0! text-[11px]! text-[#d6bf95]! hover:text-white! underline underline-offset-2";

export function SubscribeBox({ variant, source }: SubscribeBoxProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(null);

    const result = await postLead("/api/subscribe", {
      email,
      name,
      source,
      hp: readHoneypot(e.currentTarget),
    });

    setLoading(false);
    pending.current = false;
    if (result.ok) {
      setDone(result.message || "You're subscribed.");
      setEmail("");
      setName("");
    } else {
      setError(result.error);
    }
  };

  const isFooter = variant === "footer";
  const idPrefix = `subscribe-${variant}`;

  const form = done ? (
    <div role="status" className="flex items-start gap-3 rounded-[14px] border border-[#b49361]/40! bg-[#b49361]/10 p-4 text-sm text-[#e7d7bd]">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d6bf95] mt-0.5" />
      <div className="space-y-1">
        <p>{done}</p>
        <button
          type="button"
          onClick={() => setDone(null)}
          className="text-xs font-semibold text-[#d6bf95] underline underline-offset-2 hover:text-white cursor-pointer"
        >
          Subscribe another email
        </button>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className={`grid grid-cols-1 gap-2.5 ${isFooter ? "sm:grid-cols-[1fr_1.25fr_auto]" : "md:grid-cols-[1fr_1.3fr_auto] gap-3"}`}>
        <div>
          <label htmlFor={`${idPrefix}-name`} className="sr-only">
            Name (optional)
          </label>
          <input
            id={`${idPrefix}-name`}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            maxLength={150}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            maxLength={190}
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-pill btn-gold w-full sm:w-auto whitespace-nowrap">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      <Honeypot />
      {error && <SubmitErrorNotice message={error} tone="dark" />}

      <p className="text-[11px] text-[#7d8a93] mt-2.5 leading-relaxed">
        No spam. Unsubscribe anytime{" "}
        <Link href="/unsubscribe" className={inlineLink}>
          here
        </Link>
        .
      </p>
    </form>
  );

  if (isFooter) {
    return (
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-5 lg:gap-10 items-center rounded-[14px] border border-[#1a242b]! bg-[#0a1116] p-5 sm:p-7">
        <div>
          <div className="eyebrow-text">Stay updated</div>
          <p className="font-serif-heading text-2xl sm:text-[1.7rem] leading-tight font-semibold text-white mt-2">
            {HEADING}
          </p>
          <p className="text-xs text-[#aab3ba] leading-relaxed mt-2 max-w-md">{BLURB}</p>
        </div>
        {form}
      </div>
    );
  }

  return (
    <div className="section-head-grid mb-0!">
      <div>
        <div className="eyebrow-text">Stay updated</div>
      </div>
      <div>
        <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight">
          Get New Auction Opportunities and City Updates
        </h2>
        <p className="lead-text text-[#b7c1c8]! mt-3 mb-7">{BLURB}</p>
        {form}
      </div>
    </div>
  );
}
