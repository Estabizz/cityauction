import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";

// Newsletter status for the signed-in user, keyed by their email in Subscriber.

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please sign in.", 401);

  try {
    const row = await db.subscriber.findUnique({ where: { email: user.email }, select: { status: true } });
    return NextResponse.json({ success: true, subscribed: row?.status === "ACTIVE" });
  } catch (error) {
    console.error("[user/subscription] GET", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}

const schema = z.object({ subscribed: z.boolean() });

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Please sign in.", 401);

  let subscribed: boolean;
  try {
    ({ subscribed } = schema.parse(await req.json()));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Invalid request.", 400);
  }

  try {
    if (subscribed) {
      await db.subscriber.upsert({
        where: { email: user.email },
        update: { status: "ACTIVE" },
        create: { email: user.email, name: user.fullName, source: "dashboard", pagePath: "/dashboard", status: "ACTIVE" },
      });
    } else {
      await db.subscriber.updateMany({ where: { email: user.email }, data: { status: "UNSUBSCRIBED" } });
    }
    return NextResponse.json({ success: true, subscribed });
  } catch (error) {
    console.error("[user/subscription] PUT", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
