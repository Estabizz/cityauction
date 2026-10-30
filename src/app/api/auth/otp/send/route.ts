import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { tooManyRequests } from "@/lib/rate-limit";
import { OTP_RESEND_SECONDS, OtpError, emailLinkPurpose, sendOtp } from "@/lib/otp";
import { DB_UNAVAILABLE, clientIp, emailSchema, jsonError, validationError } from "../../_lib";

const schema = z.object({ email: emailSchema, purpose: z.enum(["register", "login", "link", "reset-password"]) });
const noStore = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { email, purpose } = parsed.data;
  if (tooManyRequests(`otp-send:${clientIp(req) || "unknown"}`, 60, 60 * 60 * 1000))
    return jsonError("Too many code requests. Please try again later.", 429);

  try {
    const owner = await db.user.findUnique({ where: { email }, select: { id: true, isActive: true, deletedAt: true, isEmailVerified: true } });
    if (purpose === "reset-password" && (!owner || !owner.isActive || owner.deletedAt || !owner.isEmailVerified)) {
      return NextResponse.json({ success: true, challengeId: randomUUID(), email,
        message: "If this email has an eligible account, a code has been sent.", resendIn: OTP_RESEND_SECONDS }, { headers: noStore });
    }
    // Registration proof can also sign an eligible existing user in, without
    // creating a duplicate account. Do not disclose account existence here.
    if (purpose === "login") {
      if (!owner) return jsonError("We couldn't find an account with this email. Please create one.", 404);
      if (!owner.isActive || owner.deletedAt) return jsonError("This account has been disabled. Please contact support.", 403);
      if (!owner.isEmailVerified) return jsonError("Verify this email using email/password sign-in, or contact support to recover your existing account.", 403);
    }
    let otpPurpose = purpose === "link" ? emailLinkPurpose("") : purpose;
    if (purpose === "link") {
      const session = await getCurrentUser();
      if (!session) return jsonError("Please sign in.", 401);
      if (owner && owner.id !== session.userId) return jsonError("This email is already linked to another account.", 409);
      otpPurpose = emailLinkPurpose(session.userId);
    }
    const { challengeId, devCode } = await sendOtp(email, otpPurpose, clientIp(req));
    return NextResponse.json({ success: true, challengeId, email, resendIn: OTP_RESEND_SECONDS, devCode,
      message: purpose === "reset-password" ? "If this email has an eligible account, a code has been sent." : "Code sent." }, { headers: noStore });
  } catch (error) {
    if (error instanceof OtpError) {
      const response = jsonError(error.message, error.status);
      if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
      return response;
    }
    console.error("[auth/otp/send]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
