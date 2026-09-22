import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "CityAuction — Bank Auction & NPA Property Platform",
    template: "%s | CityAuction",
  },
  description:
    "Discover verified bank auction properties across India. Search SARFAESI, DRT, and NPA auctions from 300+ banks. Residential, commercial, industrial, and agricultural properties at competitive prices.",
  keywords: [
    "bank auction",
    "NPA property",
    "SARFAESI auction",
    "DRT auction",
    "property auction India",
    "bank auction property",
    "distressed property",
    "foreclosure auction",
    "e-auction",
    "auction property",
  ],
  authors: [{ name: "CityAuction" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CityAuction",
    title: "CityAuction — Bank Auction & NPA Property Platform",
    description:
      "Discover verified bank auction properties across India. Search SARFAESI, DRT, and NPA auctions from 300+ banks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CityAuction — Bank Auction & NPA Property Platform",
    description:
      "Discover verified bank auction properties across India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
