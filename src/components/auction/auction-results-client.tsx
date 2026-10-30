"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { activateDialog } from "@/lib/dialog-focus";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
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
  const filterPanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMobileFiltersOpen || !filterPanel.current) return;
    const cleanup = activateDialog(filterPanel.current, () => setIsMobileFiltersOpen(false));
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setIsMobileFiltersOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => { cleanup(); desktop.removeEventListener("change", onResize); };
  }, [isMobileFiltersOpen]);

  // Helper to remove an active filter chip
  const removeFilter = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    if (key === "type" || key === "auctionType") { params.delete("type"); params.delete("auctionType"); }
    if (key === "keyword" || key === "q") { params.delete("keyword"); params.delete("q"); }
    if (key === "state") { params.delete("city"); params.delete("district"); }
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
              className="inline-flex max-w-full min-w-0 items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-primary-50 text-primary border border-primary-100 font-medium"
            >
              <span className="capitalize">{k}:</span>
              <strong className="min-w-0 break-all">{v}</strong>
              <button
                type="button"
                onClick={() => removeFilter(k)}
                className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-primary-800 transition-colors cursor-pointer"
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
            No published auction notices found
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            No published notices match your current search. Try
            adjusting your budget, location, or clearing some filters.
          </p>
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Need help finding a property? <a href="/contact" className="font-semibold text-primary underline">Send your requirements</a>.
          </p>
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
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="text-xs text-gray-500">
            Page <strong className="text-gray-900">{pagination.page}</strong> of{" "}
            <strong className="text-gray-900">{pagination.totalPages}</strong>
          </div>

          <div className="flex max-w-full flex-wrap items-center justify-center gap-1">
            {/* Previous */}
            <button
              type="button"
              disabled={!pagination.hasPrev}
              onClick={() => goToPage(pagination.page - 1)}
              className="flex min-h-11 items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {/* Page buttons */}
            {[...new Set([1, pagination.page - 1, pagination.page, pagination.page + 1, pagination.totalPages])]
              .filter((p) => p >= 1 && p <= pagination.totalPages).sort((a, b) => a - b)
              .map((p, idx, arr) => (
                <span key={p} className="hidden sm:flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-xs text-gray-400">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToPage(p)}
                    aria-current={p === pagination.page ? "page" : undefined}
                    className={`h-11 w-11 rounded-lg text-xs font-semibold cursor-pointer ${
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
              className="flex min-h-11 items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFiltersOpen && createPortal(
        <div className="fixed inset-0 z-[80] lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Slide-over panel */}
          <div ref={filterPanel} role="dialog" aria-modal="true" aria-labelledby="mobile-filter-heading" tabIndex={-1} className="relative ml-auto flex h-dvh w-full max-w-sm flex-col bg-white p-4 shadow-2xl z-10">
            <div className="shrink-0 flex items-center justify-between pb-4 border-b border-border mb-4">
              <span id="mobile-filter-heading" className="font-bold text-gray-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <AuctionFilters />
            </div>

            <div className="shrink-0 pt-4 border-t border-border mt-4 pb-[env(safe-area-inset-bottom)]">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="min-h-11 w-full py-2.5 bg-primary text-white font-semibold rounded-lg text-sm"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
