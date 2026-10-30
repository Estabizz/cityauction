import type { BuyerRequirement, Prisma } from "@prisma/client";
import { publicAuctionWhere } from "./public-auctions";
import { locationWithin } from "./auction-query";
import { db } from "./db";
import { ASSET_CLASSES, PAN_INDIA, budgetBounds, withCityAliases } from "./buyer";

// MVP matching (Requirements §8): open listings filtered by the requirement's
// asset classes, cities and budget. Results are "suggested matches" only, never
// a statement on title, value or suitability.

export const OPEN_STATUSES = ["UPCOMING", "LIVE", "CLOSING_SOON"] as const;

export function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

// null = this requirement can't match any listing we hold (e.g. only Customs).
export function requirementWhere(req: Pick<BuyerRequirement, "assetClasses" | "cities" | "budgetRange" | "minBudget" | "maxBudget">): Prisma.AuctionWhereInput | null {
  const and: Prisma.AuctionWhereInput[] = [
    publicAuctionWhere(),
    { status: { in: [...OPEN_STATUSES] }, endDateTime: { gt: new Date() } },
  ];

  const classes = asStringArray(req.assetClasses);
  if (classes.length) {
    const defs = ASSET_CLASSES.filter((c) => classes.includes(c.value)) as readonly { categoryTypes?: readonly string[]; auctionTypes?: readonly string[] }[];
    const categoryTypes = defs.flatMap((d) => d.categoryTypes ?? []);
    const auctionTypes = defs.flatMap((d) => d.auctionTypes ?? []);
    const or: Prisma.AuctionWhereInput[] = [];
    if (categoryTypes.length) or.push({ property: { category: { type: { in: categoryTypes as never[] } } } });
    if (auctionTypes.length) or.push({ type: { in: auctionTypes as never[] } });
    if (!or.length) return null;
    and.push({ OR: or });
  }

  const cities = asStringArray(req.cities).filter((c) => c !== "OTHER");
  if (cities.length && !cities.includes(PAN_INDIA)) {
    // MySQL's default collation compares case-insensitively.
    and.push({ property: { location: locationWithin({ name: { in: withCityAliases(cities) }, type: "CITY" }) } });
  }

  const { min, max } = budgetBounds({
    budgetRange: req.budgetRange,
    minBudget: req.minBudget == null ? null : Number(req.minBudget),
    maxBudget: req.maxBudget == null ? null : Number(req.maxBudget),
  });
  if (min != null) and.push({ reservePrice: { gte: min } });
  if (max != null) and.push({ reservePrice: { lte: max } });

  return { AND: and };
}

export const matchInclude = {
  property: {
    select: {
      title: true,
      slug: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
    },
  },
  organization: { select: { name: true } },
} satisfies Prisma.AuctionInclude;

export type MatchedAuction = Prisma.AuctionGetPayload<{ include: typeof matchInclude }>;

export async function matchesForRequirement(req: BuyerRequirement, take = 24): Promise<MatchedAuction[]> {
  const where = requirementWhere(req);
  if (!where) return [];
  return db.auction.findMany({ where, include: matchInclude, orderBy: { startDateTime: "asc" }, take });
}

// Distinct matching auctions across all of a buyer's requirements.
export async function matchesForUser(userId: string, take = 6) {
  const requirements = await db.buyerRequirement.findMany({ where: { userId } });
  const wheres = requirements.map(requirementWhere).filter((w): w is Prisma.AuctionWhereInput => w !== null);
  if (!wheres.length) return { requirements, total: 0, auctions: [] as MatchedAuction[] };
  const where = { OR: wheres };
  const [total, auctions] = await Promise.all([
    db.auction.count({ where }),
    db.auction.findMany({ where, include: matchInclude, orderBy: { startDateTime: "asc" }, take }),
  ]);
  return { requirements, total, auctions };
}
