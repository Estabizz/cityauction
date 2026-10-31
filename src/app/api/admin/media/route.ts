import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin/guard";
import { isSameOriginRequest } from "@/lib/same-origin";
import { storeMedia, validateMedia } from "@/lib/admin/media-storage";
import { writeAudit } from "@/lib/admin/audit";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const guard = await requireAdminApi(); if (guard.error) return guard.error;
  if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
  if (Number(req.headers.get("content-length")) > 11 * 1024 * 1024) return jsonError("The file is too large.", 413);
  try {
    const recent = await db.auditLog.count({ where: { userId: guard.actor.id, action: "MEDIA_UPLOADED", timestamp: { gt: new Date(Date.now() - 86400000) } } });
    if (recent >= 100) return jsonError("Daily upload limit reached. Please try again tomorrow.", 429);
    // Bound the multipart body even when Content-Length is absent or incorrect.
    const reader = req.body?.getReader(); if (!reader) return jsonError("Choose a file.");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const next = await reader.read(); if (next.done) break; size += next.value.byteLength;
      if (size > 11 * 1024 * 1024) { await reader.cancel(); return jsonError("The file is too large.", 413); } chunks.push(next.value); }
    const body = Buffer.concat(chunks);
    const form = await new Request(req.url, { method: "POST", headers: { "content-type": req.headers.get("content-type") || "" }, body }).formData();
    const file = form.get("file");
    if (!file || typeof file === "string" || !("arrayBuffer" in file)) return jsonError("Choose a file.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    try { validateMedia(bytes, file.type); } catch (error) { return jsonError(error instanceof Error ? error.message : "Unsupported file."); }
    const data = await storeMedia(bytes, file.type);
    await writeAudit(guard.actor, req, { action: "MEDIA_UPLOADED", entity: "Media", entityId: data.key, newValue: { mimeType: data.mimeType, fileSize: data.fileSize } });
    return NextResponse.json({ success: true, data: { ...data, name: file.name.slice(0, 191) } });
  } catch (error) {
    console.error("[admin] media upload failed", error);
    return jsonError("The file could not be stored. Please retry or attach an existing HTTPS file URL. Your form has been kept.", 503);
  }
}
