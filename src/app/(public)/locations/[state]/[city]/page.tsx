import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_PAGES, getCityPage } from "@/content/cities";
import type { CityAdSlot } from "@/content/cities/types";
import { cityPath, statePath, stateSlug } from "@/content/cities/states";
import type { CityPage as CityPageData } from "@/content/cities/types";
import { CityAuctionFinder } from "@/components/city/city-auction-finder";
import { getAuctions } from "@/services/auction.service";
import "./city-page.css";

// Only published city pages exist (/locations/<state>/<city>); anything else is a 404.
export const dynamicParams = false;
// Re-render periodically so newly published city listings appear without a rebuild.
export const revalidate = 900;

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cityauction.in";
const CONTACT_EMAIL = "info@estabizz.com";

const SERVICE_LINKS = [
  { label: "Customs Auctions", href: "/customs-auction" },
  { label: "Next Chapter", href: "/next-chapter" },
  { label: "Liquidator Services", href: "/liquidate-an-asset" },
];

const SERVICE_ANCHORS = ["customs", "next-chapter", "liquidator"];

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

export function generateStaticParams() {
  return CITY_PAGES.map((page) => ({ state: stateSlug(page.state), city: page.slug }));
}

// The city must exist and sit under its own state's URL.
async function resolvePage(params: PageProps["params"]): Promise<CityPageData | undefined> {
  const { state, city } = await params;
  const page = getCityPage(city);
  return page && stateSlug(page.state) === state ? page : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await resolvePage(params);
  if (!page) return {};
  const pageUrl = `${SITE_URL}${cityPath(page)}`;

  return {
    // The approved SEO titles already end in "| CityAuction".
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: pageUrl },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: "website",
      title: page.seo.ogTitle,
      description: page.seo.ogDescription,
      url: pageUrl,
      siteName: "CityAuction",
      locale: "en_IN",
    },
  };
}

function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function BannerAd({ ad, label }: { ad: CityAdSlot; label: string }) {
  return (
    <div className="city-ad city-ad-banner" role="region" aria-label={label}>
      <div>
        <span className="city-ad-tag">{ad.tag}</span>
        <strong>{ad.headline}</strong>
        <p>{ad.body}</p>
        <a className="city-ad-link" href={mailto(ad.mailSubject)}>
          {ad.linkLabel} ↗
        </a>
      </div>
      <div aria-hidden="true" className="city-ad-mark">
        ∞
      </div>
    </div>
  );
}

export default async function CityPage({ params }: PageProps) {
  const page = await resolvePage(params);
  if (!page) notFound();

  const { data: auctions } = await getAuctions({ city: page.city, limit: 50 });
  const servicesId = `${page.slug}-services`;
  const pageUrl = `${SITE_URL}${cityPath(page)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: page.seo.schemaName,
        url: pageUrl,
        description: page.seo.schemaDescription,
        isPartOf: { "@type": "WebSite", name: "CityAuction", url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Locations", item: `${SITE_URL}/locations` },
          { "@type": "ListItem", position: 3, name: page.state, item: `${SITE_URL}${statePath(page.state)}` },
          { "@type": "ListItem", position: 4, name: page.city, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="city-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="city-hero">
        <div className="city-wrap">
          <nav className="city-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/locations">Locations</Link>
            <span aria-hidden="true">/</span>
            <Link href={statePath(page.state)}>{page.state}</Link>
            <span aria-hidden="true">/</span>
            <span>{page.breadcrumb}</span>
          </nav>
          <div className="city-hero-main">
            <div className="city-eyebrow">{page.hero.eyebrow}</div>
            <h1>
              {page.hero.titleLead} <em>{page.hero.titleEmphasis}</em>
            </h1>
            <p>{page.hero.description}</p>
            <div className="city-experience-line">{page.hero.experienceLine}</div>
            <div className="city-hero-cta">
              {page.hero.ctas.map((cta, i) => (
                <a key={cta.href} className={i === 0 ? "city-btn" : "city-btn city-btn-ghost"} href={cta.href}>
                  {cta.label} {i === 0 ? "↗" : "→"}
                </a>
              ))}
            </div>
            <div className="city-metrics">
              {page.hero.highlights.map((item) => (
                <div key={item}>
                  <span className="city-dot" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience band */}
      <section className="city-experience" aria-label={`Discover ${page.city} opportunities with confidence`}>
        <div className="city-wrap city-experience-inner">
          <div>
            <div className="city-eyebrow">{page.experience.eyebrow}</div>
            <h2 className="city-experience-title">{page.experience.title}</h2>
            <p className="city-experience-description">{page.experience.description}</p>
          </div>
          <div className="city-experience-proof">
            {page.experience.steps.map((step) => (
              <span key={step.label}>
                <b>{step.label}</b>
                {step.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="city-quick" aria-label={`Quick ${page.city} opportunity access`}>
        <div className="city-wrap city-quick-wrap">
          <div className="city-quick-label">{page.quickLinks.label}</div>
          {page.quickLinks.links.map((link) => (
            <Link key={link.label} className="city-quick-pill" href={link.href}>
              {link.label} <span>↗</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="city-wrap">
        <BannerAd ad={page.ads.header} label="Header institutional advertising placement, not currently booked" />
      </div>

      {/* Finder, categories, listings + right rail */}
      <section className="city-section" id="discover">
        <div className="city-wrap city-main-grid">
          <div>
            <CityAuctionFinder page={page} localities={page.localities.items} auctions={auctions} />

            <div className="city-introline">
              <div className="city-eyebrow">{page.categories.eyebrow}</div>
              <h2>{page.categories.title}</h2>
              <p>{page.categories.description}</p>
            </div>
            <div className="city-cat-grid">
              {page.categories.items.map((cat) => (
                <Link key={cat.label} className="city-cat" href={`/auctions?city=${encodeURIComponent(page.city)}`}>
                  <div className="city-cat-num">{cat.label}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                  <span className="city-cat-arrow">{cat.linkLabel} →</span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="city-side" aria-label="Right-side bank advertising placements">
            <div className="city-rail-head">
              <div className="city-eyebrow">{page.ads.rail.eyebrow}</div>
              <h3>{page.ads.rail.title}</h3>
              <p>{page.ads.rail.description}</p>
            </div>
            {page.ads.rail.slots.map((slot, i) => (
              <div
                key={slot.mailSubject}
                className="city-ad city-ad-box"
                role="region"
                aria-label={`Advertising slot ${i + 1}, not booked`}
              >
                <span className="city-ad-slotnum">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <span className="city-ad-tag">{slot.tag}</span>
                  <div className="city-ad-big">{slot.headline}</div>
                  <p>{slot.body}</p>
                </div>
                <div className="city-ad-bottom">
                  <small>Institutional advertising slot</small>
                  <a href={mailto(slot.mailSubject)}>{slot.linkLabel} ↗</a>
                </div>
              </div>
            ))}
            <div className="city-railnote">{page.ads.rail.note}</div>
          </aside>
        </div>
      </section>

      {/* Localities */}
      <section className="city-section city-section-muted">
        <div className="city-wrap">
          <div className="city-section-head">
            <div className="city-eyebrow">{page.localities.eyebrow}</div>
            <h2>{page.localities.title}</h2>
            <p>{page.localities.description}</p>
          </div>
          <div className="city-localities">
            {page.localities.items.map((name) => (
              <Link
                key={name}
                className="city-place"
                href={`/auctions?city=${encodeURIComponent(page.city)}&keyword=${encodeURIComponent(name)}`}
              >
                {name} <span>↗</span>
              </Link>
            ))}
          </div>
          <p className="city-note">{page.localities.note}</p>
        </div>
      </section>

      {/* Additional services */}
      <section className="city-section city-services" id={servicesId} aria-labelledby={`${servicesId}-title`}>
        <div className="city-wrap">
          <span className="city-service-kicker">{page.services.kicker}</span>
          <h2 id={`${servicesId}-title`}>{page.services.title}</h2>
          <p className="city-service-lead">{page.services.description}</p>
          <nav className="city-service-nav" aria-label={`${page.city} additional services`}>
            {SERVICE_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label} ↗
              </Link>
            ))}
          </nav>
          {page.services.panels.map((panel, i) => (
            <article key={panel.title} className="city-service-panel" id={`${SERVICE_ANCHORS[i]}-${page.slug}`}>
              <div className="city-service-art">
                <div>
                  <div className="city-service-index">{panel.index}</div>
                  <h3>{panel.title}</h3>
                  <p>{panel.summary}</p>
                </div>
                <div className="city-service-mark">{panel.mark}</div>
              </div>
              <div className="city-service-body">
                <h4>{panel.audience}</h4>
                <p>{panel.paragraphs[0]}</p>
                <div className="city-service-tags">
                  {panel.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {panel.paragraphs.slice(1).map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <div className="city-service-action">
                  <a className="city-service-btn" href={mailto(panel.mailSubject)}>
                    {panel.actionLabel} →
                  </a>
                  <small>{panel.actionNote}</small>
                </div>
              </div>
            </article>
          ))}
          <p className="city-service-footnote">{page.services.footnote}</p>
        </div>
      </section>

      {/* Buyer guidance */}
      <section className="city-section">
        <div className="city-wrap">
          <div className="city-section-head">
            <div className="city-eyebrow">{page.guidance.eyebrow}</div>
            <h2>{page.guidance.title}</h2>
            <p>{page.guidance.description}</p>
          </div>
          <div className="city-info-grid">
            {page.guidance.items.map((item) => (
              <div key={item.label} className="city-info">
                <b>{item.label}</b>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="city-section city-dark" id="banks">
        <div className="city-wrap city-bankstrip">
          <div>
            <div className="city-eyebrow">{page.institutions.eyebrow}</div>
            <h2>{page.institutions.title}</h2>
            <p>{page.institutions.description}</p>
            <a className="city-btn" href={mailto(page.institutions.mailSubject)}>
              {page.institutions.actionLabel} ↗
            </a>
          </div>
          <div className="city-bankpoints">
            {page.institutions.points.map((point, i) => (
              <div key={point}>
                <b>{String(i + 1).padStart(2, "0")}.</b> {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO guide */}
      <section className="city-section" id={page.guide.id}>
        <div className="city-wrap">
          <div className="city-section-head">
            <div className="city-eyebrow">{page.guide.eyebrow}</div>
            <h2>{page.guide.title}</h2>
            <p>{page.guide.description}</p>
          </div>
          <div className="city-seo-copy">
            {page.guide.blocks.map((block) => (
              <div key={block.heading} className="city-seo-block">
                <h3>{block.heading}</h3>
                {block.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {block.bullets.length > 0 && (
                  <ul>
                    {block.bullets.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="city-prefooter">
        <div className="city-wrap">
          <BannerAd ad={page.ads.prefooter} label="Pre-footer institutional advertising placement, not currently booked" />
        </div>
      </section>

      <a
        className="city-float-contact"
        href={`https://wa.me/919825669668?text=${encodeURIComponent(page.whatsappText)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp CityAuction ↗
      </a>
    </div>
  );
}
