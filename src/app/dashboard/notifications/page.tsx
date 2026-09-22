"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  Gavel,
  ShieldAlert,
  ArrowRight,
  Check,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "AUCTION_STARTING" | "BID_SURPASSED" | "APPLICATION_STATUS" | "GENERAL";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "AUCTION_STARTING",
    title: "Live Auction Starting in 1 Hour",
    message: "Punjab National Bank SARFAESI auction for Commercial Office in DLF Cyber City commences at 11:00 AM.",
    timestamp: "10 mins ago",
    isRead: false,
    link: "/auctions/auc-102",
  },
  {
    id: "notif-2",
    type: "BID_SURPASSED",
    title: "Your Bid Has Been Outbid",
    message: "A higher bid of ₹2.18 Cr was placed on 3 BHK Apartment in Goregaon East. Counter-bid before timer expires.",
    timestamp: "Yesterday, 4:22 PM",
    isRead: false,
    link: "/dashboard/bids",
  },
  {
    id: "notif-3",
    type: "APPLICATION_STATUS",
    title: "EMD Application Approved",
    message: "State Bank of India has approved your ₹48.5 Lakh EMD remittance for Lodha Bellissimo auction (CA-MH-2026-101).",
    timestamp: "18 Sep 2026",
    isRead: true,
    link: "/dashboard/applications",
  },
  {
    id: "notif-4",
    type: "GENERAL",
    title: "Welcome to CityAuction",
    message: "Your PAN Card and identity verification have been successfully processed. You can now participate in any bank auction across India.",
    timestamp: "15 Sep 2026",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time auction reminders, live bidding alerts, and bank authorization updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
              n.isRead
                ? "bg-white border-border opacity-85"
                : "bg-primary-50/40 border-primary-200 shadow-xs"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                n.type === "AUCTION_STARTING"
                  ? "bg-amber-100 text-amber-700"
                  : n.type === "BID_SURPASSED"
                  ? "bg-red-100 text-red-700"
                  : n.type === "APPLICATION_STATUS"
                  ? "bg-success-100 text-success-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {n.type === "BID_SURPASSED" ? (
                <Gavel className="h-5 w-5" />
              ) : n.type === "AUCTION_STARTING" ? (
                <Clock className="h-5 w-5" />
              ) : n.type === "APPLICATION_STATUS" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className={`text-sm ${n.isRead ? "font-semibold text-gray-900" : "font-bold text-gray-900"}`}>
                  {n.title}
                </h3>
                <span className="text-[11px] text-gray-400 shrink-0 font-medium">{n.timestamp}</span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-2">{n.message}</p>

              {n.link && (
                <Link
                  href={n.link}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
