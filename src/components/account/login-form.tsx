"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Field, FormAlert, SubmitButton, postJson } from "./auth-ui";
import { authLinkClass } from "./styles";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login", { email, password, next });
    if (ok) {
      // Full page load so the header and protected pages pick up the new session.
      window.location.assign(data.redirectTo || "/dashboard");
      return;
    }
    setError(data.error || "Couldn't sign you in. Please try again.");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <FormAlert>{error}</FormAlert>}

      <Field
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        labelAside={
          <Link href="/forgot-password" className={`text-xs ${authLinkClass}`}>
            Forgot password?
          </Link>
        }
      />

      <SubmitButton loading={loading} loadingText="Signing in…">
        <LogIn className="h-4 w-4" />
        <span>Sign in</span>
      </SubmitButton>
    </form>
  );
}
