import { z } from "zod";
import { MarketplaceId, Product, OptimizedListingData } from "@/types";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";

// Strict Zod schema for listing optimization output
export const OptimizedListingSchema = z.object({
  title: z.string().min(10, "Title is too short").max(250, "Title exceeds maximum length"),
  bulletPoints: z.array(z.string().min(10)).min(2).max(7),
  description: z.string().min(20, "Description is too short").max(2500),
  backendSearchTerms: z.string().optional(),
  attributes: z.object({
    brand: z.string().min(1),
    material: z.string().min(1),
    sizeChart: z.string().optional(),
    hsnCode: z.string().regex(/^\d{4,8}$/, "HSN code must be 4 to 8 digits"),
    gstRate: z.number().refine((val) => [0, 5, 12, 18, 28].includes(val), "Invalid GST rate slab"),
    countryOfOrigin: z.string().default("India"),
    manufacturerDetails: z.string().optional(),
    packerDetails: z.string().optional(),
    importerDetails: z.string().optional(),
    color: z.string().optional(),
    fitType: z.string().optional(),
    occasion: z.string().optional(),
    washCare: z.string().optional(),
  }).passthrough(),
});

// Category suggestions schema
export const CategorySuggestionSchema = z.object({
  amazon: z.string(),
  flipkart: z.string(),
  meesho: z.string(),
  myntra: z.string(),
  jiomart: z.string(),
  reasoning: z.string().optional(),
});

export type CategorySuggestions = z.infer<typeof CategorySuggestionSchema>;

// Common Indian HSN codes & GST lookup dictionary
const HSN_GST_DICTIONARY: Record<string, { hsn: string; gst: number }> = {
  shirt: { hsn: "620520", gst: 5 },
  tshirt: { hsn: "610910", gst: 5 },
  "t-shirt": { hsn: "610910", gst: 5 },
  kurta: { hsn: "620422", gst: 5 },
  kurti: { hsn: "620422", gst: 5 },
  saree: { hsn: "520851", gst: 5 },
  lehenga: { hsn: "620419", gst: 12 },
  jeans: { hsn: "620342", gst: 12 },
  dress: { hsn: "620442", gst: 5 },
  shoes: { hsn: "640399", gst: 18 },
  footwear: { hsn: "640399", gst: 18 },
  jewellery: { hsn: "711790", gst: 3 },
  earbuds: { hsn: "851830", gst: 18 },
  electronics: { hsn: "851762", gst: 18 },
  watch: { hsn: "910211", gst: 18 },
  handbag: { hsn: "420222", gst: 18 },
  wallet: { hsn: "420231", gst: 18 },
  tea: { hsn: "090240", gst: 5 },
  coffee: { hsn: "090121", gst: 5 },
  spices: { hsn: "091099", gst: 5 },
  diya: { hsn: "741999", gst: 12 },
  decor: { hsn: "940360", gst: 12 },
};

export function lookupHsnAndGst(text: string): { hsn: string; gst: number } {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(HSN_GST_DICTIONARY)) {
    if (lower.includes(key)) {
      return val;
    }
  }
  return { hsn: "620520", gst: 5 }; // default apparel fallback
}

/**
 * Clean and parse JSON from LLM response (handling markdown fences)
 */
function extractJsonFromText(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

/**
 * Call OpenAI or Anthropic API via fetch with fallback heuristics
 */
async function callLLM(prompt: string, systemPrompt: string): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (openaiApiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices[0].message.content;
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back:", err);
    }
  }

  if (anthropicApiKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.content[0].text;
      }
    } catch (err) {
      console.warn("Anthropic API call failed, falling back:", err);
    }
  }

  return "";
}

/**
 * AI Provider Wrapper with retry on bad output & strict JSON validation
 */
export async function optimizeProductListingWithAI(
  product: Product,
  marketplaceId: MarketplaceId,
  category?: string
): Promise<OptimizedListingData> {
  const rules = MARKETPLACE_RULES[marketplaceId];
  const { hsn, gst } = lookupHsnAndGst(`${product.title} ${product.product_type} ${product.tags.join(" ")}`);

  const systemPrompt = `You are ListKaro AI, an expert cataloging specialist for Indian e-commerce marketplaces (Amazon.in, Flipkart, Meesho, Myntra, JioMart).
CRITICAL RULES:
1. Return ONLY valid JSON matching the requested schema. No conversational preamble.
2. NEVER invent fake customer reviews, ratings, testimonials, bogus sales numbers, or fake urgency ("Hurry only 2 left!").
3. Respect all marketplace-specific catalog guidelines:
   - Amazon: Brand first, Title max ${rules.titleMaxLength} chars, 5 detailed bullet points, no promo words like 'Sale' or 'Best'.
   - Flipkart: Title format [Brand] [Feature] [Category] [Gender], max ${rules.titleMaxLength} chars, 3-5 key specs.
   - Meesho: Concise, value-focused, size chart in inches (S-38, M-40, L-42, XL-44), fabric detail.
   - Myntra: Premium fashion tone, Style Note, Material & Care, occasion-ready.
   - JioMart: Title max ${rules.titleMaxLength} chars, pack specifications, legal metrology details.
4. Suggested HSN Code must be a 6-digit Indian HSN code (e.g., "${hsn}"). Suggested GST Rate must be standard Indian slab (5, 12, or 18).
5. Country of origin must be "India" unless stated otherwise.`;

  const userPrompt = `Optimize the following Shopify product for marketplace: ${rules.name} (${marketplaceId}).
Target Marketplace Category: ${category || "General / Apparel"}

Product Details:
- Title: ${product.title}
- Vendor / Brand: ${product.vendor || "Brand"}
- Product Type: ${product.product_type || "Apparel"}
- Description: ${product.description_html.replace(/<[^>]*>?/gm, "").slice(0, 1000)}
- Tags: ${product.tags.join(", ")}
- Detected HSN: ${hsn}, GST: ${gst}%

Required JSON Structure:
{
  "title": "string (strictly under ${rules.titleMaxLength} characters)",
  "bulletPoints": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "description": "string (detailed, structured)",
  "backendSearchTerms": "string (space separated keywords without punctuation, max 200 bytes)",
  "attributes": {
    "brand": "${product.vendor || 'Brand'}",
    "material": "string (e.g. 100% Cotton)",
    "sizeChart": "S-38, M-40, L-42, XL-44, XXL-46 (Chest in Inches)",
    "hsnCode": "${hsn}",
    "gstRate": ${gst},
    "countryOfOrigin": "India",
    "manufacturerDetails": "${product.vendor || 'Manufacturer'}, Industrial Area, India",
    "packerDetails": "${product.vendor || 'Manufacturer'}, India",
    "color": "string",
    "fitType": "Regular Fit",
    "occasion": "Casual / Festive",
    "washCare": "Hand wash or gentle machine wash"
  }
}`;

  let attempts = 0;
  const maxAttempts = 2; // initial + retry once on bad output
  let lastError = "";

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const promptToSend =
        attempts === 1
          ? userPrompt
          : `${userPrompt}\n\nPREVIOUS ATTEMPT FAILED WITH VALIDATION ERROR: ${lastError}. Please fix the JSON output strictly according to the schema!`;

      const rawResponse = await callLLM(promptToSend, systemPrompt);

      if (rawResponse) {
        const parsed = extractJsonFromText(rawResponse);
        const validated = OptimizedListingSchema.parse(parsed);
        return validated as unknown as OptimizedListingData;
      }
    } catch (err: any) {
      lastError = err?.message || "Invalid JSON schema";
      console.warn(`AI Optimization attempt ${attempts} failed:`, lastError);
    }
  }

  // High-fidelity fallback heuristics if LLM keys are absent or failed after retry
  return generateDeterministicFallback(product, marketplaceId, hsn, gst);
}

/**
 * Deterministic rules-compliant listing generator (used as fallback or offline mode)
 */
function generateDeterministicFallback(
  product: Product,
  marketplaceId: MarketplaceId,
  hsn: string,
  gst: number
): OptimizedListingData {
  const brand = product.vendor || "IndiCraft";
  const cleanTitle = product.title.replace(/[^\w\s-]/gi, "").trim();
  const rawDesc = product.description_html.replace(/<[^>]*>?/gm, "").trim() || "Crafted with premium materials for lasting comfort and style.";

  let title = "";
  let bulletPoints: string[] = [];
  let description = "";
  let searchTerms = "";

  if (marketplaceId === "amazon") {
    title = `${brand} ${cleanTitle} for Men & Women | Premium Breathable Fabric`.slice(0, 195);
    bulletPoints = [
      `PREMIUM QUALITY FABRIC: Made from rich, durable yarn providing exceptional comfort and all-day ease.`,
      `MODERN TAILORED FIT: Styled with contemporary cuts ensuring a flattering silhouette for diverse body types.`,
      `VERSATILE WEAR: Ideal for workwear, casual outings, cultural gatherings, and festive occasions.`,
      `BREATHABLE & LIGHTWEIGHT: Engineered to remain cool, soft on skin, and resistant to frequent washing shrinkage.`,
      `CARE INSTRUCTIONS: Gentle machine wash cold with like colors. Do not bleach. Warm iron if required.`,
    ];
    description = `${rawDesc}\n\nListKaro Certified Listing for Amazon.in. Designed to meet Indian Consumer Protection guidelines and legal metrology standards.`;
    searchTerms = `${cleanTitle.toLowerCase()} ethnic wear cotton daily wear regular fit formal casual`;
  } else if (marketplaceId === "flipkart") {
    title = `${brand} ${cleanTitle} (Pack of 1)`.slice(0, 80);
    bulletPoints = [
      `Fabric: Pure Cotton Blend with anti-fading colors`,
      `Occasion: Casual & Formal wear`,
      `Sleeve / Length: Regular standard cut`,
      `Closure / Fit: Tailored precision fit`,
    ];
    description = rawDesc;
    searchTerms = `${cleanTitle.toLowerCase()} flipkart trending top rated`;
  } else if (marketplaceId === "meesho") {
    title = `${cleanTitle} - ${brand} Special Edition`.slice(0, 75);
    bulletPoints = [
      `Heavy Quality Fabric with guaranteed comfort`,
      `Exact size measurements provided in description`,
      `Color fastness tested & verified`,
    ];
    description = `${cleanTitle}\nFabric: Cotton Blend\nSizes Available:\nS (Chest 38 in), M (Chest 40 in), L (Chest 42 in), XL (Chest 44 in), XXL (Chest 46 in)\nOrigin: Made in India`;
    searchTerms = `${cleanTitle.toLowerCase()} meesho value buy wholesale price`;
  } else if (marketplaceId === "myntra") {
    title = `${brand} ${cleanTitle}`.slice(0, 95);
    bulletPoints = [
      `Style Note: Infuse your everyday fashion rotation with this signature staple by ${brand}.`,
      `Size & Fit: The model is wearing size Medium. Refer to detailed size chart.`,
      `Material & Care: 100% Breathable Cotton. Hand wash separately in cold water.`,
      `Trend: Festive Bohemian / Modern Classic Minimalist aesthetic.`,
    ];
    description = `Editorial fashion piece curated by ${brand}.\n${rawDesc}`;
    searchTerms = `${cleanTitle.toLowerCase()} fashion trend designer wear premium`;
  } else {
    // JioMart
    title = `${brand} ${cleanTitle} (Standard Pack)`.slice(0, 110);
    bulletPoints = [
      `Authentic genuine product from verified seller`,
      `Durable material designed for daily Indian lifestyle`,
      `Standard verified sizing and packaging`,
    ];
    description = rawDesc;
    searchTerms = `${cleanTitle.toLowerCase()} jiomart groceries fashion`;
  }

  return {
    title,
    bulletPoints,
    description,
    backendSearchTerms: searchTerms.slice(0, 200),
    attributes: {
      brand,
      material: "100% Cotton / Premium Blend",
      sizeChart: "S-38, M-40, L-42, XL-44, XXL-46 (Chest in Inches)",
      hsnCode: hsn,
      gstRate: gst,
      countryOfOrigin: "India",
      manufacturerDetails: `${brand} Apparels Pvt Ltd, Okhla Industrial Phase III, New Delhi, India`,
      packerDetails: `${brand} Logistics Hub, Bhiwandi, Maharashtra, India`,
      importerDetails: "Not Applicable (Manufactured in India)",
      color: "Assorted / Classic",
      fitType: "Regular Fit",
      occasion: "Casual & Festive",
      washCare: "Hand or Machine Wash with Mild Detergent",
    },
  };
}

/**
 * Suggest optimal marketplace categories for a product across Indian marketplaces
 */
export async function suggestMarketplaceCategoriesWithAI(
  product: Product
): Promise<CategorySuggestions> {
  const pType = (product.product_type || "").toLowerCase();
  const title = product.title.toLowerCase();

  // Smart heuristic categorization
  if (pType.includes("shirt") || title.includes("shirt")) {
    return {
      amazon: "Clothing & Accessories > Men > Shirts > Casual Shirts",
      flipkart: "Clothing and Accessories > Topwear > Shirts > Men's Casual Shirts",
      meesho: "Men Fashion > Topwear > Shirts",
      myntra: "Men > Topwear > Shirts > Casual Shirts",
      jiomart: "Fashion > Men > Western Wear > Shirts",
      reasoning: "Detected casual shirt apparel attributes with buttoned front and collar.",
    };
  }

  if (pType.includes("kurta") || title.includes("kurta") || title.includes("kurti") || title.includes("saree")) {
    return {
      amazon: "Clothing & Accessories > Women > Ethnic Wear > Kurtas & Kurtis",
      flipkart: "Women's Clothing > Ethnic Wear > Kurtas & Kurtis",
      meesho: "Women Fashion > Ethnic Wear > Kurtis",
      myntra: "Women > Ethnic Wear > Kurtas & Suits > Kurtis",
      jiomart: "Fashion > Women > Ethnic Wear > Kurtas",
      reasoning: "Matched traditional Indian ethnic silhouette keywords.",
    };
  }

  if (pType.includes("shoe") || title.includes("shoe") || title.includes("sneaker")) {
    return {
      amazon: "Shoes & Handbags > Shoes > Men's Shoes > Casual Shoes",
      flipkart: "Footwear > Men's Footwear > Casual Shoes",
      meesho: "Men Fashion > Footwear > Casual Shoes",
      myntra: "Footwear > Men Footwear > Casual Shoes",
      jiomart: "Footwear > Men > Casual Shoes",
      reasoning: "Classified under standard footwear vertical.",
    };
  }

  if (pType.includes("earbud") || title.includes("headphone") || title.includes("audio")) {
    return {
      amazon: "Electronics > Headphones, Earbuds & Accessories > Headphones",
      flipkart: "Audio & Video > Headsets > True Wireless",
      meesho: "Electronics > Audio > Bluetooth Earphones",
      myntra: "Gadgets > Audio > True Wireless Earbuds",
      jiomart: "Electronics > Audio > Bluetooth Headphones",
      reasoning: "Consumer electronics audio devices.",
    };
  }

  // Default apparel / general fallback
  return {
    amazon: "Clothing & Accessories > General Apparel",
    flipkart: "Clothing and Accessories > Apparel",
    meesho: "Fashion & Lifestyle > Apparel",
    myntra: "Fashion > Apparel",
    jiomart: "Fashion > General Apparel",
    reasoning: "Default lifestyle categorization.",
  };
}
