// Options for "Request a callback" on the buyer access page.

export const CALLBACK_WINDOWS = [
  { value: "MORNING", label: "10:00 AM – 1:00 PM IST" },
  { value: "AFTERNOON", label: "1:00 PM – 4:00 PM IST" },
  { value: "EVENING", label: "4:00 PM – 7:00 PM IST" },
] as const;

export const CALLBACK_INTERESTS = [
  { value: "REGISTER", label: "Register me as a Buyer / Investor" },
  { value: "FIND_PROPERTIES", label: "Find auction properties" },
  { value: "INDUSTRIAL_COMMERCIAL", label: "Industrial / Commercial acquisitions" },
  { value: "INSPECTION", label: "Property inspection / Due diligence" },
  { value: "STRATEGIC", label: "Business / Strategic investment" },
] as const;
