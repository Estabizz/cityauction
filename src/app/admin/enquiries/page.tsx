import { redirect } from "next/navigation";

// Old address for the leads list.
export default function AdminEnquiriesPage() {
  redirect("/admin/leads");
}
