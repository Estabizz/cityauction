"use client";

import { useState } from "react";
import { PAGE_SIZE, type ManagedRole } from "@/lib/admin/constants";
import { fmtDate, fmtDateTime, sendJson, timeAgo, useAdminJson, useQueryState } from "./hooks";
import { useLive } from "./live";
import { PasswordLinkTool } from "./password-link";
import { BuyerProfile } from "./buyer-profile";
import { BUYER_CATEGORIES, labelFor } from "@/lib/buyer";
import {
  Badge,
  Button,
  Drawer,
  EmptyState,
  ErrorNote,
  Field,
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

interface UserRow {
  id: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  mobile: string | null;
  buyerCategory: string | null;
  onboardedAt: string | null;
  requirementCount: number;
  savedCount: number;
  city: string | null;
  state: string | null;
  accountType: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  roles: string[];
  hasPassword: boolean;
  pendingLinkExpires: string | null;
  leadCount: number;
}

interface ListResponse {
  data: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  viewer: { id: string; isSuperAdmin: boolean };
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  BIDDER: "Bidder",
  REGISTERED: "Registered",
};

function RoleBadges({ roles }: { roles: string[] }) {
  if (roles.length === 0) return <span className="text-xs text-[#6f777d]">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge key={r} tone={r === "SUPER_ADMIN" || r === "ADMIN" ? "navy" : "grey"}>
          {ROLE_LABELS[r] ?? r}
        </Badge>
      ))}
    </span>
  );
}

const FILTER_KEYS = ["q", "active", "role", "buyers", "category"] as const;

export function UsersView() {
  const { params, get, set } = useQueryState();
  const live = useLive();
  const listParams = new URLSearchParams();
  for (const key of [...FILTER_KEYS, "page"]) if (params.get(key)) listParams.set(key, params.get(key)!);

  const { data, error, loading, reload } = useAdminJson<ListResponse>(`/api/admin/users?${listParams}`);
  const page = Number(get("page")) || 1;
  const [openId, setOpenId] = useState<string | null>(null);

  // Reload when anything changes: new rows, or edits by another admin.
  const [seenVersion, setSeenVersion] = useState(live.version);
  if (live.version !== seenVersion) {
    setSeenVersion(live.version);
    if (seenVersion) reload();
  }

  const hasFilters = FILTER_KEYS.some((k) => get(k));
  const open = data?.data.find((u) => u.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visitors"
        title="Users & sign-ups"
        description="Everyone who created an account. Open a user to activate or deactivate them, create a password link, or manage admin access."
      />

      <Panel>
        <div className="border-b border-[#efe9df] p-4 sm:px-5">
          <FilterBar>
            <SearchBox value={get("q")} onChange={(q) => set({ q })} placeholder="Search name, email, phone or city" />
            <SelectBox
              label="Active"
              value={get("active")}
              onChange={(active) => set({ active })}
              options={[
                { value: "", label: "Active and inactive" },
                { value: "true", label: "Active only" },
                { value: "false", label: "Deactivated only" },
              ]}
            />
            <SelectBox
              label="Buyers"
              value={get("buyers")}
              onChange={(buyers) => set({ buyers })}
              options={[
                { value: "", label: "All accounts" },
                { value: "1", label: "Buyer portal (email verified)" },
              ]}
            />
            <SelectBox
              label="Category"
              value={get("category")}
              onChange={(category) => set({ category })}
              options={[{ value: "", label: "Any category" }, ...BUYER_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))]}
            />
            <SelectBox
              label="Role"
              value={get("role")}
              onChange={(role) => set({ role })}
              options={[
                { value: "", label: "Everyone" },
                { value: "admins", label: "Admins only" },
              ]}
            />
            {hasFilters && (
              <Button variant="ghost" onClick={() => set({ q: null, active: null, role: null, buyers: null, category: null })}>
                Clear filters
              </Button>
            )}
          </FilterBar>
        </div>

        {error && <ErrorNote message={error} onRetry={reload} />}
        {loading ? (
          <LoadingRows />
        ) : data && data.data.length === 0 ? (
          <EmptyState title={hasFilters ? "No users match" : "No sign-ups yet"}>
            {hasFilters ? "Try clearing a filter." : "New accounts appear here as soon as someone registers."}
          </EmptyState>
        ) : data ? (
          <>
            <div className="overflow-x-auto">
              <table className={t.table}>
                <thead className={t.head}>
                  <tr>
                    <th className={t.th}>User</th>
                    <th className={`${t.th} hidden lg:table-cell`}>Phone</th>
                    <th className={`${t.th} hidden md:table-cell`}>Buyer</th>
                    <th className={`${t.th} hidden md:table-cell`}>Roles</th>
                    <th className={`${t.th} hidden sm:table-cell`}>Joined</th>
                    <th className={`${t.th} hidden lg:table-cell`}>Last login</th>
                    <th className={t.th}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((user) => {
                    const isNew = !!live.baseline && user.createdAt > live.baseline;
                    return (
                      <tr key={user.id} onClick={() => setOpenId(user.id)} className={`${t.row} cursor-pointer ${isNew ? "bg-[#fbf6ec]" : ""}`}>
                        <td className={t.td}>
                          {isNew && <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9a7b4a]">New</span>}
                          <span className="block font-semibold text-[#182129]">{user.fullName || "—"}</span>
                          <span className="block break-all text-xs text-[#6f777d]">{user.email || "No email (assisted recovery needed)"}</span>
                          <span className="mt-1 block md:hidden">
                            <RoleBadges roles={user.roles} />
                          </span>
                        </td>
                        <td className={`${t.td} hidden whitespace-nowrap text-xs lg:table-cell`}>{user.phone || "—"}</td>
                        <td className={`${t.td} hidden text-xs md:table-cell`}>
                          {user.buyerCategory ? (
                            <>
                              <span className="block font-semibold text-[#182129]">{labelFor(BUYER_CATEGORIES, user.buyerCategory)}</span>
                              <span className="text-[#6f777d]">
                                {user.requirementCount} requirement{user.requirementCount === 1 ? "" : "s"} · {user.savedCount} saved
                              </span>
                            </>
                          ) : (
                            <span className="text-[#6f777d]">{[user.city, user.state].filter(Boolean).join(", ") || "—"}</span>
                          )}
                        </td>
                        <td className={`${t.td} hidden md:table-cell`}>
                          <RoleBadges roles={user.roles} />
                        </td>
                        <td className={`${t.td} hidden whitespace-nowrap text-xs text-[#6f777d] sm:table-cell`} title={fmtDateTime(user.createdAt)}>
                          {fmtDate(user.createdAt)}
                        </td>
                        <td className={`${t.td} hidden whitespace-nowrap text-xs text-[#6f777d] lg:table-cell`}>
                          {user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}
                        </td>
                        <td className={t.td}>
                          <Badge tone={user.isActive ? "green" : "red"}>{user.isActive ? "Active" : "Off"}</Badge>
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

      {data && (
        <UserDrawer key={openId ?? "none"} user={open} viewer={data.viewer} onClose={() => setOpenId(null)} onChanged={reload} />
      )}
    </div>
  );
}

function UserDrawer({
  user,
  viewer,
  onClose,
  onChanged,
}: {
  user: UserRow | null;
  viewer: ListResponse["viewer"];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!user) return null;

  const isAdminAccount = user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN");
  const canManage = viewer.isSuperAdmin || !isAdminAccount;
  const isSelf = user.id === viewer.id;

  const run = async (key: string, url: string, method: "POST" | "PATCH", body: unknown, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(key);
    setActionError(null);
    try {
      await sendJson(url, method, body);
      onChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(null);
    }
  };

  const toggleRole = (role: ManagedRole) => {
    const has = user.roles.includes(role);
    const label = ROLE_LABELS[role].toLowerCase();
    run(
      role,
      `/api/admin/users/${user.id}/roles`,
      "POST",
      { role, grant: !has },
      has
        ? `Remove ${label} access from ${user.email || user.fullName || user.phone}?`
        : `Give ${user.email || user.fullName || user.phone} ${label} access? They will be able to see every lead, subscriber and user.`
    );
  };

  return (
    <Drawer open onClose={onClose} title={user.fullName || user.email || user.phone || "User"}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#e6dfd4] bg-white p-4">
          <dl className="divide-y divide-[#f3efe8]">
            <Field label="Email">
              {user.email} {user.isEmailVerified && <Badge tone="green">Verified</Badge>}
            </Field>
            <Field label="Phone">
              {user.phone}
            </Field>
            <Field label="Buyer category">{user.buyerCategory ? labelFor(BUYER_CATEGORIES, user.buyerCategory) : null}</Field>
            <Field label="City">{[user.city, user.state].filter(Boolean).join(", ") || null}</Field>
            <Field label="Account type">{user.accountType}</Field>
            <Field label="Roles">
              <RoleBadges roles={user.roles} />
            </Field>
            <Field label="Joined">{fmtDateTime(user.createdAt)}</Field>
            <Field label="Last login">{user.lastLoginAt ? fmtDateTime(user.lastLoginAt) : "Never"}</Field>
            <Field label="Password">
              {user.hasPassword ? "Set" : user.email ? "Not needed (signs in with email OTP)" : "Not set yet"}
              {user.pendingLinkExpires && ` · a set-password link is open until ${fmtDateTime(user.pendingLinkExpires)}`}
            </Field>
            <Field label="Leads">
              {user.leadCount > 0 ? (
                <TextLink href={`/admin/leads?q=${encodeURIComponent(user.email || user.phone || "")}`}>
                  {user.leadCount} submitted while signed in
                </TextLink>
              ) : (
                "None while signed in"
              )}
            </Field>
          </dl>
        </section>

        <BuyerProfile userId={user.id} />

        {!canManage && (
          <p className="rounded-xl border border-[#e6dfd4] bg-white p-3 text-xs text-[#6f777d]">
            This is an admin account. Only a super admin can change it.
          </p>
        )}

        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Access</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={user.isActive ? "green" : "red"}>{user.isActive ? "Active" : "Deactivated"}</Badge>
            {user.isActive ? (
              <Button
                variant="danger"
                busy={busy === "active"}
                disabled={!canManage || isSelf}
                onClick={() =>
                  run("active", `/api/admin/users/${user.id}`, "PATCH", { isActive: false }, `Deactivate ${user.email || user.fullName || user.phone}? They will not be able to use their account.`)
                }
              >
                Deactivate
              </Button>
            ) : (
              <Button busy={busy === "active"} disabled={!canManage} onClick={() => run("active", `/api/admin/users/${user.id}`, "PATCH", { isActive: true })}>
                Activate
              </Button>
            )}
            {isSelf && <span className="text-xs text-[#6f777d]">This is you.</span>}
          </div>
        </section>

        {canManage && (
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Password link</h3>
            <p className="mb-2 text-xs text-[#6f777d]">
              For new admins, forgotten passwords or password-reset requests. Creates a one-time link valid for 24 hours.
            </p>
            <PasswordLinkTool userId={user.id} onCreated={onChanged} />
          </section>
        )}

        {viewer.isSuperAdmin && (
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f777d]">Admin access (super admin only)</h3>
            <div className="flex flex-wrap gap-2">
              {(["ADMIN", "SUPER_ADMIN"] as const).map((role) => (
                <Button key={role} variant={user.roles.includes(role) ? "danger" : "outline"} busy={busy === role} disabled={!!busy} onClick={() => toggleRole(role)}>
                  {user.roles.includes(role) ? `Remove ${ROLE_LABELS[role]}` : `Make ${ROLE_LABELS[role]}`}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#6f777d]">The last active super admin cannot be removed or deactivated.</p>
          </section>
        )}

        {actionError && <p className="text-sm text-red-700">{actionError}</p>}
      </div>
    </Drawer>
  );
}
