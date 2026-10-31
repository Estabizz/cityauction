import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAdminAuctionPreview } from "@/services/auction.service";
import { AuctionDetailClient } from "@/components/auction/auction-detail-client";
export const metadata = { title: "Private auction preview", robots: { index: false, follow: false } };
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params; const auction = await getAdminAuctionPreview(id); if (!auction) notFound();
  // A server request timestamp keeps the first client render consistent.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();
  return <div className="min-w-0"><div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><strong>Private preview of the saved record.</strong> Unsaved editor changes are not included. Buyer actions are disabled. <Link href={`/admin/auctions/${id}`} className="font-semibold underline">Return to editor</Link></div><AuctionDetailClient auction={auction} initialNow={initialNow} preview /></div>;
}
