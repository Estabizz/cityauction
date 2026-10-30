// Mobile numbers are stored as "+<country code><number>", e.g. "+919876543210".

export const COUNTRY_CODES = [
  { value: "91", label: "+91 India" },
  { value: "971", label: "+971 UAE" },
  { value: "1", label: "+1 USA / Canada" },
  { value: "44", label: "+44 UK" },
  { value: "65", label: "+65 Singapore" },
  { value: "61", label: "+61 Australia" },
] as const;

// Returns the normalised number, or null if it isn't a plausible mobile.
export function normalizeMobile(countryCode: string, number: string): string | null {
  const cc = countryCode.replace(/\D/g, "");
  let digits = number.replace(/\D/g, "");
  if (!cc) return null;
  // Pasted with the country code or a leading trunk 0.
  if (digits.startsWith(cc) && digits.length > 10) digits = digits.slice(cc.length);
  digits = digits.replace(/^0+/, "");

  if (cc === "91") return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
  return /^\d{6,14}$/.test(digits) ? `+${cc}${digits}` : null;
}

export function formatMobile(mobile: string | null | undefined) {
  if (!mobile) return "";
  const m = mobile.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : mobile;
}

// "+91 ••••••• 210" for messages that shouldn't show the whole number.
export function maskMobile(mobile: string) {
  return mobile.length > 10 ? `${mobile.slice(0, -10)} ••••••• ${mobile.slice(-3)}` : mobile;
}
