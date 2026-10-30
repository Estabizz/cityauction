"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { CALLBACK_INTERESTS, CALLBACK_WINDOWS } from "@/lib/callbacks";
import { COUNTRY_CODES } from "@/lib/mobile";
import { CheckboxField, Field, FormAlert, MobileField, SelectField, SubmitButton, postJson } from "@/components/account/auth-ui";
import { authLinkClass } from "@/components/account/styles";

export function CallbackForm() {
  const empty = { name: "", countryCode: "91", mobile: "", city: "", window: "", interest: "REGISTER", notes: "", callbackConsent: false, marketingOptIn: false, website: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string; message: string } | null>(null);

  function update<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (form.name.trim().length < 2) found.name = "Please enter your full name.";
    if (form.mobile.replace(/\D/g, "").length < 6) found.mobile = "Please enter a valid mobile number.";
    if (!form.window) found.window = "Please choose a preferred time.";
    if (!form.callbackConsent) found.callbackConsent = "Please confirm we may call you about this request.";
    setErrors(found);
    if (Object.keys(found).length) {
      setError("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    setError(null);
    const { ok, data } = await postJson<{ reference?: string; message?: string }>("/api/buyer/callbacks", form);
    setLoading(false);
    if (ok) {
      setDone({ reference: data.reference || "", message: data.message || "Callback request received." });
      setForm(empty);
    } else setError(data.error || "We could not process your request. Please try again or call us.");
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-5 w-5" /> {done.message}
        </p>
        {done.reference && <p className="mt-1 text-sm">Your reference: {done.reference}</p>}
        <p className="mt-3 text-sm">
          Want to get started now?{" "}
          <button type="button" onClick={() => setDone(null)} className="font-semibold underline cursor-pointer">
            Send another request
          </button>{" "}
          or{" "}
          <Link href="/auctions" className="font-semibold underline">
            browse auctions
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {error && (
        <div className="mb-4">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cbName" label="Full name *" autoComplete="name" placeholder="Your full name" maxLength={120} value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
        <MobileField
          id="cbMobile"
          label="Contact phone *"
          countryCode={form.countryCode}
          onCountryCodeChange={(v) => update("countryCode", v)}
          countryCodes={COUNTRY_CODES}
          placeholder="98765 43210"
          value={form.mobile}
          onChange={(e) => update("mobile", e.target.value)}
          error={errors.mobile}
        />
        <Field id="cbCity" label="Your city" placeholder="e.g. Surat" maxLength={80} value={form.city} onChange={(e) => update("city", e.target.value)} />
        <SelectField id="cbWindow" label="Preferred callback time *" placeholder="Select preferred time" options={CALLBACK_WINDOWS} value={form.window} onChange={(e) => update("window", e.target.value)} error={errors.window} />
        <div className="sm:col-span-2">
          <SelectField id="cbInterest" label="How can we help?" options={CALLBACK_INTERESTS} value={form.interest} onChange={(e) => update("interest", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cbNotes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#3b464e]">
            Anything else we should know? (optional)
          </label>
          <textarea
            id="cbNotes"
            rows={3}
            maxLength={2000}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Tell us what kind of opportunity you're looking for…"
            className="w-full rounded-lg border border-[#dcd5ca] bg-[#fdfcfa] px-3.5 py-2.5 text-sm focus:border-[#b49361] focus:outline-none focus:ring-2 focus:ring-[#b49361]/30"
          />
        </div>
        {/* Honeypot for bots; hidden from people and screen readers. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => update("website", e.target.value)} />
      </div>
      <div className="mt-5 space-y-3">
        <CheckboxField id="callbackConsent" checked={form.callbackConsent} onChange={(e) => update("callbackConsent", e.target.checked)} error={errors.callbackConsent}>
          I request a CityAuction representative to contact me about this enquiry and acknowledge the{" "}
          <Link href="/privacy-policy" target="_blank" className={authLinkClass}>
            Privacy Policy
          </Link>
          . *
        </CheckboxField>
        <CheckboxField id="cbMarketing" checked={form.marketingOptIn} onChange={(e) => update("marketingOptIn", e.target.checked)}>
          I also agree to receive property alerts and promotional updates (optional).
        </CheckboxField>
      </div>
      <div className="mt-6 sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Sending…">
          <PhoneCall className="h-4 w-4" />
          <span>Request My Callback</span>
        </SubmitButton>
      </div>
      <p className="mt-3 text-xs text-[#7e868b]">Callback timings are preferences, not guaranteed appointments.</p>
    </form>
  );
}
