"use client";

import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { activateDialog } from "@/lib/dialog-focus";
import Link from "next/link";
import { auctionFilterLabel, auctionSearchHref, removeAuctionFilter } from "@/lib/auction-discovery-ui";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  unavailable?: boolean;
}

export function AuctionResultsClient({
  auctions,
  pagination,
  activeFilters,
  unavailable = false,
}: AuctionResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const mobileFormId = useId();
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
    const params = removeAuctionFilter(searchParams.toString(), key);
    router.push(auctionSearchHref(pathname, params), { scroll: false });
  };

  // Helper for pagination navigation
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(auctionSearchHref(pathname, params));
  };

  // Active filter keys to show as chips
  const activeChips = Object.entries(activeFilters).filter(
    ([k, v]) => Boolean(v) && k !== "page" && k !== "sort" && k !== "limit"
  );

  return (
    <>
      <h2 className="sr-only">Auction results</h2>
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
              <span className="min-w-0 break-words">{auctionFilterLabel(k, v!)}</span>
              <button
                type="button"
                onClick={() => removeFilter(k)}
                className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-primary-800 transition-colors cursor-pointer"
                aria-label={`Remove ${auctionFilterLabel(k, v!)}`}
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

      {!unavailable && <p role="status" aria-live="polite" className="sr-only">{pagination.total} auction notices found. Page {pagination.page} of {pagination.totalPages}.</p>}
      {/* Sort Bar */}
      <AuctionSortBar
        totalCount={pagination.total}
        currentCount={auctions.length}
        page={pagination.page}
        limit={pagination.limit}
        activeFilterCount={activeChips.length}
        unavailable={unavailable}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
      />

      {/* Empty State */}
      {unavailable ? (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-10 text-center">
          <h2 className="text-lg font-semibold text-[#182129]">Auction listings couldn’t be loaded</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#46525d]">Please try again. Your search filters are still here.</p>
          <button type="button" onClick={() => router.refresh()} className="mt-5 min-h-11 rounded-xl bg-[#132330] px-5 py-3 text-sm font-semibold text-white">Try again</button>
          <Link href="/contact" className="ml-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#84663c] underline">Contact team</Link>
        </div>
      ) : auctions.length === 0 ? (
        <div role="status" className="bg-white rounded-2xl border border-border px-5 py-10 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {activeChips.length ? "No auctions match your filters" : "No auction notices available yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            {activeChips.length ? "Try a wider budget, another location or fewer filters." : "Published, source-checked notices will appear here when available. Share your requirements with our team in the meantime."}
          </p>
          {activeChips.length > 0 && <button
            type="button"
            onClick={() => router.push(pathname)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Clear filters
          </button>}
          <p className="mt-4 text-sm text-gray-600">
            Need help finding a property? <Link href="/contact" className="font-semibold text-primary underline">Send your requirements</Link>.
          </p>
        </div>
      ) : (
        /* Results Grid/List */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5"
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
      {!unavailable && pagination.totalPages > 1 && (
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
              <AuctionFilters formId={mobileFormId} onApply={() => setIsMobileFiltersOpen(false)} />
            </div>
            <div className="shrink-0 border-t border-border pt-3 pb-[env(safe-area-inset-bottom)]">
              <button type="submit" form={mobileFormId} className="min-h-11 w-full rounded-xl bg-[#132330] px-4 py-3 text-sm font-semibold text-white">Apply filters</button>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
