-- ==============================================================================
-- ListKaro - Supabase PostgreSQL Schema with Strict RLS Policies
-- Description: Shopify Catalog to Indian Marketplaces in 1-Click
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'seller' CHECK (role IN ('seller', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stores Table (Connected Shopify Stores)
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_domain TEXT NOT NULL UNIQUE,
    access_token_encrypted TEXT,
    iv TEXT,
    auth_tag TEXT,
    scopes TEXT NOT NULL DEFAULT 'read_products,read_inventory',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Marketplaces Table (Amazon, Flipkart, Meesho, Myntra, JioMart)
CREATE TABLE IF NOT EXISTS public.marketplaces (
    id TEXT PRIMARY KEY, -- 'amazon', 'flipkart', 'meesho', 'myntra', 'jiomart'
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Products Table (Shopify catalog synced)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    shopify_product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description_html TEXT,
    vendor TEXT,
    product_type TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    images JSONB DEFAULT '[]'::jsonb,
    suggested_marketplace_categories JSONB DEFAULT '{}'::jsonb,
    selected_marketplace_categories JSONB DEFAULT '{}'::jsonb,
    metafields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, shopify_product_id)
);

-- 5. Variants Table
CREATE TABLE IF NOT EXISTS public.variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    shopify_variant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    sku TEXT NOT NULL,
    barcode TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    compare_at_price NUMERIC(12, 2),
    inventory_quantity INTEGER NOT NULL DEFAULT 0,
    options JSONB DEFAULT '{}'::jsonb,
    weight NUMERIC(10, 3),
    weight_unit TEXT DEFAULT 'kg',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, shopify_variant_id)
);

-- 6. Marketplace Templates Table (Editable bulk upload mappings)
CREATE TABLE IF NOT EXISTS public.marketplace_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketplace_id TEXT NOT NULL REFERENCES public.marketplaces(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'All',
    version TEXT NOT NULL DEFAULT 'v1.0',
    field_mapping JSONB NOT NULL DEFAULT '{}'::jsonb,
    file TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Product Listings Table (Optimized listings per marketplace)
CREATE TABLE IF NOT EXISTS public.product_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    marketplace_id TEXT NOT NULL REFERENCES public.marketplaces(id) ON DELETE CASCADE,
    category TEXT,
    optimized JSONB NOT NULL DEFAULT '{}'::jsonb,
    validation_errors JSONB NOT NULL DEFAULT '{"missingFields":[], "warnings":[], "fieldErrors":{}}'::jsonb,
    image_checks JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'optimized', 'valid', 'needs_attention', 'exported')),
    exported_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, marketplace_id)
);

-- 8. Pricing Rules Table (Commissions, closing fees, shipping, GST)
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketplace_id TEXT NOT NULL REFERENCES public.marketplaces(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'General',
    commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    fixed_fee NUMERIC(8, 2) NOT NULL DEFAULT 15.00,
    shipping_fee NUMERIC(8, 2) NOT NULL DEFAULT 50.00,
    marketplace_gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Exports Table (Bulk file generation history)
CREATE TABLE IF NOT EXISTS public.exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    marketplace_id TEXT NOT NULL REFERENCES public.marketplaces(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_format TEXT NOT NULL CHECK (file_format IN ('xlsx', 'csv')),
    file_url TEXT NOT NULL,
    items_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Subscriptions Table (Razorpay & Stripe integration)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'done_for_you')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
    provider TEXT NOT NULL DEFAULT 'razorpay' CHECK (provider IN ('razorpay', 'stripe')),
    provider_sub_id TEXT,
    product_limit INTEGER NOT NULL DEFAULT 10,
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_listings_product_id ON public.product_listings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_marketplace ON public.product_listings(marketplace_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_status ON public.product_listings(status);
CREATE INDEX IF NOT EXISTS idx_exports_user_id ON public.exports(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read/update their own profile; admins can read all
CREATE POLICY "Users can manage own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id OR public.is_admin());

-- Stores: Users can only view and manage their own stores
CREATE POLICY "Users manage own stores"
    ON public.stores FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

-- Marketplaces: Everyone authenticated can read marketplaces; only admins can edit
CREATE POLICY "Public read marketplaces"
    ON public.marketplaces FOR SELECT
    USING (TRUE);

CREATE POLICY "Admin manage marketplaces"
    ON public.marketplaces FOR ALL
    USING (public.is_admin());

-- Products: Users can manage products of their stores
CREATE POLICY "Users manage own products"
    ON public.products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = products.store_id
            AND stores.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- Variants: Users can manage variants belonging to their products
CREATE POLICY "Users manage own variants"
    ON public.variants FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            JOIN public.stores ON stores.id = products.store_id
            WHERE products.id = variants.product_id
            AND stores.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- Marketplace Templates: All authenticated users can read templates; only admins can create/update
CREATE POLICY "Users read templates"
    ON public.marketplace_templates FOR SELECT
    USING (TRUE);

CREATE POLICY "Admin manage templates"
    ON public.marketplace_templates FOR ALL
    USING (public.is_admin());

-- Product Listings: Users can manage listings belonging to their products
CREATE POLICY "Users manage own listings"
    ON public.product_listings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            JOIN public.stores ON stores.id = products.store_id
            WHERE products.id = product_listings.product_id
            AND stores.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- Pricing Rules: Users can read rules; admins can modify
CREATE POLICY "Users read pricing rules"
    ON public.pricing_rules FOR SELECT
    USING (TRUE);

CREATE POLICY "Admin manage pricing rules"
    ON public.pricing_rules FOR ALL
    USING (public.is_admin());

-- Exports: Users can view and create their own exports
CREATE POLICY "Users manage own exports"
    ON public.exports FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

-- Subscriptions: Users can read their own subscriptions; webhook/admin can update
CREATE POLICY "Users read own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Service and Admin manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (public.is_admin());
