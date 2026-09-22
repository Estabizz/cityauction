"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Calendar, MapPin, Building2, Clock, ArrowRight } from 'lucide-react';
import { cn, formatCurrency, formatDate, truncate } from '@/lib/utils';
import { Badge, AuctionStatusBadge } from '@/components/ui/badge';
import type { AuctionCardData, ViewMode } from '@/types';
import { Button } from '@/components/ui/button';

interface AuctionCardProps {
  auction: AuctionCardData;
  view?: ViewMode;
  onFavouriteToggle?: (id: string) => void;
}

export function AuctionCard({ auction, view = 'grid', onFavouriteToggle }: AuctionCardProps) {
  const isGrid = view === 'grid';
  const [isHovered, setIsHovered] = useState(false);

  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavouriteToggle) {
      onFavouriteToggle(auction.id);
    }
  };

  const CardContent = (
    <>
      <div className={cn("relative overflow-hidden group/image shrink-0", isGrid ? "aspect-[4/3] w-full" : "w-full md:w-[280px] h-[200px] md:h-full")}>
        {auction.primaryImage ? (
          <img
            src={auction.primaryImage}
            alt={auction.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105 bg-neutral-100"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        
        {/* Top Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-800 shadow-sm border-0">
            {auction.auctionType || 'General'}
          </Badge>
          <AuctionStatusBadge status={auction.status} className="shadow-sm border-0" />
        </div>

        {/* Favourite Button */}
        <button
          onClick={handleFavouriteClick}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-neutral-500 hover:text-red-500 transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label={auction.isFavourited ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className={cn("w-4 h-4", auction.isFavourited && "fill-red-500 text-red-500")} />
        </button>
      </div>

      <div className={cn("flex flex-col flex-grow", isGrid ? "p-4 space-y-4" : "p-4 sm:p-5 flex-grow space-y-4")}>
        {/* Header Info */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-1">
            <span className="flex items-center max-w-[50%] truncate">
              <Building2 className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span className="truncate">{auction.organizationName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center text-xs truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span className="truncate">{auction.city}, {auction.state}</span>
            </span>
          </div>
          
          <h3 className={cn("font-semibold text-neutral-900 group-hover/card:text-primary transition-colors line-clamp-2", isGrid ? "text-base" : "text-lg")}>
            {auction.title}
          </h3>
        </div>

        {/* Pricing */}
        <div className={cn("grid", isGrid ? "grid-cols-2 gap-3" : "grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6")}>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Reserve Price</p>
            <p className="font-semibold text-lg text-primary tabular-nums tracking-tight font-mono price-highlight">
              {formatCurrency(auction.reservePrice)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">EMD Amount</p>
            <p className="font-medium text-sm text-neutral-700 tabular-nums font-mono">
              {formatCurrency(auction.emd)}
            </p>
          </div>
          
          {!isGrid && (
            <>
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Auction Date</p>
                <div className="flex items-center text-sm font-medium text-neutral-900 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                  {formatDate(auction.startDateTime)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Possession</p>
                <div className="flex items-center text-sm font-medium text-neutral-900">
                  <span className="truncate">{auction.possessionStatus}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dates & Footer for Grid View */}
        {isGrid && (
          <div className="space-y-2 pt-3 border-t border-neutral-100 mt-auto">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Auction Date
              </span>
              <span className="font-medium text-neutral-900 tabular-nums">{formatDate(auction.startDateTime)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Submission
              </span>
              <span className="font-medium text-neutral-900 tabular-nums">{formatDate(auction.submissionDeadline)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* List View Actions */}
      {!isGrid && (
        <div className="hidden sm:flex flex-col justify-center pr-5 pl-4 border-l border-neutral-100 min-w-[160px] shrink-0">
          <span className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-700 transition-colors w-full">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      )}
    </>
  );

  return (
    <Link 
      href={`/auctions/${auction.id}`}
      className={cn(
        "group/card block bg-white border border-neutral-200 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer",
        "hover:shadow-card hover:border-primary/20",
        isGrid ? "flex flex-col h-full w-full max-w-[360px]" : "flex flex-col md:flex-row w-full h-auto md:min-h-[200px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {CardContent}
    </Link>
  );
}
