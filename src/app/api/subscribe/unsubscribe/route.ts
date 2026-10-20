import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Same reply whether or not the email was on the list, so the form can't be used
// to find out who is subscribed.
const DONE_MESSAGE =
  "If this email was on our list, it has been unsubscribed. You won't receive further updates.";

const unsubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address").max(190)),
  hp: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = unsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Please check your email and try again" },
      { status: 400 }
    );
  }

  if (parsed.data.hp) {
    return NextResponse.json({ success: true, message: DONE_MESSAGE });
  }

  try {
    await db.subscriber.updateMany({
      where: { email: parsed.data.email, status: "ACTIVE" },
      data: { status: "UNSUBSCRIBED" },
    });
    return NextResponse.json({ success: true, message: DONE_MESSAGE });
  } catch (error) {
    console.error("[unsubscribe] could not update subscriber", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "We couldn't process this just now. Please try again in a few minutes, or email info@estabizz.com and we'll remove you.",
      },
      { status: 503 }
    );
  }
}
