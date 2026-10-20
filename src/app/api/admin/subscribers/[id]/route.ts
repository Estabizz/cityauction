import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin/audit";
import { SUBSCRIBER_STATUSES } from "@/lib/admin/constants";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({ status: z.enum(SUBSCRIBER_STATUSES) });

// Unsubscribe or reactivate one subscriber.
export async function PATCH(req: Request, ctx: Ctx) {
  const { actor, error } = await requireAdminApi();
  if (error) return error;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Status must be ACTIVE or UNSUBSCRIBED.");
  const { status } = parsed.data;

  try {
    const { id } = await ctx.params;
    const updated = await db.$transaction(async (tx) => {
      const sub = await tx.subscriber.findUnique({ where: { id } });
      if (!sub) return null;
      if (sub.status === status) return sub;
      await writeAudit(actor, req, {
        action: status === "UNSUBSCRIBED" ? "SUBSCRIBER_UNSUBSCRIBED" : "SUBSCRIBER_REACTIVATED",
        entity: "Subscriber",
        entityId: id,
        previousValue: { email: sub.email, status: sub.status },
        newValue: { email: sub.email, status },
      }, tx);
      return tx.subscriber.update({ where: { id }, data: { status } });
    });

    if (!updated) return jsonError("Subscriber not found.", 404);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[admin] subscriber update failed", err);
    return jsonError("Could not update this subscriber.", 500);
  }
}
