import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Saved Searches",
};

export default function Page() {
  return (
    <ComingSoon
      title="Saved Searches"
      subtitle="Searches you want to re-run or be alerted about."
      icon={<Search className="h-6 w-6" />}
      description="Saved searches are coming soon. For now, set up personalised auction alerts and we'll send you matching auctions."
      cta={{ href: "/auction-alerts", label: "Set up auction alerts" }}
    />
  );
}
