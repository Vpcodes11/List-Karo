"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CalculatorWidget } from "@/components/calculator-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
  Check,
  TrendingUp,
  Tag,
  Eye,
} from "lucide-react";
import { MarketplaceId } from "@/types";

export default function HomePage() {
  const [selectedShowroomMarketplace, setSelectedShowroomMarketplace] = useState<MarketplaceId>("amazon");
  const [activeShowroomProduct, setActiveShowroomProduct] = useState(0);

  const SHOWROOM_PRODUCTS = [
    {
      title: "Royal Chanderi Silk Saree with Zari Border",
      vendor: "Virasat Weaves",
      category: "Ethnic Wear",
      price: 2499,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      hsn: "520851",
      gst: 5,
      material: "Pure Chanderi Silk",
      amazonTitle: "Virasat Weaves Royal Chanderi Silk Saree with Zari Floral Border for Women (Emerald Green, Free Size)",
      flipkartTitle: "Virasat Weaves Woven Chanderi Silk Saree For Women (Pack of 1)",
      meeshoTitle: "Heavy Chanderi Silk Saree with Rich Golden Zari Pallu",
      myntraTitle: "Virasat Weaves Women Emerald Green Traditional Chanderi Silk Saree",
      jiomartTitle: "Virasat Weaves Emerald Chanderi Silk Saree with Blouse Piece",
    },
    {
      title: "Men's 100% Pure Cambric Cotton Regular Fit Kurta",
      vendor: "Kasturi Ethnica",
      category: "Men's Clothing",
      price: 899,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
      hsn: "620520",
      gst: 5,
      material: "100% Cambric Cotton",
      amazonTitle: "Kasturi Ethnica Men's 100% Pure Cambric Cotton Regular Fit Mandarin Collar Kurta (Ivory White)",
      flipkartTitle: "Kasturi Ethnica Men Solid Pure Cotton Straight Kurta (White)",
      meeshoTitle: "Pure Cotton Men Kurta - Chest Sizes 38 to 44 Available",
      myntraTitle: "Kasturi Ethnica Men White Pure Cotton Mandarin Collar Kurta",
      jiomartTitle: "Kasturi Ethnica Men's Ivory Cotton Festive Kurta (Standard Pack)",
    },
    {
      title: "Handcrafted Antique Brass Peacock Oil Lamp Diya",
      vendor: "Diyas of India",
      category: "Home & Decor",
      price: 1299,
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      hsn: "741999",
      gst: 12,
      material: "Cast Solid Brass",
      amazonTitle: "Diyas of India Handcrafted Antique Brass Peacock Oil Lamp Diya for Pooja and Mandir (8 Inch)",
      flipkartTitle: "Diyas of India Brass Peacock Table Diya (Pack of 1, Height 8 inch)",
      meeshoTitle: "Solid Brass Traditional Peacock Diya for Pooja & Gifting",
      myntraTitle: "Diyas of India Gold-Toned Handcrafted Antique Peacock Brass Diya",
      jiomartTitle: "Diyas of India Hand-Cast Solid Brass Peacock Oil Diya",
    },
  ];

  const currentProduct = SHOWROOM_PRODUCTS[activeShowroomProduct];

  const getMarketplaceTitle = (mId: MarketplaceId) => {
    switch (mId) {
      case "amazon": return currentProduct.amazonTitle;
      case "flipkart": return currentProduct.flipkartTitle;
      case "meesho": return currentProduct.meeshoTitle;
      case "myntra": return currentProduct.myntraTitle;
      case "jiomart": return currentProduct.jiomartTitle;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Pinterest Hero */}
        <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
          {/* Subtle warm organic background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-amber-100/40 via-rose-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              {/* Refined Pill Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-terracotta animate-pulse" />
                <span className="tracking-wide">For Indian D2C Creators & Brands</span>
              </div>

              {/* Grand Serif Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.08]">
                From your Shopify store to India’s{" "}
                <span className="italic font-normal text-terracotta">
                  grandest marketplaces.
                </span>
              </h1>

              {/* Elevated Subtitle */}
              <p className="mx-auto max-w-2xl text-base sm:text-xl text-stone-600 font-light leading-relaxed">
                Take your Shopify catalog and get it immediately cataloged, verified, and exported for{" "}
                <strong className="font-semibold text-stone-900">Amazon.in, Flipkart, Meesho, Myntra, and JioMart</strong>.
                AI rewrites titles to exact length formulas, generates 5 bullet points, suggests 6-digit HSN codes & GST slabs, and audits image compliance.
              </p>

              {/* CTA Group */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="h-13 px-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-sm shadow-pin hover:shadow-pin-hover transition-all duration-300 gap-2"
                  >
                    <span>Launch with Demo Catalog</span>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </Button>
                </Link>
                <Link href="#showroom">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 rounded-full border-stone-300 bg-white/70 hover:bg-white text-stone-800 font-medium text-sm shadow-sm"
                  >
                    <span>Explore Transformation Studio</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" /> Pure White Background Check
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" /> Legal Metrology Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" /> Zero Fake Reviews / Scarcity
                </span>
              </div>
            </div>

            {/* Pinterest Moodboard / Masonry Showcase */}
            <div className="mt-20">
              <div className="text-center mb-8">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-600">
                  Curated Catalog Transformation
                </span>
              </div>

              {/* Masonry Pin Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {/* Pin 1: Saree (Amazon Prime Ready) */}
                <div className="group rounded-3xl bg-white border border-stone-200/70 p-3.5 shadow-pin hover:shadow-pin-hover transition-all duration-500 hover:-translate-y-1">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                      alt="Chanderi Silk Saree"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-stone-900/85 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-white tracking-wide">
                        Amazon.in Ready
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono font-medium text-stone-700 shadow-sm">
                        HSN 520851 · 5% GST
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="rounded-full bg-emerald-600 text-white px-2.5 py-1 text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <Check className="h-3 w-3" /> White BG Pass
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-4 space-y-1">
                    <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider">
                      Virasat Weaves
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug line-clamp-2">
                      Royal Chanderi Silk Saree with Golden Zari Pallu
                    </h4>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-stone-900 text-base">₹2,499</span>
                      <span className="text-[11px] text-stone-600">5 Bullets Generated</span>
                    </div>
                  </div>
                </div>

                {/* Pin 2: Kurta (Myntra Luxe) */}
                <div className="group rounded-3xl bg-white border border-stone-200/70 p-3.5 shadow-pin hover:shadow-pin-hover transition-all duration-500 hover:-translate-y-1 lg:translate-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
                      alt="Men's Cotton Kurta"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-[#FF3F6C] text-white px-3 py-1 text-[10px] font-semibold tracking-wide">
                        Myntra Stylesheet
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono font-medium text-stone-700 shadow-sm">
                        HSN 620520 · Size M(40)
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-white/90 backdrop-blur-md text-stone-800 px-2.5 py-1 text-[10px] font-semibold shadow-sm">
                        Style Note Attached
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-4 space-y-1">
                    <span className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
                      Kasturi Ethnica
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug line-clamp-2">
                      100% Pure Cambric Cotton Regular Fit Mandarin Kurta
                    </h4>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-stone-900 text-base">₹899</span>
                      <span className="text-[11px] text-stone-600">Material & Care Tagged</span>
                    </div>
                  </div>
                </div>

                {/* Pin 3: Brass Diya (Flipkart & JioMart) */}
                <div className="group rounded-3xl bg-white border border-stone-200/70 p-3.5 shadow-pin hover:shadow-pin-hover transition-all duration-500 hover:-translate-y-1">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                      alt="Solid Brass Diya"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-[#2874F0] text-white px-3 py-1 text-[10px] font-semibold tracking-wide">
                        Flipkart FSN Ready
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono font-medium text-stone-700 shadow-sm">
                        HSN 741999 · 12% GST
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="rounded-full bg-stone-900 text-white px-2.5 py-1 text-[10px] font-semibold shadow-sm">
                        Legal Metrology Pass
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-4 space-y-1">
                    <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">
                      Diyas of India
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug line-clamp-2">
                      Handcrafted Antique Brass Peacock Oil Lamp Diya
                    </h4>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-stone-900 text-base">₹1,299</span>
                      <span className="text-[11px] text-stone-600">Pack Details Mapped</span>
                    </div>
                  </div>
                </div>

                {/* Pin 4: Leather Kolhapuri (Meesho Value Buy) */}
                <div className="group rounded-3xl bg-white border border-stone-200/70 p-3.5 shadow-pin hover:shadow-pin-hover transition-all duration-500 hover:-translate-y-1 lg:translate-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                      alt="Leather Kolhapuri Footwear"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-[#9F2089] text-white px-3 py-1 text-[10px] font-semibold tracking-wide">
                        Meesho Supplier Sheet
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono font-medium text-stone-700 shadow-sm">
                        HSN 640399 · 18% GST
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-emerald-600 text-white px-2.5 py-1 text-[10px] font-bold shadow-sm">
                        0% Commission
                      </span>
                    </div>
                  </div>
                  <div className="p-3 pt-4 space-y-1">
                    <span className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
                      Kolhapur Craft
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug line-clamp-2">
                      Handmade Pure Leather Kolhapuri Chappals
                    </h4>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-stone-900 text-base">₹1,499</span>
                      <span className="text-[11px] text-stone-600">Size Chart In Inches</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 5 Marketplace Platforms Shelf */}
        <section id="marketplaces" className="py-20 border-y border-stone-200/80 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-terracotta block mb-2">
                  Unified Multi-Channel Powerhouse
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  One Catalog. Five Distinct Rulesets.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md leading-relaxed">
                Never get penalized or rejected by seller portals. ListKaro applies the exact length limits, brand-first rules, and legal declarations required by each platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Amazon */}
              <div className="rounded-3xl border border-stone-200 p-6 bg-sand-50/50 hover:bg-white hover:shadow-pin transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-lg text-stone-900">Amazon.in</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF9900]" />
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Brand first in title (max 200)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>5 structured bullet points</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Pure white BG mandatory</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-600">
                  Flat File Inventory Loader
                </div>
              </div>

              {/* Flipkart */}
              <div className="rounded-3xl border border-stone-200 p-6 bg-sand-50/50 hover:bg-white hover:shadow-pin transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-lg text-stone-900">Flipkart</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2874F0]" />
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Title max 80 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Vertical taxonomy mapped</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>3-5 key specs highlighted</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-600">
                  Bulk Catalog CSV Format
                </div>
              </div>

              {/* Meesho */}
              <div className="rounded-3xl border border-stone-200 p-6 bg-sand-50/50 hover:bg-white hover:shadow-pin transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-lg text-stone-900">Meesho</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9F2089]" />
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Value-driven concise copy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Chest size chart in inches</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Wrong return price setup</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-600">
                  Supplier Bulk Upload XLSX
                </div>
              </div>

              {/* Myntra */}
              <div className="rounded-3xl border border-stone-200 p-6 bg-sand-50/50 hover:bg-white hover:shadow-pin transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-lg text-stone-900">Myntra</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF3F6C]" />
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Editorial Style Note tone</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Detailed Material & Care</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Model size & height specs</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-600">
                  Partner Portal Stylesheet
                </div>
              </div>

              {/* JioMart */}
              <div className="rounded-3xl border border-stone-200 p-6 bg-sand-50/50 hover:bg-white hover:shadow-pin transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-lg text-stone-900">JioMart</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0078AD]" />
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Pack size & net quantity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Legal Metrology details</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-stone-800" />
                    <span>Customer care declaration</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-600">
                  Seller Hub Merchant Sheet
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Transformation Studio (Interactive Showroom) */}
        <section id="showroom" className="py-24 bg-[#FAF8F5]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
                Interactive Transformation Studio
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                Watch raw Shopify listings become <span className="italic font-normal text-terracotta">marketplace-ready</span>.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                Select an authentic Indian product and switch between marketplaces to see the real-time title formatting, 6-digit HSN assignment, and compliance packaging.
              </p>

              {/* Product Selector Pills */}
              <div className="pt-4 flex flex-wrap justify-center gap-2">
                {SHOWROOM_PRODUCTS.map((prod, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveShowroomProduct(idx)}
                    className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                      activeShowroomProduct === idx
                        ? "bg-stone-900 text-white shadow-sm font-semibold"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {prod.vendor}: {prod.title.split(" ").slice(0, 3).join(" ")}...
                  </button>
                ))}
              </div>
            </div>

            {/* Split Lookbook Card */}
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 shadow-pin">
              {/* Marketplace Selector Tabs inside Showroom */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Target Format:
                  </span>
                  {(["amazon", "flipkart", "meesho", "myntra", "jiomart"] as MarketplaceId[]).map((mId) => (
                    <button
                      key={mId}
                      onClick={() => setSelectedShowroomMarketplace(mId)}
                      className={`capitalize rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                        selectedShowroomMarketplace === mId
                          ? "bg-terracotta text-white shadow-sm"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {mId}
                    </button>
                  ))}
                </div>

                <Badge variant="outline" className="text-xs font-mono bg-sand-50 text-stone-600">
                  Automated HSN: {currentProduct.hsn} · {currentProduct.gst}% GST
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Raw Shopify */}
                <div className="lg:col-span-5 space-y-4 bg-stone-50/70 p-6 rounded-2xl border border-stone-200/60">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Raw Shopify Ingestion
                    </span>
                    <Badge variant="destructive" className="text-[10px]">
                      Rejections Expected
                    </Badge>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-white border">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Shopify Title</span>
                      <p className="font-mono text-stone-800 text-[11px] font-semibold">{currentProduct.title}</p>
                      <p className="text-[10px] text-rose-500 mt-0.5">⚠️ Missing Brand First for Amazon, no FSN vertical tags</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px] font-mono">
                      <div className="text-rose-500">❌ HSN Code: Not Set</div>
                      <div className="text-rose-500">❌ GST Slab: None</div>
                      <div className="text-rose-500">❌ Bullets: Missing</div>
                      <div className="text-rose-500">❌ Origin: Undeclared</div>
                    </div>
                  </div>
                </div>

                {/* Center Magic Divider */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shadow-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    AI Rewrite Engine
                  </span>
                  <div className="text-[10px] text-stone-600 max-w-[120px] text-center">
                    Zod Validated · 6-Digit HSN Lookup · 0 Fake Reviews
                  </div>
                </div>

                {/* Right: ListKaro Marketplace Pin */}
                <div className="lg:col-span-5 space-y-4 bg-sand-100/60 p-6 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      ListKaro {selectedShowroomMarketplace.toUpperCase()} Output
                    </span>
                    <Badge variant="success" className="text-[10px] bg-emerald-600 text-white font-bold">
                      100% Policy Pass
                    </Badge>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase">Compliant Formatted Title</span>
                      <p className="font-serif font-bold text-stone-900 text-sm leading-snug">
                        {getMarketplaceTitle(selectedShowroomMarketplace)}
                      </p>
                    </div>

                    {/* Verified Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                        <span className="text-[10px] text-stone-400 block uppercase">HSN Code</span>
                        <span className="font-mono font-bold text-stone-800">{currentProduct.hsn}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                        <span className="text-[10px] text-stone-400 block uppercase">GST Tax Slab</span>
                        <span className="font-mono font-bold text-stone-800">{currentProduct.gst}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                        <span className="text-[10px] text-stone-400 block uppercase">Country of Origin</span>
                        <span className="font-bold text-stone-800">India</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                        <span className="text-[10px] text-stone-400 block uppercase">Image Purity</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="h-3 w-3" /> RGB 255 Pass
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-stone-600 italic leading-relaxed">
                      "Includes 5 structured capital-lead bullet points covering fabric weave, occasion, sizing in inches, and legal packer contact details."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Marketplace Profit Simulator Section */}
        <section id="calculator" className="py-24 border-t border-stone-200/80 bg-white">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <CalculatorWidget />
          </div>
        </section>

        {/* Editorial Invitation / Bottom CTA */}
        <section className="py-24 bg-[#FAF8F5]">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-3xl border border-stone-300/80 bg-stone-900 text-stone-100 p-10 sm:p-16 shadow-pin relative overflow-hidden text-center space-y-6">
              {/* Subtle ambient terracotta glow */}
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
                Begin Your Multi-Channel Expansion
              </span>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight max-w-2xl mx-auto leading-tight">
                Scale your Indian brand to crores of new shoppers.
              </h2>

              <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto font-light leading-relaxed">
                Connect your Shopify store. Experience instant category matching, automated 6-digit HSN codes, and official bulk-upload spreadsheets.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="h-13 px-8 rounded-full bg-terracotta hover:bg-terracotta-hover text-white font-medium text-sm shadow-md transition-all gap-2"
                  >
                    <span>Launch Free Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 rounded-full border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white font-medium text-sm"
                  >
                    <span>Explore Pricing (₹999/mo)</span>
                  </Button>
                </Link>
              </div>

              <div className="pt-6 text-xs text-stone-500 font-light">
                Free tier includes 10 products · No credit card required to test · Verified Indian HSN & GST codes
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
