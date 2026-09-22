"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, Building2, MapPin, Search } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AuctionStatusBadge } from "@/components/ui/badge";
import { MOCK_AUCTIONS } from "@/services/mock-data";

export default function FavouritesPage() {
  const [items, setItems] = useState(MOCK_AUCTIONS.slice(0, 4));

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Properties & Watchlist</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track upcoming auctions, monitoring price changes, and tender submission deadlines
          </p>
        </div>

        <Link
          href="/auctions"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors self-start sm:self-auto"
        >
          <Search className="h-3.5 w-3.5" />
          Find More Properties
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Your watchlist is empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Click the heart icon on any auction card to save properties here for quick tracking.
          </p>
          <Link
            href="/auctions"
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Explore Auctions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((auc) => (
            <div
              key={auc.id}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  {auc.primaryImage && (
                    <img src={auc.primaryImage} alt={auc.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-gray-800 shadow-sm">
                      {auc.auctionType}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(auc.id)}
                      className="p-1.5 rounded-full bg-white/95 text-gray-500 hover:text-error hover:bg-white shadow-sm transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-primary">{auc.organizationName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {auc.city}, {auc.state}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                    {auc.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Reserve Price</span>
                      <span className="font-mono font-bold text-primary text-base">
                        {formatCurrency(auc.reservePrice)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Auction Date</span>
                      <span className="font-semibold text-gray-800 text-xs">
                        {formatDate(auc.startDateTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/auctions/${auc.id}`}
                  className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-primary text-xs font-semibold rounded-lg border border-border hover:border-primary transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
