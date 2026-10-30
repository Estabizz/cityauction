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
      description="Stored auction notices. Public listings include only published, source-checked notices. Publishing from this panel is not available yet."
      count={result ? result[0] : null}
    >
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
                    <span className="block font-semibold text-[#182129]">{a.property.title}</span>
                    <span className="block text-xs text-[#6f777d]">{a.property.location.name}</span>
                  </td>
                  <td className={`${t.td} hidden md:table-cell`}>{a.organization.name}</td>
                  <td className={`${t.td} whitespace-nowrap`}>{formatCurrency(a.reservePrice.toString())}</td>
                  <td className={`${t.td} hidden whitespace-nowrap text-xs sm:table-cell`}>{fmtDateTime(a.startDateTime)}</td>
                  <td className={t.td}>
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
