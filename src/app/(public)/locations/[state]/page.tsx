import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cityCardData, cityPath, getStateGroup, getStateGroups, statePath } from "@/content/cities/states";
import { CityCard } from "@/components/city/location-directory";
import "../locations.css";

// Only states with at least one published city page exist; anything else is a 404.
export const dynamicParams = false;

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cityauction.in";

interface PageProps {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return getStateGroups().map((group) => ({ state: group.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const group = getStateGroup((await params).state);
  if (!group) return {};
  const url = `${SITE_URL}${statePath(group.state)}`;
  const cityList = group.cities.map((c) => c.city).join(", ");

  return {
    title: { absolute: `Bank Auction Properties in ${group.state} by City | CityAuction` },
    description: `Explore bank auction properties across ${group.state}: ${cityList}. Choose a city for locality-wise discovery and buyer guidance.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `Bank Auction Properties in ${group.state} | CityAuction`,
      description: `CityAuction city pages in ${group.state}: ${cityList}.`,
      url,
      siteName: "CityAuction",
      locale: "en_IN",
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const group = getStateGroup((await params).state);
  if (!group) notFound();

  const url = `${SITE_URL}${statePath(group.state)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Bank Auction Properties in ${group.state}`,
        url,
        isPartOf: { "@type": "WebSite", name: "CityAuction", url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Locations", item: `${SITE_URL}/locations` },
          { "@type": "ListItem", position: 3, name: group.state, item: url },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: group.cities.map((page, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: page.city,
          url: `${SITE_URL}${cityPath(page)}`,
        })),
      },
    ],
  };

  return (
    <div className="loc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="loc-hero">
        <div className="loc-wrap">
          <nav className="loc-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/locations">Locations</Link>
            <span aria-hidden="true">/</span>
            <span>{group.state}</span>
          </nav>
          <div className="loc-hero-main">
            <div className="loc-eyebrow">{group.state} · City auction discovery</div>
            <h1>
              Bank Auction Properties <em>in {group.state}.</em>
            </h1>
            <p>
              Choose a city in {group.state} to explore local bank auction opportunities, locality-wise discovery,
              institutional services and buyer guidance. Verify every opportunity from its official sale notice.
            </p>
            <div className="loc-metrics">
              <div>
                <b>{group.cities.length}</b> city pages
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="loc-section">
        <div className="loc-wrap">
          <section className="loc-state" aria-labelledby="state-cities-title">
            <div className="loc-state-head">
              <h2 id="state-cities-title">Cities in {group.state}</h2>
              <span>
                {group.cities.length} {group.cities.length === 1 ? "city" : "cities"}
              </span>
            </div>
            <div className="loc-city-grid">
              {group.cities.map((page) => (
                <CityCard key={page.slug} city={cityCardData(page)} />
              ))}
            </div>
          </section>

          <div className="loc-note">
            Only cities with a published CityAuction page are listed.{" "}
            <Link href="/locations">See all states →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
