import type { Metadata } from "next";
import { Gavel } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "My Bids",
};

export default function Page() {
  return (
    <ComingSoon
      title="My Bids"
      subtitle="Bids you place in online auctions."
      icon={<Gavel className="h-6 w-6" />}
      description="Online bidding isn't open on CityAuction yet. When it is, your bids and their status will appear here."
    />
  );
}
