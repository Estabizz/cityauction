import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { publishingCatalog } from "@/lib/admin/publishing";
import { writeAudit } from "@/lib/admin/audit";
import { isSameOriginRequest } from "@/lib/same-origin";
import { generateSlug } from "@/lib/utils";
export async function GET() {
  const guard = await requireAdminApi(); if (guard.error) return guard.error;
  try { return NextResponse.json({ success: true, data: await publishingCatalog() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return jsonError("Could not load the property and institution choices. Please retry.", 503); }
}
export async function POST(req: Request) {
  const guard = await requireAdminApi(); if (guard.error) return guard.error;
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  const input = z.object({ name: z.string().trim().min(3).max(191), type: z.enum(["BANK", "NBFC", "ARC", "GOVERNMENT", "DRT", "HOUSING_FINANCE", "COOPERATIVE_BANK", "OTHER"]) }).safeParse(await req.json().catch(() => null));
  if (!input.success) return jsonError(input.error.issues[0]?.message || "Check the institution details.");
  try {
    const data = await db.$transaction(async (tx) => {
      const existing = await tx.organization.findFirst({ where: { name: input.data.name, type: input.data.type, isActive: true } });
      if (existing) return existing;
      const created = await tx.organization.create({ data: { ...input.data, slug: `${generateSlug(input.data.name).slice(0, 140) || "institution"}-${randomUUID().slice(0, 8)}` } });
      await writeAudit(guard.actor, req, { action: "INSTITUTION_CREATED", entity: "Organization", entityId: created.id, newValue: input.data }, tx);
      return created;
    });
    return NextResponse.json({ success: true, data: { id: data.id, name: data.name } });
  } catch { return jsonError("Could not save the institution. Please try again.", 503); }
}
