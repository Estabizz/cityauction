"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import { LogoutButton } from "./logout-button";

export type HeaderSession = { fullName: string; email: string; isAdmin: boolean };

// Reads the session from /api/auth/me (the cookie is httpOnly, so the browser
// can't read it directly). null = signed out, undefined = still checking.
export function useHeaderSession() {
  const [session, setSession] = useState<HeaderSession | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setSession(
          data?.success && data.user
            ? { fullName: data.user.fullName, email: data.user.email, isAdmin: !!data.isAdmin }
            : null
        );
      })
      .catch(() => !cancelled && setSession(null));
    return () => {
      cancelled = true;
    };
  }, []);

  return session;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}

export function AccountMenu({ session }: { session: HeaderSession }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstName = session.fullName.split(/\s+/)[0];
  const itemClass = "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#182129] hover:bg-[#f6f2ea] hover:text-[#84663c] transition-colors";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${session.fullName}`}
        className="inline-flex items-center gap-2 h-10 pl-1 pr-1 md:pr-3 rounded-full border border-[#dcd5ca] bg-white text-xs font-semibold text-gray-800 hover:border-[#b49361] transition-colors shadow-sm cursor-pointer"
      >
        <span className="w-8 h-8 rounded-full bg-[#091118] text-[#d9c39c] flex items-center justify-center text-[11px] font-bold shrink-0">
          {initialsOf(session.fullName)}
        </span>
        <span className="hidden md:inline max-w-[7rem] truncate">{firstName}</span>
        <ChevronDown className="hidden md:block h-3.5 w-3.5 opacity-60" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-64 max-w-[calc(100vw-32px)] bg-white border border-[#e6dfd4] rounded-xl shadow-lg p-1.5 z-[60] animate-fadeIn"
        >
          <div className="px-3 py-2.5 border-b border-[#efe9df] mb-1">
            <p className="text-sm font-semibold text-[#182129] truncate">{session.fullName}</p>
            <p className="text-xs text-[#7e868b] truncate">{session.email}</p>
          </div>
          <Link role="menuitem" href="/dashboard" className={itemClass} onClick={() => setOpen(false)}>
            <LayoutDashboard className="h-4 w-4 text-[#84663c]" /> Dashboard
          </Link>
          <Link role="menuitem" href="/dashboard/profile" className={itemClass} onClick={() => setOpen(false)}>
            <UserRound className="h-4 w-4 text-[#84663c]" /> My profile
          </Link>
          {session.isAdmin && (
            <Link role="menuitem" href="/admin/dashboard" className={itemClass} onClick={() => setOpen(false)}>
              <ShieldCheck className="h-4 w-4 text-[#84663c]" /> Admin panel
            </Link>
          )}
          <div className="my-1 border-t border-[#efe9df]" />
          <LogoutButton className={`${itemClass} w-full cursor-pointer disabled:opacity-60 [&>svg]:text-[#84663c]`} />
        </div>
      )}
    </div>
  );
}
