"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { SaveListingButton } from "@/components/account/save-listing-button";
import { cn } from "@/lib/utils";
import { auctionDate, auctionMoney } from "@/lib/auction-discovery-ui";
import { POSSESSION_STATUSES, AUCTION_TYPES } from "@/lib/constants";
import { Badge, AuctionStatusBadge } from "@/components/ui/badge";
import type { AuctionCardData, ViewMode } from "@/types";

export function AuctionCard({ auction, view = "grid" }: { auction: AuctionCardData; view?: ViewMode }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const isGrid = view === "grid";
  const possession = POSSESSION_STATUSES.find((item) => item.value === auction.possessionStatus)?.label ?? "Possession not specified";
  const type = AUCTION_TYPES.find((item) => item.value === auction.auctionType)?.label ?? "Other";
  return <article className={cn("group/card relative min-w-0 overflow-hidden rounded-2xl border border-[#e4e8ec] bg-white transition hover:border-[#b59461] hover:shadow-md", isGrid ? "flex h-full flex-col" : "grid sm:grid-cols-[200px_minmax(0,1fr)]")}>
    <div className={cn("relative min-w-0 overflow-hidden bg-[#edf1f4]", isGrid ? "aspect-[4/3]" : "aspect-[16/9] sm:aspect-auto sm:min-h-64")}>
      {auction.primaryImage && failedImage !== auction.primaryImage ?
        // Original notice images may be hosted by multiple auction authorities.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={auction.primaryImage} alt={auction.title} loading="lazy" decoding="async" width={640} height={480}
          onError={() => setFailedImage(auction.primaryImage)} className="absolute inset-0 h-full w-full object-cover" /> :
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#687480]"><Building2 aria-hidden="true" className="h-10 w-10" /><span className="text-xs">Photo not available</span></div>}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap justify-between gap-2">
        <Badge variant="secondary" className="bg-white/95 text-[#182129]">{type}</Badge><AuctionStatusBadge status={auction.status} />
      </div>
      <SaveListingButton auctionId={auction.id} propertyTitle={auction.title} className="absolute bottom-3 right-3 z-20" />
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-medium text-[#84663c]">{auction.categoryName}</p>
        <h3 className="break-words text-lg font-semibold leading-snug text-[#182129] group-hover/card:text-[#84663c]">
          <Link href={`/auctions/${encodeURIComponent(auction.id)}`} aria-label={`View property: ${auction.title}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]">{auction.title}</Link>
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-[#687480]"><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{auction.city}, {auction.state}</span></p>
        <p className="mt-1 break-words text-xs text-[#687480]">{auction.organizationName} · {auction.auctionNumber}</p>
      </div>
      <dl className="space-y-2">
        <div><dt className="text-xs text-[#687480]">Reserve price</dt><dd className="break-words text-xl font-semibold tabular-nums text-[#182129]">{auctionMoney(auction.reservePrice)}</dd></div>
        <div className="flex flex-wrap justify-between gap-1 text-sm"><dt className="text-[#687480]">EMD</dt><dd className="break-words font-medium tabular-nums">{auctionMoney(auction.emd)}</dd></div>
      </dl>
      <dl className="mt-auto space-y-2 border-t border-[#e4e8ec] pt-3 text-xs">
        {[["Auction starts", auction.startDateTime], ["Auction ends", auction.endDateTime], ["Apply by", auction.submissionDeadline]].map(([label, value]) =>
          <div key={label} className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-[#687480]">{label}</dt><dd className="font-medium tabular-nums text-[#182129]"><time dateTime={value}>{auctionDate(value, true)}</time></dd></div>)}
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-[#687480]">Possession</dt><dd className="font-medium text-[#182129]">{possession}</dd></div>
      </dl>
      <p className="flex items-center gap-2 text-sm font-semibold text-[#84663c]">View property<ArrowRight aria-hidden="true" className="h-4 w-4" /></p>
    </div>
  </article>;
}
