import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Saved Properties",
};

export default function Page() {
  return (
    <ComingSoon
      title="Saved Properties"
      subtitle="Properties you've saved to look at later."
      icon={<Heart className="h-6 w-6" />}
      description="Saving properties to your account is coming soon. For now, set up alerts and we'll send you matching auctions."
      cta={{ href: "/auction-alerts", label: "Set up auction alerts" }}
    />
  );
}
