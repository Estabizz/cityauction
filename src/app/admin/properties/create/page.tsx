import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin/guard";
import { PageHeader } from "@/components/admin/ui";
import { RecordEditor } from "@/components/admin/record-editor";

export const metadata: Metadata = { title: "Add property" };
export default async function EditorPage() {
  await requireAdminPage();
  return <div className="space-y-6"><PageHeader eyebrow="Marketplace" title="Add property" description="Keep the property, photos and institution details accurate." /><RecordEditor kind="property" /></div>;
}
