"use client";

import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    totalCartCount,
    cartSubtotal,
    isFreeShipping,
    updateCartQty,
    removeFromCart,
    setIsCheckoutOpen
  } = useCart();

  return (
    <div className={`drawer drawer--cart ${isCartOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
      <div className="drawer__scrim" onClick={() => setIsCartOpen(false)}></div>
      <aside className="drawer__panel drawer__panel--left">
        <div className="drawer__head">
          <div className="drawer__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>سلة التسوق ({totalCartCount})</span>
          </div>
          <button className="drawer__close" type="button" onClick={() => setIsCartOpen(false)} aria-label="إغلاق السلة">✕</button>
        </div>

        <div className="drawer__progress">
          <div className="drawer__progress-text">
            {isFreeShipping
              ? "🎉 مبروك! طلبك مؤهل لشحن مجاني بالكامل لكافة المحافظات"
              : `متبقي ${(5000 - cartSubtotal).toLocaleString("ar-EG")} ج.م على الشحن المجاني`}
          </div>
          <div className="drawer__progress-bar">
            <div
              className="drawer__progress-fill"
              style={{ width: `${Math.min(100, (cartSubtotal / 5000) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="drawer__body">
          {cart.length === 0 ? (
            <div className="drawer__empty">
              <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>🛒</div>
              <h3>سلتك فارغة حالياً</h3>
              <p>تصفح كتالوج ساعات Ben10 الفاخرة واختر ساعتك المفضلة</p>
              <a
                href="/shop"
                className="btn btn--green"
                style={{ marginTop: "1rem", display: "inline-block" }}
                onClick={() => setIsCartOpen(false)}
              >
                تصفح تشكيلات الساعات
              </a>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <img className="cart-item__img" src={item.image} alt={item.name} />
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <div className="cart-item__price">{Number(item.price).toLocaleString("ar-EG")} ج.م</div>
                  <div className="cart-item__controls">
                    <div className="qty-stepper">
                      <button type="button" className="qty-btn" onClick={() => updateCartQty(idx, -1)} aria-label="إنقاص">-</button>
                      <span className="qty-val">{item.qty}</span>
                      <button type="button" className="qty-btn" onClick={() => updateCartQty(idx, 1)} aria-label="زيادة">+</button>
                    </div>
                    <button type="button" className="cart-item__del" onClick={() => removeFromCart(idx)}>حذف</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__subtotal">
              <span>إجمالي الساعات:</span>
              <b>{cartSubtotal.toLocaleString("ar-EG")} ج.م</b>
            </div>
            <button
              type="button"
              className="btn btn--green"
              style={{ width: "100%" }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              متابعة تأكيد الطلب الفوري (معاينة قبل الدفع)
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
