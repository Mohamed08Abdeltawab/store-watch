"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Footer() {
  const { setIsWishlistOpen } = useCart();

  return (
    <footer className="bg-[#090d0b] text-neutral-400 border-t border-white/10 pt-14 pb-24 md:pb-14" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link className="flex items-center gap-2.5 group" href="/">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-lime-400 text-black shadow-md shadow-lime-400/20 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"></circle>
                  <polyline points="12 7 12 12 15 14"></polyline>
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="font-extrabold text-2xl text-white tracking-wider leading-none">
                  BEN<span className="text-lime-400">10</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                  LUXURY & CHRONO
                </span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-neutral-400">
              علامة Ben10 الرائدة في الساعات الأصلية الفاخرة والعصرية. نحرص على تقديم أرقى التصاميم وأدق الماكينات مع أعلى معايير الأمان، الفحص والمعاينة قبل الدفع، وضمان استبدال معتمد.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              أقسام وتشكيلات
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-lime-400 transition-colors">الرئيسية</Link></li>
              <li><Link href="/shop" className="hover:text-lime-400 transition-colors">كل التشكيلات والموديلات</Link></li>
              <li><Link href="/shop?filter=bestseller" className="hover:text-lime-400 transition-colors">🔥 الأكثر مبيعاً</Link></li>
              <li><Link href="/shop?audience=men" className="hover:text-lime-400 transition-colors">ساعات رجالية</Link></li>
              <li><Link href="/shop?audience=women" className="hover:text-lime-400 transition-colors">ساعات نسائية</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsWishlistOpen(true)}
                  className="hover:text-lime-400 transition-colors text-right"
                >
                  قائمة المفضلة ❤️
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              خدمة العملاء والضمان
            </h3>
            <ul className="space-y-2 text-xs">
              <li><a href="tel:+201065712366" className="hover:text-lime-400 transition-colors">اتصل بنا: 0106 571 2366</a></li>
              <li><a href="https://wa.me/201065712366" target="_blank" rel="noopener noreferrer" className="hover:text-lime-400 transition-colors">المحادثة والمساعدة عبر واتساب</a></li>
              <li><a href="/#guarantees" className="hover:text-lime-400 transition-colors">فحص ومعاينة المنتج قبل الدفع</a></li>
              <li><a href="/#guarantees" className="hover:text-lime-400 transition-colors">سياسة الاستبدال خلال 14 يوماً</a></li>
              <li><Link href="/admin" className="hover:text-lime-400 transition-colors">لوحة تحكم الإدارة (الأدمن)</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              بيانات التواصل
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>هاتف المبيعات: 0106 571 2366</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <span>واتساب: 0106 571 2366</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>يومياً من 10:00 صباحاً حتى 11:00 مساءً</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 Ben10 Watches — جميع الحقوق محفوظة. جميع الساعات أصلية 100% والدفع بعد المعاينة والفحص.
          </div>

          <div className="flex items-center gap-3 text-neutral-400 font-bold flex-wrap">
            <span>الدفع عند الاستلام</span> · <span>إنستاباي / InstaPay</span> · <span>فودافون كاش</span> · <span>بطاقات بنكية</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
