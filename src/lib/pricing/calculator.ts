import { MarketplaceId, PricingCalculationResult, PricingRule } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

export interface PricingInputParams {
  marketplaceId: MarketplaceId;
  cogs: number; // Cost of goods sold (INR)
  targetMarginPercent: number; // e.g. 25%
  customRule?: Partial<PricingRule>;
}

/**
 * Calculate recommended selling price and fee breakdown for an Indian marketplace
 */
export function calculateMarketplacePrice(params: PricingInputParams): PricingCalculationResult {
  const { marketplaceId, cogs, targetMarginPercent, customRule } = params;
  const defaultRules = MARKETPLACE_RULES[marketplaceId];

  // Fetch rates from custom rule if provided, else from marketplace defaults
  const commissionPercent = customRule?.commission_percent ?? defaultRules.defaultCommissionPercent;
  const fixedFee = customRule?.fixed_fee ?? defaultRules.defaultFixedFee;
  const shippingFee = customRule?.shipping_fee ?? defaultRules.defaultShippingFee;
  const marketplaceGstPercent = customRule?.marketplace_gst_percent ?? 18.0; // 18% standard GST on services

  const c = commissionPercent / 100;
  const m = targetMarginPercent / 100;
  const gstFactor = 1 + marketplaceGstPercent / 100; // 1.18

  // Solve for Selling Price P:
  // P * (1 - c * gstFactor - m) = COGS + (fixedFee + shippingFee) * gstFactor
  const denominator = 1 - c * gstFactor - m;

  let sellingPrice = 0;
  if (denominator > 0.05) {
    sellingPrice = Math.ceil((cogs + (fixedFee + shippingFee) * gstFactor) / denominator);
  } else {
    // If target margin is too high for commission rate, fallback to safe markup
    sellingPrice = Math.ceil((cogs * 1.5) + (fixedFee + shippingFee) * gstFactor * 1.5);
  }

  // Calculate detailed fee breakdown
  const commissionAmount = Math.round(sellingPrice * c * 100) / 100;
  const baseFees = commissionAmount + fixedFee + shippingFee;
  const marketplaceGst = Math.round(baseFees * (marketplaceGstPercent / 100) * 100) / 100;
  const totalMarketplaceFees = Math.round((baseFees + marketplaceGst) * 100) / 100;

  const netPayoutToSeller = Math.round((sellingPrice - totalMarketplaceFees) * 100) / 100;
  const netProfit = Math.round((netPayoutToSeller - cogs) * 100) / 100;
  const actualMarginPercent = Math.round((netProfit / sellingPrice) * 1000) / 10;

  // MRP suggestion: standard Indian e-commerce practice of setting MRP ~ 1.6x to 2x selling price for discount tag
  const mrp = Math.ceil((sellingPrice * 1.8) / 10) * 10 - 1; // e.g. 999, 1499, 1999

  return {
    marketplaceId,
    cogs,
    targetMarginPercent,
    sellingPrice,
    mrp,
    commissionAmount,
    commissionPercent,
    fixedFee,
    shippingFee,
    marketplaceGst,
    totalMarketplaceFees,
    netPayoutToSeller,
    netProfit,
    actualMarginPercent,
  };
}

/**
 * Compare pricing across all 5 marketplaces for a given product COGS
 */
export function compareAllMarketplaces(cogs: number, targetMarginPercent: number = 25) {
  const marketplaces: MarketplaceId[] = ["amazon", "flipkart", "meesho", "myntra", "jiomart"];
  return marketplaces.map((mId) =>
    calculateMarketplacePrice({
      marketplaceId: mId,
      cogs,
      targetMarginPercent,
    })
  );
}
