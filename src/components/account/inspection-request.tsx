"use client";

import { PropertyRequest } from "./property-request";

export function InspectionRequest({ auctionId, auctionNumber, submissionDeadline }: { auctionId: string; auctionNumber: string; submissionDeadline?: string }) {
  return <PropertyRequest auctionId={auctionId} auctionNumber={auctionNumber} kind="inspection" submissionDeadline={submissionDeadline} />;
}
