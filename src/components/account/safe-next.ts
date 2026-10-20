// Only follow ?next= values that stay on this site ("/dashboard/profile"), never
// "//evil.com", "https://evil.com" or "/\evil.com", which browsers treat as
// another host.
export function safeNextPath(next: unknown): string | null {
  if (typeof next !== "string" || next.length === 0 || next.length > 500) return null;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  if (/[\u0000-\u001f]/.test(next)) return null;
  // Sending someone back to a sign-in page after signing in makes no sense.
  if (/^\/(login|register|set-password|forgot-password)(\/|\?|$)/.test(next)) return null;
  return next;
}
