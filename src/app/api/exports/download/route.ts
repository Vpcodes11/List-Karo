import { NextRequest, NextResponse } from "next/server";
import { exportBuffers } from "@/lib/exporters/cache";
import { db } from "@/lib/db";
import { MARKETPLACE_CONNECTORS, EnrichedListingExportItem } from "@/lib/exporters/connector";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Export ID is required", { status: 400 });
  }

  let item = exportBuffers.get(id);

  // If buffer was evicted from memory cache, dynamically regenerate from database record
  if (!item) {
    const exportRecord = db.exports.find((e) => e.id === id);
    if (exportRecord) {
      const connector = MARKETPLACE_CONNECTORS[exportRecord.marketplace_id];
      const template = db.templates.find(
        (t) => t.marketplace_id === exportRecord.marketplace_id && t.is_active
      );
      const listings = db.listings.filter((l) => l.marketplace_id === exportRecord.marketplace_id);

      const enriched: EnrichedListingExportItem[] = listings.map((l) => ({
        listing: l,
        product: db.products.find((p) => p.id === l.product_id)!,
        variant: db.products.find((p) => p.id === l.product_id)?.variants?.[0],
      }));

      const res = await connector.generateFileExport(enriched, template);
      item = {
        buffer: res.buffer,
        fileName: res.fileName,
        format: res.format,
      };
      exportBuffers.set(id, item);
    }
  }

  if (!item) {
    return new NextResponse("Export not found or expired. Please re-generate.", { status: 404 });
  }

  const exportRecord = db.exports.find((e) => e.id === id);
  if (exportRecord) {
    exportRecord.download_count += 1;
  }

  const contentType =
    item.format === "xlsx"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "text/csv; charset=utf-8";

  return new NextResponse(new Uint8Array(item.buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${item.fileName}"`,
    },
  });
}
