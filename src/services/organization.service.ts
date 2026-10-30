import { db } from "@/lib/db";
import type { OrganizationCardData } from "@/types";
import { publicAuctionWhere } from "@/lib/public-auctions";

export async function getOrganizations(): Promise<OrganizationCardData[]> {
  const orgs = await db.organization.findMany({
    where: { isActive: true },
    include: { _count: { select: { auctions: { where: { AND: [
      publicAuctionWhere(), { status: { in: ["UPCOMING", "LIVE", "CLOSING_SOON"] } },
    ] } } } } },
    orderBy: { name: "asc" },
  });
  return orgs.map((o) => ({
    id: o.id, name: o.name, slug: o.slug, type: o.type, logo: o.logo,
    activeAuctionCount: o._count.auctions,
  }));
}

export async function getOrganizationBySlug(slug: string) {
  return db.organization.findFirst({
    where: { slug, isActive: true },
    include: { auctions: {
      where: publicAuctionWhere(),
      include: { property: { include: { images: true, category: true, location: true } } },
    } },
  });
}
