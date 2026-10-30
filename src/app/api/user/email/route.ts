import { emailVerificationFields, verifyEmailChallenge } from "@/lib/email-verification";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { OtpError, emailLinkPurpose } from "@/lib/otp";
import { DB_UNAVAILABLE, emailSchema, jsonError, loadUserForSession, setSessionCookie, toSessionPayload, validationError } from "@/app/api/auth/_lib";

const schema = z.object({ email: emailSchema, ...emailVerificationFields });

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { email } = parsed.data;
  try {
    const owner = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (owner && owner.id !== session.userId) return jsonError("This email is linked to another account.", 409);
    await verifyEmailChallenge(parsed.data, email, emailLinkPurpose(session.userId), async (tx) => {
      await tx.user.update({ where: { id: session.userId }, data: { email, isEmailVerified: true, sessionVersion: { increment: 1 }, passwordSetToken: null, passwordSetExpires: null } });
    });
    const user = await loadUserForSession(session.userId);
    if (!user) return jsonError("Please sign in again.", 401);
    const response = NextResponse.json({ success: true, message: "Email verified. Other devices have been signed out." });
    await setSessionCookie(response, toSessionPayload(user));
    return response;
  } catch (error) {
    if (error instanceof OtpError) return jsonError(error.message, error.status);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return jsonError("This email is linked to another account.", 409);
    console.error("[user/email]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
