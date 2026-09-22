import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPayment } from "@/services/payment.service";

const VerifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  gatewayPaymentId: z.string().optional(),
  utrNumber: z.string().optional(),
  remitterBank: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = VerifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || "Invalid verification parameters" },
        { status: 400 }
      );
    }

    const verificationResult = await verifyPayment(result.data);

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: verificationResult.message,
      payment: verificationResult.payment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
