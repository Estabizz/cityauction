import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { MARKETING_FIELDS, recordMarketingChoices } from "@/lib/consent";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";

// Marketing opt-in per channel. Each change is logged as a consent event, and
// email choices also update the newsletter list the team sends from.
const schema = z.object({
  EMAIL: z.boolean().optional(),
  SMS: z.boolean().optional(),
  WHATSAPP: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Invalid request.", 400);
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { email: true, fullName: true, marketingEmail: true, marketingSms: true, marketingWhatsapp: true },
    });
    if (!user) return jsonError("Please sign in.", 401);
    if (input.EMAIL && !user.email) return jsonError("Add an email address to your profile first.", 400);

    const current = { EMAIL: user.marketingEmail, SMS: user.marketingSms, WHATSAPP: user.marketingWhatsapp };
    const changes = Object.fromEntries(
      Object.entries(input).filter(([channel, value]) => value !== undefined && value !== current[channel as keyof typeof current])
    ) as Partial<Record<keyof typeof current, boolean>>;

    await db.$transaction(async (tx) => {
      if (Object.keys(changes).length === 0) return;
      await tx.user.update({
        where: { id: session.userId },
        data: Object.fromEntries(Object.entries(changes).map(([channel, value]) => [MARKETING_FIELDS[channel as keyof typeof current], value])),
      });
      await recordMarketingChoices(tx, session.userId, changes, "profile", req);
      if (changes.EMAIL !== undefined && user.email) {
        await tx.subscriber.upsert({
          where: { email: user.email },
          update: { status: changes.EMAIL ? "ACTIVE" : "UNSUBSCRIBED" },
          create: { email: user.email, name: user.fullName, source: "dashboard", pagePath: "/dashboard/profile", status: changes.EMAIL ? "ACTIVE" : "UNSUBSCRIBED" },
        });
      }
    });

    const next = { ...current, ...changes };
    return NextResponse.json({ success: true, message: "Preferences saved.", preferences: next });
  } catch (error) {
    console.error("[user/preferences]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
