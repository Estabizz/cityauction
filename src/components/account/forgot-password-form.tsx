"use client";

import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { PhoneEmailRecovery } from "./phone-email-forms";
import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { maskEmail } from "@/lib/email-address";
import { CodeStep, useOtpSender } from "./otp-ui";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { authLinkClass } from "./styles";

export function ForgotPasswordForm() {
  return PHONE_EMAIL_ENABLED ? <PhoneEmailRecovery /> : <SmtpForgotPasswordForm />;
}

function SmtpForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const sender = useOtpSender("reset-password");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(await sender.send(email));
  }

  async function reset(code: string) {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "The two passwords don't match.";
    const { ok, data } = await postJson("/api/auth/reset-password", {
      email, challengeId: sender.sent?.challengeId, otp: code, password, confirmPassword,
    });
    if (!ok) return data.error || "Couldn't reset your password. Please try again.";
    setPassword("");
    setConfirmPassword("");
    setDone(true);
    return null;
  }

  if (done) return (
    <div className="space-y-4 text-center" role="status">
      <h2 className="font-serif-heading text-2xl font-semibold text-[#091118]">Password reset</h2>
      <p className="text-sm text-[#59636a]">Your password has been changed and previous sessions have been signed out.</p>
      <Link href="/login" className={authLinkClass}>Sign in to your account</Link>
    </div>
  );

  if (sender.sent) return (
    <CodeStep sender={sender} onResend={() => sender.send(email)} onVerify={reset}
      onBack={() => { sender.reset(); setPassword(""); setConfirmPassword(""); }}
      submitLabel="Verify & reset password" loadingText="Resetting password…"
      deliveryNotice={<>If <strong>{maskEmail(sender.sent.email)}</strong> has an eligible account, a code has been sent. It is valid for 10 minutes.</>}>
      <Field id="new-password" label="New password" type="password" autoComplete="new-password" minLength={8} maxLength={128}
        value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Field id="confirm-password" label="Confirm new password" type="password" autoComplete="new-password" maxLength={128}
        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
    </CodeStep>
  );

  return (
    <form onSubmit={sendCode} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field id="email" label="Registered email address" type="email" autoComplete="email" placeholder="you@company.com"
        value={email} onChange={(e) => setEmail(e.target.value)} required />
      <SubmitButton loading={sender.sending} loadingText="Sending code…"><KeyRound className="h-4 w-4" /><span>Send reset code</span></SubmitButton>
    </form>
  );
}
