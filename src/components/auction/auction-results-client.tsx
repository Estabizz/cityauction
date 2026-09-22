"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  SlidersHorizontal,
  SearchX,
} from "lucide-react";
import { AuctionCard } from "./auction-card";
import { AuctionSortBar } from "./auction-sort-bar";
import { AuctionFilters } from "./auction-filters";
import type { AuctionCardData, ViewMode } from "@/types";

interface AuctionResultsClientProps {
  auctions: AuctionCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  activeFilters: Record<string, string | undefined>;
}

export function AuctionResultsClient({
  auctions,
  pagination,
  activeFilters,
}: AuctionResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Helper to remove an active filter chip
  const removeFilter = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper for pagination navigation
  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Active filter keys to show as chips
  const activeChips = Object.entries(activeFilters).filter(
    ([k, v]) => Boolean(v) && k !== "page" && k !== "sort" && k !== "limit"
  );

  return (
    <>
      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-xl border border-border">
          <span className="text-xs font-semibold text-gray-500 mr-1">
            Active filters:
          </span>
          {activeChips.map(([k, v]) => (
            <span
              key={k}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-primary-50 text-primary border border-primary-100 font-medium"
            >
              <span className="capitalize">{k}:</span>
              <strong>{v}</strong>
              <button
                type="button"
                onClick={() => removeFilter(k)}
                className="hover:text-primary-800 transition-colors cursor-pointer"
                aria-label={`Remove filter ${k}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-xs text-error font-medium hover:underline ml-auto cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Sort Bar */}
      <AuctionSortBar
        totalCount={pagination.total}
        currentCount={auctions.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
      />

      {/* Empty State */}
      {auctions.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No auction properties found
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            We couldn&apos;t find any properties matching your current filter criteria. Try
            adjusting your budget, location, or clearing some filters.
          </p>
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Results Grid/List */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              view={viewMode}
              onFavouriteToggle={(id) => {
                // Future toggle handler
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="text-xs text-gray-500">
            Page <strong className="text-gray-900">{pagination.page}</strong> of{" "}
            <strong className="text-gray-900">{pagination.totalPages}</strong>
          </div>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              disabled={!pagination.hasPrev}
              onClick={() => goToPage(pagination.page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {/* Page buttons */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                const current = pagination.page;
                return p === 1 || p === pagination.totalPages || Math.abs(p - current) <= 1;
              })
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-xs text-gray-400">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold cursor-pointer ${
                      p === pagination.page
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            {/* Next */}
            <button
              type="button"
              disabled={!pagination.hasNext}
              onClick={() => goToPage(pagination.page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-5 shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <span className="font-bold text-gray-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1">
              <AuctionFilters />
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg text-sm"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
