import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { emailLinkPurpose, OtpError } from "@/lib/otp";
import { createPhoneEmailIntent, PHONE_EMAIL_COOKIE } from "@/lib/phone-email";
import { isSameOriginRequest } from "@/lib/same-origin";
import { tooManyRequests } from "@/lib/rate-limit";
import { clientIp, emailSchema, jsonError, validationError } from "../../_lib";

const schema = z.object({ email: emailSchema, purpose: z.enum(["register", "login", "reset-password", "link"]) });
export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  if (tooManyRequests(`phone-email-start:${clientIp(req) || "unknown"}`, 30, 15 * 60_000)) return jsonError("Too many verification requests. Please try again later.", 429);
  try {
    const { email, purpose } = parsed.data;
    const session = purpose === "link" ? await getCurrentUser() : null;
    if (purpose === "link" && !session) return jsonError("Please sign in.", 401);
    const { token, nonce } = await createPhoneEmailIntent(email, purpose === "link" ? emailLinkPurpose(session!.userId) : purpose);
    const response = NextResponse.json({ success: true, intentId: nonce }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(PHONE_EMAIL_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 600, path: "/" });
    return response;
  } catch (error) {
    return jsonError(error instanceof OtpError ? error.message : "Email verification could not start.", 503);
  }
}
