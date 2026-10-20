import type { Metadata } from "next";
import { FolderLock } from "lucide-react";
import { ComingSoon } from "@/components/account/dashboard-ui";

export const metadata: Metadata = {
  title: "KYC & Documents",
};

export default function Page() {
  return (
    <ComingSoon
      title="KYC & Documents"
      subtitle="Identity and address documents for bidding."
      icon={<FolderLock className="h-6 w-6" />}
      description="Uploading KYC documents is coming soon. You'll be able to keep your PAN, address proof and other papers here."
    />
  );
}
