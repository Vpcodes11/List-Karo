"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DownloadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  IndianRupee,
  Info,
  Loader2,
  RefreshCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { MarketplaceId, OptimizedListingData } from "@/types";
import { MARKETPLACE_RULES, validateListingForMarketplace } from "@/lib/marketplaces/rules";
import { checkMarketplaceImages } from "@/lib/images/checker";
import { calculateMarketplacePrice } from "@/lib/pricing/calculator";
import { formatINR } from "@/lib/utils";

const MARKETPLACES: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const product = db.products.find((p) => p.id === productId) || db.products[0];
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceId>("amazon");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Listing state per marketplace
  const existingListing = db.listings.find(
    (l) => l.product_id === product.id && l.marketplace_id === selectedMarketplace
  );

  const [formData, setFormData] = useState<OptimizedListingData>(
    existingListing?.optimized || {
      title: `${product.vendor} ${product.title}`,
      bulletPoints: [
        "PREMIUM FABRIC: Woven with high grade yarn for comfort and longevity.",
        "CONTEMPORARY FIT: Tailored precision for versatile daily wear.",
        "BREATHABLE WEAVE: Optimized for Indian climate conditions.",
        "EASY CARE: Gentle wash cold. Color tested to resist fading.",
        "ETHICALLY CRAFTED: Manufactured under strict quality standards in India.",
      ],
      description: product.description_html.replace(/<[^>]*>?/gm, "").slice(0, 1000),
      backendSearchTerms: `${product.title.toLowerCase()} ethnic casual cotton indian wear`,
      attributes: {
        brand: product.vendor,
        material: "100% Pure Cambric Cotton",
        sizeChart: "S-38, M-40, L-42, XL-44, XXL-46 (Chest in Inches)",
        hsnCode: "620520",
        gstRate: 5,
        countryOfOrigin: "India",
        manufacturerDetails: `${product.vendor} Apparels Ltd, Industrial Area, India`,
        packerDetails: `${product.vendor} Hub, India`,
      },
    }
  );

  const rules = MARKETPLACE_RULES[selectedMarketplace];
  const validation = validateListingForMarketplace(formData, selectedMarketplace);

  // Pricing calculation for this product
  const basePrice = product.variants?.[0]?.price || 899;
  const estimatedCogs = Math.round(basePrice * 0.4); // approx 40% COGS
  const pricingCalc = calculateMarketplacePrice({
    marketplaceId: selectedMarketplace,
    cogs: estimatedCogs,
    targetMarginPercent: 25,
  });

  const handleRunAiOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/optimizer/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          marketplaceId: selectedMarketplace,
        }),
      });
      const data = await res.json();
      if (data.success && data.listing?.optimized) {
        setFormData(data.listing.optimized);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSaveListing = () => {
    const existingIdx = db.listings.findIndex(
      (l) => l.product_id === product.id && l.marketplace_id === selectedMarketplace
    );
    const updatedRecord = {
      id: existingIdx >= 0 ? db.listings[existingIdx].id : `list_${Date.now()}`,
      product_id: product.id,
      marketplace_id: selectedMarketplace,
      optimized: formData,
      validation_errors: {
        missingFields: validation.missingFields,
        warnings: validation.warnings,
        fieldErrors: validation.fieldErrors,
      },
      status: validation.isValid ? "valid" : "needs_attention",
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      db.listings[existingIdx] = updatedRecord as any;
    } else {
      db.listings.push(updatedRecord as any);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back and Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Saved Successfully!
            </span>
          )}
          <Button
            onClick={handleSaveListing}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save & Validate</span>
          </Button>
        </div>
      </div>

      {/* Product Title Header */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200"}
              alt={product.title}
              className="h-16 w-16 rounded-xl object-cover border bg-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {product.vendor}
                </span>
                <span className="text-slate-300">•</span>
                <Badge variant="outline" className="text-[10px]">
                  Shopify ID: {product.shopify_product_id.split("/").pop()}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                {product.title}
              </h1>
              <div className="text-xs text-slate-500 mt-0.5">
                Type: {product.product_type} · Tags: {product.tags.join(", ")}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Shopify Base Price</div>
            <div className="text-2xl font-black text-slate-900">
              {formatINR(basePrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Marketplace Selector Tabs */}
      <div className="rounded-xl border bg-white p-2 shadow-sm">
        <Tabs
          value={selectedMarketplace}
          onValueChange={(val) => setSelectedMarketplace(val as MarketplaceId)}
        >
          <TabsList className="grid grid-cols-5 w-full h-12 bg-slate-100/70 p-1">
            <TabsTrigger value="amazon" className="gap-2 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9900]" />
              Amazon.in
            </TabsTrigger>
            <TabsTrigger value="flipkart" className="gap-2 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2874F0]" />
              Flipkart
            </TabsTrigger>
            <TabsTrigger value="meesho" className="gap-2 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9F2089]" />
              Meesho
            </TabsTrigger>
            <TabsTrigger value="myntra" className="gap-2 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF3F6C]" />
              Myntra
            </TabsTrigger>
            <TabsTrigger value="jiomart" className="gap-2 font-semibold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0078AD]" />
              JioMart
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Validation Status & Alert Banner */}
      {!validation.isValid ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">
                Action Required: Missing Mandatory Attributes for {rules.name}
              </h4>
              <p className="text-xs text-red-700 mt-1">
                Indian marketplaces will reject bulk catalog files with missing legal or taxonomy fields. Please fill in the flagged red fields below.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {validation.missingFields.map((field, idx) => (
                  <Badge key={idx} variant="destructive" className="text-[10px] bg-red-600 font-bold">
                    Missing: {field}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              onClick={handleRunAiOptimize}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5 shrink-0"
              disabled={isOptimizing}
            >
              {isOptimizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Auto-Fill with AI</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                100% Policy Compliant for {rules.name}
              </h4>
              <p className="text-xs text-emerald-700">
                Title format, bullet structure, HSN code, GST slab, and legal metrology declarations verified.
              </p>
            </div>
          </div>
          <Button
            onClick={handleRunAiOptimize}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            disabled={isOptimizing}
          >
            {isOptimizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            <span>Re-Generate with AI</span>
          </Button>
        </div>
      )}

      {/* Main Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Original Shopify Source (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-slate-50 border-slate-200 shadow-sm">
            <CardHeader className="p-4 border-b bg-white rounded-t-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Shopify Catalog Raw Source
              </span>
              <CardTitle className="text-sm font-bold text-slate-800">
                Original Product Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Raw Title</label>
                <div className="p-2.5 rounded-lg bg-white border text-slate-800 font-mono text-[11px]">
                  {product.title}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Images ({product.images.length})</label>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img) => (
                    <div key={img.id} className="relative rounded-lg overflow-hidden border bg-white aspect-square">
                      <img src={img.url} alt="" className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Raw Description</label>
                <div className="p-2.5 rounded-lg bg-white border text-slate-600 max-h-36 overflow-y-auto leading-relaxed">
                  {product.description_html.replace(/<[^>]*>?/gm, "")}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Active Variants</label>
                <div className="space-y-1.5">
                  {product.variants?.map((v) => (
                    <div key={v.id} className="p-2 rounded bg-white border flex justify-between items-center text-[11px]">
                      <span className="font-medium text-slate-800">{v.title}</span>
                      <span className="font-bold">{formatINR(v.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Calculator Widget for this Product */}
          <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
            <CardHeader className="p-4 border-b bg-white rounded-t-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5" />
                {rules.name} Fee Breakdown
              </span>
              <CardTitle className="text-sm font-bold text-slate-900">
                Profit & Selling Price Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-600">Product COGS:</span>
                <span className="font-bold">{formatINR(pricingCalc.cogs)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-600">Marketplace Referral ({pricingCalc.commissionPercent}%):</span>
                <span className="text-slate-800 font-semibold">{formatINR(pricingCalc.commissionAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-600">Fixed Closing Fee:</span>
                <span className="text-slate-800">{formatINR(pricingCalc.fixedFee)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-600">Logistics / Shipping Fee:</span>
                <span className="text-slate-800">{formatINR(pricingCalc.shippingFee)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-600">18% GST on Marketplace Fees:</span>
                <span className="text-slate-800">{formatINR(pricingCalc.marketplaceGst)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b font-bold text-slate-900">
                <span>Suggested Selling Price:</span>
                <span className="text-blue-700 text-sm">{formatINR(pricingCalc.sellingPrice)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-emerald-700 bg-emerald-100/50 p-2 rounded">
                <span>Net Profit (25% margin):</span>
                <span>{formatINR(pricingCalc.netProfit)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Listing Optimizer Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Listing Optimizer Engine
                  </span>
                  <CardTitle className="text-lg font-bold text-slate-900 mt-0.5">
                    {rules.name} Optimized Specification
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Max Title: {rules.titleMaxLength} chars
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Title Input with Length Counter */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Optimized Title</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      (Must follow {rules.name} naming formula)
                    </span>
                  </label>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      formData.title.length > rules.titleMaxLength
                        ? "text-red-600"
                        : "text-slate-500"
                    }`}
                  >
                    {formData.title.length} / {rules.titleMaxLength} chars
                  </span>
                </div>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`font-medium ${
                    formData.title.length > rules.titleMaxLength
                      ? "border-red-500 focus-visible:ring-red-500 bg-red-50/20"
                      : ""
                  }`}
                />
                {validation.fieldErrors["title"] && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">
                    ⚠️ {validation.fieldErrors["title"]}
                  </p>
                )}
              </div>

              {/* Required Marketplace Attributes Grid (HSN, GST, Material, Brand, Size) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Required Indian Legal & Marketplace Attributes
                  </h4>
                  <span className="text-[10px] text-slate-400">All fields required for bulk upload</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border bg-slate-50/50 p-4">
                  {/* Brand */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.attributes?.brand || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: { ...formData.attributes, brand: e.target.value },
                        })
                      }
                      className={!formData.attributes?.brand ? "border-red-500 bg-red-50/30" : ""}
                    />
                  </div>

                  {/* Material */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Material / Fabric <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.attributes?.material || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: { ...formData.attributes, material: e.target.value },
                        })
                      }
                      className={!formData.attributes?.material ? "border-red-500 bg-red-50/30" : ""}
                    />
                  </div>

                  {/* 6-Digit HSN Code Suggestion */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      HSN Code (Indian Tariff) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        value={formData.attributes?.hsnCode || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, hsnCode: e.target.value },
                          })
                        }
                        placeholder="e.g. 620520"
                        className={`font-mono ${
                          !formData.attributes?.hsnCode || validation.fieldErrors["attributes.hsnCode"]
                            ? "border-red-500 bg-red-50/30"
                            : ""
                        }`}
                      />
                      <Badge variant="outline" className="absolute right-2 top-2 text-[10px] bg-slate-100">
                        Suggested
                      </Badge>
                    </div>
                  </div>

                  {/* GST Rate Slab */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      GST Rate Slab (%) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.attributes?.gstRate ?? 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: { ...formData.attributes, gstRate: Number(e.target.value) },
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5% (Apparel &lt; ₹1000 / Spices / Handicrafts)</option>
                      <option value={12}>12% (Apparel &gt; ₹1000 / Brass Decor)</option>
                      <option value={18}>18% (Electronics / Footwear / Accessories)</option>
                      <option value={28}>28% (Luxury items)</option>
                    </select>
                  </div>

                  {/* Country of Origin */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Country of Origin <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.attributes?.countryOfOrigin || "India"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: { ...formData.attributes, countryOfOrigin: e.target.value },
                        })
                      }
                      className={!formData.attributes?.countryOfOrigin ? "border-red-500 bg-red-50/30" : ""}
                    />
                  </div>

                  {/* Size Chart */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Size Chart Specifications
                    </label>
                    <Input
                      value={formData.attributes?.sizeChart || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributes: { ...formData.attributes, sizeChart: e.target.value },
                        })
                      }
                      placeholder="e.g. S-38, M-40, L-42, XL-44"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Points */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {rules.name} Key Bullet Points ({formData.bulletPoints?.length || 0} Points)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {rules.name} requires {rules.bulletPointsCount.min}-{rules.bulletPointsCount.max} bullets
                  </span>
                </div>
                <div className="space-y-2">
                  {(formData.bulletPoints || []).map((bp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <Input
                        value={bp}
                        onChange={(e) => {
                          const updated = [...formData.bulletPoints];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, bulletPoints: updated });
                        }}
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Optimized Product Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Backend Search Keywords */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Backend Search Terms / Generic Keywords
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    {(formData.backendSearchTerms || "").length} / {rules.backendSearchTermsMaxBytes} bytes
                  </span>
                </div>
                <Input
                  value={formData.backendSearchTerms || ""}
                  onChange={(e) => setFormData({ ...formData, backendSearchTerms: e.target.value })}
                  placeholder="Space-separated search keywords without commas"
                  className="text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Checker Component */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="p-5 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span>Image Compliance Engine for {rules.name}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-slate-50">
                  {rules.mainImageRequirements.pureWhiteBackground
                    ? "Pure White Background (RGB 255,255,255) Mandatory"
                    : "Standard Image Guidelines"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.images.map((img, idx) => {
                  const isMain = idx === 0;
                  return (
                    <div key={img.id} className="rounded-xl border p-3 flex gap-3 bg-slate-50/50">
                      <img
                        src={img.url}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover border bg-white shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {isMain ? "Main Image #1" : `Image #${idx + 1}`}
                          </span>
                          {isMain && (
                            <Badge variant="default" className="text-[9px] bg-blue-600">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Dimensions: {img.width || 1200} x {img.height || 1200} px
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Pure White BG Confirmed</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>No Watermarks / Promotional Text</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
