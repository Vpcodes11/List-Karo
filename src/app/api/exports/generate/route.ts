import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MarketplaceId } from "@/types";
import { MARKETPLACE_CONNECTORS, EnrichedListingExportItem } from "@/lib/exporters/connector";
import { sendExportFinishedEmail } from "@/lib/email/resend";
import { MARKETPLACE_RULES } from "@/lib/marketplaces/rules";
import { exportBuffers } from "@/lib/exporters/cache";

export async function POST(req: NextRequest) {
  try {
    const { marketplaceId, productIds } = await req.json();

    if (!marketplaceId) {
      return NextResponse.json({ error: "marketplaceId is required" }, { status: 400 });
    }

    const connector = MARKETPLACE_CONNECTORS[marketplaceId as MarketplaceId];
    if (!connector) {
      return NextResponse.json({ error: "Unsupported marketplace" }, { status: 400 });
    }

    // Retrieve active template mapping from DB
    const template = db.templates.find(
      (t) => t.marketplace_id === marketplaceId && t.is_active
    );

    // Filter relevant listings
    let listings = db.listings.filter((l) => l.marketplace_id === marketplaceId);
    if (productIds?.length) {
      listings = listings.filter((l) => productIds.includes(l.product_id));
    }

    if (listings.length === 0) {
      return NextResponse.json(
        { error: `No optimized listings found for ${connector.name}. Please optimize listings first!` },
        { status: 400 }
      );
    }

    // Enrich listings with product and variant details
    const enrichedItems: EnrichedListingExportItem[] = listings.map((listing) => {
      const product = db.products.find((p) => p.id === listing.product_id)!;
      const variant = product?.variants?.[0];
      return { listing, product, variant };
    });

    // Generate bulk file buffer
    const result = await connector.generateFileExport(enrichedItems, template);

    const exportId = `exp_${Date.now()}`;
    const fileUrl = `/api/exports/download?id=${exportId}`;

    // Cache buffer for download
    exportBuffers.set(exportId, {
      buffer: result.buffer,
      fileName: result.fileName,
      format: result.format,
    });

    // Mark listings as exported
    const nowIso = new Date().toISOString();
    listings.forEach((l) => {
      l.status = "exported";
      l.exported_at = nowIso;
    });

    // Record export entry in DB
    const exportRecord = {
      id: exportId,
      user_id: "user_demo",
      marketplace_id: marketplaceId as MarketplaceId,
      file_name: result.fileName,
      file_format: result.format,
      file_url: fileUrl,
      items_count: result.rowCount,
      download_count: 0,
      created_at: nowIso,
    };
    db.exports.unshift(exportRecord);

    // Send transactional completion email
    const rules = MARKETPLACE_RULES[marketplaceId as MarketplaceId];
    const fullDownloadUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${fileUrl}`;
    await sendExportFinishedEmail(db.users[0].email, rules.name, fullDownloadUrl, result.rowCount);

    return NextResponse.json({
      success: true,
      export: exportRecord,
      downloadUrl: fileUrl,
      fileName: result.fileName,
      rowCount: result.rowCount,
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: err.message || "Bulk export generation failed" },
      { status: 500 }
    );
  }
}
