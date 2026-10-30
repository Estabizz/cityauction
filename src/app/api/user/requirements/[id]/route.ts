import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { defaultRequirementName, requirementSchema, withAllowedChannels } from "@/lib/requirement-schema";
import { DB_UNAVAILABLE, jsonError, validationError } from "@/app/api/auth/_lib";

type Ctx = { params: Promise<{ id: string }> };

const NOT_FOUND = "This requirement no longer exists.";

// Either a full edit, or just { alertsEnabled } to pause / resume its alerts.
const toggleSchema = z.object({ alertsEnabled: z.boolean() }).strict();

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);
  const { id } = await ctx.params;

  let data: z.infer<typeof toggleSchema> | z.infer<typeof requirementSchema>;
  try {
    const body = await req.json();
    const toggle = toggleSchema.safeParse(body);
    if (toggle.success) data = toggle.data;
    else {
      const full = requirementSchema.parse(body);
      data = { ...(await withAllowedChannels(full, session.userId)), name: full.name || defaultRequirementName(full) };
    }
  } catch (error) {
    if (error instanceof z.ZodError) return validationError(error);
    return jsonError("Please check the form and try again.", 400);
  }

  try {
    // userId in the filter: buyers can only change their own requirements.
    const { count } = await db.buyerRequirement.updateMany({ where: { id, userId: session.userId }, data });
    if (count === 0) return jsonError(NOT_FOUND, 404);
    const record = await db.buyerRequirement.findUnique({ where: { id } });
    return NextResponse.json({ success: true, message: "Requirement updated.", data: record });
  } catch (error) {
    console.error("[user/requirements] PATCH", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getCurrentUser();
  if (!session) return jsonError("Please sign in.", 401);
  const { id } = await ctx.params;

  try {
    const { count } = await db.buyerRequirement.deleteMany({ where: { id, userId: session.userId } });
    if (count === 0) return jsonError(NOT_FOUND, 404);
    return NextResponse.json({ success: true, message: "Requirement deleted." });
  } catch (error) {
    console.error("[user/requirements] DELETE", error);
    return jsonError(DB_UNAVAILABLE, 503);
  }
}
