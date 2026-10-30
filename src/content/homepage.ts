// Homepage copy and destinations live together; every category uses a real
// marketplace filter, and service cards link to an existing public desk.
export const HOME_ASSETS = [
  { value: "RESIDENTIAL", title: "Residential", description: "Flats, houses and villas.", icon: "Home" },
  { value: "COMMERCIAL", title: "Commercial", description: "Offices, shops and business premises.", icon: "Building2" },
  { value: "INDUSTRIAL", title: "Industrial", description: "Factories, warehouses and industrial sites.", icon: "Factory" },
  { value: "LAND", title: "Land & plots", description: "Plots and development land.", icon: "MapPinned" },
  { value: "AGRICULTURAL", title: "Agricultural", description: "Agricultural land and related assets.", icon: "Tractor" },
  { value: "OTHER", title: "Other assets", description: "Explore other published asset categories.", icon: "Package" },
] as const;

export const HOME_SERVICES = [
  { title: "Buy an auction asset", description: "Find notices, compare opportunities and plan your next step.", href: "/auctions", link: "Browse auctions", icon: "Search" },
  { title: "Evaluate an opportunity", description: "Get help with the notice, due diligence and inspection planning.", href: "/investor-desk", link: "Investor support", icon: "ShieldCheck" },
  { title: "Sell or liquidate an asset", description: "Connect your asset with relevant buyers and investor enquiries.", href: "/liquidate-an-asset", link: "Institutional desk", icon: "Building2", anchor: "institutions" },
  { title: "Explore Customs auctions", description: "Understand the official auction process and requirements.", href: "/customs-auction", link: "Customs guidance", icon: "Package" },
  { title: "Find a business partner", description: "Discuss a business sale, project funding or joint venture.", href: "/next-chapter", link: "Explore Next Chapter", icon: "Handshake" },
  { title: "Share buying preferences", description: "Tell our team your preferred location, asset type and budget.", href: "/auction-alerts", link: "Send requirements", icon: "Target", anchor: "alerts" },
] as const;

export const HOME_STEPS = [
  { title: "Find", description: "Search by location, asset type, budget and auction channel." },
  { title: "Evaluate", description: "Read the official notice. Check title, possession, costs and deadlines." },
  { title: "Take the next step", description: "Request support or participate through the authorised auction platform." },
] as const;
