import { recordHandlers } from "@/lib/admin/publishing-api";
export async function POST(req: Request) { return recordHandlers("property").save(req); }
