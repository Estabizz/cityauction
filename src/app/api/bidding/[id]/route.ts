import { marketplaceUnavailable } from "@/lib/marketplace-availability";

// Keep the legacy simulation unreachable until this feature has a verified workflow.
export async function GET() {
  return marketplaceUnavailable("Online bidding");
}
