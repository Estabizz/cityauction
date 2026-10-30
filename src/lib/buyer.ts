// Buyer & investor portal options (Developer Requirements v1.0, sections 3–4).
// Plain module with no server imports, so forms and API routes share one list.

export const BUYER_CATEGORIES = [
  { value: "INDIVIDUAL_BUYER", label: "Individual Buyer" },
  { value: "BUSINESS_BUYER", label: "Business / Corporate Buyer" },
  { value: "INVESTOR", label: "Investor" },
  { value: "BROKER", label: "Broker / Property Consultant" },
  { value: "OTHER_PROFESSIONAL", label: "Other Professional" },
] as const;

export type BuyerCategoryValue = (typeof BUYER_CATEGORIES)[number]["value"];

// categoryTypes / auctionTypes say which listings each class matches. Classes
// with neither have no listings data yet, so they never produce matches.
export const ASSET_CLASSES = [
  { value: "BANK_AUCTION", label: "Bank auction", auctionTypes: ["SARFAESI", "DRT", "NPA"] },
  { value: "INDUSTRIAL", label: "Industrial", categoryTypes: ["INDUSTRIAL"] },
  { value: "COMMERCIAL", label: "Commercial", categoryTypes: ["COMMERCIAL"] },
  { value: "RESIDENTIAL", label: "Residential", categoryTypes: ["RESIDENTIAL"] },
  { value: "LAND", label: "Land", categoryTypes: ["LAND", "AGRICULTURAL"] },
  { value: "WAREHOUSE", label: "Warehouse / Logistics", categoryTypes: ["INDUSTRIAL", "COMMERCIAL"] },
  { value: "PLANT_MACHINERY", label: "Plant & Machinery" },
  { value: "CUSTOMS", label: "Customs" },
  { value: "DISTRESSED_COMPANY", label: "Distressed Company" },
  { value: "IBC_LIQUIDATION", label: "IBC / Liquidation" },
] as const satisfies readonly { value: string; label: string; categoryTypes?: readonly string[]; auctionTypes?: readonly string[] }[];

const LAKH = 100_000;
const CRORE = 10_000_000;

export const BUDGET_RANGES = [
  { value: "LT_25L", label: "Below ₹25 L", max: 25 * LAKH },
  { value: "25L_50L", label: "₹25 – 50 L", min: 25 * LAKH, max: 50 * LAKH },
  { value: "50L_1CR", label: "₹50 L – ₹1 Cr", min: 50 * LAKH, max: CRORE },
  { value: "1CR_5CR", label: "₹1 – 5 Cr", min: CRORE, max: 5 * CRORE },
  { value: "5CR_10CR", label: "₹5 – 10 Cr", min: 5 * CRORE, max: 10 * CRORE },
  { value: "10CR_25CR", label: "₹10 – 25 Cr", min: 10 * CRORE, max: 25 * CRORE },
  { value: "25CR_100CR", label: "₹25 – 100 Cr", min: 25 * CRORE, max: 100 * CRORE },
  { value: "GT_100CR", label: "Above ₹100 Cr", min: 100 * CRORE },
] as const satisfies readonly { value: string; label: string; min?: number; max?: number }[];

export const OBJECTIVES = [
  { value: "INVESTMENT", label: "Investment / Resale" },
  { value: "OWN_USE", label: "Own Use" },
  { value: "BUSINESS_EXPANSION", label: "Business Expansion" },
  { value: "STRATEGIC_ACQUISITION", label: "Strategic Acquisition" },
  { value: "FOR_CLIENT", label: "For Client / Broker" },
] as const;

export const TIMELINES = [
  { value: "IMMEDIATE", label: "Immediate" },
  { value: "1_3M", label: "1–3 months" },
  { value: "3_6M", label: "3–6 months" },
  { value: "6_12M", label: "6–12 months" },
  { value: "EXPLORING", label: "Exploring" },
] as const;

export const FUNDING = [
  { value: "OWN_FUNDS", label: "Own funds" },
  { value: "LOAN", label: "Loan / Finance" },
  { value: "COMBINATION", label: "Combination" },
  { value: "UNDECIDED", label: "Undecided" },
] as const;

export const SIZE_UNITS = [
  { value: "SQFT", label: "sq ft" },
  { value: "SQM", label: "sq m" },
] as const;

export const ALERT_CHANNELS = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "WHATSAPP", label: "WhatsApp" },
] as const;

export type AlertChannel = (typeof ALERT_CHANNELS)[number]["value"];

export const PAN_INDIA = "PAN_INDIA";

// Suggestions for the city picker; buyers can also type any other city.
export const CITY_SUGGESTIONS = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bharuch", "Ankleshwar", "Jamnagar", "Bhavnagar",
  "Gandhinagar", "Gandhidham", "Mehsana", "Vapi", "Mumbai", "Thane", "Navi Mumbai", "Pune",
  "Nashik", "Nagpur", "Delhi", "Gurugram", "Noida", "Ghaziabad", "Faridabad", "Bengaluru",
  "Chennai", "Hyderabad", "Kolkata", "Jaipur", "Indore", "Bhopal", "Lucknow", "Kanpur",
  "Chandigarh", "Ludhiana", "Coimbatore", "Kochi", "Visakhapatnam", "Patna", "Bhubaneswar", "Goa",
];

// Listings may use either name for these cities.
export const CITY_ALIASES: Record<string, string[]> = {
  bengaluru: ["Bangalore"],
  bangalore: ["Bengaluru"],
  gurugram: ["Gurgaon"],
  gurgaon: ["Gurugram"],
  mumbai: ["Bombay"],
  vadodara: ["Baroda"],
  baroda: ["Vadodara"],
  kolkata: ["Calcutta"],
  chennai: ["Madras"],
};

export function withCityAliases(cities: string[]) {
  return [...new Set(cities.flatMap((c) => [c, ...(CITY_ALIASES[c.toLowerCase()] ?? [])]))];
}

export function labelFor(list: readonly { value: string; label: string }[], value: string | null | undefined) {
  return list.find((o) => o.value === value)?.label ?? value ?? "";
}

export function citiesLabel(cities: string[]) {
  if (cities.includes(PAN_INDIA)) return "Pan-India";
  return cities.length ? cities.join(", ") : "Any city";
}

// Precise budget wins over the range when given.
export function budgetBounds(r: { budgetRange?: string | null; minBudget?: number | null; maxBudget?: number | null }) {
  const range = BUDGET_RANGES.find((b) => b.value === r.budgetRange) as { min?: number; max?: number } | undefined;
  return {
    min: r.minBudget ?? range?.min ?? null,
    max: r.maxBudget ?? range?.max ?? null,
  };
}

export function formatInr(amount: number) {
  if (amount >= CRORE) return `₹${+(amount / CRORE).toFixed(2)} Cr`;
  if (amount >= LAKH) return `₹${+(amount / LAKH).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function budgetLabel(r: Parameters<typeof budgetBounds>[0]) {
  if (r.minBudget == null && r.maxBudget == null) {
    return r.budgetRange ? labelFor(BUDGET_RANGES, r.budgetRange) : "Any budget";
  }
  const { min, max } = budgetBounds(r);
  if (min != null && max != null) return `${formatInr(min)} – ${formatInr(max)}`;
  if (min != null) return `From ${formatInr(min)}`;
  return `Up to ${formatInr(max!)}`;
}
