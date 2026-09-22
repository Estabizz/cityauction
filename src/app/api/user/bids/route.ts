import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bids = await db.bid.findMany({
      where: { userId: user.userId },
      include: {
        auction: {
          include: {
            property: true,
            organization: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bids });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}
