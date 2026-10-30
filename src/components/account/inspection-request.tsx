"use client";

import { PropertyRequest } from "./property-request";

export function InspectionRequest({ auctionId, auctionNumber }: { auctionId: string; auctionNumber: string }) {
  return <PropertyRequest auctionId={auctionId} auctionNumber={auctionNumber} kind="inspection" />;
}
