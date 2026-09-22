import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getAuctionBiddingState } from "@/services/bidding.service";
import { BiddingRoomClient } from "@/components/bidding/bidding-room-client";

export const dynamic = "force-dynamic";

interface BiddingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BiddingPageProps): Promise<Metadata> {
  const { id } = await params;
  const state = await getAuctionBiddingState(id);

  if (!state) {
    return {
      title: "Auction Not Found | CityAuction",
    };
  }

  return {
    title: `Live Bidding Room - ${state.auction.auctionNumber} | CityAuction`,
    description: `Official live electronic bidding room for ${state.auction.title}. Conducted under SARFAESI Act Rules.`,
  };
}

export default async function BiddingPage({ params }: BiddingPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const state = await getAuctionBiddingState(
    id,
    user?.userId || null,
    user?.roles?.[0] || null
  );

  if (!state) {
    notFound();
  }

  return <BiddingRoomClient initialState={state} />;
}
