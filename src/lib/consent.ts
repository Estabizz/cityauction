import type { Prisma } from "@prisma/client";
import { db } from "./db";
import type { AlertChannel } from "./buyer";

// Version of the Terms & Privacy Notice shown at sign-up. Bump it when either
// document changes so consent_events shows which text each user accepted.
export const POLICY_VERSION = "2026-10-21";

type Tx = Prisma.TransactionClient | typeof db;

export const MARKETING_FIELDS = {
  EMAIL: "marketingEmail",
  SMS: "marketingSms",
  WHATSAPP: "marketingWhatsapp",
} as const satisfies Record<AlertChannel, string>;

export function requestMeta(req: Request) {
  return {
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) || req.headers.get("x-real-ip") || null,
    userAgent: req.headers.get("user-agent")?.slice(0, 500) || null,
  };
}

export async function recordTermsAcceptance(tx: Tx, userId: string, source: string, req: Request) {
  await tx.consentEvent.create({
    data: { userId, kind: "TERMS_PRIVACY", granted: true, policyVersion: POLICY_VERSION, source, ...requestMeta(req) },
  });
}

// Logs one event per channel whose choice changed.
export async function recordMarketingChoices(
  tx: Tx,
  userId: string,
  changes: Partial<Record<AlertChannel, boolean>>,
  source: string,
  req: Request
) {
  const rows = Object.entries(changes)
    .filter(([, granted]) => granted !== undefined)
    .map(([channel, granted]) => ({
      userId,
      kind: "MARKETING",
      channel,
      granted: !!granted,
      policyVersion: POLICY_VERSION,
      source,
      ...requestMeta(req),
    }));
  if (rows.length) await tx.consentEvent.createMany({ data: rows });
}
