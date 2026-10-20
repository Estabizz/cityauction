import { Suspense } from "react";
import type { Metadata } from "next";
import { SubscribersView } from "@/components/admin/subscribers-view";

export const metadata: Metadata = { title: "Subscribers" };

export default function AdminSubscribersPage() {
  return (
    <Suspense>
      <SubscribersView />
    </Suspense>
  );
}
