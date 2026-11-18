import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ListKaro | Shopify to Indian Marketplaces in 1-Click",
  description:
    "Take your Shopify catalog and get it ready for Amazon.in, Flipkart, Meesho, Myntra, and JioMart in one click. AI rewrites every listing to each marketplace's rules, HSN codes, GST slabs, and bulk export sheets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
