import type { Prisma } from "@prisma/client";
import type { ValidAuctionFilters } from "./auction-search";
import { publicAuctionWhere } from "./public-auctions";

const STATE_CODES: Record<string, string> = {
  "andaman and nicobar islands": "AN", "andhra pradesh": "AP", "arunachal pradesh": "AR",
  assam: "AS", bihar: "BR", chandigarh: "CH", chhattisgarh: "CG",
  "dadra and nagar haveli and daman and diu": "DH", delhi: "DL", goa: "GA", gujarat: "GJ",
  haryana: "HR", "himachal pradesh": "HP", "jammu and kashmir": "JK", jharkhand: "JH",
  karnataka: "KA", kerala: "KL", ladakh: "LA", lakshadweep: "LD", "madhya pradesh": "MP",
  maharashtra: "MH", manipur: "MN", meghalaya: "ML", mizoram: "MZ", nagaland: "NL",
  odisha: "OD", puducherry: "PY", punjab: "PB", rajasthan: "RJ", sikkim: "SK",
  "tamil nadu": "TN", telangana: "TS", tripura: "TR", "uttar pradesh": "UP",
  uttarakhand: "UK", "west bengal": "WB",
};

// A property's location may be a locality, city, district or state. Follow the
// hierarchy as well as the denormalized stateCode used by the current importer.
export function locationWithin(match: Prisma.LocationWhereInput): Prisma.LocationWhereInput {
  return { OR: [match, { parent: match }, { parent: { parent: match } }, { parent: { parent: { parent: match } } }] };
}

export function auctionWhere(filters: ValidAuctionFilters, now = new Date()): Prisma.AuctionWhereInput {
  const and: Prisma.AuctionWhereInput[] = [publicAuctionWhere(now)];
  // Ending soon excludes historical and cancelled notices rather than sorting
  // already-ended auctions to the top of an actionable search.
  if (filters.sort === "closing_soon") and.push({
    endDateTime: { gt: now }, status: { in: ["UPCOMING", "LIVE", "CLOSING_SOON"] },
  });
  if (filters.status) and.push({ status: filters.status });
  if (filters.auctionType) and.push({ type: filters.auctionType });
  if (filters.category) and.push({ property: { category: { type: filters.category } } });
  if (filters.subType) and.push({ property: { subType: { slug: filters.subType } } });
  if (filters.possession) and.push({ property: { possessionStatus: filters.possession } });
  if (filters.state) {
    const code = STATE_CODES[filters.state.toLowerCase()] ?? filters.state.toUpperCase();
    and.push({ property: { location: locationWithin({ OR: [
      { stateCode: code }, { type: "STATE", name: filters.state },
    ] }) } });
  }
  if (filters.city) and.push({ property: { location: locationWithin({ name: { contains: filters.city }, type: "CITY" }) } });
  if (filters.district) and.push({ property: { location: locationWithin({ name: { contains: filters.district }, type: "DISTRICT" }) } });
  if (filters.organization) and.push({ organization: { OR: [
    { id: filters.organization }, { slug: filters.organization }, { name: { contains: filters.organization } },
  ] } });
  if (filters.minPrice != null || filters.maxPrice != null)
    and.push({ reservePrice: { gte: filters.minPrice, lte: filters.maxPrice } });
  if (filters.minEmd != null || filters.maxEmd != null)
    and.push({ emd: { gte: filters.minEmd, lte: filters.maxEmd } });
  if (filters.dateFrom || filters.dateTo) and.push({ startDateTime: {
    gte: filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00+05:30`) : undefined,
    lt: filters.dateTo ? new Date(new Date(`${filters.dateTo}T00:00:00+05:30`).getTime() + 86_400_000) : undefined,
  } });
  if (filters.deadlineBefore) and.push({ submissionDeadline: {
    lt: new Date(new Date(`${filters.deadlineBefore}T00:00:00+05:30`).getTime() + 86_400_000),
  } });
  if (filters.keyword) {
    const contains = { contains: filters.keyword };
    and.push({ OR: [
      { auctionNumber: contains }, { description: contains },
      { property: { title: contains } }, { property: { description: contains } },
      { property: { address: contains } }, { property: { location: locationWithin({ name: contains }) } },
      { organization: { name: contains } },
    ] });
  }
  return { AND: and };
}

export function auctionOrder(sort: ValidAuctionFilters["sort"]): Prisma.AuctionOrderByWithRelationInput[] {
  const first: Prisma.AuctionOrderByWithRelationInput =
    sort === "price_asc" ? { reservePrice: "asc" } :
    sort === "price_desc" ? { reservePrice: "desc" } :
    sort === "newest" ? { publishedAt: "desc" } :
    sort === "closing_soon" ? { endDateTime: "asc" } : { startDateTime: "asc" };
  return [first, { id: "asc" }];
}

export interface LocationLabel {
  name: string;
  type: string;
  stateCode: string | null;
  parent?: LocationLabel | null;
}

export function locationLabels(location: LocationLabel) {
  const hierarchy: LocationLabel[] = [];
  for (let node: LocationLabel | null | undefined = location; node; node = node.parent) hierarchy.push(node);
  const stateCode = hierarchy.find((n) => n.stateCode)?.stateCode;
  const stateName = Object.entries(STATE_CODES).find(([, code]) => code === stateCode)?.[0];
  return {
    city: hierarchy.find((n) => n.type === "CITY")?.name ?? location.name,
    state: hierarchy.find((n) => n.type === "STATE")?.name ??
      (stateName ? stateName.replace(/\b\w/g, (c) => c.toUpperCase()) : stateCode ?? "India"),
  };
}
