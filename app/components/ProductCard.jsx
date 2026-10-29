"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    setQuickProduct,
    sendDirectWhatsApp
  } = useCart();

  if (!product) return null;

  const isFav = wishlist.includes(product.id);
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-lime-400/60">
      
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100/70 p-4 flex items-center justify-center">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge_text && (
            <Badge className="bg-lime-400 text-black font-extrabold text-[11px] hover:bg-lime-400 px-2.5 py-0.5 shadow-sm border-0">
              {product.badge_text}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-700 px-2 py-0.5 shadow-sm border-0">
              خصم {discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`absolute top-3 left-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 ${
            isFav ? "text-rose-500" : "text-neutral-400 hover:text-neutral-700"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Quick View Hover Bar */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full bg-black/80 hover:bg-black text-white text-xs font-semibold rounded-xl backdrop-blur-md shadow-md gap-1.5 h-9"
            onClick={(e) => {
              e.preventDefault();
              setQuickProduct(product);
            }}
          >
            <svg className="w-4 h-4 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>نظرة سريعة</span>
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Meta & Rating */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
          <span className="font-medium truncate max-w-[65%]">
            {product.cat} {product.target_audience ? `· ${product.target_audience}` : ""}
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-500 shrink-0">
            ★ {product.rating} <span className="text-neutral-400 text-[10px] font-normal">({product.reviews})</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
          {product.sub}
        </p>

        {/* Price & Actions Foot */}
        <div className="mt-auto pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          {/* Prices */}
          <div className="flex flex-col">
            {product.old_price && (
              <s className="text-[11px] text-neutral-400 line-through">
                {Number(product.old_price).toLocaleString("ar-EG")} ج.م
              </s>
            )}
            <div className="flex items-baseline gap-1 text-base sm:text-lg font-extrabold text-neutral-900">
              <span>{Number(product.price).toLocaleString("ar-EG")}</span>
              <span className="text-xs font-bold text-neutral-500">ج.م</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Quick WhatsApp order button */}
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-transform active:scale-95 shadow-sm"
              title="طلب مباشر عبر واتساب"
              onClick={() => sendDirectWhatsApp(product)}
              aria-label="طلب عبر واتساب"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
              </svg>
            </button>

            {/* Add to Cart button */}
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-lime-400 hover:bg-lime-500 text-black font-extrabold transition-all active:scale-95 shadow-sm shadow-lime-400/30"
              aria-label="إضافة إلى السلة"
              title="إضافة إلى السلة"
              onClick={() => addToCart(product, 1)}
            >
              <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}
