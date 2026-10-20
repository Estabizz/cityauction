import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { getAccount } from "@/components/account/dashboard-data";
import { DbErrorNote, PageHeading } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Notifications",
};

async function loadNotifications(userId: string) {
  try {
    const rows = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, title: true, message: true, isRead: true, createdAt: true },
    });
    return { rows, failed: false };
  } catch (error) {
    console.error("[dashboard] notifications", error);
    return { rows: [], failed: true };
  }
}

export default async function NotificationsPage() {
  const { session } = await getAccount();
  const { rows, failed } = await loadNotifications(session.userId);

  return (
    <div className="max-w-3xl">
      <PageHeading title="Notifications" subtitle="Updates from CityAuction about your account and enquiries." />
      {failed && <DbErrorNote />}

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e6dfd4] px-6 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f5edd3] text-[#84663c] flex items-center justify-center mx-auto">
            <Bell className="h-6 w-6" />
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#091118] mt-4">No notifications yet</h2>
          <p className="text-sm text-[#59636a] mt-2">When we have an update for you, it will show up here.</p>
        </div>
      ) : (
        <ul className="bg-white rounded-2xl border border-[#e6dfd4] divide-y divide-[#efe9df]">
          {rows.map((n) => (
            <li key={n.id} className="p-4 sm:p-5 flex gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.isRead ? "bg-transparent" : "bg-[#b49361]"}`} aria-label={n.isRead ? undefined : "Unread"} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#182129]">{n.title}</p>
                <p className="text-sm text-[#59636a] mt-0.5 whitespace-pre-line break-words">{n.message}</p>
                <p className="text-xs text-[#7e868b] mt-1.5">{formatDateTime(n.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
