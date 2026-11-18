import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/payments/service";

export async function GET() {
  const totalUsers = db.users.length;
  const totalStores = db.stores.length;
  const totalProducts = db.products.length;
  const totalOptimizedListings = db.listings.length;
  const totalExports = db.exports.length;

  // Calculate simulated revenue
  const totalRevenueINR = db.subscriptions.reduce((sum, s) => {
    const plan = PLANS[s.plan];
    return sum + (plan ? plan.priceINR : 0);
  }, 0);

  return NextResponse.json({
    success: true,
    stats: {
      totalUsers,
      totalStores,
      totalProducts,
      totalOptimizedListings,
      totalExports,
      totalRevenueINR,
      activeSubscriptions: db.subscriptions.filter((s) => s.status === "active").length,
    },
    users: db.users,
    stores: db.stores,
    subscriptions: db.subscriptions,
  });
}
