import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import {
  DB_UNAVAILABLE,
  homeFor,
  jsonError,
  loadUserForSession,
  passwordSchema,
  setSessionCookie,
  toSessionPayload,
  validationError,
} from "../_lib";

// Uses the one-time link from scripts/bootstrap-admin.ts or an admin-issued
// reset (User.passwordSetToken, 32-byte hex, valid 24h).
const schema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/i, "This link is invalid. Please ask for a new one."),
    password: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === undefined || data.confirmPassword === data.password, {
    message: "The two passwords don't match.",
  });

const EXPIRED = "This link has expired or was already used. Please ask for a new one.";

export async function POST(req: Request) {
  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const passwordHash = await hashPassword(input.password);
    const now = new Date();

    const user = await db.user.findUnique({
      where: { passwordSetToken: input.token },
      select: { id: true, isActive: true, deletedAt: true },
    });
    if (!user) return jsonError(EXPIRED, 400);
    if (!user.isActive || user.deletedAt) {
      return jsonError("This account has been disabled. Please contact info@estabizz.com.", 403);
    }

    // Conditional update so the same link can't be used twice, even at once.
    const { count } = await db.user.updateMany({
      where: { id: user.id, passwordSetToken: input.token, passwordSetExpires: { gt: now } },
      data: { passwordHash, passwordSetToken: null, passwordSetExpires: null, lastLoginAt: now },
    });
    if (count !== 1) return jsonError(EXPIRED, 400);

    const fresh = await loadUserForSession(user.id);
    if (!fresh) return jsonError(EXPIRED, 400);

    const payload = toSessionPayload(fresh);
    const response = NextResponse.json({
      success: true,
      message: "Password saved. You're signed in.",
      user: payload,
      redirectTo: homeFor(payload),
    });
    await setSessionCookie(response, payload);
    return response;
  } catch (error) {
    console.error("[auth/set-password]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
