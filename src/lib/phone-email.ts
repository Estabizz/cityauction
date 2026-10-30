import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { OtpError, type OtpPurpose } from "@/lib/otp";
import { PHONE_EMAIL_CLIENT_ID } from "./phone-email-config";

export const PHONE_EMAIL_COOKIE = "cityauction_email_intent";
const MAX_BODY_BYTES = 16_384;
const emailSchema = z.string().trim().toLowerCase().email().max(191);
const intentSchema = z.object({ email: emailSchema, purpose: z.string().min(1), nonce: z.string().uuid(), clientId: z.literal(PHONE_EMAIL_CLIENT_ID) });
export type PhoneEmailIntent = z.infer<typeof intentSchema>;

function key() {
  const secret = process.env.AUTH_SECRET;
  if ((!secret || secret.length < 32) && process.env.NODE_ENV === "production") throw new OtpError("Email verification is not configured.", 503);
  // Domain separation prevents verification-intent tokens becoming auth tokens.
  return createHmac("sha256", secret || "dev-only-phone-email-secret-change-me").update("cityauction-phone-email-intent").digest();
}
function intentHash(nonce: string) {
  return createHmac("sha256", key()).update(nonce).digest("hex");
}

export async function createPhoneEmailIntent(email: string, purpose: OtpPurpose) {
  const nonce = randomUUID();
  const token = await new SignJWT({ email, purpose, nonce, clientId: PHONE_EMAIL_CLIENT_ID })
    .setProtectedHeader({ alg: "HS256" }).setIssuer("cityauction-phone-email")
    .setAudience(PHONE_EMAIL_CLIENT_ID).setIssuedAt().setExpirationTime("10m").sign(key());
  return { token, nonce };
}

export async function readPhoneEmailIntent(): Promise<PhoneEmailIntent> {
  try {
    const token = (await cookies()).get(PHONE_EMAIL_COOKIE)?.value;
    if (!token) throw new Error("missing");
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: "cityauction-phone-email", audience: PHONE_EMAIL_CLIENT_ID });
    return intentSchema.parse(payload);
  } catch {
    throw new OtpError("Verification expired. Please start again.", 400);
  }
}

// Only the provider's documented HTTPS JSON host is fetched. No arbitrary
// URLs, credentials, alternate ports, redirects, query strings or fragments.
export function validatePhoneEmailUrl(raw: string) {
  let url: URL;
  try { url = new URL(raw); } catch { throw new OtpError("Invalid verification result."); }
  if (url.protocol !== "https:" || url.hostname !== "user.phone.email" || url.port ||
      url.username || url.password || url.search || url.hash ||
      !/^\/user_[A-Za-z0-9_-]{8,180}\.json$/.test(url.pathname)) {
    throw new OtpError("Invalid verification result.");
  }
  return url.href;
}

export async function fetchPhoneEmailIdentity(raw: string) {
  const url = validatePhoneEmailUrl(raw);
  try {
    const response = await fetch(url, { redirect: "error", cache: "no-store", signal: AbortSignal.timeout(8_000), headers: { Accept: "application/json" } });
    if (!response.ok || !response.body) throw new Error("provider unavailable");
    const size = Number(response.headers.get("content-length"));
    if (size > MAX_BODY_BYTES) throw new Error("oversized response");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let length = 0;
    let body = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_BODY_BYTES) throw new Error("oversized response");
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
    const data = z.object({ user_email_id: emailSchema, client_id: z.string().optional() }).parse(JSON.parse(body));
    if (data.client_id !== undefined && data.client_id !== PHONE_EMAIL_CLIENT_ID) throw new Error("client mismatch");
    return data.user_email_id;
  } catch {
    // Do not log capability URLs, provider response bodies, or email addresses.
    throw new OtpError("The email verification result could not be confirmed. Please try again.", 503);
  }
}

export async function exchangePhoneEmailResult(rawUrl: string, intentId: string) {
  const intent = await readPhoneEmailIntent();
  if (intent.nonce !== intentId) throw new OtpError("Verification does not match this browser. Please start again.");
  const url = validatePhoneEmailUrl(rawUrl);
  const email = await fetchPhoneEmailIdentity(url);
  if (email !== intent.email) throw new OtpError("Please verify the same email address you entered on CityAuction.");
  const id = createHash("sha256").update(`phone-email:${url}`).digest("hex");
  try {
    // The unique ID makes one provider URL exchangeable once across all workers.
    await db.emailOtpChallenge.create({ data: {
      id, email, purpose: intent.purpose, codeHash: intentHash(intent.nonce),
      expiresAt: new Date(Date.now() + 5 * 60_000),
    } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      throw new OtpError("This verification result was already used. Please verify again.", 409);
    }
    throw error;
  }
  return { verificationToken: id, email };
}

export async function verifyPhoneEmailToken(token: string, email: string, purpose: OtpPurpose, onVerified?: (tx: Prisma.TransactionClient) => Promise<void>) {
  const intent = await readPhoneEmailIntent();
  if (intent.email !== email || intent.purpose !== purpose) throw new OtpError("Verification does not match this request.");
  const row = await db.emailOtpChallenge.findUnique({ where: { id: token } });
  const expected = Buffer.from(intentHash(intent.nonce), "hex");
  const actual = Buffer.from(row?.codeHash || "", "hex");
  if (!row || row.email !== email || row.purpose !== purpose || row.consumedAt || row.expiresAt.getTime() <= Date.now() ||
      expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new OtpError("Verification expired or was already used. Please verify again.");
  }
  const consume = async (tx: Prisma.TransactionClient | typeof db) => {
    const { count } = await tx.emailOtpChallenge.updateMany({ where: { id: token, consumedAt: null, expiresAt: { gt: new Date() } }, data: { consumedAt: new Date() } });
    if (count !== 1) throw new OtpError("Verification was already used. Please verify again.");
  };
  if (onVerified) await db.$transaction(async (tx) => { await consume(tx); await onVerified(tx); });
  else await consume(db);
}
