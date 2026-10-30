import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import { OtpError } from "./otp";
import { verifyEmailChallenge, type EmailVerification } from "./email-verification";

export const PASSWORD_RESET_COOKIE = "cityauction_password_reset";
export const PASSWORD_RESET_TTL_SECONDS = 300;
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const INVALID = "Password reset verification expired. Please verify your email again.";

// Trade an email OTP proof for a short-lived, browser-bound password reset.
// Password fields are shown only after the server accepts the email proof.
export async function issuePasswordResetProof(email: string, proof: EmailVerification) {
  const user = await db.user.findUnique({ where: { email }, select: { id: true, isActive: true, deletedAt: true, isEmailVerified: true, sessionVersion: true } });
  if (!user || !user.isActive || user.deletedAt || !user.isEmailVerified) throw new OtpError("This account could not be recovered. Please contact support.");
  const token = randomBytes(32).toString("hex");
  const browserSecret = randomBytes(32).toString("hex");
  await verifyEmailChallenge(proof, email, "reset-password", async (tx) => {
    await tx.emailOtpChallenge.create({ data: {
      id: digest(token), email, purpose: `reset-grant:${user.id}:${user.sessionVersion}`,
      codeHash: digest(browserSecret), expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_SECONDS * 1000),
    } });
  });
  return { token, browserSecret };
}

export async function consumePasswordResetProof(token: string, user: { id: string; email: string; sessionVersion: number }, onVerified: (tx: Prisma.TransactionClient) => Promise<void>) {
  const browserSecret = (await cookies()).get(PASSWORD_RESET_COOKIE)?.value;
  if (!browserSecret || !/^[a-f0-9]{64}$/.test(token)) throw new OtpError(INVALID);
  const id = digest(token);
  const purpose = `reset-grant:${user.id}:${user.sessionVersion}`;
  const row = await db.emailOtpChallenge.findUnique({ where: { id } });
  const expected = Buffer.from(digest(browserSecret), "hex");
  const actual = Buffer.from(row?.codeHash || "", "hex");
  if (!row || row.email !== user.email || row.purpose !== purpose || row.consumedAt || row.expiresAt.getTime() <= Date.now() || expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new OtpError(INVALID);
  await db.$transaction(async (tx) => {
    const { count } = await tx.emailOtpChallenge.updateMany({ where: { id, email: user.email, purpose, consumedAt: null, expiresAt: { gt: new Date() } }, data: { consumedAt: new Date() } });
    if (count !== 1) throw new OtpError(INVALID);
    await onVerified(tx);
  });
}
