import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { OtpError, passwordLoginPurpose, verifyOtp } from "@/lib/otp";
import { safeNextPath } from "@/components/account/safe-next";
import { DB_UNAVAILABLE, emailSchema, homeFor, jsonError, setSessionCookie, toSessionPayload, userWithRoles, validationError } from "../_lib";

// password-login codes can only be issued by /api/auth/login after the password
// is checked. The public OTP sender cannot issue challenges for this purpose.
const schema = z.object({
  email: emailSchema,
  challengeId: z.string().min(1, "Please request a verification code."),
  otp: z.string().regex(/^\d{6}$/, "Please enter the 6-digit code."),
  next: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;
  try {
    const user = await db.user.findUnique({ where: { email: input.email }, include: userWithRoles });
    if (!user || !user.isActive || user.deletedAt) {
      return jsonError("Unable to sign in. Please check your account details or contact support.", 401);
    }
    await verifyOtp(input.challengeId, input.email, passwordLoginPurpose(user), input.otp);
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), isEmailVerified: true } });
    const payload = toSessionPayload(user);
    const response = NextResponse.json({ success: true, user: payload, redirectTo: safeNextPath(input.next) || homeFor(payload) });
    await setSessionCookie(response, payload);
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    console.error("[auth/login-password-otp]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
