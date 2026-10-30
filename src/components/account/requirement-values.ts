import type { BuyerRequirement } from "@prisma/client";
import { asStringArray } from "@/lib/matching";
import type { RequirementValues } from "./requirement-form";

// Database row → form values (strings for inputs), for server pages to pass to
// the client form.
export function toRequirementValues(r: BuyerRequirement): RequirementValues {
  const str = (v: unknown) => (v == null ? "" : String(v));
  return {
    name: r.name,
    assetClasses: asStringArray(r.assetClasses),
    cities: asStringArray(r.cities),
    budgetRange: str(r.budgetRange),
    minBudget: r.minBudget == null ? "" : String(Number(r.minBudget)),
    maxBudget: r.maxBudget == null ? "" : String(Number(r.maxBudget)),
    objective: str(r.objective),
    locality: str(r.locality),
    minSize: r.minSize == null ? "" : String(Number(r.minSize)),
    maxSize: r.maxSize == null ? "" : String(Number(r.maxSize)),
    sizeUnit: r.sizeUnit || "SQFT",
    timeline: str(r.timeline),
    funding: str(r.funding),
    alertsEnabled: r.alertsEnabled,
    alertChannels: asStringArray(r.alertChannels),
  };
}
