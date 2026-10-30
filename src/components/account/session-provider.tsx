"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type HeaderSession = { fullName: string; email: string; isAdmin: boolean };
const SessionContext = createContext<HeaderSession | null | undefined>(undefined);

// One account state drives all public navigation. Recheck when returning from
// another tab or browser history, where a login/logout may have happened.
export function PublicSessionProvider({ initialSession, children }: { initialSession: HeaderSession | null; children: React.ReactNode }) {
  const [session, setSession] = useState(initialSession);
  useEffect(() => {
    let controller: AbortController | undefined;
    async function refresh() {
      if (document.visibilityState === "hidden") return;
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", signal: current.signal });
        if (current.signal.aborted) return;
        if (response.status === 401) { setSession(null); return; }
        if (!response.ok) return;
        const data = await response.json();
        if (!current.signal.aborted && data.success && data.user) {
          setSession({ fullName: data.user.fullName, email: data.user.email || "", isAdmin: !!data.isAdmin });
        }
      } catch { /* Preserve navigation state during transient network failures. */ }
    }
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) void refresh(); };
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller?.abort();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useHeaderSession() { return useContext(SessionContext); }
