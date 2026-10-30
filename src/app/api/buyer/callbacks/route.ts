import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { POLICY_VERSION, requestMeta } from "@/lib/consent";
import { CALLBACK_INTERESTS, CALLBACK_WINDOWS } from "@/lib/callbacks";
import { formatMobile, normalizeMobile } from "@/lib/mobile";
import { tooManyRequests } from "@/lib/rate-limit";
import { requestReference } from "@/lib/requests";
import { DB_UNAVAILABLE, clientIp, jsonError, validationError } from "@/app/api/auth/_lib";

// "Request a callback" on the buyer access page (assisted registration). Each
// request is a lead (source "callback-request") the team works from the admin
// Leads page. Repeat requests from the same mobile while one is still open are
// added to that lead's history instead of creating duplicates.

const values = (list: readonly { value: string }[]) => list.map((o) => o.value) as [string, ...string[]];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  countryCode: z.string().trim().default("91"),
  mobile: z.string().trim().min(1, "Please enter your mobile number."),
  city: z.string().trim().max(80, "City is too long.").optional().default(""),
  window: z.enum(values(CALLBACK_WINDOWS), { error: "Please choose a preferred callback time." }),
  interest: z.enum(values(CALLBACK_INTERESTS)).default("REGISTER"),
  notes: z.string().trim().max(2000, "That's a bit long. Please keep it under 2000 characters.").optional().default(""),
  callbackConsent: z.literal(true, { error: "Please confirm we may call you about this request." }),
  marketingOptIn: z.boolean().default(false),
  // Honeypot: hidden from people, filled in by bots.
  website: z.string().optional(),
});

const OPEN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  const ok = (reference: string, repeat = false) =>
    NextResponse.json({
      success: true,
      repeat,
      reference,
      message: repeat
        ? "We already have your callback request and have added these details to it."
        : "Callback request received. Our team will call you in your preferred window where possible.",
    });

  // Pretend success for bots so they don't retry.
  if (input.website) return ok("CA-000000");

  const mobile = normalizeMobile(input.countryCode, input.mobile);
  if (!mobile) return jsonError("Please enter a valid mobile number.", 400);

  const ip = clientIp(req) || "unknown";
  if (tooManyRequests(`callback:ip:${ip}`, 8, 60 * 60 * 1000) || tooManyRequests(`callback:mobile:${mobile}`, 4, 60 * 60 * 1000)) {
    return jsonError("We've received several requests already. Our team will be in touch soon.", 429);
  }

  const windowLabel = CALLBACK_WINDOWS.find((w) => w.value === input.window)!.label;
  const interestLabel = CALLBACK_INTERESTS.find((i) => i.value === input.interest)!.label;
  const meta = requestMeta(req);
  const now = new Date();
  const details = {
    preferredWindow: windowLabel,
    interest: interestLabel,
    city: input.city || null,
    requestedAt: now.toISOString(),
    // Callback permission (needed to act on this) is kept apart from optional marketing.
    consent: {
      callback: true,
      marketing: input.marketingOptIn,
      policyVersion: POLICY_VERSION,
      at: now.toISOString(),
      ipAddress: meta.ipAddress,
    },
  };

  try {
    const session = await getCurrentUser();
    const account = session
      ? { id: session.userId }
      : await db.user.findUnique({ where: { mobile }, select: { id: true } });

    const open = await db.enquiry.findFirst({
      where: {
        source: "callback-request",
        phone: formatMobile(mobile),
        status: { in: ["NEW", "IN_PROGRESS"] },
        createdAt: { gt: new Date(now.getTime() - OPEN_WINDOW_MS) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (open) {
      const previous = (open.metadata ?? {}) as Prisma.JsonObject;
      const history = Array.isArray(previous.repeatRequests) ? previous.repeatRequests : [];
      await db.enquiry.update({
        where: { id: open.id },
        data: {
          message: `${open.message}\n\n— Asked again ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}: ${interestLabel}, ${windowLabel}${input.notes ? `\n${input.notes}` : ""}`.slice(0, 60000),
          metadata: { ...previous, ...details, repeatRequests: [...history, details].slice(-20) } as Prisma.InputJsonObject,
          userId: open.userId ?? account?.id ?? null,
        },
      });
      return ok(requestReference(open.id), true);
    }

    const lead = await db.enquiry.create({
      data: {
        name: input.name,
        email: "",
        phone: formatMobile(mobile),
        subject: `Callback: ${interestLabel}`,
        message: [`Preferred time: ${windowLabel}`, input.city && `City: ${input.city}`, input.notes].filter(Boolean).join("\n"),
        source: "callback-request",
        pagePath: "/buyer/access",
        userId: account?.id ?? null,
        metadata: details,
      },
    });
    return ok(requestReference(lead.id));
  } catch (error) {
    console.error("[buyer/callbacks]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
