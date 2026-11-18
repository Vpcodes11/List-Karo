"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              List<span className="text-blue-600">Karo</span>
            </span>
            <span className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
              India
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#marketplaces"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Marketplaces
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/#calculator"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Fee Calculator
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-200" />
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
