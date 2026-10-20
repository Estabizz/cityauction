"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Filters live in the address bar, so a filtered view can be bookmarked or
// shared and the back button works. Changing any filter returns to page 1.
export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!("page" in updates)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const get = useCallback((key: string) => params.get(key) ?? "", [params]);
  return { params, get, set };
}

function loginUrl() {
  return `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

export function useAdminJson<T>(url: string | null) {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({
    data: null,
    error: null,
    loading: !!url,
  });
  const [nonce, setNonce] = useState(0);
  const router = useRouter();
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        // Session expired or admin access removed.
        if (res.status === 401 || res.status === 403) return router.replace(loginUrl());
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) throw new Error(body?.error || `Request failed (${res.status}).`);
        setState({ data: body as T, error: null, loading: false });
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setState((s) => ({ ...s, error: err.message, loading: false }));
      });
    return () => controller.abort();
  }, [url, nonce, router]);

  // `loading` stays true only until the first answer; later reloads keep the
  // old rows on screen instead of flashing a spinner.
  return { ...state, loading: state.loading && !state.data && !state.error, reload };
}

export async function sendJson<T = unknown>(url: string, method: "POST" | "PATCH", body: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // A 403 here is usually a rule ("only a super admin can…"), so it is shown, not redirected.
  if (res.status === 401) throw new Error("Your session has ended. Please sign in again.");
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error(json?.error || `Request failed (${res.status}).`);
  return json.data as T;
}

export { fmtDate, fmtDateTime, timeAgo } from "@/lib/admin/format";
