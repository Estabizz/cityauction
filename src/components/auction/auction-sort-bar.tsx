"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";
import type { ViewMode } from "@/types";

interface AuctionSortBarProps {
  totalCount: number;
  currentCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
}

export function AuctionSortBar({
  totalCount,
  currentCount,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
}: AuctionSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "date_asc";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
      {/* Result stats */}
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <span>
          Showing <strong className="text-gray-900 font-semibold">{currentCount}</strong> of{" "}
          <strong className="text-gray-900 font-semibold">{totalCount}</strong> auction properties
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Mobile Filter Button */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <div className="flex items-center gap-2">
          {/* Sort Select */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="hidden md:inline">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Sort auctions"
              className="h-9 rounded-lg border border-border bg-gray-50 px-3 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle (Grid / List) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5 border border-border">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
