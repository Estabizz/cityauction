import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Inbox, MessageSquareText, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { getAccount, profileCompleteness } from "@/components/account/dashboard-data";
import { NewsletterToggle } from "@/components/account/newsletter-toggle";
import { DbErrorNote, Panel } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "My Account",
};

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact form",
  "auction-alerts": "Auction alerts",
  career: "Careers",
  "investor-desk": "Investor desk",
  "liquidate-asset": "Liquidate an asset",
  "institutional-mandate": "Institutional services",
  "next-chapter": "Next Chapter",
  homepage: "Homepage",
  "password-reset": "Password reset",
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  NEW: { label: "Received", className: "bg-sky-50 text-sky-800 border-sky-200" },
  IN_PROGRESS: { label: "In progress", className: "bg-amber-50 text-amber-800 border-amber-200" },
  CONTACTED: { label: "Contacted", className: "bg-violet-50 text-violet-800 border-violet-200" },
  RESOLVED: { label: "Resolved", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

function sourceLabel(source: string) {
  return SOURCE_LABELS[source] || source.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

async function loadOverview(userId: string, email: string) {
  try {
    const [enquiries, subscriber] = await Promise.all([
      db.enquiry.findMany({
        where: { OR: [{ userId }, { email }] },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: { id: true, subject: true, source: true, status: true, createdAt: true },
      }),
      db.subscriber.findUnique({ where: { email }, select: { status: true } }),
    ]);
    return { enquiries, subscribed: subscriber?.status === "ACTIVE", failed: false };
  } catch (error) {
    console.error("[dashboard] overview", error);
    return { enquiries: [], subscribed: false, failed: true };
  }
}

export default async function DashboardPage() {
  const { session, user, dbError } = await getAccount();
  const name = user?.fullName || session.fullName;
  const email = user?.email || session.email;
  const { percent, missing } = profileCompleteness(user ?? { fullName: session.fullName, email: session.email });
  const overview = await loadOverview(session.userId, email);
  const firstName = name.split(/\s+/)[0];

  return (
    <div className="space-y-6">
      {(dbError || overview.failed) && <DbErrorNote />}

      <section className="rounded-2xl bg-[#091118] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b49361]">My Account</p>
          <h1 className="font-serif-heading text-3xl md:text-4xl font-semibold mt-1">Welcome, {firstName}</h1>
          <p className="text-sm text-[#aeb9c1] mt-1 break-all">{email}</p>
        </div>
        <Link
          href="/auctions"
          className="inline-flex items-center gap-2 self-start md:self-auto h-10 px-5 rounded-full bg-[#b49361] text-[#081016] text-xs font-bold hover:bg-[#c4a46e] transition-colors shrink-0"
        >
          Explore auctions <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Profile" icon={<UserRound className="h-4 w-4" />}>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold text-[#091118]">{percent}%</span>
            <span className="text-xs text-[#7e868b]">complete</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[#efe9df] overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness">
            <div className="h-full rounded-full bg-[#b49361]" style={{ width: `${percent}%` }} />
          </div>
          {missing.length > 0 ? (
            <p className="text-xs text-[#59636a] mt-3">Add your {missing.join(", ").toLowerCase()} so our team can help you faster.</p>
          ) : (
            <p className="text-xs text-emerald-700 mt-3 flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5" /> Your profile is complete.
            </p>
          )}
          <Link href="/dashboard/profile" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#84663c] hover:underline">
            Edit profile <ArrowRight className="h-3 w-3" />
          </Link>
        </Panel>

        <Panel title="Newsletter" icon={<Inbox className="h-4 w-4" />}>
          <NewsletterToggle key={String(overview.subscribed)} initialSubscribed={overview.subscribed} email={email} />
        </Panel>

        <Panel title="Need help?" icon={<MessageSquareText className="h-4 w-4" />}>
          <p className="text-sm text-[#59636a]">Questions about an auction, due diligence or selling an asset? Our team replies within one working day.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/contact" className="inline-flex items-center h-9 px-4 rounded-full bg-[#091118] text-white text-xs font-bold hover:bg-[#25333f]">
              Contact us
            </Link>
            <Link href="/auction-alerts" className="inline-flex items-center h-9 px-4 rounded-full border border-[#dcd5ca] bg-white text-xs font-bold text-[#3b464e] hover:bg-[#f6f2ea]">
              Set up alerts
            </Link>
          </div>
        </Panel>
      </div>

      <Panel title="My enquiries" icon={<MessageSquareText className="h-4 w-4" />}>
        {overview.enquiries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-semibold text-[#182129]">No enquiries yet</p>
            <p className="text-xs text-[#59636a] mt-1">Forms you send from this email (contact, alerts, investor desk…) will show up here with their status.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#efe9df] -mx-1">
            {overview.enquiries.map((e) => {
              const status = STATUS_STYLES[e.status] || { label: e.status, className: "bg-gray-50 text-gray-700 border-gray-200" };
              return (
                <li key={e.id} className="px-1 py-3 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#182129] truncate">{e.subject}</p>
                    <p className="text-xs text-[#7e868b]">
                      {sourceLabel(e.source)} · {formatDate(e.createdAt)}
                    </p>
                  </div>
                  <span className={`self-start sm:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${status.className}`}>
                    {status.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
