"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Building2, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { activateDialog } from "@/lib/dialog-focus";
import { auctionImages } from "@/lib/auction-detail";

export function PropertyGallery({ images, primaryImage, title }: { images: string[]; primaryImage: string | null; title: string }) {
  const photos = auctionImages(images, primaryImage);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const index = Math.min(selected, Math.max(0, photos.length - 1));
  const photo = photos[index];
  const available = Boolean(photo && !failed.has(photo));
  const previous = () => setSelected((index + photos.length - 1) % photos.length);
  const next = () => setSelected((index + 1) % photos.length);
  useEffect(() => {
    if (!expanded || !panel.current) return;
    return activateDialog(panel.current, () => setExpanded(false));
  }, [expanded]);
  const fail = (url: string) => setFailed((previous) => new Set([...previous, url]));
  const image = (large = false) => available ? (
    // Notice images come from multiple selling institutions.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt={`${title} — photo ${index + 1}`} width={1200} height={800} decoding="async" onError={() => fail(photo)}
      className={`h-full w-full ${large ? "object-contain" : "object-cover"}`} />
  ) : <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center text-[#687480]"><Building2 className="h-12 w-12" aria-hidden="true" /><p>{photo ? "This photo couldn’t be loaded" : "Property photos not available"}</p><p className="text-xs">Check the official notice or ask the team for photos.</p></div>;
  const arrows = photos.length > 1 && <>
    <button type="button" onClick={previous} aria-label="Previous property photo" className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce2e7] bg-white text-[#182129] shadow"><ChevronLeft className="h-5 w-5" /></button>
    <button type="button" onClick={next} aria-label="Next property photo" className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce2e7] bg-white text-[#182129] shadow"><ChevronRight className="h-5 w-5" /></button>
  </>;
  return <figure className="min-w-0 overflow-hidden rounded-2xl border border-[#e4e8ec] bg-white">
    <div className="relative aspect-[4/3] bg-[#edf1f4] sm:aspect-[16/10]">{image()}{arrows}
      {available && <button type="button" onClick={() => setExpanded(true)} aria-label="Enlarge property photo" className="absolute bottom-3 right-3 flex min-h-11 items-center gap-2 rounded-xl bg-[#132330] px-3 text-xs font-semibold text-white"><Maximize2 className="h-4 w-4" />Enlarge</button>}
    </div>
    {photos.length > 1 && <div className="flex gap-2 overflow-x-auto p-3">{photos.map((url, position) => <button type="button" key={url} onClick={() => setSelected(position)} aria-label={`Show property photo ${position + 1}`} aria-pressed={index === position}
      className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === position ? "border-[#b59461]" : "border-transparent"}`}>
      {failed.has(url) ? <span className="text-xs">Photo {position + 1}</span> :
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" loading="lazy" width={80} height={64} onError={() => fail(url)} className="h-full w-full object-cover" />}
    </button>)}</div>}
    <figcaption className="border-t border-[#e4e8ec] px-4 py-3 text-xs text-[#687480]" aria-live="polite">{photos.length ? `Photo ${index + 1} of ${photos.length}. Confirm the property’s current condition during inspection.` : "No photos have been supplied with this listing."}</figcaption>
    {expanded && createPortal(<div className="fixed inset-0 z-[90] bg-black/80 p-3 sm:p-6">
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1} className="flex h-full flex-col rounded-2xl bg-white p-3 sm:p-5">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3"><h2 id={headingId} className="min-w-0 break-words font-semibold">{title} · {index + 1}/{photos.length}</h2><button type="button" onClick={() => setExpanded(false)} aria-label="Close photo viewer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f5f7]"><X className="h-5 w-5" /></button></div>
        <div className="relative min-h-0 flex-1 bg-[#edf1f4]">{image(true)}{arrows}</div>
      </div>
    </div>, document.body)}
  </figure>;
}
