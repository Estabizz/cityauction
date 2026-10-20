"use client";

import Link from "next/link";
import { ArrowRight, Inbox, Mail, RefreshCw, Users } from "lucide-react";
import type { ActivityKind, CountSet } from "@/lib/admin/overview";
import { useLive } from "./live";
import { fmtDateTime, timeAgo } from "./hooks";
import { Badge, Button, EmptyState, ErrorNote, LoadingRows, PageHeader, Panel, type BadgeTone } from "./ui";

const KIND: Record<ActivityKind, { label: string; tone: BadgeTone }> = {
  signup: { label: "Sign-up", tone: "navy" },
  lead: { label: "Lead", tone: "gold" },
  subscriber: { label: "Subscriber", tone: "green" },
};

function StatCard({ title, icon, counts, href, fresh }: { title: string; icon: React.ReactNode; counts: CountSet; href: string; fresh: number }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#e6dfd4] bg-white p-5 shadow-[0_12px_36px_rgba(9,17,24,.05)] transition-colors hover:border-[#b49361]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">{title}</span>
        <span className="rounded-xl bg-[#f6f2ea] p-2 text-[#7a5f33]">{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif-heading text-4xl font-semibold text-[#091118]">{counts.today.toLocaleString("en-IN")}</span>
        <span className="text-xs text-[#6f777d]">today</span>
        {fresh > 0 && <Badge tone="gold">+{fresh} new</Badge>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#efe9df] pt-3 text-xs">
        <div>
          <span className="block text-[#6f777d]">Last 7 days</span>
          <span className="font-semibold text-[#182129]">{counts.week.toLocaleString("en-IN")}</span>
        </div>
        <div>
          <span className="block text-[#6f777d]">All time</span>
          <span className="font-semibold text-[#182129]">{counts.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </Link>
  );
}

function StatusRow({ label, ok, children }: { label: string; ok: boolean | null; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="flex items-center gap-2 text-[#6f777d]">
        <span className={`h-2 w-2 shrink-0 rounded-full ${ok === null ? "bg-[#d9c39c]" : ok ? "bg-emerald-500" : "bg-red-500"}`} />
        {label}
      </span>
      <span className="text-right font-medium text-[#182129]">{children}</span>
    </div>
  );
}

export function DashboardView() {
  const { data, error, lastUpdated, baseline, newCount, markSeen, refresh } = useLive();

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin" title="Overview" />
        <Panel>{error ? <ErrorNote message={error} onRetry={refresh} /> : <LoadingRows />}</Panel>
      </div>
    );
  }

  const { counts, newSince, leadsBySource, activity, status } = data;
  const maxSource = Math.max(1, ...leadsBySource.map((s) => s.total));
  const now = lastUpdated ?? undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        description="Everything visitors submit on cityauction.in, updated every 15 seconds while this page is open."
        actions={
          <>
            <span className="text-xs text-[#6f777d]">Updated {lastUpdated ? timeAgo(new Date(lastUpdated)) : "—"}</span>
            <Button onClick={refresh}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </>
        }
      />

      {error && <ErrorNote message={`Live updates paused: ${error}`} onRetry={refresh} />}

      {newCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e8d7b5] bg-[#f5edd9] px-4 py-3 text-sm text-[#5e4b2a]">
          <span>
            <strong>{newCount} new</strong> since you opened the panel
            {newSince && ` — ${newSince.leads} lead${newSince.leads === 1 ? "" : "s"}, ${newSince.signups} sign-up${newSince.signups === 1 ? "" : "s"}, ${newSince.subscribers} subscriber${newSince.subscribers === 1 ? "" : "s"}`}
            .
          </span>
          <Button variant="primary" onClick={markSeen}>
            Mark as seen
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Leads" icon={<Inbox className="h-4 w-4" />} counts={counts.leads} href="/admin/leads" fresh={newSince?.leads ?? 0} />
        <StatCard title="Sign-ups" icon={<Users className="h-4 w-4" />} counts={counts.signups} href="/admin/users" fresh={newSince?.signups ?? 0} />
        <StatCard
          title="Subscribers"
          icon={<Mail className="h-4 w-4" />}
          counts={counts.subscribers}
          href="/admin/subscribers"
          fresh={newSince?.subscribers ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Latest activity"
          action={<span className="text-xs text-[#6f777d]">Newest first · gold = arrived since you opened</span>}
        >
          {activity.length === 0 ? (
            <EmptyState title="Nothing yet">Sign-ups, form submissions and subscriptions will appear here as they come in.</EmptyState>
          ) : (
            <ul className="divide-y divide-[#f3efe8]">
              {activity.map((item) => {
                const isNew = !!baseline && item.at > baseline;
                return (
                  <li key={`${item.kind}-${item.id}`}>
                    <Link
                      href={item.href}
                      className={`flex items-start gap-3 border-l-4 px-4 py-3 transition-colors hover:bg-[#fbf9f5] sm:px-5 ${
                        isNew ? "border-[#b49361] bg-[#fbf6ec]" : "border-transparent"
                      }`}
                    >
                      <Badge tone={KIND[item.kind].tone} className="mt-0.5 w-[78px] justify-center">
                        {KIND[item.kind].label}
                      </Badge>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#182129]">{item.title}</span>
                        <span className="block truncate text-xs text-[#6f777d]">{item.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-right text-[11px] text-[#6f777d]" title={fmtDateTime(item.at)}>
                        {isNew && <span className="mb-0.5 block font-bold uppercase tracking-wider text-[#9a7b4a]">New</span>}
                        {timeAgo(item.at, now)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-6 lg:col-span-2">
          <Panel
            title="Leads by form"
            action={
              <Link href="/admin/leads" className="flex items-center gap-1 text-xs font-semibold text-[#7a5f33] hover:underline">
                All leads <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <ul className="space-y-3 px-4 py-4 sm:px-5">
              {leadsBySource.map((s) => (
                <li key={s.source}>
                  <Link href={`/admin/leads?source=${encodeURIComponent(s.source)}`} className="group block">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium text-[#182129] group-hover:underline">{s.label}</span>
                      <span className="text-xs text-[#6f777d]">
                        <strong className="text-[#182129]">{s.total}</strong>
                        {s.week > 0 && ` · ${s.week} this week`}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#f0ebe3]">
                      <div className="h-full rounded-full bg-[#b49361]" style={{ width: `${(s.total / maxSource) * 100}%` }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#efe9df] px-4 py-3 text-xs text-[#6f777d] sm:px-5">
              {counts.openLeads} lead{counts.openLeads === 1 ? "" : "s"} still new or in progress.
            </div>
          </Panel>

          <Panel title="Site status">
            <div className="divide-y divide-[#f3efe8] px-4 py-2 sm:px-5">
              <StatusRow label="Database" ok={status.database.ok}>
                Connected{status.database.latencyMs !== null && ` · ${status.database.latencyMs} ms`}
              </StatusRow>
              <StatusRow label="Login security key" ok={status.authSecret}>
                {status.authSecret ? "Set" : "AUTH_SECRET missing"}
              </StatusRow>
              <StatusRow label="Site address" ok={status.appUrl ? true : null}>
                {status.appUrl ?? "NEXT_PUBLIC_APP_URL not set"}
              </StatusRow>
              <StatusRow label="Location pages" ok={status.cityPages > 0}>
                <Link href="/admin/site" className="hover:underline">
                  {status.cityPages} live
                </Link>
              </StatusRow>
              <StatusRow label="Last lead" ok={null}>
                {status.lastLeadAt ? timeAgo(status.lastLeadAt, now) : "None yet"}
              </StatusRow>
              <StatusRow label="Last sign-up" ok={null}>
                {status.lastSignupAt ? timeAgo(status.lastSignupAt, now) : "None yet"}
              </StatusRow>
              <StatusRow label="Server" ok={null}>
                Node {status.nodeVersion} · up {Math.floor(status.uptimeSeconds / 3600)} h {Math.floor((status.uptimeSeconds % 3600) / 60)} m
              </StatusRow>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
