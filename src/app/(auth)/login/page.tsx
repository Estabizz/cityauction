"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Building2,
  User,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [loginAs, setLoginAs] = useState<"bidder" | "banker">("bidder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, loginAs }),
      });

      const data = await res.json();

      if (data.success) {
        // If admin role, route to /admin or /dashboard
        if (data.user?.roles?.includes("ADMIN") || data.user?.roles?.includes("SUPER_ADMIN")) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Please verify your credentials.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type: "admin" | "bidder") => {
    if (type === "admin") {
      setEmail("admin@cityauction.com");
      setPassword("CityAuction@2026");
      setLoginAs("banker");
    } else {
      setEmail("bidder@cityauction.com");
      setPassword("CityAuction@2026");
      setLoginAs("bidder");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">{APP_NAME}</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Sign in to your account</h1>
        <p className="text-xs text-gray-500 mt-1">
          Access upcoming auctions, your active bids, and document vault
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-border rounded-2xl sm:px-10">
          {/* Role Switcher (Bidder vs Banker/Officer) */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLoginAs("bidder")}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginAs === "bidder"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Bidder / Buyer
            </button>
            <button
              type="button"
              onClick={() => setLoginAs("banker")}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginAs === "banker"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Bank Officer / Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-error-50 border border-error-200 text-error-700 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-10 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-60 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Reviewer / Demo Quick Login Pills */}
          <div className="mt-6 pt-5 border-t border-border">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 text-center">
              Demo Test Accounts (Click to Fill)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("bidder")}
                className="py-1.5 px-2 bg-primary-50 hover:bg-primary-100 text-primary rounded-lg text-xs font-medium border border-primary-100 transition-colors text-center cursor-pointer"
              >
                Demo Bidder
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="py-1.5 px-2 bg-accent-50 hover:bg-accent-100 text-accent-800 rounded-lg text-xs font-medium border border-accent-200 transition-colors text-center cursor-pointer"
              >
                Demo Administrator
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
              Register as Bidder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
