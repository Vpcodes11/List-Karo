import { NextRequest, NextResponse } from "next/server";
import { verifyAndProcessWebhook } from "@/lib/payments/service";
import { db } from "@/lib/db";
import { sendPaymentReceiptEmail } from "@/lib/email/resend";
import { PLANS } from "@/lib/payments/service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") || "";

    const { verified, userId, planId, providerSubId } = await verifyAndProcessWebhook(
      "stripe",
      rawBody,
      signature,
      rawBody
    );

    if (!verified) {
      return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
    }

    if (planId) {
      const planConfig = PLANS[planId];
      let sub = db.subscriptions.find((s) => s.user_id === (userId || "user_demo"));
      if (sub) {
        sub.plan = planId;
        sub.status = "active";
        sub.provider = "stripe";
        sub.provider_sub_id = providerSubId || sub.provider_sub_id;
        sub.product_limit = planConfig.productLimit;
        sub.current_period_end = new Date(Date.now() + 86400000 * 30).toISOString();
        sub.updated_at = new Date().toISOString();
      }

      await sendPaymentReceiptEmail(
        db.users[0].email,
        planConfig.name,
        `$${planConfig.priceUSD}`,
        providerSubId || `STR-${Date.now()}`
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
