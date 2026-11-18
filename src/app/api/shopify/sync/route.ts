import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchAllShopifyProducts, getMockShopifyCatalog } from "@/lib/shopify/client";
import { decryptToken } from "@/lib/crypto";
import { sendWelcomeEmail } from "@/lib/email/resend";
import { suggestMarketplaceCategoriesWithAI } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const storeId = body.storeId || "store_demo";
    const isMock = body.mock === true || !process.env.SHOPIFY_API_KEY;

    let store = db.stores.find((s) => s.id === storeId);
    if (!store) {
      store = db.stores[0];
    }

    let products = [];

    if (isMock || !store.access_token_encrypted || !store.iv || !store.auth_tag) {
      // Load rich Indian demo catalog
      products = getMockShopifyCatalog(store.id);
    } else {
      // Decrypt live access token
      const accessToken = decryptToken(
        store.access_token_encrypted,
        store.iv,
        store.auth_tag
      );
      products = await fetchAllShopifyProducts(store.shop_domain, accessToken);
    }

    // Auto-generate AI category suggestions for newly synced products
    for (const prod of products) {
      if (!prod.suggested_marketplace_categories) {
        prod.suggested_marketplace_categories = await suggestMarketplaceCategoriesWithAI(prod);
      }
    }

    // Upsert into repository
    for (const prod of products) {
      const existingIdx = db.products.findIndex((p) => p.shopify_product_id === prod.shopify_product_id);
      if (existingIdx >= 0) {
        db.products[existingIdx] = { ...db.products[existingIdx], ...prod };
      } else {
        db.products.push(prod);
      }
    }

    store.synced_at = new Date().toISOString();

    // Trigger welcome notification
    await sendWelcomeEmail(db.users[0].email, store.shop_domain);

    return NextResponse.json({
      success: true,
      count: products.length,
      syncedAt: store.synced_at,
      products: db.products,
    });
  } catch (err: any) {
    console.error("Shopify sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync Shopify products" },
      { status: 500 }
    );
  }
}
