import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online bidding coming soon | CityAuction",
  description: "Contact CityAuction for help with auction participation.",
  robots: { index: false, follow: false },
};

export default function BiddingPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Online bidding is coming soon</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          CityAuction does not currently accept online bids or EMD payments.
          Our team can help you find the auction notice and understand the participation process.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="font-semibold text-primary underline">Contact our team</Link>
          <Link href="/auctions" className="font-semibold text-primary underline">Explore auctions</Link>
        </div>
      </div>
    </main>
  );
}
