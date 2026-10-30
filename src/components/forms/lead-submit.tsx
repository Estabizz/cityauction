"use client";

import { AlertCircle } from "lucide-react";

export const HONEYPOT_NAME = "alt_contact";

export const FALLBACK_ERROR =
  "We couldn't send your details just now. Please try again in a few minutes, or reach us directly on WhatsApp or email.";

export type EnquirySource =
  | "contact"
  | "homepage"
  | "auction-alerts"
  | "career"
  | "investor-desk"
  | "liquidate-asset"
  | "institutional-mandate"
  | "next-chapter";

export type SubmitResult = { ok: true; message: string } | { ok: false; error: string };

type EnquiryPayload = {
  source: EnquirySource;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  auctionId?: string;
  message?: string;
  fields?: Record<string, string>;
};

/** Reads the honeypot from the submitted form. Real visitors never see or fill it. */
export function readHoneypot(form: HTMLFormElement): string {
  const value = new FormData(form).get(HONEYPOT_NAME);
  return typeof value === "string" ? value : "";
}

/** POSTs JSON to a lead endpoint and turns any failure into a message the form can show. */
export async function postLead(url: string, body: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, pagePath: window.location.pathname }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      return { ok: true, message: data.message ?? "" };
    }
    return { ok: false, error: data?.error || FALLBACK_ERROR };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}

export function submitEnquiry(form: HTMLFormElement, payload: EnquiryPayload) {
  return postLead("/api/enquiries", { ...payload, hp: readHoneypot(form) });
}

/** Off-screen field that only bots fill in. */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

// inline!/m-0!: the footer styles every <a> as a spaced block link.
const fallbackLink = "inline! m-0! text-inherit! underline underline-offset-2";

/** Error box with the direct WhatsApp / email fallback, so a lead is never silently lost. */
export function SubmitErrorNotice({ message, tone = "light" }: { message: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      role="alert"
      className={`mt-3 p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 text-left border ${
        dark ? "bg-[#2a1416] border-[#6b2b2f]! text-[#f3d2d2]" : "bg-red-50 border-red-200! text-red-800"
      }`}
    >
      <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${dark ? "text-[#f09a9a]" : "text-red-600"}`} />
      <div className="space-y-1.5">
        <p>{message}</p>
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-semibold">
          <a
            href="https://wa.me/919825669668"
            target="_blank"
            rel="noopener noreferrer"
            className={fallbackLink}
          >
            WhatsApp +91 98256 69668
          </a>
          <a href="mailto:info@estabizz.com" className={fallbackLink}>
            info@estabizz.com
          </a>
        </p>
      </div>
    </div>
  );
}
