"use client";

import { useState } from "react";
import { User, Mail, Phone, CreditCard, Building2, MapPin, CheckCircle2, ShieldCheck, Save } from "lucide-react";
import { INDIAN_STATES } from "@/lib/constants";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Vikramaditya Sharma",
    email: "bidder@cityauction.com",
    phone: "+91-9876543211",
    pan: "VWXYZ5678G",
    accountType: "INDIVIDUAL",
    address: "Flat 1204, Sea Breeze Towers, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    bankName: "State Bank of India",
    bankAccountName: "Vikramaditya Sharma",
    bankAccountNumber: "109823471029",
    bankIfsc: "SBIN0001234",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bidder Profile & Account Details</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal information, registered address, and bank account for EMD refund disbursements
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-success-50 border border-success-200 text-success-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity & Legal Information */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
            <span>1. Identity Information</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700">
              <ShieldCheck className="h-4 w-4" />
              Verified with NSDL / Income Tax
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                disabled
                value={profile.pan}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-100 text-sm font-mono text-gray-500 uppercase cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Verified Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Registered Physical Address */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">2. Registered Communication Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Street Address / Premises
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* EMD Refund Bank Account */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">3. Bank Account for EMD Refund Routing</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Unsuccessful auction bid deposits are automatically refunded to this account. Must match the account holder name on your PAN.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Account Holder Name
              </label>
              <input
                type="text"
                value={profile.bankAccountName}
                onChange={(e) => setProfile({ ...profile, bankAccountName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Bank Account Number
              </label>
              <input
                type="text"
                value={profile.bankAccountNumber}
                onChange={(e) => setProfile({ ...profile, bankAccountNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Bank IFSC Code
              </label>
              <input
                type="text"
                value={profile.bankIfsc}
                onChange={(e) => setProfile({ ...profile, bankIfsc: e.target.value.toUpperCase() })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm font-mono uppercase text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
