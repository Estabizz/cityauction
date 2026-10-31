import Link from "next/link";

export default function AuctionNotFound() {
  return <div className="container-wide py-12 sm:py-20"><div className="max-w-xl rounded-2xl border border-[#e4e8ec] bg-white p-6 sm:p-8">
    <h1 className="text-2xl font-semibold text-[#182129]">This auction notice isn’t available</h1>
    <p className="mt-3 text-sm leading-relaxed text-[#687480]">The link may be incorrect, or the notice may no longer be published. Browse current notices or ask our team for help.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link href="/auctions" className="inline-flex min-h-11 items-center rounded-xl bg-[#132330] px-5 text-sm font-semibold text-white">Browse auctions</Link><Link href="/contact" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-[#84663c] underline">Contact team</Link></div>
  </div></div>;
}
