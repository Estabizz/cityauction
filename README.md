# CityAuction — Indian Bank Auction & Distressed Asset Platform

A production-grade, full-stack digital platform engineered for discovering, evaluating, and bidding on Indian bank auctions, NPA properties, SARFAESI assets, DRT sales, and distressed real estate.

Built with an original, institutional fintech design system inspired by the operational workflows of public and private sector lending institutions across India.

---

## 🏛️ Platform Highlights

- **Public Discovery & Filter Engine**:
  - Pan-India search across 36 States & Union Territories.
  - Multi-parameter filtering by Reserve Price presets, Property Category (Residential, Commercial, Industrial, Agricultural, Land), Possession Type (Physical, Symbolic), and Legal Framework (SARFAESI, DRT, Forward).
  - High-performance grid and list views with real-time statutory status badges.

- **Live Online Bidding Room (`/bidding/[id]`)**:
  - **Server-Authoritative Clock**: Real-time IST clock and countdown synchronization.
  - **SARFAESI Rule 9 Auto-Extension Engine**: Automatically triggers a 5-minute extension if a qualifying bid is submitted within the final 5 minutes of bidding, preventing predatory last-second bid sniping.
  - **H1 Showcase & Outbid Alerts**: Real-time leading bid display with synthesized Web Audio API chime alerts for bids and outbid events.
  - **Incremental Bidding Deck**: Quick increment presets (+1x, +2x, +5x, +10x) and custom bid validation with a 2-step legally binding offer confirmation modal.
  - **Spectator / Observer Mode**: Clear admission gating for guest/unadmitted users with instant EMD checkout activation.

- **Payment Gateway & Statutory Escrow Integration**:
  - **Dual Remittance Channels**: Instant online gateway (Razorpay enterprise simulation) and Public Sector Bank RTGS/NEFT Virtual Escrow Challan generator.
  - **Automatic Live Room Admission**: Instant clearance and Class-3 participant admission upon payment verification.
  - **RBI 72-Hour Refund Guarantee Ledger**: Complete dashboard tracking EMD deposits, live auction holds, and statutory 100% refunds to source accounts within 72 banking hours.

- **Bidder Dashboard (`/dashboard`)**:
  - Centralized portfolio management: Watchlist, Active Bids, Saved Search Alerts, and Application tracking.
  - **KYC & Document Vault**: Multi-document uploader supporting PAN Card (Section 139A validation), Aadhaar, Cancelled Cheques, and Class 3 Digital Signature Certificate (DSC) indicators.

- **Bank Recovery Officer & Admin Console (`/admin`)**:
  - 7 Institutional Modules:
    1. **Executive Recovery Overview**: Live auctions, portfolio valuation (₹485+ Cr), and CVC compliance metrics.
    2. **Statutory Publishing Wizard**: 4-step wizard with automatic 10% EMD calculation and Form IV Sale Notice PDF attachment.
    3. **Collateral Asset Inventory**: Catalog of secured assets with open market valuations.
    4. **KYC Review Queue**: Document inspection modal with one-click approval and customized officer remarks.
    5. **Participant Admission Console**: Real-time reconciliation of bank RTGS UTR numbers.
    6. **Enquiries & Investor Leads Console**: Lead tracking and assignment.
    7. **Statutory CVC & RBI Audit Trail**: Immutable event ledger capturing millisecond timestamps and source IPs.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.3.5 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with custom institutional Navy & Gold color tokens
- **Database & ORM**: PostgreSQL with Prisma ORM 6.19.3
- **Authentication**: JWT session tokens signed via `jose` (HS256) stored in HTTP-only secure cookies
- **Validation**: Zod schema validation
- **Security**: Password hashing with `bcryptjs`, Section 139A PAN validation, pre-signed upload size/MIME verification
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/Estabizz/cityauction.git
cd cityauction
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cityauction"
AUTH_SECRET="cityauction-super-secure-production-jwt-secret-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding (Optional)
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```
*(Note: In standalone or offline development mode, the application includes a resilient service layer that gracefully falls back to high-fidelity seed datasets without crashing).*

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Registered Bidder** | `bidder@cityauction.com` | `CityAuction@2026` | Live bidding room, EMD checkout, bids ledger, KYC vault |
| **Bank Recovery Officer** | `admin@cityauction.com` | `CityAuction@2026` | Statutory publishing wizard, KYC queue, RTGS reconciliation |

*(Note: The login page includes 1-click **"Fill Demo Bidder"** and **"Fill Demo Banker"** buttons for quick testing).*

---

## ⚖️ Legal & Compliance Framework

All auction listings, terms, and bidding processes conform to:
- **SARFAESI Act, 2002** (Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act)
- **Security Interest (Enforcement) Rules, 2002** (Rule 8 & 9)
- **Recovery of Debts and Bankruptcy Act, 1993 (DRT Guidelines)**
- **Central Vigilance Commission (CVC)** directives for transparent electronic public auctions
- **RBI Master Directions** on distressed asset resolution and EMD refund timelines

---

## 📄 License

Proprietary & Confidential. All rights reserved.
