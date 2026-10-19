import { CITY_PAGES } from "./index";
import type { CityPage } from "./types";
import { cityPath, stateSlug } from "./paths";

export { cityPath, statePath, stateSlug } from "./paths";

export interface StateGroup {
  state: string;
  slug: string;
  cities: CityPage[];
}

export function getStateGroup(slug: string): StateGroup | undefined {
  return getStateGroups().find((group) => group.slug === slug);
}

// States that have at least one published city page, alphabetical, each with
// its cities alphabetical. States without pages are never listed.
export function getStateGroups(): StateGroup[] {
  const groups = new Map<string, CityPage[]>();
  for (const page of CITY_PAGES) {
    groups.set(page.state, [...(groups.get(page.state) ?? []), page]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, cities]) => ({
      state,
      slug: stateSlug(state),
      cities: cities.sort((a, b) => a.city.localeCompare(b.city)),
    }));
}

export interface CityCardData {
  slug: string;
  href: string;
  city: string;
  eyebrow: string;
  title: string;
  localityCount: number;
}

export function cityCardData(page: CityPage): CityCardData {
  return {
    slug: page.slug,
    href: cityPath(page),
    city: page.city,
    // "Surat · Residential property auction discovery" -> "Residential property auction discovery"
    eyebrow: page.hero.eyebrow.replace(new RegExp(`^${page.city}\\s*·\\s*`, "i"), ""),
    title: `${page.hero.titleLead} ${page.hero.titleEmphasis}`.replace(/\.$/, ""),
    localityCount: page.localities.items.length,
  };
}
