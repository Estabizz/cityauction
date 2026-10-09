import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CityAuction | Auction Assets, Investor Support, Liquidation & Strategic Opportunities",
    template: "%s | CityAuction",
  },
  description:
    "CityAuction is an auction and asset opportunity ecosystem for buyers, investors, Banks, NBFCs, ARCs, Liquidators, developers and companies. Discover auctions, create alerts, access due diligence support, liquidate assets, explore Customs auctions and strategic Next Chapter opportunities.",
  keywords: [
    "bank auction",
    "NPA property",
    "SARFAESI auction",
    "DRT auction",
    "Customs auction",
    "Asset liquidation",
    "property auction India",
    "distressed property",
    "foreclosure auction",
    "e-auction",
  ],
  authors: [{ name: "CityAuction" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CityAuction",
    title: "CityAuction | See Beyond the Auction",
    description:
      "Discover, understand, acquire, liquidate and unlock the next chapter of institutional assets and strategic opportunities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CityAuction | See Beyond the Auction",
    description:
      "Discover, understand, acquire, liquidate and unlock the next chapter of institutional assets and strategic opportunities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CityAuction",
  url: "https://cityauction.accounts-c12.workers.dev/",
  parentOrganization: {
    "@type": "Organization",
    name: "Estabizz Fintech Private Limited",
  },
  telephone: "+91 98256 69668",
  email: "info@estabizz.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gyan Marg, PDPU Road, Raysan",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  description:
    "Auction and asset opportunity ecosystem for buyers, investors and institutional stakeholders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} ${manrope.variable} h-full`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans-body antialiased bg-[#fbf9f5] text-[#182129]">
        {children}
      </body>
    </html>
  );
}

