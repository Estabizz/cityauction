import { db } from "@/lib/db";
import type { CategoryCardData } from "@/types";
import { publicAuctionWhere } from "@/lib/public-auctions";

export async function getCategories(): Promise<CategoryCardData[]> {
  const cats = await db.propertyCategory.findMany({
    include: { properties: {
      where: { deletedAt: null },
      select: { _count: { select: { auctions: { where: { AND: [
        publicAuctionWhere(), { status: { in: ["UPCOMING", "LIVE", "CLOSING_SOON"] } },
      ] } } } } },
    } },
    orderBy: { sortOrder: "asc" },
  });
  return cats.map((c) => ({
    name: c.name, slug: c.slug, type: c.type, icon: c.icon || "Package",
    auctionCount: c.properties.reduce((total, p) => total + p._count.auctions, 0),
  }));
}
