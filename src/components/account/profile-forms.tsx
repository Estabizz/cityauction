"use client";

import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { PhoneEmailLink } from "./phone-email-forms";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, LogOut, Save } from "lucide-react";
import { BUYER_CATEGORIES } from "@/lib/buyer";
import { Field, FormAlert, SelectField, SubmitButton, postJson } from "./auth-ui";
import { CodeStep, useOtpSender } from "./otp-ui";

type Profile = { fullName: string; email: string; phone: string; buyerCategory: string; city: string; state: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm({ initial, emailVerified }: { initial: Profile; emailVerified: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(initial);
  const [errors, setErrors] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
    setResult(null);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Profile> = {};
    if (form.fullName.trim().length < 2) found.fullName = "Please enter your full name.";
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) found.email = "Please enter a valid email address.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { ok, data } = await postJson("/api/user/profile", form, "PATCH");
    setLoading(false);
    setResult({ ok, message: ok ? "Profile saved." : data.error || "Couldn't save your profile." });
    // Re-render the server parts (sidebar name, completeness).
    if (ok) router.refresh();
  }

  const emailHint = emailVerified ? "Verified sign-in address. Use the verification form below to change it." : "Verify your email using the form below.";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
      <Field id="fullName" label="Full name" autoComplete="name" maxLength={120} value={form.fullName} onChange={set("fullName")} error={errors.fullName} required />
      <Field id="email" label="Email" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} readOnly hint={emailHint} />
      <Field id="phone" label="Contact phone (optional)" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} hint="Contact only. All verification uses email." />
      <SelectField id="buyerCategory" label="I am a" placeholder="Not specified" options={BUYER_CATEGORIES} value={form.buyerCategory} onChange={set("buyerCategory")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="city" label="City" autoComplete="address-level2" placeholder="e.g. Ahmedabad" value={form.city} onChange={set("city")} maxLength={80} />
        <Field id="state" label="State" autoComplete="address-level1" placeholder="e.g. Gujarat" value={form.state} onChange={set("state")} maxLength={80} />
      </div>
      <div className="sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Saving…">
          <Save className="h-4 w-4" />
          <span>Save profile</span>
        </SubmitButton>
      </div>
    </form>
  );
}

// Changing the sign-in email requires proof of the new email address.
export function EmailForm({ email }: { email: string | null }) {
  return PHONE_EMAIL_ENABLED ? <PhoneEmailLink email={email} /> : <SmtpEmailForm email={email} />;
}

function SmtpEmailForm({ email }: { email: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const sender = useOtpSender("link");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(await sender.send(value));
  }
  async function verify(code: string) {
    const { ok, data } = await postJson("/api/user/email", { email: value, challengeId: sender.sent?.challengeId, otp: code });
    if (!ok) return data.error || "Couldn't verify this email.";
    sender.reset(); setValue(""); setDone(true); router.refresh();
    return null;
  }
  if (sender.sent) return <CodeStep sender={sender} onResend={() => sender.send(value)} onVerify={verify} onBack={sender.reset} submitLabel="Verify email" loadingText="Verifying…" />;
  return (
    <form onSubmit={send} className="space-y-4" noValidate>
      {done && <FormAlert kind="success">Email verified. Other devices have been signed out.</FormAlert>}
      {error && <FormAlert>{error}</FormAlert>}
      <p className="text-sm text-[#59636a]">{email ? `Current sign-in email: ${email}` : "Add and verify an email address to sign in."}</p>
      <Field id="new-email" label={email ? "New email address" : "Email address"} type="email" autoComplete="email" value={value} onChange={(e) => setValue(e.target.value)} required />
      <SubmitButton loading={sender.sending} loadingText="Sending code…"><span>Send email verification code</span></SubmitButton>
    </form>
  );
}

type Channels = { EMAIL: boolean; SMS: boolean; WHATSAPP: boolean };

export function MarketingPreferences({ initial, hasEmail }: { initial: Channels; hasEmail: boolean }) {
  const [prefs, setPrefs] = useState<Channels>(initial);
  const [busy, setBusy] = useState<keyof Channels | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(channel: keyof Channels) {
    setBusy(channel);
    setError(null);
    const { ok, data } = await postJson<{ preferences?: Channels }>("/api/user/preferences", { [channel]: !prefs[channel] }, "PUT");
    setBusy(null);
    if (ok && data.preferences) setPrefs(data.preferences);
    else setError(data.error || "Couldn't save your choice. Please try again.");
  }

  const rows: { key: keyof Channels; label: string; disabled?: boolean }[] = [
    { key: "SMS", label: "SMS" },
    { key: "WHATSAPP", label: "WhatsApp" },
    { key: "EMAIL", label: hasEmail ? "Email" : "Email (add an email address first)", disabled: !hasEmail },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#59636a]">
        New auction opportunities and offers from CityAuction. Messages about your own requests and account are sent either way.
      </p>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      <ul className="divide-y divide-[#efe9df] border-y border-[#efe9df]">
        {rows.map(({ key, label, disabled }) => (
          <li key={key} className="flex items-center justify-between gap-3 py-3">
            <span className={`text-sm ${disabled ? "text-[#9aa1a6]" : "text-[#182129]"}`}>{label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              aria-label={`Promotional ${label}`}
              disabled={disabled || busy !== null}
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${prefs[key] ? "bg-[#091118]" : "bg-[#d9d2c6]"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-transform ${prefs[key] ? "translate-x-5" : ""}`}>
                {busy === key && <Loader2 className="h-3 w-3 animate-spin text-[#59636a]" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoutEverywhere() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!window.confirm("Sign out of CityAuction on every device, including this one?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/user/sessions", { method: "DELETE" });
      if (res.ok) {
        window.location.assign("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't sign you out everywhere. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[#182129]">Log out of all devices</p>
        <p className="text-xs text-[#59636a]">Use this if you signed in on a shared or lost device.</p>
        {error && <p className="text-xs text-red-600 mt-1" role="alert">{error}</p>}
      </div>
      <button type="button" onClick={run} disabled={busy} className="self-start inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-red-200 bg-white text-xs font-bold text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-60">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />} Log out everywhere
      </button>
    </div>
  );
}

export function ChangePasswordForm() {
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<typeof empty>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
    setResult(null);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<typeof empty> = {};
    if (!form.currentPassword) found.currentPassword = "Please enter your current password.";
    if (form.newPassword.length < 8) found.newPassword = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.newPassword) found.confirmPassword = "The two new passwords don't match.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { ok, data } = await postJson("/api/user/password", form);
    setLoading(false);
    setResult({ ok, message: ok ? "Password changed." : data.error || "Couldn't change your password." });
    if (ok) setForm(empty);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
      <Field id="currentPassword" label="Current password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} error={errors.currentPassword} required />
      <Field id="newPassword" label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} required />
      <Field id="confirmPassword" label="Confirm new password" type="password" allowReveal={false} autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} required />
      <div className="sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Changing…">
          <KeyRound className="h-4 w-4" />
          <span>Change password</span>
        </SubmitButton>
      </div>
    </form>
  );
}
