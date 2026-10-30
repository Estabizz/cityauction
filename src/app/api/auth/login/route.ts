import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { OTP_RESEND_SECONDS, OtpError, passwordLoginPurpose, sendOtp } from "@/lib/otp";
import { tooManyRequests } from "@/lib/rate-limit";
import {
  DB_UNAVAILABLE,
  clientIp,
  jsonError,
  userWithRoles,
  validationError,
} from "../_lib";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password.").max(128),
  next: z.string().optional(),
  // Older forms (investor / financial institution login) still send this; it is ignored.
  loginAs: z.string().optional(),
});

const INVALID = "Incorrect email or password.";

// Compared against when the email is unknown, so both cases take about as long
// and response timing doesn't reveal which emails have accounts.
const DUMMY_HASH = "$2b$10$bCF0Ec2jVGTaHVyXhpnUx.aOcIMFwBqUj4Rxv4ifzFP2oY6EW061y";

export async function POST(req: Request) {
  let input: z.infer<typeof loginSchema>;
  try {
    input = loginSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  const ip = clientIp(req) || "unknown";
  if (tooManyRequests(`password-login:ip:${ip}`, 30, 15 * 60 * 1000) ||
      tooManyRequests(`password-login:account:${input.email}`, 10, 15 * 60 * 1000)) {
    return jsonError("Too many sign-in attempts. Please try again in 15 minutes.", 429);
  }

  let user;
  try {
    user = await db.user.findUnique({ where: { email: input.email }, include: userWithRoles });
  } catch (error) {
    console.error("[auth/login]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }

  const passwordOk = await verifyPassword(input.password, user?.passwordHash || DUMMY_HASH);
  if (!user || !user.passwordHash || !passwordOk) return jsonError(INVALID, 401);
  if (!user.isActive || user.deletedAt) {
    return jsonError("This account has been disabled. Please contact info@estabizz.com.", 403);
  }

  try {
    const { challengeId, devCode } = await sendOtp(user.email!, passwordLoginPurpose(user), clientIp(req));
    return NextResponse.json({
      success: true, requiresOtp: true, challengeId, email: user.email,
      resendIn: OTP_RESEND_SECONDS, devCode,
      message: "Enter the verification code sent to your email address to finish signing in.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof OtpError) {
      const response = jsonError(error.message, error.status);
      if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
      return response;
    }
    console.error("[auth/login] OTP", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
