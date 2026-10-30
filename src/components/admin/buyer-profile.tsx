"use client";

import { useState } from "react";
import { ASSET_CLASSES, budgetLabel, citiesLabel, labelFor, OBJECTIVES, TIMELINES } from "@/lib/buyer";
import { ENQUIRY_STATUS_LABELS, sourceLabel, type EnquiryStatusValue } from "@/lib/admin/constants";
import { fmtDate, fmtDateTime, useAdminJson } from "./hooks";
import { useLive } from "./live";
import { Badge, ErrorNote, LoadingRows, TextLink } from "./ui";

type Json = string[] | unknown;

interface Detail {
  data: {
    mobile: string | null;
    buyerCategory: string | null;
    onboardedAt: string | null;
    marketingEmail: boolean;
    marketingSms: boolean;
    marketingWhatsapp: boolean;
    attribution: Record<string, string> | null;
    requirements: {
      id: string;
      name: string;
      assetClasses: Json;
      cities: Json;
      budgetRange: string | null;
      minBudget: string | null;
      maxBudget: string | null;
      objective: string | null;
      timeline: string | null;
      locality: string | null;
      alertsEnabled: boolean;
      alertChannels: Json;
      updatedAt: string;
    }[];
    favourites: { createdAt: string; auction: { id: string; auctionNumber: string; status: string; reservePrice: string; property: { title: string } } | null }[];
    enquiries: { id: string; subject: string; source: string; status: EnquiryStatusValue; createdAt: string; preferredDate: string | null }[];
    consentEvents: { id: string; kind: string; channel: string | null; granted: boolean; policyVersion: string | null; source: string; createdAt: string }[];
  };
}

const arr = (v: Json) => (Array.isArray(v) ? (v as string[]) : []);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">{title}</h3>
      {children}
    </section>
  );
}

// Buyer portal details inside the admin user drawer. Never shown to other buyers.
export function BuyerProfile({ userId }: { userId: string }) {
  const { data, error, loading, reload } = useAdminJson<Detail>(`/api/admin/users/${userId}`);
  const live = useLive();

  // Refresh when anything changes on the site (new save, request, edit…).
  const [seenVersion, setSeenVersion] = useState(live.version);
  if (live.version !== seenVersion) {
    setSeenVersion(live.version);
    if (seenVersion) reload();
  }

  if (error) return <ErrorNote message={error} onRetry={reload} />;
  if (loading || !data) return <LoadingRows />;
  const b = data.data;
  const attribution = b.attribution && Object.entries(b.attribution).filter(([k]) => k !== "firstSeenAt");

  return (
    <div className="space-y-6">
      <Section title="Buyer profile">
        <div className="rounded-2xl border border-[#e6dfd4] bg-white p-4 text-sm space-y-1.5">
          <p>
            <span className="text-[#6f777d]">Preferences step:</span> {b.onboardedAt ? `done ${fmtDate(b.onboardedAt)}` : "not done yet"}
          </p>
          <p className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#6f777d]">Promotional messages:</span>
            {(
              [
                ["SMS", b.marketingSms],
                ["WhatsApp", b.marketingWhatsapp],
                ["Email", b.marketingEmail],
              ] as const
            ).map(([label, on]) => (
              <Badge key={label} tone={on ? "green" : "grey"}>
                {label} {on ? "on" : "off"}
              </Badge>
            ))}
          </p>
          {attribution && attribution.length > 0 && (
            <p>
              <span className="text-[#6f777d]">First came from:</span> {attribution.map(([k, v]) => `${k}: ${v}`).join(" · ")}
            </p>
          )}
        </div>
      </Section>

      <Section title={`Requirements (${b.requirements.length})`}>
        {b.requirements.length === 0 ? (
          <p className="text-xs text-[#6f777d]">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {b.requirements.map((r) => (
              <li key={r.id} className="rounded-2xl border border-[#e6dfd4] bg-white p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-[#182129]">{r.name}</span>
                  <Badge tone={r.alertsEnabled ? "green" : "grey"}>{r.alertsEnabled ? `Alerts: ${arr(r.alertChannels).join(", ") || "on"}` : "Paused"}</Badge>
                </div>
                <p className="mt-1 text-xs text-[#6f777d]">
                  {arr(r.assetClasses).map((c) => labelFor(ASSET_CLASSES, c)).join(", ") || "Any asset"} · {citiesLabel(arr(r.cities))} ·{" "}
                  {budgetLabel({ budgetRange: r.budgetRange, minBudget: r.minBudget ? Number(r.minBudget) : null, maxBudget: r.maxBudget ? Number(r.maxBudget) : null })}
                  {r.objective && ` · ${labelFor(OBJECTIVES, r.objective)}`}
                  {r.timeline && ` · ${labelFor(TIMELINES, r.timeline)}`}
                  {r.locality && ` · ${r.locality}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Saved listings (${b.favourites.length})`}>
        {b.favourites.length === 0 ? (
          <p className="text-xs text-[#6f777d]">None yet.</p>
        ) : (
          <ul className="divide-y divide-[#f3efe8] rounded-2xl border border-[#e6dfd4] bg-white text-sm">
            {b.favourites.map((f, i) =>
              f.auction ? (
                <li key={f.auction.id + i} className="flex items-center justify-between gap-2 px-3 py-2">
                  <a href={`/auctions/${f.auction.id}`} target="_blank" rel="noreferrer" className="min-w-0 truncate text-[#7a5f33] hover:underline">
                    {f.auction.property.title}
                  </a>
                  <span className="shrink-0 text-xs text-[#6f777d]">{f.auction.status.replace(/_/g, " ").toLowerCase()} · saved {fmtDate(f.createdAt)}</span>
                </li>
              ) : null
            )}
          </ul>
        )}
      </Section>

      <Section title={`Requests (${b.enquiries.length})`}>
        {b.enquiries.length === 0 ? (
          <p className="text-xs text-[#6f777d]">None yet.</p>
        ) : (
          <ul className="divide-y divide-[#f3efe8] rounded-2xl border border-[#e6dfd4] bg-white text-sm">
            {b.enquiries.map((e) => (
              <li key={e.id} className="px-3 py-2">
                <TextLink href={`/admin/leads?id=${e.id}`}>{e.subject}</TextLink>
                <span className="block text-xs text-[#6f777d]">
                  {sourceLabel(e.source)} · {ENQUIRY_STATUS_LABELS[e.status] ?? e.status} · {fmtDate(e.createdAt)}
                  {e.preferredDate && ` · preferred ${fmtDate(e.preferredDate)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Consent history">
        {b.consentEvents.length === 0 ? (
          <p className="text-xs text-[#6f777d]">No consent records (account created before consent logging).</p>
        ) : (
          <ul className="space-y-1 text-xs text-[#6f777d]">
            {b.consentEvents.map((c) => (
              <li key={c.id}>
                {fmtDateTime(c.createdAt)} ·{" "}
                <strong className="text-[#182129]">
                  {c.kind === "TERMS_PRIVACY" ? "Accepted Terms & Privacy" : `${c.granted ? "Opted in to" : "Opted out of"} ${c.channel?.toLowerCase()} marketing`}
                </strong>{" "}
                · via {c.source}
                {c.policyVersion && ` · policy ${c.policyVersion}`}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
