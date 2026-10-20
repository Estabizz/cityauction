// The team works in India, so "today" and date filters use India time (UTC+5:30,
// no daylight saving) whatever time zone the server runs in.
const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfTodayIST(now = new Date()): Date {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}

export function daysAgo(days: number, now = new Date()): Date {
  return new Date(now.getTime() - days * DAY_MS);
}

// "2026-10-20" -> start of that day in India time. Invalid input -> undefined.
export function parseISTDate(value: string | null | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00+05:30`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// Inclusive date range from ?from=YYYY-MM-DD&to=YYYY-MM-DD.
export function dateRangeFilter(from: string | null, to: string | null) {
  const gte = parseISTDate(from);
  const toStart = parseISTDate(to);
  const lt = toStart ? new Date(toStart.getTime() + DAY_MS) : undefined;
  if (!gte && !lt) return undefined;
  return { ...(gte ? { gte } : {}), ...(lt ? { lt } : {}) };
}

export function parseSince(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// For CSV files: "2026-10-20 15:04" in India time.
export function istStamp(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 16).replace("T", " ");
}
