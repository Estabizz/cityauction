"use client";

import { useState } from "react";
import { Loader2, Mail, MailX } from "lucide-react";
import { postJson } from "./auth-ui";

export function NewsletterToggle({ initialSubscribed, email }: { initialSubscribed: boolean; email: string }) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    const { ok, data } = await postJson<{ subscribed?: boolean }>("/api/user/subscription", { subscribed: !subscribed }, "PUT");
    setBusy(false);
    if (ok && typeof data.subscribed === "boolean") setSubscribed(data.subscribed);
    else setError(data.error || "Couldn't update your subscription. Please try again.");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${subscribed ? "bg-emerald-50 text-emerald-700" : "bg-[#f3efe8] text-[#7e868b]"}`}>
          {subscribed ? <Mail className="h-5 w-5" /> : <MailX className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#182129]">{subscribed ? "Subscribed" : "Not subscribed"}</p>
          <p className="text-xs text-[#59636a] break-all">
            {subscribed ? `Auction updates and insights go to ${email}.` : "Get new auction opportunities and market notes by email."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={subscribed}
        className={`inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 ${
          subscribed ? "border border-[#dcd5ca] bg-white text-[#3b464e] hover:bg-[#f6f2ea]" : "bg-[#b49361] text-[#081016] hover:bg-[#c4a46e]"
        }`}
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}
