import { z } from "zod";
import { BUYER_CATEGORIES } from "./buyer";
const optionalText = (max: number) => z.string().trim().max(max).default("");
export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().email().max(191)]),
  phone: optionalText(20).refine((value) => !value || (/^\+?[0-9 ()-]{10,20}$/.test(value) && value.replace(/\D/g, "").length >= 10), "Enter a valid contact phone number with at least 10 digits."),
  accountType: z.enum(["INDIVIDUAL", "ORGANIZATION"]), companyName: optionalText(191),
  gstNumber: optionalText(15).transform((value) => value.toUpperCase()).refine((value) => !value || /^[0-9A-Z]{15}$/.test(value), "GSTIN must contain 15 letters and digits, or leave it blank."),
  buyerCategory: z.union([z.literal(""), z.enum(BUYER_CATEGORIES.map((item) => item.value) as [string, ...string[]])]),
  address: optionalText(191), city: optionalText(80), state: optionalText(80), pincode: optionalText(16).refine((value) => !value || /^[a-zA-Z0-9 -]{2,16}$/.test(value), "Enter a valid postal code."),
  updatedAt: z.string().datetime(),
}).superRefine((value, context) => {
  if (value.accountType === "ORGANIZATION" && value.companyName.length < 2) context.addIssue({ code: "custom", path: ["companyName"], message: "Enter the company or organisation name." });
});
export type EditableProfile = z.input<typeof profileSchema>;
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(128, "Current password is too long."),
  newPassword: z.string().min(8, "Use at least 8 characters.").max(128, "Use no more than 128 characters."),
  confirmPassword: z.string().min(1, "Confirm your new password.").max(128),
}).superRefine((value, context) => {
  if (value.newPassword !== value.confirmPassword) context.addIssue({ code: "custom", path: ["confirmPassword"], message: "The new passwords do not match." });
  if (value.currentPassword === value.newPassword) context.addIssue({ code: "custom", path: ["newPassword"], message: "Choose a different password from your current one." });
});
