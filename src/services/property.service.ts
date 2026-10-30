import { db } from '@/lib/db';
import type { CategoryCardData } from '@/types';
import { MOCK_CATEGORIES } from './mock-data';

export async function getCategories(): Promise<CategoryCardData[]> {
  try {
    const cats = await db.propertyCategory.findMany({
      include: {
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (cats.length > 0) {
      return cats.map((c) => ({
        name: c.name,
        slug: c.slug,
        type: c.type,
        icon: c.icon || 'Package',
        auctionCount: c._count.properties,
      }));
    }
  } catch (error) {
    // Fallback
  }

  return MOCK_CATEGORIES;
}
