import { db } from '@/lib/db';
import type { OrganizationCardData } from '@/types';
import { MOCK_ORGANIZATIONS } from './mock-data';

export async function getOrganizations(): Promise<OrganizationCardData[]> {
  try {
    const orgs = await db.organization.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { auctions: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (orgs.length > 0) {
      return orgs.map((o) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        type: o.type,
        logo: o.logo,
        activeAuctionCount: o._count.auctions,
      }));
    }
  } catch (error) {
    // Fallback
  }

  return MOCK_ORGANIZATIONS;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const org = await db.organization.findUnique({
      where: { slug },
      include: {
        auctions: {
          include: {
            property: {
              include: {
                images: true,
                category: true,
                location: true,
              },
            },
          },
        },
      },
    });
    if (org) return org;
  } catch (error) {
    // Fallback
  }

  return MOCK_ORGANIZATIONS.find((o) => o.slug === slug) || null;
}
