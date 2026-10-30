import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicSessionProvider } from "@/components/account/session-provider";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const initialSession = user ? { fullName: user.fullName, email: user.email, isAdmin: isAdmin(user) } : null;
  return (
    <PublicSessionProvider initialSession={initialSession}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </PublicSessionProvider>
  );
}
