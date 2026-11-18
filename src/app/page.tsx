import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CalculatorWidget } from "@/components/calculator-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Built for Indian D2C Shopify Merchants</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
                Turn your Shopify catalog into Indian marketplace listings in{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  1-Click.
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-relaxed sm:text-xl">
                Ready for <strong>Amazon.in, Flipkart, Meesho, Myntra, and JioMart</strong>.
                AI rewrites titles, generates 5 bullet points, suggests verified 6-digit <strong>HSN codes & GST slabs</strong>, audits image backgrounds, and exports official bulk-upload sheets.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base shadow-lg shadow-blue-600/25 gap-2">
                    <span>Try with Demo Catalog</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    View Pricing (from ₹999/mo)
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Zero fake reviews / scarcity
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> AES-256 encrypted tokens
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Legal Metrology compliant
                </span>
              </div>
            </div>

            {/* Marketplace Logos Banner */}
            <div id="marketplaces" className="mt-16 rounded-2xl border bg-white/70 p-6 backdrop-blur-sm shadow-sm">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
                Direct Format & Policy Engine for India's 5 Largest Marketplaces
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 items-center justify-items-center">
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-slate-50/60 w-full justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#FF9900]" />
                  <span className="font-bold text-slate-800">Amazon.in</span>
                  <Badge variant="outline" className="text-[10px] ml-1 bg-amber-50 text-amber-700 border-amber-200">Flat File</Badge>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-slate-50/60 w-full justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#2874F0]" />
                  <span className="font-bold text-slate-800">Flipkart</span>
                  <Badge variant="outline" className="text-[10px] ml-1 bg-blue-50 text-blue-700 border-blue-200">Bulk CSV</Badge>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-slate-50/60 w-full justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#9F2089]" />
                  <span className="font-bold text-slate-800">Meesho</span>
                  <Badge variant="outline" className="text-[10px] ml-1 bg-purple-50 text-purple-700 border-purple-200">Supplier XLSX</Badge>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-slate-50/60 w-full justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#FF3F6C]" />
                  <span className="font-bold text-slate-800">Myntra</span>
                  <Badge variant="outline" className="text-[10px] ml-1 bg-pink-50 text-pink-700 border-pink-200">Partner Sheet</Badge>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-slate-50/60 w-full justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#0078AD]" />
                  <span className="font-bold text-slate-800">JioMart</span>
                  <Badge variant="outline" className="text-[10px] ml-1 bg-cyan-50 text-cyan-700 border-cyan-200">Seller Hub</Badge>
                </div>
              </div>
            </div>

            {/* Before vs After Showcase */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before: Raw Shopify */}
              <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-red-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Un-optimized Shopify Source
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Fails Marketplace Ingestion
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Product Title</span>
                    <p className="font-mono text-sm text-slate-800">Casual Cotton Shirt - Blue</p>
                    <p className="text-[11px] text-red-600 mt-0.5">⚠️ Missing Brand First (Amazon), no fit or pack details (Flipkart)</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Attributes & Taxation</span>
                    <p className="text-xs text-red-600">❌ No HSN Code (Mandatory for GST invoice)</p>
                    <p className="text-xs text-red-600">❌ No GST Slab defined</p>
                    <p className="text-xs text-red-600">❌ No Country of Origin or Manufacturer address</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Bullets & Description</span>
                    <p className="text-xs text-slate-600 italic">"Nice comfortable shirt for casual wear."</p>
                    <p className="text-[11px] text-red-600 mt-0.5">⚠️ Fails Amazon 5-bullet requirement (only 1 short sentence)</p>
                  </div>
                </div>
              </div>

              {/* After: ListKaro Rewritten */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    ListKaro AI Optimized (Amazon.in)
                  </span>
                  <Badge variant="success" className="text-xs">
                    100% Policy Compliant
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Optimized Title</span>
                    <p className="font-semibold text-sm text-slate-900">
                      Kasturi Ethnica Men's 100% Pure Cambric Cotton Regular Fit Casual Shirt (Navy Blue)
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">✓ Brand first · 185 chars · Title case · No spam words</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Verified Attributes</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-1">
                      <span className="bg-white p-1.5 rounded border border-emerald-200">HSN: 620520</span>
                      <span className="bg-white p-1.5 rounded border border-emerald-200">GST Slab: 5%</span>
                      <span className="bg-white p-1.5 rounded border border-emerald-200">Origin: India</span>
                      <span className="bg-white p-1.5 rounded border border-emerald-200">Packer: Apex Hub, IN</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">Amazon 5-Point Formula</span>
                    <p className="text-xs text-slate-700">✓ 5 structured capital-lead bullet points with fabric, weave & wash care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Step Core Flow */}
        <section id="features" className="py-20 border-b bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <Badge variant="secondary" className="mb-2">The ListKaro Flow</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                From Shopify to Indian Marketplace Shelf in 60 Seconds
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Everything required by Indian e-commerce platforms handled automatically without manual spreadsheet grunt work.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900">OAuth Store Sync</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Connect your store in one click. We sync all products, variants, high-res images, live inventory quantities, prices, and custom metafields via GraphQL API.
                </p>
              </div>

              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900">AI Category & Vertical Matching</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  ListKaro maps your Shopify product types into exact taxonomy trees for Amazon browse nodes, Flipkart verticals, Meesho categories, and Myntra article types.
                </p>
              </div>

              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900">Marketplace Rules Rewriter</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Each platform has distinct strict rules. Titles are reformatted to length limits, brand-first conventions applied, and 6-digit HSN codes & GST rates auto-suggested.
                </p>
              </div>

              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-slate-900">Image Compliance Checker</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Flag non-white backgrounds on primary images, warn if resolution is under 1,000px, and catch watermarks or promotional text before the marketplace rejects your listing.
                </p>
              </div>

              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                  5
                </div>
                <h3 className="text-lg font-bold text-slate-900">Marketplace Pricing Calculator</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Factor in referral commission %, fixed closing fee, shipping fee slab, and 18% GST on platform charges to calculate your exact selling price for your target margin.
                </p>
              </div>

              <div className="p-6 rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4">
                  6
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bulk XLSX / CSV Export</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Generate official bulk upload files stored in editable database templates. When Amazon or Flipkart updates their sheet versions, admins update the template in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Interactive Pricing Widget */}
        <section id="calculator" className="py-20 bg-slate-100/60 border-b">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <CalculatorWidget />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Start expanding your Indian marketplace revenue today.
            </h2>
            <p className="mt-4 text-blue-100 text-base sm:text-lg">
              Free plan includes 10 products and 1 marketplace. Upgrade anytime for ₹999/month.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 shadow-md">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-8">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
