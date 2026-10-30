// Buyer service requests are Enquiry rows with one of these sources.
import type { Prisma } from "@prisma/client";

// Include pre-registration enquiries only after ownership of that email is verified.
export function buyerEnquiryWhere(userId: string, verifiedEmail?: string | null): Prisma.EnquiryWhereInput {
  return { OR: [{ userId }, ...(verifiedEmail ? [{ email: verifiedEmail }] : [])] };
}

export const REQUEST_SOURCES = {
  inspection: "inspection-request",
  support: "support-request",
  "data-access": "data-request",
  "data-deletion": "data-request",
} as const;

export const BUYER_REQUEST_SOURCES = ["inspection-request", "support-request", "data-request", "callback-request"];

// Short reference buyers can quote to the team.
export function requestReference(id: string) {
  return `CA-${id.slice(-6).toUpperCase()}`;
}

export const REQUEST_STATUS: Record<string, { label: string; className: string }> = {
  NEW: { label: "Received", className: "bg-sky-50 text-sky-800 border-sky-200" },
  IN_PROGRESS: { label: "In progress", className: "bg-amber-50 text-amber-800 border-amber-200" },
  CONTACTED: { label: "Contacted", className: "bg-violet-50 text-violet-800 border-violet-200" },
  RESOLVED: { label: "Resolved", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

export const REQUEST_SOURCE_LABELS: Record<string, string> = {
  "inspection-request": "Site inspection",
  "support-request": "Support",
  "data-request": "Data request",
  "callback-request": "Callback request",
  contact: "Contact form",
  "auction-alerts": "Auction alerts",
  career: "Careers",
  "investor-desk": "Investor desk",
  "liquidate-asset": "Liquidate an asset",
  "institutional-mandate": "Institutional services",
  "next-chapter": "Next Chapter",
  homepage: "Homepage",
  "password-reset": "Password reset",
};

export function requestSourceLabel(source: string) {
  return REQUEST_SOURCE_LABELS[source] || source.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
