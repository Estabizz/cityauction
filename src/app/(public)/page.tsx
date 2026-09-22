import Link from "next/link";
import {
  Search,
  ArrowRight,
  Home,
  Building2,
  Factory,
  Tractor,
  Map,
  Package,
  CheckCircle2,
  FileSearch,
  UserCheck,
  Gavel,
  Trophy,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import { PROPERTY_CATEGORIES, BUDGET_RANGES } from "@/lib/constants";
import { HeroSearch } from "@/components/search/hero-search";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  RESIDENTIAL: <Home className="h-7 w-7" />,
  COMMERCIAL: <Building2 className="h-7 w-7" />,
  INDUSTRIAL: <Factory className="h-7 w-7" />,
  AGRICULTURAL: <Tractor className="h-7 w-7" />,
  LAND: <Map className="h-7 w-7" />,
  OTHER: <Package className="h-7 w-7" />,
};

const TOP_CITIES = [
  { name: "Mumbai", state: "Maharashtra", count: 2450 },
  { name: "Delhi", state: "Delhi", count: 1890 },
  { name: "Bangalore", state: "Karnataka", count: 1340 },
  { name: "Chennai", state: "Tamil Nadu", count: 980 },
  { name: "Hyderabad", state: "Telangana", count: 870 },
  { name: "Ahmedabad", state: "Gujarat", count: 760 },
  { name: "Pune", state: "Maharashtra", count: 720 },
  { name: "Kolkata", state: "West Bengal", count: 650 },
  { name: "Jaipur", state: "Rajasthan", count: 540 },
  { name: "Lucknow", state: "Uttar Pradesh", count: 480 },
  { name: "Chandigarh", state: "Chandigarh", count: 320 },
  { name: "Indore", state: "Madhya Pradesh", count: 290 },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: <FileSearch className="h-8 w-8" />,
    title: "Search & Discover",
    description:
      "Browse thousands of verified bank auction properties. Filter by location, type, price range, and auction date.",
  },
  {
    step: 2,
    icon: <UserCheck className="h-8 w-8" />,
    title: "Register & Verify",
    description:
      "Create your account, complete KYC verification, and submit required documents to become an eligible bidder.",
  },
  {
    step: 3,
    icon: <Gavel className="h-8 w-8" />,
    title: "Submit EMD & Bid",
    description:
      "Pay the Earnest Money Deposit for your chosen auction, then participate in the bidding process online.",
  },
  {
    step: 4,
    icon: <Trophy className="h-8 w-8" />,
    title: "Win & Own",
    description:
      "If you're the highest bidder, complete the payment process and take possession of your new property.",
  },
];

const STATS = [
  { value: "12,000+", label: "Properties Listed" },
  { value: "300+", label: "Partner Banks" },
  { value: "36", label: "States & UTs" },
  { value: "50,000+", label: "Registered Users" },
];

export default function HomePage() {
  return (
    <>
      {/* ============== HERO SECTION ============== */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-wide relative z-10 py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Discover Verified{" "}
              <span className="text-accent">Bank Auction</span>{" "}
              Properties
            </h1>
            <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto leading-relaxed">
              Search SARFAESI, DRT, and NPA auction properties from 300+
              financial institutions across India. Find residential, commercial,
              and industrial properties at competitive prices.
            </p>
          </div>

          {/* Search Interface */}
          <HeroSearch />

          {/* Stats ribbon */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-300 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BROWSE BY CATEGORY ============== */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Browse by Property Type
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Explore auction properties across all major categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROPERTY_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/properties/${category.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-white hover:border-primary-200 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {CATEGORY_ICONS[category.value]}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BROWSE BY CITY ============== */}
      <section className="section-padding bg-surface">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Popular Cities
              </h2>
              <p className="text-gray-500 mt-2">
                Find auction properties in major Indian cities
              </p>
            </div>
            <Link
              href="/auctions"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
            >
              View all locations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TOP_CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/auctions?city=${encodeURIComponent(city.name)}`}
                className="group flex flex-col p-4 rounded-xl border border-border bg-white hover:border-primary-200 hover:shadow-card transition-all"
              >
                <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {city.name}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {city.state}
                </span>
                <span className="text-xs text-primary font-medium mt-2">
                  {city.count.toLocaleString("en-IN")} properties
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              View all locations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Participate in bank auctions in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-accent text-primary-900 rounded-full flex items-center justify-center text-xs font-bold z-10">
                  {item.step}
                </div>
                <div className="pt-6 pb-4 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== WHY CHOOSE US ============== */}
      <section className="section-padding bg-primary-800">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Why Choose {process.env.NEXT_PUBLIC_APP_NAME || "CityAuction"}
            </h2>
            <p className="text-primary-300 mt-2 max-w-lg mx-auto">
              A trusted platform built for serious property investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Verified Listings",
                description:
                  "Every property listing is sourced directly from authorized banks and financial institutions.",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Below Market Prices",
                description:
                  "Auction properties are typically available at 20-40% below market value, offering exceptional investment returns.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Real-time Updates",
                description:
                  "Receive instant notifications about new listings, auction dates, and bidding status updates.",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "End-to-End Support",
                description:
                  "From property discovery to post-auction documentation, we guide you through every step.",
              },
              {
                icon: <Gavel className="h-6 w-6" />,
                title: "Transparent Bidding",
                description:
                  "Our secure online bidding platform ensures fair, transparent, and auditable auction processes.",
              },
              {
                icon: <Building2 className="h-6 w-6" />,
                title: "300+ Institutions",
                description:
                  "Access auctions from all major public and private sector banks, NBFCs, and ARCs across India.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 rounded-xl bg-primary-700/50 border border-primary-600/30"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA SECTION ============== */}
      <section className="section-padding bg-surface">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Start Your Property Search Today
            </h2>
            <p className="text-gray-500 mt-3 mb-8 max-w-lg mx-auto">
              Join thousands of investors who discover and bid on verified bank
              auction properties through our platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auctions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Search className="h-5 w-5" />
                Browse Auctions
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary-900 font-semibold rounded-lg hover:bg-accent-300 transition-colors"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
