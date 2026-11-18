import { NextRequest, NextResponse } from "next/server";
import { getShopifyAuthUrl } from "@/lib/shopify/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json(
      { error: "Missing required 'shop' query parameter (e.g. your-store.myshopify.com)" },
      { status: 400 }
    );
  }

  const state = `state_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  const authUrl = getShopifyAuthUrl(shop, state);

  return NextResponse.redirect(authUrl);
}
