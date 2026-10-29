"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const {
    totalCartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsMobileMenuOpen
  } = useCart();

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0d1210]/95 backdrop-blur-md text-white shadow-lg transition-all" id="siteHeader">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 h-16 sm:h-20">
          
          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="فتح القائمة الرئيسية"
            title="القائمة الرئيسية والأقسام"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Brand Logo */}
          <Link className="flex items-center gap-2.5 group" href="/">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-lime-400 text-black shadow-md shadow-lime-400/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider leading-none">
                BEN<span className="text-lime-400">10</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                LUXURY & CHRONO
              </span>
            </span>
          </Link>

          {/* Search Input Trigger */}
          <button
            type="button"
            className="flex-1 max-w-lg hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/40 text-right"
            onClick={() => setIsSearchOpen(true)}
            title="بحث عن ساعة"
          >
            <svg className="w-4 h-4 text-lime-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="truncate">ابحث عن ساعة، كرونوغراف، أوتوماتيك، ذكية...</span>
          </button>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search button icon on small mobile */}
            <button
              type="button"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-lime-400 transition-colors"
              onClick={() => setIsSearchOpen(true)}
              aria-label="بحث"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Direct WhatsApp Contact Button */}
            <a
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
              href="https://wa.me/201065712366?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B3%D8%A7%D8%B9%D8%A7%D8%AA%20Ben10"
              target="_blank"
              rel="noopener noreferrer"
              title="تواصل مباشر عبر واتساب"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
              </svg>
              <span className="hidden xs:inline">واتساب VIP</span>
            </a>

            {/* Desktop Cart & Wishlist Trigger */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlistOpen(true)}
                className="rounded-full bg-white/5 border-white/10 hover:bg-white/15 text-white gap-1.5 h-9"
              >
                <span>❤️</span>
                <span className="hidden lg:inline text-xs">المفضلة</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">{wishlist.length}</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="rounded-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold gap-1.5 h-9 shadow-md shadow-lime-400/20"
              >
                <span>🛒</span>
                <span className="text-xs">السلة</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-black text-lime-400 font-bold">{totalCartCount}</span>
              </Button>
            </div>

          </div>
        </div>

        {/* Desktop-Only Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between gap-1 py-2.5 text-xs font-semibold text-neutral-300 border-t border-white/10 overflow-x-auto no-scrollbar" aria-label="أقسام المتجر والتنقل">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === "/" ? "bg-white/15 text-lime-400 font-bold" : "hover:text-white hover:bg-white/5"}`}
            >
              الرئيسية
            </Link>
            <Link
              href="/shop"
              className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === "/shop" ? "bg-white/15 text-lime-400 font-bold" : "hover:text-white hover:bg-white/5"}`}
            >
              كل التشكيلات
            </Link>
            <Link
              href="/shop?filter=bestseller"
              className="px-3 py-1.5 rounded-lg text-amber-300 hover:bg-amber-400/10 transition-colors font-bold flex items-center gap-1"
            >
              🔥 الأكثر مبيعاً
            </Link>
            <Link href="/shop?audience=men" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              ساعات رجالية
            </Link>
            <Link href="/shop?audience=women" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              ساعات نسائية
            </Link>
            <Link href="/shop?category=classic" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              كلاسيكية
            </Link>
            <Link href="/shop?category=chrono" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              كرونوغراف
            </Link>
            <Link href="/shop?category=smart" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              ذكية
            </Link>
            <Link href="/shop?category=automatic" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              أوتوماتيك
            </Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href="/#guarantees" className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors">
              لماذا Ben10؟
            </a>
            <a href="/#contact" className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors">
              خدمة العملاء
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
