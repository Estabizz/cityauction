// Public widget configuration; the client ID is not a password or API secret.
export const PHONE_EMAIL_CLIENT_ID = process.env.NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID || "11716953482701480507";
export const PHONE_EMAIL_ENABLED = process.env.NEXT_PUBLIC_EMAIL_OTP_PROVIDER !== "smtp";
