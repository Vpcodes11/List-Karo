"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

const ALL_MARKETPLACES: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

export default function ExportsPage() {
  const [exportsList, setExportsList] = useState(db.exports);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleGenerateExport = async (mId: MarketplaceId) => {
    setGeneratingFor(mId);
    try {
      const res = await fetch("/api/exports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketplaceId: mId }),
      });

      const data = await res.json();
      if (data.success) {
        setExportsList([data.export, ...exportsList]);
        // Trigger download
        window.location.href = data.downloadUrl;
      } else {
        alert(data.error || "Export failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bulk Upload Export Files
        </h1>
        <p className="text-xs text-slate-500">
          Generate official bulk-upload spreadsheets (XLSX/CSV) matching Amazon Flat File, Flipkart, Meesho, Myntra & JioMart seller portal formats.
        </p>
      </div>

      {/* 1-Click Generator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {ALL_MARKETPLACES.map((mId) => {
          const rule = MARKETPLACE_RULES[mId];
          const isGenerating = generatingFor === mId;

          return (
            <Card key={mId} className="bg-white border shadow-sm flex flex-col justify-between">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">{rule.name}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {mId === "flipkart" ? ".CSV" : ".XLSX"}
                  </Badge>
                </div>
                <CardDescription className="text-[11px] text-slate-500 mt-1">
                  Ready with {db.products.length} products
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Button
                  onClick={() => handleGenerateExport(mId)}
                  className="w-full h-8 text-xs font-semibold gap-1.5 shadow-sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <DownloadCloud className="h-3.5 w-3.5" />
                  )}
                  <span>Generate & Export</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export History Table */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-bold text-slate-900">
            Export History & Generated Files
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Download previously generated marketplace sheets. All files conform to the latest active template mappings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Marketplace</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Products Included</th>
                  <th className="py-3 px-4">Export Date</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exportsList.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{exp.file_name}</span>
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-700">
                      {exp.marketplace_id}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="uppercase font-mono text-[10px]">
                        {exp.file_format}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {exp.items_count} products
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(exp.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a href={exp.file_url} download>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <DownloadCloud className="h-3 w-3" />
                          <span>Download</span>
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
