"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Store,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSyncShopify = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/shopify/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mock: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Successfully synced ${data.count} products with high-res images and variants!`);
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Store Connection Header Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Store className="h-3.5 w-3.5" />
              Connected Store
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              virasat-crafts.myshopify.com
            </h1>
            <p className="mt-1 text-xs text-blue-100">
              Synced with Shopify Admin GraphQL API (OAuth scopes: read_products, read_inventory)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSyncShopify}
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2 shadow-sm"
              disabled={syncing}
            >
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Syncing Catalog...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Sync Catalog Now</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {syncResult && (
          <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white border border-white/20 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>{syncResult}</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Shopify Products Synced</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">5 Products</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Including 9 active SKUs & variants
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Optimized Listings</CardDescription>
            <CardTitle className="text-2xl font-bold text-indigo-600">5 / 5 Complete</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Validated against marketplace rules
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Export Files Ready</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">5 Formats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Amazon, Flipkart, Meesho, Myntra, JioMart
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Inventory Sync Status</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">100% In-Sync</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            No stock mismatches detected
          </CardContent>
        </Card>
      </div>

      {/* Indian Marketplaces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Indian Marketplace Readiness
            </h2>
            <p className="text-xs text-slate-500">
              Catalog status formatted to each marketplace's specific schema and legal requirements.
            </p>
          </div>
          <Link href="/dashboard/optimizer">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Bulk Optimize All</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Amazon.in */}
          <Card className="border-t-4 border-t-[#FF9900] bg-white">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Amazon.in</span>
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                  Flat File
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">Title max 200 chars · 5 Bullets</div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-slate-800">5 Products</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Ready for Export</div>
              <Link href="/dashboard/exports" className="mt-3 block">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                  <DownloadCloud className="h-3 w-3" />
                  <span>Get XLSX</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Flipkart */}
          <Card className="border-t-4 border-t-[#2874F0] bg-white">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Flipkart</span>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                  Bulk CSV
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">Title max 80 chars · Key Specs</div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-slate-800">5 Products</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Ready for Export</div>
              <Link href="/dashboard/exports" className="mt-3 block">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                  <DownloadCloud className="h-3 w-3" />
                  <span>Get CSV</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Meesho */}
          <Card className="border-t-4 border-t-[#9F2089] bg-white">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Meesho</span>
                <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-800 border-purple-200">
                  Supplier File
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">Value focused · Inch Size Chart</div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-slate-800">5 Products</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Ready for Export</div>
              <Link href="/dashboard/exports" className="mt-3 block">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                  <DownloadCloud className="h-3 w-3" />
                  <span>Get XLSX</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Myntra */}
          <Card className="border-t-4 border-t-[#FF3F6C] bg-white">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Myntra</span>
                <Badge variant="outline" className="text-[10px] bg-pink-50 text-pink-800 border-pink-200">
                  Partner Portal
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">Style Note · Material & Care</div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-slate-800">5 Products</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Ready for Export</div>
              <Link href="/dashboard/exports" className="mt-3 block">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                  <DownloadCloud className="h-3 w-3" />
                  <span>Get XLSX</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* JioMart */}
          <Card className="border-t-4 border-t-[#0078AD] bg-white">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">JioMart</span>
                <Badge variant="outline" className="text-[10px] bg-cyan-50 text-cyan-800 border-cyan-200">
                  Seller Hub
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">Pack Size · Legal Metrology</div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-lg font-bold text-slate-800">5 Products</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Ready for Export</div>
              <Link href="/dashboard/exports" className="mt-3 block">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                  <DownloadCloud className="h-3 w-3" />
                  <span>Get XLSX</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-600 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI Listing Optimizer</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inspect individual products, see the side-by-side Shopify vs Marketplace comparison, check auto-filled 6-digit HSN codes and GST slabs.
          </p>
          <Link href="/dashboard/products">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 w-full">
              <span>Open Catalog & Optimizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-purple-600 font-bold text-sm">
            <ImageIcon className="h-4 w-4" />
            <span>Image Compliance Checker</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scan product primary images for pure white background requirements, 1000px zoom resolution, and catch promotional badges or watermarks.
          </p>
          <Link href="/dashboard/images">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 w-full">
              <span>Audit Product Images</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-600 font-bold text-sm">
            <RefreshCw className="h-4 w-4" />
            <span>Inventory Sync Monitor</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tracks Shopify stock and price changes. Flags listings that require re-exporting whenever your warehouse quantities shift.
          </p>
          <Link href="/dashboard/inventory">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 w-full">
              <span>View Sync Status</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
