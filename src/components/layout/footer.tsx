import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Building2,
  Scale,
  Shield,
} from "lucide-react";
import { APP_NAME, PROPERTY_CATEGORIES } from "@/lib/constants";

const footerLinks = {
  auctions: [
    { href: "/auctions?status=UPCOMING", label: "Upcoming Auctions" },
    { href: "/auctions?type=SARFAESI", label: "SARFAESI Auctions" },
    { href: "/auctions?type=DRT", label: "DRT Auctions" },
    { href: "/auctions?type=NPA", label: "NPA Auctions" },
    { href: "/organizations", label: "Banks & Institutions" },
  ],
  categories: PROPERTY_CATEGORIES.map((cat) => ({
    href: `/properties/${cat.slug}`,
    label: cat.label,
  })),
  resources: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/resources/blog", label: "Blog & Articles" },
    { href: "/resources/guides", label: "Bidder Guides" },
    { href: "/resources/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact Us" },
  ],
  legal: [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100 mt-auto">
      {/* CTA Strip */}
      <div className="bg-primary-700">
        <div className="container-wide py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Ready to find your next investment?
            </h3>
            <p className="text-primary-200 text-sm mt-1">
              Register now to save properties, receive alerts, and participate
              in auctions.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary-900 font-semibold rounded-lg hover:bg-accent-300 transition-colors whitespace-nowrap"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-900 font-bold text-lg">C</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6 max-w-sm">
              India&apos;s trusted platform for discovering and participating in
              bank auction properties. Access verified SARFAESI, DRT, and NPA
              auctions from 300+ financial institutions across all states.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+911244302020"
                className="flex items-center gap-2.5 text-sm text-primary-200 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +91-124-4302020
              </a>
              <a
                href="mailto:support@cityauction.com"
                className="flex items-center gap-2.5 text-sm text-primary-200 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                support@cityauction.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-primary-300">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Gurugram, Haryana, India</span>
              </div>
            </div>
          </div>

          {/* Auctions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Auctions
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.auctions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust signals */}
      <div className="border-t border-primary-800">
        <div className="container-wide py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-primary-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>300+ Partner Banks</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>SARFAESI Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="container-wide py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
