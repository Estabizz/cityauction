import Link from "next/link";
import type { Metadata } from "next";
import { cityCardData, cityPath, getStateGroups } from "@/content/cities/states";
import { LocationDirectory, type DirectoryState } from "@/components/city/location-directory";
import "./locations.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cityauction.in";

export const metadata: Metadata = {
  title: { absolute: "Bank Auction Properties by State & City in India | CityAuction" },
  description:
    "Choose your state and city to explore local bank auction properties, localities, institutional services and buyer guidance on CityAuction.",
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    type: "website",
    title: "Bank Auction Properties by State & City | CityAuction",
    description: "Find CityAuction city pages across India, grouped by state.",
    url: `${SITE_URL}/locations`,
    siteName: "CityAuction",
    locale: "en_IN",
  },
};

export default function LocationsPage() {
  const groups = getStateGroups();
  const cityCount = groups.reduce((sum, g) => sum + g.cities.length, 0);

  const states: DirectoryState[] = groups.map((group) => ({
    state: group.state,
    slug: group.slug,
    cities: group.cities.map(cityCardData),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Bank Auction Properties by State & City",
        url: `${SITE_URL}/locations`,
        isPartOf: { "@type": "WebSite", name: "CityAuction", url: `${SITE_URL}/` },
      },
      {
        "@type": "ItemList",
        itemListElement: groups
          .flatMap((g) => g.cities)
          .map((page, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${page.city}, ${page.state}`,
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
            <span>Locations</span>
          </nav>
          <div className="loc-hero-main">
            <div className="loc-eyebrow">India · State &amp; city auction discovery</div>
            <h1>
              Bank Auction Properties <em>by State &amp; City.</em>
            </h1>
            <p>
              Choose your state, then your city, to explore local bank auction opportunities, locality-wise discovery,
              institutional services and buyer guidance. Verify every opportunity from its official sale notice.
            </p>
            <div className="loc-metrics">
              <div>
                <b>{groups.length}</b> {groups.length === 1 ? "state" : "states"}
              </div>
              <div>
                <b>{cityCount}</b> city pages
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="loc-section">
        <div className="loc-wrap">
          <LocationDirectory states={states} />

          <div className="loc-note">
            Only cities with a published CityAuction page are listed. More states and cities are added as their pages
            are published.
          </div>
        </div>
      </section>
    </div>
  );
}
