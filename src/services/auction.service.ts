import { getAdminActor } from "@/lib/admin/guard";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { AuctionFilters, PaginatedResponse, AuctionCardData, DetailedAuction } from "@/types";
import { validateAuctionFilters } from "@/lib/auction-search";
import { auctionOrder, auctionWhere, locationLabels } from "@/lib/auction-query";
import { AuctionDataUnavailable, publicAuctionWhere } from "@/lib/public-auctions";

const locationInclude = { parent: { include: { parent: { include: { parent: true } } } } } as const;
const cardInclude = {
  property: { include: {
    images: { where: { isPrimary: true }, take: 1, orderBy: { sortOrder: "asc" } },
    category: true, location: { include: locationInclude },
  } },
  organization: true,
} satisfies Prisma.AuctionInclude;

type CardAuction = Prisma.AuctionGetPayload<{ include: typeof cardInclude }>;

function cardData(a: CardAuction): AuctionCardData {
  return {
    id: a.id, auctionNumber: a.auctionNumber, title: a.property.title, slug: a.property.slug,
    categoryName: a.property.category.name, categoryType: a.property.category.type,
    ...locationLabels(a.property.location),
    organizationName: a.organization.name, organizationLogo: a.organization.logo,
    reservePrice: a.reservePrice.toString(), emd: a.emd.toString(),
    startDateTime: a.startDateTime.toISOString(), endDateTime: a.endDateTime.toISOString(),
    submissionDeadline: a.submissionDeadline.toISOString(), auctionType: a.type, status: a.status,
    possessionStatus: a.property.possessionStatus, primaryImage: a.property.images[0]?.url ?? null,
    sourceListingId: a.sourceListingId, sourceVerifiedAt: a.sourceVerifiedAt?.toISOString() ?? null,
  };
}

export async function getAuctions(filters: AuctionFilters = {}): Promise<PaginatedResponse<AuctionCardData>> {
  const input = validateAuctionFilters(filters);
  const where = auctionWhere(input);
  try {
    const total = await db.auction.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / input.limit));
    const page = Math.min(input.page, totalPages);
    const rows = total === 0 ? [] : await db.auction.findMany({
      where, skip: (page - 1) * input.limit, take: input.limit,
      include: cardInclude, orderBy: auctionOrder(input.sort),
    });
    return {
      data: rows.map(cardData),
      pagination: { page, limit: input.limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  } catch (error) {
    console.error("[auctions] search unavailable", error);
    throw new AuctionDataUnavailable();
  }
}

export async function getAuctionById(idOrSlug: string): Promise<DetailedAuction | null> {
  return readAuctionDetail(idOrSlug, false);
}
export async function getAdminAuctionPreview(id: string): Promise<DetailedAuction | null> {
  if (!await getAdminActor()) return null;
  return readAuctionDetail(id, true);
}
async function readAuctionDetail(idOrSlug: string, preview: boolean): Promise<DetailedAuction | null> {
  try {
    const dbAuction = await db.auction.findFirst({
      where: { AND: [preview ? { deletedAt: null } : publicAuctionWhere(), { OR: [
        { id: idOrSlug }, { auctionNumber: idOrSlug }, { property: { slug: idOrSlug } },
      ] }] },
      include: {
        property: { include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true, location: { include: locationInclude },
        } },
        organization: true,
        documents: { where: { isPublic: true } },
      },
    });
    if (!dbAuction) return null;
    return {
      ...cardData(dbAuction),
      bidIncrement: dbAuction.bidIncrement.toString(),
      inspectionDate: dbAuction.inspectionDate?.toISOString() ?? "",
      address: dbAuction.property.address || '',
      description: dbAuction.description || dbAuction.property.description || '',
      area: Number(dbAuction.property.area) || 0,
      areaUnit: dbAuction.property.areaUnit || '',
      contactOfficerName: dbAuction.contactOfficerName || '',
      contactOfficerPhone: dbAuction.contactOfficerPhone || '',
      contactOfficerEmail: dbAuction.contactOfficerEmail || '',
      terms: dbAuction.terms || '',
      images: dbAuction.property.images.map((img) => img.url),
      documents: dbAuction.documents.map((doc) => ({
        name: doc.name,
        type: doc.type,
        size: doc.fileSize > 0 ? (doc.fileSize < 1024 ? `${doc.fileSize} bytes` : `${Math.ceil(doc.fileSize / 1024)} KB`) : "",
        url: doc.url,
      })),
      organization: {
        name: dbAuction.organization.name,
        slug: dbAuction.organization.slug,
        type: dbAuction.organization.type,
        logo: dbAuction.organization.logo,
        phone: dbAuction.organization.contactPhone || '',
        email: dbAuction.organization.contactEmail || '',
        website: dbAuction.organization.website || '',
      },
    };
  } catch (error) {
    console.error("[auctions] detail unavailable", error);
    throw new AuctionDataUnavailable();
  }
}

export async function getRelatedAuctions(currentId: string, categoryType?: string, limit = 4): Promise<AuctionCardData[]> {
  try {
    const all = await getAuctions({ category: categoryType, sort: "closing_soon", limit: Math.min(50, limit + 1) });
    return all.data.filter((a) => a.id !== currentId).slice(0, limit);
  } catch (error) {
    if (!(error instanceof AuctionDataUnavailable)) throw error;
    // The main detail page can still render if only related listings fail.
    return [];
  }
}

export async function getPublicAuctionSitemapEntries() {
  // Propagate failures: a sitemap outage should not replace known URLs with
  // an apparently successful empty sitemap that search engines might cache.
  return db.auction.findMany({
    where: publicAuctionWhere(), select: { id: true, updatedAt: true }, orderBy: { id: "asc" },
  });
}
