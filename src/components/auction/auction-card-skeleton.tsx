import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

interface AuctionCardSkeletonProps {
  view?: ViewMode;
}

export function AuctionCardSkeleton({ view = 'grid' }: AuctionCardSkeletonProps) {
  const isGrid = view === 'grid';

  if (isGrid) {
    return (
      <div className="w-full max-w-[360px] h-full bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
        {/* Image Skeleton */}
        <div className="relative aspect-[4/3] w-full shrink-0">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Skeleton className="h-6 w-16 rounded-md bg-white/50" />
            <Skeleton className="h-6 w-20 rounded-md bg-white/50" />
          </div>
          <Skeleton className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/50" />
        </div>

        {/* Content Skeleton */}
        <div className="p-4 flex flex-col space-y-4 flex-grow">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-2" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Footer Dates */}
          <div className="space-y-3 pt-4 border-t border-neutral-100 mt-auto">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View Skeleton
  return (
    <div className="w-full flex flex-col md:flex-row bg-white border border-neutral-200 rounded-xl overflow-hidden h-auto md:min-h-[200px]">
      {/* Image Skeleton */}
      <div className="relative w-full md:w-[280px] h-[200px] md:h-full shrink-0">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Skeleton className="h-6 w-16 rounded-md bg-white/50" />
          <Skeleton className="h-6 w-20 rounded-md bg-white/50" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-full max-w-lg" />
          <Skeleton className="h-6 w-3/4 max-w-md" />
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1.5 hidden sm:block">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1.5 hidden sm:block">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>

      {/* Action Button Skeleton */}
      <div className="hidden sm:flex flex-col justify-center pr-5 pl-4 border-l border-neutral-100 min-w-[160px] shrink-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
