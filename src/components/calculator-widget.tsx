"use client";

import { useState } from "react";
import { calculateMarketplacePrice } from "@/lib/pricing/calculator";
import { MarketplaceId } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Calculator, IndianRupee, ShieldCheck } from "lucide-react";

const MARKETPLACES: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

export function CalculatorWidget() {
  const [cogs, setCogs] = useState<number>(450);
  const [targetMargin, setTargetMargin] = useState<number>(25);

  const results = MARKETPLACES.map((mId) =>
    calculateMarketplacePrice({
      marketplaceId: mId,
      cogs: Number(cogs) || 100,
      targetMarginPercent: Number(targetMargin) || 20,
    })
  );

  return (
    <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Calculator className="h-3.5 w-3.5" />
            Live Marketplace Profit Simulator
          </div>
          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Calculate Your Selling Price & Margin per Marketplace
          </h3>
          <p className="text-sm text-slate-500">
            Includes exact referral commission %, fixed closing fee, shipping slab, and 18% GST on platform fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Your Product Cost (COGS)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">₹</span>
              <Input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-32 pl-7 font-bold text-slate-800"
                min={50}
                step={50}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Target Margin (%)
            </label>
            <div className="relative">
              <Input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-28 font-bold text-slate-800"
                min={5}
                max={60}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 rounded-l-lg">Marketplace</th>
              <th className="py-3 px-4">Suggested Price</th>
              <th className="py-3 px-4">Suggested MRP</th>
              <th className="py-3 px-4">Commission %</th>
              <th className="py-3 px-4">Marketplace Fees</th>
              <th className="py-3 px-4">Net Payout</th>
              <th className="py-3 px-4 rounded-r-lg font-semibold text-emerald-700">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((res) => {
              const rule = MARKETPLACE_RULES[res.marketplaceId];
              return (
                <tr key={res.marketplaceId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    {rule.name}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {formatINR(res.sellingPrice)}
                  </td>
                  <td className="py-4 px-4 text-slate-500 line-through">
                    {formatINR(res.mrp)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary" className="font-medium">
                      {res.commissionPercent}%
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {formatINR(res.totalMarketplaceFees)}
                    <span className="text-[10px] text-slate-400 block">incl. 18% GST</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {formatINR(res.netPayoutToSeller)}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    <div className="flex items-center gap-1">
                      <span>{formatINR(res.netProfit)}</span>
                      <span className="text-xs font-normal text-emerald-600/80">
                        ({res.actualMarginPercent}%)
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero Hardcoding:</strong> Commission rates, closing fees, and logistics weight slabs are fully editable in your ListKaro admin config.
          </span>
        </div>
        <div className="text-slate-500 text-right">
          Rates current as of Indian E-Commerce Schedules 2026.
        </div>
      </div>
    </div>
  );
}
