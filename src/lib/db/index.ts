import {
  ExportRecord,
  MarketplaceId,
  MarketplaceTemplate,
  PricingRule,
  Product,
  ProductListing,
  Store,
  Subscription,
  UserProfile,
} from "@/types";
import { getMockShopifyCatalog } from "@/lib/shopify/client";
import { DEFAULT_TEMPLATE_MAPPINGS } from "@/lib/exporters/connector";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

// In-Memory state store for resilient zero-config execution & local testing
class ListKaroDB {
  public stores: Store[] = [
    {
      id: "store_demo",
      user_id: "user_demo",
      shop_domain: "virasat-crafts.myshopify.com",
      scopes: "read_products,read_inventory",
      is_active: true,
      synced_at: new Date(Date.now() - 3600000).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  public products: Product[] = getMockShopifyCatalog("store_demo");

  public listings: ProductListing[] = [
    {
      id: "list_101_amz",
      product_id: "prod_101",
      marketplace_id: "amazon",
      category: "Clothing & Accessories > Women > Ethnic Wear > Kurtas & Kurtis",
      optimized: {
        title: "Virasat Weaves Royal Chanderi Silk Saree with Zari Border for Women",
        bulletPoints: [
          "HANDCRAFTED CHANDERI SILK: Woven from traditional looms with opulent zari floral motifs across the border.",
          "ELEGANT DRAPE & FEEL: Lightweight, breathable fabric tailored for extended celebratory occasions.",
          "VERSATILE OCCASION WEAR: Perfect for weddings, Diwali puja, religious festivities, and milestone gatherings.",
          "AUTHENTIC WEAVERS GUILD: Certified handloom authentic product crafted in Madhya Pradesh.",
          "CARE & PACKAGING: Dry clean recommended to maintain zari luster. Store in soft muslin cloth.",
        ],
        description: "Handcrafted Chanderi silk saree featuring intricate golden zari motifs across the pallu. Made by traditional weavers in Madhya Pradesh.",
        backendSearchTerms: "chanderi silk saree zari border festive ethnic wear wedding green saree",
        attributes: {
          brand: "Virasat Weaves",
          material: "Chanderi Silk & Zari",
          sizeChart: "Free Size (6.3 Meters including blouse piece)",
          hsnCode: "520851",
          gstRate: 5,
          countryOfOrigin: "India",
          manufacturerDetails: "Virasat Handlooms, Chanderi, Ashoknagar, MP, India",
          packerDetails: "Virasat Logistics, Indore, MP, India",
          fitType: "Regular",
          occasion: "Wedding & Festive",
        },
      },
      validation_errors: {
        missingFields: [],
        warnings: [],
        fieldErrors: {},
      },
      status: "valid",
      exported_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  public templates: MarketplaceTemplate[] = [
    {
      id: "tmpl_amz_1",
      marketplace_id: "amazon",
      category: "All / General Apparel",
      version: "v2024.3",
      field_mapping: DEFAULT_TEMPLATE_MAPPINGS.amazon,
      file_format: "xlsx",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "tmpl_fk_1",
      marketplace_id: "flipkart",
      category: "Clothing and Accessories",
      version: "v4.1",
      field_mapping: DEFAULT_TEMPLATE_MAPPINGS.flipkart,
      file_format: "csv",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "tmpl_meesho_1",
      marketplace_id: "meesho",
      category: "Fashion & Lifestyle",
      version: "v2.0",
      field_mapping: DEFAULT_TEMPLATE_MAPPINGS.meesho,
      file_format: "xlsx",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "tmpl_myn_1",
      marketplace_id: "myntra",
      category: "Apparel & Accessories",
      version: "v3.2",
      field_mapping: DEFAULT_TEMPLATE_MAPPINGS.myntra,
      file_format: "xlsx",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "tmpl_jio_1",
      marketplace_id: "jiomart",
      category: "Fashion & General",
      version: "v1.9",
      field_mapping: DEFAULT_TEMPLATE_MAPPINGS.jiomart,
      file_format: "xlsx",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  public pricingRules: PricingRule[] = (Object.keys(MARKETPLACE_RULES) as MarketplaceId[]).map(
    (mId, idx) => {
      const def = MARKETPLACE_RULES[mId];
      return {
        id: `rule_${mId}`,
        marketplace_id: mId,
        category: "General",
        commission_percent: def.defaultCommissionPercent,
        fixed_fee: def.defaultFixedFee,
        shipping_fee: def.defaultShippingFee,
        marketplace_gst_percent: 18.0,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  );

  public subscriptions: Subscription[] = [
    {
      id: "sub_demo",
      user_id: "user_demo",
      plan: "pro",
      status: "active",
      provider: "razorpay",
      provider_sub_id: "sub_rzp_active_demo",
      product_limit: 2000,
      current_period_end: new Date(Date.now() + 86400000 * 30).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  public exports: ExportRecord[] = [
    {
      id: "exp_101",
      user_id: "user_demo",
      marketplace_id: "amazon",
      file_name: "ListKaro_Amazon_Catalog_2026-11-18.xlsx",
      file_format: "xlsx",
      file_url: "/api/exports/download?id=exp_101",
      items_count: 5,
      download_count: 3,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "exp_102",
      user_id: "user_demo",
      marketplace_id: "flipkart",
      file_name: "ListKaro_Flipkart_Catalog_2026-11-18.csv",
      file_format: "csv",
      file_url: "/api/exports/download?id=exp_102",
      items_count: 5,
      download_count: 1,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  public users: UserProfile[] = [
    {
      id: "user_demo",
      email: "merchant@virasatcrafts.com",
      full_name: "Aakash Sharma",
      role: "seller",
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: "user_admin",
      email: "admin@listkaro.in",
      full_name: "ListKaro Operations Admin",
      role: "admin",
      created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
    },
  ];
}

// Global singleton instance for in-memory persistence during dev session
const globalForDB = global as unknown as { dbInstance?: ListKaroDB };
export const db = globalForDB.dbInstance || new ListKaroDB();
if (process.env.NODE_ENV !== "production") globalForDB.dbInstance = db;
