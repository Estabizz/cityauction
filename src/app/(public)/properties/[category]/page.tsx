import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Search, CheckCircle2, ShieldAlert } from "lucide-react";
import { getAuctions } from "@/services/auction.service";
import { AuctionCard } from "@/components/auction/auction-card";
import { PROPERTY_CATEGORIES } from "@/lib/constants";

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_DETAILS: Record<
  string,
  {
    title: string;
    description: string;
    categoryType: string;
    tips: string[];
  }
> = {
  residential: {
    title: "Residential Bank Auction Properties",
    description:
      "Apartments, villas, independent houses, and row houses auctioned by Indian banks under SARFAESI Act. Acquire residential real estate at 20-35% below prevailing market prices.",
    categoryType: "RESIDENTIAL",
    tips: [
      "Check whether the property is under Physical or Symbolic possession.",
      "Verify that society maintenance and municipal property tax dues are calculated in your bidding budget.",
      "Ensure the property title has no pending high court stays or family disputes.",
    ],
  },
  commercial: {
    title: "Commercial Bank Auction Properties",
    description:
      "Grade-A office suites, retail showrooms, shops, and commercial land parcels in prime urban business centers across India.",
    categoryType: "COMMERCIAL",
    tips: [
      "Review commercial zoning permissions and occupancy certificates.",
      "Examine tenant leases if the premises are currently leased to corporate tenants.",
      "Confirm GST applicability on commercial real estate asset transfers.",
    ],
  },
  industrial: {
    title: "Industrial & Factory Bank Auction Properties",
    description:
      "Manufacturing plants, industrial sheds, warehouses, and industrial MIDC/GIDC plots with pre-installed HT electricity and cranes.",
    categoryType: "INDUSTRIAL",
    tips: [
      "Check Pollution Control Board (SPCB) clearances and consent to operate.",
      "Confirm industrial development corporation (GIDC/MIDC/KIADB) transfer and sublease charges.",
      "Ascertain status of connected heavy equipment, boilers, and transformers.",
    ],
  },
  agricultural: {
    title: "Agricultural & Farm Land Auctions",
    description:
      "Fertile farm lands, plantation estates, orchards, and agro-processing units under bank recovery auctions.",
    categoryType: "AGRICULTURAL",
    tips: [
      "Ensure you hold farmer status or eligibility as required by state land reform laws (e.g., Karnataka, Maharashtra).",
      "Verify groundwater borewell records, irrigation rights, and approach road access.",
      "Check revenue records (RTC / 7/12 extract / Patta) for clear title chain.",
    ],
  },
  land: {
    title: "Land & Plot Bank Auctions",
    description:
      "Non-agricultural open plots, residential layout plots, and industrial land parcels across major metropolitan corridors.",
    categoryType: "LAND",
    tips: [
      "Verify Non-Agricultural (NA) conversion orders and layout approvals by local town planning authority.",
      "Conduct a physical boundary survey to ensure no encroachment by adjacent landowners.",
      "Confirm availability of water supply and electricity feeder connections.",
    ],
  },
  other: {
    title: "Movable & Other Bank Auction Assets",
    description:
      "Vehicles, machinery, commodities, company going-concerns, and financial assets on public bank e-auctions.",
    tips: [
      "Inspect movable assets physically during the scheduled bank inspection window.",
      "Verify vehicle RTO registration records and road tax clearance certificates.",
      "Check custody status and warehouse storage charges.",
    ],
    categoryType: "OTHER",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const details = CATEGORY_DETAILS[category.toLowerCase()];

  if (!details) {
    return { title: "Category Not Found | CityAuction" };
  }

  return {
    title: `${details.title} | CityAuction`,
    description: details.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const key = category.toLowerCase();
  const details = CATEGORY_DETAILS[key];

  if (!details) {
    notFound();
  }

  const { data: auctions, pagination } = await getAuctions({
    category: details.categoryType,
    limit: 6,
  });

  return (
    <div className="bg-surface min-h-screen">
      {/* Category Hero */}
      <section className="bg-primary-900 text-white py-14 border-b border-primary-800">
        <div className="container-wide">
          <nav className="text-xs text-primary-300 mb-3">
            <Link href="/" className="hover:text-white">Home</Link> &gt;{" "}
            <Link href="/properties" className="hover:text-white">Categories</Link> &gt;{" "}
            <span className="text-white font-medium capitalize">{key}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">{details.title}</h1>
            <p className="text-sm md:text-base text-primary-200 mt-3 leading-relaxed">
              {details.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/auctions?category=${details.categoryType}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary-900 font-bold rounded-xl hover:bg-accent-300 transition-colors text-sm"
              >
                <Search className="h-4 w-4" />
                View All {pagination.total} Auctions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence Checklist for Category */}
      <section className="bg-white border-b border-border py-8">
        <div className="container-wide">
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Due Diligence & Bidding Tips for {details.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {details.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active Listings in this Category */}
      <section className="py-12">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Featured {details.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing top upcoming auctions sourced directly from lenders
              </p>
            </div>

            <Link
              href={`/auctions?category=${details.categoryType}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              View All ({pagination.total})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {auctions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-gray-500">
              No auctions currently available in this category. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} view="grid" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
