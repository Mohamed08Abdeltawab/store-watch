"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function MobileMenuDrawer() {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    totalCartCount,
    wishlist
  } = useCart();

  const pathname = usePathname();

  function closeMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className={`drawer drawer--menu ${isMobileMenuOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
      <div className="drawer__scrim" onClick={closeMenu}></div>
      <aside className="drawer__panel drawer__panel--right">
        {/* Drawer Header */}
        <div className="drawer__head">
          <Link className="brand" href="/" onClick={closeMenu}>
            <span className="brand__mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </span>
            <span className="brand__text">
              <span className="brand__name">BEN<span>10</span></span>
              <span className="brand__sub">LUXURY & CHRONO</span>
            </span>
          </Link>
          <button className="drawer__close" type="button" onClick={closeMenu} aria-label="إغلاق القائمة">✕</button>
        </div>

        {/* Drawer Body */}
        <div className="drawer__body" style={{ padding: "1.2rem" }}>
          {/* Quick Search Button */}
          <button
            type="button"
            className="mobile-menu-search"
            onClick={() => {
              closeMenu();
              setIsSearchOpen(true);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>ابحث عن ساعة أو ماركة...</span>
          </button>

          {/* Main Links */}
          <div className="mobile-menu-section">
            <div className="mobile-menu-section__title">التنقل السريع</div>
            <ul className="mobile-menu-list">
              <li>
                <Link
                  href="/"
                  className={`mobile-menu-link ${pathname === "/" ? "is-active" : ""}`}
                  onClick={closeMenu}
                >
                  <span className="menu-icon">🏠</span>
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className={`mobile-menu-link ${pathname === "/shop" ? "is-active" : ""}`}
                  onClick={closeMenu}
                >
                  <span className="menu-icon">⌚</span>
                  <span>كل التشكيلات (المتجر)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=bestseller"
                  className="mobile-menu-link is-hot"
                  onClick={closeMenu}
                >
                  <span className="menu-icon">🔥</span>
                  <span>الأكثر مبيعاً</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?audience=men"
                  className="mobile-menu-link"
                  onClick={closeMenu}
                >
                  <span className="menu-icon">👔</span>
                  <span>ساعات رجالية</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?audience=women"
                  className="mobile-menu-link"
                  onClick={closeMenu}
                >
                  <span className="menu-icon">👗</span>
                  <span>ساعات نسائية</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Watch Types */}
          <div className="mobile-menu-section">
            <div className="mobile-menu-section__title">أنواع وتصنيفات الساعات</div>
            <ul className="mobile-menu-list">
              <li>
                <Link href="/shop?category=classic" className="mobile-menu-link" onClick={closeMenu}>
                  <span>ساعات عادية (كلاسيكية)</span>
                  <small style={{ color: "var(--muted)" }}>رويال وهيريتدج</small>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chrono" className="mobile-menu-link" onClick={closeMenu}>
                  <span>كرونوغراف (Chronograph)</span>
                  <small style={{ color: "var(--muted)" }}>سبيد وتيتانيوم</small>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=smart" className="mobile-menu-link" onClick={closeMenu}>
                  <span>ذكية (Smartwatch)</span>
                  <small style={{ color: "var(--muted)" }}>AMOLED ومكالمات</small>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=digital" className="mobile-menu-link" onClick={closeMenu}>
                  <span>رقمية (Digital)</span>
                  <small style={{ color: "var(--muted)" }}>عملية ورياضية</small>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=automatic" className="mobile-menu-link" onClick={closeMenu}>
                  <span>أوتوماتيك وسكيلتون</span>
                  <small style={{ color: "var(--muted)" }}>ميكانيكية ذاتية</small>
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="mobile-menu-section">
            <div className="mobile-menu-section__title">الدعم والخدمات</div>
            <ul className="mobile-menu-list">
              <li>
                <a href="/#guarantees" className="mobile-menu-link" onClick={closeMenu}>
                  <span className="menu-icon">🛡️</span>
                  <span>شروط الضمان والمعاينة قبل الدفع</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/201065712366?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B3%D8%A7%D8%B9%D8%A7%D8%AA%20Ben10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-menu-link"
                  onClick={closeMenu}
                  style={{ color: "#25D366", fontWeight: "700" }}
                >
                  <span className="menu-icon">💬</span>
                  <span>المحادثة المباشرة على واتساب</span>
                </a>
              </li>
              <li>
                <a href="tel:+201065712366" className="mobile-menu-link" onClick={closeMenu}>
                  <span className="menu-icon">📞</span>
                  <span>اتصال: 0106 571 2366</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="mobile-menu-link" onClick={closeMenu} style={{ color: "var(--ben10-green)" }}>
                  <span className="menu-icon">⚙️</span>
                  <span>لوحة تحكم الإدارة (الأدمن)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Drawer Foot */}
        <div className="drawer__foot" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ color: "var(--ink)", borderColor: "var(--line-strong)", padding: "0.7rem 0.5rem", fontSize: "0.82rem" }}
            onClick={() => {
              closeMenu();
              setIsWishlistOpen(true);
            }}
          >
            ❤️ المفضلة ({wishlist.length})
          </button>

          <button
            type="button"
            className="btn btn--green"
            style={{ padding: "0.7rem 0.5rem", fontSize: "0.82rem" }}
            onClick={() => {
              closeMenu();
              setIsCartOpen(true);
            }}
          >
            🛒 السلة ({totalCartCount})
          </button>
        </div>
      </aside>
    </div>
  );
}
