"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  DownloadCloud,
  ExternalLink,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState(db.products);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkOptimizing, setIsBulkOptimizing] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor.toLowerCase().includes(search.toLowerCase()) ||
    p.product_type.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkOptimize = async () => {
    setIsBulkOptimizing(true);
    setBulkMessage(null);
    try {
      const res = await fetch("/api/optimizer/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: selectedIds.length ? selectedIds : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBulkMessage(`Optimized ${data.totalOptimized} listings across 5 marketplaces with HSN & GST codes!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBulkOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Synced from Shopify store. Map categories, run AI rules rewrites, and prepare marketplace bulk files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleBulkOptimize}
            className="bg-blue-600 hover:bg-blue-700 font-semibold gap-1.5 text-xs shadow-sm"
            disabled={isBulkOptimizing}
          >
            {isBulkOptimizing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Optimizing Catalog...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>Bulk AI Optimize ({selectedIds.length ? selectedIds.length : "All"})</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {bulkMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{bulkMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products by title, vendor, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <Checkbox
                  checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Shopify Price & Stock</th>
              <th className="py-3 px-4">Suggested Marketplace Category</th>
              <th className="py-3 px-4">Readiness Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => {
              const primaryVariant = product.variants?.[0];
              const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200";
              const isSelected = selectedIds.includes(product.id);
              const amazonCat = product.suggested_marketplace_categories?.amazon || "Clothing & Accessories";

              return (
                <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectOne(product.id)}
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={primaryImage}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover border shrink-0 bg-slate-100"
                      />
                      <div>
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-1 text-sm"
                        >
                          {product.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                          <span>Vendor: {product.vendor}</span>
                          <span>•</span>
                          <span>Type: {product.product_type}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {formatINR(primaryVariant?.price || 0)}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {primaryVariant?.inventory_quantity ?? 0} in stock ({product.variants?.length || 1} variants)
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="truncate font-medium text-slate-800" title={amazonCat}>
                      {amazonCat}
                    </div>
                    <span className="text-[10px] text-blue-600 block mt-0.5">
                      AI Categorized
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Optimized (All 5)
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/dashboard/products/${product.id}`}>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        <span>Optimize & Edit</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
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
