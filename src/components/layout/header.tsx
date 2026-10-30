"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown, Menu, X } from "lucide-react";
import { AccountMenu, useHeaderSession } from "@/components/account/account-menu";
import { accountAccessHref } from "@/components/account/access-route";
import { LogoutButton } from "@/components/account/logout-button";

const primaryLinks = [
  { href: "/auctions", label: "Auctions" },
  { href: "/locations", label: "Locations" },
  { href: "/how-it-works", label: "How it works" },
];
const serviceLinks = [
  { href: "/investor-desk", label: "Investor desk", detail: "Due diligence and buyer support" },
  { href: "/auction-alerts", label: "Auction alerts", detail: "Opportunities matched to your interests" },
  { href: "/liquidate-an-asset", label: "Liquidate an asset", detail: "Support for asset owners and sellers" },
  { href: "/institutional-services", label: "Institutional services", detail: "Solutions for banks and organisations" },
  { href: "/customs-auction", label: "Customs auctions", detail: "Explore customs auction opportunities" },
  { href: "/next-chapter", label: "Next Chapter", detail: "Company and project capital opportunities" },
];
const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]";
const navClass = `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#f4f6f8] hover:text-[#182129] ${focusClass}`;
const primaryClass = `inline-flex h-11 items-center justify-center rounded-xl bg-[#132330] px-4 text-sm font-semibold text-white transition hover:bg-[#253b4b] ${focusClass}`;

function Brand() {
  return <Link href="/" aria-label="CityAuction home" className={`shrink-0 rounded ${focusClass}`}><Image src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} priority className="h-7 w-auto sm:h-8" /></Link>;
}

// Keep account pages focused on verification rather than repeating account actions.
export function AccountHeader() {
  return <><div aria-hidden="true" className="h-[76px] shrink-0" /><header className="fixed inset-x-0 top-0 z-50 border-b border-[#e8ecef] bg-white"><div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"><Brand /><nav aria-label="Account page navigation" className="flex items-center gap-5"><Link href="/contact" className={`hidden text-sm text-[#687480] hover:text-[#182129] sm:block ${focusClass}`}>Need help?</Link><Link href="/auctions" className={`inline-flex items-center gap-2 whitespace-nowrap min-h-11 text-xs font-medium text-[#687480] hover:text-[#182129] sm:text-sm ${focusClass}`}><ArrowLeft className="h-3.5 w-3.5" />Back to auctions</Link></nav></div></header></>;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const serviceButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const session = useHeaderSession();
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname); setMobileOpen(false); setServicesOpen(false);
  }
  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setServicesOpen(false);
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMobileOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (servicesOpen) { setServicesOpen(false); serviceButton.current?.focus(); }
      if (mobileOpen) { setMobileOpen(false); mobileButton.current?.focus(); }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [servicesOpen, mobileOpen]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const next = pathname === "/" ? undefined : pathname;
  const loginHref = accountAccessHref("login", next);
  const registerHref = accountAccessHref("register", next);
  const close = () => { setMobileOpen(false); setServicesOpen(false); };
  const servicesActive = serviceLinks.some(({ href }) => active(href));

  return (
    <>
    <div aria-hidden="true" className="h-[76px] shrink-0" />
    <header ref={headerRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMobileOpen(false); }} className="fixed inset-x-0 top-0 z-50 border-b border-[#e4e8ec] bg-white/95 text-[#182129] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Brand />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map(({ href, label }) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`${navClass} ${active(href) ? "bg-[#f4f6f8] text-[#182129]" : "text-[#687480]"}`}>{label}</Link>)}
          <div className="relative" ref={dropdownRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setServicesOpen(false); }}>
            <button ref={serviceButton} type="button" aria-expanded={servicesOpen} aria-controls="header-services" onClick={() => setServicesOpen(!servicesOpen)} className={`${navClass} inline-flex items-center gap-1.5 ${servicesActive || servicesOpen ? "bg-[#f4f6f8] text-[#182129]" : "text-[#687480]"}`}>Services<ChevronDown className={`h-3.5 w-3.5 transition ${servicesOpen ? "rotate-180" : ""}`} /></button>
            {servicesOpen && <div id="header-services" className="absolute left-1/2 top-[calc(100%+12px)] w-[360px] max-h-[calc(100dvh-100px)] overflow-y-auto overscroll-contain -translate-x-1/2 rounded-2xl border border-[#e4e8ec] bg-white p-2 shadow-xl shadow-slate-900/10">
              {serviceLinks.map(({ href, label, detail }) => <Link key={href} href={href} onClick={close} aria-current={active(href) ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 hover:bg-[#f4f6f8] ${focusClass}`}><span className="block text-sm font-medium">{label}</span><span className="mt-0.5 block text-xs text-[#7a8590]">{detail}</span></Link>)}
              <div className="mt-2 flex gap-5 border-t border-[#edf0f3] px-3 pb-1 pt-3 text-xs text-[#687480]"><Link href="/about" onClick={close} className={focusClass}>About us</Link><Link href="/contact" onClick={close} className={focusClass}>Contact</Link></div>
            </div>}
          </div>
          <Link href="/contact" aria-current={active("/contact") ? "page" : undefined} className={`${navClass} hidden xl:block ${active("/contact") ? "bg-[#f4f6f8]" : "text-[#687480]"}`}>Contact</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {session === undefined ? <div role="status" aria-label="Checking account" className="h-10 w-20 animate-pulse rounded-xl bg-[#f1f4f6] motion-reduce:animate-none" /> : session ? <AccountMenu session={session} onOpen={() => setMobileOpen(false)} /> : <><Link href={loginHref} className={`inline-flex h-11 items-center rounded-xl px-2 text-sm font-medium text-[#687480] hover:text-[#182129] sm:px-3 ${focusClass}`}>Sign in</Link><Link href={registerHref} className={`${primaryClass} hidden sm:inline-flex`}>Create account</Link></>}
          <button ref={mobileButton} type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#e4e8ec] hover:bg-[#f4f6f8] lg:hidden ${focusClass}`}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-76px)] overflow-y-auto overscroll-contain border-t border-[#edf0f3] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        {session && <div className="mb-3 rounded-xl bg-[#f4f6f8] p-4"><p className="truncate text-sm font-semibold">{session.fullName}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm"><Link href="/dashboard" onClick={close} className={focusClass}>My dashboard</Link><Link href="/dashboard/favourites" onClick={close} className={focusClass}>Saved properties</Link><Link href="/dashboard/profile" onClick={close} className={focusClass}>My profile</Link>{session.isAdmin && <Link href="/admin/dashboard" onClick={close} className={focusClass}>Admin dashboard</Link>}</div></div>}
        {primaryLinks.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={active(href) ? "page" : undefined} className={`block ${navClass} ${active(href) ? "bg-[#f4f6f8]" : "text-[#687480]"}`}>{label}</Link>)}
        <details className="my-1 rounded-xl"><summary className={`cursor-pointer px-3 py-2.5 text-sm font-medium text-[#687480] ${focusClass}`}>Services</summary><div className="ml-3 border-l border-[#e4e8ec] pl-2">{serviceLinks.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={active(href) ? "page" : undefined} className={`block ${navClass} ${active(href) ? "bg-[#f4f6f8]" : "text-[#687480]"}`}>{label}</Link>)}</div></details>
        <div className="mt-3 flex gap-5 border-t border-[#edf0f3] px-3 pt-4 text-sm text-[#687480]"><Link href="/about" onClick={close} className={focusClass}>About us</Link><Link href="/contact" onClick={close} className={focusClass}>Contact</Link></div>
        {session === null ? <div className="mt-5 grid grid-cols-2 gap-3"><Link href={loginHref} onClick={close} className={`flex h-11 items-center justify-center rounded-xl border border-[#dce1e6] text-sm font-semibold ${focusClass}`}>Sign in</Link><Link href={registerHref} onClick={close} className={`${primaryClass} h-11`}>Create account</Link></div> : session ? <LogoutButton className={`mt-5 flex items-center gap-2 px-3 py-2 text-sm text-[#687480] ${focusClass}`} /> : null}
      </nav>}
    </header>
    </>
  );
}
