"use client";

import { useState } from "react";
import Link from "next/link";
import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { PhoneEmailButton } from "./phone-email-button";
import { CodeStep, useOtpSender } from "./otp-ui";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { authLinkClass } from "./styles";

type EmailProof = { phoneEmailToken?: string; challengeId?: string; otp?: string };

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"email" | "verify" | "password" | "done">("email");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sender = useOtpSender("reset-password");

  async function start(e: React.FormEvent) {
    e.preventDefault();
    if (sender.sending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 191) { setError("Please enter a valid email address."); return; }
    setError(null);
    if (!PHONE_EMAIL_ENABLED) {
      const failure = await sender.send(email);
      if (failure) { setError(failure); return; }
    }
    setStage("verify");
  }

  async function verify(proof: EmailProof) {
    const { ok, data } = await postJson<{ resetToken?: string }>("/api/auth/reset-password/verify", { email: email.trim().toLowerCase(), ...proof });
    if (!ok || !data.resetToken) return data.error || "Couldn't verify your email. Please try again.";
    setResetToken(data.resetToken);
    setError(null);
    setStage("password");
    return null;
  }

  function restart() {
    setResetToken(""); setPassword(""); setConfirmPassword(""); setError(null); sender.reset(); setStage("email");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (password.length < 8 || password.length > 128) { setError("Choose a password between 8 and 128 characters."); return; }
    if (password !== confirmPassword) { setError("The two passwords don't match."); return; }
    setLoading(true); setError(null);
    const { ok, data } = await postJson("/api/auth/reset-password", { email: email.trim().toLowerCase(), password, confirmPassword, resetToken });
    setLoading(false);
    if (!ok) { setError(data.error || "Couldn't reset your password. Please try again."); return; }
    setPassword(""); setConfirmPassword(""); setResetToken(""); setStage("done");
  }

  if (stage === "done") return <div className="space-y-4 text-center" role="status">
    <h2 className="text-xl font-semibold">Password reset</h2>
    <p className="text-sm text-[#59636a]">Your password has been changed and previous sessions have been signed out.</p>
    <Link href="/login" className={authLinkClass}>Sign in with your email and password</Link>
  </div>;

  if (stage === "password") return <form onSubmit={save} className="space-y-4" noValidate>
    <p className="break-all text-sm text-[#59636a]">Email verified: {email.trim().toLowerCase()}. Choose your new password within five minutes.</p>
    {error && <FormAlert>{error}</FormAlert>}
    <Field id="new-password" label="New password" type="password" autoComplete="new-password" minLength={8} maxLength={128} hint="Use 8–128 characters." value={password} onChange={(e) => setPassword(e.target.value)} required />
    <Field id="confirm-password" label="Confirm new password" type="password" allowReveal={false} autoComplete="new-password" maxLength={128} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
    <SubmitButton loading={loading} loadingText="Saving password…">Reset password</SubmitButton>
    <button type="button" disabled={loading} onClick={restart} className={authLinkClass}>Restart email verification</button>
  </form>;

  if (stage === "verify") return <div className="space-y-4">
    <p className="break-all text-sm text-[#59636a]">Verify {email.trim().toLowerCase()} before setting a new password.</p>
    {PHONE_EMAIL_ENABLED
      ? <PhoneEmailButton email={email.trim().toLowerCase()} purpose="reset-password" onVerified={(token) => verify({ phoneEmailToken: token })} />
      : <CodeStep sender={sender} onResend={() => sender.send(email)} onVerify={(otp) => verify({ challengeId: sender.sent?.challengeId, otp })} onBack={restart} submitLabel="Verify email" loadingText="Verifying…" />}
    {PHONE_EMAIL_ENABLED && <button type="button" onClick={restart} className={authLinkClass}>Change email</button>}
  </div>;

  return <form onSubmit={start} className="space-y-4" noValidate>
    {error && <FormAlert>{error}</FormAlert>}
    <Field id="email" label="Registered email address" type="email" autoComplete="email" maxLength={191} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <SubmitButton loading={sender.sending} loadingText="Sending code…">Verify email to continue</SubmitButton>
  </form>;
}
