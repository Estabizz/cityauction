import { db } from "@/lib/db";
import { CITY_PAGES } from "@/content/cities";
import { LEAD_SOURCES, sourceLabel } from "./constants";
import { daysAgo, startOfTodayIST } from "./time";

export type ActivityKind = "signup" | "lead" | "subscriber";

export interface ActivityItem {
  kind: ActivityKind;
  id: string;
  at: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface CountSet {
  today: number;
  week: number;
  total: number;
}

export interface OverviewData {
  now: string;
  counts: { signups: CountSet; leads: CountSet; subscribers: CountSet; openLeads: number };
  buyerPortal: { openCallbacks: number; openInspections: number; activeRequirements: number; savedListings: number; buyers: number };
  newSince: { signups: number; leads: number; subscribers: number; total: number } | null;
  leadsBySource: { source: string; label: string; total: number; week: number }[];
  activity: ActivityItem[];
  status: {
    database: { ok: boolean; latencyMs: number | null };
    authSecret: boolean;
    appUrl: string | null;
    cityPages: number;
    nodeVersion: string;
    uptimeSeconds: number;
    lastLeadAt: string | null;
    lastSignupAt: string | null;
  };
}

const FEED_PER_KIND = 15;
const FEED_SIZE = 30;

async function countSet(count: (since?: Date) => Promise<number>, today: Date, week: Date): Promise<CountSet> {
  const [t, w, all] = await Promise.all([count(today), count(week), count()]);
  return { today: t, week: w, total: all };
}

export async function getOverview(since?: Date): Promise<OverviewData> {
  const now = new Date();
  const today = startOfTodayIST(now);
  const week = daysAgo(7, now);
  const created = (d?: Date) => (d ? { createdAt: { gte: d } } : {});
  const sinceFilter = since ? { createdAt: { gt: since } } : undefined;

  const pingStart = Date.now();
  await db.$queryRaw`SELECT 1`;
  const latencyMs = Date.now() - pingStart;

  const open = { in: ["NEW", "IN_PROGRESS"] as ("NEW" | "IN_PROGRESS")[] };
  const buyerPortalCounts = Promise.all([
    db.enquiry.count({ where: { source: "callback-request", status: open } }),
    db.enquiry.count({ where: { source: "inspection-request", status: open } }),
    db.buyerRequirement.count({ where: { alertsEnabled: true, user: { deletedAt: null } } }),
    db.favourite.count({ where: { auctionId: { not: null } } }),
    db.user.count({ where: { deletedAt: null, email: { not: null }, isEmailVerified: true, buyerCategory: { not: null } } }),
  ]);

  const [signups, leads, subscribers, openLeads, bySourceAll, bySourceWeek, users, enquiries, subs, newSince] =
    await Promise.all([
      countSet((d) => db.user.count({ where: { deletedAt: null, ...created(d) } }), today, week),
      countSet((d) => db.enquiry.count({ where: created(d) }), today, week),
      countSet((d) => db.subscriber.count({ where: created(d) }), today, week),
      db.enquiry.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
      db.enquiry.groupBy({ by: ["source"], _count: { _all: true } }),
      db.enquiry.groupBy({ by: ["source"], _count: { _all: true }, where: { createdAt: { gte: week } } }),
      db.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: FEED_PER_KIND,
        select: { id: true, email: true, mobile: true, fullName: true, city: true, createdAt: true },
      }),
      db.enquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: FEED_PER_KIND,
        select: { id: true, name: true, email: true, subject: true, source: true, createdAt: true },
      }),
      db.subscriber.findMany({
        orderBy: { createdAt: "desc" },
        take: FEED_PER_KIND,
        select: { id: true, email: true, name: true, source: true, createdAt: true },
      }),
      sinceFilter
        ? Promise.all([
            db.user.count({ where: { deletedAt: null, ...sinceFilter } }),
            db.enquiry.count({ where: sinceFilter }),
            db.subscriber.count({ where: sinceFilter }),
          ])
        : null,
    ]);

  const [openCallbacks, openInspections, activeRequirements, savedListings, buyers] = await buyerPortalCounts;

  const weekBySource = new Map(bySourceWeek.map((row) => [row.source, row._count._all]));
  const totalBySource = new Map(bySourceAll.map((row) => [row.source, row._count._all]));
  const sources = [...new Set([...LEAD_SOURCES.map((s) => s.value), ...totalBySource.keys()])];
  const leadsBySource = sources
    .map((source) => ({
      source,
      label: sourceLabel(source),
      total: totalBySource.get(source) ?? 0,
      week: weekBySource.get(source) ?? 0,
    }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));

  const activity: ActivityItem[] = [
    ...users.map((u) => ({
      kind: "signup" as const,
      id: u.id,
      at: u.createdAt.toISOString(),
      title: u.fullName || u.email || u.mobile || "New user",
      subtitle: [u.email || u.mobile, u.city].filter(Boolean).join(" · "),
      href: `/admin/users?q=${encodeURIComponent(u.email || u.mobile || u.id)}`,
    })),
    ...enquiries.map((e) => ({
      kind: "lead" as const,
      id: e.id,
      at: e.createdAt.toISOString(),
      title: e.name || e.email,
      subtitle: [sourceLabel(e.source), e.subject].filter(Boolean).join(" · "),
      href: `/admin/leads?id=${e.id}`,
    })),
    ...subs.map((s) => ({
      kind: "subscriber" as const,
      id: s.id,
      at: s.createdAt.toISOString(),
      title: s.email,
      subtitle: [s.name, `via ${s.source}`].filter(Boolean).join(" · "),
      href: `/admin/subscribers?q=${encodeURIComponent(s.email)}`,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, FEED_SIZE);

  const secret = process.env.AUTH_SECRET;

  return {
    now: now.toISOString(),
    counts: { signups, leads, subscribers, openLeads },
    buyerPortal: { openCallbacks, openInspections, activeRequirements, savedListings, buyers },
    newSince: newSince
      ? {
          signups: newSince[0],
          leads: newSince[1],
          subscribers: newSince[2],
          total: newSince[0] + newSince[1] + newSince[2],
        }
      : null,
    leadsBySource,
    activity,
    status: {
      database: { ok: true, latencyMs },
      authSecret: !!secret && secret.length >= 32,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
      cityPages: CITY_PAGES.length,
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      lastLeadAt: enquiries[0]?.createdAt.toISOString() ?? null,
      lastSignupAt: users[0]?.createdAt.toISOString() ?? null,
    },
  };
}
