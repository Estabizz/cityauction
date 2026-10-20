"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Honeypot, SubmitErrorNotice, postLead, readHoneypot } from "@/components/forms/lead-submit";

export function UnsubscribeForm({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await postLead("/api/subscribe/unsubscribe", {
      email,
      hp: readHoneypot(e.currentTarget),
    });

    setLoading(false);
    if (result.ok) setDone(result.message);
    else setError(result.error);
  };

  if (done) {
    return (
      <div role="status" className="mt-6 p-4 bg-[#fcfaf6] border border-[#e6dfd4] rounded-xl text-sm text-[#525d64] flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-[#3f6b57] shrink-0 mt-0.5" />
        <p>{done}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="field-custom">
        <label htmlFor="unsubscribeEmail">Email</label>
        <input
          id="unsubscribeEmail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
        />
      </div>

      <Honeypot />
      {error && <SubmitErrorNotice message={error} />}

      <button
        type="submit"
        disabled={loading}
        className="btn-pill btn-dark w-full mt-4 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Unsubscribing..." : "Unsubscribe"}
      </button>
    </form>
  );
}
