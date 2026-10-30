// First-touch marketing attribution: the first page a visitor landed on, its
// UTM values and referrer. Captured once in a cookie by <AttributionCapture>
// and copied onto the user at sign-up.

export const ATTRIBUTION_COOKIE = "ca_attr";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "landingPage" | "referrer" | "firstSeenAt", string>>;

export function buildAttribution(url: URL, referrer: string): Attribution {
  const attr: Attribution = { landingPage: url.pathname.slice(0, 300), firstSeenAt: new Date().toISOString() };
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) attr[key] = value.slice(0, 150);
  }
  // Only external referrers are useful.
  if (referrer) {
    try {
      if (new URL(referrer).host !== url.host) attr.referrer = referrer.slice(0, 300);
    } catch {}
  }
  return attr;
}

export function parseAttribution(raw: string | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw));
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const clean: Attribution = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "string" && (k === "landingPage" || k === "referrer" || k === "firstSeenAt" || (UTM_KEYS as readonly string[]).includes(k))) {
        clean[k as keyof Attribution] = v.slice(0, 300);
      }
    }
    return clean;
  } catch {
    return null;
  }
}
