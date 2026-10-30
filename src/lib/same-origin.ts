export function isSameOriginRequest(req: Request) {
  try {
    const origin = new URL(req.headers.get("origin") || "");
    return ["http:", "https:"].includes(origin.protocol) && origin.origin === new URL(req.url).origin;
  } catch { return false; }
}
