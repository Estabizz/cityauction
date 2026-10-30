// Small in-memory limiter for public forms (per server process). Good enough to
// slow down scripted spam; durable limits (OTP) live in the database instead.

const buckets = new Map<string, number[]>();

export function tooManyRequests(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  // Keep the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return false;
}
