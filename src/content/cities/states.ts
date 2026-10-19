import { CITY_PAGES } from "./index";
import type { CityPage } from "./types";

export interface StateGroup {
  state: string;
  slug: string;
  cities: CityPage[];
}

export function stateSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
