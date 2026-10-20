"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Save } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";

type Profile = { fullName: string; phone: string; city: string; state: string };

export function ProfileForm({ initial, email }: { initial: Profile; email: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(initial);
  const [errors, setErrors] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
    setResult(null);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Profile> = {};
    if (form.fullName.trim().length < 2) found.fullName = "Please enter your full name.";
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 10) found.phone = "Please enter a valid phone number (at least 10 digits).";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { ok, data } = await postJson("/api/user/profile", form, "PATCH");
    setLoading(false);
    setResult({ ok, message: ok ? "Profile saved." : data.error || "Couldn't save your profile." });
    // Re-render the server parts (sidebar name, completeness).
    if (ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
      <Field id="fullName" label="Full name" autoComplete="name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} required />
      <Field id="email" label="Email" type="email" value={email} disabled readOnly hint="To change your email, contact info@estabizz.com." />
      <Field id="phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} error={errors.phone} />
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
      <Field id="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} required />
      <div className="sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Changing…">
          <KeyRound className="h-4 w-4" />
          <span>Change password</span>
        </SubmitButton>
      </div>
    </form>
  );
}
