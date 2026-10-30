import { NextResponse } from "next/server";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { adminPulse } from "@/lib/pulse";

// Polled every few seconds by the admin panel (see components/admin/live.tsx).
export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    return NextResponse.json({ success: true, version: await adminPulse() }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin] pulse failed", err);
    return jsonError("Could not check for updates.", 500);
  }
}
