import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin/guard";
import { formatCurrency } from "@/lib/utils";
import { fmtDate } from "@/lib/admin/format";
import { DatabaseError, MarketplaceEmpty, MarketplacePage, safeQuery } from "@/components/admin/marketplace";
import { Badge } from "@/components/admin/ui";
import { tableClasses as t } from "@/components/admin/table-classes";

export const metadata: Metadata = { title: "Properties" };

export default async function AdminPropertiesPage() {
  await requireAdminPage();
  const result = await safeQuery(() =>
    Promise.all([
      db.property.count({ where: { deletedAt: null } }),
      db.property.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          location: { select: { name: true } },
          organization: { select: { name: true } },
          category: { select: { name: true } },
          _count: { select: { auctions: true } },
        },
      }),
    ])
  );

  return (
    <MarketplacePage
      title="Properties"
      description="Properties stored in the database, with the lender and how many auctions each one has."
      count={result ? result[0] : null}
    >
      {!result ? (
        <DatabaseError />
      ) : result[1].length === 0 ? (
        <MarketplaceEmpty title="No properties in the database">
          No property records have been added yet. They will appear here once auction data is loaded.
        </MarketplaceEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className={t.table}>
            <thead className={t.head}>
              <tr>
                <th className={t.th}>Property</th>
                <th className={`${t.th} hidden md:table-cell`}>Lender</th>
                <th className={`${t.th} hidden sm:table-cell`}>Type</th>
                <th className={t.th}>Value</th>
                <th className={`${t.th} hidden lg:table-cell`}>Possession</th>
                <th className={`${t.th} hidden lg:table-cell`}>Added</th>
              </tr>
            </thead>
            <tbody>
              {result[1].map((p) => (
                <tr key={p.id} className={t.row}>
                  <td className={t.td}>
                    <span className="block font-semibold text-[#182129]">{p.title}</span>
                    <span className="block text-xs text-[#6f777d]">
                      {p.location.name} · {p._count.auctions} auction{p._count.auctions === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td className={`${t.td} hidden md:table-cell`}>{p.organization.name}</td>
                  <td className={`${t.td} hidden sm:table-cell`}>
                    <Badge>{p.category.name}</Badge>
                  </td>
                  <td className={`${t.td} whitespace-nowrap`}>{formatCurrency(p.estimatedValue?.toString())}</td>
                  <td className={`${t.td} hidden text-xs lg:table-cell`}>{p.possessionStatus.replace(/_/g, " ").toLowerCase()}</td>
                  <td className={`${t.td} hidden whitespace-nowrap text-xs lg:table-cell`}>{fmtDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MarketplacePage>
  );
}
