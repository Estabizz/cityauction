import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "KYC Verification",
};

export default function Page() {
  return (
    <ComingSoon
      title="KYC Verification"
      subtitle="Verify your identity to take part in auctions."
      icon={<ShieldCheck className="h-6 w-6" />}
      description="Online KYC verification is coming soon. We'll let you know when you can complete it here."
    />
  );
}
