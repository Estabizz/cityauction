import { db } from "@/lib/db";
import { EXPORT_LIMIT, csvFilename, csvResponse, toCsv } from "@/lib/admin/csv";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { subscriberWhere } from "@/lib/admin/query";
import { istStamp } from "@/lib/admin/time";

export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const where = subscriberWhere(new URL(req.url).searchParams);
    const rows = await db.subscriber.findMany({ where, orderBy: { createdAt: "desc" }, take: EXPORT_LIMIT });

    const csv = toCsv(
      ["Subscribed (IST)", "Email", "Name", "Status", "Source", "Page", "Last change (IST)"],
      rows.map((r) => [istStamp(r.createdAt), r.email, r.name, r.status, r.source, r.pagePath, istStamp(r.updatedAt)])
    );
    return csvResponse(csvFilename("cityauction-subscribers"), csv);
  } catch (err) {
    console.error("[admin] subscribers export failed", err);
    return jsonError("Could not export subscribers.", 500);
  }
}
