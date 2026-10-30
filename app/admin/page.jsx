"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";

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
  { value: "للجنسين", label: "للجنسين" }
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
  const { setIsAdmin, checkAdminAuth } = useCart();
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");

  // Product Form State (Up to 10 images)
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
    images: ["/img/ben10-classic-concept-01.png"],
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
        setIsAdmin(false);
        router.push("/admin/login");
        return;
      }

      setIsAdmin(true);
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
    setIsAdmin(false);
    router.push("/admin/login");
  }

  // Handle Multi-Image Upload (Up to 10 images) into source files (public/uploads)
  async function handleMultipleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = form.images.length;
    const remainingSlots = 10 - currentCount;

    if (remainingSlots <= 0) {
      alert("وصلت للحد الأقصى المسموح به (10 صور للساعة الواحدة)");
      e.target.value = "";
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      notify(`تم أخذ أول ${remainingSlots} صور فقط للوصول إلى الحد الأقصى (10 صور)`);
    }

    setUploadingImage(true);
    setUploadError("");

    const formData = new FormData();
    filesToUpload.forEach(f => formData.append("files", f));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        setForm(prev => {
          const combined = [...prev.images, ...data.urls].slice(0, 10);
          return {
            ...prev,
            images: combined,
            image: combined[0] || prev.image
          };
        });
        notify(`تم رفع وتخزين ${data.urls.length} صور في ملفات المتجر بنجاح`);
      } else {
        setUploadError(data.error || "فشل رفع الصور");
      }
    } catch (err) {
      setUploadError("حدث خطأ أثناء رفع الصور");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  // Add image by manual URL
  function handleAddManualImage() {
    const url = manualImageUrl.trim();
    if (!url) return;
    if (form.images.length >= 10) {
      alert("وصلت للحد الأقصى (10 صور)");
      return;
    }
    setForm(prev => {
      const combined = [...prev.images, url].slice(0, 10);
      return {
        ...prev,
        images: combined,
        image: combined[0] || prev.image
      };
    });
    setManualImageUrl("");
    notify("تمت إضافة رابط الصورة بنجاح");
  }

  // Set any image as primary cover (index 0)
  function handleSetAsCover(idx) {
    if (idx === 0) return;
    setForm(prev => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(idx, 1);
      imgs.unshift(chosen);
      return {
        ...prev,
        images: imgs,
        image: imgs[0]
      };
    });
    notify("تم تعيين الصورة كغلاف رئيسي للساعة");
  }

  // Remove an image from the list
  function handleRemoveImage(idx) {
    setForm(prev => {
      const imgs = prev.images.filter((_, i) => i !== idx);
      return {
        ...prev,
        images: imgs,
        image: imgs[0] || "/img/ben10-classic-concept-01.png"
      };
    });
  }

  // Move image order left / right
  function handleMoveImage(idx, dir) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= form.images.length) return;
    setForm(prev => {
      const imgs = [...prev.images];
      const temp = imgs[idx];
      imgs[idx] = imgs[targetIdx];
      imgs[targetIdx] = temp;
      return {
        ...prev,
        images: imgs,
        image: imgs[0]
      };
    });
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

    if (form.images.length === 0) {
      alert("يرجى إضافة صورة واحدة على الأقل للساعة");
      return;
    }

    const selectedColor = form.color === "custom"
      ? (form.custom_color.trim() || "")
      : form.color;

    const payload = {
      ...form,
      color: selectedColor,
      image: form.images[0] || form.image,
      images: form.images.slice(0, 10),
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
      images: ["/img/ben10-classic-concept-01.png"],
      description: "",
      in_stock: true
    });
    setManualImageUrl("");
    setUploadError("");
  }

  function startEdit(p) {
    setEditingProduct(p);

    const isStdColor = STANDARD_COLORS.some(c => c.value !== "custom" && c.value === p.color);
    const colorVal = !p.color ? "" : (isStdColor ? p.color : "custom");
    const customColorVal = isStdColor ? "" : (p.color || "");

    const initialImages = Array.isArray(p.images) && p.images.length > 0
      ? p.images.slice(0, 10)
      : (p.image ? [p.image] : ["/img/ben10-classic-concept-01.png"]);

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
      image: initialImages[0],
      images: initialImages,
      description: p.description || p.overview || "",
      in_stock: p.in_stock === 1 || p.in_stock === true
    });
    setManualImageUrl("");
    setUploadError("");
    setShowAddModal(true);
  }

  const totalSales = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "قيد المراجعة").length;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f0d", color: "#fff", fontFamily: "'Almarai', sans-serif" }} dir="rtl">
      {/* Top Navbar */}
      <header className="bg-[#121815] border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Logo & Title -> Click to return to Home Page */}
          <Link
            href="/"
            title="الرجوع إلى الشاشة الرئيسية"
            className="flex items-center gap-3 text-white no-underline group transition-opacity hover:opacity-90"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-lime-400/15 border border-lime-400 text-lime-400 grid place-items-center font-extrabold text-sm sm:text-base transition-transform group-hover:scale-105 shadow-inner">
              B10
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black m-0 flex items-center gap-1.5 leading-tight">
                <span>لوحة تحكم</span>
                <span className="text-lime-400">Ben10 Watches</span>
              </h1>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                مدير المتجر المعتمد · اضغط للرجوع للشاشة الرئيسية ↗
              </span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <Link
              href="/"
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold no-underline transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>زيارة واجهة المتجر</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 sm:px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500 text-rose-300 text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1340px] mx-auto p-3 sm:p-6 md:p-8">
        {/* Flash Notification */}
        {notification && (
          <div className="bg-lime-400/15 border border-lime-400 text-lime-400 px-4 py-3 rounded-xl mb-5 font-bold text-xs sm:text-sm flex items-center gap-2">
            <span>✓</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[#141c18] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <span className="text-[11px] sm:text-xs text-neutral-400 block">إجمالي الساعات المسجلة</span>
            <div className="text-lg sm:text-2xl md:text-3xl font-black text-white mt-1">
              {products.length} <small className="text-xs sm:text-sm text-lime-400 font-bold">ساعة</small>
            </div>
          </div>

          <div className="bg-[#141c18] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <span className="text-[11px] sm:text-xs text-neutral-400 block">إجمالي الطلبات المستلمة</span>
            <div className="text-lg sm:text-2xl md:text-3xl font-black text-white mt-1">
              {orders.length} <small className="text-xs sm:text-sm text-sky-400 font-bold">طلب</small>
            </div>
          </div>

          <div className="bg-[#141c18] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <span className="text-[11px] sm:text-xs text-neutral-400 block">طلبات بانتظار التأكيد</span>
            <div className="text-lg sm:text-2xl md:text-3xl font-black text-amber-400 mt-1">
              {pendingOrders} <small className="text-xs sm:text-sm text-neutral-300 font-bold">طلب معلق</small>
            </div>
          </div>

          <div className="bg-[#141c18] border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <span className="text-[11px] sm:text-xs text-neutral-400 block">حجم المبيعات الإجمالي</span>
            <div className="text-lg sm:text-2xl md:text-3xl font-black text-lime-400 mt-1">
              {totalSales.toLocaleString("ar-EG")} <small className="text-xs sm:text-sm text-white font-bold">ج.م</small>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-6 border-b border-white/10 pb-3 sm:pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm cursor-pointer border-0 whitespace-nowrap transition-all ${
              activeTab === "products"
                ? "bg-lime-400 text-black shadow-lg shadow-lime-400/20"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            ⌚ إدارة الساعات ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm cursor-pointer border-0 whitespace-nowrap transition-all ${
              activeTab === "orders"
                ? "bg-lime-400 text-black shadow-lg shadow-lime-400/20"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            📋 الطلبات والواتساب ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white m-0">كتالوج الساعات الحالي في قاعدة البيانات</h2>
                <span className="text-xs text-neutral-400 block mt-0.5 sm:hidden">اسحب الجدول أفقياً لعرض كل التفاصيل والإجراءات ↔</span>
              </div>
              <button
                onClick={() => { resetForm(); setEditingProduct(null); setShowAddModal(true); }}
                className="w-full sm:w-auto bg-lime-400 hover:bg-lime-500 text-black px-5 py-2.5 rounded-full font-black text-xs sm:text-sm border-0 cursor-pointer shadow-lg shadow-lime-400/25 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span>+</span>
                <span>إضافة ساعة جديدة</span>
              </button>
            </div>

            {/* Table Container with horizontal scroll and preserved table width */}
            <div
              className="bg-[#141c18] border border-white/10 rounded-2xl overflow-x-auto shadow-xl"
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
            >
              <table className="w-full border-collapse text-right" style={{ minWidth: "920px" }}>
                <thead>
                  <tr className="bg-[#0e1411] border-b border-white/10 text-neutral-400 text-xs">
                    <th className="p-3.5 sm:p-4">الصورة</th>
                    <th className="p-3.5 sm:p-4">اسم الساعة والموديل</th>
                    <th className="p-3.5 sm:p-4">الفئة (النوع)</th>
                    <th className="p-3.5 sm:p-4">الفئة المستهدفة</th>
                    <th className="p-3.5 sm:p-4">اللون</th>
                    <th className="p-3.5 sm:p-4">السعر الحالي</th>
                    <th className="p-3.5 sm:p-4">السعر السابق</th>
                    <th className="p-3.5 sm:p-4">المخزون</th>
                    <th className="p-3.5 sm:p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const imgCount = Array.isArray(p.images) ? p.images.length : 1;
                    return (
                      <tr key={p.id} className="border-b border-white/5 text-xs sm:text-sm hover:bg-white/[0.02]">
                        <td className="p-3 sm:p-3.5">
                          <div className="relative w-12 h-12">
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-white rounded-lg p-0.5" />
                            {imgCount > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-lime-400 text-black text-[9px] font-extrabold px-1 rounded leading-tight shadow-sm">
                                {imgCount} صور
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-3.5 font-bold">
                          <div>{p.name}</div>
                          <div className="text-[11px] text-neutral-400 font-normal mt-0.5">{p.sub}</div>
                        </td>
                        <td className="p-3 sm:p-3.5 whitespace-nowrap">
                          <span className="bg-lime-400/15 text-lime-400 px-2 py-1 rounded-md text-xs font-bold">
                            {p.cat}
                          </span>
                        </td>
                        <td className="p-3 sm:p-3.5 whitespace-nowrap">
                          <span className="bg-sky-400/15 text-sky-400 px-2 py-1 rounded-md text-xs font-bold">
                            {p.target_audience || "غير محدد"}
                          </span>
                        </td>
                        <td className="p-3 sm:p-3.5 whitespace-nowrap">
                          <span className="bg-white/10 px-2 py-1 rounded-md text-xs">
                            {p.color || "غير محدد"}
                          </span>
                        </td>
                        <td className="p-3 sm:p-3.5 font-extrabold text-lime-400 whitespace-nowrap">
                          {Number(p.price).toLocaleString("ar-EG")} ج.م
                        </td>
                        <td className="p-3 sm:p-3.5 text-neutral-400 whitespace-nowrap">
                          {p.old_price ? `${Number(p.old_price).toLocaleString("ar-EG")} ج.م` : "-"}
                        </td>
                        <td className="p-3 sm:p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            p.in_stock ? "bg-lime-400/15 text-lime-400" : "bg-rose-500/15 text-rose-400"
                          }`}>
                            {p.in_stock ? "متوفرة" : "غير متوفرة"}
                          </span>
                        </td>
                        <td className="p-3 sm:p-3.5 text-center whitespace-nowrap">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => startEdit(p)}
                              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-2 min-h-[36px] rounded-lg cursor-pointer text-xs font-bold transition-colors inline-flex items-center justify-center"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="bg-rose-600 hover:bg-rose-700 text-white border-0 px-3 py-2 min-h-[36px] rounded-lg cursor-pointer text-xs font-bold transition-colors inline-flex items-center justify-center"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT & WHATSAPP TRACKING */}
        {activeTab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white m-0">سجل طلبات العملاء وأكواد المرجع</h2>
                <span className="text-xs text-neutral-400 block mt-0.5 sm:hidden">اسحب الجدول أفقياً لعرض كل تفاصيل الطلبات ↔</span>
              </div>
              <span className="text-xs text-neutral-400">مرتبة من الأحدث إلى الأقدم</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#141c18] p-8 sm:p-12 text-center rounded-2xl text-neutral-400 text-sm">
                لا توجد طلبات مسجلة بعد. عند قيام العميل بالطلب ستظهر هنا فوراً مع كود المرجع الفريد.
              </div>
            ) : (
              <div
                className="bg-[#141c18] border border-white/10 rounded-2xl overflow-x-auto shadow-xl"
                style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
              >
                <table className="w-full border-collapse text-right" style={{ minWidth: "980px" }}>
                  <thead>
                    <tr className="bg-[#0e1411] border-b border-white/10 text-neutral-400 text-xs">
                      <th className="p-3.5 sm:p-4">مرجع الطلب (Order Ref)</th>
                      <th className="p-3.5 sm:p-4">العميل والهاتف</th>
                      <th className="p-3.5 sm:p-4">المحافظة والعنوان</th>
                      <th className="p-3.5 sm:p-4">الساعات المطلوبة</th>
                      <th className="p-3.5 sm:p-4">المبلغ الإجمالي</th>
                      <th className="p-3.5 sm:p-4">حالة الطلب</th>
                      <th className="p-3.5 sm:p-4 text-center">مراسلة واتساب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const waText = encodeURIComponent(`مرحباً أستاذ ${o.customer_name}، نتواصل معك بخصوص طلبك من متجر Ben10 للساعات رقم المرجع: #${o.order_ref}`);
                      const waLink = `https://wa.me/2${o.customer_phone.replace(/^0/, "")}?text=${waText}`;

                      return (
                        <tr key={o.id} className="border-b border-white/5 text-xs sm:text-sm hover:bg-white/[0.02]">
                          <td className="p-3 sm:p-3.5 whitespace-nowrap">
                            <span className="bg-lime-400/15 border border-lime-400 text-lime-400 px-2 py-1 rounded-md font-extrabold text-xs inline-block">
                              #{o.order_ref}
                            </span>
                          </td>
                          <td className="p-3 sm:p-3.5 whitespace-nowrap">
                            <div className="font-bold">{o.customer_name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{o.customer_phone}</div>
                          </td>
                          <td className="p-3 sm:p-3.5 max-w-[200px]">
                            <div className="font-bold text-sky-400">{o.governorate}</div>
                            <div className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{o.address}</div>
                          </td>
                          <td className="p-3 sm:p-3.5 text-xs">
                            {Array.isArray(o.items) ? o.items.map((it, idx) => (
                              <div key={idx} className="mb-0.5">
                                • {it.name} <small className="text-neutral-400">({it.qty}x)</small>
                              </div>
                            )) : "-"}
                          </td>
                          <td className="p-3 sm:p-3.5 font-black text-lime-400 whitespace-nowrap">
                            {Number(o.total).toLocaleString("ar-EG")} ج.م
                          </td>
                          <td className="p-3 sm:p-3.5 whitespace-nowrap">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.order_ref, e.target.value)}
                              className="bg-[#0b0f0d] border border-white/20 text-white px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs outline-none cursor-pointer"
                            >
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="تم التأكيد">تم التأكيد</option>
                              <option value="جاري الشحن">جاري الشحن</option>
                              <option value="تم التسليم">تم التسليم</option>
                              <option value="ملغي">ملغي</option>
                            </select>
                          </td>
                          <td className="p-3 sm:p-3.5 text-center whitespace-nowrap">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366] text-[#25d366] px-3 py-2 min-h-[36px] rounded-full text-xs font-bold no-underline inline-flex items-center gap-1.5 transition-colors"
                            >
                              <span>واتساب العميل</span>
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
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
            <div className="bg-[#141c18] border border-lime-400/40 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-2xl my-auto">
              <div className="flex justify-between items-center pb-3.5 mb-4 border-b border-white/10">
                <h3 className="text-base sm:text-lg font-black text-white m-0">
                  {editingProduct ? "تعديل بيانات الساعة" : "إضافة ساعة جديدة للكتالوج"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold border-0 cursor-pointer transition-colors shrink-0"
                  aria-label="إغلاق النافذة"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Watch Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">اسم الساعة *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="مثال: ساعة Ben10 رويال هيريتدج كلاسيك"
                    className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>

                {/* Categories & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">الفئة (نوع الساعة) *</label>
                    <select
                      value={form.cat}
                      onChange={(e) => setForm({ ...form, cat: e.target.value })}
                      className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none cursor-pointer"
                    >
                      {WATCH_TYPES.map(type => (
                        <option key={type} value={type} className="bg-[#141c18] text-white">{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">الفئة المستهدفة</label>
                    <select
                      value={form.target_audience}
                      onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                      className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none cursor-pointer"
                    >
                      {TARGET_AUDIENCES.map(aud => (
                        <option key={aud.value} value={aud.value} className="bg-[#141c18] text-white">{aud.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">لون الساعة</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none cursor-pointer"
                  >
                    {STANDARD_COLORS.map(col => (
                      <option key={col.value} value={col.value} className="bg-[#141c18] text-white">{col.label}</option>
                    ))}
                  </select>

                  {form.color === "custom" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="اكتب اسم اللون المخصص هنا..."
                        value={form.custom_color}
                        onChange={(e) => setForm({ ...form, custom_color: e.target.value })}
                        required={form.color === "custom"}
                        className="w-full h-10 bg-[#090d0b] border border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Multi-Image Gallery Section (Up to 10 Images) */}
                <div className="bg-[#0d1410] border border-lime-400/35 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-lime-400 block">
                        📷 صور الساعة (يمكنك رفع حتى 10 صور للساعة الواحدة)
                      </span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        الصورة الأولى هي صورة الغلاف الرئيسية التي تظهر في المتجر
                      </span>
                    </div>
                    <span className={`self-start sm:self-auto text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                      form.images.length >= 10
                        ? "bg-rose-500/20 text-rose-400 border-rose-500"
                        : "bg-lime-400/15 text-lime-400 border-lime-400"
                    }`}>
                      {form.images.length} / 10 صور
                    </span>
                  </div>

                  {/* Thumbnails Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5 mb-3">
                    {form.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`bg-[#080c0a] rounded-xl p-1.5 relative flex flex-col items-center ${
                          idx === 0 ? "border-2 border-lime-400" : "border border-white/15"
                        }`}
                      >
                        <div className="relative w-full h-16 sm:h-20 bg-white rounded-lg overflow-hidden grid place-items-center">
                          <img src={imgUrl} alt={`صورة ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                          {idx === 0 ? (
                            <span className="absolute top-1 right-1 bg-lime-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded leading-tight shadow-sm">
                              الغلاف ★
                            </span>
                          ) : (
                            <span className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded leading-tight">
                              #{idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Actions for this photo */}
                        <div className="flex gap-1 w-full mt-1.5">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx)}
                              title="تعيين كغلاف رئيسي"
                              className="flex-1 bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400 text-lime-400 rounded text-[10px] py-1 cursor-pointer font-bold transition-colors"
                            >
                              غلاف
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="حذف الصورة"
                            className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500 text-rose-300 rounded text-[11px] px-2 py-1 cursor-pointer transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload More Images Controls */}
                  {form.images.length < 10 ? (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                        <label className="bg-lime-400 hover:bg-lime-500 text-black px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center">
                          <span>+ رفع صور من الجهاز (متبقي {10 - form.images.length})</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>

                        {/* Manual URL input option */}
                        <div className="flex gap-1.5 flex-1">
                          <input
                            type="text"
                            placeholder="أو اكتب رابط/مسار صورة مباشرة..."
                            value={manualImageUrl}
                            onChange={(e) => setManualImageUrl(e.target.value)}
                            className="flex-1 h-9 sm:h-10 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3 text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddManualImage}
                            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl px-3.5 text-xs font-bold cursor-pointer transition-colors whitespace-nowrap"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>

                      {uploadingImage && (
                        <div className="text-xs text-lime-400 mt-2 font-bold flex items-center gap-1.5">
                          <span>⏳ جاري رفع الصور وتخزينها في السورس كود...</span>
                        </div>
                      )}
                      {uploadError && (
                        <div className="text-xs text-rose-400 mt-2 font-bold">
                          ✕ {uploadError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 text-center py-1">
                      ✓ تم الوصول للحد الأقصى (10 صور). لحذف صورة اضغط ✕ فوقها لإتاحة مكان لصورة أخرى.
                    </div>
                  )}
                </div>

                {/* Price & Old Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">السعر الحالي (ج.م) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                      placeholder="مثال: 1250"
                      className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">السعر القديم قبل الخصم (اختياري)</label>
                    <input
                      type="number"
                      value={form.old_price}
                      onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                      placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                      className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Short Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">وصف مختصر / سطر فرعي</label>
                  <input
                    type="text"
                    value={form.sub}
                    onChange={(e) => setForm({ ...form, sub: e.target.value })}
                    placeholder="ستانلس ستيل 316L مصقول · زجاج ياقوتي مقاوم للخدش"
                    className="w-full h-11 bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white px-3.5 text-xs sm:text-sm outline-none"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">الوصف الكامل بتاع الساعة</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="اكتب هنا الوصف التفصيلي والكامل للساعة، المميزات، الخامات، والاستخدام..."
                    className="w-full bg-[#090d0b] border border-white/15 focus:border-lime-400 rounded-xl text-white p-3 text-xs sm:text-sm outline-none resize-y leading-relaxed font-sans"
                  />
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="w-4 h-4 rounded accent-lime-400 cursor-pointer"
                  />
                  <label htmlFor="stockCheck" className="text-xs sm:text-sm font-bold text-neutral-200 cursor-pointer">
                    الساعة متوفرة في المخزن وقابلة للطلب
                  </label>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto px-6 h-11 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs sm:text-sm border-0 cursor-pointer transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 h-11 bg-lime-400 hover:bg-lime-500 text-black font-black rounded-xl text-xs sm:text-sm border-0 cursor-pointer shadow-lg shadow-lime-400/25 transition-all active:scale-[0.98]"
                  >
                    {editingProduct ? "تحديث الساعة" : "حفظ وإضافة الساعة"}
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
