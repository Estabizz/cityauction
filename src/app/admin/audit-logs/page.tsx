import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert, Download, Lock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Statutory Audit Trail & CVC Logs | CityAuction",
  description: "Cryptographically preserved statutory audit logs for compliance with CVC and RBI e-auction guidelines.",
};

const AUDIT_LOGS = [
  {
    id: "log-101",
    action: "BID_PLACED",
    actor: "bidder@cityauction.com",
    entity: "Auction: CA-HR-2026-102",
    details: "Incremental bid placed for ₹3,21,50,000. Verified with DSC token.",
    ipAddress: "103.21.144.12",
    timestamp: "2026-09-22T09:45:12.420Z",
  },
  {
    id: "log-102",
    action: "PARTICIPANT_ADMITTED",
    actor: "admin@cityauction.com",
    entity: "Participant: usr-bidder-1",
    details: "EMD payment of ₹48,50,000 verified against SBI UTR SBINR520260918112233.",
    ipAddress: "14.139.58.66",
    timestamp: "2026-09-22T08:30:00.115Z",
  },
  {
    id: "log-103",
    action: "KYC_APPROVED",
    actor: "admin@cityauction.com",
    entity: "KycApplication: kyc-104",
    details: "PAN VWXYZ5678G matched against NSDL database. Address proof validated.",
    ipAddress: "14.139.58.66",
    timestamp: "2026-09-21T16:12:44.890Z",
  },
  {
    id: "log-104",
    action: "AUCTION_PUBLISHED",
    actor: "admin@cityauction.com",
    entity: "Auction: CA-MH-2026-101",
    details: "SARFAESI Form IV Sale Notice published. Reserve price: ₹4,85,00,000.",
    ipAddress: "14.139.58.66",
    timestamp: "2026-09-20T11:00:15.002Z",
  },
  {
    id: "log-105",
    action: "BIDDER_AUTHENTICATED",
    actor: "bidder@cityauction.com",
    entity: "Session: sess-9921",
    details: "Successful 2FA login via email verification.",
    ipAddress: "103.21.144.12",
    timestamp: "2026-09-20T10:45:00.320Z",
  },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statutory Audit Trail & CVC Records</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tamper-evident logs of all administrative actions, bid submissions, and KYC approvals for regulatory vigilance
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Download className="h-4 w-4 text-primary" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Compliance Guarantee Banner */}
      <div className="bg-primary-950 text-white rounded-2xl p-5 border border-primary-900 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-white">Central Vigilance Commission (CVC) & RBI Guideline Adherence</p>
          <p className="text-primary-300 leading-relaxed">
            All database modifications, electronic signature verifications, and tender admissions are stored in an append-only cryptographic ledger with source IP tracking to guarantee complete auditability in the event of judicial tribunal scrutiny.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Audit Details</th>
                <th className="p-4">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-4 font-bold text-primary font-mono">
                    {log.action}
                  </td>

                  <td className="p-4 font-semibold text-gray-900">
                    {log.actor}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-gray-600">
                    {log.entity}
                  </td>

                  <td className="p-4 max-w-sm text-gray-700 leading-relaxed">
                    {log.details}
                  </td>

                  <td className="p-4 font-mono text-gray-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
