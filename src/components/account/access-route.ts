import { safeNextPath } from "./safe-next";

export type AccountView = "login" | "register" | "callback";

export function accountView(value: unknown, fallback: AccountView = "login"): AccountView {
  return value === "login" || value === "register" || value === "callback" ? value : fallback;
}

// All account entry points share one page, including safe return-to-listing links.
export function accountAccessHref(view: AccountView = "login", next?: unknown) {
  const query = new URLSearchParams();
  if (view !== "login") query.set("view", view);
  const destination = safeNextPath(next);
  if (destination) query.set("next", destination);
  return `/login${query.size ? `?${query}` : ""}`;
}
