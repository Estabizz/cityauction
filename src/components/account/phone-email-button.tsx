"use client";

import { useEffect, useRef, useState } from "react";
import { PHONE_EMAIL_CLIENT_ID } from "@/lib/phone-email-config";
import { FormAlert, postJson } from "./auth-ui";

interface ProviderResult { user_json_url?: unknown }
declare global { interface Window { phoneEmailReceiver?: (result: ProviderResult) => void } }

export function PhoneEmailButton({ email, purpose, onVerified, compact = false }: {
  email: string;
  compact?: boolean;
  purpose: "register" | "login" | "reset-password" | "link";
  onVerified: (token: string) => Promise<string | null>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const onVerifiedRef = useRef(onVerified);
  const retryRef = useRef<(() => void) | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [preparing, setPreparing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => { onVerifiedRef.current = onVerified; }, [onVerified]);
  useEffect(() => {
    let active = true;
    let pending = false;
    let verificationToken: string | undefined;
    let verifiedUrl: string | undefined;
    let script: HTMLScriptElement | null = null;
    const controller = new AbortController();
    let receiver: ((result: ProviderResult) => void) | undefined;
    const element = container.current;
    async function initialize() {
      setPreparing(true); setError(null); setCanRetry(false); retryRef.current = null;
      let data: { intentId?: string; error?: string };
      let ok = false;
      try {
        const response = await fetch("/api/auth/phone-email/start", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, purpose }), signal: controller.signal,
        });
        ok = response.ok;
        data = await response.json();
      } catch {
        if (active) { setPreparing(false); setError("Email verification could not start. Please try again."); }
        return;
      }
      if (!active) return;
      if (!ok || !data.intentId) { setError(data.error || "Verification could not start."); setPreparing(false); return; }
      const intentId = data.intentId;
      receiver = async (result) => {
        if (!active || pending) return;
        if (typeof result?.user_json_url !== "string") { setError("The provider returned an invalid verification result."); return; }
        pending = true; setBusy(true); setError(null); setCanRetry(false);
        retryRef.current = () => { void receiver?.(result); };
        try {
          if (!verificationToken || verifiedUrl !== result.user_json_url) {
            const verified = await postJson<{ verificationToken?: string }>("/api/auth/phone-email/verify", { user_json_url: result.user_json_url, intentId });
            if (!active) return;
            if (!verified.ok || !verified.data.verificationToken) { setError(verified.data.error || "Email verification failed."); return; }
            verificationToken = verified.data.verificationToken;
            verifiedUrl = result.user_json_url;
          }
          const failure = await onVerifiedRef.current(verificationToken);
          if (active && failure) { setError(failure); setCanRetry(true); }
        } catch {
          if (active) { setError("Verification could not finish. Please try again."); setCanRetry(!!verificationToken); }
        } finally {
          pending = false;
          if (active) setBusy(false);
        }
      };
      window.phoneEmailReceiver = receiver;
      // Preserve the provider's documented script-inside-container placement.
      // Loading happens only while a verification form is mounted.
      script = document.createElement("script");
      script.src = "https://www.phone.email/verify_email_v1.js";
      script.async = true;
      script.onload = () => { if (active) setPreparing(false); };
      script.onerror = () => { if (active) { setPreparing(false); setError("The email verification button could not load. Please check your connection and try again."); } };
      element?.appendChild(script);
    }
    void initialize();
    return () => {
      active = false;
      retryRef.current = null;
      controller.abort();
      if (receiver && window.phoneEmailReceiver === receiver) delete window.phoneEmailReceiver;
      script?.remove();
      element?.replaceChildren();
    };
  }, [email, purpose, attempt]);

  return (
    <div className="space-y-4" aria-busy={preparing || busy}>
      {!compact && <p className="text-sm text-[#59636a]">Verify <strong>{email}</strong> using the email verification button. Use this same email in the popup.</p>}
      {preparing && <p role="status" className="text-xs text-[#59636a]">Preparing email verification…</p>}
      <div ref={container} className={`pe_verify_email ${busy ? "pointer-events-none opacity-50" : ""}`} data-client-id={PHONE_EMAIL_CLIENT_ID} />
      {busy && <p role="status" className="text-sm text-[#59636a]">Confirming your email…</p>}
      {error && <FormAlert>{error}</FormAlert>}
      {error && canRetry && <button type="button" onClick={() => retryRef.current?.()} disabled={busy} className="mr-4 text-sm font-semibold text-[#84663c] underline">Try again</button>}
      {error && <button type="button" onClick={() => setAttempt((n) => n + 1)} disabled={busy} className="text-sm font-semibold text-[#84663c] underline">Restart verification</button>}
    </div>
  );
}
