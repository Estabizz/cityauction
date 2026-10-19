// URL helpers with no page data, so client components can import them cheaply.
// Scheme: /locations/<state>/<city> (and later /locations/<state>/<city>/<area>).
import { CITY_LIST, type CityListItem } from "./list";

export function stateSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function statePath(state: string): string {
  return `/locations/${stateSlug(state)}`;
}

export function cityPath(page: { state: string; slug: string }): string {
  return `${statePath(page.state)}/${page.slug}`;
}

// Match a free-text city name ("surat", "Surat ") to a published city page.
export function findCityByName(name: string | null | undefined): CityListItem | undefined {
  const q = name?.trim().toLowerCase();
  return q ? CITY_LIST.find((c) => c.city.toLowerCase() === q || c.slug === q) : undefined;
}
