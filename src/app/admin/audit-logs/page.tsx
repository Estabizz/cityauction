import { Suspense } from "react";
import type { Metadata } from "next";
import { AuditLogView } from "@/components/admin/audit-log-view";

export const metadata: Metadata = { title: "Audit log" };

export default function AdminAuditLogsPage() {
  return (
    <Suspense>
      <AuditLogView />
    </Suspense>
  );
}
