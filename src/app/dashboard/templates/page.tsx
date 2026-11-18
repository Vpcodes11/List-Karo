"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileCode2, Layers, Settings } from "lucide-react";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(db.templates);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Marketplace Template Mappings
        </h1>
        <p className="text-xs text-slate-500">
          Editable database mapping specifications translating your Shopify catalog into official marketplace bulk-upload formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-blue-600 bg-white shadow-md ring-1 ring-blue-500"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm uppercase text-slate-800">
                    {tmpl.marketplace_id}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {tmpl.version}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Category: {tmpl.category}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Format: .{tmpl.file_format.toUpperCase()}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Template Mapping JSON Inspector (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Active Mapping Configuration
                  </span>
                  <CardTitle className="text-lg font-bold text-slate-900 mt-1">
                    {selectedTemplate.marketplace_id.toUpperCase()} ({selectedTemplate.version})
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-xs uppercase">
                  Format: {selectedTemplate.file_format}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-xl border bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px]">
                <pre>{JSON.stringify(selectedTemplate.field_mapping, null, 2)}</pre>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Admin role permissions allow updating mappings and uploading new version definitions.
                </span>
                <span className="font-semibold text-slate-700">
                  {Object.keys(selectedTemplate.field_mapping).length} Mapped Columns
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
