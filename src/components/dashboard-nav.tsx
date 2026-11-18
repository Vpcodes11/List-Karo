"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  Calculator,
  DownloadCloud,
  FileCode2,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Sparkles,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products Catalog", href: "/dashboard/products", icon: Boxes },
  { label: "Listing Optimizer", href: "/dashboard/optimizer", icon: Sparkles },
  { label: "Image Compliance", href: "/dashboard/images", icon: ImageIcon },
  { label: "Pricing Calculator", href: "/dashboard/pricing", icon: Calculator },
  { label: "Inventory Sync", href: "/dashboard/inventory", icon: RefreshCw },
  { label: "Export Files", href: "/dashboard/exports", icon: DownloadCloud },
  { label: "Templates", href: "/dashboard/templates", icon: FileCode2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              List<span className="text-blue-600">Karo</span>
            </span>
            <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-semibold text-blue-700">
              v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Connected Store Widget */}
      <div className="p-4 border-b bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Active Shopify Store</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-800 truncate">
            virasat-crafts.myshopify.com
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Admin Link */}
      <div className="p-4 border-t space-y-2">
        <div className="rounded-lg bg-slate-100 p-3 text-xs">
          <div className="flex justify-between items-center text-slate-700 font-semibold">
            <span>Pro Plan</span>
            <span className="text-emerald-700">Active</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            5 / 2,000 Products Synced
          </div>
        </div>

        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border rounded-lg hover:bg-slate-50"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Admin Panel (role=admin)
        </Link>
      </div>
    </aside>
  );
}
