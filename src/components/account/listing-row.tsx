import Link from "next/link";
import { Building2, CalendarDays, MapPin } from "lucide-react";
import { AuctionStatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SaveListingButton } from "./save-listing-button";

export type ListingRowData = {
  id: string;
  auctionNumber: string;
  status: string;
  reservePrice: { toString(): string };
  startDateTime: Date;
  sourceVerifiedAt?: Date | null;
  property: {
    title: string;
    images: { url: string }[];
    category: { name: string } | null;
    location: { name: string } | null;
  };
  organization: { name: string };
};

// Compact listing for dashboard lists (matches, saved properties).
export function ListingRow({ listing, label, showVerified = false }: { listing: ListingRowData; label?: string; showVerified?: boolean }) {
  const image = listing.property.images[0]?.url;
  return (
    <article className="relative flex gap-4 p-3 sm:p-4 rounded-2xl border border-[#e4e8ec] bg-white hover:border-[#cbd4dc] transition-colors">
      <Link href={`/auctions/${listing.id}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-[#f1f4f6] flex items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <Building2 className="h-8 w-8 text-[#c9bfae]" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <AuctionStatusBadge status={listing.status} />
          {label && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f5edd3] text-[#5e4a2b] text-[10px] font-bold uppercase tracking-wider">{label}</span>}
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-[#091118] leading-snug line-clamp-2 pr-10">
          <Link href={`/auctions/${listing.id}`} className="hover:text-[#84663c]">
            {listing.property.title}
          </Link>
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#59636a]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {listing.property.location?.name || "India"}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {formatDate(listing.startDateTime)}
          </span>
          <span>{listing.organization.name}</span>
        </p>
        <p className="mt-1.5 text-sm font-bold text-[#091118] tabular-nums">
          {formatCurrency(listing.reservePrice.toString())} <span className="text-[11px] font-normal text-[#7e868b]">reserve</span>
        </p>
        {showVerified && (
          <p className="mt-1 text-[11px] text-[#7e868b]">
            {listing.sourceVerifiedAt ? `Source last verified ${formatDate(listing.sourceVerifiedAt)}` : "Source not yet re-verified"} · {listing.auctionNumber}
          </p>
        )}
      </div>
      <SaveListingButton auctionId={listing.id} className="absolute top-3 right-3 border border-[#efe9df]" />
    </article>
  );
}
