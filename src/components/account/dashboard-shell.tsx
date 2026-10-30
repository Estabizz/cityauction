"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  ShieldCheck,
  Target,
  User,
  X,
} from "lucide-react";
import { activateDialog } from "@/lib/dialog-focus";
import { AccountMenu } from "./account-menu";
import { LogoutButton } from "./logout-button";

// Bidding, EMD payments and KYC uploads are left out on purpose: bidding happens
// on the official auction platform, not through a CityAuction account.
const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/favourites", label: "Saved properties", icon: Heart },
  { href: "/dashboard/requests", label: "My enquiries", icon: ListChecks },
  { href: "/dashboard/matches", label: "Matching opportunities", icon: Target },
];

export function DashboardShell({
  name,
  email,
  initials,
  admin,
  children,
}: {
  name: string;
  email: string;
  initials: string;
  admin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const account = { fullName: name, email, isAdmin: admin };
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open || !panel.current) return;
    const cleanup = activateDialog(panel.current, () => setOpen(false));
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => { cleanup(); desktop.removeEventListener("change", onResize); };
  }, [open]);

  // Close the phone menu after navigating.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#182129] flex flex-col md:flex-row">
      {/* Phone / tablet top bar */}
      <div aria-hidden="true" className="h-14 shrink-0 md:hidden" />
      <div className="md:hidden bg-white border-b border-[#e4e8ec] px-4 h-14 flex items-center justify-between fixed inset-x-0 top-0 z-40">
        <Link href="/" aria-label="CityAuction home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
        <AccountMenu session={account} onOpen={() => setOpen(false)} />
        <button
          ref={menuButton}
          type="button"
          aria-controls="dashboard-navigation"
          onClick={() => setOpen((o) => !o)}
          className="w-11 h-11 rounded-xl border border-[#dcd5ca] bg-white flex items-center justify-center cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {open && <div className="md:hidden fixed inset-0 top-14 z-20 bg-black/30" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        id="dashboard-navigation"
        ref={panel}
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label="Account navigation"
        tabIndex={open ? -1 : undefined}
        className={`fixed top-14 md:top-0 left-0 z-30 h-[calc(100dvh-3.5rem)] md:h-dvh w-64 bg-white border-r border-[#e4e8ec] overflow-y-auto overscroll-contain flex-col shrink-0 ${open ? "flex" : "hidden md:flex"}`}
      >
        <button type="button" onClick={() => setOpen(false)} aria-label="Close account navigation" className="md:hidden m-2 ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-[#f4f6f8]"><X className="h-5 w-5" /></button>
        <div className="hidden md:flex p-5 border-b border-[#efe9df] flex-col gap-1">
          <Link href="/" aria-label="CityAuction home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} className="h-9 w-auto" />
          </Link>
          <span className="text-[10px] text-[#7e868b] uppercase tracking-[0.14em]">My Account</span>
        </div>

        <div className="mx-3 my-3 p-3 rounded-xl bg-[#091118] text-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#b49361] text-[#091118] font-bold flex items-center justify-center text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-semibold truncate">{name}</span>
            <span className="block text-[11px] text-[#aeb9c1] truncate">{email}</span>
          </div>
        </div>

        <nav className="min-h-0 px-3 space-y-0.5 flex-1 overflow-y-auto" aria-label="Account">
          {admin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold bg-[#f5edd3] text-[#5e4a2b] hover:bg-[#eee1bd]"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Admin dashboard</span>
            </Link>
          )}
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/dashboard/matches" && pathname.startsWith("/dashboard/requirements"));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                  active ? "bg-[#f5edd3] text-[#5e4a2b]" : "text-[#4a555d] hover:text-[#84663c] hover:bg-[#fbf9f5]"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#84663c]" : ""}`} />
                <span>{label}</span>
              </Link>
            );
          })}

        </nav>

        <div className="shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#efe9df] space-y-2">
          <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#687480] hover:bg-[#f4f6f8]"><User className="h-4 w-4" />My profile</Link>
          <Link
            href="/auctions"
            className="w-full flex items-center justify-center gap-2 min-h-11 py-2.5 px-3 rounded-xl bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Explore auctions</span>
          </Link>
          <LogoutButton className="w-full flex items-center justify-center gap-2 min-h-11 py-2.5 px-3 rounded-xl text-[#4a555d] hover:text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60" />
        </div>
      </aside>

      <main className="flex-1 min-w-0 md:ml-64">
        <div className="sticky top-0 z-40 hidden h-[76px] items-center justify-end border-b border-[#e4e8ec] bg-white px-6 md:flex lg:px-8">
          <AccountMenu session={account} />
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
