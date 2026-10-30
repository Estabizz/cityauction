"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus, Save, X } from "lucide-react";
import {
  ASSET_CLASSES,
  BUDGET_RANGES,
  CITY_SUGGESTIONS,
  FUNDING,
  OBJECTIVES,
  PAN_INDIA,
  SIZE_UNITS,
  TIMELINES,
} from "@/lib/buyer";
import { Field, FormAlert, SelectField, SubmitButton, postJson } from "./auth-ui";

export type RequirementValues = {
  name: string;
  assetClasses: string[];
  cities: string[];
  budgetRange: string;
  minBudget: string;
  maxBudget: string;
  objective: string;
  locality: string;
  minSize: string;
  maxSize: string;
  sizeUnit: string;
  timeline: string;
  funding: string;
  alertsEnabled: boolean;
  alertChannels: string[];
};

export const EMPTY_REQUIREMENT: RequirementValues = {
  name: "",
  assetClasses: [],
  cities: [],
  budgetRange: "",
  minBudget: "",
  maxBudget: "",
  objective: "",
  locality: "",
  minSize: "",
  maxSize: "",
  sizeUnit: "SQFT",
  timeline: "",
  funding: "",
  alertsEnabled: false,
  alertChannels: [],
};

export function chipClass(on: boolean) {
  return `inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
    on ? "bg-[#091118] border-[#091118] text-white" : "bg-white border-[#dcd5ca] text-[#3b464e] hover:border-[#b49361]"
  }`;
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <p className="mb-2 text-xs font-semibold text-[#3b464e] uppercase tracking-wider">
      {children} {hint && <span className="normal-case tracking-normal font-normal text-[#7e868b]">· {hint}</span>}
    </p>
  );
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function CityPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [query, setQuery] = useState("");
  const panIndia = value.includes(PAN_INDIA);
  const q = query.trim().toLowerCase();
  const suggestions = q ? CITY_SUGGESTIONS.filter((c) => c.toLowerCase().includes(q) && !value.includes(c)).slice(0, 6) : [];
  const exact = CITY_SUGGESTIONS.some((c) => c.toLowerCase() === q) || value.some((c) => c.toLowerCase() === q);

  function add(city: string) {
    const name = city.trim().replace(/\s+/g, " ");
    if (!name) return;
    onChange([...value.filter((c) => c !== PAN_INDIA), name]);
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        <button type="button" onClick={() => onChange(panIndia ? [] : [PAN_INDIA])} className={chipClass(panIndia)} aria-pressed={panIndia}>
          {panIndia && <Check className="h-3.5 w-3.5" />} Pan-India
        </button>
        {value
          .filter((c) => c !== PAN_INDIA)
          .map((c) => (
            <span key={c} className="inline-flex items-center gap-1 h-9 pl-3.5 pr-1.5 rounded-xl bg-[#f5edd3] text-[#5e4a2b] text-xs font-semibold">
              {c}
              <button type="button" onClick={() => onChange(value.filter((v) => v !== c))} className="w-6 h-6 rounded-xl hover:bg-[#ead9ad] flex items-center justify-center cursor-pointer" aria-label={`Remove ${c}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(suggestions[0] ?? query);
            }
          }}
          placeholder={panIndia ? "Pan-India selected. Type to pick cities instead" : "Search or type a city"}
          aria-label="Add a city"
          maxLength={80}
          className="w-full h-11 px-3.5 rounded-lg border border-[#dcd5ca] bg-white text-sm placeholder:text-[#9aa1a6] focus:outline-none focus:ring-2 focus:ring-[#b49361]/30 focus:border-[#b49361]"
        />
        {q && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#e4e8ec] bg-white shadow-lg py-1">
            {suggestions.map((c) => (
              <button key={c} type="button" onClick={() => add(c)} className="block w-full text-left px-3.5 py-2 text-sm hover:bg-[#fbf9f5] cursor-pointer">
                {c}
              </button>
            ))}
            {!exact && (
              <button type="button" onClick={() => add(query)} className="flex items-center gap-1.5 w-full text-left px-3.5 py-2 text-sm text-[#84663c] hover:bg-[#fbf9f5] cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Add &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Create or edit a buyer requirement. Asset class, city and budget come first;
// the rest sits under "More details" so the first pass stays short.
export function RequirementForm({
  initial = EMPTY_REQUIREMENT,
  requirementId,
  hasEmail,
  completeOnboarding = false,
  submitLabel = "Save requirement",
  onSaved,
  onCancel,
}: {
  initial?: RequirementValues;
  requirementId?: string;
  hasEmail: boolean;
  completeOnboarding?: boolean;
  submitLabel?: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<RequirementValues>(initial);
  const [more, setMore] = useState(
    !!(initial.objective || initial.locality || initial.minSize || initial.maxSize || initial.timeline || initial.funding || initial.minBudget || initial.maxBudget)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof RequirementValues>(key: K, value: RequirementValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const min = form.minBudget ? Number(form.minBudget) : null;
    const max = form.maxBudget ? Number(form.maxBudget) : null;
    if (min != null && max != null && min > max) {
      setError("Minimum budget can't be more than the maximum.");
      return;
    }
    if (form.minSize && form.maxSize && Number(form.minSize) > Number(form.maxSize)) {
      setError("Minimum size can't be more than the maximum.");
      return;
    }
    setLoading(true);
    const body = { ...form, alertChannels: form.alertChannels.filter((c) => c !== "EMAIL" || hasEmail), completeOnboarding };
    const { ok, data } = requirementId
      ? await postJson(`/api/user/requirements/${requirementId}`, body, "PATCH")
      : await postJson("/api/user/requirements", body);
    setLoading(false);
    if (ok) onSaved();
    else setError(data.error || "Couldn't save this requirement. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {error && <FormAlert>{error}</FormAlert>}

      <div>
        <Label hint="choose any">Asset classes</Label>
        <div className="flex flex-wrap gap-2">
          {ASSET_CLASSES.map((c) => {
            const on = form.assetClasses.includes(c.value);
            return (
              <button key={c.value} type="button" onClick={() => set("assetClasses", toggle(form.assetClasses, c.value))} className={chipClass(on)} aria-pressed={on}>
                {on && <Check className="h-3.5 w-3.5" />} {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Preferred cities</Label>
        <CityPicker value={form.cities} onChange={(v) => set("cities", v)} />
      </div>

      <SelectField id="budgetRange" label="Investment budget" placeholder="Any budget" options={BUDGET_RANGES} value={form.budgetRange} onChange={(e) => set("budgetRange", e.target.value)} />

      <div className="border-t border-[#efe9df] pt-4">
        <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#84663c] hover:underline cursor-pointer">
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${more ? "rotate-180" : ""}`} />
          {more ? "Fewer details" : "More details (optional): purpose, timeline, size, exact budget"}
        </button>
      </div>

      {more && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField id="objective" label="Purchase objective" placeholder="Not specified" options={OBJECTIVES} value={form.objective} onChange={(e) => set("objective", e.target.value)} />
            <SelectField id="timeline" label="Purchase timeline" placeholder="Not specified" options={TIMELINES} value={form.timeline} onChange={(e) => set("timeline", e.target.value)} />
            <SelectField id="funding" label="Funding" placeholder="Not specified" options={FUNDING} value={form.funding} onChange={(e) => set("funding", e.target.value)} />
            <Field id="locality" label="Locality / industrial zone" placeholder="e.g. GIDC Sachin, SG Highway" maxLength={200} value={form.locality} onChange={(e) => set("locality", e.target.value)} />
          </div>

          <div>
            <Label hint="overrides the budget range">Exact budget (₹)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Field id="minBudget" label="Minimum" type="number" min={0} inputMode="numeric" placeholder="e.g. 5000000" value={form.minBudget} onChange={(e) => set("minBudget", e.target.value)} />
              <Field id="maxBudget" label="Maximum" type="number" min={0} inputMode="numeric" placeholder="e.g. 20000000" value={form.maxBudget} onChange={(e) => set("maxBudget", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Plot / built-up size</Label>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <Field id="minSize" label="Minimum" type="number" min={0} inputMode="decimal" value={form.minSize} onChange={(e) => set("minSize", e.target.value)} />
              <Field id="maxSize" label="Maximum" type="number" min={0} inputMode="decimal" value={form.maxSize} onChange={(e) => set("maxSize", e.target.value)} />
              <SelectField id="sizeUnit" label="Unit" options={SIZE_UNITS} value={form.sizeUnit} onChange={(e) => set("sizeUnit", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <Field id="name" label="Name this requirement (optional)" placeholder="e.g. Warehouse near Surat" maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-11 px-5 rounded-xl border border-[#dcd5ca] bg-white text-sm font-bold text-[#3b464e] hover:bg-[#f6f2ea] cursor-pointer">
            Cancel
          </button>
        )}
        <div className="sm:min-w-56">
          <SubmitButton loading={loading} loadingText="Saving…">
            <Save className="h-4 w-4" />
            <span>{submitLabel}</span>
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
