"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, HelpCircle, Loader2, Sparkles, Zap } from "lucide-react";
import { PLANS } from "@/lib/payments/service";
import { SubscriptionPlan } from "@/types";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: SubscriptionPlan) => {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, currency }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.orderId) {
        // Razorpay modal or demo activation
        window.location.href = `/dashboard?payment_success=true&plan=${planId}&order=${data.orderId}`;
      }
    } catch (err) {
      console.error("Subscription initiation error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-3">Transparent Indian Pricing</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Plans Built for Every Stage of Indian D2C Growth
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Start free with 10 products. Upgrade when you're ready to dominate Amazon.in, Flipkart, Meesho, Myntra, and JioMart.
            </p>

            {/* Currency switcher toggle */}
            <div className="mt-8 inline-flex items-center rounded-xl border bg-white p-1 shadow-sm">
              <button
                onClick={() => setCurrency("INR")}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                  currency === "INR"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ₹ INR (Razorpay / UPI / Netbanking)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                  currency === "USD"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                $ USD (Stripe / International Cards)
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Tier */}
            <Card className="flex flex-col justify-between border-slate-200 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Free Tier</span>
                  <Badge variant="outline">Test the Waters</Badge>
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-900 mt-2">
                  {currency === "INR" ? "₹0" : "$0"}
                  <span className="text-sm font-normal text-slate-500"> / forever</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Ideal for testing your first catalog export to 1 marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {PLANS.free.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe("free")}
                  variant="outline"
                  className="w-full font-semibold"
                  disabled={loadingPlan === "free"}
                >
                  {loadingPlan === "free" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Free"}
                </Button>
              </CardFooter>
            </Card>

            {/* Starter Tier (Most Popular) */}
            <Card className="flex flex-col justify-between border-2 border-blue-600 bg-white relative shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Most Popular
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-blue-600">Starter</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800 border-none">All 5 Marketplaces</Badge>
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-900 mt-2">
                  {currency === "INR" ? `₹${PLANS.starter.priceINR}` : `$${PLANS.starter.priceUSD}`}
                  <span className="text-sm font-normal text-slate-500"> / month</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  For growing brands selling up to 200 products across India.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {PLANS.starter.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe("starter")}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-600/20"
                  disabled={loadingPlan === "starter"}
                >
                  {loadingPlan === "starter" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Subscribe for ${currency === "INR" ? `₹${PLANS.starter.priceINR}` : `$${PLANS.starter.priceUSD}`}/mo`
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Tier */}
            <Card className="flex flex-col justify-between border-slate-200 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-purple-600">Pro</span>
                  <Badge variant="secondary">Scale & Automation</Badge>
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-900 mt-2">
                  {currency === "INR" ? `₹${PLANS.pro.priceINR}` : `$${PLANS.pro.priceUSD}`}
                  <span className="text-sm font-normal text-slate-500"> / month</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  For established catalogs up to 2,000 products requiring instant re-sync.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {PLANS.pro.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe("pro")}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-bold"
                  disabled={loadingPlan === "pro"}
                >
                  {loadingPlan === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Done-For-You Add-on Banner */}
          <div className="mt-16 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  White-Glove Managed Service
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  "Done-For-You" Marketplace Onboarding Add-on
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  Don't want to navigate seller panel approvals, brand registry, or catalog review yourself? Our in-house Indian e-commerce operations team manages your brand approval and initial flawless upload from start to finish.
                </p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600" /> Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600" /> Brand registry approval assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600" /> 100% Guaranteed zero catalog error rate
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600" /> Includes 3 months of ListKaro Pro
                  </li>
                </ul>
              </div>

              <div className="text-center lg:text-right shrink-0">
                <div className="text-3xl font-extrabold text-slate-900">
                  {currency === "INR" ? `₹${PLANS.done_for_you.priceINR}` : `$${PLANS.done_for_you.priceUSD}`}
                  <span className="text-xs font-normal text-slate-500 block">one-time investment</span>
                </div>
                <Button
                  onClick={() => handleSubscribe("done_for_you")}
                  size="lg"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  disabled={loadingPlan === "done_for_you"}
                >
                  {loadingPlan === "done_for_you" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request Done-For-You"}
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h4 className="font-semibold text-slate-900">
                  Why can't I just upload my Shopify CSV directly to Amazon or Flipkart?
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Shopify CSVs lack marketplace-mandatory attributes such as 6-digit HSN codes, GST tax slabs, Indian Legal Metrology declarations (manufacturer/packer details), and platform-specific title conventions (e.g. Amazon requires Brand First; Flipkart requires [Brand] [Style] [Gender]). Marketplaces will immediately reject raw Shopify sheets.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h4 className="font-semibold text-slate-900">
                  How does ListKaro ensure AI doesn't generate fake reviews or claims?
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  ListKaro has strict programmatic guardrails. We never generate artificial ratings, fake customer testimonials, bogus sales numbers, or artificial scarcity ("Only 2 left!"). We strictly optimize specifications, bullet points, fabric care, and categorization based on your actual product metadata.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h4 className="font-semibold text-slate-900">
                  Are marketplace commission rates editable?
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes! Marketplace commission rates, closing fees, and shipping slabs are stored in editable database configuration rules, not hardcoded. You can adjust the commission % per category or override them anytime in your admin settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
