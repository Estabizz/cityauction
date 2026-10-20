import { db } from "@/lib/db";
import { ENQUIRY_STATUS_LABELS, sourceLabel } from "@/lib/admin/constants";
import { EXPORT_LIMIT, csvFilename, csvResponse, toCsv } from "@/lib/admin/csv";
import { jsonError, requireAdminApi } from "@/lib/admin/guard";
import { leadWhere } from "@/lib/admin/query";
import { istStamp } from "@/lib/admin/time";

// Same filters as the leads list; downloads every matching row (up to 10,000).
export async function GET(req: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const where = leadWhere(new URL(req.url).searchParams);
    const rows = await db.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: EXPORT_LIMIT });

    const csv = toCsv(
      ["Received (IST)", "Source", "Status", "Name", "Email", "Phone", "Subject", "Message", "Page", "Signed-in user ID", "Details", "Admin notes", "Lead ID"],
      rows.map((r) => [
        istStamp(r.createdAt),
        sourceLabel(r.source),
        ENQUIRY_STATUS_LABELS[r.status],
        r.name,
        r.email,
        r.phone,
        r.subject,
        r.message,
        r.pagePath,
        r.userId,
        r.metadata,
        r.adminNotes,
        r.id,
      ])
    );
    return csvResponse(csvFilename("cityauction-leads"), csv);
  } catch (err) {
    console.error("[admin] leads export failed", err);
    return jsonError("Could not export leads.", 500);
  }
}
