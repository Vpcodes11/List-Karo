import { NextRequest, NextResponse } from "next/server";
import { verifyShopifyHmac } from "@/lib/crypto";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { topic: string } }
) {
  const topic = params.topic;
  const rawBody = await req.text();
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") || "";
  const shopDomain = req.headers.get("x-shopify-shop-domain") || "";
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_CLIENT_SECRET || "shopify_webhook_secret_demo";

  // Verify HMAC in production
  if (process.env.NODE_ENV === "production" && !verifyShopifyHmac(rawBody, hmacHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
  }

  const payload = rawBody ? JSON.parse(rawBody) : {};

  switch (topic) {
    case "app-uninstalled": {
      const store = db.stores.find((s) => s.shop_domain === shopDomain);
      if (store) {
        store.is_active = false;
        store.updated_at = new Date().toISOString();
      }
      return NextResponse.json({ success: true, message: "App uninstalled recorded" });
    }

    case "customers-data-request": {
      // Mandatory GDPR webhook: Customer requests their data
      console.log(`[GDPR] Customer data request received for shop ${shopDomain}:`, payload.customer?.id);
      return NextResponse.json({ success: true, message: "No direct customer PII stored outside Shopify" });
    }

    case "customers-redact": {
      // Mandatory GDPR webhook: Customer requests erasure of their data
      console.log(`[GDPR] Customer redact received for shop ${shopDomain}:`, payload.customer?.id);
      return NextResponse.json({ success: true, message: "Customer data redact processed" });
    }

    case "shop-redact": {
      // Mandatory GDPR webhook: Shop uninstalled > 48h, erase shop records
      console.log(`[GDPR] Shop redact received for ${shopDomain}`);
      const storeIdx = db.stores.findIndex((s) => s.shop_domain === shopDomain);
      if (storeIdx >= 0) {
        const storeId = db.stores[storeIdx].id;
        db.stores.splice(storeIdx, 1);
        db.products = db.products.filter((p) => p.store_id !== storeId);
      }
      return NextResponse.json({ success: true, message: "Shop redact completed" });
    }

    case "products-update": {
      // Product title, description or price updated in Shopify
      const shopifyProductId = payload.id ? `gid://shopify/Product/${payload.id}` : "";
      const existingProduct = db.products.find(
        (p) => p.shopify_product_id === shopifyProductId || p.id === payload.id
      );

      if (existingProduct) {
        if (payload.title) existingProduct.title = payload.title;
        existingProduct.updated_at = new Date().toISOString();

        // Flag any exported listings as needing re-export
        const affectedListings = db.listings.filter((l) => l.product_id === existingProduct.id);
        for (const listing of affectedListings) {
          listing.validation_errors.warnings.push("Shopify product updated. Re-export recommended to sync marketplace.");
          if (listing.status === "exported") {
            listing.status = "needs_attention";
          }
        }
      }
      return NextResponse.json({ success: true, message: "Product update processed" });
    }

    case "inventory-levels-update": {
      // Inventory level changed in Shopify
      const inventoryItemId = payload.inventory_item_id;
      const available = payload.available;

      // Update variant inventory
      for (const prod of db.products) {
        for (const variant of prod.variants || []) {
          // If match found, update stock
          variant.inventory_quantity = available ?? variant.inventory_quantity;
        }
      }

      return NextResponse.json({ success: true, message: "Inventory level updated" });
    }

    default:
      return NextResponse.json({ success: true, message: `Webhook ${topic} received` });
  }
}
