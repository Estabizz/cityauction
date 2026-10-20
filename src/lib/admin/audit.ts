import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { AdminActor } from "./guard";

type Tx = Prisma.TransactionClient | typeof db;

export interface AuditEntry {
  action: string;
  entity: string;
  entityId: string;
  previousValue?: Prisma.InputJsonValue;
  newValue?: Prisma.InputJsonValue;
}

// One AuditLog row per admin change. Pass the transaction client when the
// change itself runs in a transaction so both land (or fail) together.
export async function writeAudit(actor: AdminActor, req: Request, entry: AuditEntry, tx: Tx = db) {
  const forwarded = req.headers.get("x-forwarded-for");
  await tx.auditLog.create({
    data: {
      userId: actor.id,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      previousValue: entry.previousValue,
      newValue: entry.newValue,
      ipAddress: (forwarded?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim().slice(0, 64) || null,
      userAgent: req.headers.get("user-agent")?.slice(0, 190) ?? null,
    },
  });
}
