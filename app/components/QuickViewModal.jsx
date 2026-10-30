"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function QuickViewModal() {
  const {
    quickProduct,
    setQuickProduct,
    addToCart,
    openCheckoutWithProduct,
    sendDirectWhatsApp
  } = useCart();

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [quickProduct]);

  if (!quickProduct) return null;

  // Parse images safely
  const images = (() => {
    if (!quickProduct) return ["/img/ben10-classic-concept-01.png"];
    let list = [];
    if (Array.isArray(quickProduct.images)) {
      list = quickProduct.images;
    } else if (typeof quickProduct.images === "string") {
      try {
        const parsed = JSON.parse(quickProduct.images);
        if (Array.isArray(parsed)) list = parsed;
        else if (typeof parsed === "string") list = [parsed];
      } catch {
        if (quickProduct.images.includes(",")) {
          list = quickProduct.images.split(",").map(s => s.trim());
        } else if (quickProduct.images.trim()) {
          list = [quickProduct.images.trim()];
        }
      }
    }

    list = list
      .filter(item => typeof item === "string" && item.trim().length > 0)
      .map(item => item.trim());

    if (quickProduct.image && typeof quickProduct.image === "string" && quickProduct.image.trim()) {
      const trimmed = quickProduct.image.trim();
      if (!list.includes(trimmed)) list.unshift(trimmed);
    }

    list = Array.from(new Set(list));
    return list.length > 0 ? list : ["/img/ben10-classic-concept-01.png"];
  })();

  const discount = quickProduct.old_price
    ? Math.round(((quickProduct.old_price - quickProduct.price) / quickProduct.old_price) * 100)
    : 0;

  const handleNext = () => {
    if (images.length <= 1) return;
    setActiveImgIndex(prev => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setActiveImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setQuickProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/70">
          <div className="font-extrabold text-base sm:text-lg text-neutral-900">
            نظرة سريعة ومواصفات الساعة
          </div>
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition-colors text-base font-bold shrink-0 cursor-pointer"
            type="button"
            onClick={() => setQuickProduct(null)}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          
          {/* Media Column */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-100/70 p-4 flex items-center justify-center border border-neutral-100 overflow-hidden select-none group">
              <img
                key={activeImgIndex}
                src={images[activeImgIndex] || quickProduct.image}
                alt={quickProduct.name}
                className="w-full h-full object-contain transition-all duration-300 animate-in fade-in zoom-in-95"
              />

              {images.length > 1 && (
                <>
                  {/* Right Button (Previous in RTL) */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-md border border-neutral-200 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="الصورة السابقة"
                    title="الصورة السابقة"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>

                  {/* Left Button (Next in RTL) */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-md border border-neutral-200 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="الصورة التالية"
                    title="الصورة التالية"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  {/* Bottom Counter */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-neutral-900/80 text-white text-[11px] font-bold backdrop-blur-sm z-10">
                    {activeImgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Indicator Dots */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImgIndex(i)}
                    className={`h-1.5 transition-all duration-200 rounded-full cursor-pointer ${
                      activeImgIndex === i ? "w-5 bg-lime-500" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                    aria-label={`صورة ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-14 h-14 rounded-xl border-2 p-1 bg-white shrink-0 transition-all cursor-pointer ${
                      activeImgIndex === i ? "border-lime-500 ring-2 ring-lime-400/40 scale-105 shadow-sm" : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold px-1 rounded bg-black/60 text-white">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-semibold text-neutral-600 border-neutral-200">
                {quickProduct.cat}
              </Badge>
              {quickProduct.target_audience && (
                <Badge variant="outline" className="text-xs font-semibold text-neutral-600 border-neutral-200">
                  {quickProduct.target_audience}
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-emerald-700 text-white font-bold text-xs">
                  خصم {discount}%
                </Badge>
              )}
            </div>

            <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900 mb-1">
              {quickProduct.name}
            </h3>
            <p className="text-xs text-neutral-500 mb-3">
              {quickProduct.sub}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-2xl font-black text-neutral-900">
                {Number(quickProduct.price).toLocaleString("ar-EG")} ج.م
              </span>
              {quickProduct.old_price && (
                <s className="text-sm text-neutral-400 line-through">
                  {Number(quickProduct.old_price).toLocaleString("ar-EG")} ج.م
                </s>
              )}
            </div>

            {/* Highlights */}
            <div className="space-y-1.5 text-xs text-neutral-600 mb-6 bg-lime-50/50 p-3 rounded-xl border border-lime-200/50">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>معاينة وفحص دقيق قبل الدفع مع المندوب</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>ضمان معتمد 12-24 شهراً مع بطاقة الضمان</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>علبة تقديم فاخرة مبطنة بالمخمل مجاناً</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-auto">
              <Button
                className="w-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-11 rounded-xl text-sm shadow-md shadow-lime-400/20"
                onClick={() => {
                  setQuickProduct(null);
                  openCheckoutWithProduct(quickProduct);
                }}
              >
                شراء فوري بالدفع عند الاستلام
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full text-neutral-800 font-bold h-11 rounded-xl border-neutral-200"
                  onClick={() => addToCart(quickProduct, 1)}
                >
                  🛒 أضف للسلة
                </Button>

                <Button
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-11 rounded-xl gap-1.5"
                  onClick={() => sendDirectWhatsApp(quickProduct)}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                  </svg>
                  <span>واتساب</span>
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
