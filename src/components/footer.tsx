import Link from "next/link";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                List<span className="text-blue-400">Karo</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The catalog powerhouse for Indian D2C brands. Rewrite, validate, and bulk export to Amazon.in, Flipkart, Meesho, Myntra, and JioMart in one click.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Marketplaces
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Amazon.in Flat Files</li>
              <li>Flipkart Bulk Listings</li>
              <li>Meesho Supplier Sheet</li>
              <li>Myntra Partner Portal</li>
              <li>JioMart Seller Hub</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>AI Listing Rewriting</li>
              <li>Indian HSN & GST Suggestion</li>
              <li>White Background Image Checker</li>
              <li>Marketplace Fee & Margin Calculator</li>
              <li>Inventory Sync & Re-export Alerts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Indian Legal Metrology Compliant</li>
              <li>Shopify GDPR & Data Erasure Webhooks</li>
              <li>AES-256 Token Encryption at Rest</li>
              <li>Zero Fake Reviews / Scarcity Guarantee</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ListKaro Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/pricing" className="hover:text-slate-400">Pricing</Link>
            <Link href="/dashboard" className="hover:text-slate-400">Dashboard</Link>
            <Link href="/admin" className="hover:text-slate-400">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
