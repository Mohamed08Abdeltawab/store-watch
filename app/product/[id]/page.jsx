"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCart, GOVERNORATES } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";

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
      <div style={{ textAlign: "center", padding: "8rem 1rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⌚</div>
        <h3>جاري تحميل مواصفات الساعة الفاخرة...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 1rem" }}>
        <h2>الساعة غير موجودة أو تم حذفها</h2>
        <p style={{ color: "var(--muted)", margin: "1rem 0 2rem" }}>قد يكون الرابط خاطئاً أو تم تعديل كود الساعة</p>
        <Link href="/shop" className="btn btn--green">
          العودة لكتالوج الساعات
        </Link>
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
    <div className="product-page">
      {/* Breadcrumbs */}
      <div className="container" style={{ paddingTop: "1.5rem" }}>
        <nav className="breadcrumbs" aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop">المتجر</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.cat)}`}>{product.cat}</Link>
          <span>/</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="product-detail-grid">
            {/* Gallery Column */}
            <div className="product-gallery">
              <div className="product-gallery__main">
                <img
                  src={images[activeImgIndex] || product.image}
                  alt={product.name}
                  className="product-gallery__img"
                />

                {/* Badges */}
                <div className="p-card__badges" style={{ top: "16px", right: "16px" }}>
                  {product.badge_text && <span className="badge badge--best">{product.badge_text}</span>}
                  {discount > 0 && <span className="badge badge--sale">خصم {discount}%</span>}
                </div>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  className={`p-card__fav ${isFav ? "is-active" : ""}`}
                  style={{ top: "16px", left: "16px", width: "42px", height: "42px" }}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="المفضلة"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* Arrow navigation if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="gallery-nav gallery-nav--prev"
                      onClick={() => setActiveImgIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                      aria-label="السابق"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      className="gallery-nav gallery-nav--next"
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
                <div className="product-gallery__thumbs">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gallery-thumb ${activeImgIndex === idx ? "is-active" : ""}`}
                      onClick={() => setActiveImgIndex(idx)}
                    >
                      <img src={imgUrl} alt={`صورة مصغرة ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information & Purchase Column */}
            <div className="product-info-panel">
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.6rem" }}>
                <span className="badge badge--best">{product.cat}</span>
                {product.target_audience && (
                  <span className="badge" style={{ background: "rgba(0,0,0,0.06)", color: "var(--ink)" }}>
                    {product.target_audience}
                  </span>
                )}
                <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: "700" }}>● متوفرة بالمخزن</span>
              </div>

              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__sub">{product.sub}</p>

              {/* Rating & Social proof */}
              <div className="product-detail__rating">
                <span className="stars">★★★★★</span>
                <b>{product.rating} / 5.0</b>
                <span style={{ color: "var(--muted)" }}>({product.reviews} تقييم موثق من المشترين)</span>
              </div>

              {/* Price Box */}
              <div className="product-detail__price-box">
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem" }}>
                  <div className="price-main">
                    <b>{Number(product.price).toLocaleString("ar-EG")}</b>
                    <span>ج.م</span>
                  </div>
                  {product.old_price && (
                    <s className="price-old">{Number(product.old_price).toLocaleString("ar-EG")} ج.م</s>
                  )}
                </div>
                {discount > 0 && (
                  <div style={{ fontSize: "0.82rem", color: "#166534", fontWeight: "700", marginTop: "4px" }}>
                    🎉 وفرت اليوم {(product.old_price - product.price).toLocaleString("ar-EG")} ج.م مع علبة هدايا جلدية فاخرة مجاناً!
                  </div>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="product-detail__trust-box">
                <div className="trust-item">
                  <span className="trust-item__icon">🔍</span>
                  <div>
                    <strong>فحص ومعاينة قبل الدفع:</strong>
                    <small>افتح العلبة وافحص الساعة وتأكد من جودتها أمام المندوب قبل دفع قرش واحد.</small>
                  </div>
                </div>
                <div className="trust-item">
                  <span className="trust-item__icon">🛡️</span>
                  <div>
                    <strong>ضمان الوكيل المعتمد:</strong>
                    <small>{product.warranty || "ضمان 12 شهراً استبدال فوري ضد عيوب الصناعة مع بطاقة مختومة."}</small>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-detail__actions">
                <button
                  type="button"
                  className="btn btn--green"
                  style={{ width: "100%", padding: "1rem" }}
                  onClick={() => addToCart(product, 1)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>أضف إلى السلة للمتابعة</span>
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                  <button
                    type="button"
                    className="btn-wa-action"
                    onClick={() => sendDirectWhatsApp(product)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                    </svg>
                    <span>طلب مباشر عبر واتساب</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ color: "var(--ink)", borderColor: "var(--line-strong)", fontWeight: "700" }}
                    onClick={() => openCheckoutWithProduct(product)}
                  >
                    <span>شراء سريع فوري</span>
                  </button>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="shipping-calc-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>🚚 مصاريف ومواعيد الشحن لمحافظتك:</span>
                  <select
                    className="sort-select"
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
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                  الشحن إلى <strong>{selectedGov.name}</strong> يستغرق <strong>{selectedGov.days}</strong> وقيمته <strong>{selectedGov.shipping} ج.م</strong> (أو مجاني للطلبات فوق 5,000 ج.م).
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="specs-section">
            <h2 className="specs-section__title">المواصفات التقنية الكاملة</h2>
            <div className="specs-table-grid">
              <div className="spec-item">
                <span className="spec-label">نوع الساعة والتصنيف:</span>
                <span className="spec-value">{product.cat} {product.target_audience ? `(${product.target_audience})` : ""}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ماكينة الساعة (الحركة):</span>
                <span className="spec-value">{product.movement || "كوارتز ياباني فائق الدقة (Original Movement)"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">نوع الزجاج:</span>
                <span className="spec-value">{product.glass || "سافاير كريستال ياقوتي مضاد للخدش مع طبقة مانعة للانعكاس"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">مادة الهيكل الخارجي:</span>
                <span className="spec-value">{product.case_material || "فولاذ صلب ستانلس ستيل 316L مقاوم للصدأ والتحسس"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">قطر وسمك الساعة:</span>
                <span className="spec-value">{product.diameter || "42 ملم تصميم مريح لجميع أحجام المعصم"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">مقاومة الماء:</span>
                <span className="spec-value">{product.water_resist || "5 ATM (50 متر) - مقاومة كاملة للماء والأنشطة اليومية"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">نوع الحزام (السوار):</span>
                <span className="spec-value">{product.strap || "سوار ستانلس ستيل متين مع قفل أمان مزدوج"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">مدة الضمان المعتمد:</span>
                <span className="spec-value">{product.warranty || "ضمان 12 شهراً استبدال فوري"}</span>
              </div>
            </div>

            {/* Full Detailed Description */}
            {(product.description || product.overview) && (
              <div className="product-full-desc">
                <h3>نظرة عامة على الساعة</h3>
                <p>{product.description || product.overview}</p>
              </div>
            )}
          </div>

          {/* Related Watches */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: "4rem" }}>
              <div className="section-head-flex">
                <div>
                  <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>تشكيلات قد تعجبك</div>
                  <h2 className="section-title">ساعات <span>مشابهة</span> من نفس الفئة</h2>
                </div>
                <Link href="/shop" className="btn-view-more">
                  <span>تصفح كل التشكيلات</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </Link>
              </div>
              <div className="p-grid">
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
