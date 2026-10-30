import { NextResponse } from "next/server";
import { clearSessionCookie } from "../_lib";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out." }, { headers: { "Cache-Control": "no-store" } });
  clearSessionCookie(response);
  response.cookies.set("cityauction_email_intent", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 0, path: "/" });
  return response;
}
