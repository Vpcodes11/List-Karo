import crypto from "crypto";

// Comprehensive Deployment Readiness Test Suite for ListKaro
const BASE_URL = "http://localhost:3001";
const WEBHOOK_SECRET = "shopify_webhook_secret_demo";

function createShopifyHmac(body) {
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(body, "utf8").digest("base64");
}

async function runTestSuite() {
  console.log("=================================================================");
  console.log("   🚀 LISTKARO DEPLOYMENT READINESS & INTEGRATION TEST SUITE");
  console.log("   Base URL:", BASE_URL);
  console.log("=================================================================\n");

  const results = [];

  async function test(name, fn) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      const startTime = Date.now();
      await fn();
      const duration = Date.now() - startTime;
      console.log(`\x1b[32mPASSED\x1b[0m (${duration}ms)`);
      results.push({ name, status: "PASSED", duration });
    } catch (err) {
      console.log(`\x1b[31mFAILED\x1b[0m: ${err.message}`);
      results.push({ name, status: "FAILED", error: err.message });
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  // --- 1. Frontend Page Smoke Tests ---
  console.log("\n--- [Phase 1: Frontend User Pages] ---");

  await test("Landing Page (GET /)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("ListKaro"), "Missing brand name ListKaro");
    assert(html.includes("Amazon.in") && html.includes("Flipkart"), "Missing marketplace badges");
  });

  await test("Pricing Page (GET /pricing)", async () => {
    const res = await fetch(`${BASE_URL}/pricing`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Starter"), "Missing Starter plan");
    assert(html.includes("Pro"), "Missing Pro plan");
    assert(html.includes("Done-For-You"), "Missing Done-For-You tier");
  });

  await test("Dashboard Overview (GET /dashboard)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("virasat-crafts.myshopify.com"), "Missing store domain");
  });

  await test("Products Catalog Page (GET /dashboard/products)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/products`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Chanderi Silk Saree") || html.includes("Virasat Weaves"), "Missing seeded products");
  });

  await test("Listing Optimizer Detail Page (GET /dashboard/products/prod_101)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/products/prod_101`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Listing Optimizer"), "Missing optimizer header");
    assert(html.includes("HSN Code"), "Missing HSN Code attribute");
  });

  await test("Bulk Optimizer Page (GET /dashboard/optimizer)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/optimizer`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Bulk Listing Optimizer"), "Missing bulk optimizer title");
  });

  await test("Image Compliance Page (GET /dashboard/images)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/images`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Image Compliance Checker"), "Missing image compliance title");
  });

  await test("Fee & Margin Simulator (GET /dashboard/pricing)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/pricing`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Marketplace Pricing"), "Missing pricing calculator title");
  });

  await test("Inventory Sync Dashboard (GET /dashboard/inventory)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/inventory`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Inventory Sync Dashboard"), "Missing inventory sync title");
  });

  await test("Bulk Exports History Page (GET /dashboard/exports)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/exports`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Bulk Upload Export Files"), "Missing exports title");
  });

  await test("Templates Manager (GET /dashboard/templates)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/templates`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("Marketplace Template Mappings"), "Missing templates title");
  });

  await test("Settings & Webhooks Page (GET /dashboard/settings)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/settings`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("AES-256-GCM"), "Missing token encryption notice");
    assert(html.includes("customers/data_request"), "Missing GDPR webhook details");
  });

  await test("Admin Control Panel (GET /admin)", async () => {
    const res = await fetch(`${BASE_URL}/admin`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert(html.includes("role=admin"), "Missing admin role badge");
    assert(html.includes("Editable Marketplace Pricing Rules"), "Missing editable pricing rules section");
  });

  // --- 2. Backend API Functional Tests ---
  console.log("\n--- [Phase 2: Backend API Endpoints & Business Logic] ---");

  await test("Shopify Catalog Sync API (POST /api/shopify/sync)", async () => {
    const res = await fetch(`${BASE_URL}/api/shopify/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mock: true }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Sync failed");
    assert(data.count >= 5, `Expected >= 5 products, got ${data.count}`);
    assert(data.products[0].suggested_marketplace_categories, "Missing category suggestions");
  });

  await test("AI Category Taxonomy Suggester (POST /api/optimizer/categories)", async () => {
    const res = await fetch(`${BASE_URL}/api/optimizer/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "prod_101" }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Category suggestion failed");
    assert(data.suggestions.amazon, "Missing Amazon category");
    assert(data.suggestions.flipkart, "Missing Flipkart category");
    assert(data.suggestions.meesho, "Missing Meesho category");
    assert(data.suggestions.myntra, "Missing Myntra category");
    assert(data.suggestions.jiomart, "Missing JioMart category");
  });

  await test("AI Listing Optimizer Engine for Amazon (POST /api/optimizer/optimize)", async () => {
    const res = await fetch(`${BASE_URL}/api/optimizer/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod_102",
        marketplaceId: "amazon",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Optimization failed");
    assert(data.listing.optimized.title.length <= 200, "Title exceeded 200 chars");
    assert(data.listing.optimized.bulletPoints.length >= 5, "Expected 5 bullet points for Amazon");
    assert(data.listing.optimized.attributes.hsnCode, "Missing HSN code");
    assert(data.listing.optimized.attributes.gstRate !== undefined, "Missing GST rate");
  });

  await test("AI Listing Optimizer Engine for Flipkart (POST /api/optimizer/optimize)", async () => {
    const res = await fetch(`${BASE_URL}/api/optimizer/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod_101",
        marketplaceId: "flipkart",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Optimization for Flipkart failed");
    assert(data.listing.optimized.title.length <= 80, "Title exceeded 80 chars for Flipkart");
  });

  await test("Vision Image Compliance Audit (POST /api/images/check)", async () => {
    const res = await fetch(`${BASE_URL}/api/images/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod_101",
        marketplaceId: "amazon",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Image check API failed");
    assert(data.imageChecks.length > 0, "No images returned");
    assert(data.imageChecks[0].isMainImage === true, "First image must be flagged as main");
  });

  await test("Marketplace Economics & Margin Calculator (POST /api/pricing/calculate)", async () => {
    const res = await fetch(`${BASE_URL}/api/pricing/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cogs: 500,
        targetMarginPercent: 25,
        marketplaceId: "amazon",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Calculation failed");
    assert(data.calculation.sellingPrice > 500, "Selling price should exceed cost");
    assert(data.calculation.marketplaceGst > 0, "18% GST on marketplace fees must be computed");
    assert(data.calculation.netProfit > 0, "Net profit should be positive");
  });

  let generatedExportId = null;

  await test("Official Bulk Upload File Generation - Amazon XLSX (POST /api/exports/generate)", async () => {
    const res = await fetch(`${BASE_URL}/api/exports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketplaceId: "amazon",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Export failed");
    assert(data.fileName.endsWith(".xlsx"), "Expected .xlsx file format for Amazon Flat File");
    assert(data.rowCount > 0, "Expected non-zero rows");
    generatedExportId = data.export.id;
  });

  await test("Binary Spreadsheet Download Integrity (GET /api/exports/download)", async () => {
    assert(generatedExportId, "No export ID from previous test");
    const res = await fetch(`${BASE_URL}/api/exports/download?id=${generatedExportId}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const contentType = res.headers.get("content-type");
    assert(
      contentType.includes("spreadsheetml") || contentType.includes("octet-stream") || contentType.includes("csv"),
      `Unexpected content-type: ${contentType}`
    );
    const buffer = await res.arrayBuffer();
    assert(buffer.byteLength > 1000, `Export file buffer too small (${buffer.byteLength} bytes)`);
  });

  await test("Flipkart CSV Bulk Generation & Download (POST /api/exports/generate)", async () => {
    const res = await fetch(`${BASE_URL}/api/exports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketplaceId: "flipkart",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.fileName.endsWith(".csv"), "Expected .csv file format for Flipkart");

    // Test downloading the CSV
    const dlRes = await fetch(`${BASE_URL}${data.downloadUrl}`);
    assert(dlRes.status === 200, "Failed to download Flipkart CSV");
    const text = await dlRes.text();
    assert(text.includes("Seller SKU ID") || text.includes("Product Title"), "Missing Flipkart CSV headers");
  });

  await test("Payments Checkout Session API (POST /api/payments/create-session)", async () => {
    const res = await fetch(`${BASE_URL}/api/payments/create-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "starter",
        currency: "INR",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Payment session creation failed");
    assert(data.provider === "razorpay", "Expected Razorpay for INR");
    assert(data.amount === 999, "Expected ₹999 for Starter plan");
  });

  await test("Shopify Webhook with Verified HMAC (POST /api/webhooks/shopify/products-update)", async () => {
    const bodyStr = JSON.stringify({
      id: "8472910291",
      title: "Royal Chanderi Silk Saree with Zari Border - Updated Edition",
    });
    const hmac = createShopifyHmac(bodyStr);

    const res = await fetch(`${BASE_URL}/api/webhooks/shopify/products-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-hmac-sha256": hmac,
        "x-shopify-shop-domain": "virasat-crafts.myshopify.com",
      },
      body: bodyStr,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Webhook processing failed");
  });

  await test("Shopify GDPR Mandatory Webhook with Verified HMAC (POST /api/webhooks/shopify/customers-data-request)", async () => {
    const bodyStr = JSON.stringify({
      shop_domain: "virasat-crafts.myshopify.com",
      customer: { id: 12345, email: "customer@example.com" },
    });
    const hmac = createShopifyHmac(bodyStr);

    const res = await fetch(`${BASE_URL}/api/webhooks/shopify/customers-data-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-hmac-sha256": hmac,
        "x-shopify-shop-domain": "virasat-crafts.myshopify.com",
      },
      body: bodyStr,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "GDPR compliance webhook failed");
  });

  await test("Admin Statistics API (GET /api/admin/stats)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Admin stats API failed");
    assert(data.stats.totalProducts > 0, "Expected non-zero products in admin stats");
    assert(data.stats.totalRevenueINR > 0, "Expected calculated MRR");
  });

  await test("Admin Editable Pricing Rules Config (POST /api/admin/pricing-rules)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/pricing-rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "rule_amazon",
        commission_percent: 13.5,
        fixed_fee: 22,
        shipping_fee: 60,
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Admin pricing update failed");
    assert(data.rule.commission_percent === 13.5, "Commission percent was not updated");
  });

  await test("Admin Marketplace Template Editor (POST /api/admin/templates)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "tmpl_amz_1",
        version: "v2024.4-patch",
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Admin template update failed");
    assert(data.template.version === "v2024.4-patch", "Version was not updated");
  });

  // --- Summary ---
  console.log("\n=================================================================");
  const passedCount = results.filter((r) => r.status === "PASSED").length;
  const failedCount = results.filter((r) => r.status === "FAILED").length;
  console.log(`   TOTAL TESTS: ${results.length}`);
  console.log(`   \x1b[32mPASSED: ${passedCount}\x1b[0m`);
  console.log(`   \x1b[31mFAILED: ${failedCount}\x1b[0m`);
  console.log("=================================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log("✅ ALL SYSTEMS GO! ListKaro is 100% production and deployment ready.");
    process.exit(0);
  }
}

runTestSuite();
