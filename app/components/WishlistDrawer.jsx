"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

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

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  function addAllToCart() {
    favoriteProducts.forEach(p => {
      addToCart(p, 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  }

  return (
    <div className={`drawer ${isWishlistOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
      <div className="drawer__scrim" onClick={() => setIsWishlistOpen(false)}></div>
      <aside className="drawer__panel">
        <div className="drawer__head">
          <div className="drawer__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>قائمة المفضلة ({favoriteProducts.length})</span>
          </div>
          <button className="drawer__close" type="button" onClick={() => setIsWishlistOpen(false)} aria-label="إغلاق المفضلة">✕</button>
        </div>

        <div className="drawer__body">
          {favoriteProducts.length === 0 ? (
            <div className="drawer__empty">
              <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>❤️</div>
              <h3>قائمة المفضلة فارغة حالياً</h3>
              <p>اضغط على أيقونة القلب على أي ساعة لإضافتها وحفظها هنا للرجوع إليها</p>
              <button
                type="button"
                className="btn btn--green"
                style={{ marginTop: "1rem" }}
                onClick={() => setIsWishlistOpen(false)}
              >
                تصفح تشكيلات الساعات
              </button>
            </div>
          ) : (
            favoriteProducts.map((p) => {
              const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0;
              return (
                <div className="cart-item" key={p.id}>
                  <Link href={`/product/${p.id}`} onClick={() => setIsWishlistOpen(false)}>
                    <img className="cart-item__img" src={p.image} alt={p.name} />
                  </Link>
                  <div className="cart-item__info">
                    <Link
                      href={`/product/${p.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h4 className="cart-item__name">{p.name}</h4>
                    </Link>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <div className="cart-item__price">{Number(p.price).toLocaleString("ar-EG")} ج.م</div>
                      {p.old_price && <s style={{ fontSize: "0.76rem", color: "var(--muted)" }}>{Number(p.old_price).toLocaleString("ar-EG")} ج.م</s>}
                      {discount > 0 && <span style={{ fontSize: "0.7rem", color: "#166534", fontWeight: "700" }}>خصم {discount}%</span>}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        type="button"
                        className="btn btn--green"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", borderRadius: "8px" }}
                        onClick={() => {
                          addToCart(p, 1);
                        }}
                      >
                        + أضف للسلة
                      </button>

                      <button
                        type="button"
                        onClick={() => sendDirectWhatsApp(p)}
                        style={{
                          background: "#25D366",
                          color: "#fff",
                          border: 0,
                          borderRadius: "8px",
                          padding: "0.35rem 0.6rem",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        title="طلب عبر واتساب"
                      >
                        واتساب
                      </button>

                      <button
                        type="button"
                        className="cart-item__del"
                        style={{ marginInlineStart: "auto" }}
                        onClick={() => toggleWishlist(p.id)}
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {favoriteProducts.length > 0 && (
          <div className="drawer__foot">
            <button
              type="button"
              className="btn btn--green"
              style={{ width: "100%", marginBottom: "0.5rem" }}
              onClick={addAllToCart}
            >
              إضافة كل الساعات المفضلة إلى السلة ({favoriteProducts.length})
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              style={{ width: "100%", color: "var(--ink)", borderColor: "var(--line-strong)" }}
              onClick={() => setIsWishlistOpen(false)}
            >
              متابعة التصفح
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
