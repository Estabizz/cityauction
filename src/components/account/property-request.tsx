"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { inputClass, textareaClass } from "@/components/ui/styles";
import { PROPERTY_ACTIONS, propertyRequestMessage, propertySignInHref, type PropertyRequestKind } from "@/lib/property-actions";

export function PropertyRequest({ auctionId, auctionNumber, kind, submissionDeadline }: { auctionId: string; auctionNumber: string; kind: PropertyRequestKind; submissionDeadline?: string }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [done, setDone] = useState<{ reference: string; message: string } | null>(null);
  const [today, setToday] = useState("");
  const active = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const inspection = kind === "inspection";
  const label = PROPERTY_ACTIONS[kind];
  const deadline = submissionDeadline ? new Date(submissionDeadline).getTime() : NaN;
  const latestDate = Number.isFinite(deadline) ? new Date(deadline + 19_800_000).toISOString().slice(0, 10) : undefined;

  async function start() {
    if (active.current) return;
    active.current = true; setChecking(true); setError(null); setNeedsSignIn(false);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store", signal: AbortSignal.timeout(10_000) });
      if (response.status === 401) {
        window.location.assign(propertySignInHref(auctionId, kind));
        return;
      }
      if (!response.ok) throw new Error("Couldn't check your account. Please try again.");
      setToday(new Date(Date.now() + 19_800_000).toISOString().slice(0, 10));
      setOpen(true);
    } catch { setError("Couldn't check your account. Please try again."); }
    finally { active.current = false; setChecking(false); }
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("action") !== kind) return;
    const controller = new AbortController();
    // Returning from sign-in opens the intended form, without sending a request.
    async function resume() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", signal: controller.signal });
        if (!controller.signal.aborted && response.ok) {
          setToday(new Date(Date.now() + 19_800_000).toISOString().slice(0, 10));
          setOpen(true);
        }
      } catch { /* The action button remains available to retry. */ }
    }
    void resume();
    return () => controller.abort();
  }, [kind, auctionId]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (active.current) return;
    if (!inspection && message.trim().length < 5) { setError("Please enter a message with at least 5 characters."); inputRef.current?.focus(); return; }
    if (inspection && preferredDate && ((today && preferredDate < today) || (latestDate && preferredDate > latestDate))) {
      setError("Please choose a date between today and the submission deadline."); return;
    }
    active.current = true; setLoading(true); setError(null); setNeedsSignIn(false);
    try {
      const response = await fetch("/api/user/requests", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ type: inspection ? "inspection" : "support", auctionId, preferredDate: inspection ? preferredDate || undefined : undefined, message: message.trim() || `Inspection request for auction ${auctionNumber}.` }),
      });
      if (response.status === 401) { setError("Your session has expired. Sign in again to send this request."); setNeedsSignIn(true); return; }
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success !== true || !data.reference) { setError(data?.error || "Couldn't send your request. Please try again."); return; }
      setDone({ reference: data.reference, message: propertyRequestMessage(kind) });
    } catch { setError("Couldn't reach the server. Your request has not been confirmed. Please try again."); }
    finally { active.current = false; setLoading(false); }
  }

  if (done) return <div role="status" className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 shrink-0" />{inspection ? "Inspection request sent" : "Message sent"}</p><p>{done.message}</p><p>Reference: <strong>{done.reference}</strong></p><Link href="/dashboard/requests" className="inline-block font-semibold underline underline-offset-2">Track in My enquiries</Link></div>;

  return <div className="space-y-2">
    {!open ? <button type="button" disabled={checking} onClick={() => void start()} className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84663c] ${inspection ? "border-[#e4e8ec] bg-white text-[#182129] hover:bg-[#f4f6f8]" : "border-[#132330] bg-[#132330] text-white hover:bg-[#253b4b]"}`}>
      {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : inspection ? <CalendarCheck className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}{label}
    </button> : <form onSubmit={submit} className="space-y-3 rounded-xl border border-[#e4e8ec] bg-[#f8fafb] p-4">
      <h3 className="text-sm font-semibold text-[#182129]">{label}</h3>
      {inspection && <label className="block text-xs font-medium text-[#687480]" htmlFor={`${id}-date`}>Preferred date (optional)<input id={`${id}-date`} type="date" min={today} max={latestDate} value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} disabled={loading} className={`mt-1.5 ${inputClass}`} /></label>}
      <label htmlFor={`${id}-message`} className="block text-xs font-medium text-[#687480]">{inspection ? "Anything we should know? (optional)" : "How can we help with this property?"}</label>
      <textarea ref={inputRef} id={`${id}-message`} value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={3} required={!inspection} disabled={loading} className={textareaClass} />
      {inspection && <p className="text-[11px] leading-relaxed text-[#687480]">An inspection request does not confirm a booking. Availability and dates require the selling institution’s approval.</p>}
      <div className="flex gap-2"><button type="button" disabled={loading} onClick={() => { setOpen(false); setError(null); }} className="min-h-11 flex-1 rounded-lg border border-[#dce1e6] bg-white px-3 text-xs font-semibold disabled:opacity-60">Cancel</button><button type="submit" disabled={loading} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#132330] px-3 text-xs font-semibold text-white disabled:opacity-60">{loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{loading ? "Sending…" : inspection ? "Send request" : "Send message"}</button></div>
    </form>}
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error} {needsSignIn && <Link href={propertySignInHref(auctionId, kind)} className="font-semibold underline">Sign in again</Link>}</p>}
  </div>;
}
