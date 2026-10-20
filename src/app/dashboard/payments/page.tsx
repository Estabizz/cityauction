import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "Payments & EMD",
};

export default function Page() {
  return (
    <ComingSoon
      title="Payments & EMD"
      subtitle="Earnest money deposits and fees."
      icon={<CreditCard className="h-6 w-6" />}
      description="Online EMD and fee payments are coming soon. No payments have been made through your account."
    />
  );
}
