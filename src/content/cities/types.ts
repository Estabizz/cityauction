// Shape of a city landing page (cityauction.in/<city>), produced by
// scripts/import-city-pages.py from the approved static HTML pages.

export interface CityLink {
  label: string;
  href: string;
}

export interface CityAdSlot {
  tag: string;
  headline: string;
  body: string;
  linkLabel: string;
  mailSubject: string;
}

export interface CitySectionHead {
  eyebrow: string;
  title: string;
  description: string;
}

export interface CityServicePanel {
  index: string;
  title: string;
  summary: string;
  mark: string;
  audience: string;
  paragraphs: string[];
  tags: string[];
  actionLabel: string;
  mailSubject: string;
  actionNote: string;
}

export interface CityGuideBlock {
  heading: string;
  paragraphs: string[];
  bullets: string[];
}

export interface CityPage {
  slug: string;
  city: string;
  state: string;
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    schemaName: string;
    schemaDescription: string;
  };
  breadcrumb: string;
  hero: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    description: string;
    experienceLine: string;
    ctas: CityLink[];
    highlights: string[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    steps: { label: string; text: string }[];
  };
  quickLinks: {
    label: string;
    links: CityLink[];
  };
  ads: {
    header: CityAdSlot;
    prefooter: CityAdSlot;
    rail: {
      eyebrow: string;
      title: string;
      description: string;
      slots: CityAdSlot[];
      note: string;
    };
  };
  finder: CitySectionHead & {
    localityLabel: string;
    localityAll: string;
    propertyTypes: { label: string; value: string }[];
    lenderPlaceholder: string;
    footnote: string;
  };
  categories: CitySectionHead & {
    items: { label: string; title: string; description: string; linkLabel: string }[];
  };
  listings: {
    eyebrow: string;
    title: string;
    description: string;
    disclaimer: string;
    marketTitle: string;
    marketDescription: string;
    marketLabel: string;
  };
  localities: CitySectionHead & {
    items: string[];
    note: string;
  };
  services: {
    kicker: string;
    title: string;
    description: string;
    panels: CityServicePanel[];
    footnote: string;
  };
  guidance: CitySectionHead & {
    items: { label: string; title: string; description: string }[];
  };
  institutions: {
    eyebrow: string;
    title: string;
    description: string;
    actionLabel: string;
    mailSubject: string;
    points: string[];
  };
  guide: CitySectionHead & {
    id: string;
    blocks: CityGuideBlock[];
  };
  whatsappText: string;
}
