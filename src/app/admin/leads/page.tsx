import { Suspense } from "react";
import type { Metadata } from "next";
import { LeadsView } from "@/components/admin/leads-view";

export const metadata: Metadata = { title: "Leads" };

export default function AdminLeadsPage() {
  return (
    <Suspense>
      <LeadsView />
    </Suspense>
  );
}
