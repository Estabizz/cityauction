import { CrmForm } from "@/components/forms/crm-form";

type SubscribeBoxProps = {
  variant: "footer" | "section";
  source: "footer" | "homepage";
};

export function SubscribeBox({ variant, source }: SubscribeBoxProps) {
  return <section className="mb-12 w-full min-w-0 rounded-2xl border border-[#1a242b] bg-[#0a1116] p-4 sm:p-7" aria-labelledby={`subscribe-${variant}-heading`} data-form-source={source}>
    <div className="mx-auto mb-6 w-full max-w-[850px]">
      <div className="eyebrow-text">Stay updated</div>
      <h2 id={`subscribe-${variant}-heading`} className="mt-2 font-serif-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">Stay informed with CityAuction</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#aab3ba]">Sign up for occasional news and auction updates.</p>
    </div>
    <CrmForm kind="subscribe" />
  </section>;
}
