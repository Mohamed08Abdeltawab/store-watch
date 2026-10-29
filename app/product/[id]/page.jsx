"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCart, GOVERNORATES } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const {
    products,
    addToCart,
    openCheckoutWithProduct,
    sendDirectWhatsApp,
    isWishlisted,
    toggleWishlist
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedGov, setSelectedGov] = useState(GOVERNORATES[0]);

  useEffect(() => {
    // Try finding in products from context
    const found = products.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      setLoading(false);
    } else {
      // Fetch from API
      fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setProduct(null);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [productId, products]);

  if (loading) {
    return (
      <div className="py-28 text-center space-y-3">
        <div className="text-4xl animate-bounce">⌚</div>
        <h3 className="font-bold text-lg text-neutral-800">جاري تحميل مواصفات الساعة الفاخرة...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-28 text-center max-w-md mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-black text-neutral-900">الساعة غير موجودة أو تم حذفها</h2>
        <p className="text-xs text-neutral-500">قد يكون الرابط خاطئاً أو تم تعديل كود الساعة</p>
        <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold rounded-full px-6">
          <Link href="/shop">
            العودة لكتالوج الساعات
          </Link>
        </Button>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ["/img/ben10-classic-concept-01.png"]);

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const isFav = isWishlisted(product.id);

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.cat === product.cat || p.target_audience === product.target_audience))
    .slice(0, 4);

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 flex-wrap" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-emerald-700 transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-emerald-700 transition-colors">المتجر</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.cat)}`} className="hover:text-emerald-700 transition-colors">
            {product.cat}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <section className="pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-neutral-200/80 p-6 flex items-center justify-center shadow-sm">
                <img
                  src={images[activeImgIndex] || product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.badge_text && (
                    <Badge className="bg-lime-400 text-black font-extrabold text-xs hover:bg-lime-400 shadow-sm border-0">
                      {product.badge_text}
                    </Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm border-0">
                      خصم {discount}%
                    </Badge>
                  )}
                </div>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  className={`absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 ${
                    isFav ? "text-rose-500" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  aria-label="المفضلة"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* Navigation arrows if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs backdrop-blur-sm transition-transform active:scale-95"
                      onClick={() => setActiveImgIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                      aria-label="السابق"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs backdrop-blur-sm transition-transform active:scale-95"
                      onClick={() => setActiveImgIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                      aria-label="التالي"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`w-16 h-16 rounded-2xl border-2 p-1 bg-white shrink-0 transition-all ${
                        activeImgIndex === idx ? "border-lime-500 scale-105 shadow-sm" : "border-neutral-200 opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => setActiveImgIndex(idx)}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details & Purchase Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Category, Audience, Stock */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-bold text-neutral-800 border-neutral-200 bg-neutral-100">
                  {product.cat}
                </Badge>
                {product.target_audience && (
                  <Badge variant="outline" className="text-xs font-bold text-neutral-800 border-neutral-200 bg-neutral-100">
                    {product.target_audience}
                  </Badge>
                )}
                <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1 mr-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  متوفرة بالمخزن وجاهزة للشحن الفوري
                </span>
              </div>

              {/* Title & Sub */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight">
                  {product.name}
                </h1>
                {product.sub && (
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {product.sub}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="text-amber-500 font-bold tracking-wider text-sm">★★★★★</span>
                <span className="font-extrabold text-neutral-900">{product.rating} / 5.0</span>
                <span className="text-neutral-400">({product.reviews} تقييم موثق من المشترين)</span>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-neutral-900">
                    {Number(product.price).toLocaleString("ar-EG")} <span className="text-sm font-bold text-neutral-500">ج.م</span>
                  </span>
                  {product.old_price && (
                    <s className="text-sm text-neutral-400 line-through">
                      {Number(product.old_price).toLocaleString("ar-EG")} ج.م
                    </s>
                  )}
                </div>
                {discount > 0 && (
                  <div className="text-xs font-bold text-emerald-800">
                    🎉 وفرت اليوم {(product.old_price - product.price).toLocaleString("ar-EG")} ج.م مع علبة هدايا جلدية فاخرة مجاناً!
                  </div>
                )}
              </div>

              {/* Trust Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-emerald-950">
                <div className="flex items-start gap-2.5">
                  <span className="text-base">🔍</span>
                  <div>
                    <strong className="block font-bold">فحص ومعاينة قبل الدفع:</strong>
                    <span className="text-[11px] text-emerald-800">افتح العلبة وافحص الساعة وتأكد من جودتها أمام المندوب.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base">🛡️</span>
                  <div>
                    <strong className="block font-bold">ضمان الوكيل المعتمد:</strong>
                    <span className="text-[11px] text-emerald-800">{product.warranty || "ضمان 12 شهراً استبدال فوري ضد عيوب الصناعة."}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-12 rounded-2xl text-base shadow-lg shadow-lime-400/25 transition-transform active:scale-[0.99] gap-2"
                  onClick={() => addToCart(product, 1)}
                >
                  <svg className="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>أضف إلى السلة للمتابعة</span>
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold h-11 rounded-xl gap-2 shadow-sm"
                    onClick={() => sendDirectWhatsApp(product)}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                    </svg>
                    <span>طلب مباشر عبر واتساب</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-neutral-900 font-extrabold h-11 rounded-xl border-neutral-300 hover:bg-neutral-100"
                    onClick={() => openCheckoutWithProduct(product)}
                  >
                    شراء سريع فوري (معاينة قبل الدفع)
                  </Button>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-bold text-neutral-800">
                  <span>🚚 مصاريف ومواعيد الشحن لمحافظتك:</span>
                  <select
                    className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-800 outline-none"
                    value={selectedGov.id}
                    onChange={(e) => {
                      const g = GOVERNORATES.find(gov => gov.id === e.target.value);
                      if (g) setSelectedGov(g);
                    }}
                  >
                    {GOVERNORATES.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov.name}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  الشحن إلى <strong className="text-neutral-800">{selectedGov.name}</strong> يستغرق <strong className="text-neutral-800">{selectedGov.days}</strong> وقيمته <strong className="text-emerald-700">{selectedGov.shipping === 0 ? "مجاناً" : `${selectedGov.shipping} ج.م`}</strong> (أو مجاني للطلبات فوق 5,000 ج.م).
                </p>
              </div>

            </div>

          </div>

          {/* Technical Specifications Section */}
          <div className="mt-14 pt-10 border-t border-neutral-200">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-6">
              المواصفات التقنية الكاملة
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "نوع الساعة والتصنيف:", val: `${product.cat} ${product.target_audience ? `(${product.target_audience})` : ""}` },
                { label: "ماكينة الساعة (الحركة):", val: product.movement || "كوارتز ياباني فائق الدقة (Original Movement)" },
                { label: "نوع الزجاج:", val: product.glass || "سافاير كريستال ياقوتي مضاد للخدش مع طبقة مانعة للانعكاس" },
                { label: "مادة الهيكل الخارجي:", val: product.case_material || "فولاذ صلب ستانلس ستيل 316L مقاوم للصدأ والتحسس" },
                { label: "قطر وسمك الساعة:", val: product.diameter || "42 ملم تصميم مريح لجميع أحجام المعصم" },
                { label: "مقاومة الماء:", val: product.water_resist || "5 ATM (50 متر) - مقاومة كاملة للماء والأنشطة اليومية" },
                { label: "نوع الحزام (السوار):", val: product.strap || "سوار ستانلس ستيل متين مع قفل أمان مزدوج" },
                { label: "مدة الضمان المعتمد:", val: product.warranty || "ضمان 12 شهراً استبدال فوري" },
              ].map((spec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 block">{spec.label}</span>
                  <span className="text-xs font-bold text-neutral-800 leading-snug block">{spec.val}</span>
                </div>
              ))}
            </div>

            {/* Full Detailed Description */}
            {(product.description || product.overview) && (
              <div className="mt-6 p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <h3 className="font-extrabold text-sm sm:text-base text-neutral-900">نظرة عامة على الساعة</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.description || product.overview}
                </p>
              </div>
            )}
          </div>

          {/* Related Watches */}
          {relatedProducts.length > 0 && (
            <div className="mt-14 pt-10 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <Badge variant="outline" className="mb-2 text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
                    تشكيلات قد تعجبك
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    ساعات <span className="text-emerald-700">مشابهة</span> من نفس الفئة
                  </h2>
                </div>
                <Button asChild variant="outline" className="border-neutral-300 rounded-full h-10 px-5 text-xs font-bold self-start sm:self-auto">
                  <Link href="/shop" className="flex items-center gap-2">
                    <span>تصفح كل التشكيلات</span>
                    <span>←</span>
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
