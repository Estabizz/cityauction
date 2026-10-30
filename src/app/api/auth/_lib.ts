import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { COOKIE_NAME, isAdmin, signToken, type UserSessionPayload } from "@/lib/auth";

// Shared by the auth and account API routes (a non-route file, so not served).

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, matches signToken's default

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.")
  .max(191, "Email address is too long.");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{10,20}$/, "Please enter a valid phone number (at least 10 digits).")
  .refine((value) => value.replace(/\D/g, "").length >= 10, "Please enter a valid phone number (at least 10 digits).");

export const userWithRoles = { roles: { include: { role: true } } } as const;

type UserForSession = {
  id: string;
  email: string | null;
  mobile: string | null;
  fullName: string | null;
  accountType: string | null;
  sessionVersion: number;
  roles: { role: { name: string } }[];
};

export function toSessionPayload(user: UserForSession): UserSessionPayload {
  return {
    userId: user.id,
    email: user.email || "",
    mobile: user.mobile || undefined,
    fullName: user.fullName || user.email?.split("@")[0] || "Member",
    accountType: user.accountType || "INDIVIDUAL",
    roles: user.roles.map((r) => r.role.name),
    sv: user.sessionVersion,
  };
}

export async function setSessionCookie(response: NextResponse, payload: UserSessionPayload) {
  response.cookies.set(COOKIE_NAME, await signToken(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

// Where to land after signing in: a safe ?next= path, else the right home.
export function homeFor(payload: UserSessionPayload) {
  return isAdmin(payload) ? "/admin/dashboard" : "/dashboard";
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
}

export function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export function validationError(error: z.ZodError) {
  return jsonError(error.issues[0]?.message || "Please check the form and try again.", 400);
}

export const DB_UNAVAILABLE = "We couldn't reach our database. Please try again in a few minutes.";

export async function loadUserForSession(userId: string) {
  return db.user.findUnique({ where: { id: userId }, include: userWithRoles });
}
