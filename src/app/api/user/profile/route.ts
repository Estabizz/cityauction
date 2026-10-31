import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/profile-schema";
import { isSameOriginRequest } from "@/lib/same-origin";
import { DB_UNAVAILABLE, jsonError, setSessionCookie, toSessionPayload, userWithRoles } from "@/app/api/auth/_lib";

export async function PATCH(req: Request) {
  const session = await getCurrentUser(); if (!session) return jsonError("Please sign in.", 401);
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  const input = profileSchema.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ success: false, error: input.error.issues[0]?.message, fields: Object.fromEntries(input.error.issues.map((issue) => [issue.path.join("."), issue.message])) }, { status: 400 });
  const data = input.data;
  try {
    const result = await db.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id: session.userId }, include: { bidderProfile: true } });
      if (!current || !current.isActive || current.deletedAt || current.sessionVersion !== (session.sv ?? 0)) return { error: "Please sign in again.", status: 401 } as const;
      if (data.email !== (current.email?.trim().toLowerCase() || "")) return { error: "Use email verification to change your sign-in email.", status: 400 } as const;
      const company = current.bidderProfile;
      const locked = company && company.status !== "INCOMPLETE";
      if (locked && (data.accountType !== (current.accountType || "INDIVIDUAL") || data.companyName !== (company.companyName || "").trim() || data.gstNumber !== (company.gstNumber || "").trim().toUpperCase())) return { error: "Company details are already under review or approved. Contact the team to correct them.", status: 409 } as const;
      const changed = await tx.user.updateMany({ where: { id: current.id, updatedAt: new Date(data.updatedAt), isActive: true, deletedAt: null, sessionVersion: current.sessionVersion }, data: {
        fullName: data.fullName, phone: data.phone || null, ...(data.phone !== (current.phone || "") ? { isPhoneVerified: false } : {}),
        accountType: data.accountType, buyerCategory: (data.buyerCategory || null) as never, address: data.address || null, city: data.city || null, state: data.state || null, pincode: data.pincode || null,
      } });
      if (changed.count !== 1) return { error: "Your profile changed in another session. Reload the page before saving.", status: 409 } as const;
      if (!locked && company) {
        const changedCompany = await tx.bidderProfile.updateMany({ where: { userId: current.id, status: "INCOMPLETE", updatedAt: company.updatedAt }, data: { companyName: data.companyName || null, gstNumber: data.gstNumber || null } });
        if (changedCompany.count !== 1) throw new Error("COMPANY_PROFILE_CHANGED");
      } else if (!company && data.accountType === "ORGANIZATION") {
        await tx.bidderProfile.create({ data: { userId: current.id, companyName: data.companyName, gstNumber: data.gstNumber || null } });
      }
      const user = await tx.user.findUniqueOrThrow({ where: { id: current.id }, include: userWithRoles });
      return { user } as const;
    });
    if ("error" in result) return jsonError(result.error!, result.status ?? 400);
    const response = NextResponse.json({ success: true, message: "Profile saved.", updatedAt: result.user.updatedAt.toISOString() });
    await setSessionCookie(response, toSessionPayload(result.user)); return response;
  } catch (error) {
    if ((error instanceof Error && error.message === "COMPANY_PROFILE_CHANGED") || (error && typeof error === "object" && "code" in error && error.code === "P2002")) return jsonError("Company details changed. Reload your profile before saving again.", 409);
    console.error("[user/profile] save failed", error); return jsonError(DB_UNAVAILABLE, 503); }
}
