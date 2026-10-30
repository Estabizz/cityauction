import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, MessageCircle, SlidersHorizontal, Target } from "lucide-react";
import { loadDashboardOverview } from "@/lib/dashboard-overview";
import { formatDate } from "@/lib/utils";
import { REQUEST_STATUS, requestReference } from "@/lib/requests";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, Panel } from "@/components/account/dashboard-ui";
import { ListingRow } from "@/components/account/listing-row";

export const metadata: Metadata = { title: "My dashboard" };
const linkClass = "inline-flex items-center gap-1.5 text-xs font-semibold text-[#84663c] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]";

function SummaryLink({ href, label, value, icon }: { href: string; label: string; value: number | null; icon: React.ReactNode }) {
  return <Link href={href} className="flex items-center gap-3 rounded-2xl border border-[#e4e8ec] bg-white p-4 transition hover:border-[#b49361] focus-visible:outline-2 focus-visible:outline-[#84663c]">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f6] text-[#687480]">{icon}</span>
    <span className="min-w-0 flex-1"><span className="block text-2xl font-semibold text-[#182129] tabular-nums" aria-label={value === null ? "Unavailable" : undefined}>{value ?? "—"}</span><span className="block text-xs text-[#687480]">{label}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-[#98a1ab]" />
  </Link>;
}
function Unavailable({ label }: { label: string }) {
  return <p className="text-sm text-[#687480]">Your {label} couldn’t be loaded. Please try refreshing shortly.</p>;
}

export default async function DashboardPage() {
  const { session, user, dbError } = await getAccount();
  const name = (user?.fullName || session.fullName).trim().split(/\s+/)[0] || "there";
  const overview = await loadDashboardOverview(session.userId, user?.isEmailVerified ? user.email : null);
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h1 className="text-2xl font-semibold tracking-tight text-[#182129] sm:text-3xl">Welcome back, {name}</h1><p className="mt-1.5 text-sm text-[#687480]">Your saved properties, enquiries and matching opportunities.</p></div>
      <Link href="/auctions" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#132330] px-4 text-sm font-semibold text-white hover:bg-[#253b4b]">Browse properties<ArrowRight className="h-4 w-4" /></Link>
    </div>
    {(dbError || !overview.saved || !overview.enquiries || !overview.matches) && <DbErrorNote />}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryLink href="/dashboard/favourites" label="Saved properties" value={overview.saved?.count ?? null} icon={<Heart className="h-4 w-4" />} />
      <SummaryLink href="/dashboard/requests" label="My enquiries" value={overview.enquiries?.count ?? null} icon={<MessageCircle className="h-4 w-4" />} />
      <SummaryLink href="/dashboard/matches" label="Matching opportunities" value={overview.matches?.total ?? null} icon={<Target className="h-4 w-4" />} />
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Saved properties" icon={<Heart className="h-4 w-4" />}>
        {!overview.saved ? <Unavailable label="saved properties" /> : overview.saved.auctions.length ? <div className="space-y-3">{overview.saved.auctions.map((auction) => <ListingRow key={auction.id} listing={auction} />)}</div> : <div className="space-y-2"><p className="text-sm font-medium text-[#182129]">No saved properties yet</p><p className="text-sm text-[#687480]">Select the heart on a property to keep it here.</p><Link href="/auctions" className={linkClass}>Find a property<ArrowRight className="h-3.5 w-3.5" /></Link></div>}
        {!!overview.saved?.auctions.length && <Link href="/dashboard/favourites" className={`${linkClass} mt-4`}>View saved properties<ArrowRight className="h-3.5 w-3.5" /></Link>}
      </Panel>
      <Panel title="My enquiries" icon={<MessageCircle className="h-4 w-4" />}>
        {!overview.enquiries ? <Unavailable label="enquiries" /> : overview.enquiries.recent.length ? <ul className="divide-y divide-[#edf0f3]">{overview.enquiries.recent.map((request) => {
          const status = REQUEST_STATUS[request.status] || { label: request.status, className: "bg-gray-50 text-gray-700 border-gray-200" };
          return <li key={request.id} className="flex items-start justify-between gap-3 py-3 first:pt-0"><div className="min-w-0"><Link href="/dashboard/requests" className="text-sm font-medium text-[#182129] hover:underline">{request.subject}</Link><p className="mt-1 text-xs text-[#7a8590]">{requestReference(request.id)} · {formatDate(request.createdAt)}</p></div><span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${status.className}`}>{status.label}</span></li>;
        })}</ul> : <div className="space-y-2"><p className="text-sm font-medium text-[#182129]">No enquiries yet</p><p className="text-sm text-[#687480]">Contact the team or request an inspection from a property page. You can follow the response here.</p></div>}
        <Link href="/dashboard/requests" className={`${linkClass} mt-4`}>View enquiries & inspections<ArrowRight className="h-3.5 w-3.5" /></Link>
      </Panel>
    </div>
    <Panel title="Matching opportunities" icon={<Target className="h-4 w-4" />}>
      {!overview.matches ? <Unavailable label="matching opportunities" /> : !overview.matches.requirements.length ? <div className="space-y-2"><p className="text-sm font-medium text-[#182129]">What are you looking for?</p><p className="text-sm text-[#687480]">Choose property types, locations and a budget to see matching opportunities here.</p></div> : overview.matches.auctions.length ? <div className="space-y-3">{overview.matches.auctions.map((auction) => <ListingRow key={auction.id} listing={auction} label="Suggested match" />)}</div> : <div className="space-y-2"><p className="text-sm font-medium text-[#182129]">No matching opportunities right now</p><p className="text-sm text-[#687480]">Try adjusting your locations or budget, or browse all properties.</p></div>}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3"><Link href="/dashboard/matches" className={linkClass}>View matching opportunities<ArrowRight className="h-3.5 w-3.5" /></Link><Link href="/dashboard/requirements" className={linkClass}><SlidersHorizontal className="h-3.5 w-3.5" />Match preferences</Link></div>
    </Panel>
  </div>;
}
