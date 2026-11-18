import * as XLSX from "xlsx";
import { MarketplaceId, MarketplaceTemplate, Product, ProductListing, ProductVariant } from "@/types";

export interface EnrichedListingExportItem {
  listing: ProductListing;
  product: Product;
  variant?: ProductVariant;
}

export interface ExportResult {
  buffer: Buffer;
  fileName: string;
  format: "xlsx" | "csv";
  rowCount: number;
}

export interface PublishResult {
  success: boolean;
  externalBatchId?: string;
  message: string;
}

/**
 * Extensible Marketplace Connector Interface
 * Supports file export today and direct API publishing in the future
 */
export interface MarketplaceConnector {
  marketplaceId: MarketplaceId;
  name: string;
  generateFileExport(
    items: EnrichedListingExportItem[],
    template?: MarketplaceTemplate
  ): Promise<ExportResult>;
  publishDirect?(items: EnrichedListingExportItem[]): Promise<PublishResult>;
}

// Default field headers per marketplace
export const DEFAULT_TEMPLATE_MAPPINGS: Record<MarketplaceId, Record<string, string>> = {
  amazon: {
    sku: "seller_sku",
    title: "item_name",
    brand: "brand_name",
    price: "standard_price",
    mrp: "list_price",
    quantity: "quantity",
    hsnCode: "hsn_code",
    gstRate: "tax_code",
    bullet1: "bullet_point1",
    bullet2: "bullet_point2",
    bullet3: "bullet_point3",
    bullet4: "bullet_point4",
    bullet5: "bullet_point5",
    description: "product_description",
    searchTerms: "generic_keywords",
    mainImage: "main_image_url",
    material: "material_composition",
    countryOfOrigin: "country_of_origin",
    manufacturer: "manufacturer_contact_information",
  },
  flipkart: {
    sku: "Seller SKU ID",
    title: "Product Title",
    brand: "Brand Name",
    price: "Flipkart Selling Price",
    mrp: "MRP",
    quantity: "Stock Count",
    hsnCode: "HSN Code",
    gstRate: "GST Slab",
    bullet1: "Key Feature 1",
    bullet2: "Key Feature 2",
    bullet3: "Key Feature 3",
    description: "Detailed Description",
    mainImage: "Primary Image URL",
    material: "Fabric",
    fitType: "Fit",
    countryOfOrigin: "Country of Origin",
  },
  meesho: {
    sku: "Supplier SKU",
    title: "Product Name",
    price: "Meesho Price",
    mrp: "Customer Price",
    quantity: "Inventory",
    hsnCode: "HSN Code",
    gstRate: "GST Rate",
    material: "Fabric",
    sizeChart: "Sizes Available",
    mainImage: "Image 1 URL",
    description: "Product Description",
    countryOfOrigin: "Country of Origin",
  },
  myntra: {
    sku: "Style Code",
    title: "Style Name",
    brand: "Brand Name",
    price: "Discounted Price",
    mrp: "MRP",
    quantity: "Units",
    hsnCode: "HSN Code",
    gstRate: "Tax Rate",
    bullet1: "Style Note",
    bullet2: "Size & Fit",
    bullet3: "Material & Care",
    bullet4: "Trend Occasion",
    mainImage: "Front View URL",
    description: "Complete Description",
    countryOfOrigin: "Country of Origin",
  },
  jiomart: {
    sku: "Merchant Item Code",
    title: "Product Title",
    brand: "Brand",
    price: "Selling Price",
    mrp: "MRP",
    quantity: "Available Quantity",
    hsnCode: "HSN",
    gstRate: "GST (%)",
    bullet1: "Highlight 1",
    bullet2: "Highlight 2",
    mainImage: "Image URL",
    description: "Description",
    packerDetails: "Packer & Marketer Details",
    countryOfOrigin: "Country of Origin",
  },
};

/**
 * Base helper to transform listing item into template row
 */
function mapItemToRow(
  item: EnrichedListingExportItem,
  mapping: Record<string, string>,
  marketplaceId: MarketplaceId
): Record<string, any> {
  const { listing, product, variant } = item;
  const opt = listing.optimized;
  const attrs = opt.attributes || {};

  const bullets = opt.bulletPoints || [];
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200";

  const rawValues: Record<string, any> = {
    sku: variant?.sku || `SKU-${product.shopify_product_id.slice(-6)}`,
    title: opt.title,
    brand: attrs.brand || product.vendor,
    price: variant?.price || 999,
    mrp: variant?.compare_at_price || Math.ceil((variant?.price || 999) * 1.8),
    quantity: variant?.inventory_quantity ?? 50,
    hsnCode: attrs.hsnCode || "620520",
    gstRate: attrs.gstRate || 5,
    bullet1: bullets[0] || "",
    bullet2: bullets[1] || "",
    bullet3: bullets[2] || "",
    bullet4: bullets[3] || "",
    bullet5: bullets[4] || "",
    description: opt.description,
    searchTerms: opt.backendSearchTerms || "",
    mainImage: primaryImage,
    material: attrs.material || "Cotton",
    sizeChart: attrs.sizeChart || "Standard",
    fitType: attrs.fitType || "Regular Fit",
    countryOfOrigin: attrs.countryOfOrigin || "India",
    manufacturer: attrs.manufacturerDetails || `${product.vendor}, India`,
    packerDetails: attrs.packerDetails || `${product.vendor}, India`,
  };

  const mappedRow: Record<string, any> = {};
  for (const [key, headerName] of Object.entries(mapping)) {
    mappedRow[headerName] = rawValues[key] ?? "";
  }

  return mappedRow;
}

/**
 * Create an XLSX buffer from an array of mapped objects
 */
function createXlsxBuffer(rows: Record<string, any>[], sheetName: string): Buffer {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

/**
 * Create a CSV string buffer from an array of mapped objects
 */
function createCsvBuffer(rows: Record<string, any>[]): Buffer {
  const ws = XLSX.utils.json_to_sheet(rows);
  const csvStr = XLSX.utils.sheet_to_csv(ws);
  return Buffer.from(csvStr, "utf-8");
}

// 1. Amazon.in Flat File Connector
export const AmazonConnector: MarketplaceConnector = {
  marketplaceId: "amazon",
  name: "Amazon.in Inventory Loader",
  async generateFileExport(items, template) {
    const mapping = template?.field_mapping || DEFAULT_TEMPLATE_MAPPINGS.amazon;
    const rows = items.map((i) => mapItemToRow(i, mapping, "amazon"));
    const buffer = createXlsxBuffer(rows, "Flat.File.InventoryLoader.in");
    const dateStr = new Date().toISOString().split("T")[0];
    return {
      buffer,
      fileName: `ListKaro_Amazon_Catalog_${dateStr}.xlsx`,
      format: "xlsx",
      rowCount: rows.length,
    };
  },
  async publishDirect(items) {
    // Architectural placeholder for SP-API Feed Submission API
    return {
      success: true,
      externalBatchId: `AMZ-FEED-${Date.now()}`,
      message: `Simulated SP-API direct submission of ${items.length} listings.`,
    };
  },
};

// 2. Flipkart Connector
export const FlipkartConnector: MarketplaceConnector = {
  marketplaceId: "flipkart",
  name: "Flipkart Bulk Catalog File",
  async generateFileExport(items, template) {
    const mapping = template?.field_mapping || DEFAULT_TEMPLATE_MAPPINGS.flipkart;
    const rows = items.map((i) => mapItemToRow(i, mapping, "flipkart"));
    const buffer = createCsvBuffer(rows);
    const dateStr = new Date().toISOString().split("T")[0];
    return {
      buffer,
      fileName: `ListKaro_Flipkart_Catalog_${dateStr}.csv`,
      format: "csv",
      rowCount: rows.length,
    };
  },
  async publishDirect(items) {
    return {
      success: true,
      externalBatchId: `FK-BATCH-${Date.now()}`,
      message: `Simulated Flipkart Marketplace Seller API listing batch of ${items.length} products.`,
    };
  },
};

// 3. Meesho Connector
export const MeeshoConnector: MarketplaceConnector = {
  marketplaceId: "meesho",
  name: "Meesho Supplier Bulk Catalog",
  async generateFileExport(items, template) {
    const mapping = template?.field_mapping || DEFAULT_TEMPLATE_MAPPINGS.meesho;
    const rows = items.map((i) => mapItemToRow(i, mapping, "meesho"));
    const buffer = createXlsxBuffer(rows, "Meesho Supplier Catalog");
    const dateStr = new Date().toISOString().split("T")[0];
    return {
      buffer,
      fileName: `ListKaro_Meesho_Catalog_${dateStr}.xlsx`,
      format: "xlsx",
      rowCount: rows.length,
    };
  },
};

// 4. Myntra Connector
export const MyntraConnector: MarketplaceConnector = {
  marketplaceId: "myntra",
  name: "Myntra Partner Portal Template",
  async generateFileExport(items, template) {
    const mapping = template?.field_mapping || DEFAULT_TEMPLATE_MAPPINGS.myntra;
    const rows = items.map((i) => mapItemToRow(i, mapping, "myntra"));
    const buffer = createXlsxBuffer(rows, "Myntra Stylesheet");
    const dateStr = new Date().toISOString().split("T")[0];
    return {
      buffer,
      fileName: `ListKaro_Myntra_Catalog_${dateStr}.xlsx`,
      format: "xlsx",
      rowCount: rows.length,
    };
  },
};

// 5. JioMart Connector
export const JioMartConnector: MarketplaceConnector = {
  marketplaceId: "jiomart",
  name: "JioMart Seller Hub Catalog",
  async generateFileExport(items, template) {
    const mapping = template?.field_mapping || DEFAULT_TEMPLATE_MAPPINGS.jiomart;
    const rows = items.map((i) => mapItemToRow(i, mapping, "jiomart"));
    const buffer = createXlsxBuffer(rows, "JioMart Bulk Products");
    const dateStr = new Date().toISOString().split("T")[0];
    return {
      buffer,
      fileName: `ListKaro_JioMart_Catalog_${dateStr}.xlsx`,
      format: "xlsx",
      rowCount: rows.length,
    };
  },
};

export const MARKETPLACE_CONNECTORS: Record<MarketplaceId, MarketplaceConnector> = {
  amazon: AmazonConnector,
  flipkart: FlipkartConnector,
  meesho: MeeshoConnector,
  myntra: MyntraConnector,
  jiomart: JioMartConnector,
};
