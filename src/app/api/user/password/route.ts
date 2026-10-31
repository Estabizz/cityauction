import { NextResponse } from "next/server";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/profile-schema";
import { tooManyRequests } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/same-origin";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import {
  DB_UNAVAILABLE, jsonError, setSessionCookie,
  toSessionPayload, userWithRoles, validationError,
} from "@/app/api/auth/_lib";

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  if (tooManyRequests(`change-password:${session.userId}`, 10, 15 * 60 * 1000)) return jsonError("Too many attempts. Try again in 15 minutes.", 429);
  let input: z.infer<typeof changePasswordSchema>;
  try {
    input = changePasswordSchema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.userId }, select: { passwordHash: true, sessionVersion: true, email: true } });
    if (user && user.sessionVersion !== (session.sv ?? 0)) return jsonError("Your session has expired. Sign in again before changing your password.", 401);
    if (!user?.passwordHash || !(await verifyPassword(input.currentPassword, user.passwordHash))) {
      return jsonError("Your current password is incorrect.", 400);
    }

    const passwordHash = await hashPassword(input.newPassword);
    const updated = await db.$transaction(async (tx) => {
      const changed = await tx.user.updateMany({ where: { id: session.userId, passwordHash: user.passwordHash, sessionVersion: user.sessionVersion, isActive: true, deletedAt: null }, data: {
        passwordHash, passwordSetToken: null, passwordSetExpires: null, sessionVersion: { increment: 1 },
      } });
      if (changed.count !== 1) return null;
      if (user.email) await tx.emailOtpChallenge.updateMany({ where: { email: user.email, consumedAt: null }, data: { consumedAt: new Date() } });
      return tx.user.findUnique({ where: { id: session.userId }, include: userWithRoles });
    });
    if (!updated) return jsonError("Your security settings changed. Please sign in again before retrying.", 409);
    // Keep this device signed in with the new version; all older tokens expire.
    const response = NextResponse.json({ success: true, message: "Password changed." });
    await setSessionCookie(response, toSessionPayload(updated));
    return response;
  } catch (error) {
    console.error("[user/password]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
