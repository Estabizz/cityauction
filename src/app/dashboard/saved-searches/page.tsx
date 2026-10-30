import { redirect } from "next/navigation";

// Saved searches became buyer requirements (each one is also an alert).
export default function SavedSearchesPage() {
  redirect("/dashboard/requirements");
}
