// Shared by admin pages (client) and /api/admin handlers (server): no imports.

// Enquiry.source values written by the site's forms. Unknown sources still show
// up; they are just labelled with their raw value.
export const LEAD_SOURCES: { value: string; label: string }[] = [
  { value: "contact", label: "Contact us" },
  { value: "auction-alerts", label: "Auction alerts" },
  { value: "career", label: "Careers" },
  { value: "investor-desk", label: "Investor desk" },
  { value: "liquidate-asset", label: "Liquidate an asset" },
  { value: "institutional-mandate", label: "Institutional mandate" },
  { value: "next-chapter", label: "Next chapter" },
  { value: "homepage", label: "Homepage" },
  { value: "password-reset", label: "Password reset" },
];

export function sourceLabel(source: string): string {
  return LEAD_SOURCES.find((s) => s.value === source)?.label ?? source;
}

export const ENQUIRY_STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "RESOLVED"] as const;
export type EnquiryStatusValue = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatusValue, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CONTACTED: "Contacted",
  RESOLVED: "Resolved",
};

export const SUBSCRIBER_STATUSES = ["ACTIVE", "UNSUBSCRIBED"] as const;
export type SubscriberStatusValue = (typeof SUBSCRIBER_STATUSES)[number];

// Roles an admin can grant or remove from the Users page (SUPER_ADMIN only).
export const MANAGED_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
export type ManagedRole = (typeof MANAGED_ROLES)[number];

export const PAGE_SIZE = 25;

export const POLL_INTERVAL_MS = 15000;
