import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { pageParams } from "@/lib/admin/query";
import { dateRangeFilter } from "@/lib/admin/time";

export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const params = new URL(req.url).searchParams;
    const { page, pageSize, skip } = pageParams(params);

    const where: Prisma.AuditLogWhereInput = {};
    const entity = params.get("entity");
    if (entity) where.entity = entity;
    const action = params.get("action");
    if (action) where.action = action;
    const entityId = params.get("entityId");
    if (entityId) where.entityId = entityId;
    const timestamp = dateRangeFilter(params.get("from"), params.get("to"));
    if (timestamp) where.timestamp = timestamp;
    const q = params.get("q")?.trim().slice(0, 100);
    if (q) where.user = { OR: [{ email: { contains: q } }, { fullName: { contains: q } }] };

    const [total, rows, actions, entities] = await Promise.all([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: pageSize,
        include: { user: { select: { id: true, email: true, fullName: true } } },
      }),
      db.auditLog.groupBy({ by: ["action"], _count: { _all: true }, orderBy: { action: "asc" } }),
      db.auditLog.groupBy({ by: ["entity"], _count: { _all: true }, orderBy: { entity: "asc" } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: rows,
        total,
        page,
        pageSize,
        actions: actions.map((a) => a.action),
        entities: entities.map((e) => e.entity),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin] audit log list failed", err);
    return jsonError("Could not load audit logs.", 500);
  }
}
