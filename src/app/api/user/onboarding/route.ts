import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DB_UNAVAILABLE, jsonError } from "@/app/api/auth/_lib";

// "Skip for now" on the welcome step. Preferences can be added any time later.
export async function POST() {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  try {
    await db.user.updateMany({ where: { id: session.userId, onboardedAt: null }, data: { onboardedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[user/onboarding]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
