"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Key,
  Lock,
  RefreshCw,
  ShieldCheck,
  Store,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db";

export default function SettingsPage() {
  const store = db.stores[0];
  const subscription = db.subscriptions[0];
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(key);
    setTimeout(() => setCopiedWebhook(null), 2000);
  };

  const WEBHOOKS = [
    { topic: "app/uninstalled", url: `${baseUrl}/api/webhooks/shopify/app-uninstalled`, desc: "Deactivates store upon uninstallation" },
    { topic: "customers/data_request", url: `${baseUrl}/api/webhooks/shopify/customers-data-request`, desc: "Mandatory GDPR data request" },
    { topic: "customers/redact", url: `${baseUrl}/api/webhooks/shopify/customers-redact`, desc: "Mandatory GDPR customer erasure" },
    { topic: "shop/redact", url: `${baseUrl}/api/webhooks/shopify/shop-redact`, desc: "Mandatory GDPR shop erasure after 48h" },
    { topic: "products/update", url: `${baseUrl}/api/webhooks/shopify/products-update`, desc: "Flags marketplace listings when Shopify title/price changes" },
    { topic: "inventory_levels/update", url: `${baseUrl}/api/webhooks/shopify/inventory-levels-update`, desc: "Syncs stock counts and triggers re-export alert" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Store & Security Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your Shopify connection credentials, AES-256 token encryption, webhooks, and subscription.
        </p>
      </div>

      {/* Connected Store & Security */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Store className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Connected Shopify Merchant
              </CardTitle>
            </div>
            <Badge variant="success" className="text-xs font-semibold gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Connection
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Shop Domain</label>
              <Input readOnly value={store.shop_domain} className="font-mono bg-slate-50" />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">OAuth Granted Scopes</label>
              <Input readOnly value={store.scopes} className="font-mono bg-slate-50" />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900 block">
                Store Access Token Encrypted at Rest (AES-256-GCM)
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Complies with Shopify Partner security guidelines. Access tokens are encrypted with 96-bit IV and auth tag before database storage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks & GDPR Endpoints */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-base font-bold text-slate-900">
            Shopify & Mandatory GDPR Webhooks
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Registered webhooks for inventory sync, price diff updates, and legal metrology/GDPR compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {WEBHOOKS.map((wh) => (
            <div key={wh.topic} className="rounded-lg border p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-white">
                    {wh.topic}
                  </Badge>
                  <span className="text-slate-600 text-[11px]">{wh.desc}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate max-w-lg">
                  {wh.url}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(wh.url, wh.topic)}
                className="h-7 text-xs gap-1 shrink-0 bg-white"
              >
                {copiedWebhook === wh.topic ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copy URL</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Subscription Details */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="p-6 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-bold text-slate-900">
              Subscription Plan & Limits
            </CardTitle>
            <Badge variant="default" className="bg-blue-600 font-bold uppercase text-xs">
              {subscription.plan} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b">
            <span className="text-slate-600">Plan Status:</span>
            <span className="font-bold text-emerald-700 uppercase">{subscription.status}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b">
            <span className="text-slate-600">Billing Provider:</span>
            <span className="font-semibold text-slate-800 uppercase">{subscription.provider} (INR)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b">
            <span className="text-slate-600">Product Sync Limit:</span>
            <span className="font-bold text-slate-900">{subscription.product_limit} products</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-600">Next Renewal Date:</span>
            <span className="text-slate-800">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
