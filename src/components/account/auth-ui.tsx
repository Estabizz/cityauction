"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#fbf9f5] text-[#182129] flex flex-col">
      <div className="bg-[#060b0f] text-[#aeb9c1] text-xs">
        <div className="mx-auto w-full max-w-5xl px-4 py-2 flex items-center justify-between gap-3">
          <span>
            <strong className="text-white">CityAuction</strong>
            <span className="hidden sm:inline"> · A venture of Estabizz Fintech Private Limited</span>
          </span>
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14">
        <Link href="/" aria-label="CityAuction home" className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} className="h-11 sm:h-12 w-auto" />
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-[#091118] leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-[#59636a] mt-2">{subtitle}</p>}
          </div>

          <div className="bg-white border border-[#e6dfd4] rounded-2xl shadow-sm px-5 py-7 sm:px-8">{children}</div>

          {footer && <div className="mt-5 text-center text-sm text-[#59636a]">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

const inputClass =
  "w-full h-11 px-3.5 rounded-lg border border-[#dcd5ca] bg-[#fdfcfa] text-sm text-[#182129] placeholder:text-[#9aa1a6] focus:outline-none focus:ring-2 focus:ring-[#b49361]/30 focus:border-[#b49361] disabled:opacity-60";

export function Field({
  label,
  hint,
  error,
  id,
  type = "text",
  labelAside,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  id: string;
  labelAside?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-semibold text-[#3b464e] uppercase tracking-wider">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${inputClass} ${isPassword ? "pr-11" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center text-[#7e868b] hover:text-[#182129] cursor-pointer"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 mt-1.5">
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

export function SubmitButton({ loading, children, loadingText }: { loading: boolean; children: React.ReactNode; loadingText: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-[#091118] text-white text-sm font-bold hover:bg-[#25333f] transition-colors disabled:opacity-60 cursor-pointer"
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
  const Icon = kind === "error" ? AlertCircle : CheckCircle2;
  const colors = kind === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-emerald-50 border-emerald-200 text-emerald-800";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`p-3.5 rounded-xl border text-sm flex items-start gap-2 ${colors}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
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
