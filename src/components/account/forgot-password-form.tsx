"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { authLinkClass } from "./styles";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const { ok, data } = await postJson("/api/auth/forgot-password", { email });
    setLoading(false);
    if (ok) setDone(data.message || "Request received.");
    else setError(data.error || "Couldn't send your request. Please try again.");
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#f5edd3] text-[#84663c] flex items-center justify-center mx-auto">
          <MailCheck className="h-6 w-6" />
        </div>
        <h2 className="font-serif-heading text-2xl font-semibold text-[#091118]">Request received</h2>
        <p className="text-sm text-[#59636a] leading-relaxed">{done}</p>
        <p className="text-xs text-[#7e868b]">
          Need it sooner? Call <a href="tel:+919825669668" className={authLinkClass}>+91 98256 69668</a> or email{" "}
          <a href="mailto:info@estabizz.com" className={authLinkClass}>info@estabizz.com</a>.
        </p>
        <Link href="/login" className={`inline-flex items-center gap-1.5 text-sm ${authLinkClass}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="The email you signed up with"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <SubmitButton loading={loading} loadingText="Sending…">
        <KeyRound className="h-4 w-4" />
        <span>Request a reset link</span>
      </SubmitButton>
    </form>
  );
}
