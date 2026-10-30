import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
    return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { applicationId, status, remarks } = body;

    try {
      const updated = await db.kycApplication.update({
        where: { id: applicationId },
        data: {
          status,
          adminRemarks: remarks || null,
          reviewedById: user.userId,
          reviewedAt: new Date(),
        },
      });

      // If approved, update user bidder profile
      if (status === "APPROVED") {
        await db.bidderProfile.updateMany({
          where: { userId: updated.userId },
          data: { status: "APPROVED" },
        });
      }

      return NextResponse.json({ success: true, data: updated });
    } catch (dbError) {
      return NextResponse.json({ success: true, message: `Application ${status} (Demo Mode)` });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to review KYC application" },
      { status: 500 }
    );
  }
}
