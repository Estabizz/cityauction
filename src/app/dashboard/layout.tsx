"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Search,
  Gavel,
  FileCheck,
  FolderLock,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/favourites", label: "Saved Properties", icon: Heart },
  { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Search },
  { href: "/dashboard/bids", label: "My Bids", icon: Gavel },
  { href: "/dashboard/applications", label: "Auction Applications", icon: FileCheck },
  { href: "/dashboard/payments", label: "Payments & EMD", icon: CreditCard },
  { href: "/dashboard/documents", label: "KYC & Documents", icon: FolderLock },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Bidder Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <span className="font-bold text-gray-900 text-sm">{APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white border-r border-border flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-base leading-tight">{APP_NAME}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Bidder Console</span>
              </div>
            </Link>
          </div>

          {/* User badge */}
          <div className="p-4 mx-3 my-3 bg-primary-50 rounded-xl border border-primary-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shrink-0">
              VS
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-gray-900 truncate">Vikramaditya S.</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-700">
                <ShieldCheck className="h-3 w-3" />
                KYC Verified
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-3 space-y-1 mt-2">
            {DASHBOARD_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/auctions"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary text-xs font-semibold rounded-lg transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search Auctions</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-gray-600 hover:text-error hover:bg-error-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
