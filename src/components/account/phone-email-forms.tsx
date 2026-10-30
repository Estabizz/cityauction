"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormAlert, postJson, SubmitButton } from "./auth-ui";
import { PhoneEmailButton } from "./phone-email-button";

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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
