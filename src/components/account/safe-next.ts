// Only follow ?next= values that stay on this site ("/dashboard/profile"), never
// "//evil.com", "https://evil.com" or "/\evil.com", which browsers treat as
// another host.
export function safeNextPath(next: unknown): string | null {
  if (typeof next !== "string" || next.length === 0 || next.length > 500) return null;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  if (/[\u0000-\u001f]/.test(next)) return null;
  // Normalize dot segments and encoded aliases before checking for auth loops.
  let pathname: string;
  try { pathname = decodeURIComponent(new URL(next, "https://cityauction.invalid").pathname); }
  catch { return null; }
  if (pathname.startsWith("//") || pathname.includes("\\") || /[\u0000-\u001f]/.test(pathname)) return null;
  if (/^\/(login|register|set-password|forgot-password|investor-login|financial-institution-login)(\/|$)/i.test(pathname)) return null;
  if (/^\/buyer\/access(\/|$)/i.test(pathname)) return null;
  return next;
}
