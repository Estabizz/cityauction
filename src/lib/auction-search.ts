import { z } from "zod";
import type { AuctionFilters } from "@/types";

const text = z.string().trim().max(160).optional();
const money = z.number().finite().min(0).max(999_999_999_999_999).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date (YYYY-MM-DD).")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Use a valid calendar date.").optional();

export const auctionFilterSchema = z.object({
  state: text, city: text, district: text, organization: text, keyword: text,
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "LAND", "OTHER"]).optional(),
  subType: text,
  auctionType: z.enum(["SARFAESI", "DRT", "NPA", "FORWARD", "OTHER"]).optional(),
  status: z.enum(["UPCOMING", "LIVE", "CLOSING_SOON", "CLOSED", "CANCELLED", "SOLD"]).optional(),
  possession: z.enum(["PHYSICAL", "SYMBOLIC", "NOT_IN_POSSESSION"]).optional(),
  minPrice: money, maxPrice: money, minEmd: money, maxEmd: money,
  dateFrom: date, dateTo: date, deadlineBefore: date,
  sort: z.enum(["date_asc", "price_asc", "price_desc", "newest", "closing_soon"]).default("date_asc"),
  page: z.number().int().min(1).max(100_000).default(1),
  limit: z.number().int().min(1).max(50).default(12),
}).superRefine((v, ctx) => {
  if (v.minPrice != null && v.maxPrice != null && v.minPrice > v.maxPrice)
    ctx.addIssue({ code: "custom", message: "Minimum price cannot exceed maximum price.", path: ["maxPrice"] });
  if (v.minEmd != null && v.maxEmd != null && v.minEmd > v.maxEmd)
    ctx.addIssue({ code: "custom", message: "Minimum EMD cannot exceed maximum EMD.", path: ["maxEmd"] });
  if (v.dateFrom && v.dateTo && v.dateFrom > v.dateTo)
    ctx.addIssue({ code: "custom", message: "Start date cannot follow end date.", path: ["dateTo"] });
});

export type ValidAuctionFilters = z.infer<typeof auctionFilterSchema>;

// One parser for the HTML search and JSON API, including older link aliases.
export function parseAuctionSearchParams(params: URLSearchParams): ValidAuctionFilters {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of params) if (value.trim()) raw[key] = value.trim();
  raw.auctionType = raw.type || raw.auctionType;
  raw.keyword = raw.keyword || raw.q;
  for (const key of ["category", "auctionType", "status", "possession"]) {
    if (typeof raw[key] === "string") raw[key] = raw[key].toUpperCase();
  }
  for (const key of ["minPrice", "maxPrice", "minEmd", "maxEmd", "page", "limit"]) {
    if (raw[key] !== undefined) raw[key] = Number(raw[key]);
  }
  return auctionFilterSchema.parse(raw);
}

export function validateAuctionFilters(filters: AuctionFilters): ValidAuctionFilters {
  return auctionFilterSchema.parse(filters);
}
