import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { CITY_PAGES } from "@/content/cities";
import { cityPath, getStateGroups, statePath } from "@/content/cities/states";
import { PageHeader, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Live pages" };

// Main public pages and the forms on them (the form's lead source in brackets).
const MAIN_PAGES: { href: string; label: string; form?: string }[] = [
  { href: "/", label: "Homepage", form: "homepage" },
  { href: "/locations", label: "Locations hub" },
  { href: "/auctions", label: "Auctions" },
  { href: "/properties", label: "Properties" },
  { href: "/auction-alerts", label: "Auction alerts", form: "auction-alerts" },
  { href: "/investor-desk", label: "Investor desk", form: "investor-desk" },
  { href: "/liquidate-an-asset", label: "Liquidate an asset", form: "liquidate-asset" },
  { href: "/institutional-services", label: "Institutional services", form: "institutional-mandate" },
  { href: "/next-chapter", label: "Next chapter", form: "next-chapter" },
  { href: "/customs-auction", label: "Customs auctions" },
  { href: "/careers", label: "Careers", form: "career" },
  { href: "/contact", label: "Contact us", form: "contact" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/resources", label: "Resources" },
  { href: "/resources/faqs", label: "FAQs" },
  { href: "/buyer/access", label: "Buyer & Investor Access (sign up, callback, login)" },
  { href: "/login", label: "Log in" },
];

const LEGAL_PAGES = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/risk-disclosure", label: "Risk disclosure" },
  { href: "/verified-information-policy", label: "Verified information policy" },
];

function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 font-semibold text-[#182129] hover:text-[#7a5f33]">
      {children}
      <ExternalLink className="h-3 w-3 text-[#b49361] opacity-60 group-hover:opacity-100" />
    </a>
  );
}

export default function AdminSitePage() {
  const groups = getStateGroups();
  const localities = CITY_PAGES.reduce((sum, page) => sum + page.localities.items.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title="Live pages"
        description={`${CITY_PAGES.length} city pages across ${groups.length} state${groups.length === 1 ? "" : "s"} are published, covering ${localities} localities. Links open the public site in a new tab.`}
      />

      <Panel title="Location pages">
        <div className="divide-y divide-[#f3efe8]">
          {groups.map((group) => (
            <div key={group.slug} className="px-4 py-4 sm:px-5">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <PageLink href={statePath(group.state)}>
                  <span className="font-serif-heading text-xl">{group.state}</span>
                </PageLink>
                <span className="text-xs text-[#6f777d]">
                  {group.cities.length} cit{group.cities.length === 1 ? "y" : "ies"} · {statePath(group.state)}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.cities.map((page) => (
                  <li key={page.slug} className="rounded-xl border border-[#efe9df] bg-[#fbf9f5] px-3 py-2.5 text-sm">
                    <PageLink href={cityPath(page)}>{page.city}</PageLink>
                    <span className="block text-xs text-[#6f777d]">
                      {page.localities.items.length} localities · {cityPath(page)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Main pages" className="lg:col-span-2">
          <ul className="grid grid-cols-1 gap-x-6 px-4 py-3 sm:grid-cols-2 sm:px-5">
            {MAIN_PAGES.map((p) => (
              <li key={p.href} className="flex items-baseline justify-between gap-2 border-b border-[#f3efe8] py-2 text-sm last:border-0">
                <PageLink href={p.href}>{p.label}</PageLink>
                {p.form && (
                  <a href={`/admin/leads?source=${p.form}`} className="text-xs text-[#7a5f33] hover:underline">
                    leads
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Legal pages">
          <ul className="px-4 py-3 sm:px-5">
            {LEGAL_PAGES.map((p) => (
              <li key={p.href} className="border-b border-[#f3efe8] py-2 text-sm last:border-0">
                <PageLink href={p.href}>{p.label}</PageLink>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
