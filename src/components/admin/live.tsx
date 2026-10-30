"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { POLL_INTERVAL_MS, PULSE_INTERVAL_MS } from "@/lib/admin/constants";
import type { OverviewData } from "@/lib/admin/overview";

interface LiveState {
  data: OverviewData | null;
  error: string | null;
  lastUpdated: number | null;
  // Server time when this admin session opened (or last pressed "Mark as seen").
  // Anything created after it counts as new.
  baseline: string | null;
  newCount: number;
  // Changes whenever anything the panel shows changes; lists reload on it.
  version: string | null;
  markSeen: () => void;
  refresh: () => void;
}

const LiveContext = createContext<LiveState | null>(null);

export function useLive(): LiveState {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside <LiveProvider>");
  return ctx;
}

// One poller for the whole admin area: the dashboard feed, the sidebar badge
// and the tab title all read from it.
export function LiveProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [baseline, setBaseline] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const versionRef = useRef<string | null>(null);
  const baselineRef = useRef<string | null>(null);
  const inFlight = useRef(false);
  const router = useRouter();

  const poll = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const since = baselineRef.current;
      const res = await fetch(`/api/admin/overview${since ? `?since=${encodeURIComponent(since)}` : ""}`, {
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) throw new Error(body?.error || `Could not refresh (${res.status}).`);
      const next = body.data as OverviewData;
      if (!baselineRef.current) {
        baselineRef.current = next.now;
        setBaseline(next.now);
      }
      setData(next);
      setError(null);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refresh.");
    } finally {
      inFlight.current = false;
    }
  }, [router]);

  // Near-real-time: a tiny fingerprint request every few seconds; the full
  // overview only reloads when it changes (or once a minute regardless).
  const pulse = useCallback(async () => {
    if (document.visibilityState !== "visible") return;
    try {
      const res = await fetch("/api/admin/pulse", { cache: "no-store" });
      if (!res.ok) return;
      const body = await res.json().catch(() => null);
      const next = typeof body?.version === "string" ? body.version : null;
      if (next && next !== versionRef.current) {
        const first = versionRef.current === null;
        versionRef.current = next;
        setVersion(next);
        if (!first) void poll();
      }
    } catch {
      // Offline for a moment; the next tick tries again.
    }
  }, [poll]);

  useEffect(() => {
    const first = setTimeout(() => {
      void poll();
      void pulse();
    }, 0);
    const pulseTimer = setInterval(pulse, PULSE_INTERVAL_MS);
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      void poll();
      void pulse();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(pulseTimer);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [poll, pulse]);

  const markSeen = useCallback(() => {
    if (!data) return;
    baselineRef.current = data.now;
    setBaseline(data.now);
    setData({ ...data, newSince: { signups: 0, leads: 0, subscribers: 0, total: 0 } });
  }, [data]);

  // The first answer has no `since`, so newSince is null until the second poll.
  const newCount = data?.newSince?.total ?? 0;
  useTabTitleCount(newCount);

  return (
    <LiveContext.Provider value={{ data, error, lastUpdated, baseline, newCount, version, markSeen, refresh: poll }}>
      {children}
    </LiveContext.Provider>
  );
}

// "(3) Leads · CityAuction Admin" while there are unseen arrivals. Next.js
// rewrites the title on navigation, so re-apply whenever it changes.
function useTabTitleCount(count: number) {
  const pathname = usePathname();
  useEffect(() => {
    const apply = () => {
      const base = document.title.replace(/^\(\d+\+?\)\s*/, "");
      const next = count > 0 ? `(${count > 99 ? "99+" : count}) ${base}` : base;
      if (document.title !== next) document.title = next;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      document.title = document.title.replace(/^\(\d+\+?\)\s*/, "");
    };
  }, [count, pathname]);
}
