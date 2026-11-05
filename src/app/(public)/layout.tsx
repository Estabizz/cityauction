import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicSessionProvider } from "@/components/account/session-provider";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import Script from "next/script";

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
      <Script id="cityauction-crm-form-embed" src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
      <Script
        id="cityauction-visitor-tracking"
        src="https://link.msgsndr.com/js/external-tracking.js"
        data-tracking-id="tk_6f04cbc3e3aa413cb0a217245acf68f7"
        strategy="afterInteractive"
      />
      <Script
        id="cityauction-chat-widget"
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="6aec176011a83697cea7a680"
        strategy="afterInteractive"
      />
    </PublicSessionProvider>
  );
}
