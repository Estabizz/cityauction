import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin/guard";
import { fmtDateTime } from "@/lib/admin/format";
import { DatabaseError, MarketplaceEmpty, MarketplacePage, safeQuery } from "@/components/admin/marketplace";
import { Badge, TextLink, type BadgeTone } from "@/components/admin/ui";
import { tableClasses as t } from "@/components/admin/table-classes";

export const metadata: Metadata = { title: "Bidder KYC" };

const TONES: Record<string, BadgeTone> = {
  SUBMITTED: "gold",
  UNDER_REVIEW: "blue",
  APPROVED: "green",
  REJECTED: "red",
  CHANGES_REQUESTED: "amber",
  DRAFT: "grey",
};

export default async function AdminKycPage() {
  await requireAdminPage();
  const result = await safeQuery(() =>
    Promise.all([
      db.kycApplication.count(),
      db.kycApplication.findMany({
        orderBy: { updatedAt: "desc" },
        take: 100,
        include: {
          user: { select: { email: true, fullName: true } },
          _count: { select: { documents: true } },
        },
      }),
    ])
  );

  return (
    <MarketplacePage
      title="Bidder KYC"
      description="KYC applications from bidders. Online bidding is not open yet, so this list is usually empty; reviewing applications here is not built yet."
      count={result ? result[0] : null}
    >
      {!result ? (
        <DatabaseError />
      ) : result[1].length === 0 ? (
        <MarketplaceEmpty title="No KYC applications">Bidder KYC submissions will appear here once online bidding opens.</MarketplaceEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className={t.table}>
            <thead className={t.head}>
              <tr>
                <th className={t.th}>Applicant</th>
                <th className={t.th}>Status</th>
                <th className={`${t.th} hidden sm:table-cell`}>Documents</th>
                <th className={`${t.th} hidden md:table-cell`}>Last update</th>
              </tr>
            </thead>
            <tbody>
              {result[1].map((k) => (
                <tr key={k.id} className={t.row}>
                  <td className={t.td}>
                    <TextLink href={`/admin/users?q=${encodeURIComponent(k.user.email ?? k.user.fullName ?? "")}`}>{k.user.fullName || k.user.email}</TextLink>
                    <span className="block text-xs text-[#6f777d]">{k.user.email}</span>
                  </td>
                  <td className={t.td}>
                    <Badge tone={TONES[k.status] ?? "grey"}>{k.status.replace(/_/g, " ").toLowerCase()}</Badge>
                  </td>
                  <td className={`${t.td} hidden sm:table-cell`}>{k._count.documents}</td>
                  <td className={`${t.td} hidden whitespace-nowrap text-xs md:table-cell`}>{fmtDateTime(k.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MarketplacePage>
  );
}
