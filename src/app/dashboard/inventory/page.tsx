"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export default function InventorySyncPage() {
  const [products, setProducts] = useState(db.products);
  const [reExportSuccess, setReExportSuccess] = useState<string | null>(null);

  // Simulated inventory mismatch tracker
  const [mismatches, setMismatches] = useState<Record<string, { stockDiff: number; priceDiff: number }>>({
    prod_102: { stockDiff: -15, priceDiff: 0 }, // 15 shirts sold on Shopify
  });

  const handleSimulateWebhook = (productId: string) => {
    setMismatches((prev) => ({
      ...prev,
      [productId]: { stockDiff: -10, priceDiff: 50 },
    }));
  };

  const handleReExportAll = () => {
    setMismatches({});
    setReExportSuccess("Re-exported all updated inventory and pricing files to marketplace buckets!");
    setTimeout(() => setReExportSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Sync Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Compares live Shopify stock vs. your marketplace exports. Automatically flags listings when stock or price changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleReExportAll}
            className="bg-blue-600 hover:bg-blue-700 font-bold text-xs gap-1.5 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-Export Changed Listings</span>
          </Button>
        </div>
      </div>

      {reExportSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{reExportSuccess}</span>
        </div>
      )}

      {/* Sync Status Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Active Shopify SKUs</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">9 Active SKUs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Monitored via Shopify Webhooks
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Out-of-Sync Listings</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">
              {Object.keys(mismatches).length} Need Re-Export
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            Warehouse stock changed since last export
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Automated Webhooks</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">2 Hooks Active</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-slate-500">
            products/update · inventory_levels/update
          </CardContent>
        </Card>
      </div>

      {/* Real-time Inventory Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Product & SKU</th>
              <th className="py-3 px-4">Shopify Live Stock</th>
              <th className="py-3 px-4">Exported Marketplace Stock</th>
              <th className="py-3 px-4">Live Price vs Exported</th>
              <th className="py-3 px-4">Sync Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const variant = p.variants?.[0];
              const mismatch = mismatches[p.id];
              const currentStock = variant?.inventory_quantity ?? 50;
              const exportedStock = mismatch ? currentStock - mismatch.stockDiff : currentStock;
              const currentPrice = variant?.price ?? 999;
              const exportedPrice = mismatch ? currentPrice - mismatch.priceDiff : currentPrice;

              const isOutOfSync = !!mismatch;

              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{p.title}</div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                      SKU: {variant?.sku || "SKU-N/A"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {currentStock} units
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={isOutOfSync ? "text-amber-600 font-bold" : "text-slate-700"}>
                      {exportedStock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      Shopify: {formatINR(currentPrice)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Exported: {formatINR(exportedPrice)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {isOutOfSync ? (
                      <Badge variant="warning" className="text-[10px] gap-1 font-bold">
                        <AlertTriangle className="h-3 w-3" />
                        Needs Re-Export
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px] gap-1 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        In Sync
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isOutOfSync ? (
                      <Button
                        onClick={() => {
                          const updated = { ...mismatches };
                          delete updated[p.id];
                          setMismatches(updated);
                        }}
                        size="sm"
                        className="h-7 text-[11px] bg-amber-600 hover:bg-amber-700 font-semibold"
                      >
                        Re-Export Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSimulateWebhook(p.id)}
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] text-slate-500 hover:text-blue-600"
                        title="Simulate Shopify stock reduction webhook"
                      >
                        Simulate Sale
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
