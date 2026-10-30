import type { Prisma } from "@prisma/client";

export const PUBLIC_AUCTION_STATUSES = [
  "UPCOMING", "LIVE", "CLOSING_SOON", "CLOSED", "CANCELLED", "SOLD",
] as const;

// Seed records and drafts must never enter public discovery. A publication
// needs an identified source and a recorded source check; this is not a legal
// opinion on title or suitability. All public entry points share this rule.
export function publicAuctionWhere(now = new Date()): Prisma.AuctionWhereInput {
  return {
    deletedAt: null,
    status: { in: [...PUBLIC_AUCTION_STATUSES] },
    publishedAt: { lte: now },
    sourceListingId: { not: null },
    NOT: { sourceListingId: "" },
    sourceVerifiedAt: { lte: now },
    property: { deletedAt: null },
    organization: { isActive: true },
  };
}

export class AuctionDataUnavailable extends Error {
  constructor() {
    super("Auction listings could not be loaded. Please try again shortly.");
    this.name = "AuctionDataUnavailable";
  }
}
