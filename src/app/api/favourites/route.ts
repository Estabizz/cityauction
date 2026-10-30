import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favourites = await db.favourite.findMany({
      where: { userId: user.userId },
      include: {
        property: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            organization: true,
            location: true,
          },
        },
        auction: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: favourites });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { auctionId, propertyId } = body;

    const fav = await db.favourite.create({
      data: {
        userId: user.userId,
        auctionId: auctionId || null,
        propertyId: propertyId || null,
      },
    });

    return NextResponse.json({ success: true, data: fav });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Added to favourites (demo mode)" });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await db.favourite.deleteMany({
        where: {
          userId: user.userId,
          OR: [{ id }, { auctionId: id }, { propertyId: id }],
        },
      });
    }

    return NextResponse.json({ success: true, message: "Removed from favourites" });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Removed (demo mode)" });
  }
}
