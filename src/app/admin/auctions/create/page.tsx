import type { Metadata } from "next";
import Link from "next/link";
import { MarketplaceEmpty, MarketplacePage } from "@/components/admin/marketplace";

export const metadata: Metadata = { title: "Publish auction" };

// The old page was a form that saved nothing. Say so instead of pretending.
export default function AdminCreateAuctionPage() {
  return (
    <MarketplacePage
      title="Publish an auction"
      description="Creating auction notices from the admin panel is not built yet."
      count={null}
    >
      <MarketplaceEmpty title="Not available yet">
        Auction publishing needs lenders, properties and locations in the database first. Until then, see what is already
        stored on the{" "}
        <Link href="/admin/auctions" className="font-semibold text-[#7a5f33] hover:underline">
          Auctions
        </Link>{" "}
        page.
      </MarketplaceEmpty>
    </MarketplacePage>
  );
}
