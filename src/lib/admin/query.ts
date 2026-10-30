import type { Prisma } from "@prisma/client";
import { ENQUIRY_STATUSES, PAGE_SIZE, SUBSCRIBER_STATUSES } from "./constants";
import { dateRangeFilter } from "./time";

export function pageParams(params: URLSearchParams) {
  const page = Math.max(1, Math.floor(Number(params.get("page")) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(params.get("pageSize")) || PAGE_SIZE)));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

function search(params: URLSearchParams): string | undefined {
  const q = params.get("q")?.trim();
  return q ? q.slice(0, 100) : undefined;
}

// Filters shared by the leads list and its CSV export.
// MySQL's default collation already makes `contains` case-insensitive.
export function leadWhere(params: URLSearchParams): Prisma.EnquiryWhereInput {
  const where: Prisma.EnquiryWhereInput = {};
  const q = search(params);
  if (q) {
    where.OR = [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }];
  }
  const source = params.get("source");
  if (source) where.source = source;
  const status = params.get("status");
  if (status && (ENQUIRY_STATUSES as readonly string[]).includes(status)) {
    where.status = status as (typeof ENQUIRY_STATUSES)[number];
  }
  const createdAt = dateRangeFilter(params.get("from"), params.get("to"));
  if (createdAt) where.createdAt = createdAt;
  return where;
}

export function subscriberWhere(params: URLSearchParams): Prisma.SubscriberWhereInput {
  const where: Prisma.SubscriberWhereInput = {};
  const q = search(params);
  if (q) where.OR = [{ email: { contains: q } }, { name: { contains: q } }];
  const status = params.get("status");
  if (status && (SUBSCRIBER_STATUSES as readonly string[]).includes(status)) {
    where.status = status as (typeof SUBSCRIBER_STATUSES)[number];
  }
  const source = params.get("source");
  if (source) where.source = source;
  return where;
}

export function userWhere(params: URLSearchParams): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = { deletedAt: null };
  const q = search(params);
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { city: { contains: q } },
    ];
  }
  const active = params.get("active");
  if (active === "true") where.isActive = true;
  if (active === "false") where.isActive = false;
  const role = params.get("role");
  if (role === "admins") where.roles = { some: { role: { name: { in: ["ADMIN", "SUPER_ADMIN"] } } } };
  return where;
}
