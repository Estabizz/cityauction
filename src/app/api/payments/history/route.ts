import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserPayments, getPaymentMetrics } from "@/services/payment.service";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.userId || "bidder-demo";

    const [payments, metrics] = await Promise.all([
      getUserPayments(userId),
      getPaymentMetrics(userId),
    ]);

    return NextResponse.json({
      success: true,
      payments,
      metrics,
    });
  } catch (error) {
    console.error("Error retrieving payment history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve payment records" },
      { status: 500 }
    );
  }
}
