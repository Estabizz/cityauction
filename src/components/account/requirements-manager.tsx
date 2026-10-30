"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Target, Trash2 } from "lucide-react";
import { ASSET_CLASSES, OBJECTIVES, TIMELINES, budgetLabel, citiesLabel, labelFor } from "@/lib/buyer";
import { RequirementForm, type RequirementValues } from "./requirement-form";

export type RequirementRow = { id: string; values: RequirementValues; matchCount: number | null };

const MAX = 20;

export function RequirementsManager({ rows, hasEmail }: { rows: RequirementRow[]; hasEmail: boolean }) {
  const router = useRouter();
  // "new", a requirement id, or null.
  const [editing, setEditing] = useState<string | null>(rows.length === 0 ? "new" : null);

  function saved() {
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {editing === "new" ? (
        <div className="bg-white rounded-2xl border border-[#e4e8ec] p-5 sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-[#091118] mb-5">New requirement</h2>
          <RequirementForm hasEmail={hasEmail} onSaved={saved} onCancel={rows.length ? () => setEditing(null) : undefined} />
        </div>
      ) : (
        rows.length < MAX && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f] cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add a requirement
          </button>
        )
      )}

      {rows.map((row) =>
        editing === row.id ? (
          <div key={row.id} className="bg-white rounded-2xl border border-[#b49361] p-5 sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight text-[#091118] mb-5">Edit requirement</h2>
            <RequirementForm initial={row.values} requirementId={row.id} hasEmail={hasEmail} onSaved={saved} onCancel={() => setEditing(null)} />
          </div>
        ) : (
          <RequirementCard key={row.id} row={row} onEdit={() => setEditing(row.id)} onChanged={() => router.refresh()} />
        )
      )}
    </div>
  );
}

function RequirementCard({ row, onEdit, onChanged }: { row: RequirementRow; onEdit: () => void; onChanged: () => void }) {
  const { values: r } = row;
  const [busy, setBusy] = useState<"delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm(`Delete "${r.name}"? It will no longer be used to find matches.`)) return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(`/api/user/requirements/${row.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) return onChanged();
      setError(data.error || "Couldn't delete this requirement.");
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(null);
  }

  const details = [
    labelFor(OBJECTIVES, r.objective),
    r.timeline && `Timeline: ${labelFor(TIMELINES, r.timeline)}`,
    r.locality,
    (r.minSize || r.maxSize) && `${r.minSize || "0"}–${r.maxSize || "any"} ${r.sizeUnit === "SQM" ? "sq m" : "sq ft"}`,
  ].filter(Boolean);

  return (
    <article className="bg-white rounded-2xl border border-[#e4e8ec] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#091118] break-words">{r.name}</h3>
          <p className="text-sm text-[#3b464e] mt-1">
            {r.assetClasses.length ? r.assetClasses.map((c) => labelFor(ASSET_CLASSES, c)).join(", ") : "Any asset class"} · {citiesLabel(r.cities)} ·{" "}
            {budgetLabel({ budgetRange: r.budgetRange, minBudget: r.minBudget ? Number(r.minBudget) : null, maxBudget: r.maxBudget ? Number(r.maxBudget) : null })}
          </p>
          {details.length > 0 && <p className="text-xs text-[#7e868b] mt-1">{details.join(" · ")}</p>}
        </div>

      </div>

      {error && <p className="text-xs text-red-600 mt-3" role="alert">{error}</p>}

      <div className="mt-4 pt-4 border-t border-[#efe9df] flex flex-wrap items-center gap-2">
        <Link href={`/dashboard/matches?requirement=${row.id}`} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-[#f5edd3] text-[#5e4a2b] text-xs font-bold hover:bg-[#ecdcae]">
          <Target className="h-3.5 w-3.5" />
          {row.matchCount == null ? "View matches" : `${row.matchCount} matching ${row.matchCount === 1 ? "auction" : "auctions"}`}
        </Link>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-[#dcd5ca] bg-white text-xs font-bold text-[#3b464e] hover:bg-[#f6f2ea] cursor-pointer">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>

        <button type="button" onClick={remove} disabled={busy !== null} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-60 sm:ml-auto">
          {busy === "delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
        </button>
      </div>
    </article>
  );
}
