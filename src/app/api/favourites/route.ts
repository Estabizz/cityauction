import { publicAuctionWhere } from "@/lib/public-auctions";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";
import { PROPERTY_ACTIONS } from "@/lib/property-actions";

// Saved listings ("Saved Properties"). A save is a Favourite row keyed by the
// auction listing. Failures are reported, never faked.

const NO_STORE = { "Cache-Control": "no-store" };

// ?ids=1 returns just the saved auction ids (for heart buttons across a page).
export async function GET(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  try {
    const idsOnly = new URL(req.url).searchParams.get("ids") === "1";
    if (idsOnly) {
      const rows = await db.favourite.findMany({ where: { userId: session.userId, auctionId: { not: null }, auction: publicAuctionWhere() }, select: { auctionId: true } });
      return NextResponse.json({ success: true, data: rows.map((r) => r.auctionId) }, { headers: NO_STORE });
    }

    const favourites = await db.favourite.findMany({
      where: { userId: session.userId, auctionId: { not: null }, auction: publicAuctionWhere() },
      include: { auction: { include: { property: { include: { location: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: favourites }, { headers: NO_STORE });
  } catch (error) {
    console.error("[favourites] GET", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}

const bodySchema = z.object({ auctionId: z.string().trim().min(1, "Missing listing.").max(64) });

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in to save listings.", 401);

  let auctionId: string;
  try {
    ({ auctionId } = bodySchema.parse(await req.json()));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Invalid request.", 400);
  }

  try {
    const auction = await db.auction.findFirst({ where: { AND: [publicAuctionWhere(), { id: auctionId }] }, select: { id: true } });
    if (!auction) return jsonError("This listing can't be saved right now.", 404);

    await db.favourite.create({ data: { userId: session.userId, auctionId } });
    return NextResponse.json({ success: true, saved: true, message: PROPERTY_ACTIONS.savedMessage });
  } catch (error) {
    // Already saved (double click, two tabs): that's the state they wanted.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: true, saved: true, message: PROPERTY_ACTIONS.savedMessage });
    }
    console.error("[favourites] POST", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}

export async function DELETE(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  const auctionId = new URL(req.url).searchParams.get("auctionId");
  if (!auctionId) return jsonError("Missing listing.", 400);

  try {
    await db.favourite.deleteMany({ where: { userId: session.userId, auctionId } });
    return NextResponse.json({ success: true, saved: false, message: PROPERTY_ACTIONS.removedMessage });
  } catch (error) {
    console.error("[favourites] DELETE", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
