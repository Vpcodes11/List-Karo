"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileCode2,
  IndianRupee,
  Layers,
  Save,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { MarketplaceId } from "@/types";

export default function AdminPage() {
  const [pricingRules, setPricingRules] = useState(db.pricingRules);
  const [templates, setTemplates] = useState(db.templates);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [templateJson, setTemplateJson] = useState(
    JSON.stringify(templates[0].field_mapping, null, 2)
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Stats calculation
  const totalUsers = db.users.length;
  const totalStores = db.stores.length;
  const totalProducts = db.products.length;
  const totalExports = db.exports.length;

  const handleUpdatePricingRule = async (ruleId: string, updatedFields: any) => {
    try {
      const res = await fetch("/api/admin/pricing-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ruleId, ...updatedFields }),
      });
      const data = await res.json();
      if (data.success) {
        setPricingRules(db.pricingRules);
        setSaveStatus("Pricing rule updated successfully!");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplateMapping = async () => {
    try {
      const parsedMapping = JSON.parse(templateJson);
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTemplate.id,
          field_mapping: parsedMapping,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(db.templates);
        setSaveStatus(`Template ${selectedTemplate.marketplace_id} updated!`);
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err: any) {
      alert("Invalid JSON: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <h1 className="font-bold text-base text-slate-900">
              ListKaro Admin Control Panel
            </h1>
            <Badge variant="destructive" className="text-[10px] uppercase font-mono">
              role=admin
            </Badge>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs">
            Return to Seller App
          </Button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {saveStatus && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Platform Metrics Row */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            Platform Metrics & Revenue
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Total Registered Merchants</CardDescription>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {totalUsers} Sellers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-slate-500">
                100% Verified Accounts
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Connected Shopify Stores</CardDescription>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  {totalStores} Active Stores
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-slate-500">
                AES-256 tokens encrypted at rest
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Products Cataloged</CardDescription>
                <CardTitle className="text-2xl font-bold text-purple-600">
                  {totalProducts} Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-slate-500">
                {db.listings.length} marketplace listings generated
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Monthly Recurring Revenue</CardDescription>
                <CardTitle className="text-2xl font-bold text-emerald-600">
                  {formatINR(2999)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-slate-500">
                Razorpay & Stripe Subscriptions
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 1. Editable Pricing Rules Config */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Editable Marketplace Pricing Rules & Commissions
              </h2>
              <p className="text-xs text-slate-500">
                Configure referral fees, fixed closing fees, and logistics charges for profit margin calculation. (Zero Hardcoding).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600 font-semibold uppercase">
                  <th className="py-3 px-4">Marketplace</th>
                  <th className="py-3 px-4">Commission %</th>
                  <th className="py-3 px-4">Fixed Closing Fee (₹)</th>
                  <th className="py-3 px-4">Shipping Fee (₹)</th>
                  <th className="py-3 px-4">Marketplace GST %</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pricingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold uppercase text-slate-800">
                      {rule.marketplace_id}
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={rule.commission_percent}
                        id={`comm_${rule.id}`}
                        className="w-24 text-xs h-8 font-semibold"
                        step={0.5}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={rule.fixed_fee}
                        id={`fixed_${rule.id}`}
                        className="w-24 text-xs h-8"
                        step={1}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        defaultValue={rule.shipping_fee}
                        id={`ship_${rule.id}`}
                        className="w-24 text-xs h-8"
                        step={1}
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {rule.marketplace_gst_percent}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => {
                          const comm = (document.getElementById(`comm_${rule.id}`) as HTMLInputElement)?.value;
                          const fix = (document.getElementById(`fixed_${rule.id}`) as HTMLInputElement)?.value;
                          const ship = (document.getElementById(`ship_${rule.id}`) as HTMLInputElement)?.value;
                          handleUpdatePricingRule(rule.id, {
                            commission_percent: Number(comm),
                            fixed_fee: Number(fix),
                            shipping_fee: Number(ship),
                          });
                        }}
                        className="h-8 text-xs bg-slate-900 hover:bg-slate-800 font-semibold gap-1"
                      >
                        <Save className="h-3 w-3" />
                        <span>Save Rate</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Editable Marketplace Templates (Admin Version Manager) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Marketplace Template Version Manager
              </h2>
              <p className="text-xs text-slate-500">
                When Amazon, Flipkart, or Myntra change their spreadsheet column schemas, update or publish new mapping versions here.
              </p>
            </div>
            <Button
              onClick={handleSaveTemplateMapping}
              className="bg-blue-600 hover:bg-blue-700 font-bold text-xs gap-1.5 shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Template JSON</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t);
                    setTemplateJson(JSON.stringify(t.field_mapping, null, 2));
                  }}
                  className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center text-xs ${
                    selectedTemplate.id === t.id
                      ? "bg-white border-blue-600 shadow-sm font-bold"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="uppercase text-slate-800">{t.marketplace_id}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {t.version}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="lg:col-span-8">
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold text-slate-900 uppercase">
                      Editing Mapping: {selectedTemplate.marketplace_id} ({selectedTemplate.version})
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-mono">
                      Format: .{selectedTemplate.file_format}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Textarea
                    value={templateJson}
                    onChange={(e) => setTemplateJson(e.target.value)}
                    rows={14}
                    className="font-mono text-xs bg-slate-950 text-emerald-400 p-4 rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Users & Stores List */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">
            Registered Merchant Stores
          </h2>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600 font-semibold uppercase">
                  <th className="py-3 px-4">Store Domain</th>
                  <th className="py-3 px-4">Merchant Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Scopes Granted</th>
                  <th className="py-3 px-4">Last Synced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Store className="h-4 w-4 text-blue-600" />
                      <span>{s.shop_domain}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">Aakash Sharma (merchant@virasatcrafts.com)</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" className="text-[10px]">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {s.scopes}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.synced_at ? new Date(s.synced_at).toLocaleString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
