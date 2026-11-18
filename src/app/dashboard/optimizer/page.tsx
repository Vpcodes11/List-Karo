"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Loader2,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

const ALL_MARKETPLACES: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

export default function BulkOptimizerPage() {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<MarketplaceId[]>(ALL_MARKETPLACES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedResults, setCompletedResults] = useState<any[] | null>(null);

  const toggleMarketplace = (mId: MarketplaceId) => {
    if (selectedMarketplaces.includes(mId)) {
      if (selectedMarketplaces.length > 1) {
        setSelectedMarketplaces(selectedMarketplaces.filter((id) => id !== mId));
      }
    } else {
      setSelectedMarketplaces([...selectedMarketplaces, mId]);
    }
  };

  const handleStartBulkOptimization = async () => {
    setIsProcessing(true);
    setProgress(15);
    setCompletedResults(null);

    try {
      setProgress(40);
      const res = await fetch("/api/optimizer/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketplaceIds: selectedMarketplaces,
        }),
      });

      setProgress(85);
      const data = await res.json();
      setProgress(100);

      if (data.success) {
        setCompletedResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bulk Listing Optimizer
        </h1>
        <p className="text-xs text-slate-500">
          Re-write and validate your entire Shopify catalog across Indian marketplaces in one unified batch job.
        </p>
      </div>

      {/* Control Panel Card */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-base font-bold text-slate-900">
            Select Target Marketplaces
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Choose which marketplaces to generate optimized titles, bullet points, HSN codes, and GST rates for.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {ALL_MARKETPLACES.map((mId) => {
              const rule = MARKETPLACE_RULES[mId];
              const isChecked = selectedMarketplaces.includes(mId);
              return (
                <div
                  key={mId}
                  onClick={() => toggleMarketplace(mId)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                    isChecked
                      ? "border-blue-600 bg-blue-50/30 shadow-sm"
                      : "border-slate-200 bg-white opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{rule.name}</span>
                    <Checkbox checked={isChecked} />
                  </div>
                  <div className="mt-4 text-[11px] text-slate-500 space-y-1">
                    <div>Title: Max {rule.titleMaxLength} chars</div>
                    <div>Bullets: {rule.bulletPointsCount.min}-{rule.bulletPointsCount.max} items</div>
                    <div>Commission: {rule.defaultCommissionPercent}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <div className="text-xs text-slate-600">
              <strong>{db.products.length} Products</strong> will be processed across{" "}
              <strong>{selectedMarketplaces.length} Marketplaces</strong> ={" "}
              <strong className="text-blue-600">
                {db.products.length * selectedMarketplaces.length} Optimized Listings
              </strong>
            </div>

            <Button
              onClick={handleStartBulkOptimization}
              className="bg-blue-600 hover:bg-blue-700 font-bold gap-2 text-xs shadow-sm"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Catalog ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-blue-200" />
                  <span>Start Bulk 1-Click Optimization</span>
                </>
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-center text-slate-500">
                Applying Indian legal metrology rules, 6-digit HSN codes & GST slab assignments...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {completedResults && (
        <Card className="bg-white shadow-sm border-emerald-200">
          <CardHeader className="p-6 border-b bg-emerald-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Bulk Optimization Finished Successfully!</span>
              </div>
              <Link href="/dashboard/exports">
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-xs gap-1.5 font-semibold">
                  <DownloadCloud className="h-3.5 w-3.5" />
                  <span>Download Bulk Upload Files</span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 font-semibold uppercase">
                    <th className="py-2.5 px-3">Product ID</th>
                    <th className="py-2.5 px-3">Marketplace</th>
                    <th className="py-2.5 px-3">Generated Title</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{item.productId}</td>
                      <td className="py-2.5 px-3 font-semibold uppercase">{item.marketplaceId}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 max-w-md truncate">
                        {item.title}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="success" className="text-[10px]">
                          ✓ Validated
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
