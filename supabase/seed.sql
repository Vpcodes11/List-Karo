-- ==============================================================================
-- ListKaro - Supabase Seed Script
-- Default Indian Marketplaces, Field Mappings, and Pricing Rules
-- ==============================================================================

-- 1. Insert Marketplaces
INSERT INTO public.marketplaces (id, name, code, logo_url, active, rules) VALUES
('amazon', 'Amazon.in', 'AMZN_IN', 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', true, '{
  "titleMaxLength": 200,
  "bulletPointsCount": 5,
  "bulletPointMaxLength": 500,
  "backendSearchTermsMaxBytes": 249,
  "pureWhiteBackground": true,
  "minResolution": 1000
}'::jsonb),
('flipkart', 'Flipkart', 'FK_IN', 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-448295.svg', true, '{
  "titleMaxLength": 80,
  "bulletPointsCount": 4,
  "bulletPointMaxLength": 250,
  "pureWhiteBackground": true,
  "minResolution": 800
}'::jsonb),
('meesho', 'Meesho', 'MEESHO_IN', 'https://images.meesho.com/images/pow/meeshoLogo.png', true, '{
  "titleMaxLength": 80,
  "bulletPointsCount": 3,
  "bulletPointMaxLength": 200,
  "pureWhiteBackground": false,
  "minResolution": 500
}'::jsonb),
('myntra', 'Myntra', 'MYN_IN', 'https://constant.myntassets.com/web/assets/img/icon.5d3493ac53e34d104ddf421cfbd8082b.png', true, '{
  "titleMaxLength": 100,
  "bulletPointsCount": 4,
  "bulletPointMaxLength": 300,
  "pureWhiteBackground": true,
  "minResolution": 1080
}'::jsonb),
('jiomart', 'JioMart', 'JIOMART_IN', 'https://www.jiomart.com/assets/ds2web/jio-mart-logo.svg', true, '{
  "titleMaxLength": 120,
  "bulletPointsCount": 4,
  "bulletPointMaxLength": 250,
  "pureWhiteBackground": true,
  "minResolution": 800
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rules = EXCLUDED.rules;

-- 2. Insert Default Marketplace Templates
INSERT INTO public.marketplace_templates (id, marketplace_id, category, version, file_format, is_active, field_mapping) VALUES
('a0000000-0000-0000-0000-000000000001', 'amazon', 'Apparel & General', 'v2024.3', 'xlsx', true, '{
  "sku": "seller_sku",
  "title": "item_name",
  "brand": "brand_name",
  "price": "standard_price",
  "mrp": "list_price",
  "quantity": "quantity",
  "hsnCode": "hsn_code",
  "gstRate": "tax_code",
  "bullet1": "bullet_point1",
  "bullet2": "bullet_point2",
  "bullet3": "bullet_point3",
  "bullet4": "bullet_point4",
  "bullet5": "bullet_point5",
  "description": "product_description",
  "searchTerms": "generic_keywords",
  "mainImage": "main_image_url",
  "material": "material_composition",
  "countryOfOrigin": "country_of_origin",
  "manufacturer": "manufacturer_contact_information"
}'::jsonb),
('a0000000-0000-0000-0000-000000000002', 'flipkart', 'Clothing & Accessories', 'v4.1', 'csv', true, '{
  "sku": "Seller SKU ID",
  "title": "Product Title",
  "brand": "Brand Name",
  "price": "Flipkart Selling Price",
  "mrp": "MRP",
  "quantity": "Stock Count",
  "hsnCode": "HSN Code",
  "gstRate": "GST Slab",
  "bullet1": "Key Feature 1",
  "bullet2": "Key Feature 2",
  "bullet3": "Key Feature 3",
  "description": "Detailed Description",
  "mainImage": "Primary Image URL",
  "material": "Fabric",
  "countryOfOrigin": "Country of Origin"
}'::jsonb),
('a0000000-0000-0000-0000-000000000003', 'meesho', 'Fashion & Lifestyle', 'v2.0', 'xlsx', true, '{
  "sku": "Supplier SKU",
  "title": "Product Name",
  "price": "Meesho Price",
  "mrp": "Customer Price",
  "quantity": "Inventory",
  "hsnCode": "HSN Code",
  "gstRate": "GST Rate",
  "material": "Fabric",
  "sizeChart": "Sizes Available",
  "mainImage": "Image 1 URL",
  "description": "Product Description",
  "countryOfOrigin": "Country of Origin"
}'::jsonb),
('a0000000-0000-0000-0000-000000000004', 'myntra', 'Apparel & Accessories', 'v3.2', 'xlsx', true, '{
  "sku": "Style Code",
  "title": "Style Name",
  "brand": "Brand Name",
  "price": "Discounted Price",
  "mrp": "MRP",
  "quantity": "Units",
  "hsnCode": "HSN Code",
  "gstRate": "Tax Rate",
  "bullet1": "Style Note",
  "bullet2": "Size & Fit",
  "bullet3": "Material & Care",
  "bullet4": "Trend Occasion",
  "mainImage": "Front View URL",
  "description": "Complete Description",
  "countryOfOrigin": "Country of Origin"
}'::jsonb),
('a0000000-0000-0000-0000-000000000005', 'jiomart', 'Fashion & General', 'v1.9', 'xlsx', true, '{
  "sku": "Merchant Item Code",
  "title": "Product Title",
  "brand": "Brand",
  "price": "Selling Price",
  "mrp": "MRP",
  "quantity": "Available Quantity",
  "hsnCode": "HSN",
  "gstRate": "GST (%)",
  "bullet1": "Highlight 1",
  "bullet2": "Highlight 2",
  "mainImage": "Image URL",
  "description": "Description",
  "countryOfOrigin": "Country of Origin"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Default Pricing Rules (Indian Marketplace standard fee structure)
INSERT INTO public.pricing_rules (id, marketplace_id, category, commission_percent, fixed_fee, shipping_fee, marketplace_gst_percent, is_default) VALUES
('b0000000-0000-0000-0000-000000000001', 'amazon', 'General / Apparel', 12.00, 20.00, 55.00, 18.00, true),
('b0000000-0000-0000-0000-000000000002', 'flipkart', 'Clothing & Accessories', 11.50, 18.00, 50.00, 18.00, true),
('b0000000-0000-0000-0000-000000000003', 'meesho', 'Fashion & Lifestyle', 1.00, 0.00, 45.00, 18.00, true),
('b0000000-0000-0000-0000-000000000004', 'myntra', 'Apparel & Footwear', 16.00, 25.00, 65.00, 18.00, true),
('b0000000-0000-0000-0000-000000000005', 'jiomart', 'Fashion & General', 8.00, 15.00, 45.00, 18.00, true)
ON CONFLICT (id) DO NOTHING;
