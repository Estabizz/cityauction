import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ success: false, error: "Verification now uses email only. Update your contact phone in your profile." }, { status: 410 });
}
