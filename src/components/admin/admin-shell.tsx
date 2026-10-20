"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Gavel,
  Globe2,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  UserCheck,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { LiveProvider, useLive } from "./live";

type BadgeKey = "all" | "leads" | "signups" | "subscribers";

const SECTIONS: { heading: string; links: { href: string; label: string; icon: typeof Inbox; badge?: BadgeKey }[] }[] = [
  {
    heading: "Visitors",
    links: [
      { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, badge: "all" },
      { href: "/admin/leads", label: "Leads & enquiries", icon: Inbox, badge: "leads" },
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail, badge: "subscribers" },
      { href: "/admin/users", label: "Users & sign-ups", icon: Users, badge: "signups" },
    ],
  },
  {
    heading: "Site",
    links: [
      { href: "/admin/site", label: "Live pages", icon: Globe2 },
      { href: "/admin/audit-logs", label: "Audit log", icon: ShieldCheck },
    ],
  },
  {
    heading: "Marketplace (not live yet)",
    links: [
      { href: "/admin/auctions", label: "Auctions", icon: Gavel },
      { href: "/admin/properties", label: "Properties", icon: Building },
      { href: "/admin/kyc", label: "Bidder KYC", icon: UserCheck },
      { href: "/admin/participants", label: "Participants", icon: UsersRound },
    ],
  },
];

export interface ShellAdmin {
  name: string;
  email: string;
  roleLabel: string;
}

export function AdminShell({ admin, children }: { admin: ShellAdmin; children: ReactNode }) {
  return (
    <LiveProvider>
      <ShellFrame admin={admin}>{children}</ShellFrame>
    </LiveProvider>
  );
}

function ShellFrame({ admin, children }: { admin: ShellAdmin; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const live = useLive();

  const badgeCount = (key?: BadgeKey) => {
    const s = live.data?.newSince;
    if (!key || !s) return 0;
    return key === "all" ? s.total : s[key];
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  };

  const initials =
    admin.name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f5] md:flex-row">
      {/* Phone header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-[#091118] px-4 py-3 text-white md:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-serif-heading text-xl font-semibold">CityAuction</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b49361]">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          {live.newCount > 0 && (
            <Link href="/admin/dashboard" className="rounded-full bg-[#b49361] px-2 py-0.5 text-[11px] font-bold text-[#091118]">
              {live.newCount} new
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="cursor-pointer rounded-lg p-1.5 hover:bg-white/10"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-20 bg-[#091118]/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 z-30 flex h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto bg-[#091118] text-white transition-transform duration-200 md:sticky ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/admin/dashboard" className="block">
              <span className="font-serif-heading block text-2xl font-semibold leading-none">CityAuction</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b49361]">Admin panel</span>
            </Link>
          </div>

          <div className="mx-3 my-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b49361] text-xs font-bold text-[#091118]">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold">{admin.name}</span>
              <span className="block truncate text-[10px] text-[#d9c39c]">{admin.roleLabel}</span>
            </div>
          </div>

          <nav className="space-y-4 px-3 pb-4">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">{section.heading}</p>
                <div className="space-y-0.5">
                  {section.links.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const count = badgeCount(item.badge);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                          active ? "bg-[#b49361] text-[#091118]" : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {count > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              active ? "bg-[#091118] text-[#d9c39c]" : "bg-[#b49361] text-[#091118]"
                            }`}
                          >
                            {count > 99 ? "99+" : count} new
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-2 border-t border-white/10 p-4">
          <div className="flex items-center gap-2 px-1 text-[11px] text-white/50">
            <span className={`h-2 w-2 rounded-full ${live.error ? "bg-red-400" : live.data ? "animate-pulse bg-emerald-400" : "bg-white/30"}`} />
            {live.error ? "Live updates paused" : live.data ? "Live · refreshes every 15 s" : "Connecting…"}
          </div>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
