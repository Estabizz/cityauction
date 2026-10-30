import { z } from "zod";
import { POST as sendOtp } from "../otp/send/route";
import { emailSchema, validationError } from "../_lib";

// Compatibility endpoint: recovery is an email OTP, not a manual reset lead.
export async function POST(req: Request) {
  const parsed = z.object({ email: emailSchema }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  return sendOtp(new Request(req.url, {
    method: "POST", headers: req.headers,
    body: JSON.stringify({ email: parsed.data.email, purpose: "reset-password" }),
  }));
}
