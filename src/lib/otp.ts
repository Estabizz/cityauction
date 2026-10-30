import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import { sendOtpEmail, emailConfigured, emailSettingsPresent } from "./email";

// Email one-time codes: 6 digits, valid 10 minutes, 5 tries per code, 30s
// before a resend, and hourly caps per number and per IP. Only an HMAC of the
// code is stored.

export type OtpPurpose = "register" | "login" | `link-email:${string}` | "reset-password" | `password-login:${string}:${number}`;

// Bind the password proof to the account's current session version. Password
// changes invalidate an unfinished password-login challenge as well as sessions.
export function passwordLoginPurpose(user: { id: string; sessionVersion: number }): OtpPurpose {
  return `password-login:${user.id}:${user.sessionVersion}`;
}

export function emailLinkPurpose(userId: string): OtpPurpose {
  return `link-email:${userId}`;
}

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_EMAIL_PER_HOUR = 5;
const MAX_SENDS_PER_IP_PER_HOUR = 20;
const HOUR_MS = 60 * 60 * 1000;

export const OTP_RESEND_SECONDS = RESEND_COOLDOWN_MS / 1000;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-insecure-otp-secret-0123456789";
  throw new Error("AUTH_SECRET is not set (needs at least 32 characters).");
}

function hashCode(challengeId: string, code: string) {
  return createHmac("sha256", secret()).update(`${challengeId}:${code}`).digest("hex");
}

// Codes are shown only in unconfigured local development. A partial SMTP
// configuration is an error, not a reason to silently fall back to dev mode.
export const OTP_DEV_MODE = !emailSettingsPresent() && process.env.NODE_ENV !== "production";
const SEND_FAILED = "We couldn't email the code right now. Please try again shortly or contact support.";

async function deliverOtp(email: string, code: string) {
  if (OTP_DEV_MODE) return;
  if (!emailConfigured()) throw new OtpError(SEND_FAILED, 503);
  try {
    await sendOtpEmail(email, code);
  } catch {
    throw new OtpError(SEND_FAILED, 503);
  }
}

export class OtpError extends Error {
  constructor(message: string, readonly status = 400, readonly retryAfter?: number) {
    super(message);
  }
}

export async function sendOtp(email: string, purpose: OtpPurpose, ipAddress: string | null) {
  email = email.trim().toLowerCase();
  const now = Date.now();
  const hourAgo = new Date(now - HOUR_MS);

  const [latest, sentToEmail, sentFromIp] = await Promise.all([
    db.emailOtpChallenge.findFirst({ where: { email }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    db.emailOtpChallenge.count({ where: { email, createdAt: { gt: hourAgo } } }),
    ipAddress ? db.emailOtpChallenge.count({ where: { ipAddress, createdAt: { gt: hourAgo } } }) : 0,
  ]);

  if (latest) {
    const wait = Math.ceil((latest.createdAt.getTime() + RESEND_COOLDOWN_MS - now) / 1000);
    if (wait > 0) throw new OtpError(`Please wait ${wait} seconds before asking for a new code.`, 429, wait);
  }
  if (sentToEmail >= MAX_SENDS_PER_EMAIL_PER_HOUR || sentFromIp >= MAX_SENDS_PER_IP_PER_HOUR) {
    throw new OtpError("Too many codes requested. Please try again in an hour.", 429);
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  // Our own id so the hash is ready before the row is saved (no half-made rows).
  const id = randomUUID();
  const challenge = await db.emailOtpChallenge.create({
    data: { id, email, purpose, codeHash: hashCode(id, code), expiresAt: new Date(now + CODE_TTL_MS), ipAddress },
  });
  try {
    await deliverOtp(email, code);
  } catch (error) {
    // Nothing was sent, so don't let this attempt count against the cooldown or limits.
    await db.emailOtpChallenge.delete({ where: { id: challenge.id } }).catch(() => {});
    throw error;
  }

  // Older unused codes for this email stop working once a new one is sent.
  await db.emailOtpChallenge.updateMany({
    where: { email, consumedAt: null, id: { not: challenge.id } },
    data: { consumedAt: new Date(now) },
  });
  return { challengeId: challenge.id, devCode: OTP_DEV_MODE ? code : undefined };
}

// Checks and uses up a code. Throws OtpError with a message for the form.
export async function verifyOtp(
  challengeId: string, email: string, purpose: OtpPurpose, code: string,
  onVerified?: (tx: Prisma.TransactionClient) => Promise<void>
) {
  email = email.trim().toLowerCase();
  const challenge = await db.emailOtpChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.email !== email || challenge.purpose !== purpose || challenge.consumedAt) {
    throw new OtpError("This code is no longer valid. Please request a new one.");
  }
  if (challenge.expiresAt.getTime() < Date.now()) {
    throw new OtpError("This code has expired. Please request a new one.");
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    throw new OtpError("Too many wrong attempts. Please request a new code.", 429);
  }

  // Reserve an attempt atomically, including successful attempts. Parallel
  // guesses cannot all pass a stale attempts counter.
  const reserved = await db.emailOtpChallenge.updateMany({
    where: { id: challenge.id, consumedAt: null, attempts: { lt: MAX_ATTEMPTS }, expiresAt: { gt: new Date() } },
    data: { attempts: { increment: 1 } },
  });
  if (reserved.count !== 1) throw new OtpError("This code has expired, was used, or has no attempts left. Please request a new one.");

  const expected = Buffer.from(challenge.codeHash, "hex");
  const given = Buffer.from(hashCode(challenge.id, code), "hex");
  if (!/^\d{6}$/.test(code) || expected.length !== given.length || !timingSafeEqual(expected, given)) {
    throw new OtpError("That code isn't right. Please check it and try again, or request a new code.");
  }

  async function consume(tx: Prisma.TransactionClient | typeof db) {
    const { count } = await tx.emailOtpChallenge.updateMany({
      where: { id: challenge!.id, consumedAt: null, expiresAt: { gt: new Date() } },
      data: { consumedAt: new Date() },
    });
    if (count !== 1) throw new OtpError("This code is no longer valid. Please request a new one.");
  }
  if (onVerified) {
    // A reset and code consumption succeed together. Failed reset writes leave
    // the code usable; failed guesses still count outside this transaction.
    await db.$transaction(async (tx) => {
      await consume(tx);
      await onVerified(tx);
    });
  } else {
    await consume(db);
  }
}
