import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { optimizeProductListingWithAI } from "@/lib/ai/provider";
import { validateListingForMarketplace } from "@/lib/marketplaces/rules";
import { checkMarketplaceImages } from "@/lib/images/checker";

export async function POST(req: NextRequest) {
  try {
    const { productId, marketplaceId, category, customOverrides } = await req.json();

    if (!productId || !marketplaceId) {
      return NextResponse.json(
        { error: "productId and marketplaceId are required" },
        { status: 400 }
      );
    }

    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 1. Generate optimized listing data with AI
    let optimized = await optimizeProductListingWithAI(
      product,
      marketplaceId as MarketplaceId,
      category
    );

    // If seller provided manual overrides (e.g. customized title or HSN)
    if (customOverrides) {
      optimized = {
        ...optimized,
        ...customOverrides,
        attributes: {
          ...optimized.attributes,
          ...(customOverrides.attributes || {}),
        },
      };
    }

    // 2. Validate against marketplace rules
    const validation = validateListingForMarketplace(
      optimized,
      marketplaceId as MarketplaceId
    );

    // 3. Check images compliance
    const imageChecks = await checkMarketplaceImages(
      product.images,
      marketplaceId as MarketplaceId
    );

    const hasImageFailure = imageChecks.some((c) => c.status === "rejected");
    const status = !validation.isValid || hasImageFailure ? "needs_attention" : "valid";

    // 4. Save or update product_listing in DB
    const existingListingIdx = db.listings.findIndex(
      (l) => l.product_id === productId && l.marketplace_id === marketplaceId
    );

    const listingRecord = {
      id: existingListingIdx >= 0 ? db.listings[existingListingIdx].id : `list_${Date.now()}`,
      product_id: productId,
      marketplace_id: marketplaceId as MarketplaceId,
      category,
      optimized,
      validation_errors: {
        missingFields: validation.missingFields,
        warnings: validation.warnings,
        fieldErrors: validation.fieldErrors,
      },
      image_checks: imageChecks,
      status,
      created_at: existingListingIdx >= 0 ? db.listings[existingListingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingListingIdx >= 0) {
      db.listings[existingListingIdx] = listingRecord as any;
    } else {
      db.listings.push(listingRecord as any);
    }

    return NextResponse.json({
      success: true,
      listing: listingRecord,
      validation,
      imageChecks,
    });
  } catch (err: any) {
    console.error("Listing optimization error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to optimize listing" },
      { status: 500 }
    );
  }
}
