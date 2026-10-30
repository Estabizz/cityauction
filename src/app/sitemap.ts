import { MetadataRoute } from 'next';
import { getPublicAuctionSitemapEntries } from '@/services/auction.service';
import { PROPERTY_CATEGORIES } from '@/lib/constants';
import { CITY_PAGES } from '@/content/cities';
import { cityPath, getStateGroups, statePath } from '@/content/cities/states';

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cityauction.in';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/auctions`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/organizations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/resources/faqs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = PROPERTY_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/properties/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const auctions = await getPublicAuctionSitemapEntries();
  const auctionPages: MetadataRoute.Sitemap = auctions.map((auc) => ({
    url: `${baseUrl}/auctions/${auc.id}`,
    lastModified: auc.updatedAt,
    changeFrequency: 'hourly',
    priority: 0.9,
  }));

  const statePages: MetadataRoute.Sitemap = getStateGroups().map((group) => ({
    url: `${baseUrl}${statePath(group.state)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = CITY_PAGES.map((page) => ({
    url: `${baseUrl}${cityPath(page)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...categoryPages, ...auctionPages];
}
