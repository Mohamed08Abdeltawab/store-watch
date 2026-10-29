"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WATCH_TYPES = [
  "عادية (كلاسيكية)",
  "رقمية (Digital)",
  "ذكية (Smartwatch)",
  "كرونوغراف (Chronograph)"
];

const TARGET_AUDIENCES = [
  { value: "", label: "— غير محدد — (اختياري)" },
  { value: "رجالي", label: "رجالي" },
  { value: "حريمي", label: "حريمي" },
  { value: "للجنسين", label: "للجنسين" },
  { value: "أطفال", label: "أطفال" }
];

const STANDARD_COLORS = [
  { value: "", label: "— غير محدد — (اختياري)" },
  { value: "فضي", label: "فضي" },
  { value: "أسود", label: "أسود" },
  { value: "ذهبي", label: "ذهبي" },
  { value: "روز جولد", label: "روز جولد" },
  { value: "رمادي", label: "رمادي" },
  { value: "أزرق", label: "أزرق" },
  { value: "أخضر", label: "أخضر" },
  { value: "بني", label: "بني" },
  { value: "أبيض", label: "أبيض" },
  { value: "custom", label: "+ لون مخصص..." }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Product Form State
  const [form, setForm] = useState({
    name: "",
    sub: "",
    cat: "عادية (كلاسيكية)",
    target_audience: "",
    color: "",
    custom_color: "",
    price: "",
    old_price: "",
    tag: "best",
    badge_text: "الأكثر طلباً",
    image: "/img/ben10-classic-concept-01.png",
    description: "",
    in_stock: true
  });

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);

      if (oRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const pData = await pRes.json();
      const oData = await oRes.json();

      if (pData.success) setProducts(pData.products);
      if (oData.success) setOrders(oData.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // Handle Image Upload from device into source code (public/uploads)
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image: data.url }));
        notify("تم رفع الصورة وحفظها في مجلد الملفات بنجاح");
      } else {
        setUploadError(data.error || "فشل رفع الصورة");
      }
    } catch (err) {
      setUploadError("حدث خطأ في الاتصال أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDeleteProduct(id, name) {
    if (!confirm(`هل أنت متأكد من حذف ساعة "${name}" نهائياً من قاعدة البيانات؟`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        notify(`تم حذف "${name}" بنجاح`);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  }

  async function handleSaveProduct(e) {
    e.preventDefault();

    const selectedColor = form.color === "custom"
      ? (form.custom_color.trim() || "")
      : form.color;

    const payload = {
      ...form,
      color: selectedColor,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        notify(editingProduct ? "تم تحديث بيانات الساعة بنجاح" : "تمت إضافة الساعة الجديدة إلى الكتالوج");
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("فشل حفظ الساعة");
    }
  }

  async function handleUpdateOrderStatus(orderRef, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        notify(`تم تحديث حالة الطلب #${orderRef} إلى: ${newStatus}`);
        loadData();
      }
    } catch (err) {
      alert("فشل تحديث حالة الطلب");
    }
  }

  function resetForm() {
    setForm({
      name: "",
      sub: "",
      cat: "عادية (كلاسيكية)",
      target_audience: "",
      color: "",
      custom_color: "",
      price: "",
      old_price: "",
      tag: "best",
      badge_text: "الأكثر طلباً",
      image: "/img/ben10-classic-concept-01.png",
      description: "",
      in_stock: true
    });
    setUploadError("");
  }

  function startEdit(p) {
    setEditingProduct(p);

    const isStdColor = STANDARD_COLORS.some(c => c.value !== "custom" && c.value === p.color);
    const colorVal = !p.color ? "" : (isStdColor ? p.color : "custom");
    const customColorVal = isStdColor ? "" : (p.color || "");

    setForm({
      name: p.name,
      sub: p.sub || "",
      cat: WATCH_TYPES.includes(p.cat) ? p.cat : "عادية (كلاسيكية)",
      target_audience: p.target_audience || "",
      color: colorVal,
      custom_color: customColorVal,
      price: p.price,
      old_price: p.old_price || "",
      tag: p.tag || "best",
      badge_text: p.badge_text || "",
      image: p.image,
      description: p.description || p.overview || "",
      in_stock: p.in_stock === 1 || p.in_stock === true
    });
    setUploadError("");
    setShowAddModal(true);
  }

  const totalSales = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "قيد المراجعة").length;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f0d", color: "#fff", fontFamily: "'Almarai', sans-serif" }} dir="rtl">
      {/* Top Navbar */}
      <header style={{
        background: "#121815",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "rgba(163, 230, 53, 0.15)",
            border: "1px solid #A3E635",
            color: "#A3E635",
            display: "grid",
            placeItems: "center",
            fontWeight: "800"
          }}>
            B10
          </div>
          <div>
            <h1 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>
              لوحة تحكم <span style={{ color: "#A3E635" }}>Ben10 Watches</span>
            </h1>
            <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>مدير المتجر المعتمد (Admin Portal)</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <a
            href="/"
            target="_blank"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            ↗ زيارة واجهة المتجر
          </a>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#fca5a5",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "1340px", margin: "0 auto", padding: "2rem" }}>
        {/* Flash Notification */}
        {notification && (
          <div style={{
            background: "rgba(163, 230, 53, 0.15)",
            border: "1px solid #A3E635",
            color: "#A3E635",
            padding: "0.85rem 1.4rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontWeight: "700",
            fontSize: "0.9rem"
          }}>
            ✓ {notification}
          </div>
        )}

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.2rem",
          marginBottom: "2rem"
        }}>
          <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>إجمالي الساعات المسجلة</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#fff", marginTop: "0.3rem" }}>
              {products.length} <small style={{ fontSize: "0.9rem", color: "#A3E635" }}>ساعة</small>
            </div>
          </div>

          <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>إجمالي الطلبات المستلمة</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#fff", marginTop: "0.3rem" }}>
              {orders.length} <small style={{ fontSize: "0.9rem", color: "#38bdf8" }}>طلب</small>
            </div>
          </div>

          <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>طلبات بانتظار التأكيد</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f59e0b", marginTop: "0.3rem" }}>
              {pendingOrders} <small style={{ fontSize: "0.9rem" }}>طلب معلق</small>
            </div>
          </div>

          <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "1.2rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>حجم المبيعات الإجمالي</span>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#A3E635", marginTop: "0.3rem" }}>
              {totalSales.toLocaleString("ar-EG")} <small style={{ fontSize: "0.9rem", color: "#fff" }}>ج.م</small>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "1rem" }}>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              fontWeight: "800",
              fontSize: "0.88rem",
              cursor: "pointer",
              border: 0,
              background: activeTab === "products" ? "#A3E635" : "rgba(255, 255, 255, 0.08)",
              color: activeTab === "products" ? "#0b0f0d" : "#fff"
            }}
          >
            ⌚ إدارة الساعات ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              fontWeight: "800",
              fontSize: "0.88rem",
              cursor: "pointer",
              border: 0,
              background: activeTab === "orders" ? "#A3E635" : "rgba(255, 255, 255, 0.08)",
              color: activeTab === "orders" ? "#0b0f0d" : "#fff"
            }}
          >
            📋 الطلبات والواتساب ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>كتالوج الساعات الحالي في قاعدة البيانات</h2>
              <button
                onClick={() => { resetForm(); setEditingProduct(null); setShowAddModal(true); }}
                style={{
                  background: "#A3E635",
                  color: "#0d1210",
                  padding: "0.6rem 1.3rem",
                  borderRadius: "999px",
                  fontWeight: "800",
                  fontSize: "0.86rem",
                  border: 0,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(163, 230, 53, 0.3)"
                }}
              >
                + إضافة ساعة جديدة
              </button>
            </div>

            <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                <thead>
                  <tr style={{ background: "#0e1411", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", fontSize: "0.78rem" }}>
                    <th style={{ padding: "1rem" }}>الصورة</th>
                    <th style={{ padding: "1rem" }}>اسم الساعة والموديل</th>
                    <th style={{ padding: "1rem" }}>الفئة (النوع)</th>
                    <th style={{ padding: "1rem" }}>الفئة المستهدفة</th>
                    <th style={{ padding: "1rem" }}>اللون</th>
                    <th style={{ padding: "1rem" }}>السعر الحالي</th>
                    <th style={{ padding: "1rem" }}>السعر السابق</th>
                    <th style={{ padding: "1rem" }}>المخزون</th>
                    <th style={{ padding: "1rem", textAlign: "center" }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "0.85rem" }}>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <img src={p.image} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "2px" }} />
                      </td>
                      <td style={{ padding: "0.8rem 1rem", fontWeight: "700" }}>
                        {p.name}
                        <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "400" }}>{p.sub}</div>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <span style={{ background: "rgba(163, 230, 53, 0.15)", color: "#A3E635", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {p.cat}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>
                          {p.target_audience || "غير محدد"}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <span style={{ background: "rgba(255, 255, 255, 0.08)", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem" }}>
                          {p.color || "غير محدد"}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem 1rem", fontWeight: "800", color: "#A3E635" }}>
                        {Number(p.price).toLocaleString("ar-EG")} ج.م
                      </td>
                      <td style={{ padding: "0.8rem 1rem", color: "#94a3b8" }}>
                        {p.old_price ? `${Number(p.old_price).toLocaleString("ar-EG")} ج.م` : "-"}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        <span style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          background: p.in_stock ? "rgba(163, 230, 53, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: p.in_stock ? "#A3E635" : "#ef4444"
                        }}>
                          {p.in_stock ? "متوفرة" : "غير متوفرة"}
                        </span>
                      </td>
                      <td style={{ padding: "0.8rem 1rem", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                          <button
                            onClick={() => startEdit(p)}
                            style={{ background: "#2563eb", color: "#fff", border: 0, padding: "0.35rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            style={{ background: "#dc2626", color: "#fff", border: 0, padding: "0.35rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT & WHATSAPP TRACKING */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>سجل طلبات العملاء وأكواد المرجع</h2>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>مرتبة من الأحدث إلى الأقدم</span>
            </div>

            {orders.length === 0 ? (
              <div style={{ background: "#141c18", padding: "3rem", textAlign: "center", borderRadius: "14px", color: "#94a3b8" }}>
                لا توجد طلبات مسجلة بعد. عند قيام العميل بالطلب ستظهر هنا فوراً مع كود المرجع الفريد.
              </div>
            ) : (
              <div style={{ background: "#141c18", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                  <thead>
                    <tr style={{ background: "#0e1411", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", fontSize: "0.78rem" }}>
                      <th style={{ padding: "1rem" }}>مرجع الطلب (Order Ref)</th>
                      <th style={{ padding: "1rem" }}>العميل والهاتف</th>
                      <th style={{ padding: "1rem" }}>المحافظة والعنوان</th>
                      <th style={{ padding: "1rem" }}>الساعات المطلوبة</th>
                      <th style={{ padding: "1rem" }}>المبلغ الإجمالي</th>
                      <th style={{ padding: "1rem" }}>حالة الطلب</th>
                      <th style={{ padding: "1rem", textAlign: "center" }}>مراسلة واتساب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const waText = encodeURIComponent(`مرحباً أستاذ ${o.customer_name}، نتواصل معك بخصوص طلبك من متجر Ben10 للساعات رقم المرجع: #${o.order_ref}`);
                      const waLink = `https://wa.me/2${o.customer_phone.replace(/^0/, "")}?text=${waText}`;

                      return (
                        <tr key={o.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "0.85rem" }}>
                          <td style={{ padding: "0.8rem 1rem" }}>
                            <span style={{
                              background: "rgba(163, 230, 53, 0.15)",
                              border: "1px solid #A3E635",
                              color: "#A3E635",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontWeight: "800",
                              fontSize: "0.8rem",
                              display: "inline-block"
                            }}>
                              #{o.order_ref}
                            </span>
                          </td>
                          <td style={{ padding: "0.8rem 1rem" }}>
                            <b>{o.customer_name}</b>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{o.customer_phone}</div>
                          </td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: "0.78rem" }}>
                            <b style={{ color: "#38bdf8" }}>{o.governorate}</b>
                            <div style={{ color: "#94a3b8" }}>{o.address}</div>
                          </td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: "0.75rem" }}>
                            {Array.isArray(o.items) ? o.items.map((it, idx) => (
                              <div key={idx} style={{ marginBottom: "2px" }}>
                                • {it.name} <small>({it.qty}x)</small>
                              </div>
                            )) : "-"}
                          </td>
                          <td style={{ padding: "0.8rem 1rem", fontWeight: "800", color: "#A3E635" }}>
                            {Number(o.total).toLocaleString("ar-EG")} ج.م
                          </td>
                          <td style={{ padding: "0.8rem 1rem" }}>
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.order_ref, e.target.value)}
                              style={{
                                background: "#0b0f0d",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                color: "#fff",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                outline: "none"
                              }}
                            >
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="تم التأكيد">تم التأكيد</option>
                              <option value="جاري الشحن">جاري الشحن</option>
                              <option value="تم التسليم">تم التسليم</option>
                              <option value="ملغي">ملغي</option>
                            </select>
                          </td>
                          <td style={{ padding: "0.8rem 1rem", textAlign: "center" }}>
                            <a
                              href={waLink}
                              target="_blank"
                              style={{
                                background: "rgba(37, 211, 102, 0.15)",
                                border: "1px solid #25d366",
                                color: "#25d366",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem"
                              }}
                            >
                              واتساب العميل
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {showAddModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(5px)",
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: "1rem"
          }}>
            <div style={{
              background: "#141c18",
              border: "1px solid rgba(163, 230, 53, 0.4)",
              borderRadius: "16px",
              width: "min(680px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.8rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.7)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0 }}>
                  {editingProduct ? "تعديل بيانات الساعة" : "إضافة ساعة جديدة للكتالوج"}
                </h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: 0, color: "#fff", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
              </div>

              <form onSubmit={handleSaveProduct}>
                {/* Watch Name */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>اسم الساعة *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="مثال: ساعة Ben10 رويال هيريتدج كلاسيك"
                    style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                  />
                </div>

                {/* Categories & Target Audience */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  {/* Category (Types from Image 2) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>الفئة (نوع الساعة) *</label>
                    <select
                      value={form.cat}
                      onChange={(e) => setForm({ ...form, cat: e.target.value })}
                      style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                    >
                      {WATCH_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Audience (from Image 4) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>الفئة المستهدفة</label>
                    <select
                      value={form.target_audience}
                      onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                      style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                    >
                      {TARGET_AUDIENCES.map(aud => (
                        <option key={aud.value} value={aud.value}>{aud.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Selection (from Image 3) */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>لون الساعة</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                  >
                    {STANDARD_COLORS.map(col => (
                      <option key={col.value} value={col.value}>{col.label}</option>
                    ))}
                  </select>

                  {form.color === "custom" && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="اكتب اسم اللون المخصص هنا..."
                        value={form.custom_color}
                        onChange={(e) => setForm({ ...form, custom_color: e.target.value })}
                        required={form.color === "custom"}
                        style={{ width: "100%", height: "38px", background: "#090d0b", border: "1px solid #A3E635", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                      />
                    </div>
                  )}
                </div>

                {/* Image Upload from Device & Storage in Source Code */}
                <div style={{
                  marginBottom: "1rem",
                  background: "#0e1512",
                  border: "1px dashed rgba(163, 230, 53, 0.4)",
                  borderRadius: "10px",
                  padding: "1rem"
                }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#A3E635", marginBottom: "0.5rem" }}>
                    📷 رفع صورة الساعة من جهازك (يتم تخزينها في ملفات السورس كود)
                  </label>
                  
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                          width: "100%",
                          fontSize: "0.8rem",
                          color: "#94a3b8",
                          cursor: "pointer"
                        }}
                      />
                      {uploadingImage && (
                        <div style={{ fontSize: "0.75rem", color: "#A3E635", marginTop: "0.4rem" }}>
                          ⏳ جاري رفع وحفظ الصورة في ملفات السورس كود...
                        </div>
                      )}
                      {uploadError && (
                        <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.4rem" }}>
                          ✕ {uploadError}
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    {form.image && (
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={form.image}
                          alt="معاينة الصورة"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "8px",
                            padding: "3px",
                            border: "1px solid #A3E635"
                          }}
                        />
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", marginTop: "2px" }}>معاينة</div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: "0.6rem" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", color: "#94a3b8", marginBottom: "0.2rem" }}>مسار ملف الصورة المخزن:</label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      required
                      placeholder="/uploads/watch-xxx.png أو /img/ben10-classic-concept-01.png"
                      style={{ width: "100%", height: "34px", fontSize: "0.75rem", background: "#090d0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", paddingInline: "0.6rem" }}
                    />
                  </div>
                </div>

                {/* Price & Old Price */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>السعر الحالي (ج.م) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                      style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>السعر القديم قبل الخصم (اختياري)</label>
                    <input
                      type="number"
                      value={form.old_price}
                      onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                      placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                      style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                    />
                  </div>
                </div>

                {/* Short Subtitle */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>وصف مختصر / سطر فرعي</label>
                  <input
                    type="text"
                    value={form.sub}
                    onChange={(e) => setForm({ ...form, sub: e.target.value })}
                    placeholder="ستانلس ستيل 316L مصقول · زجاج ياقوتي مقاوم للخدش"
                    style={{ width: "100%", height: "42px", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", paddingInline: "0.8rem", outline: "none" }}
                  />
                </div>

                {/* Full Description (الوصف الكامل بتاع الساعة) */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.3rem" }}>الوصف الكامل بتاع الساعة</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="اكتب هنا الوصف التفصيلي والكامل للساعة، المميزات، الخامات، والاستخدام..."
                    style={{ width: "100%", background: "#090d0b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", padding: "0.8rem", outline: "none", resize: "vertical", fontFamily: "inherit", fontSize: "0.82rem", lineHeight: "1.6" }}
                  />
                </div>

                {/* Stock Status */}
                <div style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    style={{ width: "18px", height: "18px", accentColor: "#A3E635", cursor: "pointer" }}
                  />
                  <label htmlFor="stockCheck" style={{ fontSize: "0.82rem", fontWeight: "700", cursor: "pointer" }}>
                    الساعة متوفرة في المخزن وقابلة للطلب
                  </label>
                </div>

                {/* Submit / Cancel Buttons */}
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      height: "46px",
                      background: "#A3E635",
                      color: "#0d1210",
                      fontWeight: "800",
                      border: 0,
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontSize: "0.92rem",
                      boxShadow: "0 4px 15px rgba(163, 230, 53, 0.25)"
                    }}
                  >
                    {editingProduct ? "تحديث الساعة" : "حفظ وإضافة الساعة"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      paddingInline: "1.5rem",
                      height: "46px",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: 0,
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontSize: "0.92rem"
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
