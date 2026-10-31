import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin/guard";
import { formatCurrency } from "@/lib/utils";
import { fmtDateTime } from "@/lib/admin/format";
import { DatabaseError, MarketplaceEmpty, MarketplacePage, safeQuery } from "@/components/admin/marketplace";
import { Badge } from "@/components/admin/ui";
import { tableClasses as t } from "@/components/admin/table-classes";

export const metadata: Metadata = { title: "Auctions" };

export default async function AdminAuctionsPage() {
  await requireAdminPage();
  const result = await safeQuery(() =>
    Promise.all([
      db.auction.count({ where: { deletedAt: null } }),
      db.auction.findMany({
        where: { deletedAt: null },
        orderBy: { startDateTime: "desc" },
        take: 100,
        include: {
          property: { select: { title: true, location: { select: { name: true } } } },
          organization: { select: { name: true } },
          _count: { select: { bids: true, participants: true } },
        },
      }),
    ])
  );

  return (
    <MarketplacePage
      title="Auctions"
      description="Create drafts, preview saved notices and publish after source checks. Showing the latest 100 records."
      count={result ? result[0] : null}
    >
      <div className="p-4"><Link href="/admin/auctions/create" className="inline-flex min-h-11 items-center rounded-xl bg-[#132330] px-4 text-sm font-semibold text-white">Add auction notice</Link></div>
      {!result ? (
        <DatabaseError />
      ) : result[1].length === 0 ? (
        <MarketplaceEmpty title="No auctions in the database">
          Nothing has been published yet. Real auction notices will appear here once they are imported or created.
        </MarketplaceEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className={t.table}>
            <thead className={t.head}>
              <tr>
                <th className={t.th}>Auction</th>
                <th className={`${t.th} hidden md:table-cell`}>Lender</th>
                <th className={t.th}>Reserve</th>
                <th className={`${t.th} hidden sm:table-cell`}>Starts</th>
                <th className={t.th}>Status</th>
                <th className={`${t.th} hidden lg:table-cell`}>Bids / bidders</th>
              </tr>
            </thead>
            <tbody>
              {result[1].map((a) => (
                <tr key={a.id} className={t.row}>
                  <td className={t.td}>
                    <span className="block font-mono text-[11px] text-[#6f777d]">
                      {a.auctionNumber} · {a.type}
                    </span>
                    <Link href={`/admin/auctions/${a.id}`} className="block min-h-11 py-2 font-semibold text-[#84663c] underline">{a.property.title}</Link>
                    <span className="block text-xs text-[#6f777d]">{a.property.location.name}</span>
                  </td>
                  <td className={`${t.td} hidden md:table-cell`}>{a.organization.name}</td>
                  <td className={`${t.td} whitespace-nowrap`}>{formatCurrency(a.reservePrice.toString())}</td>
                  <td className={`${t.td} hidden whitespace-nowrap text-xs sm:table-cell`}>{fmtDateTime(a.startDateTime)}</td>
                  <td className={t.td}>
                    <p className="mb-1 text-xs">{a.publishedAt && a.sourceVerifiedAt ? "Published" : "Not public"}</p>
                    <Badge tone={a.status === "LIVE" ? "green" : a.status === "DRAFT" ? "grey" : "gold"}>{a.status}</Badge>
                  </td>
                  <td className={`${t.td} hidden text-xs lg:table-cell`}>
                    {a._count.bids} / {a._count.participants}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MarketplacePage>
  );
}
