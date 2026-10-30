"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Building2, Clock, ArrowRight } from 'lucide-react';
import { SaveListingButton } from '@/components/account/save-listing-button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge, AuctionStatusBadge } from '@/components/ui/badge';
import type { AuctionCardData, ViewMode } from '@/types';

interface AuctionCardProps {
  auction: AuctionCardData;
  view?: ViewMode;
}

export function AuctionCard({ auction, view = 'grid' }: AuctionCardProps) {
  const isGrid = view === 'grid';

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
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-800 shadow-sm border-0">
            {auction.auctionType || 'General'}
          </Badge>
          <AuctionStatusBadge status={auction.status} className="shadow-sm border-0" />
        </div>

        {/* Save to account */}
        <SaveListingButton auctionId={auction.id} className="absolute bottom-3 right-3 z-20" />
      </div>

      <div className={cn("flex flex-col flex-grow", isGrid ? "p-5 space-y-4" : "p-4 sm:p-5 flex-grow space-y-4")}>
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
          
          <h3 className={cn("font-semibold tracking-tight text-[#182129] group-hover/card:text-[#84663c] transition-colors line-clamp-2", isGrid ? "text-base" : "text-lg")}>
            {auction.title}
          </h3>
        </div>

        {/* Pricing */}
        <div className={cn("grid", isGrid ? "grid-cols-2 gap-3" : "grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#7a8590]">Reserve price</p>
            <p className="font-semibold text-xl text-[#182129] tabular-nums tracking-tight price-highlight">
              {formatCurrency(auction.reservePrice)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#7a8590]">EMD amount</p>
            <p className="font-medium text-sm text-neutral-700 tabular-nums">
              {formatCurrency(auction.emd)}
            </p>
          </div>
          
          {!isGrid && (
            <>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#7a8590]">Auction date</p>
                <div className="flex items-center text-sm font-medium text-neutral-900 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                  {formatDate(auction.startDateTime)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#7a8590]">Possession</p>
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
                Auction date
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
            <p className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#84663c]">View property<ArrowRight className="h-3.5 w-3.5" /></p>
          </div>
        )}
      </div>
      
      {/* List View Actions */}
      {!isGrid && (
        <div className="hidden sm:flex flex-col justify-center pr-5 pl-4 border-l border-neutral-100 min-w-[160px] shrink-0">
          <span className="inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold rounded-xl bg-[#132330] text-white hover:bg-[#253b4b] transition-colors w-full">
            View property
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      )}
    </>
  );

  return (
    <article
      className={cn(
        "group/card relative block bg-white border border-[#e4e8ec] rounded-3xl overflow-hidden transition-all duration-200 cursor-pointer",
        "hover:shadow-[0_8px_40px_-20px_rgba(24,33,41,0.18)] hover:border-[#cbd4dc]",
        isGrid ? "flex flex-col h-full w-full" : "flex flex-col md:flex-row w-full h-auto md:min-h-[200px]"
      )}
    >
      <Link href={`/auctions/${auction.id}`} aria-label={`View property: ${auction.title}`} className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84663c]" />
      {CardContent}
    </article>
  );
}
