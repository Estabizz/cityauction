import { db } from '@/lib/db';
import type { AuctionFilters, PaginatedResponse, AuctionCardData } from '@/types';
import { MOCK_AUCTIONS, DetailedAuction } from './mock-data';

export async function getAuctions(filters: AuctionFilters = {}): Promise<PaginatedResponse<AuctionCardData>> {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 12));

  try {
    // Attempt database query first
    const where: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.auctionType) {
      where.type = filters.auctionType;
    }
    if (filters.minPrice || filters.maxPrice) {
      where.reservePrice = {};
      if (filters.minPrice) (where.reservePrice as Record<string, number>).gte = filters.minPrice;
      if (filters.maxPrice) (where.reservePrice as Record<string, number>).lte = filters.maxPrice;
    }

    const [total, auctions] = await Promise.all([
      db.auction.count({ where }),
      db.auction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          property: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: true,
              location: true,
            },
          },
          organization: true,
        },
        orderBy: { startDateTime: 'asc' },
      }),
    ]);

    if (total > 0) {
      const data: AuctionCardData[] = auctions.map((a) => ({
        id: a.id,
        auctionNumber: a.auctionNumber,
        title: a.property.title,
        slug: a.property.slug,
        categoryName: a.property.category.name,
        categoryType: a.property.category.type,
        city: a.property.location?.name || 'Various',
        state: a.property.location?.stateCode || 'IN',
        organizationName: a.organization.name,
        organizationLogo: a.organization.logo,
        reservePrice: a.reservePrice.toString(),
        emd: a.emd.toString(),
        startDateTime: a.startDateTime.toISOString(),
        endDateTime: a.endDateTime.toISOString(),
        submissionDeadline: a.submissionDeadline.toISOString(),
        auctionType: a.type,
        status: a.status,
        possessionStatus: a.property.possessionStatus,
        primaryImage: a.property.images[0]?.url || null,
      }));

      const totalPages = Math.ceil(total / limit);
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    }
  } catch (error) {
    // Database fallback or not yet migrated, smoothly fallback to curated dataset
  }

  // Curated Fallback Filtering
  let filtered = [...MOCK_AUCTIONS];

  if (filters.state) {
    const s = filters.state.toLowerCase();
    filtered = filtered.filter((a) => a.state.toLowerCase().includes(s));
  }

  if (filters.city) {
    const c = filters.city.toLowerCase();
    filtered = filtered.filter((a) => a.city.toLowerCase().includes(c));
  }

  if (filters.category) {
    const cat = filters.category.toLowerCase();
    filtered = filtered.filter((a) => a.categoryType.toLowerCase() === cat);
  }

  if (filters.auctionType) {
    filtered = filtered.filter((a) => a.auctionType === filters.auctionType);
  }

  if (filters.status) {
    filtered = filtered.filter((a) => a.status === filters.status);
  }

  if (filters.minPrice) {
    filtered = filtered.filter((a) => parseFloat(a.reservePrice) >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    filtered = filtered.filter((a) => parseFloat(a.reservePrice) <= Number(filters.maxPrice));
  }

  if (filters.organization) {
    const org = filters.organization.toLowerCase();
    filtered = filtered.filter((a) => a.organizationName.toLowerCase().includes(org));
  }

  if (filters.possession) {
    filtered = filtered.filter((a) => a.possessionStatus === filters.possession);
  }

  if (filters.keyword) {
    const q = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.organizationName.toLowerCase().includes(q) ||
        a.auctionNumber.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    filtered.sort((a, b) => parseFloat(a.reservePrice) - parseFloat(b.reservePrice));
  } else if (filters.sort === 'price_desc') {
    filtered.sort((a, b) => parseFloat(b.reservePrice) - parseFloat(a.reservePrice));
  } else {
    // Default soonest date
    filtered.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getAuctionById(idOrSlug: string): Promise<DetailedAuction | null> {
  try {
    const dbAuction = await db.auction.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { auctionNumber: idOrSlug },
          { property: { slug: idOrSlug } },
        ],
      },
      include: {
        property: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            documents: true,
            category: true,
            location: true,
          },
        },
        organization: true,
        documents: true,
      },
    });

    if (dbAuction) {
      return {
        id: dbAuction.id,
        auctionNumber: dbAuction.auctionNumber,
        title: dbAuction.property.title,
        slug: dbAuction.property.slug,
        categoryName: dbAuction.property.category.name,
        categoryType: dbAuction.property.category.type,
        city: dbAuction.property.location?.name || 'Various',
        state: dbAuction.property.location?.stateCode || 'IN',
        organizationName: dbAuction.organization.name,
        organizationLogo: dbAuction.organization.logo,
        reservePrice: dbAuction.reservePrice.toString(),
        emd: dbAuction.emd.toString(),
        bidIncrement: dbAuction.bidIncrement.toString(),
        startDateTime: dbAuction.startDateTime.toISOString(),
        endDateTime: dbAuction.endDateTime.toISOString(),
        submissionDeadline: dbAuction.submissionDeadline.toISOString(),
        inspectionDate: dbAuction.inspectionDate ? dbAuction.inspectionDate.toISOString() : '',
        auctionType: dbAuction.type,
        status: dbAuction.status,
        possessionStatus: dbAuction.property.possessionStatus,
        primaryImage: dbAuction.property.images[0]?.url || null,
        address: dbAuction.property.address || '',
        description: dbAuction.description || dbAuction.property.description || '',
        area: Number(dbAuction.property.area) || 0,
        areaUnit: dbAuction.property.areaUnit || 'sq ft',
        contactOfficerName: dbAuction.contactOfficerName || '',
        contactOfficerPhone: dbAuction.contactOfficerPhone || '',
        contactOfficerEmail: dbAuction.contactOfficerEmail || '',
        terms: dbAuction.terms || '',
        images: dbAuction.property.images.map((img) => img.url),
        documents: dbAuction.documents.map((doc) => ({
          name: doc.name,
          type: doc.type,
          size: `${Math.round(doc.fileSize / 1024)} KB`,
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
    }
  } catch (error) {
    // Fallback below
  }

  const match = MOCK_AUCTIONS.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug || a.auctionNumber === idOrSlug
  );

  return match || null;
}

export async function getRelatedAuctions(currentId: string, categoryType?: string, limit = 4): Promise<AuctionCardData[]> {
  const all = await getAuctions({ limit: 10 });
  return all.data.filter((a) => a.id !== currentId).slice(0, limit);
}
