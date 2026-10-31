import { recordHandlers } from "@/lib/admin/publishing-api";
const handlers = recordHandlers("property");
export const GET = handlers.GET;
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) { return handlers.save(req, ctx); }
