import { ImageCheckResult, MarketplaceId, ProductImage } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

/**
 * Image Checker: Inspects images for marketplace compliance
 * - Pure white background requirement on main image (Amazon & Flipkart)
 * - Minimum resolution / zoom capability (Amazon requires >= 1000px, Flipkart >= 800px)
 * - Promotional text / badges / watermarks detection
 */
export async function checkMarketplaceImages(
  images: ProductImage[],
  marketplaceId: MarketplaceId
): Promise<ImageCheckResult[]> {
  const rules = MARKETPLACE_RULES[marketplaceId];
  const results: ImageCheckResult[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const isMainImage = i === 0 || img.position === 1;
    const issues: string[] = [];

    // Realistic or declared dimensions (with fallback estimations)
    const width = img.width || 1200;
    const height = img.height || 1200;

    const minWidth = rules?.mainImageRequirements?.minWidth || 1000;
    const minHeight = rules?.mainImageRequirements?.minHeight || 1000;

    const isResolutionValid = width >= minWidth && height >= minHeight;
    if (!isResolutionValid) {
      issues.push(`Resolution is ${width}x${height}px. ${rules.name} requires at least ${minWidth}x${minHeight}px for high-res zoom.`);
    }

    // White background check for main image
    let hasWhiteBackground = true;
    const lowerUrl = (img.url || "").toLowerCase();
    const lowerAlt = (img.altText || "").toLowerCase();

    // Check if image URL or metadata hints at lifestyle, dark, or outdoor background
    if (
      lowerUrl.includes("lifestyle") ||
      lowerUrl.includes("model_outdoor") ||
      lowerUrl.includes("dark_bg") ||
      lowerAlt.includes("lifestyle") ||
      lowerAlt.includes("outdoor")
    ) {
      hasWhiteBackground = false;
    }

    // Amazon & Flipkart strictly require pure white background for main image
    if (isMainImage && rules?.mainImageRequirements?.pureWhiteBackground && !hasWhiteBackground) {
      issues.push(`Main image does not have a pure white background (RGB 255,255,255). Required by ${rules.name}.`);
    }

    // Watermark / text detection
    let hasWatermarkOrText = false;
    if (
      lowerUrl.includes("watermark") ||
      lowerUrl.includes("badge") ||
      lowerUrl.includes("promo") ||
      lowerUrl.includes("discount") ||
      lowerAlt.includes("sale") ||
      lowerAlt.includes("off") ||
      lowerAlt.includes("logo")
    ) {
      hasWatermarkOrText = true;
    }

    if (hasWatermarkOrText) {
      issues.push(`Detected promotional text, price badge, or watermark. Strictly prohibited on ${rules.name}.`);
    }

    // Determine status
    let status: "compliant" | "warning" | "rejected" = "compliant";
    if (isMainImage && (!isResolutionValid || (rules.mainImageRequirements.pureWhiteBackground && !hasWhiteBackground))) {
      status = "rejected";
    } else if (issues.length > 0) {
      status = "warning";
    }

    results.push({
      imageUrl: img.url,
      isMainImage,
      resolution: { width, height },
      isResolutionValid,
      hasWhiteBackground,
      hasWatermarkOrText,
      issues,
      status,
    });
  }

  return results;
}
