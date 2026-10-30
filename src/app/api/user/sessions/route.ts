import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DB_UNAVAILABLE, clearSessionCookie, jsonError } from "@/app/api/auth/_lib";

// "Log out of all devices": bumping sessionVersion makes every existing session
// token invalid (getCurrentUser compares it), including this one.
export async function DELETE() {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  try {
    await db.user.update({ where: { id: session.userId }, data: { sessionVersion: { increment: 1 } } });
    const response = NextResponse.json({ success: true, message: "Signed out everywhere." });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[user/sessions]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
