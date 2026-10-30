"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Loader2, LockKeyhole } from "lucide-react";
import { inputClass } from "@/components/ui/styles";
import { BUYER_CATEGORIES } from "@/lib/buyer";
import { PHONE_EMAIL_ENABLED } from "@/lib/phone-email-config";
import { AccountHeader } from "@/components/layout/header";
import { CallbackForm } from "@/components/buyer/callback-form";
import type { AccountView } from "./access-route";
import { Field, FormAlert, postJson } from "./auth-ui";
import { CodeStep, useOtpSender } from "./otp-ui";
import { PhoneEmailButton } from "./phone-email-button";

const textLink = "font-medium text-[#84663c] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]";

export function AccountAccess({ initialView = "login", next }: { initialView?: AccountView; next?: string }) {
  const [view, setView] = useState<AccountView>(initialView);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [buyerCategory, setBuyerCategory] = useState("INDIVIDUAL_BUYER");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; name?: string; terms?: string; password?: string; confirmPassword?: string }>({});
  const loginTab = useRef<HTMLButtonElement>(null);
  const registerTab = useRef<HTMLButtonElement>(null);
  const sender = useOtpSender(view === "register" ? "register" : "login");
  const isRegister = view === "register";
  const title = view === "callback" ? "How can we help?" : verifying ? "Verify your email" : isRegister ? "Create your account" : "Welcome back";

  function switchView(target: AccountView) {
    setView(target); setVerifying(false); setError(null); setFieldErrors({}); sender.reset(); setPassword(""); setConfirmPassword("");
    const url = new URL(window.location.href);
    if (target === "login") url.searchParams.delete("view"); else url.searchParams.set("view", target);
    window.history.replaceState(null, "", url.pathname + url.search);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sender.sending || loading) return;
    const errors: typeof fieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 191) errors.email = "Enter a valid email address.";
    if (isRegister && (fullName.trim().length < 2 || fullName.trim().length > 120)) errors.name = "Enter your full name (2–120 characters).";
    if (!password || (isRegister && (password.length < 8 || password.length > 128))) errors.password = isRegister ? "Choose a password between 8 and 128 characters." : "Enter your password.";
    if (isRegister && password !== confirmPassword) errors.confirmPassword = "The two passwords don't match.";
    if (isRegister && !acceptTerms) errors.terms = "Please agree to the terms to continue.";
    setFieldErrors(errors); setError(null);
    if (Object.keys(errors).length) {
      document.getElementById(errors.name ? "account-name" : errors.email ? "account-email" : errors.password ? "account-password" : errors.confirmPassword ? "account-confirm-password" : "account-terms")?.focus();
      return;
    }
    if (!isRegister) {
      setLoading(true);
      const { ok, data } = await postJson<{ redirectTo?: string }>("/api/auth/login", { email: email.trim().toLowerCase(), password, next });
      if (!ok) { setError(data.error || "Couldn't sign in. Please try again."); setLoading(false); return; }
      setPassword("");
      window.location.assign(data.redirectTo || "/dashboard");
      return;
    }
    if (!PHONE_EMAIL_ENABLED) {
      const failure = await sender.send(email);
      if (failure) { setError(failure); return; }
    }
    setVerifying(true);
  }

  async function finish(proof: { phoneEmailToken?: string; challengeId?: string; otp?: string }) {
    const registration = isRegister ? { password, confirmPassword, fullName: fullName.trim(), buyerCategory, acceptTerms, marketingOptIn, onboarded: true } : {};
    const { ok, data } = await postJson<{ redirectTo?: string }>(isRegister ? "/api/auth/register" : "/api/auth/login-otp", {
      email: email.trim().toLowerCase(), next, ...registration, ...proof,
    });
    if (!ok) return data.error || "We couldn't continue. Please try again.";
    setPassword(""); setConfirmPassword("");
    window.location.assign(data.redirectTo || "/dashboard");
    return null;
  }

  function editEmail() { setVerifying(false); setError(null); sender.reset(); }

  return (
    <div className="flex min-h-svh flex-col bg-[#f8fafb] text-[#182129]">
      <AccountHeader />

      <main className="flex flex-1 items-center justify-center px-5 py-7 sm:py-12">
        <div className={`w-full ${view === "callback" ? "max-w-xl" : "max-w-[440px]"}`}>
          <section className="rounded-[24px] border border-[#e4e8ec] bg-white p-6 shadow-[0_8px_40px_-20px_rgba(24,33,41,0.18)] sm:p-8" aria-labelledby="account-heading">
            {view === "callback" ? (
              <button type="button" onClick={() => switchView("login")} className={`mb-6 inline-flex items-center gap-2 text-sm ${textLink}`}><ArrowLeft className="h-4 w-4" /> Back to sign in</button>
            ) : !verifying ? (
              <div role="tablist" aria-label="Account access" className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-[#f1f4f6] p-1" onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
                e.preventDefault();
                const target = e.key === "Home" ? "login" : e.key === "End" ? "register" : isRegister ? "login" : "register";
                switchView(target); (target === "login" ? loginTab : registerTab).current?.focus();
              }}>
                {(["login", "register"] as const).map((tab) => (
                  <button key={tab} ref={tab === "login" ? loginTab : registerTab} type="button" role="tab" id={`account-tab-${tab}`} aria-selected={view === tab} aria-controls="account-panel" tabIndex={view === tab ? 0 : -1} onClick={() => switchView(tab)}
                    className={`rounded-lg px-2 py-2.5 text-[13px] sm:text-sm whitespace-nowrap font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84663c] ${view === tab ? "bg-white text-[#182129] shadow-sm" : "text-[#7a8590] hover:text-[#182129]"}`}>
                    {tab === "login" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            ) : null}

            <div id="account-panel" role={view === "callback" || verifying ? undefined : "tabpanel"} aria-labelledby={view === "callback" || verifying ? "account-heading" : `account-tab-${view}`}>
              <h1 id="account-heading" className="text-[26px] font-semibold leading-tight tracking-[-0.035em] text-[#101b26]">{title}</h1>
              <p className="mb-6 mt-2 text-sm leading-relaxed text-[#7a8590]">
                {view === "callback" ? "Leave your details and our team will call you." : verifying ? isRegister ? "Verify your email to finish creating your account." : "One quick step to keep your account secure." : isRegister ? "Save properties and keep track of opportunities." : "Your saved properties and requests, in one place."}
              </p>

              {view === "callback" ? <CallbackForm /> : verifying ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafb] px-3.5 py-3">
                    <span className="min-w-0 break-all text-sm font-medium">{email.trim().toLowerCase()}</span>
                    <button type="button" onClick={editEmail} className={`min-h-11 shrink-0 text-xs ${textLink}`}>Edit</button>
                  </div>
                  {PHONE_EMAIL_ENABLED ? <PhoneEmailButton email={email.trim().toLowerCase()} purpose={isRegister ? "register" : "login"} compact onVerified={(token) => finish({ phoneEmailToken: token })} /> : (
                    <CodeStep sender={sender} onResend={() => sender.send(email)} onVerify={(otp) => finish({ challengeId: sender.sent?.challengeId, otp })} onBack={editEmail}
                      submitLabel={isRegister ? "Verify & create account" : "Verify & sign in"} loadingText="Verifying…" />
                  )}
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5" noValidate>
                  {error && <FormAlert>{error}</FormAlert>}
                  {isRegister && <div>
                    <label htmlFor="account-name" className="mb-2 block text-sm font-medium">Full name</label>
                    <input id="account-name" name="fullName" autoComplete="name" placeholder="Your full name" maxLength={120} value={fullName} onChange={(e) => { setFullName(e.target.value); setFieldErrors((v) => ({ ...v, name: undefined })); }} className={inputClass} aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? "account-name-error" : undefined} required />
                    {fieldErrors.name && <p id="account-name-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.name}</p>}
                  </div>}
                  <div>
                    <label htmlFor="account-email" className="mb-2 block text-sm font-medium">Email address</label>
                    <input id="account-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={191} value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors((v) => ({ ...v, email: undefined })); }} className={inputClass} aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? "account-email-error" : undefined} required />
                    {fieldErrors.email && <p id="account-email-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.email}</p>}
                  </div>
                  <Field key={view} id="account-password" label="Password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} maxLength={128} value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors((v) => ({ ...v, password: undefined })); }} error={fieldErrors.password} hint={isRegister ? "Use 8–128 characters." : undefined} required />
                  {isRegister && <Field id="account-confirm-password" label="Confirm password" type="password" allowReveal={false} autoComplete="new-password" maxLength={128} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((v) => ({ ...v, confirmPassword: undefined })); }} error={fieldErrors.confirmPassword} required />}
                  {!isRegister && <div className="text-right"><Link href="/forgot-password" className={`text-sm ${textLink}`}>Forgot password?</Link></div>}
                  {isRegister && <>
                    <details className="group rounded-xl border border-[#e8ecef] text-sm">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-[#7a8590] [&::-webkit-details-marker]:hidden">Account preferences <span className="ml-auto mr-2 text-xs text-[#98a1ab]">Optional</span><ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" /></summary>
                      <div className="space-y-4 border-t border-[#edf0f3] p-3.5">
                        <label htmlFor="account-category" className="block text-xs font-medium">I am a</label>
                        <select id="account-category" value={buyerCategory} onChange={(e) => setBuyerCategory(e.target.value)} className={inputClass}>{BUYER_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
                        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-[#687480]"><input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#182129]" />Email me relevant property opportunities.</label>
                      </div>
                    </details>
                    <div>
                      <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#687480]">
                        <input id="account-terms" type="checkbox" checked={acceptTerms} onChange={(e) => { setAcceptTerms(e.target.checked); setFieldErrors((v) => ({ ...v, terms: undefined })); }} aria-invalid={!!fieldErrors.terms} aria-describedby={fieldErrors.terms ? "account-terms-error" : undefined} className="mt-0.5 h-4 w-4 shrink-0 accent-[#182129]" />
                        <span>I agree to the <Link href="/terms" target="_blank" className={textLink}>Terms</Link> and <Link href="/privacy-policy" target="_blank" className={textLink}>Privacy Policy</Link>.</span>
                      </label>
                      {fieldErrors.terms && <p id="account-terms-error" className="mt-1.5 text-xs text-red-700">{fieldErrors.terms}</p>}
                    </div>
                  </>}
                  <button type="submit" disabled={sender.sending || loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#132330] px-4 text-sm font-semibold text-white transition hover:bg-[#253b4b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c] disabled:opacity-60">
                    {sender.sending || loading ? <><Loader2 className="h-4 w-4 animate-spin" />{loading ? "Signing in…" : "Sending code…"}</> : <>{isRegister ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4" /></>}
                  </button>
                  {!isRegister && <p className="text-center text-xs text-[#7a8590]">Previously signed in with email OTP? Use Forgot password to set your password.</p>}
                </form>
              )}
            </div>

            {view !== "callback" && <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-[#edf0f3] pt-5 text-[11px] text-[#98a1ab]"><LockKeyhole className="h-3 w-3" />{verifying || isRegister ? "Secure email verification" : "Secure account access"}</div>}
          </section>
          {view !== "callback" && <p className="mt-5 text-center text-xs text-[#7a8590]"><Link href="/contact" className={textLink}>Need help?</Link><span aria-hidden className="mx-3 text-[#c4cbd2]">·</span><button type="button" onClick={() => switchView("callback")} className={textLink}>Request a callback</button></p>}
        </div>
      </main>
      <footer className="flex items-center justify-center gap-5 px-5 pb-6 pt-4 text-[11px] text-[#98a1ab]"><span>© CityAuction</span><Link href="/privacy-policy" className="hover:text-[#687480]">Privacy</Link><Link href="/terms" className="hover:text-[#687480]">Terms</Link></footer>
    </div>
  );
}
