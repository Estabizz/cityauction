"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Small building blocks shared by the admin pages. Colours follow the public
// site: night navy #091118, gold #b49361, ivory #f6f2ea, line #e6dfd4.

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <span className="eyebrow-text">{eyebrow}</span>}
        <h1 className="font-serif-heading text-3xl font-semibold leading-tight text-[#091118] md:text-4xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-[#6f777d]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-[#e6dfd4] bg-white shadow-[0_12px_36px_rgba(9,17,24,.05)]", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#efe9df] px-4 py-3 sm:px-5">
          <h2 className="font-serif-heading text-xl font-semibold text-[#091118]">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const buttonStyles = {
  primary: "bg-[#091118] text-white hover:bg-[#182129]",
  gold: "bg-[#b49361] text-[#091118] hover:bg-[#c4a676]",
  outline: "border border-[#e6dfd4] bg-white text-[#182129] hover:border-[#b49361]",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  ghost: "text-[#182129] hover:bg-[#f0ebe3]",
};

export function Button({
  variant = "outline",
  busy,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles; busy?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || busy}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        buttonStyles[variant],
        className
      )}
    >
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function ExportLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6dfd4] bg-white px-3.5 py-2 text-xs font-semibold text-[#182129] transition-colors hover:border-[#b49361]"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </a>
  );
}

// Search box that waits until typing pauses before reporting the value.
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  const [sent, setSent] = useState(value);
  // Follow outside changes (Clear filters, back button) but not the echo of
  // our own update, which could wipe letters typed since.
  if (value !== synced) {
    setSynced(value);
    if (value !== sent) setText(value);
  }
  useEffect(() => {
    if (text === value) return;
    const t = setTimeout(() => {
      setSent(text);
      onChange(text);
    }, 350);
    return () => clearTimeout(t);
  }, [text, value, onChange]);

  return (
    <label className="relative block min-w-0 flex-1 sm:min-w-[240px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f777d]" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e6dfd4] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#b49361]"
      />
    </label>
  );
}

export function SelectBox({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[#e6dfd4] bg-white px-3 py-2 text-sm outline-none focus:border-[#b49361]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function DateBox({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-[#6f777d]">
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-[#e6dfd4] bg-white px-2.5 py-1.5 text-sm text-[#182129] outline-none focus:border-[#b49361]"
      />
    </label>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}

const badgeTones = {
  gold: "bg-[#f5edd9] text-[#7a5f33] border-[#e8d7b5]",
  navy: "bg-[#091118] text-white border-[#091118]",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  red: "bg-red-50 text-red-700 border-red-200",
  grey: "bg-[#f3f1ec] text-[#6f777d] border-[#e6dfd4]",
};
export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "grey", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export const LEAD_STATUS_TONES: Record<string, BadgeTone> = {
  NEW: "gold",
  IN_PROGRESS: "blue",
  CONTACTED: "amber",
  RESOLVED: "green",
};

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-serif-heading text-2xl font-semibold text-[#091118]">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-[#6f777d]">{children}</div>}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="m-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span>{message}</span>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function LoadingRows() {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm text-[#6f777d]">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

export function Pagination({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#efe9df] px-4 py-3 text-xs text-[#6f777d] sm:px-5">
      <span>
        {first}–{last} of {total.toLocaleString("en-IN")}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-1">
          Page {page} of {pages}
        </span>
        <Button variant="ghost" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Right-hand drawer on desktop, full screen on phones.
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default bg-[#091118]/40" onClick={onClose} />
      <aside role="dialog" aria-modal="true" className="relative flex h-full w-full max-w-xl flex-col bg-[#fbf9f5] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#e6dfd4] bg-white px-5 py-4">
          <div className="min-w-0 font-serif-heading text-2xl font-semibold text-[#091118]">{title}</div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-[#6f777d] hover:bg-[#f0ebe3]" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-1.5 text-sm">
      <dt className="text-[#6f777d]">{label}</dt>
      <dd className="min-w-0 break-words text-[#182129]">{children ?? "—"}</dd>
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-[#7a5f33] underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}

export { tableClasses } from "./table-classes";
