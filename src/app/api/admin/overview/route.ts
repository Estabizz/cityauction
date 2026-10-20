import { NextResponse } from "next/server";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { getOverview } from "@/lib/admin/overview";
import { parseSince } from "@/lib/admin/time";

// Polled every ~15 seconds by the admin panel (dashboard feed, sidebar badge).
export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const since = parseSince(new URL(req.url).searchParams.get("since"));
    const data = await getOverview(since);
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin] overview failed", err);
    return jsonError("Could not load the overview.", 500);
  }
}
