import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { pageParams, subscriberWhere } from "@/lib/admin/query";

export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const params = new URL(req.url).searchParams;
    const { page, pageSize, skip } = pageParams(params);
    const where = subscriberWhere(params);

    const [total, rows, byStatus] = await Promise.all([
      db.subscriber.count({ where }),
      db.subscriber.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      db.subscriber.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all]));
    return NextResponse.json(
      { success: true, data: rows, total, page, pageSize, counts },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin] subscribers list failed", err);
    return jsonError("Could not load subscribers.", 500);
  }
}
