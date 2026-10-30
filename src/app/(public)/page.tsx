import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Factory, Handshake, Heart, Home, ListChecks, Mail, MapPin, MapPinned, Package, Phone, Search, ShieldCheck, Target, Tractor } from "lucide-react";
import { HomeSearch } from "@/components/home/home-search";
import { HomeEnquiryForm } from "@/components/home/home-enquiry";
import { HOME_ASSETS, HOME_SERVICES, HOME_STEPS } from "@/content/homepage";
import { cardClass } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "CityAuction | Auction Assets, Investor Support & Institutional Services",
  description: "Discover institutional auction assets across India. Search by location and budget, save opportunities and get support from the CityAuction team.",
  alternates: { canonical: "https://cityauction.in" },
  openGraph: {
    title: "CityAuction — See beyond the auction",
    description: "Discover auction assets, evaluate opportunities and connect with the right support.",
    url: "https://cityauction.in",
    images: [{ url: "https://cityauction.in/images/cityauction-architecture.webp", width: 1664, height: 936, alt: "Architectural illustration for CityAuction" }],
  },
};

const icons = { Home, Building2, Factory, MapPinned, Tractor, Package, Search, ShieldCheck, Handshake, Target };
const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const section = "py-14 sm:py-20";
const eyebrow = "text-xs font-semibold uppercase tracking-[.16em] text-[#84663c]";
const heading = "mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#182129] sm:text-4xl";
const textLink = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#84663c] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c]";

export default function HomePage() {
  return <div id="mainContent" className="bg-white text-[#182129]">
    <section className="relative isolate overflow-hidden bg-[#0c1822]" aria-labelledby="home-heading">
      <Image src="/images/cityauction-architecture.webp" alt="" fill preload sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#091118]/95 via-[#091118]/75 to-[#091118]/35" />
      <div className={`${container} grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20`}>
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#d9c39c]">Auction assets. Clearer decisions.</p>
          <h1 id="home-heading" className="font-serif-heading mt-5 text-5xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">See beyond the auction.<span className="mt-2 block text-[#dbc39a]">Discover what it could become.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#d2dbe1] sm:text-lg">Find auction assets, evaluate opportunities and get the support you need to move forward.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/auctions" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d9c39c] px-5 text-sm font-semibold text-[#091118] transition-colors hover:bg-[#ead8b7]">Explore auctions<ArrowRight className="h-4 w-4" /></Link>
            <a href="#help" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">How we can help</a>
          </div>
          <p className="mt-6 max-w-md text-xs leading-relaxed text-[#bdc9d2]">Source-checked notices. Optional professional support. Bidding takes place on the authorised auction platform.</p>
        </div>
        <HomeSearch />
      </div>
    </section>

    <section className="border-b border-[#e4e8ec] bg-[#f8fafb] py-6" aria-label="Your CityAuction account">
      <div className={`${container} grid gap-5 sm:grid-cols-3 sm:gap-8`}>
        {[
          { icon: ShieldCheck, title: "Source-checked notices", text: "Review the source and official auction terms." },
          { icon: Heart, title: "Save opportunities", text: "Keep your shortlisted properties in one place." },
          { icon: ListChecks, title: "Track enquiries", text: "Follow your support and inspection requests." },
        ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#84663c]" /><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-relaxed text-[#687480]">{text}</p></div></div>)}
      </div>
    </section>

    <section id="auctions" className={section} aria-labelledby="assets-heading">
      <div className={container}>
        <div id="asset-types" className="flex flex-wrap items-end justify-between gap-4">
          <div><p className={eyebrow}>Explore by asset</p><h2 id="assets-heading" className={heading}>Start with what you know.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-[#687480]">Browse published auction notices by property category.</p></div>
          <Link href="/auctions" className={textLink}>View all auctions<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_ASSETS.map((asset) => {
            const Icon = icons[asset.icon];
            return <Link key={asset.value} href={`/auctions?category=${asset.value}`} className={`${cardClass} group flex min-w-0 items-start gap-4 p-5 transition-colors hover:border-[#b49361] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c] sm:p-6`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f1e9] text-[#84663c]"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1"><h3 className="font-semibold">{asset.title}</h3><p className="mt-1 text-sm leading-relaxed text-[#687480]">{asset.description}</p></div><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#98a1ab] group-hover:text-[#84663c]" />
            </Link>;
          })}
        </div>
        <div id="closing-soon" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f8fafb] px-5 py-3">
          <p className="text-sm text-[#687480]">Looking for an approaching auction?</p>
          <Link href="/auctions?status=CLOSING_SOON&sort=closing_soon" className={textLink}>Browse closing auctions<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>

    <section id="help" className={`${section} bg-[#f8fafb]`} aria-labelledby="services-heading">
      <div className={container}>
        <p className={eyebrow}>The right support</p><h2 id="services-heading" className={heading}>What brings you to CityAuction?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#687480]">Buying, selling or planning your next move—we can help you find the right desk.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_SERVICES.map((service) => {
            const Icon = icons[service.icon];
            return <article key={service.title} id={"anchor" in service ? service.anchor : undefined} className={`${cardClass} flex flex-col p-6`}>
              <Icon className="h-6 w-6 text-[#84663c]" /><h3 className="mt-4 text-lg font-semibold tracking-tight">{service.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-[#687480]">{service.description}</p><Link href={service.href} className={`${textLink} mt-4`}>{service.link}<ArrowRight className="h-4 w-4" /></Link>
            </article>;
          })}
        </div>
      </div>
    </section>

    <section className={section} aria-labelledby="steps-heading">
      <div className={container}>
        <p className={eyebrow}>A clear next step</p><h2 id="steps-heading" className={heading}>Find. Evaluate. Move forward.</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {HOME_STEPS.map((step, index) => <article key={step.title} className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9c39c] text-sm font-semibold text-[#84663c]">{index + 1}</span><div><h3 className="text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#687480]">{step.description}</p></div></article>)}
        </div>
        <div className="mt-8"><Link href="/how-it-works" className={textLink}>See how CityAuction works<ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>

    <section className="bg-[#132330] py-10 text-white sm:py-12" aria-labelledby="notice-heading">
      <div className={`${container} grid items-center gap-6 lg:grid-cols-[1fr_auto]`}>
        <div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#d9c39c]" /><div><h2 id="notice-heading" className="text-xl font-semibold tracking-tight">Know what verification means.</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#c3ced6]">We check auction particulars against a published or institution-provided notice. This does not certify title, possession, encumbrances or value. Always complete your own due diligence.</p></div></div>
        <Link href="/verified-information-policy" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9c39c] underline-offset-4 hover:underline">Our verification policy<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>

    <section id="contact" className={`${section} bg-[#f8fafb]`} aria-labelledby="contact-section-heading">
      <div className={container}>
        <div className="mb-7"><p className={eyebrow}>Contact CityAuction</p><h2 id="contact-section-heading" className={heading}>Let’s talk about your next step.</h2><p className="mt-3 text-sm text-[#687480]">For buying, selling or getting expert support.</p></div>
        <div className="grid overflow-hidden rounded-3xl border border-[#e4e8ec] bg-white shadow-[0_12px_48px_-28px_rgba(24,33,41,.2)] lg:grid-cols-[.85fr_1.15fr]">
          <aside className="bg-[#132330] p-6 text-white sm:p-8 lg:p-10" aria-label="Contact details">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d9c39c]">CityAuction</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">A person to help you move forward.</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-[#c3ced6]">Auction support, asset sales and business opportunities.</p>
            <div className="mt-8 space-y-6">
              <a href="tel:+919825669668" className="flex min-h-11 items-start gap-3 text-sm hover:text-[#d9c39c]"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#d9c39c]" /><span><span className="mb-1 block text-xs text-[#aebbc5]">Call us</span>+91 98256 69668</span></a>
              <a href="mailto:info@estabizz.com" className="flex min-h-11 items-start gap-3 text-sm hover:text-[#d9c39c]"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#d9c39c]" /><span className="min-w-0 break-all"><span className="mb-1 block text-xs text-[#aebbc5]">Email us</span>info@estabizz.com</span></a>
              <div className="flex items-start gap-3 text-sm"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d9c39c]" /><div><p className="mb-1 text-xs text-[#aebbc5]">Visit our office</p><p className="max-w-xs leading-relaxed">Gyan Marg, PDPU Road, Raysan,<br />Gandhinagar, Gujarat.</p></div></div>
            </div>
            <a href="https://wa.me/919825669668" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 text-sm font-semibold hover:bg-white/10">Chat on WhatsApp<ArrowRight className="h-4 w-4" /></a>
            <p className="mt-8 border-t border-white/15 pt-5 text-xs leading-relaxed text-[#aebbc5]">A venture of Estabizz Fintech Private Limited.</p>
          </aside>
          <HomeEnquiryForm />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#687480]"><p>Want to know more about CityAuction?</p><Link href="/about" className={textLink}>Meet CityAuction<ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  </div>;
}
