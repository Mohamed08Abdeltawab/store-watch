import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ben10_admin_token");
  return token && token.value === "ben10_authorized_session";
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "الساعة غير موجودة" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "فشل تحديث الساعة" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "الساعة غير موجودة أو تم حذفها بالفعل" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "تم حذف الساعة بنجاح" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
