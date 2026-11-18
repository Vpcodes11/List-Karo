import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { checkMarketplaceImages } from "@/lib/images/checker";

export async function POST(req: NextRequest) {
  try {
    const { productId, marketplaceId } = await req.json();

    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const checks = await checkMarketplaceImages(
      product.images,
      (marketplaceId as MarketplaceId) || "amazon"
    );

    return NextResponse.json({
      success: true,
      productId,
      marketplaceId,
      imageChecks: checks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to inspect images" },
      { status: 500 }
    );
  }
}
