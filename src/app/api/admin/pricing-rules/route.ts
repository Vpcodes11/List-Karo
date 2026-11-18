import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    success: true,
    pricingRules: db.pricingRules,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { id, marketplace_id, commission_percent, fixed_fee, shipping_fee, marketplace_gst_percent } = await req.json();

    const idx = db.pricingRules.findIndex(
      (r) => r.id === id || r.marketplace_id === marketplace_id
    );

    if (idx >= 0) {
      db.pricingRules[idx] = {
        ...db.pricingRules[idx],
        commission_percent: Number(commission_percent ?? db.pricingRules[idx].commission_percent),
        fixed_fee: Number(fixed_fee ?? db.pricingRules[idx].fixed_fee),
        shipping_fee: Number(shipping_fee ?? db.pricingRules[idx].shipping_fee),
        marketplace_gst_percent: Number(marketplace_gst_percent ?? db.pricingRules[idx].marketplace_gst_percent),
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, rule: db.pricingRules[idx] });
    }

    return NextResponse.json({ error: "Pricing rule not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
