import { MarketplaceId, MarketplaceRuleDefinition, OptimizedListingData } from "@/types";

export const MARKETPLACE_RULES: Record<MarketplaceId, MarketplaceRuleDefinition> = {
  amazon: {
    id: "amazon",
    name: "Amazon.in",
    code: "AMZN_IN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
    titleMaxLength: 200,
    titleCaseRequirement: true,
    bulletPointsCount: { min: 5, max: 5 },
    bulletPointMaxLength: 500,
    backendSearchTermsMaxBytes: 249,
    descriptionMaxLength: 2000,
    mainImageRequirements: {
      pureWhiteBackground: true,
      minWidth: 1000,
      minHeight: 1000,
      noWatermarksOrText: true,
    },
    requiredAttributes: [
      { key: "brand", label: "Brand Name", description: "Must match registered Amazon Brand Registry", example: "Kasturi Ethnica" },
      { key: "material", label: "Material Composition", description: "Primary fabric/material", example: "100% Pure Cambric Cotton" },
      { key: "hsnCode", label: "HSN Code", description: "Harmonized System of Nomenclature (6-8 digits)", example: "620520" },
      { key: "gstRate", label: "GST Rate (%)", description: "Applicable Indian GST slab (5%, 12%, 18%)", example: "5" },
      { key: "countryOfOrigin", label: "Country of Origin", description: "Mandatory by Legal Metrology Act", example: "India" },
      { key: "manufacturerDetails", label: "Manufacturer Details", description: "Name and registered address", example: "Apex Apparels, Surat, Gujarat" },
    ],
    defaultCommissionPercent: 12.0,
    defaultFixedFee: 20.0,
    defaultShippingFee: 55.0,
  },
  flipkart: {
    id: "flipkart",
    name: "Flipkart",
    code: "FK_IN",
    logo: "https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-448295.svg",
    titleMaxLength: 80,
    titleCaseRequirement: true,
    bulletPointsCount: { min: 3, max: 5 },
    bulletPointMaxLength: 250,
    backendSearchTermsMaxBytes: 200,
    descriptionMaxLength: 1500,
    mainImageRequirements: {
      pureWhiteBackground: true,
      minWidth: 800,
      minHeight: 800,
      noWatermarksOrText: true,
    },
    requiredAttributes: [
      { key: "brand", label: "Brand", description: "Must match Flipkart approval", example: "Kasturi Ethnica" },
      { key: "material", label: "Fabric / Material", description: "Base material", example: "Pure Cotton" },
      { key: "hsnCode", label: "HSN Code", description: "Valid Indian 6-8 digit HSN", example: "620520" },
      { key: "gstRate", label: "GST Slab (%)", description: "5, 12, or 18 percent", example: "5" },
      { key: "countryOfOrigin", label: "Country of Origin", description: "Required by Department of Consumer Affairs", example: "India" },
      { key: "fitType", label: "Fit / Style", description: "Regular, Slim, Relaxed", example: "Regular Fit" },
    ],
    defaultCommissionPercent: 11.5,
    defaultFixedFee: 18.0,
    defaultShippingFee: 50.0,
  },
  meesho: {
    id: "meesho",
    name: "Meesho",
    code: "MEESHO_IN",
    logo: "https://images.meesho.com/images/pow/meeshoLogo.png",
    titleMaxLength: 80,
    titleCaseRequirement: false,
    bulletPointsCount: { min: 2, max: 4 },
    bulletPointMaxLength: 200,
    backendSearchTermsMaxBytes: 150,
    descriptionMaxLength: 1000,
    mainImageRequirements: {
      pureWhiteBackground: false, // Meesho allows lifestyle as main, but white is preferred
      minWidth: 500,
      minHeight: 500,
      noWatermarksOrText: true,
    },
    requiredAttributes: [
      { key: "material", label: "Fabric", description: "Key fabric name", example: "Cotton Blend" },
      { key: "sizeChart", label: "Sizes Available & Chest In Inches", description: "E.g. S-38, M-40, L-42, XL-44", example: "M-40, L-42, XL-44" },
      { key: "hsnCode", label: "HSN Code", description: "Mandatory for GST invoice", example: "6205" },
      { key: "gstRate", label: "GST Rate", description: "Applicable tax rate", example: "5" },
      { key: "countryOfOrigin", label: "Country of Origin", description: "Origin country", example: "India" },
    ],
    defaultCommissionPercent: 1.0, // Meesho's 0-1% commission proposition
    defaultFixedFee: 0.0,
    defaultShippingFee: 45.0,
  },
  myntra: {
    id: "myntra",
    name: "Myntra",
    code: "MYN_IN",
    logo: "https://constant.myntassets.com/web/assets/img/icon.5d3493ac53e34d104ddf421cfbd8082b.png",
    titleMaxLength: 100,
    titleCaseRequirement: true,
    bulletPointsCount: { min: 4, max: 6 },
    bulletPointMaxLength: 300,
    backendSearchTermsMaxBytes: 250,
    descriptionMaxLength: 1800,
    mainImageRequirements: {
      pureWhiteBackground: true,
      minWidth: 1080,
      minHeight: 1440, // 3:4 portrait ratio for fashion
      noWatermarksOrText: true,
    },
    requiredAttributes: [
      { key: "brand", label: "Brand", description: "Verified partner brand", example: "Kasturi Ethnica" },
      { key: "material", label: "Material & Care", description: "Detailed fabric care instructions", example: "100% Cotton, Machine wash warm" },
      { key: "occasion", label: "Trend / Occasion", description: "Ethnic, Casual, Festive, Work", example: "Festive & Festive" },
      { key: "hsnCode", label: "HSN Code", description: "Customs tariff HSN code", example: "620520" },
      { key: "gstRate", label: "GST %", description: "Tax rate slab", example: "5" },
      { key: "countryOfOrigin", label: "Country of Origin", description: "Country where made", example: "India" },
    ],
    defaultCommissionPercent: 16.0,
    defaultFixedFee: 25.0,
    defaultShippingFee: 65.0,
  },
  jiomart: {
    id: "jiomart",
    name: "JioMart",
    code: "JIOMART_IN",
    logo: "https://www.jiomart.com/assets/ds2web/jio-mart-logo.svg",
    titleMaxLength: 120,
    titleCaseRequirement: true,
    bulletPointsCount: { min: 3, max: 5 },
    bulletPointMaxLength: 250,
    backendSearchTermsMaxBytes: 200,
    descriptionMaxLength: 1500,
    mainImageRequirements: {
      pureWhiteBackground: true,
      minWidth: 800,
      minHeight: 800,
      noWatermarksOrText: true,
    },
    requiredAttributes: [
      { key: "brand", label: "Brand Name", description: "Manufacturer or brand", example: "Kasturi Ethnica" },
      { key: "hsnCode", label: "HSN Code", description: "Standard Indian HSN code", example: "620520" },
      { key: "gstRate", label: "GST Rate (%)", description: "Tax bracket", example: "5" },
      { key: "countryOfOrigin", label: "Country of Origin", description: "Required declaration", example: "India" },
      { key: "packerDetails", label: "Packer & Customer Care", description: "Address and support email/phone", example: "support@brand.in, 1800-000-000" },
    ],
    defaultCommissionPercent: 8.0,
    defaultFixedFee: 15.0,
    defaultShippingFee: 45.0,
  },
};

/**
 * Validate an optimized listing against a specific marketplace's rules
 */
export function validateListingForMarketplace(
  data: OptimizedListingData,
  marketplaceId: MarketplaceId
): {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
} {
  const rules = MARKETPLACE_RULES[marketplaceId];
  if (!rules) {
    return {
      isValid: false,
      missingFields: ["Unknown marketplace"],
      warnings: [],
      fieldErrors: {},
    };
  }

  const missingFields: string[] = [];
  const warnings: string[] = [];
  const fieldErrors: Record<string, string> = {};

  // 1. Title validation
  if (!data.title || data.title.trim() === "") {
    missingFields.push("Title");
    fieldErrors["title"] = "Title is required";
  } else {
    if (data.title.length > rules.titleMaxLength) {
      warnings.push(`Title exceeds ${rules.name} maximum length of ${rules.titleMaxLength} chars (currently ${data.title.length})`);
      fieldErrors["title"] = `Length ${data.title.length}/${rules.titleMaxLength}`;
    }

    // Check for promotional spam words forbidden by Amazon & others
    const spamWords = ["free shipping", "sale", "discount", "offer", "best seller", "#1", "cheapest"];
    for (const word of spamWords) {
      if (data.title.toLowerCase().includes(word)) {
        warnings.push(`Title contains promotional phrase forbidden by ${rules.name}: "${word}"`);
        fieldErrors["title"] = `Forbidden term: "${word}"`;
      }
    }
  }

  // 2. Bullet points validation
  const bullets = data.bulletPoints || [];
  if (bullets.length < rules.bulletPointsCount.min) {
    warnings.push(`${rules.name} expects at least ${rules.bulletPointsCount.min} bullet points (found ${bullets.length})`);
  }

  // 3. Description
  if (!data.description || data.description.trim() === "") {
    missingFields.push("Description");
    fieldErrors["description"] = "Description is required";
  } else if (data.description.length > rules.descriptionMaxLength) {
    warnings.push(`Description exceeds limit of ${rules.descriptionMaxLength} characters`);
  }

  // 4. Required Attributes
  for (const req of rules.requiredAttributes) {
    const val = data.attributes ? data.attributes[req.key] : undefined;
    if (val === undefined || val === null || val === "") {
      missingFields.push(req.label);
      fieldErrors[`attributes.${req.key}`] = `${req.label} is mandatory for ${rules.name}`;
    }
  }

  // 5. HSN Code format validation (Indian 4, 6 or 8 digits)
  if (data.attributes?.hsnCode) {
    const hsn = String(data.attributes.hsnCode).trim();
    if (!/^\d{4,8}$/.test(hsn)) {
      warnings.push("HSN Code should be 4, 6, or 8 digits");
      fieldErrors["attributes.hsnCode"] = "Invalid HSN Code format";
    }
  }

  // 6. GST Rate validation (must be 0, 5, 12, 18, 28)
  if (data.attributes?.gstRate !== undefined) {
    const gst = Number(data.attributes.gstRate);
    if (![0, 5, 12, 18, 28].includes(gst)) {
      warnings.push("GST Rate must be a valid Indian slab (0%, 5%, 12%, 18%, or 28%)");
    }
  }

  const isValid = missingFields.length === 0 && Object.keys(fieldErrors).length === 0;

  return {
    isValid,
    missingFields,
    warnings,
    fieldErrors,
  };
}
