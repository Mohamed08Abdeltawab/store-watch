import { NextResponse } from "next/server";
import { getOrderByRef, updateOrderStatus } from "../../../../lib/db";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const { ref } = await params;
    const order = getOrderByRef(ref);
    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ben10_admin_token");
    if (!token || token.value !== "ben10_authorized_session") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { ref } = await params;
    const body = await req.json();
    if (!body.status) {
      return NextResponse.json({ success: false, error: "حالة الطلب مطلوبة" }, { status: 400 });
    }

    const updated = updateOrderStatus(ref, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "فشل تحديث الطلب" }, { status: 404 });
    }

    const order = getOrderByRef(ref);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
