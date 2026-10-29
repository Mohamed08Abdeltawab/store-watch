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
    // Support both single "file" or multiple "files" / multiple "file"
    const files = formData.getAll("files").concat(formData.getAll("file")).filter(f => f && typeof f !== "string");

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "يرجى اختيار ملف صورة صالح على الأقل" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const rawExt = path.extname(file.name) || ".png";
      const ext = allowedExts.includes(rawExt.toLowerCase()) ? rawExt.toLowerCase() : ".png";

      const cleanBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 25);
      const filename = `watch-${Date.now()}-${i}-${cleanBase || "img"}${ext}`;
      const destination = path.join(uploadsDir, filename);

      const bytes = await file.arrayBuffer();
      await fs.writeFile(destination, Buffer.from(bytes));

      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "فشل حفظ الصور: " + err.message }, { status: 500 });
  }
}
