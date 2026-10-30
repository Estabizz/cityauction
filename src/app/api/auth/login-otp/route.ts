import { emailVerificationFields, verifyEmailChallenge } from "@/lib/email-verification";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { OtpError } from "@/lib/otp";
import { safeNextPath } from "@/components/account/safe-next";
import {
  DB_UNAVAILABLE,
  emailSchema,
  homeFor,
  jsonError,
  setSessionCookie,
  toSessionPayload,
  userWithRoles,
  validationError,
} from "../_lib";

// Sign-in with an email OTP (sent first via /api/auth/otp/send, purpose "login").
const schema = z.object({
  email: emailSchema,
  ...emailVerificationFields,
  next: z.string().optional(),
});

export async function POST(req: Request) {
  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const user = await db.user.findUnique({ where: { email: input.email }, include: userWithRoles });
    if (!user) return jsonError("We couldn't find an account with this email. Please create one.", 404);
    if (!user.isActive || user.deletedAt) {
      return jsonError("This account has been disabled. Please contact info@estabizz.com.", 403);
    }
    if (!user.isEmailVerified) return jsonError("This account's email needs verification. Please contact support to recover access.", 403);

    await verifyEmailChallenge(input, input.email, "login", async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: user.id, email: input.email, isActive: true, deletedAt: null, isEmailVerified: true, sessionVersion: user.sessionVersion },
        data: { lastLoginAt: new Date() },
      });
      if (count !== 1) throw new OtpError("Your account changed during verification. Please start again.");
    });

    const payload = toSessionPayload(user);
    const response = NextResponse.json({
      success: true,
      message: "Signed in.",
      user: payload,
      redirectTo: safeNextPath(input.next) || homeFor(payload),
    });
    await setSessionCookie(response, payload);
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    console.error("[auth/login-otp]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
