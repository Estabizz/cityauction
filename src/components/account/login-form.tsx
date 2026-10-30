"use client";

import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { PhoneEmailLogin } from "./phone-email-forms";
import { useState } from "react";
import Link from "next/link";
import { LogIn, MessageSquareText } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { CodeStep, useOtpSender } from "./otp-ui";
import { authLinkClass } from "./styles";

// Both sign-in methods require an OTP. Email/password starts a second step
// sent to the account's email address.
export function LoginForm({ next }: { next?: string }) {
  return PHONE_EMAIL_ENABLED ? <PhoneEmailLogin next={next} /> : <SmtpLoginForm next={next} />;
}

function SmtpLoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<"otp" | "password">("otp");

  return (
    <div className="space-y-5">
      {mode === "otp" ? <OtpLogin next={next} /> : <PasswordLogin next={next} />}
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-[#9aa1a6]">
        <span className="h-px flex-1 bg-[#ece6dc]" />
        or
        <span className="h-px flex-1 bg-[#ece6dc]" />
      </div>
      <button
        type="button"
        onClick={() => setMode(mode === "otp" ? "password" : "otp")}
        className="w-full h-10 rounded-full border border-[#dcd5ca] bg-white text-xs font-bold text-[#3b464e] hover:bg-[#f6f2ea] cursor-pointer"
      >
        {mode === "otp" ? "Sign in with email & password" : "Sign in with email OTP"}
      </button>
    </div>
  );
}

function OtpLogin({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<React.ReactNode>(null);
  const sender = useOtpSender("login");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    const failure = await sender.send(email);
    if (failure) {
      setError(
        failure.includes("couldn't find") ? (
          <>
            {failure}{" "}
            <Link href={next ? `/buyer/access?next=${encodeURIComponent(next)}` : "/buyer/access"} className={authLinkClass}>
              Create an account
            </Link>
          </>
        ) : (
          failure
        )
      );
    }
  }

  async function verify(code: string) {
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login-otp", {
      email,
      challengeId: sender.sent?.challengeId,
      otp: code,
      next,
    });
    if (ok) {
      // Full page load so the header and protected pages pick up the new session.
      window.location.assign(data.redirectTo || "/dashboard");
      return null;
    }
    return data.error || "Couldn't sign you in. Please try again.";
  }

  if (sender.sent) {
    return (
      <CodeStep
        sender={sender}
        onResend={() => sender.send(email)}
        onVerify={verify}
        onBack={sender.reset}
        submitLabel="Verify & sign in"
        loadingText="Signing in…"
      />
    );
  }

  return (
    <form onSubmit={sendCode} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="you@company.com"
        value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
      <SubmitButton loading={sender.sending} loadingText="Sending code…">
        <MessageSquareText className="h-4 w-4" />
        <span>Send verification code</span>
      </SubmitButton>
    </form>
  );
}

function PasswordLogin({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sender = useOtpSender("login");

  async function sendCode() {
    if (!email.trim() || !password) return "Please enter your email and password.";
    setLoading(true);
    const { ok, data } = await postJson<{
      requiresOtp?: boolean; challengeId?: string; email?: string; devCode?: string; resendIn?: number;
    }>("/api/auth/login", { email, password });
    setLoading(false);
    if (!ok || !data.requiresOtp || !data.challengeId || !data.email) return data.error || "Couldn't send the code. Please try again.";
    sender.acceptSent({ challengeId: data.challengeId, email: data.email, devCode: data.devCode, resendIn: data.resendIn });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setError(await sendCode());
  }

  async function verify(code: string) {
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login-password-otp", {
      email, challengeId: sender.sent?.challengeId, otp: code, next,
    });
    if (!ok) return data.error || "Couldn't sign you in. Please try again.";
    window.location.assign(data.redirectTo || "/dashboard");
    return null;
  }

  if (sender.sent) return (
    <CodeStep sender={sender} onResend={sendCode} onVerify={verify} onBack={sender.reset}
      submitLabel="Verify & sign in" loadingText="Signing in…" />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="name@example.com"
        value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
      <Field id="password" label="Password" type="password" autoComplete="current-password" placeholder="Your password"
        value={password} onChange={(e) => setPassword(e.target.value)} required
        labelAside={<Link href="/forgot-password" className={`text-xs ${authLinkClass}`}>Forgot password?</Link>} />
      <p className="text-xs text-[#59636a]">We will send a verification code to the email address linked to your account.</p>
      <SubmitButton loading={loading} loadingText="Sending code…">
        <LogIn className="h-4 w-4" /><span>Continue to verification</span>
      </SubmitButton>
    </form>
  );
}
