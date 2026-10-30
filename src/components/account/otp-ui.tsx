"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { maskEmail } from "@/lib/email-address";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";

type Purpose = "register" | "login" | "link" | "reset-password";

export type SentOtp = { challengeId: string; email: string; devCode?: string };

// Sends (and re-sends) a code for one email address and tracks the resend timer.
export function useOtpSender(purpose: Purpose) {
  const [sent, setSent] = useState<SentOtp | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function acceptSent(data: SentOtp & { resendIn?: number }) {
    setSent({ challengeId: data.challengeId, email: data.email, devCode: data.devCode });
    setCooldown(data.resendIn ?? 30);
  }

  async function send(email: string): Promise<string | null> {
    setSending(true);
    const { ok, data } = await postJson<{ challengeId?: string; email?: string; resendIn?: number; devCode?: string }>(
      "/api/auth/otp/send",
      { email, purpose }
    );
    setSending(false);
    if (!ok || !data.challengeId || !data.email) return data.error || "Couldn't send the code. Please try again.";
    acceptSent({ challengeId: data.challengeId, email: data.email, devCode: data.devCode, resendIn: data.resendIn });
    return null;
  }

  return { sent, send, acceptSent, sending, cooldown, reset: () => setSent(null) };
}

// Second step of every OTP form: enter the code, resend, or go back.
export function CodeStep({
  sender,
  onResend,
  onVerify,
  onBack,
  submitLabel,
  loadingText,
  children,
  deliveryNotice,
}: {
  sender: ReturnType<typeof useOtpSender>;
  onResend: () => Promise<string | null>;
  onVerify: (code: string) => Promise<string | null>;
  onBack: () => void;
  submitLabel: string;
  loadingText: string;
  children?: React.ReactNode;
  deliveryNotice?: React.ReactNode;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { sent, cooldown, sending } = sender;
  if (!sent) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || resending || sending) return;
    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    const failure = await onVerify(code);
    // On success the page navigates away, so keep the spinner.
    if (failure) {
      setError(failure);
      setLoading(false);
    }
  }

  async function resend() {
    if (cooldown > 0 || sending || loading || resending) return;
    setError(null);
    setNotice(null);
    setResending(true);
    const failure = await onResend();
    setResending(false);
    if (failure) setError(failure);
    else {
      setCode("");
      setNotice("A new code is on its way.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      {notice && <FormAlert kind="success">{notice}</FormAlert>}

      <p className="text-sm text-[#3b464e]">
        {deliveryNotice || <>We sent a 6-digit code to <strong className="whitespace-nowrap">{maskEmail(sent.email)}</strong>. It&apos;s valid for 10 minutes.</>}
      </p>

      {sent.devCode && (
        <p className="text-xs rounded-lg border border-dashed border-amber-300 bg-amber-50 text-amber-900 px-3 py-2">
          Development mode, no email sent. Your code is <strong className="font-mono tracking-widest">{sent.devCode}</strong>
        </p>
      )}

      <Field
        id="otp"
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="••••••"
        className="w-full h-12 px-3.5 rounded-lg border border-[#dcd5ca] bg-[#fdfcfa] text-center text-xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#b49361]/30 focus:border-[#b49361]"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          setError(null);
        }}
        autoFocus
        required
      />

      {children}

      <SubmitButton loading={loading || resending} loadingText={resending ? "Sending code…" : loadingText}>
        <ShieldCheck className="h-4 w-4" />
        <span>{submitLabel}</span>
      </SubmitButton>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} disabled={loading || sending || resending} className="font-semibold text-[#59636a] hover:text-[#182129] cursor-pointer">
          ← Change email
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0 || sending || loading || resending}
          className="font-semibold text-[#84663c] hover:underline disabled:text-[#9aa1a6] disabled:no-underline cursor-pointer disabled:cursor-default"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : sending ? "Sending…" : "Resend code"}
        </button>
      </div>
    </form>
  );
}
