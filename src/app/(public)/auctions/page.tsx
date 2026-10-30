import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAuctions } from "@/services/auction.service";
import { AuctionFilters } from "@/components/auction/auction-filters";
import { AuctionResultsClient } from "@/components/auction/auction-results-client";
import { z } from "zod";
import { parseAuctionSearchParams } from "@/lib/auction-search";
import { cityPath, findCityByName } from "@/content/cities/paths";

export const metadata: Metadata = {
  title: "Bank Auction Properties Search",
  description:
    "Search published Indian bank auction notices. Filter by state, city, property type, reserve price, and SARFAESI / DRT auction dates.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AuctionsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const resolvedParams = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) if (value) query.set(key, value);
  let filters;
  try {
    filters = parseAuctionSearchParams(query);
    filters.limit = 12;
  } catch (error) {
    if (!(error instanceof z.ZodError)) throw error;
    return (
      <div className="container-wide py-12">
        <h1 className="text-2xl font-bold text-primary">Check your search filters</h1>
        <p role="alert" className="my-4 text-sm text-gray-700">{error.issues[0]?.message}</p>
        <Link href="/auctions" className="font-semibold text-primary underline">Clear filters and search again</Link>
      </div>
    );
  }

  const { data: auctions, pagination } = await getAuctions(filters);
  // When the city filter matches a published city page, link to it.
  const cityPage = findCityByName(resolvedParams.city);

  return (
    <div className="bg-surface min-h-screen py-8">
      <div className="container-wide">
        {/* Page Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-800 font-medium">Auctions</span>
            {resolvedParams.state && (
              <>
                {" "}
                &gt; <span className="text-primary font-medium">{resolvedParams.state}</span>
              </>
            )}
            {resolvedParams.category && (
              <>
                {" "}
                &gt;{" "}
                <span className="text-primary font-medium capitalize">
                  {resolvedParams.category.toLowerCase()}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bank Auction Properties
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse published SARFAESI, DRT, and NPA auction notices. Confirm details with the auctioning authority.
          </p>
          {cityPage && (
            <Link
              href={cityPath(cityPage)}
              className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#dbcba9] bg-[#fbf8f1] px-4 py-3 text-sm text-[#172b44] hover:border-[#b99b66]"
            >
              <span>
                Exploring <strong>{cityPage.city}</strong>? See localities, services and buyer guidance on our{" "}
                {cityPage.city} page.
              </span>
              <span className="font-semibold text-[#84663c]">Open {cityPage.city} page →</span>
            </Link>
          )}
        </div>

        {/* Main Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
              <AuctionFilters />
            </Suspense>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
              <AuctionResultsClient
                auctions={auctions}
                pagination={pagination}
                activeFilters={Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value?.toString()]))}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
