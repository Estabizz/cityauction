import { AUCTION_STATUSES, AUCTION_TYPES, POSSESSION_STATUSES, PROPERTY_CATEGORIES } from "./constants";
import { parseAuctionSearchParams } from "./auction-search";

export function auctionSearchHref(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

// Keep deep-linked filters and sort while applying a whole form atomically.
export function applyAuctionFilters(current: string, values: Record<string, string>) {
  const params = new URLSearchParams(current);
  params.delete("type"); params.delete("q"); params.delete("page");
  for (const [key, value] of Object.entries(values)) {
    if (value.trim()) params.set(key, value.trim()); else params.delete(key);
  }
  parseAuctionSearchParams(params);
  return params;
}

export function removeAuctionFilter(current: string, key: string) {
  const params = new URLSearchParams(current);
  params.delete(key); params.delete("page");
  if (key === "auctionType" || key === "type") { params.delete("type"); params.delete("auctionType"); }
  if (key === "keyword" || key === "q") { params.delete("q"); params.delete("keyword"); }
  if (key === "state") { params.delete("city"); params.delete("district"); }
  return params;
}

const titles: Record<string, string> = {
  keyword: "Search", state: "State", city: "City", district: "District", organization: "Bank / institution",
  category: "Property type", subType: "Subtype", auctionType: "Auction type", status: "Status", possession: "Possession",
  minPrice: "Min price", maxPrice: "Max price", minEmd: "Min EMD", maxEmd: "Max EMD",
  dateFrom: "Auction from", dateTo: "Auction to", deadlineBefore: "Apply by",
};
export function auctionFilterLabel(key: string, value: string) {
  const options = key === "category" ? PROPERTY_CATEGORIES : key === "auctionType" ? AUCTION_TYPES :
    key === "status" ? AUCTION_STATUSES : key === "possession" ? POSSESSION_STATUSES : [];
  let label = options.find((option) => option.value === value)?.label ?? value;
  if (["minPrice", "maxPrice", "minEmd", "maxEmd"].includes(key)) label = auctionMoney(value);
  return `${titles[key] ?? key}: ${label}`;
}

export function auctionMoney(value: string | number | null | undefined) {
  if (value == null || value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) return "Not provided";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value));
}

export function auctionDate(value: string, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", hour12: true } as const : {}),
  }).format(date) + (includeTime ? " IST" : "");
}
