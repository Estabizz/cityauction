"use client";

import { useState } from "react";
import { Lock, Bell, Shield, Smartphone, Mail, CheckCircle2, Save } from "lucide-react";

export default function SettingsPage() {
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    outbidInstant: true,
    newsletter: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your password, login security credentials, and auction notification alerts
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-success-50 border border-success-200 text-success-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved successfully.
        </div>
      )}

      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          Change Password
        </h2>

        <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Repeat new password"
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notification Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-gray-900">Email Auction Alerts</span>
              <span className="text-[11px] text-gray-500">
                Receive email alerts for new properties matching your saved searches.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              className="h-4 w-4 text-primary rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-gray-900">Instant Outbid SMS & Push Alerts</span>
              <span className="text-[11px] text-gray-500">
                Receive immediate high-priority SMS notifications when another bidder surpasses your bid.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.outbidInstant}
              onChange={(e) => setNotifications({ ...notifications, outbidInstant: e.target.checked })}
              className="h-4 w-4 text-primary rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-gray-900">EMD Status & Officer Approvals</span>
              <span className="text-[11px] text-gray-500">
                Real-time SMS alerts when a bank Authorised Officer verifies your EMD remittance.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
              className="h-4 w-4 text-primary rounded border-border"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
