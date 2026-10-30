"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { authLinkClass } from "./styles";

type Form = { fullName: string; email: string; phone: string; password: string; confirmPassword: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: Form): Errors {
  const errors: Errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Please enter a valid email address.";
  if (form.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a valid phone number (at least 10 digits).";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "The two passwords don't match.";
  return errors;
}

export function RegisterForm({ next }: { next?: string }) {
  const [form, setForm] = useState<Form>({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    setError(null);
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/register", { ...form, next });
    if (ok) {
      window.location.assign(data.redirectTo || "/dashboard");
      return;
    }
    const message = data.error || "Couldn't create your account. Please try again.";
    setError(
      message.includes("already exists") ? (
        <>
          {message}{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </>
      ) : (
        message
      )
    );
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}

      <Field id="fullName" label="Full name" autoComplete="name" placeholder="As on your PAN card" value={form.fullName} onChange={set("fullName")} error={errors.fullName} required />
      <Field id="email" label="Email address" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={set("email")} error={errors.email} required />
      <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} error={errors.phone} required />
      <Field id="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" hint="At least 8 characters." value={form.password} onChange={set("password")} error={errors.password} required />
      <Field id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" placeholder="Type it again" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} required />

      <SubmitButton loading={loading} loadingText="Creating your account…">
        <UserPlus className="h-4 w-4" />
        <span>Create account</span>
      </SubmitButton>

      <p className="text-xs text-[#7e868b] text-center leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className={authLinkClass}>Terms</Link> and{" "}
        <Link href="/privacy-policy" className={authLinkClass}>Privacy Policy</Link>.
      </p>
    </form>
  );
}
