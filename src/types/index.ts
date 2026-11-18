export type MarketplaceId = 'amazon' | 'flipkart' | 'meesho' | 'myntra' | 'jiomart';

export interface Store {
  id: string;
  user_id: string;
  shop_domain: string;
  access_token_encrypted?: string;
  iv?: string;
  auth_tag?: string;
  scopes: string;
  is_active: boolean;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  shopify_variant_id: string;
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  compare_at_price?: number;
  inventory_quantity: number;
  options: Record<string, string>;
  weight?: number;
  weight_unit?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
  position: number;
}

export interface Product {
  id: string;
  store_id: string;
  shopify_product_id: string;
  title: string;
  description_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  images: ProductImage[];
  suggested_marketplace_categories?: Record<MarketplaceId, string>;
  selected_marketplace_categories?: Record<MarketplaceId, string>;
  metafields?: Record<string, string>;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface MarketplaceRuleDefinition {
  id: MarketplaceId;
  name: string;
  code: string;
  logo: string;
  titleMaxLength: number;
  titleCaseRequirement: boolean;
  bulletPointsCount: { min: number; max: number };
  bulletPointMaxLength: number;
  backendSearchTermsMaxBytes: number;
  descriptionMaxLength: number;
  mainImageRequirements: {
    pureWhiteBackground: boolean;
    minWidth: number;
    minHeight: number;
    noWatermarksOrText: boolean;
  };
  requiredAttributes: {
    key: string;
    label: string;
    description: string;
    example: string;
  }[];
  defaultCommissionPercent: number;
  defaultFixedFee: number;
  defaultShippingFee: number;
}

export interface MarketplaceTemplate {
  id: string;
  marketplace_id: MarketplaceId;
  category: string;
  version: string;
  field_mapping: Record<string, string>;
  file_format: 'xlsx' | 'csv';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OptimizedListingData {
  title: string;
  bulletPoints: string[];
  description: string;
  backendSearchTerms?: string;
  attributes: {
    brand: string;
    material: string;
    sizeChart?: string;
    hsnCode: string;
    gstRate: number; // e.g. 5, 12, 18
    countryOfOrigin: string; // usually "India"
    manufacturerDetails?: string;
    packerDetails?: string;
    importerDetails?: string;
    color?: string;
    fitType?: string;
    occasion?: string;
    washCare?: string;
    [key: string]: any;
  };
}

export interface ImageCheckResult {
  imageUrl: string;
  isMainImage: boolean;
  resolution: { width: number; height: number };
  isResolutionValid: boolean;
  hasWhiteBackground: boolean;
  hasWatermarkOrText: boolean;
  issues: string[];
  status: 'compliant' | 'warning' | 'rejected';
}

export interface ProductListing {
  id: string;
  product_id: string;
  marketplace_id: MarketplaceId;
  category?: string;
  optimized: OptimizedListingData;
  validation_errors: {
    missingFields: string[];
    warnings: string[];
    fieldErrors: Record<string, string>;
  };
  image_checks?: ImageCheckResult[];
  status: 'draft' | 'optimized' | 'valid' | 'needs_attention' | 'exported';
  exported_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  marketplace_id: MarketplaceId;
  category: string;
  commission_percent: number;
  fixed_fee: number;
  shipping_fee: number;
  marketplace_gst_percent: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingCalculationResult {
  marketplaceId: MarketplaceId;
  cogs: number;
  targetMarginPercent: number;
  sellingPrice: number;
  mrp: number;
  commissionAmount: number;
  commissionPercent: number;
  fixedFee: number;
  shippingFee: number;
  marketplaceGst: number; // 18% GST on marketplace fees
  totalMarketplaceFees: number;
  netPayoutToSeller: number;
  netProfit: number;
  actualMarginPercent: number;
}

export interface ExportRecord {
  id: string;
  user_id: string;
  marketplace_id: MarketplaceId;
  file_name: string;
  file_format: 'xlsx' | 'csv';
  file_url: string;
  items_count: number;
  download_count: number;
  created_at: string;
}

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'done_for_you';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'past_due' | 'canceled';
  provider: 'razorpay' | 'stripe';
  provider_sub_id?: string;
  product_limit: number;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'seller' | 'admin';
  created_at: string;
}

export interface InventorySyncItem {
  productId: string;
  productTitle: string;
  sku: string;
  shopifyQuantity: number;
  shopifyPrice: number;
  exportedQuantity?: number;
  exportedPrice?: number;
  lastExportedAt?: string;
  syncStatus: 'in_sync' | 'stock_changed' | 'price_changed' | 'needs_re_export';
  marketplacesExported: MarketplaceId[];
}
