import Link from "next/link";
import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us & Regional Helpdesk | CityAuction",
  description:
    "Get in touch with CityAuction support team for bidder registration, KYC assistance, EMD queries, and bank auction participation across India.",
};

const REGIONAL_DESKS = [
  {
    region: "Northern Region (HQ & Delhi NCR)",
    city: "Gurugram, Haryana",
    address: "Plot No. 68, 3rd Floor, Sector - 44, Gurugram, Haryana - 122003",
    phone: "+91-124-4302020 / 21",
    email: "north.desk@cityauction.com",
  },
  {
    region: "Western Region (Mumbai & Gujarat)",
    city: "Mumbai, Maharashtra",
    address: "B-Wing, 8th Floor, Trade World, Senapati Bapat Marg, Lower Parel, Mumbai - 400013",
    phone: "+91-22-66981200 / 01",
    email: "west.desk@cityauction.com",
  },
  {
    region: "Southern Region (Bangalore & Chennai)",
    city: "Bangalore, Karnataka",
    address: "No. 14, 2nd Floor, MG Road, Ashok Nagar, Bangalore, Karnataka - 560001",
    phone: "+91-80-22129800",
    email: "south.desk@cityauction.com",
  },
  {
    region: "Eastern Region (Kolkata & WB)",
    city: "Kolkata, West Bengal",
    address: "Chowringhee Court, 4th Floor, 55 Chowringhee Road, Kolkata - 700071",
    phone: "+91-33-22824000",
    email: "east.desk@cityauction.com",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <nav className="text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <span className="text-gray-900 font-medium">Contact Us</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Bidder Helpdesk & Regional Offices
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
            Need assistance with an upcoming e-auction, KYC verification, or EMD deposit? Our auction specialists and regional support executives are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Send an Online Enquiry</h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill out the form below and an auction coordinator will reach out to you within 2 business hours.
            </p>
            <ContactForm />
          </div>

          {/* Quick Helplines Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary-900 text-white rounded-2xl p-6 shadow-md border border-primary-800">
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                <Headphones className="h-4 w-4" />
                Central Helpline
              </div>
              <h3 className="text-xl font-bold">National Auction Support</h3>
              <p className="text-xs text-primary-200 mt-1 mb-5">
                Available Monday – Saturday (9:00 AM to 6:30 PM IST)
              </p>

              <div className="space-y-3.5 text-xs text-primary-100 border-t border-primary-800 pt-4">
                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">+91-124-4302020 / 21 / 22</span>
                    <span className="text-[11px] text-primary-300">Toll-free Bidding Assistance</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">support@cityauction.com</span>
                    <span className="text-[11px] text-primary-300">24x7 Email Ticketing</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-white">Working Hours</span>
                    <span className="text-[11px] text-primary-300">Mon - Fri: 9am - 6pm | Sat: 10am - 3pm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow & Payment Verification Guarantee */}
            <div className="bg-white rounded-2xl border border-border p-5 text-xs text-gray-600 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <ShieldCheck className="h-4 w-4 text-primary" />
                EMD & Payment Inquiries
              </div>
              <p className="leading-relaxed">
                For EMD reconciliation and real-time RTGS/NEFT confirmation, please keep your UTR Number and Auction ID handy when contacting the desk.
              </p>
            </div>
          </div>
        </div>

        {/* Regional Offices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Support Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGIONAL_DESKS.map((desk, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  {desk.region}
                </span>
                <h3 className="text-base font-bold text-gray-900">{desk.city}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desk.address}</p>
                <div className="pt-3 border-t border-border space-y-1 text-xs text-gray-700">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {desk.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {desk.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
