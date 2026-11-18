import { Product, ProductImage, ProductVariant } from "@/types";
import { encryptToken, decryptToken } from "@/lib/crypto";

export interface ShopifyOAuthConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: string;
}

export const SHOPIFY_CONFIG: ShopifyOAuthConfig = {
  clientId: process.env.SHOPIFY_CLIENT_ID || "shopify_client_demo_id",
  clientSecret: process.env.SHOPIFY_CLIENT_SECRET || "shopify_client_demo_secret",
  scopes: ["read_products", "read_inventory"],
  redirectUri: process.env.SHOPIFY_REDIRECT_URI || "http://localhost:3000/api/auth/shopify/callback",
};

/**
 * Generate Shopify OAuth Authorization URL
 */
export function getShopifyAuthUrl(shopDomain: string, state: string): string {
  const cleanDomain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const scopes = SHOPIFY_CONFIG.scopes.join(",");
  const redirectUri = encodeURIComponent(SHOPIFY_CONFIG.redirectUri);

  return `https://${cleanDomain}/admin/oauth/authorize?client_id=${SHOPIFY_CONFIG.clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
}

/**
 * Exchange OAuth authorization code for permanent access token
 */
export async function exchangeCodeForAccessToken(
  shopDomain: string,
  code: string
): Promise<{ accessToken: string; scopes: string }> {
  const cleanDomain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const res: Response = await fetch(`https://${cleanDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: SHOPIFY_CONFIG.clientId,
      client_secret: SHOPIFY_CONFIG.clientSecret,
      code,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Shopify OAuth token exchange failed: ${errorBody}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    scopes: data.scope,
  };
}

const PRODUCTS_GRAPHQL_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          descriptionHtml
          vendor
          productType
          tags
          images(first: 8) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                sku
                barcode
                price
                compareAtPrice
                inventoryQuantity
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(first: 5) {
            edges {
              node {
                namespace
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch all products from Shopify via Admin GraphQL API with cursor pagination & rate-limit throttling
 */
export async function fetchAllShopifyProducts(
  shopDomain: string,
  accessToken: string,
  maxProducts: number = 200
): Promise<Product[]> {
  const cleanDomain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const pageSize = 50;

  while (hasNextPage && allProducts.length < maxProducts) {
    const response: Response = await fetch(`https://${cleanDomain}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: PRODUCTS_GRAPHQL_QUERY,
        variables: {
          first: pageSize,
          after: cursor,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify GraphQL API error: ${response.statusText}`);
    }

    const json = await response.json();

    // Check for GraphQL rate limit cost throttling
    const cost = json.extensions?.cost;
    if (cost && cost.throttleStatus) {
      const { currentlyAvailable, restoreRate } = cost.throttleStatus;
      if (currentlyAvailable < 100) {
        // Sleep to let bucket replenish
        const sleepMs = Math.ceil(((100 - currentlyAvailable) / restoreRate) * 1000);
        await new Promise((resolve) => setTimeout(resolve, sleepMs));
      }
    }

    const productEdges = json.data?.products?.edges || [];
    for (const edge of productEdges) {
      const node = edge.node;

      const images: ProductImage[] = (node.images?.edges || []).map((imgEdge: any, idx: number) => ({
        id: imgEdge.node.id,
        url: imgEdge.node.url,
        altText: imgEdge.node.altText || "",
        width: imgEdge.node.width || 1200,
        height: imgEdge.node.height || 1200,
        position: idx + 1,
      }));

      const variants: ProductVariant[] = (node.variants?.edges || []).map((varEdge: any) => {
        const v = varEdge.node;
        const options: Record<string, string> = {};
        (v.selectedOptions || []).forEach((opt: any) => {
          options[opt.name] = opt.value;
        });

        return {
          id: v.id,
          product_id: node.id,
          shopify_variant_id: v.id,
          title: v.title,
          sku: v.sku || `SKU-${v.id.slice(-6)}`,
          barcode: v.barcode,
          price: parseFloat(v.price) || 0,
          compare_at_price: v.compareAtPrice ? parseFloat(v.compareAtPrice) : undefined,
          inventory_quantity: v.inventoryQuantity ?? 0,
          options,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      const metafields: Record<string, string> = {};
      (node.metafields?.edges || []).forEach((mEdge: any) => {
        metafields[`${mEdge.node.namespace}.${mEdge.node.key}`] = mEdge.node.value;
      });

      allProducts.push({
        id: `prod_${node.id.replace(/\D/g, "")}`,
        store_id: "store_current",
        shopify_product_id: node.id,
        title: node.title,
        description_html: node.descriptionHtml || "",
        vendor: node.vendor || "Brand",
        product_type: node.productType || "General",
        tags: node.tags || [],
        images,
        variants,
        metafields,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const pageInfo = json.data?.products?.pageInfo;
    hasNextPage = pageInfo?.hasNextPage || false;
    cursor = pageInfo?.endCursor || null;
  }

  return allProducts;
}

/**
 * Seed high quality authentic Indian Shopify catalog for instantaneous testing
 */
export function getMockShopifyCatalog(storeId: string = "store_demo"): Product[] {
  return [
    {
      id: "prod_101",
      store_id: storeId,
      shopify_product_id: "gid://shopify/Product/8472910291",
      title: "Royal Chanderi Silk Saree with Zari Border",
      description_html: "<p>Handcrafted Chanderi silk saree featuring intricate golden zari motifs across the pallu. Made by traditional weavers in Madhya Pradesh. Lightweight, breathable, and opulent for weddings and festivities.</p>",
      vendor: "Virasat Weaves",
      product_type: "Ethnic Wear",
      tags: ["saree", "silk", "ethnic", "wedding", "festive", "zari"],
      images: [
        {
          id: "img_101_1",
          url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
          altText: "Chanderi Silk Saree White Background",
          width: 1400,
          height: 1400,
          position: 1,
        },
        {
          id: "img_101_2",
          url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
          altText: "Chanderi Silk Saree Pallu Close-up",
          width: 1200,
          height: 1200,
          position: 2,
        },
      ],
      variants: [
        {
          id: "var_101_1",
          product_id: "prod_101",
          shopify_variant_id: "gid://shopify/ProductVariant/47281921",
          title: "Emerald Green with Gold Zari / Free Size",
          sku: "VW-SAR-01-GRN",
          barcode: "8901234567890",
          price: 2499,
          compare_at_price: 4999,
          inventory_quantity: 45,
          options: { Color: "Emerald Green", Size: "Free Size" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "prod_102",
      store_id: storeId,
      shopify_product_id: "gid://shopify/Product/8472910292",
      title: "Men's 100% Pure Cambric Cotton Regular Fit Kurta",
      description_html: "<p>Classic mandarin collar long kurta woven from pure long-staple cambric cotton. Features side pockets and engraved wooden buttons. Ideal for casual Fridays and festive pujas.</p>",
      vendor: "Kasturi Ethnica",
      product_type: "Men's Clothing",
      tags: ["kurta", "men", "cotton", "casual", "ethnic", "mandarin collar"],
      images: [
        {
          id: "img_102_1",
          url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80",
          altText: "White Pure Cotton Kurta Front View",
          width: 1200,
          height: 1200,
          position: 1,
        },
      ],
      variants: [
        {
          id: "var_102_1",
          product_id: "prod_102",
          shopify_variant_id: "gid://shopify/ProductVariant/47281922",
          title: "Ivory White / M (40)",
          sku: "KE-KURTA-WHT-M",
          price: 899,
          compare_at_price: 1599,
          inventory_quantity: 80,
          options: { Color: "Ivory White", Size: "M (40)" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "var_102_2",
          product_id: "prod_102",
          shopify_variant_id: "gid://shopify/ProductVariant/47281923",
          title: "Ivory White / L (42)",
          sku: "KE-KURTA-WHT-L",
          price: 899,
          compare_at_price: 1599,
          inventory_quantity: 65,
          options: { Color: "Ivory White", Size: "L (42)" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_103",
      store_id: storeId,
      shopify_product_id: "gid://shopify/Product/8472910293",
      title: "Handcrafted Antique Brass Peacock Oil Lamp Diya",
      description_html: "<p>Solid brass peacock diya hand-cast by master artisans of Moradabad. Coated with lacquered brass finish to prevent tarnish. Perfect for Mandir, Diwali celebrations, and spiritual gifting.</p>",
      vendor: "Diyas of India",
      product_type: "Home & Decor",
      tags: ["diya", "brass", "pooja", "home decor", "diwali", "peacock"],
      images: [
        {
          id: "img_103_1",
          url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
          altText: "Solid Brass Peacock Diya",
          width: 1200,
          height: 1200,
          position: 1,
        },
      ],
      variants: [
        {
          id: "var_103_1",
          product_id: "prod_103",
          shopify_variant_id: "gid://shopify/ProductVariant/47281924",
          title: "8 Inch Height / 650 grams",
          sku: "DOI-DIYA-PEA-8IN",
          price: 1299,
          compare_at_price: 2199,
          inventory_quantity: 35,
          options: { Size: "8 Inch" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_104",
      store_id: storeId,
      shopify_product_id: "gid://shopify/Product/8472910294",
      title: "SonicPulse Pro Wireless ANC Earbuds with 40H Playtime",
      description_html: "<p>Next-generation Bluetooth 5.3 earbuds featuring 32dB Active Noise Cancellation, Quad MEMS microphones for crystal-clear calls, IPX5 water resistance, and fast Type-C charging.</p>",
      vendor: "SonicPulse India",
      product_type: "Electronics",
      tags: ["earbuds", "bluetooth", "audio", "anc", "wireless", "gaming"],
      images: [
        {
          id: "img_104_1",
          url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
          altText: "SonicPulse Wireless Earbuds Studio Shot",
          width: 1400,
          height: 1400,
          position: 1,
        },
      ],
      variants: [
        {
          id: "var_104_1",
          product_id: "prod_104",
          shopify_variant_id: "gid://shopify/ProductVariant/47281925",
          title: "Matte Black",
          sku: "SP-EAR-ANC-BLK",
          price: 1999,
          compare_at_price: 3999,
          inventory_quantity: 120,
          options: { Color: "Matte Black" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "prod_105",
      store_id: storeId,
      shopify_product_id: "gid://shopify/Product/8472910295",
      title: "Handmade Pure Leather Kolhapuri Chappal with Cushion Insole",
      description_html: "<p>Authentic handmade leather Kolhapuri chappal crafted from vegetable-tanned leather. Enhanced with a cushioned soft footbed for modern walking comfort. Detailed braided strap design.</p>",
      vendor: "Kolhapur Craft",
      product_type: "Footwear",
      tags: ["footwear", "leather", "kolhapuri", "chappal", "ethnic footwear", "handmade"],
      images: [
        {
          id: "img_105_1",
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
          altText: "Handmade Leather Footwear",
          width: 1200,
          height: 1200,
          position: 1,
        },
      ],
      variants: [
        {
          id: "var_105_1",
          product_id: "prod_105",
          shopify_variant_id: "gid://shopify/ProductVariant/47281926",
          title: "Tan Brown / UK 8",
          sku: "KC-KOL-TAN-8",
          price: 1499,
          compare_at_price: 2499,
          inventory_quantity: 25,
          options: { Color: "Tan Brown", Size: "UK 8" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "var_105_2",
          product_id: "prod_105",
          shopify_variant_id: "gid://shopify/ProductVariant/47281927",
          title: "Tan Brown / UK 9",
          sku: "KC-KOL-TAN-9",
          price: 1499,
          compare_at_price: 2499,
          inventory_quantity: 20,
          options: { Color: "Tan Brown", Size: "UK 9" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
