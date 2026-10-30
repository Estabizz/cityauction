import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuctions } from "@/services/auction.service";
import { parseAuctionSearchParams } from "@/lib/auction-search";
import { AuctionDataUnavailable } from "@/lib/public-auctions";

export async function GET(req: Request) {
  try {
    const filters = parseAuctionSearchParams(new URL(req.url).searchParams);
    const result = await getAuctions(filters);
    return NextResponse.json({ success: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid search filters." }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: "Auction listings could not be loaded. Please try again shortly." },
      { status: error instanceof AuctionDataUnavailable ? 503 : 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
