"use client";

import Link from "next/link";

export default function PublicPageError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="container-wide py-16">
      <div className="max-w-xl rounded-2xl border border-border bg-white p-8" role="alert">
        <h1 className="text-2xl font-bold text-primary">This page could not be loaded</h1>
        <p className="mt-3 text-sm text-gray-600">
          We could not retrieve the information right now. Please try again, or contact our team for assistance.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button onClick={() => retry()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Try again</button>
          <Link href="/contact" className="self-center text-sm font-semibold text-primary underline">Contact our team</Link>
        </div>
      </div>
    </div>
  );
}
