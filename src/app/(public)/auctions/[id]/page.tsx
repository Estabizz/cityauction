import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuctionById, getRelatedAuctions } from "@/services/auction.service";
import { AuctionDetailClient } from "@/components/auction/auction-detail-client";
import { AuctionCard } from "@/components/auction/auction-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auction = await getAuctionById(id);

  if (!auction) {
    return {
      title: "Auction Not Found | CityAuction",
    };
  }

  return {
    title: `${auction.title} | CityAuction`,
    description: `Bank auction for ${auction.title} in ${auction.city}, ${auction.state}. Reserve price ₹${auction.reservePrice}. Conducted by ${auction.organizationName}.`,
    openGraph: {
      title: auction.title,
      description: `Reserve Price: ₹${auction.reservePrice} | Location: ${auction.city}`,
      images: auction.primaryImage ? [auction.primaryImage] : [],
    },
  };
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await getAuctionById(id);

  if (!auction) {
    notFound();
  }

  const related = await getRelatedAuctions(auction.id, auction.categoryType, 3);

  return (
    <div className="bg-surface min-h-screen">
      <AuctionDetailClient auction={auction} />

      {/* Related / Similar Auctions Section */}
      {related.length > 0 && (
        <section className="border-t border-border bg-white py-12">
          <div className="container-wide">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Similar Bank Auctions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Other bank auction properties in {auction.city} and across {auction.state}
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
