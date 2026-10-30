import Link from "next/link";
import { publicAuctionWhere } from "@/lib/public-auctions";
import type { Metadata } from "next";
import { ArrowRight, Heart } from "lucide-react";
import { db } from "@/lib/db";
import { matchInclude } from "@/lib/matching";
import { getAccount } from "@/components/account/dashboard-data";
import { ListingRow } from "@/components/account/listing-row";
import { DbErrorNote, PageHeading } from "@/components/account/dashboard-ui";
import { SavedPropertiesNotice } from "@/components/account/save-listing-button";

export const metadata: Metadata = {
  title: "Saved Properties",
};

async function loadSaved(userId: string) {
  try {
    const rows = await db.favourite.findMany({
      where: { userId, auctionId: { not: null }, auction: publicAuctionWhere() },
      include: { auction: { include: matchInclude } },
      orderBy: { createdAt: "desc" },
    });
    return rows.flatMap((r) => (r.auction && !r.auction.deletedAt ? [{ savedAt: r.createdAt, auction: r.auction }] : []));
  } catch (error) {
    console.error("[dashboard] saved", error);
    return null;
  }
}

export default async function SavedPropertiesPage() {
  // Redirects to sign-in if the session was ended (e.g. "log out everywhere").
  const { session } = await getAccount();
  const saved = await loadSaved(session.userId);

  return (
    <div className="max-w-4xl">
      <PageHeading title="Saved Properties" subtitle="Listings you've saved, with their latest auction status. Tap the heart to remove one." />
      <SavedPropertiesNotice />
      {saved === null && <DbErrorNote />}
      {saved?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#e6dfd4] px-6 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f5edd3] text-[#84663c] flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#091118] mt-4">No saved properties yet</h2>
          <p className="text-sm text-[#59636a] mt-2 max-w-md mx-auto">Tap the heart on any auction listing to keep it here and follow its status.</p>
          <Link href="/auctions" className="inline-flex items-center gap-2 mt-6 h-10 px-5 rounded-full bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f]">
            Explore auctions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
      {saved && saved.length > 0 && (
        <div className="space-y-3">
          {saved.map(({ auction }) => (
            <ListingRow key={auction.id} listing={auction} showVerified />
          ))}
        </div>
      )}
    </div>
  );
}
