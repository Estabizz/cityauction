export const HOME_ENQUIRY_TYPES = [
  { value: "Buying / Investing in Auction Asset", label: "Buy an auction asset" },
  { value: "Due Diligence / Investor Support", label: "Due diligence" },
  { value: "Personalised Auction Alert", label: "Buying preferences" },
  { value: "Liquidating an Asset", label: "Sell an asset" },
  { value: "Customs Auction", label: "Customs auctions" },
  { value: "Company Sale / Investor / Promoter Exit", label: "Business sale" },
  { value: "Developer Project Sale / JV / Investor", label: "Project funding or JV" },
  { value: "Institutional Partnership", label: "Institutional services" },
  { value: "Other", label: "Other" },
] as const;

export type HomeEnquiry = { name: string; phone: string; email: string; subject: string; message: string };
export function homeEnquiryErrors(value: HomeEnquiry) {
  const errors: Partial<Record<keyof HomeEnquiry, string>> = {};
  if (value.name.trim().length < 2 || value.name.trim().length > 150) errors.name = "Enter your name (2–150 characters).";
  if (!/^\+?[\d\s\-()]{7,20}$/.test(value.phone.trim()) || value.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid mobile number.";
  if (value.email.trim() && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) || value.email.trim().length > 190)) errors.email = "Enter a valid email address.";
  if (!HOME_ENQUIRY_TYPES.some((item) => item.value === value.subject)) errors.subject = "Choose what you need help with.";
  if (value.message.length > 5000) errors.message = "Keep your message under 5,000 characters.";
  return errors;
}
