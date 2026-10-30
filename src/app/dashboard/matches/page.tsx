import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Target } from "lucide-react";
import { db } from "@/lib/db";
import { matchInclude, matchesForRequirement, requirementWhere, type MatchedAuction } from "@/lib/matching";
import { getAccount } from "@/components/account/dashboard-data";
import { ListingRow } from "@/components/account/listing-row";
import { DbErrorNote, PageHeading } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Matching opportunities",
};

async function load(userId: string, requirementId?: string) {
  try {
    const requirements = await db.buyerRequirement.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    const selected = requirements.find((r) => r.id === requirementId) ?? null;
    let auctions: MatchedAuction[];
    if (selected) auctions = await matchesForRequirement(selected, 50);
    else {
      const wheres = requirements.map(requirementWhere).filter((w) => w !== null);
      auctions = wheres.length
        ? await db.auction.findMany({ where: { OR: wheres }, include: matchInclude, orderBy: { startDateTime: "asc" }, take: 50 })
        : [];
    }
    return { requirements, selected, auctions };
  } catch (error) {
    console.error("[dashboard] matches", error);
    return null;
  }
}

export default async function MatchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Redirects to sign-in if the session was ended (e.g. "log out everywhere").
  const { session } = await getAccount();
  const raw = (await searchParams).requirement;
  const data = await load(session.userId, typeof raw === "string" ? raw : undefined);

  const tabClass = (on: boolean) =>
    `inline-flex items-center h-9 px-4 rounded-full border text-xs font-semibold whitespace-nowrap ${
      on ? "bg-[#091118] border-[#091118] text-white" : "bg-white border-[#dcd5ca] text-[#3b464e] hover:border-[#b49361]"
    }`;

  return (
    <div className="max-w-4xl">
      <PageHeading title="Matching opportunities" subtitle="Open auctions that fit your requirements, by asset type, city and budget." />
      {data === null && <DbErrorNote />}

      {data && data.requirements.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#e6dfd4] px-6 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f5edd3] text-[#84663c] flex items-center justify-center mx-auto">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#091118] mt-4">Tell us what you&apos;re looking for</h2>
          <p className="text-sm text-[#59636a] mt-2 max-w-md mx-auto">Add a requirement (asset type, cities, budget) and matching auctions will appear here.</p>
          <Link href="/dashboard/requirements" className="inline-flex items-center gap-2 mt-6 h-10 px-5 rounded-full bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f]">
            Add a requirement <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {data && data.requirements.length > 0 && (
        <>
          <nav className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" aria-label="Filter by requirement">
            <Link href="/dashboard/matches" className={tabClass(!data.selected)} aria-current={!data.selected ? "page" : undefined}>
              All requirements
            </Link>
            {data.requirements.map((r) => (
              <Link key={r.id} href={`/dashboard/matches?requirement=${r.id}`} className={tabClass(data.selected?.id === r.id)} aria-current={data.selected?.id === r.id ? "page" : undefined}>
                {r.name}
              </Link>
            ))}
          </nav>

          {data.auctions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e6dfd4] px-6 py-10 text-center">
              <p className="text-sm font-semibold text-[#182129]">No open auctions match right now</p>
              <p className="text-xs text-[#59636a] mt-1 max-w-md mx-auto">
                New listings are added regularly. Try widening the cities or budget in{" "}
                <Link href="/dashboard/requirements" className="font-semibold text-[#84663c] hover:underline">
                  your requirements
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.auctions.map((a) => (
                <ListingRow key={a.id} listing={a} label="Suggested match" />
              ))}
            </div>
          )}
          <p className="text-xs text-[#7e868b] mt-6">
            Suggested matches are based on asset type, city and reserve price only. They are not a check of title, possession, value or
            suitability. Always do your own due diligence.
          </p>
        </>
      )}
    </div>
  );
}
