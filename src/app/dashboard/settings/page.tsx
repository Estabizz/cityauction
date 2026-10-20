import { redirect } from "next/navigation";

// Password and contact details now live on the profile page.
export default function SettingsPage() {
  redirect("/dashboard/profile");
}
