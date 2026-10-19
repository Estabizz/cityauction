"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AuctionCard } from "@/components/auction/auction-card";
import type { AuctionCardData } from "@/types";
import type { CityPage } from "@/content/cities";

// Finder labels on the city pages map onto PropertyCategoryType values.
const TYPE_TO_CATEGORIES: Record<string, string[]> = {
  Residential: ["RESIDENTIAL"],
  Commercial: ["COMMERCIAL"],
  Industrial: ["INDUSTRIAL"],
  Logistics: ["INDUSTRIAL", "COMMERCIAL"],
  "Land / Plot": ["LAND", "AGRICULTURAL"],
};

type SortKey = "date" | "priceAsc" | "priceDesc";

interface CityAuctionFinderProps {
  page: Pick<CityPage, "city" | "finder" | "listings">;
  localities: string[];
  auctions: AuctionCardData[];
}

export function CityAuctionFinder({ page, localities, auctions }: CityAuctionFinderProps) {
  const { city, finder, listings } = page;
  const [locality, setLocality] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [lender, setLender] = useState("");
  const [sort, setSort] = useState<SortKey>("date");

  const results = useMemo(() => {
    const categories = TYPE_TO_CATEGORIES[propertyType];
    const lenderQuery = lender.trim().toLowerCase();
    const localityQuery = locality.toLowerCase();

    const filtered = auctions.filter(
      (a) =>
        (!localityQuery || a.title.toLowerCase().includes(localityQuery)) &&
        (!categories || categories.includes(a.categoryType)) &&
        (!lenderQuery || a.organizationName.toLowerCase().includes(lenderQuery))
    );

    return filtered.sort((a, b) => {
      if (sort === "priceAsc") return parseFloat(a.reservePrice) - parseFloat(b.reservePrice);
      if (sort === "priceDesc") return parseFloat(b.reservePrice) - parseFloat(a.reservePrice);
      return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
    });
  }, [auctions, locality, propertyType, lender, sort]);

  const hasFilters = Boolean(locality || propertyType || lender.trim());

  const clearFilters = () => {
    setLocality("");
    setPropertyType("");
    setLender("");
  };

  const countLabel =
    results.length === 0
      ? `No current ${city} listings${hasFilters ? " match these filters" : ""}`
      : results.length === 1
        ? `1 ${city} property ${hasFilters ? "matches" : "listed"}`
        : `${results.length} ${city} properties ${hasFilters ? "match" : "listed"}`;

  return (
    <>
      <div className="city-section-head">
        <div className="city-eyebrow">{finder.eyebrow}</div>
        <h2>{finder.title}</h2>
        <p>{finder.description}</p>
      </div>

      <form
        className="city-finder"
        role="search"
        aria-label={`Search ${city} auction properties`}
        onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("property-results")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <div className="city-finder-fields">
          <div className="city-field">
            <label htmlFor="city-locality">{finder.localityLabel}</label>
            <select id="city-locality" value={locality} onChange={(e) => setLocality(e.target.value)}>
              <option value="">{finder.localityAll}</option>
              {localities.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="city-field">
            <label htmlFor="city-type">Property type</label>
            <select id="city-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="">All asset types</option>
              {finder.propertyTypes.map((type) => (
                <option key={type.label} value={type.label}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="city-field">
            <label htmlFor="city-lender">Bank or lender</label>
            <input
              id="city-lender"
              type="search"
              autoComplete="off"
              placeholder={finder.lenderPlaceholder}
              value={lender}
              onChange={(e) => setLender(e.target.value)}
            />
          </div>
        </div>
        <div className="city-finder-foot">
          <span>{finder.footnote}</span>
          <button className="city-btn" type="submit">
            Find Properties →
          </button>
        </div>
        <div className="city-finder-tools">
          <span>Only current and verified property records are shown.</span>
          <button type="button" className="city-clear" onClick={clearFilters} disabled={!hasFilters}>
            Clear filters
          </button>
        </div>
      </form>

      <section aria-labelledby="city-results-title" className="city-results" id="property-results">
        <div className="city-eyebrow">{listings.eyebrow}</div>
        <h2 id="city-results-title">{listings.title}</h2>
        <p className="city-results-lead">{listings.description}</p>

        <div className="city-resultbar">
          <strong aria-live="polite">{countLabel}</strong>
          <label>
            Sort properties:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="date">Upcoming auction date</option>
              <option value="priceAsc">Reserve price: low to high</option>
              <option value="priceDesc">Reserve price: high to low</option>
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <div className="city-listing-grid">
            {results.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="city-result-state" role="status">
            <strong>{hasFilters ? "No matching properties right now" : `No verified ${city} listings yet`}</strong>
            <p>
              {hasFilters
                ? `No current ${city} auction records match these filters. Clear the filters or browse the full marketplace.`
                : `Verified ${city} bank auction listings will appear here as soon as they are published. Meanwhile, browse the full marketplace or set up an auction alert.`}
            </p>
            <div className="city-result-actions">
              {hasFilters && (
                <button type="button" className="city-btn city-btn-outline" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
              <Link className="city-btn city-btn-outline" href="/auction-alerts">
                Create an auction alert ↗
              </Link>
            </div>
          </div>
        )}

        <div className="city-source-disclaimer">{listings.disclaimer}</div>

        <div className="city-marketcall">
          <div>
            <strong>{listings.marketTitle}</strong>
            <p>{listings.marketDescription}</p>
          </div>
          <Link className="city-btn" href="/auctions">
            {listings.marketLabel} ↗
          </Link>
        </div>
      </section>
    </>
  );
}
