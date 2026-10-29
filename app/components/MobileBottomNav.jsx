"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function MobileBottomNav() {
  const {
    totalCartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen
  } = useCart();

  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="شريط التنقل السفلي للموبايل">
      {/* Home */}
      <Link
        href="/"
        className={`mobile-bottom-tab ${pathname === "/" ? "is-active" : ""}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>الرئيسية</span>
      </Link>

      {/* Shop / Catalog */}
      <Link
        href="/shop"
        className={`mobile-bottom-tab ${pathname.startsWith("/shop") ? "is-active" : ""}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>المتجر</span>
      </Link>

      {/* Search Trigger */}
      <button
        type="button"
        className="mobile-bottom-tab"
        onClick={() => setIsSearchOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>بحث</span>
      </button>

      {/* Wishlist Drawer Trigger (Slides from Right) */}
      <button
        type="button"
        className="mobile-bottom-tab"
        onClick={() => setIsWishlistOpen(true)}
      >
        <div style={{ position: "relative" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#ef4444" : "none"} stroke={wishlist.length > 0 ? "#ef4444" : "currentColor"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {wishlist.length > 0 && (
            <span className="bottom-tab-badge" style={{ background: "#ef4444" }}>{wishlist.length}</span>
          )}
        </div>
        <span>المفضلة</span>
      </button>

      {/* Cart Drawer Trigger (Slides from Left) */}
      <button
        type="button"
        className="mobile-bottom-tab"
        onClick={() => setIsCartOpen(true)}
      >
        <div style={{ position: "relative" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {totalCartCount > 0 && (
            <span className="bottom-tab-badge" style={{ background: "var(--ben10-green)", color: "var(--ink)" }}>{totalCartCount}</span>
          )}
        </div>
        <span>السلة</span>
      </button>
    </nav>
  );
}
