import type { Metadata } from "next";
import { FileCheck } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Auction Applications",
};

export default function Page() {
  return (
    <ComingSoon
      title="Auction Applications"
      subtitle="Your requests to take part in auctions."
      icon={<FileCheck className="h-6 w-6" />}
      description="Applying to auctions through your account is coming soon. Meanwhile, our team can help you with any auction: just send an enquiry."
      cta={{ href: "/contact", label: "Send an enquiry" }}
    />
  );
}
