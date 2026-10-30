import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { userPulse } from "@/lib/pulse";
import { DB_UNAVAILABLE, jsonError } from "@/app/api/auth/_lib";

// Polled by the buyer dashboard so status changes made by the team show up
// without a manual refresh (see components/account/account-live.tsx).
export async function GET() {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);

  try {
    return NextResponse.json({ success: true, version: await userPulse(session.userId) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[user/pulse]", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
