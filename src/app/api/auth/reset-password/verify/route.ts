import { NextResponse } from "next/server";
import { z } from "zod";
import { emailVerificationFields } from "@/lib/email-verification";
import { OtpError } from "@/lib/otp";
import { isSameOriginRequest } from "@/lib/same-origin";
import { tooManyRequests } from "@/lib/rate-limit";
import { issuePasswordResetProof, PASSWORD_RESET_COOKIE, PASSWORD_RESET_TTL_SECONDS } from "@/lib/password-reset-proof";
import { clientIp, DB_UNAVAILABLE, emailSchema, jsonError, validationError } from "../../_lib";

const schema = z.object({ email: emailSchema, ...emailVerificationFields });

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  if (tooManyRequests(`reset-verify:${clientIp(req) || "unknown"}`, 30, 15 * 60_000)) return jsonError("Too many attempts. Please try again later.", 429);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  try {
    const { token, browserSecret } = await issuePasswordResetProof(parsed.data.email, parsed.data);
    const response = NextResponse.json({ success: true, resetToken: token, expiresIn: PASSWORD_RESET_TTL_SECONDS }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(PASSWORD_RESET_COOKIE, browserSecret, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: PASSWORD_RESET_TTL_SECONDS, path: "/" });
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    console.error("[auth/reset-password/verify]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
