import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requirementWhere } from "@/lib/matching";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading } from "@/components/account/dashboard-ui";
import { RequirementsManager, type RequirementRow } from "@/components/account/requirements-manager";
import { toRequirementValues } from "@/components/account/requirement-values";

export const metadata: Metadata = {
  title: "Match preferences",
};

async function loadRows(userId: string): Promise<RequirementRow[] | null> {
  try {
    const requirements = await db.buyerRequirement.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return Promise.all(
      requirements.map(async (r) => {
        const where = requirementWhere(r);
        return { id: r.id, values: toRequirementValues(r), matchCount: where ? await db.auction.count({ where }) : 0 };
      })
    );
  } catch (error) {
    console.error("[dashboard] requirements", error);
    return null;
  }
}

export default async function RequirementsPage() {
  const { session, user, dbError } = await getAccount();
  const rows = await loadRows(session.userId);

  return (
    <div className="max-w-3xl">
      <PageHeading
        title="Match preferences"
        subtitle="Choose property types, locations and a budget. Your saved preferences determine the opportunities shown in your dashboard."
      />
      {(dbError || rows === null) && <div className="mb-4"><DbErrorNote /></div>}
      {rows !== null && <RequirementsManager rows={rows} hasEmail={!!(user?.email || session.email)} />}
      <p className="text-xs text-[#7e868b] mt-6">
        Matches are suggestions based on asset type, city and price only. They are not a check of title, possession or value.
      </p>
    </div>
  );
}
