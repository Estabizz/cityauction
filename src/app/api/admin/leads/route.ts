import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LEAD_SOURCES, sourceLabel } from "@/lib/admin/constants";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { leadWhere, pageParams } from "@/lib/admin/query";

export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const params = new URL(req.url).searchParams;
    const { page, pageSize, skip } = pageParams(params);
    const where = leadWhere(params);

    const [total, rows, sources] = await Promise.all([
      db.enquiry.count({ where }),
      db.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: { user: { select: { id: true, email: true, fullName: true } } },
      }),
      db.enquiry.groupBy({ by: ["source"], _count: { _all: true } }),
    ]);

    // Every known form plus any other source already in the table, for the filter.
    const counts = new Map(sources.map((s) => [s.source, s._count._all]));
    const sourceOptions = [...new Set([...LEAD_SOURCES.map((s) => s.value), ...counts.keys()])].map((value) => ({
      value,
      label: sourceLabel(value),
      count: counts.get(value) ?? 0,
    }));

    return NextResponse.json(
      { success: true, data: rows, total, page, pageSize, sources: sourceOptions },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[admin] leads list failed", err);
    return jsonError("Could not load leads.", 500);
  }
}
