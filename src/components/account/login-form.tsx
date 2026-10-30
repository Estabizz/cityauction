"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, FormAlert, postJson, SubmitButton } from "./auth-ui";

// Compatibility component; the unified account page uses the same endpoint.
export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError(null);
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login", { email, password, next });
    if (!ok) { setError(data.error || "Couldn't sign in."); setLoading(false); return; }
    setPassword(""); window.location.assign(data.redirectTo || "/dashboard");
  }
  return <form onSubmit={submit} className="space-y-4">
    {error && <FormAlert>{error}</FormAlert>}
    <Field id="email" label="Email address" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <Field id="password" label="Password" type="password" autoComplete="current-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} required />
    <Link href="/forgot-password" className="block text-right text-sm text-[#84663c] underline">Forgot password?</Link>
    <SubmitButton loading={loading} loadingText="Signing in…">Sign in</SubmitButton>
  </form>;
}
