import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-[#F5F2EB] text-stone-700 py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-stone-900 text-stone-100 shadow-sm">
                <span className="font-serif italic font-bold text-base">Lk</span>
              </div>
              <span className="text-xl font-bold font-serif text-stone-900 tracking-tight">
                List<span className="text-terracotta italic font-normal">Karo</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              The high-craft catalog engine built for ambitious Indian D2C brands. Intelligently catalog, rewrite, and bulk-export your Shopify inventory to India's foremost marketplaces in one click.
            </p>
            <div className="pt-2 text-[11px] text-stone-400 font-medium">
              Handcrafted for brands based in Surat, Jaipur, Bengaluru, Mumbai, Delhi-NCR & beyond.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3.5">
              Marketplaces
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li>Amazon.in Flat Files</li>
              <li>Flipkart Bulk Listing CSV</li>
              <li>Meesho Supplier Sheet</li>
              <li>Myntra Partner Portal</li>
              <li>JioMart Seller Hub</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3.5">
              Compliance & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li>Indian Legal Metrology Act</li>
              <li>Verified 6-Digit HSN Codes</li>
              <li>GST Slabs (0%, 5%, 12%, 18%)</li>
              <li>Pure White BG Verification</li>
              <li>AES-256 Token Encryption</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-3.5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500">
              <li><Link href="/pricing" className="hover:text-stone-900 transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-stone-900 transition-colors">Seller Studio</Link></li>
              <li><Link href="/dashboard/products" className="hover:text-stone-900 transition-colors">Product Catalog</Link></li>
              <li><Link href="/admin" className="hover:text-stone-900 transition-colors">Admin Control</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-300/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} ListKaro Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span>Made with precision for Indian Commerce</span>
            <span>Zero Fake Urgency Promise</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
