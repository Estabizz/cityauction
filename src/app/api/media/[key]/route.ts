import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminActor } from "@/lib/admin/guard";
import { readMedia, validMediaKey } from "@/lib/admin/media-storage";
import { publicAuctionWhere } from "@/lib/public-auctions";
export const runtime = "nodejs";
const unavailable = (status = 404) => new NextResponse(null, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!validMediaKey(key)) return unavailable();
  const url = `/api/media/${key}`;
  try {
    const published = await db.auction.findFirst({ where: { AND: [publicAuctionWhere(), { OR: [
      { property: { images: { some: { url } } } }, { documents: { some: { url, isPublic: true } } },
    ] }] }, select: { id: true } });
    if (!published && !await getAdminActor()) return unavailable();
    const file = await readMedia(key); if (!file) return unavailable();
    return new NextResponse(new Uint8Array(file.bytes), { headers: { "Content-Type": file.mime, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'", "Content-Disposition": `inline; filename="${key}"` } });
  } catch { return unavailable(503); }
}
