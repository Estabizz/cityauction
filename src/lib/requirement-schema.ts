import { z } from "zod";
import { db } from "./db";
import {
  ALERT_CHANNELS,
  ASSET_CLASSES,
  BUDGET_RANGES,
  FUNDING,
  OBJECTIVES,
  SIZE_UNITS,
  TIMELINES,
  citiesLabel,
  labelFor,
} from "./buyer";

// Validation for a buyer requirement (Requirements §4). Every field is optional.

const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [string, ...string[]];
const optionalEnum = <T extends readonly { value: string }[]>(list: T) =>
  z
    .union([z.literal(""), z.enum(values(list))])
    .nullish()
    .transform((v) => v || null);
const optionalAmount = (label: string) =>
  z
    .union([z.literal(""), z.coerce.number({ error: `${label} must be a number.` }).nonnegative(`${label} can't be negative.`).max(1e13, `${label} is too large.`)])
    .nullish()
    .transform((v) => (v === "" || v == null ? null : v));

export const requirementSchema = z
  .object({
    name: z.string().trim().max(120, "Name is too long.").optional().default(""),
    assetClasses: z.array(z.enum(values(ASSET_CLASSES))).max(ASSET_CLASSES.length).default([]),
    cities: z.array(z.string().trim().min(1).max(80)).max(30, "Choose up to 30 cities.").default([]),
    budgetRange: optionalEnum(BUDGET_RANGES),
    minBudget: optionalAmount("Minimum budget"),
    maxBudget: optionalAmount("Maximum budget"),
    objective: optionalEnum(OBJECTIVES),
    locality: z.string().trim().max(200, "Locality is too long.").nullish().transform((v) => v || null),
    minSize: optionalAmount("Minimum size"),
    maxSize: optionalAmount("Maximum size"),
    sizeUnit: optionalEnum(SIZE_UNITS),
    timeline: optionalEnum(TIMELINES),
    funding: optionalEnum(FUNDING),
    alertsEnabled: z.boolean().default(true),
    alertChannels: z.array(z.enum(values(ALERT_CHANNELS))).default([]),
  })
  .refine((r) => r.minBudget == null || r.maxBudget == null || r.minBudget <= r.maxBudget, {
    message: "Minimum budget can't be more than the maximum.",
  })
  .refine((r) => r.minSize == null || r.maxSize == null || r.minSize <= r.maxSize, {
    message: "Minimum size can't be more than the maximum.",
  })
  .transform((r) => ({
    ...r,
    cities: [...new Set(r.cities)],
    sizeUnit: r.minSize != null || r.maxSize != null ? r.sizeUnit || "SQFT" : null,
  }));

export type RequirementInput = z.input<typeof requirementSchema>;
export type RequirementData = z.output<typeof requirementSchema>;

// Email alerts need an email address on the account.
export async function withAllowedChannels<T extends { alertChannels: string[] }>(data: T, userId: string) {
  if (!data.alertChannels.includes("EMAIL")) return data;
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  return user?.email ? data : { ...data, alertChannels: data.alertChannels.filter((c) => c !== "EMAIL") };
}

// "Industrial, Land · Surat, Vadodara" when the buyer didn't name it.
export function defaultRequirementName(r: Pick<RequirementData, "assetClasses" | "cities">) {
  const classes = r.assetClasses.map((c) => labelFor(ASSET_CLASSES, c));
  const what = classes.length ? (classes.length > 2 ? `${classes.slice(0, 2).join(", ")} +${classes.length - 2}` : classes.join(", ")) : "Any asset";
  const where = r.cities.length > 2 ? `${r.cities.slice(0, 2).join(", ")} +${r.cities.length - 2}` : citiesLabel(r.cities);
  return `${what} · ${where}`.slice(0, 120);
}
