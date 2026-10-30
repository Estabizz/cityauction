import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { OtpError, verifyOtp, type OtpPurpose } from "@/lib/otp";
import { verifyPhoneEmailToken } from "./phone-email";

export const emailVerificationFields = {
  challengeId: z.string().min(1).optional(),
  otp: z.string().trim().regex(/^\d{6}$/).optional(),
  phoneEmailToken: z.string().regex(/^[a-f0-9]{64}$/).optional(),
};
export type EmailVerification = { challengeId?: string; otp?: string; phoneEmailToken?: string };

export async function verifyEmailChallenge(proof: EmailVerification, email: string, purpose: OtpPurpose, onVerified?: (tx: Prisma.TransactionClient) => Promise<void>) {
  if (proof.phoneEmailToken) return verifyPhoneEmailToken(proof.phoneEmailToken, email, purpose, onVerified);
  if (!proof.challengeId || !proof.otp) throw new OtpError("Please verify your email before continuing.");
  return verifyOtp(proof.challengeId, email, purpose, proof.otp, onVerified);
}
