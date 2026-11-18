# 🇮🇳 ListKaro (लिस्ट करो)

> **From Shopify Catalog to Indian Marketplaces in 1-Click.**  
> Effortlessly turn your Shopify catalog into high-ranking, policy-compliant listings for **Amazon.in, Flipkart, Meesho, Myntra, and JioMart**, with AI rewriting every listing to each marketplace's rules, HSN codes, GST slabs, and generating official bulk-upload spreadsheets (XLSX/CSV).

---

## 🌟 Key Features

1. **Shopify OAuth & GraphQL Sync**
   - Connect stores using minimal scopes (`read_products`, `read_inventory`).
   - Store access tokens encrypted at rest using **AES-256-GCM** with 96-bit IV and auth tag.
   - Syncs all products, variants, images, inventory quantities, prices, and metafields with cursor pagination and rate-limit leaky bucket handling.
   - Built-in rich Indian mock catalog seeder for instant 1-click zero-config testing.
   - Full support for Shopify webhooks: `app/uninstalled`, GDPR webhooks (`customers/data_request`, `customers/redact`, `shop/redact`), `products/update`, and `inventory_levels/update`.

2. **AI Category & Vertical Taxonomy Mapping**
   - Automatically suggests best marketplace taxonomy:
     - **Amazon.in**: Browse Node / Category Tree
     - **Flipkart**: Verticals & Item Types
     - **Meesho**: Reseller Categories
     - **Myntra**: Article Type & Gender
     - **JioMart**: Merchant Taxonomy
   - Seller can override category mappings per marketplace.

3. **Multi-Marketplace Listing Optimizer**
   - **Amazon.in Rules**: Max 200 chars, Brand first, Title case, 5 capital-lead bullet points, backend search terms (max 249 bytes), no promotional spam words ("Sale", "Best", "#1").
   - **Flipkart Rules**: Max 80 chars, Brand + Model/Style + Gender + Pack of X format, 3-5 key specs.
   - **Meesho Rules**: Concise value-driven titles, chest measurements in inches for size chart, fabric specifications.
   - **Myntra Rules**: High-fashion editorial tone, Style Note, Size & Fit, Material & Care, Occasion.
   - **JioMart Rules**: Pack size, net quantity, manufacturer/packer details under Indian Legal Metrology Act.
   - **Indian Attributes**: Auto-suggests verified 6-digit **HSN codes** (e.g. 620520 for cotton shirts, 520851 for sarees, 640399 for footwear, 851830 for earbuds) and **GST slabs** (0%, 5%, 12%, 18%, 28%).
   - **Missing required fields are flagged in BRIGHT RED badges** with inline error explanations.

4. **Image Compliance Checker**
   - Pure white background requirement check for main image (Amazon & Flipkart mandate pure white RGB (255, 255, 255)).
   - Minimum resolution verification (Amazon requires &ge;1000px on longest side for zoom).
   - Flag promotional text, discount badges, or watermarks.

5. **Marketplace Fee & Profit Margin Calculator**
   - Accurate Indian e-commerce economics: Referral Commission %, Fixed Closing Fee, Shipping Fee slab, and 18% GST on marketplace charges.
   - Calculates target margin Selling Price and suggested MRP for discount strike-throughs.
   - **Zero hardcoding**: Commission rates are editable in database `pricing_rules`.

6. **Bulk Export Engine & `MarketplaceConnector`**
   - Generates official bulk upload files:
     - Amazon.in: `Flat.File.InventoryLoader.in` (.xlsx)
     - Flipkart: Listing Bulk Upload file (.csv)
     - Meesho: Supplier Bulk Upload sheet (.xlsx)
     - Myntra: Partner Stylesheet (.xlsx)
     - JioMart: Seller Hub Catalog (.xlsx)
   - Stored in editable database templates (`marketplace_templates`).
   - Extensible `MarketplaceConnector` interface ready for direct SP-API / Seller API publishing.

7. **Inventory Sync Dashboard**
   - Real-time comparison: Shopify stock vs. exported marketplace listings.
   - Flags products that need re-export whenever stock or prices change.

8. **Payments & Subscriptions**
   - **Razorpay** (INR) for Indian sellers (UPI, Cards, NetBanking).
   - **Stripe** (USD) for international merchants.
   - Webhooks with cryptographic signature verification unlock plan limits:
     - Free: 10 products, 1 marketplace
     - Starter (₹999/mo): 200 products, all 5 marketplaces
     - Pro (₹2,999/mo): 2,000 products, bulk re-optimization, priority support
     - Done-For-You Add-on (₹9,999): Our team handles marketplace onboarding.

9. **Transactional Emails (Resend)**
   - Welcome email on store connection
   - Export job finished notification with direct file download link
   - Payment receipt with transaction reference

10. **Admin Portal (`role=admin`)**
    - Platform metrics: Users, Stores, Products, Subscriptions, MRR.
    - Editable `pricing_rules` management (live commission and fee adjustments).
    - Editable `marketplace_templates` manager (upload new version, edit JSON mappings).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) on every table
- **File Processing**: SheetJS (`xlsx`)
- **Payments**: Razorpay Node SDK + Stripe SDK behind unified abstraction
- **Transactional Emails**: Resend SDK
- **AI Engine**: OpenAI (GPT-4o) / Anthropic (Claude 3.5 Sonnet) provider wrapper with Zod validation and 1x retry on bad output

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your API keys (or run with defaults for instant offline/demo mode).

### 3. Database Setup (Supabase)
Run the migration and seed scripts in Supabase SQL editor:
```bash
# Migration: creates all tables, indexes, and RLS policies
supabase/migrations/20240101000000_create_listkaro_schema.sql

# Seed: populates marketplaces, templates, pricing rules, and demo catalog
supabase/seed.sql
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
listkaro/
├── .env.example                               # Environment secrets specification
├── supabase/
│   ├── migrations/
│   │   └── 20240101000000_create_listkaro_schema.sql # Complete SQL Schema + RLS
│   └── seed.sql                               # Initial seed data for marketplaces & rules
├── src/
│   ├── app/
│   │   ├── page.tsx                           # Marketing Landing Page
│   │   ├── pricing/page.tsx                   # Pricing Page (INR & USD)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                       # Dashboard Overview
│   │   │   ├── products/page.tsx              # Products Catalog
│   │   │   ├── products/[id]/page.tsx         # Multi-Marketplace Listing Optimizer
│   │   │   ├── optimizer/page.tsx             # 1-Click Bulk Optimizer
│   │   │   ├── images/page.tsx                # Image Compliance Checker
│   │   │   ├── pricing/page.tsx               # Marketplace Pricing Calculator
│   │   │   ├── inventory/page.tsx             # Inventory Sync Dashboard
│   │   │   ├── exports/page.tsx               # Bulk Export History & Downloads
│   │   │   ├── templates/page.tsx             # Template Mapping Viewer
│   │   │   └── settings/page.tsx              # Store, Encryption & Webhooks
│   │   ├── admin/page.tsx                     # Admin Control Panel (role=admin)
│   │   └── api/
│   │       ├── auth/shopify/                  # OAuth authorize & callback
│   │       ├── shopify/sync/                  # GraphQL sync route
│   │       ├── webhooks/shopify/[topic]/      # Shopify & GDPR Webhooks
│   │       ├── optimizer/                     # Category & Listing AI APIs
│   │       ├── images/check/                  # Vision image compliance API
│   │       ├── pricing/calculate/             # Profit margin calculator API
│   │       ├── exports/                       # Bulk XLSX/CSV generation & download
│   │       ├── payments/                      # Unified Razorpay/Stripe checkout
│   │       └── admin/                         # Admin templates & pricing APIs
│   ├── components/                            # UI Components & Navigation
│   ├── lib/
│   │   ├── crypto.ts                          # AES-256-GCM encryption & HMAC verification
│   │   ├── ai/provider.ts                     # AI Provider Wrapper + Zod validation + retry
│   │   ├── marketplaces/rules.ts              # Amazon, Flipkart, Meesho, Myntra, JioMart Rules
│   │   ├── images/checker.ts                  # Pure white bg, zoom resolution, watermark checker
│   │   ├── pricing/calculator.ts              # Indian marketplace fee & margin economics
│   │   ├── exporters/connector.ts             # MarketplaceConnector & XLSX/CSV generators
│   │   ├── shopify/client.ts                  # GraphQL Admin API client & mock seeder
│   │   ├── payments/service.ts                # Razorpay & Stripe unified service
│   │   ├── email/resend.ts                    # Resend transactional emails
│   │   └── db/index.ts                        # Unified database repository
│   └── types/index.ts                         # Complete TypeScript definitions
```

---

## 🛡️ Security & Privacy
- **Zero Fake Content Policy**: System prompts strictly prohibit hallucinating fake reviews, ratings, testimonials, or artificial scarcity counters.
- **Access Token Encryption**: Encrypted at rest using AES-256-GCM.
- **Row Level Security**: Every table in Supabase enforces RLS to restrict seller access to their own records.
- **GDPR Endpoints**: Fully implemented `customers/data_request`, `customers/redact`, and `shop/redact`.

---

© 2026 ListKaro Technologies Pvt Ltd. Built for Indian E-Commerce Champions.
