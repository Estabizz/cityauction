"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { PROPERTY_ACTIONS, propertySignInHref } from "@/lib/property-actions";
import { loadSavedProperties, savedPropertiesSnapshot, SERVER_SAVED_PROPERTIES, setPropertySaved, subscribeSavedProperties } from "./saved-properties-store";

function useSavedProperties() {
  return useSyncExternalStore(subscribeSavedProperties, savedPropertiesSnapshot, () => SERVER_SAVED_PROPERTIES);
}

export function SavedPropertiesNotice() {
  const state = useSavedProperties();
  return state.message ? <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p> : null;
}

export function SaveListingButton({ auctionId, variant = "icon", className = "" }: { auctionId: string; variant?: "icon" | "button"; className?: string }) {
  const router = useRouter();
  const state = useSavedProperties();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const active = useRef(false);
  const saved = state.ids.has(auctionId);
  const busy = checking || state.pending.has(auctionId);

  useEffect(() => {
    void loadSavedProperties();
    const refresh = () => { void loadSavedProperties(true); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  async function onClick(event: React.MouseEvent) {
    event.preventDefault(); event.stopPropagation();
    if (active.current || state.pending.has(auctionId)) return;
    active.current = true; setChecking(true); setError(null); setNotice(null);
    try {
      if (!await loadSavedProperties()) { setError("Couldn't load your saved properties. Please try again."); return; }
      if (savedPropertiesSnapshot().signedIn === false) { window.location.assign(propertySignInHref(auctionId, "save")); return; }
      const result = await setPropertySaved(auctionId, !savedPropertiesSnapshot().ids.has(auctionId));
      if (!result.ok) {
        if (result.status === 401) window.location.assign(propertySignInHref(auctionId, "save"));
        else setError(result.error);
        return;
      }
      setNotice(result.message);
      if (window.location.pathname === "/dashboard/favourites") router.refresh();
    } finally { active.current = false; setChecking(false); }
  }

  const label = saved ? PROPERTY_ACTIONS.remove : PROPERTY_ACTIONS.save;
  return <span className={`inline-flex flex-col items-end gap-1.5 ${className}`}>
    <button type="button" onClick={onClick} disabled={busy} aria-pressed={saved} aria-label={label} title={label}
      className={`inline-flex items-center justify-center gap-2 border text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84663c] disabled:opacity-60 ${variant === "button" ? "min-h-11 rounded-xl px-3.5 py-2.5" : "h-11 w-11 rounded-full shadow-sm"} ${saved ? "border-red-200 bg-red-50 text-red-700" : "border-[#e4e8ec] bg-white text-[#687480] hover:bg-[#f4f6f8]"}`}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />}
      {variant === "button" && <span>{saved ? PROPERTY_ACTIONS.saved : PROPERTY_ACTIONS.save}</span>}
    </button>
    {error && <span role="alert" className="max-w-52 rounded-lg border border-red-200 bg-white px-2.5 py-2 text-left text-xs text-red-700 shadow-sm">{error}</span>}
    {notice && <span role="status" className="max-w-52 rounded-lg border border-emerald-200 bg-white px-2.5 py-2 text-left text-xs text-emerald-800 shadow-sm">{notice} <Link href="/dashboard/favourites" className="font-semibold underline">View saved properties</Link></span>}
  </span>;
}
