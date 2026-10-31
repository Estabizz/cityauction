"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cardClass, inputClass, primaryButtonClass } from "@/components/ui/styles";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

// Building blocks for the sign-in, sign-up and password pages, in the site's
// navy (#091118) and gold (#b49361) style.

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-[#f8fafb] text-[#182129]">
      <div aria-hidden="true" className="h-[76px] shrink-0" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e4e8ec] bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="CityAuction home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} className="h-7 w-auto sm:h-8" />
          </Link>
          <Link href="/login" className="inline-flex min-h-11 items-center text-sm font-medium text-[#687480] hover:text-[#182129]">Back to sign in</Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:py-12">
        <div className="w-full max-w-[440px]">
          <div className={`${cardClass} p-6 sm:p-8`}>
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-[#101b26]">{title}</h1>
            {subtitle && <p className="mb-6 mt-2 text-sm leading-relaxed text-[#7a8590]">{subtitle}</p>}
            {children}
          </div>
          {footer && <p className="mt-5 text-center text-xs leading-relaxed text-[#687480]">{footer}</p>}
        </div>
      </main>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  id,
  type = "text",
  labelAside,
  allowReveal = true,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  id: string;
  labelAside?: React.ReactNode;
  allowReveal?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-[#182129]">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && allowReveal && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${inputClass} ${isPassword && allowReveal ? "pr-11" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...props}
        />
        {isPassword && allowReveal && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center text-[#7e868b] hover:text-[#182129] cursor-pointer"
            aria-label={show ? "Hide password" : "Show password"}
            aria-controls={id}
            aria-pressed={show}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="break-words text-xs text-red-600 mt-1.5">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-[#7e868b] mt-1.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const selectClass = `${inputClass} appearance-none pr-9 bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237e868b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.85rem_center]`;

export function SelectField({
  label,
  error,
  id,
  options,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  id: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-[#182129]">
        {label}
      </label>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${selectClass} ${error ? "border-red-400" : ""}`}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="break-words text-xs text-red-600 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

// Optional contact phone or callback number; authentication uses email.
export function MobileField({
  id = "mobile",
  label = "Mobile number",
  countryCode,
  onCountryCodeChange,
  countryCodes,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  countryCodes: readonly { value: string; label: string }[];
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-[#182129]">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          disabled={props.disabled}
          className={`${selectClass.replace("w-full ", "")} w-[6rem] sm:w-[7.5rem] shrink-0`}
        >
          {countryCodes.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${inputClass} flex-1 min-w-0 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="break-words text-xs text-red-600 mt-1.5">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-[#7e868b] mt-1.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxField({
  id,
  children,
  error,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer">
        <input
          id={id}
          name={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#dce1e6] accent-[#091118] cursor-pointer"
          {...props}
        />
        <span className="text-[13px] leading-snug text-[#3b464e]">{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 mt-1 ml-6.5">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText, disabled = false }: { loading: boolean; children: React.ReactNode; loadingText: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`w-full ${primaryButtonClass}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormAlert({ kind = "error", children }: { kind?: "error" | "success"; children: React.ReactNode }) {
  const alert = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (kind === "error") alert.current?.scrollIntoView?.({ block: "nearest" });
  }, [kind]);
  const Icon = kind === "error" ? AlertCircle : CheckCircle2;
  const colors = kind === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-emerald-50 border-emerald-200 text-emerald-800";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`p-3.5 rounded-xl border text-sm flex items-start gap-2 ${colors}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

// POST JSON and normalise the reply so forms can show a clear message either way.
export async function postJson<T = Record<string, unknown>>(
  url: string,
  body: unknown,
  method: "POST" | "PATCH" | "PUT" = "POST"
): Promise<{ ok: boolean; data: T & { error?: string; message?: string } }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.error) data.error = "Something went wrong. Please try again.";
    return { ok: res.ok && data.success !== false, data };
  } catch {
    return { ok: false, data: { error: "Network error. Please check your connection and try again." } as T & { error: string } };
  }
}
