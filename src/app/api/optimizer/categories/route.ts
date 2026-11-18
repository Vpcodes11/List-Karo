import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { suggestMarketplaceCategoriesWithAI } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const product = db.products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const suggestions = await suggestMarketplaceCategoriesWithAI(product);
    product.suggested_marketplace_categories = suggestions;

    return NextResponse.json({
      success: true,
      productId,
      suggestions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to suggest marketplace categories" },
      { status: 500 }
    );
  }
}
