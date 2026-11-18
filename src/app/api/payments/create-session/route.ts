import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/payments/service";
import { db } from "@/lib/db";
import { SubscriptionPlan } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { planId, currency } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    const user = db.users[0]; // Active session user
    const result = await createCheckoutSession(
      user.id,
      user.email,
      planId as SubscriptionPlan,
      currency || "INR"
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error("Create checkout session failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
