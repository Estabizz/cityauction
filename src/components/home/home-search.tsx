"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PROPERTY_CATEGORIES, AUCTION_TYPES } from "@/lib/constants";
import { BUDGET_RANGES } from "@/lib/buyer";
import { CITY_LIST } from "@/content/cities/list";
import { homeSearchHref } from "@/lib/home-search";
import { inputClass, primaryButtonClass } from "@/components/ui/styles";

const cityGroups = Object.entries(CITY_LIST.reduce<Record<string, typeof CITY_LIST>>((groups, city) => {
  (groups[city.state] ??= []).push(city); return groups;
}, {})).sort(([a], [b]) => a.localeCompare(b));

export function HomeSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState({ location: "", category: "", budget: "", channel: "" });
  const update = (key: keyof typeof filters) => (e: React.ChangeEvent<HTMLSelectElement>) => setFilters((value) => ({ ...value, [key]: e.target.value }));
  const labelClass = "mb-2 block text-sm font-medium text-[#182129]";
  return <form aria-labelledby="home-search-heading" className="rounded-3xl border border-white/40 bg-white p-5 text-[#182129] shadow-2xl shadow-black/15 sm:p-7" onSubmit={(e) => { e.preventDefault(); router.push(homeSearchHref(filters)); }}>
    <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#84663c]">Find an opportunity</p>
    <h2 id="home-search-heading" className="mt-2 text-2xl font-semibold tracking-tight">What are you looking for?</h2>
    <p className="mt-2 text-sm leading-relaxed text-[#687480]">Choose a location, asset type or budget.</p>
    <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0"><label className={labelClass} htmlFor="home-location">Location</label><select id="home-location" className={inputClass} value={filters.location} onChange={update("location")}><option value="">All locations</option>{cityGroups.map(([state, cities]) => <optgroup key={state} label={state}>{cities.map((city) => <option key={city.slug} value={city.slug}>{city.city}</option>)}</optgroup>)}</select></div>
      <div className="min-w-0"><label className={labelClass} htmlFor="home-category">Asset type</label><select id="home-category" className={inputClass} value={filters.category} onChange={update("category")}><option value="">All asset types</option>{PROPERTY_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.value === "OTHER" ? "Other assets" : item.label}</option>)}</select></div>
      <div className="min-w-0"><label className={labelClass} htmlFor="home-budget">Budget</label><select id="home-budget" className={inputClass} value={filters.budget} onChange={update("budget")}><option value="">Any budget</option>{BUDGET_RANGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
      <div className="min-w-0"><label className={labelClass} htmlFor="home-channel">Auction channel</label><select id="home-channel" className={inputClass} value={filters.channel} onChange={update("channel")}><option value="">All channels</option>{AUCTION_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
    </div>
    <button type="submit" className={`${primaryButtonClass} mt-6 w-full`}><Search className="h-4 w-4" />Search auctions</button>
    <Link href="/locations" className="mt-3 flex min-h-11 items-center justify-center text-center text-sm font-medium text-[#84663c] underline-offset-4 hover:underline">Browse locations by state and city →</Link>
    <p className="mt-2 text-center text-xs leading-relaxed text-[#7a8590]">Check the official notice for dates, terms and availability.</p>
  </form>;
}
