"use client";

import { useState } from "react";
import { calculateMarketplacePrice } from "@/lib/pricing/calculator";
import { MarketplaceId } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Calculator, Check, Sparkles, TrendingUp } from "lucide-react";

const MARKETPLACES: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

export function CalculatorWidget() {
  const [cogs, setCogs] = useState<number>(450);
  const [targetMargin, setTargetMargin] = useState<number>(25);
  const [activeMarketplace, setActiveMarketplace] = useState<MarketplaceId>("amazon");

  const results = MARKETPLACES.map((mId) =>
    calculateMarketplacePrice({
      marketplaceId: mId,
      cogs: Number(cogs) || 100,
      targetMarginPercent: Number(targetMargin) || 20,
    })
  );

  const activeResult = results.find((r) => r.marketplaceId === activeMarketplace) || results[0];
  const activeRule = MARKETPLACE_RULES[activeMarketplace];

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-7 sm:p-10 shadow-pin relative overflow-hidden">
      {/* Aesthetic ambient gradient blur */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-gradient-to-br from-amber-100/40 via-rose-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-sand-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
            <Calculator className="h-3.5 w-3.5 text-terracotta" />
            <span>Interactive Fee & Margin Engine</span>
          </div>
          <h3 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Indian Marketplace <span className="italic font-normal text-terracotta">Profit Simulator</span>
          </h3>
          <p className="mt-2 text-sm text-stone-500 max-w-xl leading-relaxed">
            Every marketplace in India calculates deductions differently. Enter your manufacturing cost to see the exact recommended listing price, referral commission, closing fee, and 18% GST.
          </p>
        </div>

        {/* Tactile Inputs */}
        <div className="flex flex-wrap items-center gap-4 bg-sand-50 p-3 rounded-2xl border border-stone-200/60">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Your Cost (COGS)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 font-serif text-sm text-stone-400">₹</span>
              <Input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-32 pl-7 font-serif font-bold text-base h-9 bg-white border-stone-200 text-stone-900 rounded-xl"
                min={50}
                step={50}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-stone-200 hidden sm:block" />

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Target Margin
            </label>
            <div className="relative">
              <Input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-24 font-serif font-bold text-base h-9 bg-white border-stone-200 text-stone-900 rounded-xl pr-6"
                min={5}
                max={60}
              />
              <span className="absolute right-3 top-2 text-xs font-medium text-stone-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Selector Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {MARKETPLACES.map((mId) => {
          const rule = MARKETPLACE_RULES[mId];
          const isSelected = activeMarketplace === mId;
          return (
            <button
              key={mId}
              onClick={() => setActiveMarketplace(mId)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
              }`}
            >
              <span>{rule.name}</span>
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                  isSelected ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                }`}
              >
                {rule.defaultCommissionPercent}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Breakdown Showcase for Selected Marketplace */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-sand-50/60 rounded-3xl p-6 sm:p-8 border border-stone-200/60">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              {activeRule.name} Target Economics
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              {activeResult.actualMarginPercent}% Target Margin Met
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-stone-400 block font-medium">Suggested Selling Price</span>
            <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              {formatINR(activeResult.sellingPrice)}
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-2 pt-1">
              <span>Suggested MRP:</span>
              <span className="line-through text-stone-400 font-serif">{formatINR(activeResult.mrp)}</span>
              <span className="text-terracotta font-semibold">
                ({Math.round(((activeResult.mrp - activeResult.sellingPrice) / activeResult.mrp) * 100)}% Off Tag)
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
            <span className="text-stone-500">Net Profit to Seller:</span>
            <span className="font-serif font-bold text-emerald-700 text-lg">
              +{formatINR(activeResult.netProfit)}
            </span>
          </div>
        </div>

        {/* Detailed Fee Line-Items */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3.5 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b pb-2">
            Automated Fee Deductions Breakdown
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600 flex items-center gap-1.5">
              <span>Referral Commission ({activeResult.commissionPercent}%)</span>
            </span>
            <span className="font-serif font-semibold text-stone-800">
              {formatINR(activeResult.commissionAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600">Fixed Closing Fee</span>
            <span className="font-serif font-semibold text-stone-800">
              {formatINR(activeResult.fixedFee)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600">Standard Shipping / Courier Slab</span>
            <span className="font-serif font-semibold text-stone-800">
              {formatINR(activeResult.shippingFee)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600">GST on Platform Charges (18%)</span>
            <span className="font-serif font-semibold text-stone-800">
              {formatINR(activeResult.marketplaceGst)}
            </span>
          </div>

          <div className="pt-2 border-t flex justify-between items-center font-bold text-stone-900">
            <span>Total Marketplace Deductions</span>
            <span className="font-serif text-rose-600 font-bold text-sm">
              -{formatINR(activeResult.totalMarketplaceFees)}
            </span>
          </div>

          <div className="pt-1 flex justify-between items-center font-bold text-stone-900 bg-sand-50 p-2.5 rounded-xl border border-stone-200/50">
            <span>Net Bank Payout to Brand</span>
            <span className="font-serif text-stone-900 text-sm">
              {formatINR(activeResult.netPayoutToSeller)}
            </span>
          </div>
        </div>
      </div>

      {/* Full Cross-Marketplace Comparison Grid */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-widest font-semibold text-[10px]">
              <th className="py-3 px-4">Marketplace</th>
              <th className="py-3 px-4">Selling Price</th>
              <th className="py-3 px-4">MRP</th>
              <th className="py-3 px-4">Commission</th>
              <th className="py-3 px-4">Total Fees</th>
              <th className="py-3 px-4">Net Payout</th>
              <th className="py-3 px-4 text-emerald-700 font-bold">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {results.map((res) => {
              const rule = MARKETPLACE_RULES[res.marketplaceId];
              const isCurrent = res.marketplaceId === activeMarketplace;
              return (
                <tr
                  key={res.marketplaceId}
                  onClick={() => setActiveMarketplace(res.marketplaceId)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent ? "bg-amber-50/50 font-semibold" : "hover:bg-stone-50/70"
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                    <span className="font-serif">{rule.name}</span>
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                    {formatINR(res.sellingPrice)}
                  </td>
                  <td className="py-3.5 px-4 font-serif text-stone-400 line-through">
                    {formatINR(res.mrp)}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {res.commissionPercent}%
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-serif">
                    {formatINR(res.totalMarketplaceFees)}
                  </td>
                  <td className="py-3.5 px-4 font-serif text-stone-800">
                    {formatINR(res.netPayoutToSeller)}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-emerald-700">
                    +{formatINR(res.netProfit)}
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
