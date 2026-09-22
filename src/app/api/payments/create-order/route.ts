import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createPaymentOrder } from "@/services/payment.service";

const CreateOrderSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  auctionNumber: z.string().min(1, "Auction number is required"),
  propertyTitle: z.string().min(1, "Property title is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  type: z.enum(["EMD", "APPLICATION_FEE"]).default("EMD"),
  gateway: z.enum(["RAZORPAY", "RTGS"]).default("RAZORPAY"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = CreateOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || "Invalid order parameters" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const userId = user?.userId || "bidder-demo";

    const order = await createPaymentOrder({
      ...result.data,
      userId,
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
