import { z } from "zod";
import { INDIAN_STATES } from "@/lib/constants";
import { safeAuctionUrl } from "@/lib/auction-detail";

const id = z.string().trim().min(1).max(191);
const text = (max = 191) => z.string().trim().max(max);
export const money = z.string().trim().transform((value) => /^(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(value) ? value.replace(/,/g, "") : value).pipe(z.string().regex(/^(?:0|[1-9]\d{0,12})(?:\.\d{1,2})?$/, "Enter an amount in rupees, using up to two decimal places."));
const optionalMoney = z.union([z.literal(""), money]).default("");
const url = text().refine((value) => Boolean(safeAuctionUrl(value)), "Use a valid HTTPS or site-relative URL.");
export const attachment = z.object({ name: text().min(1, "Enter a document name."), url,
  type: z.enum(["NOTICE", "AMENDMENT", "TERMS", "OTHER"]).default("OTHER"),
  fileSize: z.number().int().min(0).max(10 * 1024 * 1024).default(0),
  mimeType: text(100).default("application/octet-stream"), isPublic: z.boolean().default(false),
});
export const propertySchema = z.object({
  title: text().min(5, "Enter a property title of at least 5 characters."), description: text(20000).default(""), address: text(4000).min(5, "Enter the property address."),
  organizationId: id, category: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "LAND", "OTHER"]),
  locationId: z.number().int().positive().optional(), state: z.enum(INDIAN_STATES).optional(), city: text(100).optional(),
  possessionStatus: z.enum(["PHYSICAL", "SYMBOLIC", "NOT_IN_POSSESSION"]), area: optionalMoney, areaUnit: text(40).default(""), estimatedValue: optionalMoney,
  images: z.array(url.refine((value) => !value.startsWith("/api/media/") || /\.(jpg|png|webp)$/.test(value), "Choose an image rather than a PDF for property photos.")).max(20, "Use up to 20 property photos.").default([]), updatedAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (!value.locationId && (!value.state || !value.city?.trim())) context.addIssue({ code: "custom", path: ["city"], message: "Choose a location or enter a state and city." });
  if (value.area && !value.areaUnit) context.addIssue({ code: "custom", path: ["areaUnit"], message: "Provide the unit used in the notice." });
});
const date = z.string().datetime({ offset: true, message: "Enter a valid date and time in IST." });
export const auctionSchema = z.object({
  action: z.enum(["draft", "publish"]), auctionNumber: text().min(3, "Enter the notice / auction number."), propertyId: id,
  type: z.enum(["SARFAESI", "DRT", "NPA", "FORWARD", "OTHER"]),
  status: z.enum(["UPCOMING", "LIVE", "CLOSING_SOON", "CLOSED", "CANCELLED", "SOLD"]),
  reservePrice: money.refine((value) => Number(value) > 0, "Reserve price must be greater than zero."), emd: money, bidIncrement: money,
  startDateTime: date, endDateTime: date, submissionDeadline: date, inspectionDate: z.union([z.literal(""), date]).default(""),
  contactOfficerName: text().default(""), contactOfficerPhone: text(40).default(""),
  contactOfficerEmail: z.union([z.literal(""), z.string().trim().email().max(190)]).default(""),
  description: text(20000).default(""), terms: text(20000).default(""), sourceListingId: text().default(""), sourceConfirmed: z.boolean().default(false),
  propertyUpdatedAt: z.string().datetime().optional(),
  documents: z.array(attachment).max(20, "Use up to 20 auction documents.").default([]), updatedAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
  if (new Date(value.endDateTime) <= new Date(value.startDateTime)) issue("endDateTime", "The auction must end after it starts.");
  if (new Date(value.submissionDeadline) > new Date(value.endDateTime)) issue("submissionDeadline", "The submission deadline cannot follow the auction end.");
  if (value.inspectionDate && new Date(value.inspectionDate) > new Date(value.endDateTime)) issue("inspectionDate", "Inspection cannot follow the auction end.");
  if (Number(value.emd) > Number(value.reservePrice)) issue("emd", "EMD cannot exceed the reserve price.");
  if (value.action === "publish") {
    if (!value.propertyUpdatedAt) issue("propertyId", "Refresh the property choices before publishing.");
    if (value.sourceListingId.length < 3) issue("sourceListingId", "Provide the official source URL or notice reference.");
    if (!value.sourceConfirmed) issue("sourceConfirmed", "Confirm you checked the source, amounts, dates and public documents.");
    if (!value.documents.some((doc) => doc.isPublic && doc.type === "NOTICE")) issue("documents", "Attach at least one public document classified as the official notice.");
  }
});
export type PropertyInput = z.infer<typeof propertySchema>;
export type AuctionInput = z.infer<typeof auctionSchema>;
export class PublishingError extends Error { constructor(message: string, public status = 400) { super(message); } }

export function validatePublicationTime(input: AuctionInput, now = Date.now()) {
  if (input.action !== "publish") return;
  const start = new Date(input.startDateTime).getTime(), end = new Date(input.endDateTime).getTime();
  if (input.status === "UPCOMING" && start <= now) throw new PublishingError("An upcoming auction must have a future start time. Check the notice status.");
  if (["LIVE", "CLOSING_SOON"].includes(input.status) && end <= now) throw new PublishingError("An open auction must have a future end time.");
  if (input.status === "LIVE" && start > now) throw new PublishingError("A live auction cannot start in the future.");
}

export function toIstInput(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = new Date(value).getTime();
  if (!Number.isFinite(date)) return "";
  const local = new Date(date + 19_800_000).toISOString();
  return local.slice(20, 23) !== "000" ? local.slice(0, 23) : local.slice(17, 19) !== "00" ? local.slice(0, 19) : local.slice(0, 16);
}
export function fromIstInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(value)) return value;
  const result = new Date(`${value.length === 16 ? value + ":00" : value}+05:30`);
  if (!Number.isFinite(result.getTime())) return value;
  const roundTrip = new Date(result.getTime() + 19_800_000).toISOString().slice(0, value.length);
  return roundTrip === value ? result.toISOString() : value;
}
