"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CityCardData } from "@/content/cities/states";

export interface DirectoryState {
  state: string;
  slug: string;
  cities: CityCardData[];
}

export function LocationDirectory({ states }: { states: DirectoryState[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      states
        .map((group) => ({
          ...group,
          cities: group.state.toLowerCase().includes(q)
            ? group.cities
            : group.cities.filter((c) => c.city.toLowerCase().includes(q)),
        }))
        .filter((group) => group.cities.length > 0),
    [states, q]
  );

  return (
    <>
      <div className="loc-toolbar">
        <div className="loc-search">
          <label htmlFor="loc-search">Find your city</label>
          <input
            id="loc-search"
            type="search"
            autoComplete="off"
            placeholder="Type a city or state, e.g. Surat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <nav className="loc-state-chips" aria-label="Jump to state">
          {states.map((group) => (
            <a key={group.slug} href={`#${group.slug}`}>
              {group.state} <span>{group.cities.length}</span>
            </a>
          ))}
        </nav>
      </div>

      {visible.length === 0 ? (
        <div className="loc-empty" role="status">
          <strong>No city page for “{query.trim()}” yet</strong>
          <p>
            We only list cities with a published CityAuction page. Browse the full marketplace or create an alert and
            we&apos;ll let you know when auctions appear there.
          </p>
          <div className="loc-empty-actions">
            <Link className="loc-btn" href="/auctions">
              Browse all auctions ↗
            </Link>
            <Link className="loc-btn loc-btn-outline" href="/auction-alerts">
              Create an auction alert ↗
            </Link>
          </div>
        </div>
      ) : (
        visible.map((group) => (
          <section key={group.slug} className="loc-state" id={group.slug} aria-labelledby={`${group.slug}-title`}>
            <div className="loc-state-head">
              <h2 id={`${group.slug}-title`}>
                <Link href={`/locations/${group.slug}`}>{group.state}</Link>
              </h2>
              <span>
                {group.cities.length} {group.cities.length === 1 ? "city" : "cities"}
              </span>
            </div>
            <div className="loc-city-grid">
              {group.cities.map((city) => (
                <CityCard key={city.slug} city={city} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

export function CityCard({ city }: { city: CityCardData }) {
  return (
    <Link className="loc-city" href={city.href}>
      <div className="loc-city-name">{city.city}</div>
      <h3>{city.title}</h3>
      <p>{city.eyebrow}</p>
      <div className="loc-city-foot">
        <span>{city.localityCount} localities</span>
        <span className="loc-city-arrow">Explore {city.city} →</span>
      </div>
    </Link>
  );
}
