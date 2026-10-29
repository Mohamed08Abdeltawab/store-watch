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

  const images = (quickProduct.images && quickProduct.images.length > 0)
    ? quickProduct.images
    : (quickProduct.image ? [quickProduct.image] : ["/img/ben10-classic-concept-01.png"]);

  const discount = quickProduct.old_price
    ? Math.round(((quickProduct.old_price - quickProduct.price) / quickProduct.old_price) * 100)
    : 0;

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
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition-colors text-sm font-bold"
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
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-100/70 p-4 flex items-center justify-center border border-neutral-100 overflow-hidden">
              <img
                src={images[activeImgIndex] || quickProduct.image}
                alt={quickProduct.name}
                className="w-full h-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImgIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs backdrop-blur-sm transition-transform active:scale-95"
                    aria-label="السابق"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImgIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs backdrop-blur-sm transition-transform active:scale-95"
                    aria-label="التالي"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImgIndex(i)}
                    className={`w-14 h-14 rounded-xl border-2 p-1 bg-neutral-50 shrink-0 transition-all ${
                      activeImgIndex === i ? "border-lime-500 scale-105" : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
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
                  className="w-full text-neutral-800 font-bold h-10 rounded-xl border-neutral-200"
                  onClick={() => addToCart(quickProduct, 1)}
                >
                  🛒 أضف للسلة
                </Button>

                <Button
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-10 rounded-xl gap-1.5"
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
