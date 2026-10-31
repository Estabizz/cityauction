"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUCTION_STATUSES, AUCTION_TYPES, INDIAN_STATES, POSSESSION_STATUSES, PROPERTY_CATEGORIES } from "@/lib/constants";
import { auctionSchema, fromIstInput, propertySchema, toIstInput } from "@/lib/admin/publishing-schema";

type Choice = { id: string | number; name: string; updatedAt?: string };
type Catalog = { organizations: Choice[]; locations: Choice[]; properties: Choice[] };
type Document = { name: string; type: "NOTICE" | "AMENDMENT" | "TERMS" | "OTHER"; url: string; fileSize: number; mimeType: string; isPublic: boolean };
const control = "mt-1 min-h-11 w-full min-w-0 rounded-xl border border-[#dce2e7] bg-white px-3 py-2 text-sm text-[#182129] focus:outline-none focus:ring-2 focus:ring-[#b59461]";
const button = "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dce2e7] px-4 py-2 text-sm font-semibold disabled:opacity-50";
const dates = ["startDateTime", "endDateTime", "submissionDeadline", "inspectionDate"];

function Upload({ photo, busyChanged, uploaded, failed }: { photo: boolean; busyChanged: (busy: boolean) => void; uploaded: (file: Document) => void; failed: (message: string) => void }) {
  const active = useRef(false);
  const [busy, setBusy] = useState(false);
  return <label className={`${button} cursor-pointer bg-[#f7f9fa]`}>{busy ? "Uploading…" : photo ? "Upload photo" : "Upload document"}
    <input className="sr-only" aria-label={photo ? "Upload property photo" : "Upload auction document"} type="file" accept={photo ? "image/jpeg,image/png,image/webp" : "application/pdf,image/jpeg,image/png,image/webp"} disabled={busy} onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = "";
      if (!file || active.current) return;
      if (photo && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { failed("Choose a JPG, PNG or WebP photo."); return; }
      if (file.size > (photo ? 5 : 10) * 1024 * 1024) { failed(`Choose a file up to ${photo ? 5 : 10} MB.`); return; }
      active.current = true; busyChanged(true); setBusy(true);
      try {
        const data = new FormData(); data.set("file", file);
        const response = await fetch("/api/admin/media", { method: "POST", body: data, signal: AbortSignal.timeout(60_000) });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) throw new Error(result?.error || "The upload was not confirmed. Please retry.");
        uploaded({ ...result.data, type: "NOTICE", isPublic: false });
      } catch (error) { failed(error instanceof Error ? error.message : "Upload failed. Please retry."); }
      finally { active.current = false; busyChanged(false); setBusy(false); }
    }} />
  </label>;
}

function AddInstitution({ added, failed, busyChanged }: { added: (item: Choice) => void; failed: (message: string) => void; busyChanged: (busy: boolean) => void }) {
  const [name, setName] = useState(""); const [type, setType] = useState("BANK"); const [busy, setBusy] = useState(false); const active = useRef(false);
  return <details className="rounded-xl border border-[#e4e8ec] p-3"><summary className="cursor-pointer text-sm font-semibold">Add an institution</summary><div className="mt-3 space-y-3">
    <label className="block text-sm">Institution name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={191} className={control} /></label>
    <label className="block text-sm">Institution type<select value={type} onChange={(event) => setType(event.target.value)} className={control}>{["BANK", "NBFC", "ARC", "GOVERNMENT", "DRT", "HOUSING_FINANCE", "COOPERATIVE_BANK", "OTHER"].map((value) => <option key={value}>{value}</option>)}</select></label>
    <button type="button" className={button} disabled={busy || name.trim().length < 3} onClick={async () => {
      if (active.current) return; active.current = true; setBusy(true); busyChanged(true);
      try {
        const response = await fetch("/api/admin/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, type }), signal: AbortSignal.timeout(15000) });
        const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || "Could not add the institution.");
        added(data.data); setName("");
      } catch (error) { failed(error instanceof Error ? error.message : "Could not add the institution."); }
      finally { active.current = false; setBusy(false); busyChanged(false); }
    }}>{busy ? "Adding…" : "Add institution"}</button>
  </div></details>;
}

export function RecordEditor({ kind, id }: { kind: "property" | "auction"; id?: string }) {
  const router = useRouter(); const collection = kind === "property" ? "properties" : "auctions";
  const [catalog, setCatalog] = useState<Catalog | null>(null); const [values, setValues] = useState<Record<string, string>>({ status: "UPCOMING" });
  const [documents, setDocuments] = useState<Document[]>([]); const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(""); const [fields, setFields] = useState<Record<string, string>>({}); const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true); const [attempt, setAttempt] = useState(0); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [published, setPublished] = useState(false);
  const active = useRef(false); const form = useRef<HTMLFormElement>(null); const errorSummary = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (error) errorSummary.current?.focus(); }, [error]);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const requests = [fetch("/api/admin/catalog", { cache: "no-store", signal: controller.signal }), ...(id ? [fetch(`/api/admin/${collection}/${encodeURIComponent(id)}`, { cache: "no-store", signal: controller.signal })] : [])];
        const responses = await Promise.all(requests); const data = await Promise.all(responses.map((response) => response.json()));
        if (responses.some((response) => !response.ok) || data.some((result) => !result.success)) throw new Error(data.find((result) => !result.success)?.error || "Could not load the editor.");
        if (controller.signal.aborted) return;
        setCatalog(data[0].data);
        if (id) {
          const record = data[1].data; const initial = Object.fromEntries(Object.entries(record).filter(([, value]) => typeof value === "string").map(([key, value]) => [key, String(value)]));
          if (kind === "property") { initial.category = record.category.type; initial.locationId = String(record.locationId); initial.imagesText = record.images.join("\n"); }
          else { for (const date of dates) initial[date] = toIstInput(record[date]); initial.status = record.status === "DRAFT" ? "UPCOMING" : record.status; setDocuments(record.documents); setPublished(Boolean(record.publishedAt)); }
          setValues(initial);
        }
        setError("");
      } catch (error) { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not load the editor."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load(); return () => controller.abort();
  }, [collection, id, kind, attempt]);

  function change(key: string, value: string) { setValues((previous) => ({ ...previous, [key]: value })); setConfirmed(false); setFields({}); setNotice(""); }
  function showErrors(errors: Record<string, string>) { setFields(errors); setError(Object.values(errors)[0] || "Check the form."); const name = Object.keys(errors)[0]?.split(".")[0]; if (name) form.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus(); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (active.current || uploading) return;
    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") || "draft";
    const raw = kind === "property" ? { ...values, locationId: values.locationId ? Number(values.locationId) : undefined, state: values.locationId ? undefined : values.state || undefined, images: (values.imagesText || "").split("\n").map((url) => url.trim()).filter(Boolean) } : {
      ...values, ...Object.fromEntries(dates.map((key) => [key, fromIstInput(values[key] || "")])), action, sourceConfirmed: confirmed, documents, propertyUpdatedAt: catalog?.properties.find((property) => property.id === values.propertyId)?.updatedAt,
    };
    const parsed = (kind === "property" ? propertySchema : auctionSchema).safeParse(raw);
    if (!parsed.success) { showErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join("."), issue.message]))); return; }
    active.current = true; setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/${collection}${id ? `/${encodeURIComponent(id)}` : ""}`, { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(30000) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) { if (result?.fields) showErrors(result.fields); else setError(result?.error || "Save not confirmed. Your form is unchanged."); return; }
      setNotice(kind === "property" ? "Property saved. Linked notices require source review before publication." : action === "publish" ? "Auction published." : "Draft saved.");
      setConfirmed(false);
      if (!id) router.replace(result.redirectTo); else { setLoading(true); setAttempt((value) => value + 1); }
      router.refresh();
    } catch { setError("The save could not be confirmed. Your form is still here. Reload the record before retrying if the connection was interrupted."); }
    finally { active.current = false; setSaving(false); }
  }
  function input(name: string, label: string, type = "text", wide = false) {
    return <label key={name} className={`block min-w-0 text-sm font-medium ${wide ? "sm:col-span-2" : ""}`} htmlFor={`record-${name}`}>{label}
      {type === "textarea" ? <textarea id={`record-${name}`} name={name} rows={name === "imagesText" ? 4 : 5} value={values[name] || ""} onChange={(event) => change(name, event.target.value)} maxLength={name === "imagesText" ? 5000 : 20000} className={control} /> :
        <input id={`record-${name}`} name={name} type={type === "money" ? "text" : type} step={type === "datetime-local" ? "0.001" : undefined} inputMode={type === "money" ? "decimal" : undefined} value={values[name] || ""} onChange={(event) => change(name, event.target.value)} maxLength={type === "money" ? 24 : 191} className={control} aria-invalid={Boolean(fields[name])} aria-describedby={fields[name] ? `error-${name}` : undefined} />}
      {fields[name] && <span id={`error-${name}`} className="mt-1 block text-xs text-red-700">{fields[name]}</span>}
    </label>;
  }
  function select(name: string, label: string, options: readonly { value: string; label: string }[]) {
    return <label key={name} className="block min-w-0 text-sm font-medium" htmlFor={`record-${name}`}>{label}<select id={`record-${name}`} name={name} value={values[name] || ""} onChange={(event) => change(name, event.target.value)} className={control} aria-invalid={Boolean(fields[name])}><option value="">Choose…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{fields[name] && <span className="mt-1 block text-xs text-red-700">{fields[name]}</span>}</label>;
  }
  if (loading) return <p role="status" className="p-5">Loading editor…</p>;
  if (!catalog) return <div role="alert" className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-5"><p>{error}</p><button type="button" className={button} onClick={() => { setLoading(true); setAttempt((value) => value + 1); }}>Retry loading</button><Link className="ml-4 underline" href="/login?next=/admin/dashboard">Sign in</Link></div>;
  const choices = (items: Choice[]) => items.map((item) => ({ value: String(item.id), label: item.name }));
  function updateDocument(index: number, patch: Partial<Document>) { setDocuments((previous) => previous.map((doc, position) => position === index ? { ...doc, ...patch } : doc)); setConfirmed(false); }
  return <form ref={form} onSubmit={submit} noValidate className="space-y-6">
    <div className="flex flex-wrap gap-3"><button type="button" className={`${button} bg-white`} disabled={saving || uploading} onClick={async () => {
      try { const response = await fetch("/api/admin/catalog", { cache: "no-store", signal: AbortSignal.timeout(15000) }); const result = await response.json(); if (!response.ok || !result.success) throw new Error(); setCatalog(result.data); setConfirmed(false); setNotice("Choices refreshed. Your unsaved form is kept. Review the source again before publishing."); } catch { setError("Could not refresh choices. Your form is kept."); }
    }}>Refresh choices</button><Link href={`/admin/${collection}`} className={`${button} bg-white`}>Back to {collection}</Link>{kind === "auction" && id && <Link href={`/admin/auctions/${id}/preview`} target="_blank" rel="noopener noreferrer" className={`${button} bg-white`}>Preview saved notice ↗</Link>}{kind === "auction" && published && id && <Link href={`/auctions/${id}`} target="_blank" rel="noopener noreferrer" className={`${button} bg-white`}>View public notice ↗</Link>}</div>
    {error && <p ref={errorSummary} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
    {kind === "property" && id && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Saving changes removes linked auction notices from public view until their source is reviewed and they are published again.</p>}
    <fieldset disabled={saving || uploading} className="min-w-0 space-y-6 disabled:opacity-60">
      <section className="rounded-2xl border border-[#e6dfd4] bg-white p-4 sm:p-6"><h2 className="mb-5 text-lg font-semibold">{kind === "property" ? "Property details" : "Auction notice"}</h2><div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        {kind === "property" ? <>
          {input("title", "Property title", "text", true)}{select("organizationId", "Institution", choices(catalog.organizations))}{select("category", "Property type", PROPERTY_CATEGORIES)}
          <div className="sm:col-span-2"><AddInstitution busyChanged={setUploading} added={(item) => { setCatalog((previous) => previous ? { ...previous, organizations: [...previous.organizations.filter((old) => old.id !== item.id), item] } : previous); change("organizationId", String(item.id)); }} failed={setError} /></div>
          {select("locationId", "Existing location (optional)", choices(catalog.locations))}
          {!values.locationId && <>{select("state", "State / UT", INDIAN_STATES.map((state) => ({ value: state, label: state })))}{input("city", "City")}</>}
          {input("address", "Full property address", "textarea", true)}{select("possessionStatus", "Possession recorded in notice", POSSESSION_STATUSES)}{input("estimatedValue", "Estimated value (₹, optional)", "money")}{input("area", "Area (optional)", "money")}{input("areaUnit", "Area unit (e.g. sq m)")}{input("description", "Property description", "textarea", true)}
        </> : <>
          {select("propertyId", "Property", choices(catalog.properties))}<Link href="/admin/properties/create" target="_blank" rel="noopener noreferrer" className="self-end py-3 text-sm font-semibold underline">Add a property first ↗</Link>
          {input("auctionNumber", "Official notice / auction number")}{select("type", "Auction type", AUCTION_TYPES)}{select("status", "Status when published", AUCTION_STATUSES)}
          {input("reservePrice", "Reserve price (₹)", "money")}{input("emd", "EMD amount (₹)", "money")}{input("bidIncrement", "Bid increment (₹, use the recorded amount)", "money")}
          <p className="text-sm text-[#687480] sm:col-span-2">All times below are in Indian Standard Time (IST). Use the official notice.</p>
          {input("startDateTime", "Auction starts (IST)", "datetime-local")}{input("endDateTime", "Auction ends (IST)", "datetime-local")}{input("submissionDeadline", "Submission deadline (IST)", "datetime-local")}{input("inspectionDate", "Inspection in notice (IST, optional)", "datetime-local")}
          {input("contactOfficerName", "Auction contact name (optional)")}{input("contactOfficerPhone", "Auction contact phone (optional)")}{input("contactOfficerEmail", "Auction contact email (optional)", "email")}
          {input("description", "Notice description (optional)", "textarea", true)}{input("terms", "Notice terms (optional)", "textarea", true)}{input("sourceListingId", "Official source URL or reference", "text", true)}
        </>}
      </div></section>
      <section className="space-y-4 rounded-2xl border border-[#e6dfd4] bg-white p-4 sm:p-6"><h2 className="text-lg font-semibold">{kind === "property" ? "Property photos" : "Auction documents"}</h2>
        <p className="text-sm text-[#687480]">{kind === "property" ? "JPG, PNG or WebP, up to 5 MB. The first photo is the cover. Photos are optional." : "PDF up to 10 MB, or JPG, PNG and WebP scans up to 5 MB. Only public attachments appear on the published notice."}</p>
        <Upload photo={kind === "property"} busyChanged={setUploading} failed={setError} uploaded={(file) => { setError(""); if (kind === "property") setValues((previous) => ({ ...previous, imagesText: [previous.imagesText, file.url].filter(Boolean).join("\n") })); else setDocuments((previous) => [...previous, file]); setConfirmed(false); }} />
        {kind === "property" ? input("imagesText", "Photo URLs (one per line; reorder here to choose the cover)", "textarea", true) : <>
          {documents.map((doc, index) => <div key={index} className="grid min-w-0 grid-cols-1 gap-3 rounded-xl border border-[#e4e8ec] p-4 sm:grid-cols-2">
            <label className="text-sm" htmlFor={`doc-name-${index}`}>Document name<input id={`doc-name-${index}`} value={doc.name} onChange={(event) => updateDocument(index, { name: event.target.value })} maxLength={191} className={control} /></label>
            <label className="text-sm" htmlFor={`doc-type-${index}`}>Document classification<select id={`doc-type-${index}`} value={doc.type} onChange={(event) => updateDocument(index, { type: event.target.value as Document["type"] })} className={control}>{["NOTICE", "AMENDMENT", "TERMS", "OTHER"].map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="min-w-0 text-sm sm:col-span-2" htmlFor={`doc-url-${index}`}>HTTPS or uploaded file URL<input id={`doc-url-${index}`} value={doc.url} onChange={(event) => updateDocument(index, { url: event.target.value, fileSize: 0, mimeType: "application/octet-stream" })} maxLength={191} className={control} /></label>
            <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={doc.isPublic} onChange={(event) => updateDocument(index, { isPublic: event.target.checked })} />Public attachment — safe to share</label>
            <button type="button" className={button} onClick={() => { setDocuments((previous) => previous.filter((_, position) => index !== position)); setConfirmed(false); }}>Remove attachment</button>
          </div>)}
          <button type="button" className={button} disabled={documents.length >= 20} onClick={() => setDocuments((previous) => [...previous, { name: "", type: "NOTICE", url: "", fileSize: 0, mimeType: "application/octet-stream", isPublic: false }])}>Add existing document URL</button>
          {fields.documents && <p className="text-sm text-red-700">{fields.documents}</p>}
        </>}
      </section>
      {kind === "auction" && <section className="space-y-3 rounded-2xl border border-[#e6dfd4] bg-white p-5"><h2 className="font-semibold">Source review before publishing</h2><p className="text-sm leading-relaxed text-[#687480]">Drafts require the core amounts and dates. Save a draft, open its preview, and check the notice. Publishing requires an official source reference and a public document classified as NOTICE.</p><label className="flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" name="sourceConfirmed" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1" /><span>I checked the original source, property details, amounts, IST dates and public documents. This is a genuine notice suitable for publication.</span></label></section>}
      <div className="flex flex-wrap gap-3"><button type="submit" value="draft" className={`${button} bg-[#132330] text-white`}>{saving ? "Saving…" : kind === "property" ? "Save property" : "Save draft"}</button>{kind === "auction" && <button type="submit" value="publish" className={`${button} bg-[#b59461] text-[#091118]`}>{published ? "Update published notice" : "Publish checked notice"}</button>}</div>
    </fieldset>
    {kind === "auction" && published && id && <button type="button" className={`${button} border-red-200 bg-white text-red-700`} disabled={saving || uploading} onClick={async () => {
      if (active.current) return; active.current = true; setSaving(true); setError("");
      try {
        const response = await fetch(`/api/admin/auctions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "unpublish", updatedAt: values.updatedAt }), signal: AbortSignal.timeout(15000) });
        const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error || "Could not withdraw the notice.");
        setNotice("Notice removed from public view. The record and its history are kept."); setLoading(true); setAttempt((value) => value + 1); router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : "Could not withdraw the notice."); }
      finally { active.current = false; setSaving(false); }
    }}>Remove from public view</button>}
  </form>;
}
