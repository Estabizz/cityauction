"use client";

import { PAGE_SIZE } from "@/lib/admin/constants";
import { fmtDateTime, useAdminJson, useQueryState } from "./hooks";
import {
  Badge,
  Button,
  DateBox,
  EmptyState,
  ErrorNote,
  FilterBar,
  LoadingRows,
  PageHeader,
  Pagination,
  Panel,
  SearchBox,
  SelectBox,
  TextLink,
  tableClasses as t,
} from "./ui";

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue: unknown;
  newValue: unknown;
  ipAddress: string | null;
  timestamp: string;
  user: { id: string; email: string; fullName: string | null } | null;
}

interface ListResponse {
  data: AuditRow[];
  total: number;
  page: number;
  pageSize: number;
  actions: string[];
  entities: string[];
}

const ACTION_LABELS: Record<string, string> = {
  LEAD_STATUS_CHANGED: "Lead status changed",
  LEAD_NOTE_ADDED: "Lead note added",
  SUBSCRIBER_UNSUBSCRIBED: "Subscriber unsubscribed",
  SUBSCRIBER_REACTIVATED: "Subscriber reactivated",
  USER_ACTIVATED: "User activated",
  USER_DEACTIVATED: "User deactivated",
  ROLE_GRANTED: "Role granted",
  ROLE_REMOVED: "Role removed",
  PASSWORD_LINK_CREATED: "Password link created",
};

const label = (action: string) => ACTION_LABELS[action] ?? action.replace(/_/g, " ").toLowerCase();

function summarize(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return String(value);
  return Object.entries(value as Record<string, unknown>)
    .filter(([k]) => k !== "email")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") || "none" : typeof v === "object" ? JSON.stringify(v) : String(v)}`)
    .join(" · ");
}

function EntityLink({ row }: { row: AuditRow }) {
  const email = (row.newValue as { email?: string } | null)?.email ?? (row.previousValue as { email?: string } | null)?.email;
  if (row.entity === "Enquiry") return <TextLink href={`/admin/leads?id=${row.entityId}`}>Lead</TextLink>;
  if (row.entity === "User" && email) return <TextLink href={`/admin/users?q=${encodeURIComponent(email)}`}>{email}</TextLink>;
  if (row.entity === "Subscriber" && email) return <TextLink href={`/admin/subscribers?q=${encodeURIComponent(email)}`}>{email}</TextLink>;
  return (
    <span className="text-xs text-[#6f777d]">
      {row.entity} {row.entityId.slice(0, 10)}
    </span>
  );
}

const FILTER_KEYS = ["q", "action", "entity", "from", "to"] as const;

export function AuditLogView() {
  const { params, get, set } = useQueryState();
  const listParams = new URLSearchParams();
  for (const key of [...FILTER_KEYS, "page"]) if (params.get(key)) listParams.set(key, params.get(key)!);
  const { data, error, loading, reload } = useAdminJson<ListResponse>(`/api/admin/audit-logs?${listParams}`);
  const page = Number(get("page")) || 1;
  const hasFilters = FILTER_KEYS.some((k) => get(k));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title="Audit log"
        description="Every change made in this admin panel: who did it, when, and what changed. Entries cannot be edited or deleted here."
        actions={<Button onClick={reload}>Refresh</Button>}
      />

      <Panel>
        <div className="border-b border-[#efe9df] p-4 sm:px-5">
          <FilterBar>
            <SearchBox value={get("q")} onChange={(q) => set({ q })} placeholder="Search by admin name or email" />
            <SelectBox
              label="Action"
              value={get("action")}
              onChange={(action) => set({ action })}
              options={[{ value: "", label: "All actions" }, ...(data?.actions ?? []).map((a) => ({ value: a, label: label(a) }))]}
            />
            <SelectBox
              label="Record"
              value={get("entity")}
              onChange={(entity) => set({ entity })}
              options={[{ value: "", label: "All records" }, ...(data?.entities ?? []).map((e) => ({ value: e, label: e }))]}
            />
            <DateBox label="From" value={get("from")} onChange={(from) => set({ from })} />
            <DateBox label="To" value={get("to")} onChange={(to) => set({ to })} />
            {hasFilters && (
              <Button variant="ghost" onClick={() => set({ q: null, action: null, entity: null, from: null, to: null })}>
                Clear filters
              </Button>
            )}
          </FilterBar>
        </div>

        {error && <ErrorNote message={error} onRetry={reload} />}
        {loading ? (
          <LoadingRows />
        ) : data && data.data.length === 0 ? (
          <EmptyState title={hasFilters ? "No entries match" : "No admin changes yet"}>
            {hasFilters ? "Try clearing a filter." : "Status changes, notes, account changes and password links will be recorded here."}
          </EmptyState>
        ) : data ? (
          <>
            <div className="overflow-x-auto">
              <table className={t.table}>
                <thead className={t.head}>
                  <tr>
                    <th className={t.th}>When</th>
                    <th className={t.th}>Admin</th>
                    <th className={t.th}>Action</th>
                    <th className={`${t.th} hidden md:table-cell`}>Record</th>
                    <th className={`${t.th} hidden lg:table-cell`}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((row) => (
                    <tr key={row.id} className={t.row}>
                      <td className={`${t.td} whitespace-nowrap text-xs text-[#6f777d]`}>{fmtDateTime(row.timestamp)}</td>
                      <td className={t.td}>
                        <span className="block text-sm font-semibold text-[#182129]">{row.user?.fullName || row.user?.email || "Deleted user"}</span>
                        {row.ipAddress && <span className="block text-[11px] text-[#6f777d]">{row.ipAddress}</span>}
                      </td>
                      <td className={t.td}>
                        <Badge tone="gold">{label(row.action)}</Badge>
                        <span className="mt-1 block md:hidden">
                          <EntityLink row={row} />
                        </span>
                      </td>
                      <td className={`${t.td} hidden md:table-cell`}>
                        <EntityLink row={row} />
                      </td>
                      <td className={`${t.td} hidden max-w-md text-xs text-[#6f777d] lg:table-cell`}>
                        {row.previousValue != null && <span className="block">Before: {summarize(row.previousValue)}</span>}
                        {row.newValue != null && <span className="block text-[#182129]">After: {summarize(row.newValue)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={data.pageSize ?? PAGE_SIZE} total={data.total} onPage={(p) => set({ page: String(p) })} />
          </>
        ) : null}
      </Panel>
    </div>
  );
}
