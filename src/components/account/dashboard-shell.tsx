"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  FileCheck,
  FolderLock,
  Gavel,
  Heart,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { LogoutButton } from "./logout-button";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/favourites", label: "Saved Properties", icon: Heart },
  { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Search },
  { href: "/dashboard/bids", label: "My Bids", icon: Gavel },
  { href: "/dashboard/applications", label: "Auction Applications", icon: FileCheck },
  { href: "/dashboard/payments", label: "Payments & EMD", icon: CreditCard },
  { href: "/dashboard/documents", label: "KYC & Documents", icon: FolderLock },
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
  const [open, setOpen] = useState(false);

  // Close the phone menu after navigating.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#182129] flex flex-col md:flex-row">
      {/* Phone / tablet top bar */}
      <div className="md:hidden bg-white border-b border-[#e6dfd4] px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" aria-label="CityAuction home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cityauction-logo.png" alt="CityAuction" width={900} height={213} className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-10 h-10 rounded-full border border-[#dcd5ca] bg-white flex items-center justify-center cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && <div className="md:hidden fixed inset-0 top-14 z-20 bg-black/30" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={`fixed md:sticky top-14 md:top-0 z-30 h-[calc(100vh-3.5rem)] md:h-screen w-64 bg-white border-r border-[#e6dfd4] flex flex-col shrink-0 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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

        <nav className="px-3 space-y-0.5 flex-1 overflow-y-auto" aria-label="Account">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
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
          {admin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#84663c] hover:bg-[#fbf9f5]"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Admin panel</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-[#efe9df] space-y-2">
          <Link
            href="/auctions"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Explore auctions</span>
          </Link>
          <LogoutButton className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-[#4a555d] hover:text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60" />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
