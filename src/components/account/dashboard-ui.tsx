import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";

// Server-safe building blocks for dashboard pages.

export function Panel({ title, icon, children, className = "" }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-[#e6dfd4] p-5 sm:p-6 ${className}`}>
      <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#84663c] mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif-heading text-3xl sm:text-4xl font-semibold text-[#091118]">{title}</h1>
      {subtitle && <p className="text-sm text-[#59636a] mt-1">{subtitle}</p>}
    </div>
  );
}

export function DbErrorNote() {
  return (
    <div role="alert" className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm flex items-start gap-2">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>Some of your account details couldn&apos;t be loaded right now. Please refresh in a minute.</span>
    </div>
  );
}

// For sections whose feature isn't live yet: say so plainly instead of showing sample data.
export function ComingSoon({
  title,
  subtitle,
  icon,
  description,
  cta = { href: "/auctions", label: "Explore auctions" },
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div>
      <PageHeading title={title} subtitle={subtitle} />
      <div className="bg-white rounded-2xl border border-[#e6dfd4] px-6 py-12 sm:py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#f5edd3] text-[#84663c] flex items-center justify-center mx-auto">{icon}</div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#84663c]">
          <Clock className="h-3.5 w-3.5" /> Coming soon
        </p>
        <h2 className="font-serif-heading text-2xl font-semibold text-[#091118] mt-1">Nothing here yet</h2>
        <p className="text-sm text-[#59636a] mt-2 max-w-md mx-auto">{description}</p>
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 mt-6 h-10 px-5 rounded-full bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f] transition-colors"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
