import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Server-only helpers for the dashboard pages. cache() lets the layout and the
// page share one database read per request.

export const getAccount = cache(async () => {
  const session = await getCurrentUser();
  // proxy.ts already sends signed-out visitors to /login; this is a backstop.
  if (!session) redirect("/login?next=/dashboard");

  try {
    const row = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        accountType: true,
        address: true,
        pincode: true,
        updatedAt: true,
        bidderProfile: { select: { companyName: true, gstNumber: true, status: true } },
        mobile: true,
        fullName: true,
        phone: true,
        city: true,
        state: true,
        buyerCategory: true,
        onboardedAt: true,
        marketingEmail: true,
        marketingSms: true,
        marketingWhatsapp: true,
        passwordHash: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    // Never pass the hash on; pages only need to know whether there is one.
    const user = row && (({ passwordHash, ...rest }) => ({ ...rest, hasPassword: !!passwordHash }))(row);
    return { session, user, admin: isAdmin(session), dbError: false };
  } catch (error) {
    console.error("[dashboard] load account", error);
    return { session, user: null, admin: isAdmin(session), dbError: true };
  }
});

export const PROFILE_FIELDS = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
] as const;

export function profileCompleteness(user: Partial<Record<(typeof PROFILE_FIELDS)[number]["key"], string | null>>) {
  const missing = PROFILE_FIELDS.filter((f) => !user[f.key]?.trim());
  return {
    percent: Math.round(((PROFILE_FIELDS.length - missing.length) / PROFILE_FIELDS.length) * 100),
    missing: missing.map((f) => f.label),
  };
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}
