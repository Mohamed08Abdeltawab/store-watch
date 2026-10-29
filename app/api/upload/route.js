import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ben10_admin_token");
    if (!token || token.value !== "ben10_authorized_session") {
      return NextResponse.json({ success: false, error: "غير مصرح لك برفع الصور" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "يرجى اختيار ملف صورة صالح" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const rawExt = path.extname(file.name) || ".png";
    const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const ext = allowedExts.includes(rawExt.toLowerCase()) ? rawExt.toLowerCase() : ".png";

    const cleanBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const filename = `watch-${Date.now()}-${cleanBase || "img"}${ext}`;
    const destination = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(destination, Buffer.from(bytes));

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "فشل حفظ الصورة: " + err.message }, { status: 500 });
  }
}
