"use client";
import Link from "next/link";

export default function AuctionDetailError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="container-wide py-12"><div role="alert" className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
    <h1 className="text-2xl font-semibold text-[#182129]">Property details couldn’t be loaded</h1>
    <p className="mt-3 text-sm leading-relaxed text-[#46525d]">We couldn’t retrieve this notice right now. Try again, or browse other auction notices.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={retry} className="min-h-11 rounded-xl bg-[#132330] px-5 text-sm font-semibold text-white">Try again</button><Link href="/auctions" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-[#84663c] underline">Browse auctions</Link></div>
  </div></div>;
}
