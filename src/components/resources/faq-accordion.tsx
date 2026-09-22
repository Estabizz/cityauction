"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS_DATA: FAQItem[] = [
  // General
  {
    category: "General",
    question: "What is a Bank Auction or NPA property?",
    answer:
      "When a borrower defaults on a secured loan from a bank or financial institution, the creditor can initiate recovery proceedings under the SARFAESI Act, 2002 or through the Debts Recovery Tribunal (DRT). The mortgaged collateral property is auctioned publicly to recover unpaid dues, typically at 20% to 40% below prevalent open market rates.",
  },
  {
    category: "General",
    question: "What is the difference between SARFAESI and DRT auctions?",
    answer:
      "SARFAESI Act auctions are conducted directly by the secured creditor bank or ARC without civil court involvement for loans in default. DRT auctions are judicial recovery proceedings overseen by a court-appointed Recovery Officer under the Recovery of Debts and Bankruptcy Act, 1993.",
  },
  {
    category: "General",
    question: "Can an individual citizen participate in bank e-auctions?",
    answer:
      "Yes. Any Indian citizen of legal age, Non-Resident Indian (NRI), sole proprietorship, partnership firm, LLP, or registered corporate entity with a valid Permanent Account Number (PAN) and verified KYC can participate.",
  },
  // Bidding & EMD
  {
    category: "Bidding & EMD",
    question: "What is Earnest Money Deposit (EMD)?",
    answer:
      "EMD is a mandatory security deposit (usually 10% of the reserve price) required by the bank to ensure only genuine, serious bidders participate. If you do not win the auction, the EMD is refunded in full without deduction or interest to your registered bank account within 3 to 7 working days.",
  },
  {
    category: "Bidding & EMD",
    question: "How does live online bidding work?",
    answer:
      "Once your KYC and EMD are approved, you gain access to the secure online bidding room during the scheduled window. Bids start at or above the reserve price, and each increment must equal or exceed the minimum bid increment configured by the bank.",
  },
  {
    category: "Bidding & EMD",
    question: "What is the auto-extension rule in e-auctions?",
    answer:
      "If any bidder places a valid bid within the final 5 minutes of the auction, the countdown timer automatically extends by another 5 minutes. This ensures all participants have a fair opportunity to counter-bid and prevents 'bid sniping'.",
  },
  {
    category: "Bidding & EMD",
    question: "When is the remaining payment due after winning an auction?",
    answer:
      "The successful highest bidder (H1) must deposit 25% of the total purchase consideration (inclusive of EMD already paid) immediately on the day of auction or by the next business day. The remaining 75% balance must be remitted within 15 days of sale confirmation, or as extended in writing by the Authorised Officer.",
  },
  // Possession & Legal
  {
    category: "Possession & Legal",
    question: "What is the difference between Physical and Symbolic possession?",
    answer:
      "Physical possession means the bank has taken actual physical custody of the property with locks, and the buyer receives immediate key handover upon full payment. Symbolic possession means the bank has legal claim under Section 13(4) of SARFAESI, but actual physical eviction of the occupant may require Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) intervention under Section 14.",
  },
  {
    category: "Possession & Legal",
    question: "Who is responsible for past society maintenance, electricity bills, and municipal tax?",
    answer:
      "Under standard SARFAESI auctions, properties are sold on an 'as is where is' and 'whatever there is' basis. Bidders should inspect the property and verify outstanding statutory dues mentioned in the official Sale Notice before submitting their bids.",
  },
  {
    category: "Possession & Legal",
    question: "Can the borrower challenge the auction in court?",
    answer:
      "Borrowers can file an appeal before the Debts Recovery Tribunal under Section 17 of the SARFAESI Act within 45 days. However, the Supreme Court of India has established that once a registered Sale Certificate is issued and possession handed over to a bona fide auction purchaser, the sale is ordinarily irrevocable.",
  },
  // Documents & KYC
  {
    category: "Documents & KYC",
    question: "What documents are required to complete Bidder KYC?",
    answer:
      "Individual bidders require: PAN Card, Aadhaar Card / Passport (address proof), and a cancelled cheque for EMD refund routing. Companies require: Certificate of Incorporation, Memorandum & Articles of Association, Company PAN, Board Resolution authorizing the signatory, and the authorized person's KYC.",
  },
  {
    category: "Documents & KYC",
    question: "Is a Digital Signature Certificate (DSC) mandatory?",
    answer:
      "A Class 3 Digital Signature Certificate (Signing & Encryption) is required for certain high-value institutional e-auctions to cryptographically sign bids as per Ministry of Finance guidelines. For general SARFAESI auctions, web-based credentials with two-factor authentication (OTP) are frequently accepted.",
  },
];

export function FaqAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First item open by default

  const categories = ["All", "General", "Bidding & EMD", "Possession & Legal", "Documents & KYC"];

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleIndex = (idx: number) => {
    if (openIndexes.includes(idx)) {
      setOpenIndexes(openIndexes.filter((i) => i !== idx));
    } else {
      setOpenIndexes([...openIndexes, idx]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search questions (e.g. EMD refund, possession, KYC, DRT)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border border-border hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center text-gray-500 text-sm">
            No questions match your query. Try different keywords or contact our helpdesk.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-border overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span>Category: {faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
