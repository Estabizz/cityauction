"use client";

import { useState } from "react";
import { MessageSquare, Search, Phone, Mail, CheckCircle2, Clock } from "lucide-react";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: "enq-1",
    name: "Rajesh Kumar",
    email: "rajesh.k@gmail.com",
    phone: "+91-9876543210",
    subject: "Property Inspection Request - DLF Cyber City",
    message: "I would like to schedule a physical site visit for Unit 504-506 on the scheduled inspection date with the authorised officer.",
    status: "NEW",
    createdAt: "30 mins ago",
  },
  {
    id: "enq-2",
    name: "Meera Subramanian",
    email: "meera.subramanian@outlook.com",
    phone: "+91-9444123456",
    subject: "EMD Payment & RTGS Challan Query",
    message: "Please provide the branch IFSC code and RTGS Virtual Account Number for the Kottivakkam penthouse auction.",
    status: "IN_PROGRESS",
    createdAt: "2 hours ago",
  },
  {
    id: "enq-3",
    name: "Anil Goel",
    email: "anil.goel@apexsteel.in",
    phone: "+91-9811223344",
    subject: "Sanand Industrial Land GIDC Transfer Fees",
    message: "Can you confirm whether GIDC transfer charges and municipal dues are cleared by the ARC prior to sale certificate issuance?",
    status: "RESOLVED",
    createdAt: "Yesterday",
  },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES);
  const [search, setSearch] = useState("");

  const handleStatusChange = (id: string, newStatus: "NEW" | "IN_PROGRESS" | "RESOLVED") => {
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const filtered = enquiries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries & Bidder Leads Console</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage prospective buyer inquiries, property inspection appointments, and institutional queries
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by sender name, subject, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-gray-50 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-border text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Sender & Contact</th>
                <th className="p-4">Subject & Message</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-gray-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-gray-900 block text-xs">{item.name}</span>
                    <span className="text-[11px] text-gray-500 block">{item.email}</span>
                    <span className="text-[11px] text-gray-500 font-mono">{item.phone}</span>
                  </td>

                  <td className="p-4 max-w-md">
                    <span className="font-bold text-gray-900 block text-xs mb-1">{item.subject}</span>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">{item.message}</p>
                  </td>

                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {item.createdAt}
                  </td>

                  <td className="p-4">
                    {item.status === "RESOLVED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </span>
                    ) : item.status === "IN_PROGRESS" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
                        <Clock className="h-3 w-3" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        New Lead
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg border border-border bg-white text-xs font-semibold text-gray-800 cursor-pointer"
                    >
                      <option value="NEW">Mark as New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
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
