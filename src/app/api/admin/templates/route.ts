import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: db.templates,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { id, marketplace_id, category, version, field_mapping, file_format } = await req.json();

    if (id) {
      const idx = db.templates.findIndex((t) => t.id === id);
      if (idx >= 0) {
        db.templates[idx] = {
          ...db.templates[idx],
          category: category ?? db.templates[idx].category,
          version: version ?? db.templates[idx].version,
          field_mapping: field_mapping ?? db.templates[idx].field_mapping,
          file_format: file_format ?? db.templates[idx].file_format,
          updated_at: new Date().toISOString(),
        };
        return NextResponse.json({ success: true, template: db.templates[idx] });
      }
    }

    const newTemplate = {
      id: `tmpl_${Date.now()}`,
      marketplace_id,
      category: category || "General",
      version: version || "v1.0",
      field_mapping: field_mapping || {},
      file_format: file_format || "xlsx",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.templates.push(newTemplate);
    return NextResponse.json({ success: true, template: newTemplate });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
