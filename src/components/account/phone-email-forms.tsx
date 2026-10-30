"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormAlert, postJson, SubmitButton } from "./auth-ui";
import { PhoneEmailButton } from "./phone-email-button";

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function PhoneEmailLogin({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function finish(phoneEmailToken: string) {
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login-otp", { email, phoneEmailToken, next });
    if (!ok) return data.error || "Couldn't sign in. Please try again.";
    window.location.assign(data.redirectTo || "/dashboard");
    return null;
  }
  return <div className="space-y-4">
    {ready ? <><PhoneEmailButton email={email.trim().toLowerCase()} purpose="login" onVerified={finish} /><button type="button" onClick={() => setReady(false)} className="text-xs text-[#84663c] underline">Change email</button></> :
      <form onSubmit={(e) => { e.preventDefault(); if (!validEmail(email)) setError("Please enter a valid email address."); else { setError(null); setReady(true); } }} className="space-y-4" noValidate>
        {error && <FormAlert>{error}</FormAlert>}
        <Field id="email" label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <SubmitButton loading={false} loadingText="Continuing…"><span>Continue to email verification</span></SubmitButton>
      </form>}
    <p className="text-xs text-[#59636a]">Need a new password? <Link href="/forgot-password" className="font-semibold text-[#84663c] underline">Reset password</Link></p>
  </div>;
}

export function PhoneEmailRecovery() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function finish(phoneEmailToken: string) {
    const { ok, data } = await postJson("/api/auth/reset-password", { email, password, confirmPassword: confirm, phoneEmailToken });
    if (!ok) return data.error || "Couldn't reset your password.";
    setPassword(""); setConfirm(""); setDone(true);
    return null;
  }
  if (done) return <div className="space-y-4" role="status"><p className="text-sm">Your password has been reset and older sessions have been signed out.</p><Link href="/login" className="font-semibold text-[#84663c] underline">Sign in</Link></div>;
  if (ready) return <div className="space-y-4"><PhoneEmailButton email={email.trim().toLowerCase()} purpose="reset-password" onVerified={finish} /><button type="button" onClick={() => setReady(false)} className="text-xs text-[#84663c] underline">Change details</button></div>;
  return <form onSubmit={(e) => {
    e.preventDefault();
    if (!validEmail(email)) setError("Please enter a valid email address.");
    else if (password.length < 8 || password.length > 128) setError("Choose a password between 8 and 128 characters.");
    else if (password !== confirm) setError("The two passwords don't match.");
    else { setError(null); setReady(true); }
  }} className="space-y-4" noValidate>
    {error && <FormAlert>{error}</FormAlert>}
    <Field id="email" label="Registered email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <Field id="password" label="New password" type="password" autoComplete="new-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} required />
    <Field id="confirm-password" label="Confirm password" type="password" autoComplete="new-password" maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
    <SubmitButton loading={false} loadingText="Continuing…"><span>Verify email & reset password</span></SubmitButton>
  </form>;
}

export function PhoneEmailLink({ email: currentEmail }: { email: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function finish(phoneEmailToken: string) {
    const { ok, data } = await postJson("/api/user/email", { email, phoneEmailToken });
    if (!ok) return data.error || "Couldn't update your email.";
    setReady(false); setEmail(""); setDone(true); router.refresh();
    return null;
  }
  if (ready) return <PhoneEmailButton email={email.trim().toLowerCase()} purpose="link" onVerified={finish} />;
  return <form onSubmit={(e) => { e.preventDefault(); if (!validEmail(email)) setError("Please enter a valid email address."); else { setError(null); setReady(true); } }} className="space-y-4" noValidate>
    {done && <FormAlert kind="success">Email verified. Other devices have been signed out.</FormAlert>}
    {error && <FormAlert>{error}</FormAlert>}
    <p className="text-sm text-[#59636a]">Current sign-in email: {currentEmail || "Not set"}</p>
    <Field id="new-email" label="Email to verify" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <SubmitButton loading={false} loadingText="Continuing…"><span>Verify email</span></SubmitButton>
  </form>;
}
