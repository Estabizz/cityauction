"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import { LogoutButton } from "./logout-button";

import type { HeaderSession } from "./session-provider";
export { useHeaderSession } from "./session-provider";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}

export function AccountMenu({ session, onOpen }: { session: HeaderSession; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstName = session.fullName.split(/\s+/)[0];
  const itemClass = "flex min-h-11 items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#182129] hover:bg-[#f4f6f8] transition-colors focus-visible:outline-2 focus-visible:outline-[#84663c]";

  return (
    <div className="relative" ref={ref} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { if (!open) onOpen?.(); setOpen((value) => !value); }}
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={`Account menu for ${session.fullName}`}
        className="inline-flex items-center gap-2 h-11 min-w-11 pl-1 pr-1 md:pr-3 rounded-xl border border-[#e4e8ec] bg-white text-xs font-semibold text-[#182129] hover:bg-[#f4f6f8] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]"
      >
        <span className="w-8 h-8 rounded-full bg-[#091118] text-[#d9c39c] flex items-center justify-center text-[11px] font-bold shrink-0">
          {initialsOf(session.fullName)}
        </span>
        <span className="hidden md:inline max-w-[7rem] truncate">{firstName}</span>
        <ChevronDown className="hidden md:block h-3.5 w-3.5 opacity-60" />
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label="Your account"
          className="absolute right-0 top-[calc(100%+12px)] w-64 max-w-[calc(100vw-32px)] max-h-[calc(100dvh-100px)] overflow-y-auto overscroll-contain bg-white border border-[#e4e8ec] rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 z-[60]"
        >
          <div className="px-3 py-2.5 border-b border-[#efe9df] mb-1">
            <p className="text-sm font-semibold text-[#182129] truncate">{session.fullName}</p>
            <p className="text-xs text-[#7e868b] truncate">{session.email}</p>
          </div>
          <Link href="/dashboard" className={itemClass} onClick={() => setOpen(false)}>
            <LayoutDashboard className="h-4 w-4 text-[#84663c]" /> Dashboard
          </Link>
          <Link href="/dashboard/favourites" className={itemClass} onClick={() => setOpen(false)}>
            <Heart className="h-4 w-4 text-[#84663c]" /> Saved properties
          </Link>
          <Link href="/dashboard/profile" className={itemClass} onClick={() => setOpen(false)}>
            <UserRound className="h-4 w-4 text-[#84663c]" /> My profile
          </Link>
          {session.isAdmin && (
            <Link href="/admin/dashboard" className={itemClass} onClick={() => setOpen(false)}>
              <ShieldCheck className="h-4 w-4 text-[#84663c]" /> Admin panel
            </Link>
          )}
          <div className="my-1 border-t border-[#efe9df]" />
          <LogoutButton className={`${itemClass} w-full cursor-pointer disabled:opacity-60 [&>svg]:text-[#84663c]`} />
        </nav>
      )}
    </div>
  );
}
