import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin/audit";
import { ENQUIRY_STATUSES } from "@/lib/admin/constants";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";

type Ctx = { params: Promise<{ id: string }> };

const userSelect = { id: true, email: true, fullName: true, phone: true, isActive: true } as const;

export async function GET(_req: Request, ctx: Ctx) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const { id } = await ctx.params;
    const lead = await db.enquiry.findUnique({ where: { id }, include: { user: { select: userSelect } } });
    if (!lead) return jsonError("Lead not found.", 404);

    // Not signed in when they wrote? Still point at an account with the same email
    // (useful for password-reset requests).
    const matchedUser =
      lead.user ?? (await db.user.findFirst({ where: { email: lead.email, deletedAt: null }, select: userSelect }));

    const history = await db.auditLog.findMany({
      where: { entity: "Enquiry", entityId: id },
      orderBy: { timestamp: "desc" },
      take: 50,
      include: { user: { select: { email: true, fullName: true } } },
    });

    return NextResponse.json({ success: true, data: { lead, matchedUser, history } });
  } catch (err) {
    console.error("[admin] lead detail failed", err);
    return jsonError("Could not load this lead.", 500);
  }
}

const patchSchema = z
  .object({
    status: z.enum(ENQUIRY_STATUSES).optional(),
    note: z.string().trim().min(1).max(4000).optional(),
  })
  .refine((body) => body.status || body.note, { message: "Nothing to change." });

// Change status and/or add a note. Notes are appended with a timestamp and the
// admin's name, so earlier notes are never lost.
export async function PATCH(req: Request, ctx: Ctx) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request.");
  const { status, note } = parsed.data;

  try {
    const { id } = await ctx.params;
    const updated = await db.$transaction(async (tx) => {
      const lead = await tx.enquiry.findUnique({ where: { id } });
      if (!lead) return null;

      const data: { status?: (typeof ENQUIRY_STATUSES)[number]; adminNotes?: string } = {};
      if (status && status !== lead.status) {
        data.status = status;
        await writeAudit(actor, req, {
          action: "LEAD_STATUS_CHANGED",
          entity: "Enquiry",
          entityId: id,
          previousValue: { status: lead.status },
          newValue: { status },
        }, tx);
      }
      if (note) {
        const stamp = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const line = `[${stamp} · ${actor.fullName || actor.email}] ${note}`;
        data.adminNotes = lead.adminNotes ? `${lead.adminNotes}\n${line}` : line;
        await writeAudit(actor, req, {
          action: "LEAD_NOTE_ADDED",
          entity: "Enquiry",
          entityId: id,
          newValue: { note },
        }, tx);
      }
      if (!data.status && !data.adminNotes) return lead;
      return tx.enquiry.update({ where: { id }, data });
    });

    if (!updated) return jsonError("Lead not found.", 404);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[admin] lead update failed", err);
    return jsonError("Could not update this lead.", 500);
  }
}
