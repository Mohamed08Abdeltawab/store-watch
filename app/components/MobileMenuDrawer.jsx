"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

export default function MobileMenuDrawer() {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    totalCartCount,
    wishlist,
    isAdmin
  } = useCart();

  const pathname = usePathname();

  function closeMenu() {
    setIsMobileMenuOpen(false);
  }

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeMenu}
      />

      {/* Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-[#0d1210] text-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <Link className="flex items-center gap-2" href="/" onClick={closeMenu}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-lime-400 text-black">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </span>
            <span className="font-extrabold text-lg tracking-wider">
              BEN<span className="text-lime-400">10</span>
            </span>
          </Link>

          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors text-sm font-bold"
            type="button"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Search Trigger */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 text-xs transition-colors"
            onClick={() => {
              closeMenu();
              setIsSearchOpen(true);
            }}
          >
            <svg className="w-4 h-4 text-lime-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>ابحث عن ساعة أو ماركة...</span>
          </button>

          {/* Admin / Login Button in Mobile Drawer */}
          <div>
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl bg-lime-400 text-black text-xs font-black shadow-md shadow-lime-400/20"
              >
                <span className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>لوحة التحكم (الإدارة)</span>
                </span>
                <span className="text-[10px] bg-black text-lime-400 px-2 py-0.5 rounded-full font-bold">أدمن</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>تسجيل الدخول</span>
                </span>
                <span className="text-neutral-400 text-[11px]">دخول &larr;</span>
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">التنقل السريع</div>
            <ul className="space-y-1">
              {[
                { href: "/", label: "الرئيسية", icon: "🏠" },
                { href: "/shop", label: "كل التشكيلات (المتجر)", icon: "⌚" },
                { href: "/shop?filter=bestseller", label: "🔥 الأكثر مبيعاً", icon: "" },
                { href: "/shop?audience=men", label: "ساعات رجالية", icon: "👔" },
                { href: "/shop?audience=women", label: "ساعات نسائية", icon: "✨" },
                { href: "/shop?category=classic", label: "كلاسيكية فاخرة", icon: "👑" },
                { href: "/shop?category=chrono", label: "كرونوغراف ورياضية", icon: "⏱️" },
                { href: "/shop?category=smart", label: "ساعات ذكية", icon: "⚡" },
                { href: "/shop?category=automatic", label: "أوتوماتيك ميكانيكية", icon: "⚙️" },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      pathname === item.href ? "bg-lime-400 text-black" : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cart & Wishlist Triggers */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <button
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
              onClick={() => {
                closeMenu();
                setIsWishlistOpen(true);
              }}
            >
              <span className="flex items-center gap-2">
                <span>❤️</span>
                <span>قائمة المفضلة</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-[11px]">
                {wishlist.length}
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-black text-xs font-extrabold transition-colors shadow-md shadow-lime-400/20"
              onClick={() => {
                closeMenu();
                setIsCartOpen(true);
              }}
            >
              <span className="flex items-center gap-2">
                <span>🛒</span>
                <span>سلة المشتريات</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black text-lime-400 font-black text-[11px]">
                {totalCartCount}
              </span>
            </button>
          </div>

          {/* Direct WhatsApp Contact */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">خدمة العملاء VIP</div>
            <a
              href="https://wa.me/201065712366"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
              </svg>
              <span>محادثة واتساب: 0106 571 2366</span>
            </a>
          </div>

        </div>

      </aside>
    </div>
  );
}
