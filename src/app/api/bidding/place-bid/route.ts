import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { placeBid } from "@/services/bidding.service";

const PlaceBidSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  amount: z.number().positive("Bid amount must be a positive number"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = PlaceBidSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || "Invalid input data",
        },
        { status: 400 }
      );
    }

    const { auctionId, amount } = parseResult.data;
    const user = await getCurrentUser();

    // Use current authenticated user or fallback for demo / test accounts
    const userId = user?.userId || "demo-bidder-guest";
    const userRole = user?.roles?.[0] || "BIDDER";

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const result = await placeBid({
      auctionId,
      userId,
      amount,
      userRole,
      ipAddress,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      state: result.state,
      extended: result.extended,
    });
  } catch (error) {
    console.error("Error processing bid:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error processing bid" },
      { status: 500 }
    );
  }
}
