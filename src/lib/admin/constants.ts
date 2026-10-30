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
  { value: "callback-request", label: "Callback request" },
  { value: "inspection-request", label: "Inspection request" },
  { value: "support-request", label: "Buyer support request" },
  { value: "data-request", label: "Data access / deletion" },
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

// The panel checks a cheap change fingerprint this often, and reloads the
// overview (and any open list) only when it moves.
export const PULSE_INTERVAL_MS = 4000;
// Full overview refresh even when nothing changed (clock, "x min ago", status).
export const POLL_INTERVAL_MS = 60000;
