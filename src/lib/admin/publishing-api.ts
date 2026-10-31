import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdminApi } from "./guard";
import { isSameOriginRequest } from "@/lib/same-origin";
import { auctionSchema, propertySchema, PublishingError } from "./publishing-schema";
import { auctionRecord, propertyRecord, saveAuction, saveProperty, unpublishAuction } from "./publishing";

type Ctx = { params: Promise<{ id: string }> };
export function recordHandlers(kind: "property" | "auction") {
  return {
    async GET(_req: Request, ctx: Ctx) {
      const guard = await requireAdminApi(); if (guard.error) return guard.error;
      try {
        const { id } = await ctx.params;
        const data = await (kind === "property" ? propertyRecord(id) : auctionRecord(id));
        return data ? NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } }) : jsonError("Record not found.", 404);
      } catch { return jsonError("Could not load this record. Please try again.", 503); }
    },
    async save(req: Request, ctx?: Ctx) {
      const guard = await requireAdminApi(); if (guard.error) return guard.error;
      if (!isSameOriginRequest(req)) return jsonError("Invalid request origin.", 403);
      try {
        const body = await req.json();
        const id = ctx ? (await ctx.params).id : null;
        let saved: string;
        if (kind === "auction" && body?.action === "unpublish" && id) {
          const input = z.object({ updatedAt: z.string().datetime() }).parse(body);
          saved = await unpublishAuction(id, input.updatedAt, guard.actor, req);
        } else saved = kind === "property" ? await saveProperty(propertySchema.parse(body), id, guard.actor, req) : await saveAuction(auctionSchema.parse(body), id, guard.actor, req);
        return NextResponse.json({ success: true, id: saved, redirectTo: `/admin/${kind === "property" ? "properties" : "auctions"}/${encodeURIComponent(saved)}` });
      } catch (error) {
        if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: error.issues[0]?.message, fields: Object.fromEntries(error.issues.map((issue) => [issue.path.join("."), issue.message])) }, { status: 400 });
        if (error instanceof PublishingError) return jsonError(error.message, error.status);
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") return jsonError("That auction number or identifier already exists. Please use the existing record.", 409);
        console.error("[admin] publishing save failed", error);
        return jsonError("The record could not be saved. Your changes are still in the form. Please try again.", 503);
      }
    },
  };
}
