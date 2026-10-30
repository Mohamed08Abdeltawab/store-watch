"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
      if (audienceParam === "men" || audienceParam === "رجالي") setActiveAudience("رجالي");
      else if (audienceParam === "women" || audienceParam === "حريمي") setActiveAudience("حريمي");
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
      if (!p.target_audience) return false;
      const matchesAudience = p.target_audience.includes(activeAudience) || p.target_audience === "للجنسين";
      if (!matchesAudience) return false;
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
    <div className="pb-16">
      {/* Shop Page Banner */}
      <section className="bg-gradient-to-b from-[#0d1210] to-[#141c18] text-white py-10 sm:py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <nav className="flex items-center gap-2 text-xs text-neutral-400 font-semibold" aria-label="مسار التنقل">
            <Link href="/" className="hover:text-lime-400 transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-white">المتجر وجميع التشكيلات</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/30 text-xs font-bold mb-2">
                كتالوج الساعات الفاخرة 2026
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                تشكيلات ساعات <span className="text-lime-400">Ben10</span> الفاخرة
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                تصفح جميع الموديلات الأصلية بضمان الوكيل، مع ميزة الفحص والمعاينة قبل الدفع وشحن سريع لكافة المحافظات.
              </p>
            </div>

            {/* In-page Search */}
            <div className="w-full md:w-80 relative">
              <input
                type="search"
                placeholder="ابحث بالاسم، الموديل، الفئة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-full bg-white/10 border border-white/15 text-white placeholder-neutral-400 text-xs outline-none focus:ring-2 focus:ring-lime-400"
              />
              <svg className="w-4 h-4 text-lime-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* Filter Bar */}
      <section className="top-0 sm:sticky sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-neutral-400 shrink-0 ml-1">الفئات:</span>
            {[
              { id: "all", label: "جميع الساعات" },
              { id: "عادية (كلاسيكية)", label: "كلاسيكية" },
              { id: "كرونوغراف (Chronograph)", label: "كرونوغراف" },
              { id: "أوتوماتيك", label: "أوتوماتيك" },
              { id: "ذكية (Smartwatch)", label: "ذكية" },
              { id: "رقمية (Digital)", label: "رقمية" }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 min-h-[38px] rounded-full text-xs font-bold shrink-0 transition-all flex items-center justify-center ${
                  activeCategory === cat.id
                    ? "bg-lime-400 text-black shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub Row: Audience, Sort, Count */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-neutral-100 text-xs">
            {/* Audience */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-neutral-400">الجمهور:</span>
              {[
                { id: "all", label: "الكل" },
                { id: "رجالي", label: "ساعات رجالية" },
                { id: "حريمي", label: "ساعات نسائية" }
              ].map(aud => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setActiveAudience(aud.id)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg font-bold transition-all flex items-center justify-center ${
                    activeAudience === aud.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>

            {/* Sort & Reset */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">الترتيب:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-800 outline-none focus:ring-1 focus:ring-lime-400 cursor-pointer"
              >
                <option value="featured">المقترح والمميز</option>
                <option value="bestseller">الأكثر طلباً ومبيعاً</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
              </select>

              {(activeCategory !== "all" || activeAudience !== "all" || searchQuery || activeSort !== "featured") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[36px] flex items-center text-xs font-bold text-rose-500 hover:underline mr-2"
                >
                  إعادة تعيين
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Product Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6 text-xs text-neutral-500 font-semibold">
          <span>عرض {filtered.length} من أصل {products.length} ساعة</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-extrabold text-lg text-neutral-900 mb-1">لم يتم العثور على ساعات مطابقة</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-5">
              جرّب تغيير فئة البحث أو مسح الكلمات المكتوبة لاستعراض التشكيلات المتاحة.
            </p>
            <Button
              className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold rounded-full px-6"
              onClick={resetFilters}
            >
              إعادة تعيين جميع الفلاتر
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <div className="text-3xl mb-2">⌚</div>
        <p className="text-sm font-bold text-neutral-600">جاري تحميل تشكيلات الساعات...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
