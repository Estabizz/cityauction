export function safeAuctionUrl(value: string | null | undefined): string | null {
  if (!value || /[\s\\\u0000-\u001f\u007f]/.test(value)) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function auctionImages(images: string[], primaryImage?: string | null) {
  return [...new Set([primaryImage, ...images].map(safeAuctionUrl).filter((value): value is string => Boolean(value)))];
}

export interface AuctionSchedule {
  status: string;
  startDateTime: string | Date;
  endDateTime: string | Date;
  submissionDeadline: string | Date;
}

export function auctionAvailability(auction: AuctionSchedule, now: number = Date.now()) {
  const closed = (title: string, message: string) => ({ canInspect: false, title, message });
  if (auction.status === "CANCELLED") return closed("Auction cancelled", "This notice is marked cancelled. Contact the team for updates or alternative properties.");
  if (auction.status === "SOLD") return closed("Property marked sold", "This notice is retained for reference. Contact the team about other opportunities.");
  if (auction.status === "CLOSED") return closed("Auction closed", "This notice is retained for reference. Confirm the outcome with the auctioning authority.");
  const start = new Date(auction.startDateTime).getTime();
  const end = new Date(auction.endDateTime).getTime();
  const deadline = new Date(auction.submissionDeadline).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(deadline) || end <= start || deadline > end)
    return closed("Confirm the auction schedule", "The recorded schedule is incomplete or inconsistent. Contact the team before planning a visit or participating.");
  if (end <= now) return closed("Auction date has passed", "The recorded auction end time has passed. Confirm any extension or new notice with the auctioning authority.");
  if (deadline <= now) return closed("Submission deadline has passed", "The recorded deadline for applications has passed. Contact the team to check the current position.");
  return { canInspect: true, title: start > now ? "Auction scheduled" : "Scheduled auction window",
    message: "Confirm availability, inspection arrangements and participation terms with the auctioning authority." };
}

export function inspectionDateError(auction: AuctionSchedule, preferredDate: string | undefined, now = Date.now()) {
  if (!auctionAvailability(auction, now).canInspect) return "Inspection requests are unavailable for this notice. Contact the team for guidance.";
  if (!preferredDate) return null;
  const today = new Date(now + 19_800_000).toISOString().slice(0, 10);
  const latest = new Date(new Date(auction.submissionDeadline).getTime() + 19_800_000).toISOString().slice(0, 10);
  if (preferredDate < today) return "Please pick today or a future date.";
  if (preferredDate > latest) return "Please choose a date on or before the submission deadline.";
  return null;
}

export function auctionContactPhone(value: string) {
  const phone = value.replace(/[\s().-]/g, "");
  return /^\+?\d{7,15}$/.test(phone) ? phone : null;
}
export function auctionContactEmail(value: string) {
  return /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value) ? value : null;
}
