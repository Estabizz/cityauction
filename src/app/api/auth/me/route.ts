import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Not signed in." }, { status: 401, headers: NO_STORE });
  }

  return NextResponse.json({ success: true, user, isAdmin: isAdmin(user) }, { headers: NO_STORE });
}
