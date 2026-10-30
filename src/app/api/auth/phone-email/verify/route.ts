import { NextResponse } from "next/server";
import { z } from "zod";
import { OtpError } from "@/lib/otp";
import { exchangePhoneEmailResult } from "@/lib/phone-email";
import { isSameOriginRequest } from "@/lib/same-origin";
import { tooManyRequests } from "@/lib/rate-limit";
import { clientIp, jsonError, validationError } from "../../_lib";

const schema = z.object({ user_json_url: z.string().max(500), intentId: z.string().uuid() });
export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  if (tooManyRequests(`phone-email-verify:${clientIp(req) || "unknown"}`, 30, 15 * 60_000)) return jsonError("Too many verification requests. Please try again later.", 429);
  try {
    const result = await exchangePhoneEmailResult(parsed.data.user_json_url, parsed.data.intentId);
    return NextResponse.json({ success: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return jsonError(error instanceof OtpError ? error.message : "Verification could not be saved. Please try again.", error instanceof OtpError ? error.status : 503);
  }
}
