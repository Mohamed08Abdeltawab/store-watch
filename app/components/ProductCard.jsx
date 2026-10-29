"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

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
    <article className="p-card">
      <div className="p-card__frame">
        <Link href={`/product/${product.id}`} style={{ display: "block", height: "100%" }}>
          <img className="p-card__img" src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Badges */}
        <div className="p-card__badges">
          {product.badge_text && <span className="badge badge--best">{product.badge_text}</span>}
          {discount > 0 && <span className="badge badge--sale">خصم {discount}%</span>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`p-card__fav ${isFav ? "is-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Quick View Hover Bar */}
        <div className="p-card__hover-bar">
          <button
            type="button"
            className="p-card__btn-quick"
            onClick={(e) => {
              e.preventDefault();
              setQuickProduct(product);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>نظرة سريعة</span>
          </button>
        </div>
      </div>

      <div className="p-card__body">
        <div className="p-card__meta">
          <span>{product.cat} {product.target_audience ? `· ${product.target_audience}` : ""}</span>
          <span className="p-card__rating">
            ★ <b>{product.rating}</b> <small style={{ color: "var(--muted)" }}>({product.reviews})</small>
          </span>
        </div>

        <h3 className="p-card__title">
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        <p className="p-card__sub">{product.sub}</p>

        <div className="p-card__foot">
          <div className="price">
            {product.old_price && <s>{Number(product.old_price).toLocaleString("ar-EG")} ج.م</s>}
            <div className="price__now">
              <b>{Number(product.price).toLocaleString("ar-EG")}</b>
              <span>ج.م</span>
            </div>
          </div>

          <div className="p-card__actions">
            {/* Quick WhatsApp order button */}
            <button
              type="button"
              className="p-card__add-btn"
              style={{ background: "#25D366", color: "#fff", borderColor: "#22bf5b" }}
              title="طلب مباشر عبر واتساب"
              onClick={() => sendDirectWhatsApp(product)}
              aria-label="طلب عبر واتساب"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
              </svg>
            </button>

            {/* Add to Cart button */}
            <button
              type="button"
              className="p-card__add-btn"
              aria-label="إضافة إلى السلة"
              title="إضافة إلى السلة"
              onClick={() => addToCart(product, 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
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
