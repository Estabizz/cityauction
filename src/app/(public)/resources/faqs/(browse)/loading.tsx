export default function FaqsLoading() {
  return <div role="status" aria-busy="true" className="container-wide min-h-screen py-12">
    <span className="sr-only">Loading frequently asked questions…</span>
    <div aria-hidden="true" className="animate-pulse space-y-6">
      <div className="h-10 max-w-lg rounded-xl bg-gray-200" />
      <div className="h-28 rounded-2xl bg-gray-200" />
      {[1, 2, 3, 4].map(value => <div key={value} className="h-24 rounded-2xl border border-border bg-white" />)}
    </div>
  </div>;
}
