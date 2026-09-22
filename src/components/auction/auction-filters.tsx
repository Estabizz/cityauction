"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {
  PROPERTY_CATEGORIES,
  AUCTION_TYPES,
  AUCTION_STATUSES,
  POSSESSION_STATUSES,
  INDIAN_STATES,
  BUDGET_RANGES,
} from "@/lib/constants";

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, icon, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-sm text-gray-900 group cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span className="text-gray-400 group-hover:text-primary transition-colors">
            {icon}
          </span>
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function AuctionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState = searchParams.get("state") || "";
  const currentCity = searchParams.get("city") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentAuctionType = searchParams.get("type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentPossession = searchParams.get("possession") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentKeyword = searchParams.get("keyword") || "";

  const updateFilter = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset page on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters =
    Boolean(currentState) ||
    Boolean(currentCity) ||
    Boolean(currentCategory) ||
    Boolean(currentAuctionType) ||
    Boolean(currentStatus) ||
    Boolean(currentPossession) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    Boolean(currentKeyword);

  return (
    <aside className="bg-white rounded-xl border border-border p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div className="py-4 border-b border-border">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Keyword / Auction ID
        </label>
        <input
          type="text"
          placeholder="e.g. Bandra, SARB, 3 BHK..."
          defaultValue={currentKeyword}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("keyword", e.currentTarget.value);
            }
          }}
          onBlur={(e) => updateFilter("keyword", e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-gray-50 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Location */}
      <FilterSection
        title="Location"
        icon={<MapPin className="h-4 w-4" />}
        defaultOpen={true}
      >
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">State</label>
            <select
              value={currentState}
              onChange={(e) => updateFilter("state", e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-gray-50 px-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All States / UTs</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">City / District</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Pune..."
              defaultValue={currentCity}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("city", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateFilter("city", e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-gray-50 px-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection
        title="Property Type"
        icon={<Layers className="h-4 w-4" />}
        defaultOpen={true}
      >
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary">
            <input
              type="radio"
              name="category"
              checked={!currentCategory}
              onChange={() => updateFilter("category", null)}
              className="text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>All Categories</span>
          </label>
          {PROPERTY_CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary"
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={currentCategory === cat.value}
                onChange={() => updateFilter("category", cat.value)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reserve Price Range */}
      <FilterSection
        title="Reserve Price"
        icon={<IndianRupee className="h-4 w-4" />}
        defaultOpen={true}
      >
        <div className="space-y-2">
          {/* Quick preset ranges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {BUDGET_RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  const [min, max] = r.value.split("-");
                  const params = new URLSearchParams(searchParams.toString());
                  if (min) params.set("minPrice", min);
                  else params.delete("minPrice");
                  if (max) params.set("maxPrice", max);
                  else params.delete("maxPrice");
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className="px-2 py-1 text-[10px] bg-gray-100 hover:bg-primary-50 hover:text-primary rounded text-gray-700 font-medium transition-colors cursor-pointer"
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Min (₹)</label>
              <input
                type="number"
                placeholder="0"
                defaultValue={currentMinPrice}
                onBlur={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full h-8 rounded border border-border bg-gray-50 px-2 text-xs tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Max (₹)</label>
              <input
                type="number"
                placeholder="Any"
                defaultValue={currentMaxPrice}
                onBlur={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full h-8 rounded border border-border bg-gray-50 px-2 text-xs tabular-nums"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Auction Status */}
      <FilterSection
        title="Auction Status"
        icon={<Calendar className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary">
            <input
              type="radio"
              name="status"
              checked={!currentStatus}
              onChange={() => updateFilter("status", null)}
              className="text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>All Statuses</span>
          </label>
          {AUCTION_STATUSES.map((st) => (
            <label
              key={st.value}
              className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary"
            >
              <input
                type="radio"
                name="status"
                value={st.value}
                checked={currentStatus === st.value}
                onChange={() => updateFilter("status", st.value)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>{st.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Auction Legal Type */}
      <FilterSection
        title="Auction Legal Type"
        icon={<Building2 className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary">
            <input
              type="radio"
              name="auctionType"
              checked={!currentAuctionType}
              onChange={() => updateFilter("type", null)}
              className="text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>All Types</span>
          </label>
          {AUCTION_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary"
            >
              <input
                type="radio"
                name="auctionType"
                value={t.value}
                checked={currentAuctionType === t.value}
                onChange={() => updateFilter("type", t.value)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Possession Status */}
      <FilterSection
        title="Possession Status"
        icon={<ShieldCheck className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary">
            <input
              type="radio"
              name="possession"
              checked={!currentPossession}
              onChange={() => updateFilter("possession", null)}
              className="text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>Any Possession</span>
          </label>
          {POSSESSION_STATUSES.map((pos) => (
            <label
              key={pos.value}
              className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-primary"
            >
              <input
                type="radio"
                name="possession"
                value={pos.value}
                checked={currentPossession === pos.value}
                onChange={() => updateFilter("possession", pos.value)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>{pos.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
