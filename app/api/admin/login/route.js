import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../../lib/db";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور" }, { status: 400 });
    }

    const isValid = await verifyAdmin(username, password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("ben10_admin_token", "ben10_authorized_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ben10_admin_token");
    const isAuthenticated = token?.value === "ben10_authorized_session";
    return NextResponse.json({ success: true, authenticated: isAuthenticated });
  } catch (err) {
    return NextResponse.json({ success: false, authenticated: false });
  }
}
