import { emailVerificationFields, verifyEmailChallenge } from "@/lib/email-verification";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { OtpError } from "@/lib/otp";
import { DB_UNAVAILABLE, emailSchema, clearSessionCookie, jsonError, passwordSchema, validationError } from "../_lib";

const schema = z.object({
  email: emailSchema,
  ...emailVerificationFields,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((v) => v.password === v.confirmPassword, { message: "The two passwords don't match.", path: ["confirmPassword"] });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;

  try {
    const user = await db.user.findUnique({ where: { email: input.email }, select: { id: true, isActive: true, deletedAt: true, isEmailVerified: true } });
    if (!user || !user.isActive || user.deletedAt || !user.isEmailVerified) {
      return jsonError("We couldn't verify this request. Please request a new code or contact support.", 400);
    }
    const passwordHash = await hashPassword(input.password);
    await verifyEmailChallenge(input, input.email, "reset-password", async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: user.id, email: input.email, isEmailVerified: true, isActive: true, deletedAt: null },
        data: { passwordHash, passwordSetToken: null, passwordSetExpires: null, sessionVersion: { increment: 1 } },
      });
      // A reset also invalidates any earlier sign-in codes for this email.
      await tx.emailOtpChallenge.updateMany({ where: { email: input.email, consumedAt: null }, data: { consumedAt: new Date() } });
      if (count !== 1) throw new OtpError("Your account changed during verification. Please request a new code.");
    });
    const response = NextResponse.json({ success: true, message: "Password reset. Please sign in again. All previous sessions have been signed out." });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    console.error("[auth/reset-password]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
