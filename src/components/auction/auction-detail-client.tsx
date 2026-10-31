"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, MapPin, Share2 } from "lucide-react";
import type { DetailedAuction } from "@/types";
import { auctionDate, auctionMoney } from "@/lib/auction-discovery-ui";
import { auctionAvailability, auctionContactEmail, auctionContactPhone, safeAuctionUrl } from "@/lib/auction-detail";
import { POSSESSION_STATUSES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cityPath, findCityByName } from "@/content/cities/paths";
import { PropertyRequest } from "@/components/account/property-request";
import { InspectionRequest } from "@/components/account/inspection-request";
import { SaveListingButton } from "@/components/account/save-listing-button";
import { PropertyGallery } from "./property-gallery";

const box = "min-w-0 rounded-2xl border border-[#e4e8ec] bg-white p-5 sm:p-6";
const heading = "mb-4 text-lg font-semibold text-[#182129]";
const section = "scroll-mt-28";

export function AuctionDetailClient({ auction, initialNow }: { auction: DetailedAuction; initialNow: number }) {
  const cityPage = findCityByName(auction.city);
  const [now, setNow] = useState(initialNow);
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(timer); }, []);
  const availability = auctionAvailability(auction, now);
  const possession = POSSESSION_STATUSES.find((item) => item.value === auction.possessionStatus)?.label ?? "Not provided";
  const officerPhone = auctionContactPhone(auction.contactOfficerPhone);
  const officerEmail = auctionContactEmail(auction.contactOfficerEmail);
  const institutionWebsite = safeAuctionUrl(auction.organization.website);
  const sourceUrl = safeAuctionUrl(auction.sourceListingId);
  async function share() {
    if (sharing) return;
    setSharing(true); setShareMessage(""); setShareUrl("");
    const url = `${window.location.origin}/auctions/${encodeURIComponent(auction.id)}`;
    try {
      if (navigator.share) { await navigator.share({ title: auction.title, url }); setShareMessage("Share options opened."); }
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); setShareMessage("Property link copied."); }
      else { setShareUrl(url); setShareMessage("Copy this property link to share it."); }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) { setShareUrl(url); setShareMessage("Sharing couldn’t be completed. You can copy the link below."); }
    } finally { setSharing(false); }
  }
  return <div>
    <header className="border-b border-[#e4e8ec] bg-white py-6 sm:py-8">
      <div className="container-wide min-w-0">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-2 text-xs text-[#687480]"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/auctions">Auctions</Link><span aria-hidden="true">/</span><span aria-current="page" className="break-words">{auction.auctionNumber}</span></nav>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0"><div className="mb-3 flex flex-wrap items-center gap-2"><Badge>{auction.categoryName}</Badge><Badge>{auction.auctionType}</Badge><Badge variant={availability.canInspect ? "info" : "warning"}>{availability.title}</Badge></div>
            <h1 className="break-words text-2xl font-semibold leading-tight text-[#182129] sm:text-3xl">{auction.title}</h1>
            <p className="mt-3 flex items-start gap-2 text-sm text-[#687480]"><MapPin aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{cityPage ? <Link href={cityPath(cityPage)} className="underline">{auction.city}</Link> : auction.city}, {auction.state}</span></p>
            <p className="mt-2 break-words text-xs text-[#687480]">{auction.organizationName} · Notice {auction.auctionNumber}</p>
          </div>
          <div id="property-save" className="min-w-0 shrink-0 scroll-mt-28 space-y-2 lg:max-w-80"><div className="flex flex-wrap items-start gap-2">
            <SaveListingButton auctionId={auction.id} propertyTitle={auction.title} variant="button" />
            <button type="button" onClick={() => void share()} disabled={sharing} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e4e8ec] px-4 text-sm font-semibold disabled:opacity-60"><Share2 className="h-4 w-4" />{sharing ? "Sharing…" : "Share"}</button>
          </div>
            {shareMessage && <p role="status" className="text-xs text-[#46525d]">{shareMessage}</p>}
            {shareUrl && <label className="block text-xs text-[#687480]">Property link<input readOnly value={shareUrl} onFocus={(event) => event.target.select()} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce2e7] px-3 text-xs" /></label>}
          </div>
        </div>
      </div>
    </header>
    <div className="container-wide py-6 sm:py-8">
      <div className="mb-5 rounded-xl border border-[#e4e8ec] bg-white px-4 py-3 text-xs leading-relaxed text-[#687480]">
        <p className="break-words">Source reference: <strong>{auction.sourceListingId || "Not provided"}</strong> · Checked {auctionDate(auction.sourceVerifiedAt || "")}.</p>
        <p>Source checks do not confirm title or current availability. Confirm changes with the auctioning authority. <Link href="/verified-information-policy" className="font-medium underline">Verification policy</Link></p>
      </div>
      <nav aria-label="Property sections" className="mb-5 flex gap-2 overflow-x-auto pb-1 text-sm font-medium">{[["property-overview", "Overview"], ["property-location", "Location"], ["property-documents", `Documents (${auction.documents.length})`], ["property-terms", "Terms"], ["property-officer", "Auction contact"]].map(([id, label]) => <a key={id} href={`#${id}`} className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-[#e4e8ec] bg-white px-4">{label}</a>)}</nav>
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2 lg:row-start-1"><PropertyGallery key={auction.id} images={auction.images} primaryImage={auction.primaryImage} title={auction.title} /></div>
        <aside aria-label="Auction summary and enquiries" className={`${box} space-y-5 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto`}>
          <div><h2 className="text-sm text-[#687480]">Reserve price</h2><p className="mt-1 break-words text-3xl font-semibold tabular-nums text-[#182129]">{auctionMoney(auction.reservePrice)}</p><p className="mt-2 break-words text-sm text-[#46525d]">EMD: <strong>{auctionMoney(auction.emd)}</strong></p><p className="mt-1 break-words text-sm text-[#46525d]">Bid increment: <strong>{auctionMoney(auction.bidIncrement)}</strong></p></div>
          <dl className="space-y-4 border-y border-[#e4e8ec] py-4 text-sm">{[["Auction starts", auction.startDateTime], ["Auction ends", auction.endDateTime], ["Submission deadline", auction.submissionDeadline], ["Inspection in notice", auction.inspectionDate]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#687480]">{label}</dt><dd className="mt-1 font-medium tabular-nums text-[#182129]">{value ? <time dateTime={value}>{auctionDate(value, true)}</time> : "Not provided"}</dd></div>)}</dl>
          <div role="status" className={`rounded-xl border p-4 text-sm ${availability.canInspect ? "border-[#e4e8ec] bg-[#f7f9fa]" : "border-amber-200 bg-amber-50"}`}><h3 className="font-semibold text-[#182129]">{availability.title}</h3><p className="mt-1 leading-relaxed text-[#46525d]">{availability.message}</p></div>
          <div id="property-actions" className="scroll-mt-28 space-y-3"><h2 className="font-semibold text-[#182129]">Ask about this property</h2>
            <PropertyRequest auctionId={auction.id} auctionNumber={auction.auctionNumber} kind="contact" />
            {availability.canInspect ? <InspectionRequest auctionId={auction.id} auctionNumber={auction.auctionNumber} submissionDeadline={auction.submissionDeadline} /> : <p className="text-xs leading-relaxed text-[#687480]">New inspection requests are unavailable for this notice. You can still contact the team or save it for reference.</p>}
          </div>
          <p className="border-t border-[#e4e8ec] pt-4 text-xs leading-relaxed text-[#687480]">Submit bids and EMD payments through the official process in the auction notice. CityAuction does not accept bids or EMD payments on this page.</p>
        </aside>
        <div className="min-w-0 space-y-6 lg:col-span-2 lg:row-start-2">
          <section id="property-overview" className={`${box} ${section}`}><h2 className={heading}>Property overview</h2>
            <dl className="mb-5 grid grid-cols-1 gap-4 border-b border-[#e4e8ec] pb-5 sm:grid-cols-2"><div><dt className="text-xs text-[#687480]">Property type</dt><dd className="mt-1 text-sm font-medium">{auction.categoryName || "Not provided"}</dd></div><div><dt className="text-xs text-[#687480]">Possession</dt><dd className="mt-1 text-sm font-medium">{possession}</dd></div><div><dt className="text-xs text-[#687480]">Area in notice</dt><dd className="mt-1 text-sm font-medium">{Number.isFinite(auction.area) && auction.area > 0 ? `${auction.area.toLocaleString("en-IN")} ${auction.areaUnit || "(unit not provided)"}` : "Not provided"}</dd></div></dl>
            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-[#46525d]">{auction.description.trim() || "A property description has not been supplied. Refer to the official notice or contact the team."}</p>
          </section>
          <section id="property-location" className={`${box} ${section}`}><h2 className={heading}>Location & address</h2><p className="whitespace-pre-line break-words text-sm leading-relaxed text-[#46525d]">{auction.address.trim() || "The full property address has not been supplied. Confirm it before planning a visit."}</p><p className="mt-3 text-sm text-[#687480]">{auction.city}, {auction.state}</p>{cityPage && <Link href={cityPath(cityPage)} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#84663c] underline">Explore {cityPage.city} auctions</Link>}</section>
          <section id="property-documents" className={`${box} ${section}`}><h2 className={heading}>Auction documents</h2><p className="mb-4 text-xs leading-relaxed text-[#687480]">Open the official notice and check for amendments before participating. Documents open in a new tab.</p>
            {auction.documents.length ? <ul className="space-y-3">{auction.documents.map((doc, index) => {
              const href = safeAuctionUrl(doc.url);
              return <li key={`${doc.name}-${index}`} className="flex flex-col justify-between gap-3 rounded-xl border border-[#e4e8ec] p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-start gap-3"><FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-[#84663c]" /><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{doc.name || "Auction document"}</h3>{doc.size && <p className="mt-1 text-xs text-[#687480]">File size: {doc.size}</p>}</div></div>{href ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${doc.name || "auction document"} (new tab)`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#dce2e7] px-4 text-sm font-semibold">Open document<ArrowUpRight className="h-4 w-4" /></a> : <p className="text-xs text-[#687480]">Document link unavailable. Ask the team for a copy.</p>}</li>;
            })}</ul> : <p className="text-sm text-[#687480]">No public documents have been supplied. Ask the team for the current auction notice.</p>}
            {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#84663c] underline">Open source reference<ArrowUpRight className="h-4 w-4" /></a>}
          </section>
          <section id="property-terms" className={`${box} ${section}`}><h2 className={heading}>Terms & conditions</h2><p className="whitespace-pre-line break-words text-sm leading-relaxed text-[#46525d]">{auction.terms.trim() || "Terms have not been supplied here. The selling institution’s current auction notice governs participation."}</p><p className="mt-4 rounded-xl bg-[#f7f9fa] p-4 text-xs leading-relaxed text-[#687480]">Inspect the property and independently check title, possession, dues and charges before bidding. Confirm payment and refund instructions directly with the selling institution.</p></section>
          <section id="property-officer" className={`${box} ${section}`}><h2 className={heading}>Auction contact</h2><p className="break-words text-sm font-semibold">{auction.organization.name}</p>{auction.contactOfficerName && <p className="mt-2 break-words text-sm text-[#46525d]">{auction.contactOfficerName}</p>}
            <div className="mt-3 flex flex-col items-start gap-2">{officerPhone && <a href={`tel:${officerPhone}`} className="inline-flex min-h-11 items-center break-all text-sm font-medium text-[#84663c] underline">{auction.contactOfficerPhone}</a>}{officerEmail && <a href={`mailto:${officerEmail}`} className="inline-flex min-h-11 items-center break-all text-sm font-medium text-[#84663c] underline">{officerEmail}</a>}{!officerPhone && !officerEmail && <p className="text-sm text-[#687480]">Officer contact details have not been supplied. Use Contact team for help.</p>}{institutionWebsite && <a href={institutionWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#84663c] underline">Institution website<ArrowUpRight className="h-4 w-4" /></a>}</div>
          </section>
          <Link href="/auctions" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#84663c] underline">Back to all auctions</Link>
        </div>
      </div>
    </div>
  </div>;
}
