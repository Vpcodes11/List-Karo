import Stripe from "stripe";
import Razorpay from "razorpay";
import { SubscriptionPlan } from "@/types";
import { verifyRazorpaySignature } from "@/lib/crypto";

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  priceINR: number;
  priceUSD: number;
  productLimit: number;
  marketplacesAllowed: number; // 1 or 5
  features: string[];
}

export const PLANS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    id: "free",
    name: "Free",
    priceINR: 0,
    priceUSD: 0,
    productLimit: 10,
    marketplacesAllowed: 1,
    features: [
      "10 products sync",
      "1 Indian marketplace (Amazon or Flipkart)",
      "Basic AI listing optimizer",
      "XLSX / CSV bulk export",
      "Standard email support",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceINR: 999,
    priceUSD: 14,
    productLimit: 200,
    marketplacesAllowed: 5,
    features: [
      "200 products sync",
      "All 5 Indian marketplaces (Amazon, Flipkart, Meesho, Myntra, JioMart)",
      "Automated HSN code & GST suggestions",
      "Vision AI image compliance checker",
      "Real-time pricing & fee calculator",
      "Editable template mappings",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceINR: 2999,
    priceUSD: 39,
    productLimit: 2000,
    marketplacesAllowed: 5,
    features: [
      "2,000 products sync",
      "All 5 Indian marketplaces",
      "1-Click bulk re-optimization",
      "Real-time inventory sync & price alerts",
      "Custom marketplace template builder",
      "Priority WhatsApp & Slack support",
      "Ready for direct API publishing",
    ],
  },
  done_for_you: {
    id: "done_for_you",
    name: "Done-For-You Onboarding",
    priceINR: 9999,
    priceUSD: 149,
    productLimit: 5000,
    marketplacesAllowed: 5,
    features: [
      "Dedicated account manager",
      "End-to-end marketplace account setup & brand registry",
      "Complete catalog review and category mapping",
      "Initial error-free bulk upload guaranteed",
      "Includes 3 months of Pro plan",
    ],
  },
};

// Initialize Stripe if secret key present
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any })
  : null;

// Initialize Razorpay if keys present
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

export interface CheckoutResult {
  provider: "razorpay" | "stripe";
  orderId?: string;
  checkoutUrl?: string;
  amount: number;
  currency: "INR" | "USD";
  keyId?: string;
}

/**
 * Unified Payment Checkout Session Creator
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  planId: SubscriptionPlan,
  currency: "INR" | "USD" = "INR"
): Promise<CheckoutResult> {
  const plan = PLANS[planId];
  if (!plan) throw new Error("Invalid plan selected");

  if (planId === "free") {
    return {
      provider: "razorpay",
      amount: 0,
      currency: "INR",
      checkoutUrl: "/dashboard?plan_activated=free",
    };
  }

  // Handle Razorpay (INR)
  if (currency === "INR") {
    const amountInPaise = plan.priceINR * 100;

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
        notes: {
          userId,
          planId,
        },
      });

      return {
        provider: "razorpay",
        orderId: order.id,
        amount: plan.priceINR,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
      };
    } else {
      // Demo / simulated checkout fallback
      return {
        provider: "razorpay",
        orderId: `order_demo_${Date.now()}`,
        amount: plan.priceINR,
        currency: "INR",
        keyId: "rzp_test_placeholder",
      };
    }
  }

  // Handle Stripe (USD)
  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ListKaro ${plan.name} Plan`,
              description: `Monthly subscription for ${plan.productLimit} products across Indian marketplaces.`,
            },
            unit_amount: plan.priceUSD * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?payment=cancelled`,
    });

    return {
      provider: "stripe",
      checkoutUrl: session.url || undefined,
      amount: plan.priceUSD,
      currency: "USD",
    };
  } else {
    // Demo Stripe session
    return {
      provider: "stripe",
      checkoutUrl: `/dashboard?payment=success&demo=stripe&plan=${planId}`,
      amount: plan.priceUSD,
      currency: "USD",
    };
  }
}

/**
 * Verify webhook and extract subscription details to unlock features
 */
export async function verifyAndProcessWebhook(
  provider: "razorpay" | "stripe",
  payload: any,
  signatureHeader: string,
  rawBody: string
): Promise<{ verified: boolean; userId?: string; planId?: SubscriptionPlan; providerSubId?: string }> {
  if (provider === "razorpay") {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "razorpay_webhook_secret_demo";
    const isValid = verifyRazorpaySignature(rawBody, signatureHeader, webhookSecret);

    if (!isValid && process.env.NODE_ENV === "production") {
      throw new Error("Razorpay webhook signature verification failed");
    }

    const event = typeof payload === "string" ? JSON.parse(payload) : payload;
    const paymentEntity = event?.payload?.payment?.entity || event?.payload?.order?.entity;
    const notes = paymentEntity?.notes || {};

    return {
      verified: true,
      userId: notes.userId,
      planId: (notes.planId as SubscriptionPlan) || "starter",
      providerSubId: paymentEntity?.id,
    };
  }

  if (provider === "stripe") {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_demo";
    let event: Stripe.Event;

    if (stripe) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
      } catch (err: any) {
        if (process.env.NODE_ENV === "production") {
          throw new Error(`Stripe signature verification error: ${err.message}`);
        }
        event = typeof payload === "string" ? JSON.parse(payload) : payload;
      }
    } else {
      event = typeof payload === "string" ? JSON.parse(payload) : payload;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        verified: true,
        userId: session.metadata?.userId,
        planId: (session.metadata?.planId as SubscriptionPlan) || "starter",
        providerSubId: session.subscription as string,
      };
    }

    return { verified: true };
  }

  return { verified: false };
}
