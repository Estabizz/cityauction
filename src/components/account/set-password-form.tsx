"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";

export function SetPasswordForm({ token, email }: { token: string; email?: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (password.length < 8) found.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password) found.confirmPassword = "The two passwords don't match.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    setError(null);
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/set-password", { token, password, confirmPassword });
    if (ok) {
      window.location.assign(data.redirectTo || "/dashboard");
      return;
    }
    setError(data.error || "Couldn't save your password. Please try again.");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      {email && (
        <>
          {/* Lets password managers save the new password against the right account. */}
          <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
          <p className="text-sm text-[#59636a]">
            Account: <strong className="text-[#182129] break-all">{email}</strong>
          </p>
        </>
      )}
      <Field id="password" label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" hint="At least 8 characters." value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
      <Field id="confirmPassword" label="Confirm new password" type="password" allowReveal={false} autoComplete="new-password" placeholder="Type it again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} required />
      <SubmitButton loading={loading} loadingText="Saving…">
        <KeyRound className="h-4 w-4" />
        <span>Save password and sign in</span>
      </SubmitButton>
    </form>
  );
}
