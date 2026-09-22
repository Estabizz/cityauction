import { NextResponse } from "next/server";
import { getAuctionById } from "@/services/auction.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const auction = await getAuctionById(id);

    if (!auction) {
      return NextResponse.json(
        { success: false, error: "Auction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: auction,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch auction details" },
      { status: 500 }
    );
  }
}
