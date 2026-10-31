"use client";

import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { PhoneEmailLink } from "./phone-email-forms";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, LogOut, Save } from "lucide-react";
import { profileSchema, changePasswordSchema } from "@/lib/profile-schema";
import type { z } from "zod";
import { BUYER_CATEGORIES } from "@/lib/buyer";
import { Field, FormAlert, SelectField, SubmitButton, postJson } from "./auth-ui";
import { CodeStep, useOtpSender } from "./otp-ui";

type Profile = z.output<typeof profileSchema>;

export function ProfileForm({ initial, emailVerified, companyLocked = false }: { initial: Profile; emailVerified: boolean; companyLocked?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const active = useRef(false); const element = useRef<HTMLFormElement>(null);
  const changedElsewhere = initial.updatedAt !== form.updatedAt && !result?.ok;
  const set = (key: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: undefined })); setResult(null);
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (active.current || changedElsewhere) return;
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])));
      element.current?.querySelector<HTMLElement>(`[name="${String(parsed.error.issues[0]?.path[0])}"]`)?.focus(); return;
    }
    active.current = true; setLoading(true); setResult(null);
    try {
      const { ok, data } = await postJson<{ updatedAt?: string }>("/api/user/profile", parsed.data, "PATCH");
      setResult({ ok, message: ok ? "Your profile has been saved." : data.error || "Your profile could not be saved. Your changes are still here." });
      if (ok) { setForm({ ...parsed.data, updatedAt: data.updatedAt || form.updatedAt }); router.refresh(); }
    } finally { active.current = false; setLoading(false); }
  }
  return <form ref={element} onSubmit={submit} className="space-y-5" noValidate>
    {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
    {changedElsewhere && <FormAlert>Your account details changed in another action or session. Your unsaved edits are kept. Reload the saved details before saving again.</FormAlert>}
    {changedElsewhere && <button type="button" className="min-h-11 rounded-xl border border-[#dce2e7] px-4 text-sm font-semibold" onClick={() => { setForm(initial); setErrors({}); setResult(null); }}>Reload saved details</button>}
    <fieldset disabled={loading} className="min-w-0 space-y-5 disabled:opacity-60">
      <Field id="fullName" label="Full name" autoComplete="name" maxLength={120} value={form.fullName} onChange={set("fullName")} error={errors.fullName} required />
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="email" label="Sign-in email" type="email" autoComplete="email" value={form.email} readOnly hint={emailVerified ? "Verified. Change this using email verification below." : "Not verified. Use email verification below."} />
        <Field id="phone" label="Contact phone (optional)" type="tel" autoComplete="tel" value={form.phone} maxLength={20} onChange={set("phone")} error={errors.phone} hint="Contact only; changing it does not verify the number." />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField id="accountType" label="Profile type" disabled={companyLocked} options={[{ value: "INDIVIDUAL", label: "Individual" }, { value: "ORGANIZATION", label: "Company / organisation" }]} value={form.accountType} onChange={set("accountType")} error={errors.accountType} />
        <SelectField id="buyerCategory" label="I am a" placeholder="Not specified" options={BUYER_CATEGORIES} value={form.buyerCategory} onChange={set("buyerCategory")} error={errors.buyerCategory} />
      </div>
      {(form.accountType === "ORGANIZATION" || companyLocked) && <div className="space-y-4 rounded-xl border border-[#e4e8ec] bg-[#f8fafb] p-4">
        <h3 className="text-sm font-semibold">Company details</h3>
        <Field id="companyName" label="Company / organisation name" autoComplete="organization" value={form.companyName} onChange={set("companyName")} maxLength={191} readOnly={companyLocked} error={errors.companyName} required />
        <Field id="gstNumber" label="GSTIN (optional)" value={form.gstNumber} onChange={set("gstNumber")} maxLength={15} readOnly={companyLocked} error={errors.gstNumber} hint="Saved as supplied. This does not verify GST registration." />
        <p className="text-xs leading-relaxed text-[#687480]">{companyLocked ? "These company details are under review or approved. Contact the team to request a correction." : "Company details describe your profile. They do not grant institution or admin access."}</p>
      </div>}
      <Field id="address" label="Address (optional)" autoComplete="street-address" maxLength={191} value={form.address} onChange={set("address")} error={errors.address} />
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="city" label="City (optional)" autoComplete="address-level2" value={form.city} onChange={set("city")} maxLength={80} error={errors.city} />
        <Field id="state" label="State / region (optional)" autoComplete="address-level1" value={form.state} onChange={set("state")} maxLength={80} error={errors.state} />
        <Field id="pincode" label="Postal code (optional)" autoComplete="postal-code" value={form.pincode} onChange={set("pincode")} maxLength={16} error={errors.pincode} />
      </div>
      <div className="sm:max-w-xs"><SubmitButton loading={loading} disabled={changedElsewhere} loadingText="Saving…"><Save className="h-4 w-4" />Save profile</SubmitButton></div>
    </fieldset>
  </form>;
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
  const active = useRef(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(channel: keyof Channels) {
    if (active.current) return; active.current = true; setSaved(false);
    setBusy(channel);
    setError(null);
    const { ok, data } = await postJson<{ preferences?: Channels }>("/api/user/preferences", { [channel]: !prefs[channel] }, "PUT");
    setBusy(null);
    active.current = false;
    if (ok && data.preferences) { setPrefs(data.preferences); setSaved(true); }
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
      {saved && <p role="status" className="text-xs text-emerald-800">Preferences saved.</p>}
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
              className={`relative w-14 h-11 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${prefs[key] ? "bg-[#091118]" : "bg-[#d9d2c6]"}`}
            >
              <span className={`absolute top-2.5 left-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center transition-transform ${prefs[key] ? "translate-x-6" : ""}`}>
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
  const active = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (active.current) return;
    if (!window.confirm("Sign out of CityAuction on every device, including this one?")) return;
    active.current = true; setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/user/sessions", { method: "DELETE", signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        // Full navigation clears account-specific stores after session revocation.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't sign you out everywhere. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    }
    active.current = false; setBusy(false);
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
  const router = useRouter();
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const active = useRef(false); const element = useRef<HTMLFormElement>(null);
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
    if (active.current) return;
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])));
      element.current?.querySelector<HTMLElement>(`[name="${String(parsed.error.issues[0]?.path[0])}"]`)?.focus(); return;
    }
    active.current = true; setLoading(true); setResult(null);
    try {
      const { ok, data } = await postJson("/api/user/password", parsed.data);
      setResult({ ok, message: ok ? "Password changed. Other devices have been signed out; this device stays signed in." : data.error || "Your password could not be changed. Please try again." });
      if (ok) { setForm(empty); setErrors({}); router.refresh(); }
    } finally { active.current = false; setLoading(false); }
  }

  return (
    <form ref={element} onSubmit={onSubmit} className="space-y-4" noValidate>
      {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
      <fieldset disabled={loading} className="min-w-0 space-y-4 disabled:opacity-60">
      <Field maxLength={128} id="currentPassword" label="Current password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} error={errors.currentPassword} required />
      <Field maxLength={128} id="newPassword" label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} required />
      <Field maxLength={128} id="confirmPassword" label="Confirm new password" type="password" allowReveal={false} autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} required />
      <div className="sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Changing…">
          <KeyRound className="h-4 w-4" />
          <span>Change password</span>
        </SubmitButton>
      </div>
      </fieldset>
    </form>
  );
}
