import nodemailer from "nodemailer";

export class EmailDeliveryError extends Error {}

export function emailSettingsPresent() {
  return ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "MAIL_FROM"].some((key) => !!process.env[key]);
}

export function emailConfigured() {
  return ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "MAIL_FROM"].every((key) => !!process.env[key]);
}

// Standard SMTP; no OTP vendor or per-code API. Sending allowances and any
// mailbox charges belong to the chosen email provider, not this application.
export async function sendOtpEmail(email: string, code: string) {
  if (!emailConfigured()) throw new EmailDeliveryError("Email delivery is not configured.");
  const port = Number(process.env.SMTP_PORT || "465");
  if (![465, 587].includes(port)) throw new EmailDeliveryError("Use SMTP port 465 or 587 with TLS.");
  if (!/^\d{6}$/.test(code)) throw new EmailDeliveryError("Invalid verification code.");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST!, port, secure: port === 465, requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({
      from: { name: "CityAuction", address: process.env.MAIL_FROM! },
      to: email,
      subject: "Your CityAuction verification code",
      text: `Your CityAuction verification code is ${code}.\n\nThis code expires in 10 minutes. Never share it with anyone.\n\nIf you did not request this code, you can ignore this email.`,
    });
    if (!result.accepted.length || result.rejected.length) throw new EmailDeliveryError("Email was not accepted.");
  } catch {
    // Provider errors may contain addresses or message contents. Never expose
    // them to API responses or log OTP contents.
    throw new EmailDeliveryError("Email delivery failed. Please try again shortly.");
  } finally {
    transport.close();
  }
}
