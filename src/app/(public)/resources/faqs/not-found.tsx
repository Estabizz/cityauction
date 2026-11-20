import Link from "next/link";

export default function FaqNotFound() {
  return <div className="container-wide py-16 text-center">
    <h1 className="text-2xl font-bold text-gray-900">We couldn’t find that FAQ</h1>
    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-600">Search the FAQ library or browse a topic to find the answer you need.</p>
    <Link href="/resources/faqs" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Browse all FAQs</Link>
  </div>;
}
