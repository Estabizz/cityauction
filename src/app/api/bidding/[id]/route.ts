import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuctionBiddingState } from "@/services/bidding.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const state = await getAuctionBiddingState(
      id,
      user?.userId || null,
      user?.roles?.[0] || null
    );

    if (!state) {
      return NextResponse.json(
        { success: false, error: "Auction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      state,
    });
  } catch (error) {
    console.error("Error fetching live bidding state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve live bidding state" },
      { status: 500 }
    );
  }
}
