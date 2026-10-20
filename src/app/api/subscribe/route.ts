import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";

// Where the subscribe box sits. The admin panel filters subscribers by these.
const SOURCES = ["footer", "homepage"] as const;

const SAVE_FAILED_MESSAGE =
  "We couldn't save your subscription just now. Please try again in a few minutes, or reach us on WhatsApp at +91 98256 69668 or email info@estabizz.com.";

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address").max(190, "Email is too long")),
  name: z.string().trim().max(150, "Name is too long").optional().transform((v) => v || null),
  source: z.enum(SOURCES, { error: "Unknown form" }),
  pagePath: z.string().trim().max(500).optional().transform((v) => v || null),
  // Honeypot: hidden from people, bots tend to fill it in.
  hp: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Please check your email and try again" },
      { status: 400 }
    );
  }
  const { email, name, source, pagePath, hp } = parsed.data;

  if (hp) {
    return NextResponse.json({ success: true, status: "subscribed", message: "You're subscribed." });
  }

  try {
    const existing = await db.subscriber.findUnique({ where: { email } });

    if (existing?.status === "ACTIVE") {
      if (name && !existing.name) {
        await db.subscriber.update({ where: { email }, data: { name } });
      }
      return NextResponse.json({
        success: true,
        status: "already",
        message: "You're already subscribed. We'll keep sending updates to this email.",
      });
    }

    if (existing) {
      // Came back after unsubscribing: switch them on again.
      await db.subscriber.update({
        where: { email },
        data: { status: "ACTIVE", name: name ?? existing.name, source, pagePath },
      });
    } else {
      await db.subscriber.create({ data: { email, name, source, pagePath } });
    }

    return NextResponse.json({
      success: true,
      status: "subscribed",
      message: "You're subscribed. New auction opportunities and city updates will reach your inbox.",
    });
  } catch (error) {
    // Two submits at once for a new email: the second hits the unique key.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({
        success: true,
        status: "already",
        message: "You're already subscribed. We'll keep sending updates to this email.",
      });
    }
    console.error("[subscribe] could not save subscriber", { source, error });
    return NextResponse.json({ success: false, error: SAVE_FAILED_MESSAGE }, { status: 503 });
  }
}
