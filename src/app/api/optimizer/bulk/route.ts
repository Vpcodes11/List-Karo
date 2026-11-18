import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { optimizeProductListingWithAI } from "@/lib/ai/provider";
import { validateListingForMarketplace } from "@/lib/marketplaces/rules";
import { checkMarketplaceImages } from "@/lib/images/checker";

export async function POST(req: NextRequest) {
  try {
    const { productIds, marketplaceIds } = await req.json();

    const targetProducts = productIds?.length
      ? db.products.filter((p) => productIds.includes(p.id))
      : db.products;

    const targetMarketplaces: MarketplaceId[] = marketplaceIds?.length
      ? marketplaceIds
      : ["amazon", "flipkart", "meesho", "myntra", "jiomart"];

    const optimizedResults = [];

    for (const product of targetProducts) {
      for (const mId of targetMarketplaces) {
        const category = product.selected_marketplace_categories?.[mId] || product.suggested_marketplace_categories?.[mId];
        const optimized = await optimizeProductListingWithAI(product, mId, category);
        const validation = validateListingForMarketplace(optimized, mId);
        const imageChecks = await checkMarketplaceImages(product.images, mId);

        const hasImageFailure = imageChecks.some((c) => c.status === "rejected");
        const status = !validation.isValid || hasImageFailure ? "needs_attention" : "valid";

        const existingIdx = db.listings.findIndex(
          (l) => l.product_id === product.id && l.marketplace_id === mId
        );

        const record = {
          id: existingIdx >= 0 ? db.listings[existingIdx].id : `list_${product.id}_${mId}`,
          product_id: product.id,
          marketplace_id: mId,
          category,
          optimized,
          validation_errors: {
            missingFields: validation.missingFields,
            warnings: validation.warnings,
            fieldErrors: validation.fieldErrors,
          },
          image_checks: imageChecks,
          status,
          created_at: existingIdx >= 0 ? db.listings[existingIdx].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          db.listings[existingIdx] = record as any;
        } else {
          db.listings.push(record as any);
        }

        optimizedResults.push({
          productId: product.id,
          marketplaceId: mId,
          title: optimized.title,
          status,
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalOptimized: optimizedResults.length,
      results: optimizedResults,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Bulk optimization failed" },
      { status: 500 }
    );
  }
}
