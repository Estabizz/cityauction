"use client";

import { useState } from "react";
import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, PAGE_SIZE, sourceLabel, type EnquiryStatusValue } from "@/lib/admin/constants";
import { fmtDateTime, sendJson, timeAgo, useAdminJson, useQueryState } from "./hooks";
import { useLive } from "./live";
import { PasswordLinkTool } from "./password-link";
import {
  Badge,
  Button,
  DateBox,
  Drawer,
  EmptyState,
  ErrorNote,
  ExportLink,
  Field,
  FilterBar,
  LEAD_STATUS_TONES,
  LoadingRows,
  PageHeader,
  Pagination,
  Panel,
  SearchBox,
  SelectBox,
  TextLink,
  tableClasses as t,
} from "./ui";

interface UserRef {
  id: string;
  email: string;
  fullName: string | null;
  phone?: string | null;
  isActive?: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  pagePath: string | null;
  metadata: unknown;
  status: EnquiryStatusValue;
  adminNotes: string | null;
  userId: string | null;
  auctionId: string | null;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserRef | null;
}

interface ListResponse {
  data: Lead[];
  total: number;
  page: number;
  pageSize: number;
  sources: { value: string; label: string; count: number }[];
}

const FILTER_KEYS = ["q", "source", "status", "from", "to"] as const;

export function LeadsView() {
  const { params, get, set } = useQueryState();
  const live = useLive();
  const listParams = new URLSearchParams();
  for (const key of [...FILTER_KEYS, "page"]) if (params.get(key)) listParams.set(key, params.get(key)!);
  const exportParams = new URLSearchParams(listParams);
  exportParams.delete("page");

  const { data, error, loading, reload } = useAdminJson<ListResponse>(`/api/admin/leads?${listParams}`);
  const page = Number(get("page")) || 1;
  const openId = get("id");

  // Pull in new leads as they arrive (page 1 only, so rows don't shift under you).
  const liveTotal = live.data?.counts.leads.total;
  const [seenTotal, setSeenTotal] = useState(liveTotal);
  if (liveTotal !== seenTotal) {
    setSeenTotal(liveTotal);
    if (seenTotal !== undefined && page === 1) reload();
  }

  const hasFilters = FILTER_KEYS.some((k) => get(k));
  const sourceOptions = [
    { value: "", label: "All forms" },
    ...(data?.sources ?? []).map((s) => ({ value: s.value, label: `${s.label} (${s.count})` })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visitors"
        title="Leads & enquiries"
        description="Every form submitted on the site: contact, alerts, careers, investor desk, liquidation, mandates, password resets and more."
        actions={<ExportLink href={`/api/admin/leads/export?${exportParams}`} />}
      />

      <Panel>
        <div className="border-b border-[#efe9df] p-4 sm:px-5">
          <FilterBar>
            <SearchBox value={get("q")} onChange={(q) => set({ q })} placeholder="Search name, email or phone" />
            <SelectBox label="Form" value={get("source")} onChange={(source) => set({ source })} options={sourceOptions} />
            <SelectBox
              label="Status"
              value={get("status")}
              onChange={(status) => set({ status })}
              options={[{ value: "", label: "Any status" }, ...ENQUIRY_STATUSES.map((s) => ({ value: s, label: ENQUIRY_STATUS_LABELS[s] }))]}
            />
            <DateBox label="From" value={get("from")} onChange={(from) => set({ from })} />
            <DateBox label="To" value={get("to")} onChange={(to) => set({ to })} />
            {hasFilters && (
              <Button variant="ghost" onClick={() => set({ q: null, source: null, status: null, from: null, to: null })}>
                Clear filters
              </Button>
            )}
          </FilterBar>
        </div>

        {error && <ErrorNote message={error} onRetry={reload} />}
        {loading ? (
          <LoadingRows />
        ) : data && data.data.length === 0 ? (
          <EmptyState title={hasFilters ? "No leads match" : "No leads yet"}>
            {hasFilters ? "Try clearing a filter." : "When a visitor submits any form on the site, it will show up here within seconds."}
          </EmptyState>
        ) : data ? (
          <>
            <div className="overflow-x-auto">
              <table className={t.table}>
                <thead className={t.head}>
                  <tr>
                    <th className={t.th}>Received</th>
                    <th className={t.th}>From</th>
                    <th className={`${t.th} hidden md:table-cell`}>Form</th>
                    <th className={`${t.th} hidden lg:table-cell`}>Subject</th>
                    <th className={t.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((lead) => {
                    const isNew = !!live.baseline && lead.createdAt > live.baseline;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => set({ id: lead.id, page: get("page") || null })}
                        className={`${t.row} cursor-pointer ${isNew ? "bg-[#fbf6ec]" : ""}`}
                      >
                        <td className={`${t.td} whitespace-nowrap text-xs text-[#6f777d]`} title={fmtDateTime(lead.createdAt)}>
                          {isNew && <span className="block font-bold uppercase tracking-wider text-[#9a7b4a]">New</span>}
                          {timeAgo(lead.createdAt)}
                        </td>
                        <td className={t.td}>
                          <span className="block font-semibold text-[#182129]">{lead.name || "—"}</span>
                          <span className="block text-xs text-[#6f777d]">{lead.email}</span>
                          <span className="block text-xs text-[#6f777d]">{lead.phone}</span>
                          <span className="mt-1 block md:hidden">
                            <Badge>{sourceLabel(lead.source)}</Badge>
                          </span>
                        </td>
                        <td className={`${t.td} hidden md:table-cell`}>
                          <Badge>{sourceLabel(lead.source)}</Badge>
                        </td>
                        <td className={`${t.td} hidden max-w-sm lg:table-cell`}>
                          <span className="line-clamp-1 font-medium text-[#182129]">{lead.subject}</span>
                          <span className="line-clamp-2 text-xs text-[#6f777d]">{lead.message}</span>
                        </td>
                        <td className={t.td}>
                          <Badge tone={LEAD_STATUS_TONES[lead.status]}>{ENQUIRY_STATUS_LABELS[lead.status]}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={data.pageSize ?? PAGE_SIZE} total={data.total} onPage={(p) => set({ page: String(p) })} />
          </>
        ) : null}
      </Panel>

      <LeadDrawer key={openId} id={openId} onClose={() => set({ id: null, page: get("page") || null })} onChanged={reload} />
    </div>
  );
}

interface Detail {
  data: {
    lead: Lead;
    matchedUser: UserRef | null;
    history: { id: string; action: string; timestamp: string; newValue: unknown; previousValue: unknown; user: { email: string; fullName: string | null } | null }[];
  };
}

function MetadataList({ value }: { value: unknown }) {
  if (!value || typeof value !== "object") return <span className="text-[#6f777d]">None</span>;
  const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (entries.length === 0) return <span className="text-[#6f777d]">None</span>;
  return (
    <dl className="divide-y divide-[#f3efe8]">
      {entries.map(([key, v]) => (
        <Field key={key} label={key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ")}>
          {Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v)}
        </Field>
      ))}
    </dl>
  );
}

// pagePath comes from the visitor's browser; only link it if it is a path on this site.
function isSitePath(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

const HISTORY_LABELS: Record<string, string> = {
  LEAD_STATUS_CHANGED: "changed status",
  LEAD_NOTE_ADDED: "added a note",
};

function LeadDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { data, error, loading, reload } = useAdminJson<Detail>(id ? `/api/admin/leads/${id}` : null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const lead = data?.data.lead.id === id ? data.data.lead : null;
  const matchedUser = lead ? data?.data.matchedUser : null;

  const update = async (body: { status?: EnquiryStatusValue; note?: string }, key: string) => {
    setBusy(key);
    setActionError(null);
    try {
      await sendJson(`/api/admin/leads/${id}`, "PATCH", body);
      if (body.note) setNote("");
      reload();
      onChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(null);
    }
  };

  const whatsapp = lead?.phone.replace(/\D/g, "");

  return (
    <Drawer open={!!id} onClose={onClose} title={lead ? lead.name || lead.email : "Lead"}>
      {error && <ErrorNote message={error} onRetry={reload} />}
      {(loading || (!lead && !error)) && <LoadingRows />}
      {lead && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{sourceLabel(lead.source)}</Badge>
            <Badge tone={LEAD_STATUS_TONES[lead.status]}>{ENQUIRY_STATUS_LABELS[lead.status]}</Badge>
            <span className="text-xs text-[#6f777d]">{fmtDateTime(lead.createdAt)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6dfd4] bg-white px-3 py-2 text-xs font-semibold hover:border-[#b49361]">
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6dfd4] bg-white px-3 py-2 text-xs font-semibold hover:border-[#b49361]">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            )}
            {whatsapp && whatsapp.length >= 10 && (
              <a
                href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6dfd4] bg-white px-3 py-2 text-xs font-semibold hover:border-[#b49361]"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
          </div>

          <section className="rounded-2xl border border-[#e6dfd4] bg-white p-4">
            <dl className="divide-y divide-[#f3efe8]">
              <Field label="Name">{lead.name}</Field>
              <Field label="Email">{lead.email}</Field>
              <Field label="Phone">{lead.phone}</Field>
              <Field label="Subject">{lead.subject}</Field>
              <Field label="Page">
                {isSitePath(lead.pagePath) ? (
                  <a href={lead.pagePath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#7a5f33] hover:underline">
                    {lead.pagePath} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  lead.pagePath
                )}
              </Field>
              <Field label="Account">
                {lead.user ? (
                  <TextLink href={`/admin/users?q=${encodeURIComponent(lead.user.email)}`}>
                    Signed in as {lead.user.fullName || lead.user.email}
                  </TextLink>
                ) : matchedUser ? (
                  <>
                    Not signed in, but an account uses this email:{" "}
                    <TextLink href={`/admin/users?q=${encodeURIComponent(matchedUser.email)}`}>{matchedUser.fullName || matchedUser.email}</TextLink>
                  </>
                ) : (
                  <span className="text-[#6f777d]">Not signed in, no account with this email</span>
                )}
              </Field>
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Message</h3>
            <p className="whitespace-pre-wrap rounded-2xl border border-[#e6dfd4] bg-white p-4 text-sm leading-relaxed text-[#182129]">
              {lead.message || "—"}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Form details</h3>
            <div className="rounded-2xl border border-[#e6dfd4] bg-white p-4 text-sm">
              <MetadataList value={lead.metadata} />
            </div>
          </section>

          {lead.source === "password-reset" && (
            <section className="rounded-2xl border border-[#e8d7b5] bg-[#fbf6ec] p-4">
              <h3 className="mb-1 font-serif-heading text-xl font-semibold text-[#091118]">Password reset</h3>
              {matchedUser ? (
                <>
                  <p className="mb-3 text-xs text-[#5e4b2a]">
                    Create a one-time link for {matchedUser.email}, send it to them, then mark this lead as resolved.
                  </p>
                  <PasswordLinkTool userId={matchedUser.id} />
                </>
              ) : (
                <p className="text-xs text-[#5e4b2a]">No account uses {lead.email}, so there is no password to reset.</p>
              )}
            </section>
          )}

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Status</h3>
            <div className="flex flex-wrap gap-2">
              {ENQUIRY_STATUSES.map((s) => (
                <Button
                  key={s}
                  variant={lead.status === s ? "primary" : "outline"}
                  busy={busy === s}
                  disabled={!!busy}
                  aria-pressed={lead.status === s}
                  onClick={() => lead.status !== s && update({ status: s }, s)}
                >
                  {ENQUIRY_STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Notes</h3>
            {lead.adminNotes ? (
              <pre className="mb-3 whitespace-pre-wrap rounded-2xl border border-[#e6dfd4] bg-white p-4 font-sans text-sm text-[#182129]">{lead.adminNotes}</pre>
            ) : (
              <p className="mb-3 text-xs text-[#6f777d]">No notes yet.</p>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder="Add a note for the team (who called, what was promised…)"
              className="w-full rounded-xl border border-[#e6dfd4] bg-white p-3 text-sm outline-none focus:border-[#b49361]"
            />
            <div className="mt-2 flex justify-end">
              <Button variant="primary" busy={busy === "note"} disabled={!note.trim() || !!busy} onClick={() => update({ note: note.trim() }, "note")}>
                Add note
              </Button>
            </div>
          </section>

          {actionError && <p className="text-sm text-red-700">{actionError}</p>}

          {data && data.data.history.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">History</h3>
              <ul className="space-y-1.5 text-xs text-[#6f777d]">
                {data.data.history.map((h) => {
                  const next = h.newValue as { status?: EnquiryStatusValue } | null;
                  return (
                    <li key={h.id}>
                      {fmtDateTime(h.timestamp)} · <strong className="text-[#182129]">{h.user?.fullName || h.user?.email || "Unknown"}</strong>{" "}
                      {HISTORY_LABELS[h.action] ?? h.action}
                      {next?.status && ` to ${ENQUIRY_STATUS_LABELS[next.status] ?? next.status}`}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}
    </Drawer>
  );
}
