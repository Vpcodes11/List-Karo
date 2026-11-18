import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken } from "@/lib/shopify/client";
import { encryptToken } from "@/lib/crypto";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");

  if (!shop || !code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=Missing_Shopify_OAuth_Params", req.url)
    );
  }

  try {
    const { accessToken, scopes } = await exchangeCodeForAccessToken(shop, code);
    const { encryptedData, iv, authTag } = encryptToken(accessToken);

    const existingStore = db.stores.find((s) => s.shop_domain === shop);
    if (existingStore) {
      existingStore.access_token_encrypted = encryptedData;
      existingStore.iv = iv;
      existingStore.auth_tag = authTag;
      existingStore.scopes = scopes;
      existingStore.is_active = true;
      existingStore.updated_at = new Date().toISOString();
    } else {
      db.stores.push({
        id: `store_${Date.now()}`,
        user_id: "user_demo",
        shop_domain: shop,
        access_token_encrypted: encryptedData,
        iv,
        auth_tag: authTag,
        scopes,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.redirect(
      new URL("/dashboard?shopify_connected=true", req.url)
    );
  } catch (err: any) {
    console.error("Shopify OAuth callback error:", err);
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(err.message)}`, req.url)
    );
  }
}
