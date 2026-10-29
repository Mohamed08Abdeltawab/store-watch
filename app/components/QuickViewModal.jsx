"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

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

  return (
    <div className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal__scrim" onClick={() => setQuickProduct(null)}></div>
      <div className="modal__panel" style={{ width: "min(760px, 100%)" }}>
        <div className="modal__head">
          <div className="modal__title">نظرة سريعة ومواصفات الساعة</div>
          <button className="modal__close" type="button" onClick={() => setQuickProduct(null)} aria-label="إغلاق">✕</button>
        </div>

        <div className="quick-view-grid">
          {/* Media / Gallery */}
          <div className="quick-view-media" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                minHeight: "260px",
                padding: "12px"
              }}
            >
              <img
                src={images[activeImgIndex] || quickProduct.image}
                alt={quickProduct.name}
                style={{ maxHeight: "260px", maxWidth: "100%", objectFit: "contain", transition: "all 0.2s ease" }}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImgIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    style={{
                      position: "absolute",
                      left: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      border: 0,
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.85rem",
                      zIndex: 3
                    }}
                    aria-label="السابق"
                  >
                    ◀
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImgIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      border: 0,
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.85rem",
                      zIndex: 3
                    }}
                    aria-label="التالي"
                  >
                    ▶
                  </button>

                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.75)",
                      color: "#A3E635",
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      padding: "2px 8px",
                      borderRadius: "999px"
                    }}
                  >
                    {activeImgIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {images.slice(0, 10).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      flexShrink: 0,
                      width: "50px",
                      height: "50px",
                      background: "#fff",
                      border: activeImgIndex === idx ? "2px solid #A3E635" : "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      padding: "2px",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: activeImgIndex === idx ? "0 0 10px rgba(163,230,53,0.3)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <img src={imgUrl} alt={`صورة ${idx + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="quick-view-details">
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "0.4rem" }}>
              <span className="badge badge--best">{quickProduct.cat}</span>
              {quickProduct.badge_text && <span className="badge badge--sale">{quickProduct.badge_text}</span>}
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.4rem", color: "var(--ink)" }}>
              {quickProduct.name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.8rem" }}>
              {quickProduct.sub}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "1rem" }}>
              {quickProduct.old_price && (
                <s style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                  {Number(quickProduct.old_price).toLocaleString("ar-EG")} ج.م
                </s>
              )}
              <span style={{ fontSize: "1.45rem", fontWeight: "800", color: "#101211" }}>
                {Number(quickProduct.price).toLocaleString("ar-EG")} <small style={{ fontSize: "0.85rem", color: "var(--ben10-forest)" }}>ج.م</small>
              </span>
            </div>

            <ul className="specs-list">
              <li><span>نوع الساعة:</span> <b>{quickProduct.cat}</b></li>
              {quickProduct.target_audience && <li><span>الفئة:</span> <b>{quickProduct.target_audience}</b></li>}
              {quickProduct.movement && <li><span>الماكينة:</span> <b>{quickProduct.movement}</b></li>}
              {quickProduct.glass && <li><span>الزجاج:</span> <b>{quickProduct.glass}</b></li>}
              <li><span>الضمان:</span> <b>{quickProduct.warranty || "ضمان 12 شهر استبدال فوري"}</b></li>
            </ul>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1.2rem" }}>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  type="button"
                  className="btn btn--green"
                  style={{ flex: 1 }}
                  onClick={() => {
                    addToCart(quickProduct, 1);
                    setQuickProduct(null);
                  }}
                >
                  أضف إلى السلة
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ color: "var(--ink)", borderColor: "var(--line-strong)" }}
                  onClick={() => {
                    openCheckoutWithProduct(quickProduct);
                    setQuickProduct(null);
                  }}
                >
                  طلب فوري الآن
                </button>
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  type="button"
                  onClick={() => sendDirectWhatsApp(quickProduct)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "#25D366",
                    color: "#fff",
                    border: 0,
                    borderRadius: "10px",
                    padding: "0.65rem 1rem",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <span>طلب عبر واتساب</span>
                </button>
                <a
                  href={`/product/${quickProduct.id}`}
                  style={{
                    padding: "0.65rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.05)",
                    color: "var(--ink)",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    textDecoration: "none",
                    textAlign: "center"
                  }}
                  onClick={() => setQuickProduct(null)}
                >
                  عرض صفحة التفاصيل الكاملة ←
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
