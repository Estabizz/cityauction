import { db } from "./db";
import { matchInclude, matchesForUser } from "./matching";
import { publicAuctionWhere } from "./public-auctions";
import { buyerEnquiryWhere } from "./requests";

// Independent sections keep available information visible during a partial outage.
export async function loadDashboardOverview(userId: string, verifiedEmail?: string | null) {
  const enquiriesWhere = buyerEnquiryWhere(userId, verifiedEmail);
  const savedWhere = { userId, auctionId: { not: null }, auction: publicAuctionWhere() };
  const [saved, enquiries, matches] = await Promise.allSettled([
    Promise.all([
      db.favourite.count({ where: savedWhere }),
      db.favourite.findMany({ where: savedWhere, include: { auction: { include: matchInclude } }, orderBy: { createdAt: "desc" }, take: 3 }),
    ]).then(([count, rows]) => ({ count, auctions: rows.flatMap((row) => row.auction ? [row.auction] : []) })),
    Promise.all([
      db.enquiry.count({ where: enquiriesWhere }),
      db.enquiry.findMany({ where: enquiriesWhere, orderBy: { createdAt: "desc" }, take: 4, select: { id: true, subject: true, source: true, status: true, createdAt: true, auctionId: true } }),
    ]).then(([count, recent]) => ({ count, recent })),
    matchesForUser(userId, 3),
  ]);
  for (const [name, result] of [["saved", saved], ["enquiries", enquiries], ["matches", matches]] as const) {
    if (result.status === "rejected") console.error(`[dashboard] ${name} unavailable`, result.reason);
  }
  return {
    saved: saved.status === "fulfilled" ? saved.value : null,
    enquiries: enquiries.status === "fulfilled" ? enquiries.value : null,
    matches: matches.status === "fulfilled" ? matches.value : null,
  };
}
