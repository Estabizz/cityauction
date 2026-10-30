"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Field, FormAlert, SelectField, SubmitButton } from "@/components/account/auth-ui";
import { inputClass } from "@/components/ui/styles";
import { Honeypot, SubmitErrorNotice, submitEnquiry } from "@/components/forms/lead-submit";
import { HOME_ENQUIRY_TYPES, homeEnquiryErrors, type HomeEnquiry } from "@/lib/home-enquiry";

const empty: HomeEnquiry = { name: "", phone: "", email: "", subject: "", message: "" };

export function HomeEnquiryForm() {
  const [values, setValues] = useState<HomeEnquiry>(empty);
  const [errors, setErrors] = useState<ReturnType<typeof homeEnquiryErrors>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const update = (key: keyof HomeEnquiry) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((value) => ({ ...value, [key]: e.target.value })); setErrors((value) => ({ ...value, [key]: undefined })); setSuccess(false);
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending.current) return;
    setError(null); setSuccess(false);
    const issues = homeEnquiryErrors(values); setErrors(issues);
    const first = Object.keys(issues)[0];
    if (first) { document.getElementById(`home-contact-${first}`)?.focus(); return; }
    pending.current = true; setLoading(true);
    const result = await submitEnquiry(e.currentTarget, { source: "homepage", name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim().toLowerCase(), subject: values.subject, message: values.message.trim(), fields: { "Help with": values.subject } });
    pending.current = false; setLoading(false);
    if (result.ok) { setSuccess(true); setValues(empty); setErrors({}); }
    else setError(result.error);
  }
  return <form className="relative p-6 sm:p-8 lg:p-10" aria-labelledby="home-contact-heading" noValidate onSubmit={submit}>
    <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#84663c]">Start a conversation</p>
    <h3 id="home-contact-heading" className="mt-2 text-2xl font-semibold tracking-tight text-[#182129]">How can we help?</h3>
    <p className="mb-6 mt-2 text-sm text-[#687480]">Tell us a little about what you need.</p>
    {success && <div className="mb-5"><FormAlert kind="success">Enquiry sent. Our team will get in touch.</FormAlert></div>}
    <fieldset disabled={loading} className="grid min-w-0 gap-5 sm:grid-cols-2">
      <Field id="home-contact-name" label="Name" autoComplete="name" maxLength={150} placeholder="Your name" value={values.name} onChange={update("name")} error={errors.name} required />
      <Field id="home-contact-phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="+91 98765 43210" value={values.phone} onChange={update("phone")} error={errors.phone} required />
      <Field id="home-contact-email" label="Email (optional)" type="email" autoComplete="email" maxLength={190} placeholder="you@company.com" value={values.email} onChange={update("email")} error={errors.email} />
      <SelectField id="home-contact-subject" label="I need help with" placeholder="Select a topic" options={HOME_ENQUIRY_TYPES} value={values.subject} onChange={update("subject")} error={errors.subject} required />
      <div className="min-w-0 sm:col-span-2">
        <label htmlFor="home-contact-message" className="mb-2 block text-sm font-medium text-[#182129]">Message (optional)</label>
        <textarea id="home-contact-message" className={`${inputClass} min-h-32 resize-y py-3`} rows={4} maxLength={5000} placeholder="Property, location and how we can help." value={values.message} onChange={update("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "home-contact-message-error" : undefined} />
        {errors.message && <p id="home-contact-message-error" className="mt-1.5 text-xs text-red-700">{errors.message}</p>}
      </div>
    </fieldset>
    <Honeypot />
    {error && <SubmitErrorNotice message={error} />}
    <div className="mt-6"><SubmitButton loading={loading} loadingText="Sending…">Send enquiry<ArrowRight className="h-4 w-4" /></SubmitButton></div>
  </form>;
}
