import Link from "next/link";
import type { Metadata } from "next";
import { Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { getOrganizations } from "@/services/organization.service";

export const metadata: Metadata = {
  title: "Participating Banks & Financial Institutions | CityAuction",
  description:
    "Explore 300+ Indian public and private sector banks, Asset Reconstruction Companies (ARCs), and DRTs conducting authorized property auctions.",
};

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">Banks & Institutions</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">
            Partner Banks & Institutions
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Discover verified auction properties directly from India&apos;s leading public sector banks,
            private commercial banks, Asset Reconstruction Companies (ARCs), and Debts Recovery Tribunals.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-card hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-14 h-14 rounded-xl object-cover border border-border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                      <Building2 className="h-7 w-7" />
                    </div>
                  )}
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700">
                    {org.type}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2">{org.name}</h2>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  Authorized lender/institution conducting SARFAESI Act, DRT, and NPA e-auctions.
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400 block">Available Auctions</span>
                  <span className="font-bold text-primary text-sm">{org.activeAuctionCount} Properties</span>
                </div>

                <Link
                  href={`/auctions?organization=${encodeURIComponent(org.name)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-colors"
                >
                  View Auctions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 bg-primary-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              Institutional Credibility
            </div>
            <h3 className="text-xl font-bold">Are you a Bank, ARC, or Financial Institution?</h3>
            <p className="text-sm text-primary-200 mt-2 leading-relaxed">
              List your SARFAESI and DRT auctions on CityAuction to reach over 50,000+ verified bidders across India.
            </p>
          </div>
          <Link
            href="/contact?subject=Institutional%20Partnership"
            className="px-6 py-3 bg-accent text-primary-900 font-bold text-sm rounded-xl hover:bg-accent-300 transition-colors whitespace-nowrap"
          >
            Partner with Us
          </Link>
        </div>
      </div>
    </div>
  );
}
