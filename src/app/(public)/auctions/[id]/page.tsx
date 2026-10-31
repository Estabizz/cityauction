import { cache } from "react";
import { auctionMoney } from "@/lib/auction-discovery-ui";
import { safeAuctionUrl } from "@/lib/auction-detail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuctionById, getRelatedAuctions } from "@/services/auction.service";
import { AuctionDetailClient } from "@/components/auction/auction-detail-client";
import { AuctionCard } from "@/components/auction/auction-card";

const getAuction = cache(getAuctionById);

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auction = await getAuction(id);

  if (!auction) {
    return {
      title: "Auction Not Found",
    };
  }

  return {
    title: auction.title,
    description: `Bank auction for ${auction.title} in ${auction.city}, ${auction.state}. Reserve price ${auctionMoney(auction.reservePrice)}. Conducted by ${auction.organizationName}.`,
    alternates: { canonical: `https://cityauction.in/auctions/${encodeURIComponent(auction.id)}` },
    openGraph: {
      title: auction.title,
      description: `Reserve price: ${auctionMoney(auction.reservePrice)} | Location: ${auction.city}`,
      images: safeAuctionUrl(auction.primaryImage) ? [safeAuctionUrl(auction.primaryImage)!] : [],
    },
  };
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await getAuction(id);

  if (!auction) {
    notFound();
  }

  // Serialize one server request time so the first hydrated render matches.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();
  const related = await getRelatedAuctions(auction.id, auction.categoryType, 3);

  return (
    <div className="bg-surface min-h-screen">
      <AuctionDetailClient auction={auction} initialNow={initialNow} />

      {/* Related / Similar Auctions Section */}
      {related.length > 0 && (
        <section className="border-t border-border bg-white py-12">
          <div className="container-wide">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Related auction notices
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Other source-checked notices with a future end time in this property category.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <AuctionCard key={rel.id} auction={rel} view="grid" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
