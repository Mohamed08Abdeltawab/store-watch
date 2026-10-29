"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { wishlist, products } = useCart();

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="wishlist-page">
      <section className="shop-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="مسار التنقل">
            <Link href="/">الرئيسية</Link>
            <span>/</span>
            <span>قائمة المفضلة ❤️</span>
          </nav>

          <h1 className="shop-hero__title">
            قائمة أمنياتك <span>والمفضلة</span>
          </h1>
          <p className="shop-hero__desc">
            الساعات التي قمت بحفظها للرجوع إليها لاحقاً. يمكنك نقلها إلى سلة الشراء أو طلبها مباشرة عبر واتساب بضمان المعاينة قبل الدفع.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {favoriteProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 1rem", background: "var(--cream)", borderRadius: "20px" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>❤️</div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.6rem" }}>
                قائمة المفضلة فارغة حالياً
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto 1.8rem", lineHeight: "1.8" }}>
                لم تقم بحفظ أي ساعة حتى الآن. تصفح تشكيلات Ben10 الفاخرة واضغط على أيقونة القلب لحفظ ساعتك المفضلة هنا.
              </p>
              <Link href="/shop" className="btn btn--green">
                <span>تصفح تشكيلات الساعات الآن</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                  لديك <strong style={{ color: "var(--ben10-forest)" }}>{favoriteProducts.length}</strong> ساعة في قائمة أمنياتك
                </div>
                <Link href="/shop" className="btn btn--ghost" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem" }}>
                  + إضافة المزيد من الساعات
                </Link>
              </div>

              <div className="p-grid">
                {favoriteProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
