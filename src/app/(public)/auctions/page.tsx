import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAuctions } from "@/services/auction.service";
import { AuctionFilters } from "@/components/auction/auction-filters";
import { AuctionResultsClient } from "@/components/auction/auction-results-client";
import type { AuctionFilters as FilterType } from "@/types";
import { cityPath, findCityByName } from "@/content/cities/paths";

export const metadata: Metadata = {
  title: "Bank Auction Properties Search",
  description:
    "Search verified Indian bank auction properties. Filter by state, city, property type, reserve price, and SARFAESI / DRT auction dates.",
};

interface PageProps {
  searchParams: Promise<{
    state?: string;
    city?: string;
    district?: string;
    category?: string;
    type?: string;
    auctionType?: string;
    status?: string;
    possession?: string;
    minPrice?: string;
    maxPrice?: string;
    keyword?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function AuctionsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const filters: FilterType = {
    state: resolvedParams.state,
    city: resolvedParams.city,
    district: resolvedParams.district,
    category: resolvedParams.category,
    // Links use either ?type= or ?auctionType= (homepage search, footer).
    auctionType: resolvedParams.type || resolvedParams.auctionType,
    status: resolvedParams.status,
    possession: resolvedParams.possession,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    keyword: resolvedParams.keyword,
    sort: resolvedParams.sort || "date_asc",
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: 12,
  };

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
            Browse verified SARFAESI, DRT, and NPA properties on public auction
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
                activeFilters={resolvedParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
