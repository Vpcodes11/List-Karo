import { NextRequest, NextResponse } from "next/server";
import { MarketplaceId } from "@/types";
import { calculateMarketplacePrice, compareAllMarketplaces } from "@/lib/pricing/calculator";

export async function POST(req: NextRequest) {
  try {
    const { cogs, targetMarginPercent, marketplaceId, customRule } = await req.json();

    if (!cogs || cogs <= 0) {
      return NextResponse.json({ error: "Valid COGS is required" }, { status: 400 });
    }

    const margin = targetMarginPercent ?? 25;

    if (marketplaceId) {
      const calculation = calculateMarketplacePrice({
        marketplaceId: marketplaceId as MarketplaceId,
        cogs: Number(cogs),
        targetMarginPercent: Number(margin),
        customRule,
      });

      return NextResponse.json({ success: true, calculation });
    } else {
      const comparison = compareAllMarketplaces(Number(cogs), Number(margin));
      return NextResponse.json({ success: true, comparison });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Pricing calculation failed" },
      { status: 500 }
    );
  }
}
