import Link from "next/link";
import type { Metadata } from "next";
import { LifeBuoy, ListChecks } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { buyerEnquiryWhere, REQUEST_STATUS, requestReference, requestSourceLabel } from "@/lib/requests";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading, Panel } from "@/components/account/dashboard-ui";
import { RequestForm } from "@/components/account/request-form";

export const metadata: Metadata = {
  title: "My enquiries",
};

async function loadRequests(userId: string, email: string) {
  try {
    return await db.enquiry.findMany({
      // Forms sent before signing up also show, but only for a verified email:
      // anyone can type an address in, so an unverified one proves nothing.
      where: buyerEnquiryWhere(userId, email),
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, subject: true, source: true, status: true, createdAt: true, preferredDate: true, auctionId: true },
    });
  } catch (error) {
    console.error("[dashboard] requests", error);
    return null;
  }
}

export default async function RequestsPage() {
  const { session, user } = await getAccount();
  const requests = await loadRequests(session.userId, user?.isEmailVerified ? user.email || "" : "");

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeading title="My enquiries" subtitle="Your property enquiries, inspection requests and support messages, with their latest status." />
      {requests === null && <DbErrorNote />}

      <Panel title="Enquiries & inspections" icon={<ListChecks className="h-4 w-4" />}>
        {requests?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-semibold text-[#182129]">No requests yet</p>
            <p className="text-xs text-[#59636a] mt-1">
              Ask for a site inspection from any listing&apos;s page, or send us a question below.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#efe9df] -mx-1">
            {requests?.map((r) => {
              const status = REQUEST_STATUS[r.status] || { label: r.status, className: "bg-gray-50 text-gray-700 border-gray-200" };
              return (
                <li key={r.id} className="px-1 py-3 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#182129] break-words">
                      {r.auctionId ? (
                        <Link href={`/auctions/${r.auctionId}`} className="hover:text-[#84663c]">
                          {r.subject}
                        </Link>
                      ) : (
                        r.subject
                      )}
                    </p>
                    <p className="text-xs text-[#7e868b]">
                      {requestSourceLabel(r.source)} · Ref {requestReference(r.id)} · Sent {formatDate(r.createdAt)}
                      {r.preferredDate && ` · Preferred date ${formatDate(r.preferredDate)}`}
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

      <Panel title="Send a new request" icon={<LifeBuoy className="h-4 w-4" />}>
        <RequestForm />
      </Panel>
    </div>
  );
}
