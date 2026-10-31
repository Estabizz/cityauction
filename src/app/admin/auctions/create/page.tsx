import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin/guard";
import { PageHeader } from "@/components/admin/ui";
import { RecordEditor } from "@/components/admin/record-editor";

export const metadata: Metadata = { title: "Add auction notice" };
export default async function EditorPage() {
  await requireAdminPage();
  return <div className="space-y-6"><PageHeader eyebrow="Marketplace" title="Add auction notice" description="Save a draft, preview the notice, then publish after checking the original source." /><RecordEditor kind="auction" /></div>;
}
