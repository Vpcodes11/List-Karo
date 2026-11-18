import { CalculatorWidget } from "@/components/calculator-widget";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

export default function PricingCalculatorPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
          <Calculator className="h-3.5 w-3.5" />
          Indian Marketplace Economics Engine
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Marketplace Pricing & Fee Calculator
        </h1>
        <p className="text-xs text-slate-500">
          Simulate target profit margins, referral fees, closing fees, logistics slabs, and 18% GST on marketplace expenses.
        </p>
      </div>

      <CalculatorWidget />
    </div>
  );
}
