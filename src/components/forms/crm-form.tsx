const FORMS = {
  contact: { id: "S7nLTeZoR7PYkJSwN7tA", name: "CA | Contact Us and Enquiry Routing", height: 1279 },
  subscribe: { id: "5SPNMmEqHffQbQQ34w71", name: "CA | Subscribe and Auction Updates", height: 1220 },
} as const;

/** The public layout loads the provider's resize script once for both forms. */
export function CrmForm({ kind }: { kind: keyof typeof FORMS }) {
  const form = FORMS[kind];
  return (
    <div className="mx-auto w-full min-w-0 max-w-[850px]" data-cityauction-crm-form={kind}>
      <iframe
        src={`https://api.leadconnectorhq.com/widget/form/${form.id}`}
        style={{ width: "100%", height: form.height, border: "none", borderRadius: 8, display: "block" }}
        id={`inline-${form.id}`}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={form.name}
        data-height={form.height}
        data-layout-iframe-id={`inline-${form.id}`}
        data-form-id={form.id}
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title={form.name}
      />
      <p className="mt-3 text-sm text-[#84663c]">
        Having trouble loading the form?{" "}
        <a href={`https://api.leadconnectorhq.com/widget/form/${form.id}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open {kind === "contact" ? "the enquiry form" : "the subscription form"} in a new tab</a>.
      </p>
    </div>
  );
}

export function CrmHomeEnquiry() {
  return <div className="min-w-0 p-4 sm:p-8 lg:p-10" aria-labelledby="home-contact-heading">
    <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#84663c]">Start a conversation</p>
    <h3 id="home-contact-heading" className="mt-2 text-2xl font-semibold tracking-tight text-[#182129]">How can we help?</h3>
    <p className="mb-6 mt-2 text-sm text-[#687480]">Tell us a little about what you need.</p>
    <CrmForm kind="contact" />
  </div>;
}

export function CrmContactForm({ listing, listingUnavailable = false, initialSubject = "" }: {
  listing?: { id: string; auctionNumber: string; title: string };
  listingUnavailable?: boolean;
  initialSubject?: string;
}) {
  return <div className="mx-auto w-full min-w-0 max-w-[850px]">
    {listing && <p className="mb-4 rounded-xl bg-white p-4 text-sm text-[#182129]">Enquiry about <strong>{listing.title}</strong>. Please include auction reference <strong>{listing.auctionNumber}</strong> in your message.</p>}
    {!listing && initialSubject && <p className="mb-4 rounded-xl bg-white p-4 text-sm text-[#182129]">Topic: <strong>{initialSubject}</strong>. Include this topic in your enquiry.</p>}
    {listingUnavailable && <p className="mb-4 rounded-xl bg-white p-4 text-sm text-[#182129]">We could not load the selected listing. You can still include its reference in your enquiry.</p>}
    <CrmForm kind="contact" />
  </div>;
}
