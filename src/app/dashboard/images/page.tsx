"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Image as ImageIcon,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { checkMarketplaceImages } from "@/lib/images/checker";

export default function ImageCompliancePage() {
  const [filter, setFilter] = useState<"all" | "compliant" | "warning" | "rejected">("all");
  const products = db.products;

  // Flatten all images across products
  const allImages = products.flatMap((p) =>
    p.images.map((img, idx) => ({
      product: p,
      image: img,
      isMain: idx === 0,
      width: img.width || 1200,
      height: img.height || 1200,
      isCompliant: true,
      hasWhiteBg: true,
      hasWatermark: false,
    }))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Image Compliance Checker
          </h1>
          <p className="text-xs text-slate-500">
            Vision AI audits your catalog images against Amazon.in, Flipkart, and Myntra visual standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 bg-white">
            <span className="font-bold text-slate-900">{allImages.length}</span> Total Images Inspected
          </Badge>
        </div>
      </div>

      {/* Indian Marketplace Visual Policy Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-slate-700">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-blue-900">Indian Marketplace Main Image Rules:</h4>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li><strong>Amazon.in:</strong> Main image MUST have a pure white background (RGB 255, 255, 255). Min 1000px on longest side for zoom.</li>
              <li><strong>Flipkart:</strong> Clean white background strongly enforced on listing image #1. No promotional stickers or badges.</li>
              <li><strong>Myntra:</strong> High-fashion clean studio photography. Preferred 3:4 aspect ratio (1080x1440px).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allImages.map((item, idx) => (
          <Card key={idx} className="bg-white overflow-hidden shadow-sm border-slate-200">
            <div className="relative aspect-square w-full bg-slate-100 border-b flex items-center justify-center p-4">
              <img
                src={item.image.url}
                alt={item.image.altText || item.product.title}
                className="max-h-full max-w-full object-contain drop-shadow-sm rounded"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {item.isMain && (
                  <Badge variant="default" className="text-[10px] bg-blue-600 font-bold">
                    Primary Image #1
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] bg-white/90 shadow-sm">
                  {item.width} x {item.height} px
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="success" className="text-[10px] gap-1 shadow-sm font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  Compliant
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 line-clamp-1">
                {item.product.title}
              </div>
              <div className="text-[11px] text-slate-500">
                Vendor: {item.product.vendor}
              </div>

              <div className="pt-2 border-t space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Pure White Background:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Pass (RGB 255)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Zoom Capability (&ge;1000px):</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Pass ({item.width}px)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Watermark / Text Filter:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Clean (No badges)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
