"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <>
      <a href="#mainContent" className="skip-link">
        Skip to main content
      </a>

      {/* Top bar */}
      <div className="topbar-wrapper">
        <div className="header-container">
          <div className="py-2 text-xs">
            <strong>CityAuction</strong> · A venture of Estabizz Fintech Private Limited
          </div>
          <div className="top-contact-links py-2 text-xs flex items-center gap-4">
            <a href="tel:+919825669668" className="transition-colors hover:text-white">
              +91 98256 69668
            </a>
            <a href="mailto:info@estabizz.com" className="transition-colors hover:text-white">
              info@estabizz.com
            </a>
            <span className="hidden sm:inline text-slate-400">Gandhinagar, Gujarat</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="estabizz-header">
        <div className="header-container header-row-custom">
          {/* Brand */}
          <Link href="/" className="brand-group" aria-label="CityAuction home">
            <div className="brand-mark" aria-hidden="true">
              C
            </div>
            <div>
              <div className="brand-title">CityAuction</div>
              <div className="brand-subtext">Auction · Assets · Capital · Resolution</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-links-custom hidden lg:flex" aria-label="Primary navigation">
            <Link
              href="/auctions"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/auctions" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              Auctions
            </Link>

            {/* Services Dropdown */}
            <div className="nav-dropdown-wrap" ref={dropdownRef}>
              <button
                className="nav-dropdown-btn text-[#182129]"
                type="button"
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>

              {servicesOpen && (
                <div className="nav-dropdown-menu animate-fadeIn" role="menu">
                  <Link
                    role="menuitem"
                    href="/investor-desk"
                    onClick={() => setServicesOpen(false)}
                  >
                    Investor Desk &amp; Due Diligence
                  </Link>
                  <Link
                    role="menuitem"
                    href="/auction-alerts"
                    onClick={() => setServicesOpen(false)}
                  >
                    Personalised Auction Alerts
                  </Link>
                  <Link
                    role="menuitem"
                    href="/liquidate-an-asset"
                    onClick={() => setServicesOpen(false)}
                  >
                    Liquidate an Asset
                  </Link>
                  <Link
                    role="menuitem"
                    href="/institutional-services"
                    onClick={() => setServicesOpen(false)}
                  >
                    Institutional Services
                  </Link>
                  <div className="my-1.5 border-t border-[#e6dfd4]" />
                  <Link
                    role="menuitem"
                    href="/financial-institution-login"
                    className="text-[#84663c] font-medium"
                    onClick={() => setServicesOpen(false)}
                  >
                    Financial Institution Login →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/customs-auction"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/customs-auction" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              Customs
            </Link>

            <Link
              href="/next-chapter"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/next-chapter" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              Next Chapter
            </Link>

            <Link
              href="/how-it-works"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/how-it-works" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              How It Works
            </Link>

            <Link
              href="/about"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/about" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`transition-colors hover:text-[#84663c] ${
                pathname === "/contact" ? "text-[#84663c] font-semibold" : "text-[#182129]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              className="btn-pill btn-dark hidden sm:inline-flex text-xs px-4 py-2"
              href="/liquidate-an-asset"
            >
              Liquidate an Asset
            </Link>

            <Link
              href="/investor-login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#dcd5ca] bg-white text-xs font-semibold text-gray-800 hover:text-[#84663c] hover:border-[#b49361] transition-colors shadow-sm"
              title="Investor Portal Login"
            >
              <LogIn className="h-3.5 w-3.5 text-[#84663c]" />
              <span>Sign In</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden w-10 h-10 rounded-full border border-gray-300 bg-white flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-gray-50 cursor-pointer ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-gray-800" />
              ) : (
                <Menu className="h-5 w-5 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <nav
          className="fixed inset-x-0 top-[118px] bottom-0 bg-[#091118]/98 z-40 p-6 overflow-y-auto text-white space-y-2 animate-fadeIn"
          aria-label="Mobile navigation"
        >
          <Link
            href="/auctions"
            className="block py-3.5 border-b border-white/10 text-base font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Explore Auctions
          </Link>
          <Link
            href="/investor-desk"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Investor Desk &amp; Due Diligence
          </Link>
          <Link
            href="/auction-alerts"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Personalised Auction Alerts
          </Link>
          <Link
            href="/institutional-services"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Institutional Services
          </Link>
          <Link
            href="/liquidate-an-asset"
            className="block py-3.5 border-b border-white/10 text-base text-[#d9c39c]"
            onClick={() => setMobileOpen(false)}
          >
            Liquidate an Asset
          </Link>
          <Link
            href="/customs-auction"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Customs Auction
          </Link>
          <Link
            href="/next-chapter"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Next Chapter (Company / Project Capital)
          </Link>
          <Link
            href="/how-it-works"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/careers"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Careers
          </Link>
          <Link
            href="/contact"
            className="block py-3.5 border-b border-white/10 text-base"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            href="/investor-login"
            className="block py-3.5 border-b border-white/10 text-base font-semibold text-[#b49361]"
            onClick={() => setMobileOpen(false)}
          >
            Investor Portal Login →
          </Link>
          <Link
            href="/financial-institution-login"
            className="block py-3.5 text-base font-semibold text-[#d9c39c]"
            onClick={() => setMobileOpen(false)}
          >
            Financial Institution Login →
          </Link>
        </nav>
      )}
    </>
  );
}
