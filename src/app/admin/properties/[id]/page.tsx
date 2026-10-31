import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin/guard";
import { PageHeader } from "@/components/admin/ui";
import { RecordEditor } from "@/components/admin/record-editor";

export const metadata: Metadata = { title: "Edit property" };
export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  return <div className="space-y-6"><PageHeader eyebrow="Marketplace" title="Edit property" description="Keep the property, photos and institution details accurate." /><RecordEditor kind="property" id={id} /></div>;
}
