import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apps = await db.auctionParticipant.findMany({
      where: { userId: user.userId },
      include: {
        auction: {
          include: {
            property: true,
            organization: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json({ success: true, data: apps });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}
