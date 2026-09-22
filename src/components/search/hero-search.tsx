"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { PROPERTY_CATEGORIES, AUCTION_TYPES, BUDGET_RANGES, INDIAN_STATES } from "@/lib/constants";
import { buildQueryString } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    state: "",
    category: "",
    auctionType: "",
    budget: "",
  });

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (filters.state) params.state = filters.state;
    if (filters.category) params.category = filters.category;
    if (filters.auctionType) params.type = filters.auctionType;
    if (filters.budget) {
      const [min, max] = filters.budget.split("-");
      if (min) params.minPrice = min;
      if (max) params.maxPrice = max;
    }
    router.push(`/auctions${buildQueryString(params)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-modal">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onKeyDown={handleKeyDown}>
            {/* State */}
            <div className="relative">
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 px-1">
                Location
              </label>
              <select
                value={filters.state}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, state: e.target.value }))
                }
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 px-1">
                Property Type
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
              >
                <option value="">All Types</option>
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 px-1">
                Budget
              </label>
              <select
                value={filters.budget}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, budget: e.target.value }))
                }
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
              >
                <option value="">Any Budget</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex flex-col">
              <label className="block text-[11px] font-medium text-transparent mb-1.5 px-1 hidden md:block">
                &nbsp;
              </label>
              <button
                onClick={handleSearch}
                className="h-10 w-full bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          {/* Advanced search link */}
          <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => router.push("/auctions")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Advanced Search with more filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
