"use client";

import { useState } from "react";
import { PAGE_SIZE, type SubscriberStatusValue } from "@/lib/admin/constants";
import { fmtDateTime, sendJson, timeAgo, useAdminJson, useQueryState } from "./hooks";
import { useLive } from "./live";
import {
  Badge,
  Button,
  EmptyState,
  ErrorNote,
  ExportLink,
  FilterBar,
  LoadingRows,
  PageHeader,
  Pagination,
  Panel,
  SearchBox,
  SelectBox,
  tableClasses as t,
} from "./ui";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  pagePath: string | null;
  status: SubscriberStatusValue;
  createdAt: string;
  updatedAt: string;
}

interface ListResponse {
  data: Subscriber[];
  total: number;
  page: number;
  pageSize: number;
  counts: Partial<Record<SubscriberStatusValue, number>>;
}

const FILTER_KEYS = ["q", "status", "source"] as const;

export function SubscribersView() {
  const { params, get, set } = useQueryState();
  const live = useLive();
  const listParams = new URLSearchParams();
  for (const key of [...FILTER_KEYS, "page"]) if (params.get(key)) listParams.set(key, params.get(key)!);
  const exportParams = new URLSearchParams(listParams);
  exportParams.delete("page");

  const { data, error, loading, reload } = useAdminJson<ListResponse>(`/api/admin/subscribers?${listParams}`);
  const page = Number(get("page")) || 1;
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const liveTotal = live.data?.counts.subscribers.total;
  const [seenTotal, setSeenTotal] = useState(liveTotal);
  if (liveTotal !== seenTotal) {
    setSeenTotal(liveTotal);
    if (seenTotal !== undefined && page === 1) reload();
  }

  const changeStatus = async (sub: Subscriber, status: SubscriberStatusValue) => {
    if (status === "UNSUBSCRIBED" && !window.confirm(`Unsubscribe ${sub.email}? They will stop receiving updates.`)) return;
    setBusyId(sub.id);
    setActionError(null);
    try {
      await sendJson(`/api/admin/subscribers/${sub.id}`, "PATCH", { status });
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusyId(null);
    }
  };

  const hasFilters = FILTER_KEYS.some((k) => get(k));
  const counts = data?.counts ?? {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visitors"
        title="Subscribers"
        description={
          data
            ? `${(counts.ACTIVE ?? 0).toLocaleString("en-IN")} active · ${(counts.UNSUBSCRIBED ?? 0).toLocaleString("en-IN")} unsubscribed`
            : "People who signed up for updates from the subscribe boxes."
        }
        actions={<ExportLink href={`/api/admin/subscribers/export?${exportParams}`} />}
      />

      <Panel>
        <div className="border-b border-[#efe9df] p-4 sm:px-5">
          <FilterBar>
            <SearchBox value={get("q")} onChange={(q) => set({ q })} placeholder="Search email or name" />
            <SelectBox
              label="Status"
              value={get("status")}
              onChange={(status) => set({ status })}
              options={[
                { value: "", label: "Any status" },
                { value: "ACTIVE", label: "Active" },
                { value: "UNSUBSCRIBED", label: "Unsubscribed" },
              ]}
            />
            {hasFilters && (
              <Button variant="ghost" onClick={() => set({ q: null, status: null, source: null })}>
                Clear filters
              </Button>
            )}
          </FilterBar>
        </div>

        {(error || actionError) && <ErrorNote message={(error || actionError)!} onRetry={error ? reload : undefined} />}
        {loading ? (
          <LoadingRows />
        ) : data && data.data.length === 0 ? (
          <EmptyState title={hasFilters ? "No subscribers match" : "No subscribers yet"}>
            {hasFilters ? "Try clearing a filter." : "Emails entered in the site's subscribe boxes will appear here."}
          </EmptyState>
        ) : data ? (
          <>
            <div className="overflow-x-auto">
              <table className={t.table}>
                <thead className={t.head}>
                  <tr>
                    <th className={t.th}>Email</th>
                    <th className={`${t.th} hidden md:table-cell`}>From</th>
                    <th className={`${t.th} hidden sm:table-cell`}>Subscribed</th>
                    <th className={t.th}>Status</th>
                    <th className={`${t.th} text-right`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((sub) => {
                    const isNew = !!live.baseline && sub.createdAt > live.baseline;
                    return (
                      <tr key={sub.id} className={`${t.row} ${isNew ? "bg-[#fbf6ec]" : ""}`}>
                        <td className={t.td}>
                          <span className="block break-all font-semibold text-[#182129]">{sub.email}</span>
                          {sub.name && <span className="block text-xs text-[#6f777d]">{sub.name}</span>}
                          <span className="block text-xs text-[#6f777d] sm:hidden">{timeAgo(sub.createdAt)}</span>
                        </td>
                        <td className={`${t.td} hidden md:table-cell`}>
                          <Badge>{sub.source}</Badge>
                          {sub.pagePath && <span className="mt-1 block text-xs text-[#6f777d]">{sub.pagePath}</span>}
                        </td>
                        <td className={`${t.td} hidden whitespace-nowrap text-xs text-[#6f777d] sm:table-cell`} title={fmtDateTime(sub.createdAt)}>
                          {isNew && <span className="block font-bold uppercase tracking-wider text-[#9a7b4a]">New</span>}
                          {fmtDateTime(sub.createdAt)}
                        </td>
                        <td className={t.td}>
                          <Badge tone={sub.status === "ACTIVE" ? "green" : "grey"}>{sub.status === "ACTIVE" ? "Active" : "Unsubscribed"}</Badge>
                        </td>
                        <td className={`${t.td} text-right`}>
                          {sub.status === "ACTIVE" ? (
                            <Button variant="danger" busy={busyId === sub.id} onClick={() => changeStatus(sub, "UNSUBSCRIBED")}>
                              Unsubscribe
                            </Button>
                          ) : (
                            <Button busy={busyId === sub.id} onClick={() => changeStatus(sub, "ACTIVE")}>
                              Reactivate
                            </Button>
                          )}
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
    </div>
  );
}
