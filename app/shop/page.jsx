"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

function ShopContent() {
  const { products } = useCart();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const audienceParam = searchParams.get("audience");
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAudience, setActiveAudience] = useState("all");
  const [activeSort, setActiveSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with searchParams on load
  useEffect(() => {
    if (categoryParam) {
      if (categoryParam === "classic") setActiveCategory("عادية (كلاسيكية)");
      else if (categoryParam === "chrono") setActiveCategory("كرونوغراف (Chronograph)");
      else if (categoryParam === "digital") setActiveCategory("رقمية (Digital)");
      else if (categoryParam === "smart") setActiveCategory("ذكية (Smartwatch)");
      else if (categoryParam === "automatic") setActiveCategory("أوتوماتيك");
      else setActiveCategory(categoryParam);
    }

    if (audienceParam) {
      if (audienceParam === "men") setActiveAudience("رجالي");
      else if (audienceParam === "women") setActiveAudience("حريمي");
      else setActiveAudience(audienceParam);
    }

    if (filterParam === "bestseller") {
      setActiveSort("bestseller");
    } else if (filterParam === "top-rated") {
      setActiveSort("rating");
    }
  }, [categoryParam, audienceParam, filterParam]);

  // Filtering
  let filtered = products.filter(p => {
    // Category match
    if (activeCategory !== "all") {
      const matchCat = (p.cat && p.cat.toLowerCase().includes(activeCategory.toLowerCase())) ||
                       (activeCategory === "أوتوماتيك" && (p.cat === "automatic" || (p.sub && p.sub.includes("أوتوماتيك"))));
      if (!matchCat) return false;
    }

    // Audience match
    if (activeAudience !== "all") {
      if (p.target_audience && !p.target_audience.includes(activeAudience)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.sub && p.sub.toLowerCase().includes(q)) ||
                    (p.cat && p.cat.toLowerCase().includes(q)) ||
                    (p.target_audience && p.target_audience.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Sorting
  if (activeSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (activeSort === "bestseller") {
    filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  function resetFilters() {
    setActiveCategory("all");
    setActiveAudience("all");
    setActiveSort("featured");
    setSearchQuery("");
  }

  return (
    <div className="shop-page">
      {/* Shop Page Banner */}
      <section className="shop-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="مسار التنقل">
            <Link href="/">الرئيسية</Link>
            <span>/</span>
            <span>كل التشكيلات (المتجر)</span>
          </nav>

          <h1 className="shop-hero__title">
            كتالوج ساعات <span>Ben10</span> الفاخرة
          </h1>
          <p className="shop-hero__desc">
            تصفح التشكيلة الكاملة من الساعات الأصلية المعتمدة لعام 2026. ضمان استبدال فوري، معاينة وفحص دقيق قبل الدفع للمندوب.
          </p>
        </div>
      </section>

      {/* Main Catalog Area */}
      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          {/* Toolbar & Filters */}
          <div className="catalog-toolbar" style={{ flexWrap: "wrap", gap: "1rem" }}>
            {/* Category Pills */}
            <div className="filter-tabs" style={{ overflowX: "auto", maxWidth: "100%", paddingBottom: "4px" }}>
              {[
                { id: "all", label: "جميع الساعات" },
                { id: "عادية (كلاسيكية)", label: "عادية (كلاسيكية)" },
                { id: "كرونوغراف (Chronograph)", label: "كرونوغراف" },
                { id: "ذكية (Smartwatch)", label: "ذكية (Smartwatch)" },
                { id: "رقمية (Digital)", label: "رقمية (Digital)" },
                { id: "أوتوماتيك", label: "أوتوماتيك وسكيلتون" }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`filter-tab ${activeCategory === tab.id ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub Filters: Audience + Sort */}
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
              {/* Audience selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--muted)" }}>الفئة:</label>
                <select
                  className="sort-select"
                  value={activeAudience}
                  onChange={(e) => setActiveAudience(e.target.value)}
                >
                  <option value="all">الكل (رجالي وحريمي)</option>
                  <option value="رجالي">رجالي فقط</option>
                  <option value="حريمي">حريمي فقط</option>
                </select>
              </div>

              {/* Sort selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--muted)" }}>ترتيب حسب:</label>
                <select
                  className="sort-select"
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                >
                  <option value="featured">المميز أولاً</option>
                  <option value="bestseller">الأكثر مبيعاً 🔥</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً ★</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Search & Count Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1.2rem 0 1.8rem", flexWrap: "wrap", gap: "0.8rem" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              تم العثور على <strong style={{ color: "var(--ben10-forest)", fontSize: "1.1rem" }}>{filtered.length}</strong> ساعة متاحة في الكتالوج
            </div>

            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <input
                type="search"
                placeholder="ابحث بالاسم أو المواصفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "10px",
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.82rem",
                  width: "220px"
                }}
              />
              {(activeCategory !== "all" || activeAudience !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    padding: "0.45rem 0.8rem",
                    fontSize: "0.76rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  إعادة ضبط الفلاتر ✕
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", background: "var(--cream)", borderRadius: "18px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🔍</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "0.5rem" }}>لا توجد ساعات تطابق هذا البحث</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                جرب تغيير خيارات التصفية أو الفئة لعرض المزيد من الموديلات
              </p>
              <button type="button" className="btn btn--green" onClick={resetFilters}>
                عرض جميع ساعات المتجر
              </button>
            </div>
          ) : (
            <div className="p-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem" }}>جاري تحميل تشكيلات الساعات...</div>}>
      <ShopContent />
    </Suspense>
  );
}
