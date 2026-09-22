"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gavel,
  PlusCircle,
  Building,
  UserCheck,
  Users,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/auctions", label: "Auctions Management", icon: Gavel },
  { href: "/admin/auctions/create", label: "Publish New Auction", icon: PlusCircle },
  { href: "/admin/properties", label: "Property Inventory", icon: Building },
  { href: "/admin/kyc", label: "Bidder KYC Queue", icon: UserCheck },
  { href: "/admin/participants", label: "Participant & EMD Approvals", icon: Users },
  { href: "/admin/enquiries", label: "Enquiries & Leads", icon: MessageSquare },
  { href: "/admin/audit-logs", label: "Statutory Audit Logs", icon: ShieldAlert },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
      {/* Mobile Header */}
      <div className="md:hidden bg-primary-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary-900 font-bold text-sm">
            A
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">{APP_NAME} Admin</span>
            <span className="text-[10px] text-accent">Bank Officer Console</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-white hover:bg-primary-800"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-primary-950 text-white border-r border-primary-900 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-primary-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-primary-950 font-bold text-lg">
                C
              </div>
              <div>
                <span className="font-bold text-base block leading-tight tracking-tight">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-accent uppercase tracking-wider font-semibold">
                  Officer Console
                </span>
              </div>
            </div>
          </div>

          {/* Admin User Card */}
          <div className="p-4 mx-3 my-3 bg-primary-900/60 rounded-xl border border-primary-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent text-primary-950 font-bold flex items-center justify-center text-xs shrink-0">
              AO
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">Authorised Officer</span>
              <span className="text-[10px] text-primary-300 font-medium">Recovery & SARFAESI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-accent text-primary-950 shadow-xs font-bold"
                      : "text-primary-200 hover:text-white hover:bg-primary-900/80"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary-900 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 text-primary-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
