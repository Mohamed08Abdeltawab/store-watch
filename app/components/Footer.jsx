"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer__brand">
            <Link className="brand" href="/">
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
            <p>
              علامة Ben10 الرائدة في الساعات الأصلية الفاخرة والعصرية. نحرص على تقديم أرقى التصاميم وأدق الماكينات مع أعلى معايير الأمان، الفحص والمعاينة قبل الدفع، وضمان استبدال معتمد.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3>أقسام وتشكيلات</h3>
            <ul className="footer-links">
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/shop">كل التشكيلات والموديلات</Link></li>
              <li><Link href="/shop?filter=bestseller">الأكثر مبيعاً</Link></li>
              <li><Link href="/shop?audience=men">ساعات رجالية</Link></li>
              <li><Link href="/shop?audience=women">ساعات نسائية</Link></li>
              <li><Link href="/wishlist">قائمة المفضلة ❤️</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3>خدمة العملاء والضمان</h3>
            <ul className="footer-links">
              <li><a href="tel:+201065712366">اتصل بنا: 0106 571 2366</a></li>
              <li><a href="https://wa.me/201065712366" target="_blank" rel="noopener noreferrer">المحادثة والمساعدة عبر واتساب</a></li>
              <li><a href="/#guarantees">فحص ومعاينة المنتج قبل الدفع</a></li>
              <li><a href="/#guarantees">سياسة الاستبدال خلال 14 يوماً</a></li>
              <li><Link href="/admin">لوحة تحكم الإدارة (الأدمن)</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3>بيانات التواصل</h3>
            <ul className="footer-contact">
              <li>
                <span>📍 القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية</span>
              </li>
              <li>
                <span>📞 هاتف المبيعات: 0106 571 2366</span>
              </li>
              <li>
                <span>💬 واتساب: 0106 571 2366</span>
              </li>
              <li>
                <span>⏰ المواعيد: يومياً من 10:00 صباحاً حتى 11:00 مساءً</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Ben10 Watches — جميع الحقوق محفوظة. جميع الساعات أصلية 100% والدفع بعد المعاينة والفحص.</div>
          <div style={{ display: "flex", gap: "0.6rem", color: "rgba(255,255,255,0.7)", fontWeight: "700", flexWrap: "wrap" }}>
            <span>الدفع عند الاستلام</span> · <span>إنستاباي / InstaPay</span> · <span>محافظ فودافون كاش</span> · <span>بطاقات بنكية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
