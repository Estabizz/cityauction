"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Trash2, ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string>;
  filterSummary: string;
  frequency: "INSTANT" | "DAILY" | "WEEKLY";
  matchCount: number;
  lastRun: string;
}

const INITIAL_SEARCHES: SavedSearch[] = [
  {
    id: "ss-1",
    name: "Mumbai & Thane Residential Apartments",
    filters: { state: "Maharashtra", city: "Mumbai", category: "RESIDENTIAL" },
    filterSummary: "State: Maharashtra, City: Mumbai, Type: Residential",
    frequency: "DAILY",
    matchCount: 14,
    lastRun: "2 hours ago",
  },
  {
    id: "ss-2",
    name: "Commercial Offices Under ₹5 Crore",
    filters: { category: "COMMERCIAL", maxPrice: "50000000" },
    filterSummary: "Category: Commercial, Max Price: ₹5.00 Cr",
    frequency: "INSTANT",
    matchCount: 8,
    lastRun: "15 mins ago",
  },
  {
    id: "ss-3",
    name: "Bangalore & Karnataka SARFAESI Auctions",
    filters: { state: "Karnataka", type: "SARFAESI" },
    filterSummary: "State: Karnataka, Legal Type: SARFAESI",
    frequency: "DAILY",
    matchCount: 6,
    lastRun: "Yesterday",
  },
];

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>(INITIAL_SEARCHES);

  const handleDelete = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  const toggleFrequency = (id: string) => {
    setSearches(
      searches.map((s) => {
        if (s.id !== id) return s;
        const nextFreq: Record<string, "INSTANT" | "DAILY" | "WEEKLY"> = {
          INSTANT: "DAILY",
          DAILY: "WEEKLY",
          WEEKLY: "INSTANT",
        };
        return { ...s, frequency: nextFreq[s.frequency] };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Searches & Email Alerts</h1>
          <p className="text-xs text-gray-500 mt-1">
            Receive automated notifications when banks publish new auctions matching your search criteria
          </p>
        </div>

        <Link
          href="/auctions"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors self-start sm:self-auto"
        >
          <Search className="h-3.5 w-3.5" />
          Create New Search
        </Link>
      </div>

      {searches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">No saved searches</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Configure filters on the auction search page and click &quot;Save Search&quot; to get alert emails.
          </p>
          <Link
            href="/auctions"
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Search
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((item) => {
            const queryParams = new URLSearchParams(item.filters).toString();
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary border border-primary-100">
                      {item.matchCount} New Matching Properties
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{item.filterSummary}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Checked {item.lastRun}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {/* Alert frequency toggle */}
                  <button
                    type="button"
                    onClick={() => toggleFrequency(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-gray-50 text-xs text-gray-700 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Click to change alert frequency"
                  >
                    <Bell className="h-3.5 w-3.5 text-primary" />
                    <span>Alert: {item.frequency}</span>
                  </button>

                  {/* Run Search */}
                  <Link
                    href={`/auctions?${queryParams}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <span>Run Search</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-error hover:bg-error-50 transition-colors cursor-pointer"
                    title="Delete saved search"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
