import { marketplaceUnavailable } from "@/lib/marketplace-availability";

// Keep the legacy simulation unreachable until this feature has a verified workflow.
export async function PATCH() {
  return marketplaceUnavailable("Online KYC review");
}
