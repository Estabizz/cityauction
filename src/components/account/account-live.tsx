"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const INTERVAL_MS = 8000;

// Keeps the buyer dashboard current: when the team updates a request (or the
// buyer changes something in another tab), the page data refreshes in place.
// Renders nothing; form inputs keep their state across the refresh.
export function AccountLive() {
  const router = useRouter();
  const version = useRef<string | null>(null);

  useEffect(() => {
    let stopped = false;
    async function check() {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/user/pulse", { cache: "no-store" });
        if (res.status === 401) {
          // Signed out elsewhere ("log out everywhere"); the refresh sends them to sign in.
          router.refresh();
          return;
        }
        const body = await res.json().catch(() => null);
        const next = typeof body?.version === "string" ? body.version : null;
        if (!next) return;
        if (version.current && next !== version.current) router.refresh();
        version.current = next;
      } catch {
        // Offline for a moment; try again next tick.
      }
    }
    void check();
    const timer = setInterval(check, INTERVAL_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [router]);

  return null;
}
