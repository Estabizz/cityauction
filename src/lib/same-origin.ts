export function isSameOriginRequest(req: Request) {
  try {
    const rawOrigin = req.headers.get("origin") || "";
    const origin = new URL(rawOrigin);

    if (
      !["http:", "https:"].includes(origin.protocol) ||
      rawOrigin !== origin.origin
    ) {
      return false;
    }

    const production = process.env.NODE_ENV === "production";
    const configured =
      process.env.NEXT_PUBLIC_APP_URL ||
      (production ? "https://cityauction.in" : "");

    if (configured) {
      const site = new URL(configured);

      if (
        site.username ||
        site.password ||
        !["http:", "https:"].includes(site.protocol)
      ) {
        return false;
      }

      if (production && site.protocol !== "https:") return false;
      if (origin.origin === site.origin) return true;
    }

    return !production && origin.origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}
