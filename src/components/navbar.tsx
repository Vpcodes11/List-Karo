"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 bg-[#FAF8F5]/85 backdrop-blur-md">
      <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-stone-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif italic font-bold text-lg tracking-tight">Lk</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                List<span className="text-terracotta italic font-normal">Karo</span>
              </span>
              <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-stone-600">
                India
              </span>
            </div>
            <span className="text-[10px] text-stone-600 font-medium tracking-wide">
              Shopify → Marketplaces
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <Link
            href="/#showroom"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
          >
            Showroom
          </Link>
          <Link
            href="/#marketplaces"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
          >
            Marketplaces
          </Link>
          <Link
            href="/#calculator"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
          >
            Profit Simulator
          </Link>
          <Link
            href="/pricing"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/admin"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 hidden sm:inline-flex rounded-full px-4"
            >
              Seller Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-stone-900 text-stone-50 hover:bg-stone-800 font-medium text-xs rounded-full px-5 py-2 h-9 shadow-sm hover:shadow transition-all gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Launch Studio</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5 text-stone-400" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
