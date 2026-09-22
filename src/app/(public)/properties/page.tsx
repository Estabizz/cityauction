import Link from "next/link";
import type { Metadata } from "next";
import { Home, Building2, Factory, Tractor, Map, Package, ArrowRight } from "lucide-react";
import { PROPERTY_CATEGORIES } from "@/lib/constants";
import { getCategories } from "@/services/property.service";

export const metadata: Metadata = {
  title: "Property Categories | CityAuction",
  description:
    "Explore bank auction properties categorized into Residential, Commercial, Industrial, Agricultural, and Land plots across India.",
};

const ICONS: Record<string, React.ReactNode> = {
  RESIDENTIAL: <Home className="h-8 w-8" />,
  COMMERCIAL: <Building2 className="h-8 w-8" />,
  INDUSTRIAL: <Factory className="h-8 w-8" />,
  AGRICULTURAL: <Tractor className="h-8 w-8" />,
  LAND: <Map className="h-8 w-8" />,
  OTHER: <Package className="h-8 w-8" />,
};

export default async function PropertiesOverviewPage() {
  const categories = await getCategories();

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        <div className="max-w-3xl mb-10">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">Property Categories</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">
            Auction Properties by Category
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Choose from residential apartments, corporate office spaces, manufacturing plants,
            farmlands, and open development plots on public bank auctions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/properties/${cat.slug}`}
              className="group bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-card hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {ICONS[cat.type] || <Package className="h-8 w-8" />}
                </div>

                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {cat.name} Properties
                </h2>

                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Discover verified {cat.name.toLowerCase()} assets under SARFAESI and DRT recovery proceedings.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">
                  {cat.auctionCount} Active Auctions
                </span>
                <span className="font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
