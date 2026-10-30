import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin/guard";
import { fmtDateTime } from "@/lib/admin/format";
import { DatabaseError, MarketplaceEmpty, MarketplacePage, safeQuery } from "@/components/admin/marketplace";
import { Badge, TextLink } from "@/components/admin/ui";
import { tableClasses as t } from "@/components/admin/table-classes";

export const metadata: Metadata = { title: "Participants" };

export default async function AdminParticipantsPage() {
  await requireAdminPage();
  const result = await safeQuery(() =>
    Promise.all([
      db.auctionParticipant.count(),
      db.auctionParticipant.findMany({
        orderBy: { registeredAt: "desc" },
        take: 100,
        include: {
          user: { select: { email: true, fullName: true } },
          auction: { select: { auctionNumber: true, property: { select: { title: true } } } },
        },
      }),
    ])
  );

  return (
    <MarketplacePage
      title="Auction participants"
      description="Bidders registered for individual auctions, with their EMD status. Approving participants here is not built yet."
      count={result ? result[0] : null}
    >
      {!result ? (
        <DatabaseError />
      ) : result[1].length === 0 ? (
        <MarketplaceEmpty title="No participants">Bidder registrations for auctions will appear here once online bidding opens.</MarketplaceEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className={t.table}>
            <thead className={t.head}>
              <tr>
                <th className={t.th}>Bidder</th>
                <th className={`${t.th} hidden md:table-cell`}>Auction</th>
                <th className={t.th}>Status</th>
                <th className={`${t.th} hidden sm:table-cell`}>EMD</th>
                <th className={`${t.th} hidden lg:table-cell`}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {result[1].map((p) => (
                <tr key={p.id} className={t.row}>
                  <td className={t.td}>
                    <TextLink href={`/admin/users?q=${encodeURIComponent(p.user.email ?? p.user.fullName ?? "")}`}>{p.user.fullName || p.user.email}</TextLink>
                    <span className="block text-xs text-[#6f777d]">{p.user.email}</span>
                  </td>
                  <td className={`${t.td} hidden md:table-cell`}>
                    <span className="block font-mono text-[11px] text-[#6f777d]">{p.auction.auctionNumber}</span>
                    <span className="block text-sm">{p.auction.property.title}</span>
                  </td>
                  <td className={t.td}>
                    <Badge tone={p.status === "APPROVED" ? "green" : p.status === "REJECTED" ? "red" : "gold"}>{p.status.toLowerCase()}</Badge>
                  </td>
                  <td className={`${t.td} hidden text-xs sm:table-cell`}>{p.emdPaymentId ? "Paid" : "Not paid"}</td>
                  <td className={`${t.td} hidden whitespace-nowrap text-xs lg:table-cell`}>{fmtDateTime(p.registeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MarketplacePage>
  );
}
