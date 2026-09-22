"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Phone,
  Mail,
  User,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-800 text-primary-100 text-sm hidden lg:block">
        <div className="container-wide flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a
              href="tel:+911234567890"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+91-124-4302020</span>
            </a>
            <a
              href="mailto:support@cityauction.com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>support@cityauction.com</span>
            </a>
          </div>
          <div className="text-primary-300 text-xs">
            India&apos;s Trusted Bank Auction Platform
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary-800 leading-tight tracking-tight">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-gray-500 leading-tight -mt-0.5 tracking-wider uppercase">
                  Auction Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.href)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-md",
                      "hover:text-primary hover:bg-primary-50 transition-colors"
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.href && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="bg-white rounded-lg shadow-dropdown border border-border py-1.5 min-w-[200px] animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Search auctions"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Auth buttons — desktop */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium",
                    "text-primary border border-primary-200 rounded-lg",
                    "hover:bg-primary-50 transition-colors"
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium",
                    "text-white bg-primary rounded-lg",
                    "hover:bg-primary-700 transition-colors"
                  )}
                >
                  <User className="h-4 w-4" />
                  Register
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white animate-slide-down">
            <div className="container-wide py-4">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary"
                      onClick={() => !link.children && setMobileOpen(false)}
                    >
                      {link.label}
                      {link.children && (
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      )}
                    </Link>
                    {link.children && (
                      <div className="ml-4 flex flex-col gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile auth buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Link
                  href="/auth/login"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary border border-primary-200 rounded-lg hover:bg-primary-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
