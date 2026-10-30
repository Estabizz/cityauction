"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE, buildAttribution } from "@/lib/attribution";

// Remembers where a visitor first came from (first touch only), so it can be
// saved on their account if they sign up. Renders nothing.
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (document.cookie.split("; ").some((c) => c.startsWith(`${ATTRIBUTION_COOKIE}=`))) return;
      const value = encodeURIComponent(JSON.stringify(buildAttribution(new URL(window.location.href), document.referrer)));
      document.cookie = `${ATTRIBUTION_COOKIE}=${value}; path=/; max-age=${90 * 24 * 60 * 60}; samesite=lax`;
    } catch {}
  }, []);
  return null;
}
