import { db } from "./db";

// A cheap "has anything changed?" fingerprint: row counts plus latest change
// times. Pages poll it every few seconds and only reload their data when it
// moves, so updates show up almost immediately without heavy queries.

type Row = Record<string, unknown>;

function fingerprint(row: Row | undefined) {
  if (!row) return "";
  return Object.values(row)
    .map((v) => (v instanceof Date ? v.getTime() : v == null ? "-" : String(v)))
    .join(".");
}

// Everything the admin panel shows.
export async function adminPulse() {
  const rows = await db.$queryRaw<Row[]>`
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT MAX(updatedAt) FROM users) AS usersAt,
      (SELECT COUNT(*) FROM enquiries) AS enquiries,
      (SELECT MAX(updatedAt) FROM enquiries) AS enquiriesAt,
      (SELECT COUNT(*) FROM subscribers) AS subscribers,
      (SELECT MAX(updatedAt) FROM subscribers) AS subscribersAt,
      (SELECT COUNT(*) FROM buyer_requirements) AS requirements,
      (SELECT MAX(updatedAt) FROM buyer_requirements) AS requirementsAt,
      (SELECT COUNT(*) FROM favourites) AS favourites,
      (SELECT MAX(createdAt) FROM favourites) AS favouritesAt,
      (SELECT COUNT(*) FROM consent_events) AS consents`;
  return fingerprint(rows[0]);
}

// What one buyer's dashboard shows: their requests (status changes by the
// team), saved listings, requirements and notifications.
export async function userPulse(userId: string) {
  const rows = await db.$queryRaw<Row[]>`
    SELECT
      (SELECT COUNT(*) FROM enquiries WHERE userId = ${userId}) AS enquiries,
      (SELECT MAX(updatedAt) FROM enquiries WHERE userId = ${userId}) AS enquiriesAt,
      (SELECT COUNT(*) FROM favourites WHERE userId = ${userId}) AS favourites,
      (SELECT MAX(createdAt) FROM favourites WHERE userId = ${userId}) AS favouritesAt,
      (SELECT COUNT(*) FROM buyer_requirements WHERE userId = ${userId}) AS requirements,
      (SELECT MAX(updatedAt) FROM buyer_requirements WHERE userId = ${userId}) AS requirementsAt,
      (SELECT COUNT(*) FROM notifications WHERE userId = ${userId} AND isRead = false) AS unread,
      (SELECT MAX(updatedAt) FROM users WHERE id = ${userId}) AS profileAt`;
  return fingerprint(rows[0]);
}
