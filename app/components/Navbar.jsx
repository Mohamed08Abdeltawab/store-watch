"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const {
    totalCartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen
  } = useCart();

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="announcement" aria-label="شريط الإعلانات">
        <div className="container announcement__inner">
          <div className="announcement__group">
            <span>⌚ <strong>متجر Ben10 للساعات:</strong> معاينة وفحص الساعة بالكامل مع المندوب قبل دفع أي مليم!</span>
            <span className="announcement__dot"></span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>شحن مجاني للطلبات أكثر من 5,000 ج.م</span>
          </div>
          <div className="announcement__group">
            <Link className="announcement__link" href="/admin" style={{ color: "#A3E635", fontWeight: "700" }}>
              ⚙️ لوحة تحكم الأدمن
            </Link>
            <span className="announcement__dot"></span>
            <a className="announcement__link" href="tel:+201065712366">
              خدمة العملاء: 0106 571 2366
            </a>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className="site-header" id="siteHeader">
        <div className="container">
          <div className="header-main">
            {/* Brand Logo */}
            <Link className="brand" href="/">
              <span className="brand__mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"></circle>
                  <polyline points="12 7 12 12 15 14"></polyline>
                </svg>
              </span>
              <span className="brand__text">
                <span className="brand__name">BEN<span>10</span></span>
                <span className="brand__sub">LUXURY & CHRONO</span>
              </span>
            </Link>

            {/* Search Input Trigger */}
            <button className="simple-search-trigger" type="button" onClick={() => setIsSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>ابحث عن ساعة، كرونوغراف، أوتوماتيك، ذكية...</span>
            </button>

            {/* Header Actions */}
            <div className="header-actions">
              {/* WhatsApp VIP */}
              <a
                className="header-action header-action--wa"
                href="https://wa.me/201065712366?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B3%D8%A7%D8%B9%D8%A7%D8%AA%20Ben10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                </svg>
                <span>طلب واتساب</span>
              </a>

              {/* Wishlist Link */}
              <Link className="header-action" href="/wishlist" title="قائمة المفضلة">
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>المفضلة</span>
                {wishlist.length > 0 && (
                  <span className="header-action__count" style={{ background: "#ef4444" }}>{wishlist.length}</span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button className="header-action header-action--cart" type="button" onClick={() => setIsCartOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>السلة</span>
                {totalCartCount > 0 && (
                  <span className="header-action__count">{totalCartCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="simple-desktop-nav" aria-label="أقسام المتجر والتنقل">
            <Link href="/">الرئيسية</Link>
            <Link href="/shop">كل التشكيلات (المتجر)</Link>
            <Link href="/shop?filter=bestseller" className="is-hot">🔥 الأكثر مبيعاً</Link>
            <Link href="/shop?audience=men">ساعات رجالية</Link>
            <Link href="/shop?audience=women">ساعات نسائية</Link>
            <Link href="/wishlist">قائمة المفضلة</Link>
            <a href="/#guarantees">لماذا Ben10؟</a>
            <a href="/#contact">تواصل معنا</a>
          </nav>
        </div>
      </header>
    </>
  );
}
