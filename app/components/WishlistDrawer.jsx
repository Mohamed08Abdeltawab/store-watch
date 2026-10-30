"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

export default function WishlistDrawer() {
  const {
    products,
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    setIsCartOpen,
    sendDirectWhatsApp
  } = useCart();

  if (!isWishlistOpen) return null;

  // Filter and deduplicate favorite products by ID
  const favoriteProducts = products
    .filter(p => wishlist.includes(p.id))
    .filter((p, index, self) => index === self.findIndex(t => t.id === p.id));

  function addAllToCart() {
    favoriteProducts.forEach(p => {
      addToCart(p, 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel (slides from right in RTL) */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2 font-extrabold text-base sm:text-lg text-neutral-900">
            <svg className="w-5 h-5 text-rose-500 fill-rose-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>قائمة المفضلة ({favoriteProducts.length})</span>
          </div>
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition-colors text-base font-bold shrink-0 cursor-pointer"
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="إغلاق المفضلة"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
              <div className="text-5xl mb-3">❤️</div>
              <h3 className="font-bold text-lg text-neutral-900 mb-1">قائمة المفضلة فارغة حالياً</h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mb-5">
                اضغط على أيقونة القلب على أي ساعة لإضافتها وحفظها هنا للرجوع إليها
              </p>
              <Button
                className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold rounded-full px-6 shadow-md shadow-lime-400/20"
                onClick={() => setIsWishlistOpen(false)}
              >
                تصفح تشكيلات الساعات
              </Button>
            </div>
          ) : (
            favoriteProducts.map((p) => {
              const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-white hover:border-neutral-200 transition-colors shadow-sm"
                >
                  <Link href={`/product/${p.id}`} onClick={() => setIsWishlistOpen(false)} className="shrink-0">
                    <img className="w-16 h-16 rounded-xl object-contain bg-neutral-50 p-1 border border-neutral-100" src={p.image} alt={p.name} />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${p.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="block font-bold text-xs sm:text-sm text-neutral-900 hover:text-emerald-700 truncate mb-1"
                    >
                      {p.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs font-black text-emerald-800">
                        {Number(p.price).toLocaleString("ar-EG")} ج.م
                      </span>
                      {p.old_price && (
                        <s className="text-[10px] text-neutral-400 line-through">
                          {Number(p.old_price).toLocaleString("ar-EG")} ج.م
                        </s>
                      )}
                      {discount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          خصم {discount}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold text-xs h-9 px-3 rounded-lg flex items-center"
                        onClick={() => addToCart(p, 1)}
                      >
                        + أضف للسلة
                      </Button>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold h-9 px-3 rounded-lg transition-colors cursor-pointer"
                        onClick={() => sendDirectWhatsApp(p)}
                        title="طلب عبر واتساب"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                        </svg>
                        <span>طلب</span>
                      </button>

                      <button
                        type="button"
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline p-2 min-h-[36px] flex items-center mr-auto cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                      >
                        حذف
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {favoriteProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 space-y-2">
            <Button
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-11 rounded-xl shadow-md shadow-lime-400/20"
              onClick={addAllToCart}
            >
              🛒 نقل جميع الساعات إلى سلة المشتريات
            </Button>
            <Button
              variant="outline"
              className="w-full text-neutral-700 font-semibold h-9 rounded-xl border-neutral-200"
              onClick={() => setIsWishlistOpen(false)}
            >
              متابعة التسوق
            </Button>
          </div>
        )}

      </aside>
    </div>
  );
}
