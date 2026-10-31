"use client";

import { useId, useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { z } from "zod";
import { CITY_LIST } from "@/content/cities/list";
import { PROPERTY_CATEGORIES, AUCTION_TYPES, AUCTION_STATUSES, POSSESSION_STATUSES, INDIAN_STATES, BUDGET_RANGES } from "@/lib/constants";
import { applyAuctionFilters, auctionSearchHref } from "@/lib/auction-discovery-ui";

const fieldClass = "mt-1 min-h-11 w-full min-w-0 rounded-xl border border-[#dce2e7] bg-white px-3 py-2 text-sm text-[#182129] focus:outline-none focus:ring-2 focus:ring-[#b59461]";
const fields = ["keyword", "state", "city", "district", "category", "auctionType", "status", "possession", "minPrice", "maxPrice", "dateFrom", "dateTo", "deadlineBefore", "organization"];

export function AuctionFilters({ onApply, formId }: { onApply?: () => void; formId?: string }) {
  const params = useSearchParams();
  return <FilterForm key={params.toString()} current={params.toString()} onApply={onApply} formId={formId} />;
}

function FilterForm({ current, onApply, formId }: { current: string; onApply?: () => void; formId?: string }) {
  const router = useRouter(); const pathname = usePathname(); const id = useId();
  const params = new URLSearchParams(current);
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((key) => {
    const value = (key === "auctionType" ? params.get("type") || params.get(key) : key === "keyword" ? params.get(key) || params.get("q") : params.get(key)) || "";
    return [key, ["category", "auctionType", "status", "possession"].includes(key) ? value.toUpperCase() : value];
  })));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  function update(key: string, value: string) {
    setValues((previous) => ({ ...previous, [key]: value, ...(key === "state" ? { city: "", district: "" } : {}) }));
    setErrors({});
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const next = applyAuctionFilters(current, values);
      startTransition(() => { router.push(auctionSearchHref(pathname, next), { scroll: false }); });
      onApply?.();
    } catch (error) {
      if (!(error instanceof z.ZodError)) throw error;
      const issues = Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
      setErrors(issues);
      const first = String(error.issues[0]?.path[0]);
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }
  function input(key: string, label: string, type = "text", placeholder = "") {
    return <label className="block min-w-0 text-sm font-medium text-[#46525d]" key={key} htmlFor={`${id}-${key}`}>{label}
      <input id={`${id}-${key}`} name={key} type={type} value={values[key]} onChange={(event) => update(key, event.target.value)}
        placeholder={placeholder} maxLength={type === "text" ? 160 : undefined} min={type === "number" ? 0 : undefined} step={type === "number" ? "0.01" : undefined}
        list={key === "city" ? `${id}-cities` : undefined} className={fieldClass} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined} />
      {errors[key] && <span id={`${id}-${key}-error`} className="mt-1 block text-xs text-red-700">{errors[key]}</span>}
    </label>;
  }
  function select(key: string, label: string, options: readonly { value: string; label: string }[]) {
    return <label className="block text-sm font-medium text-[#46525d]" htmlFor={`${id}-${key}`} key={key}>{label}
      <select id={`${id}-${key}`} name={key} value={values[key]} onChange={(event) => update(key, event.target.value)} className={fieldClass}>
        <option value="">Any {label.toLowerCase()}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select></label>;
  }
  const states: { value: string; label: string }[] = INDIAN_STATES.map((state) => ({ value: state, label: state }));
  if (values.state && !states.some((state) => state.value === values.state)) states.unshift({ value: values.state, label: values.state });
  return <form id={formId} onSubmit={submit} className="min-w-0 rounded-2xl border border-[#e4e8ec] bg-white p-4 sm:p-5" aria-label="Auction search filters">
    <div className="mb-5 flex items-center justify-between gap-2"><h2 className="font-semibold text-[#182129]">Search auctions</h2>
      <button type="button" onClick={() => { router.push(pathname, { scroll: false }); onApply?.(); }} className="min-h-11 px-2 text-sm font-semibold text-[#84663c] underline">Reset</button></div>
    <fieldset disabled={pending} className="min-w-0 space-y-4 disabled:opacity-60">
      {input("keyword", "Keyword or auction ID", "text", "Area, property or notice number")}
      {select("state", "State", states)}
      {input("city", "City", "text", "e.g. Ahmedabad")}
      <datalist id={`${id}-cities`}>{CITY_LIST.filter((city) => !values.state || city.state === values.state).map((city) => <option key={city.slug} value={city.city} />)}</datalist>
      {select("category", "Property type", PROPERTY_CATEGORIES)}
      <div><p className="mb-2 text-sm font-medium text-[#46525d]">Reserve price</p><div className="flex flex-wrap gap-1.5">{BUDGET_RANGES.map((range) => {
        const [min, max = ""] = range.value.split("-"); const selected = values.minPrice === min && values.maxPrice === max;
        return <button type="button" key={range.value} aria-pressed={selected} onClick={() => { setValues((previous) => ({ ...previous, minPrice: min, maxPrice: max })); setErrors({}); }}
          className={`min-h-11 rounded-lg border px-2 py-1 text-xs ${selected ? "border-[#b59461] bg-[#f6edd6]" : "border-[#e4e8ec] bg-[#f7f9fa]"}`}>{range.label}</button>;
      })}</div></div>
      <div className="grid min-w-0 grid-cols-2 gap-2">{input("minPrice", "Min price (₹)", "number", "0")}{input("maxPrice", "Max price (₹)", "number", "Any")}</div>
      <details open={Boolean(values.dateFrom || values.dateTo || values.deadlineBefore || values.status || values.auctionType || values.possession || values.district || values.organization)}>
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[#84663c]">Dates & more filters</summary>
        <div className="min-w-0 space-y-4 pt-2">
          {input("dateFrom", "Auction from", "date")}{input("dateTo", "Auction to", "date")}
          {input("deadlineBefore", "Submission on or before", "date")}
          <p className="text-xs text-[#687480]">Dates use Indian Standard Time (IST).</p>
          {select("status", "Status", AUCTION_STATUSES)}{select("auctionType", "Auction type", AUCTION_TYPES)}{select("possession", "Possession", POSSESSION_STATUSES)}
          {input("district", "District")}{input("organization", "Bank or institution")}
        </div>
      </details>
      {Object.keys(errors).length > 0 && <p role="alert" className="text-sm text-red-700">Check the highlighted search fields.</p>}
      <button type="submit" className={`${formId ? "hidden" : ""} min-h-11 w-full rounded-xl bg-[#132330] px-4 py-3 text-sm font-semibold text-white`}>{pending ? "Searching…" : "Apply filters"}</button>
    </fieldset>
  </form>;
}
