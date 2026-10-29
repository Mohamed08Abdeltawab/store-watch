"use client";

import Link from "next/link";

export default function CollectionCTA() {
  return (
    <section className="section collection-cta-section" id="collections-banner">
      <div className="container">
        <div className="collection-cta-box">
          <div className="collection-cta-box__glow"></div>
          <div className="collection-cta-box__content">
            <span className="collection-cta-box__badge">تشكيلات Ben10 الحصرية 2026</span>
            <h2 className="collection-cta-box__title">
              جاهز لاكتشاف ساعتك القادمة؟<br />
              <span>تصفح كل التشكيلات والموديلات في مكان واحد</span>
            </h2>
            <p className="collection-cta-box__desc">
              سواء كنت تبحث عن فخامة الكلاسيك، أو دقة الكرونوغراف والسرعة، أو الساعات الذكية المتطورة.. ستجد ساعتك المثالية بضمان معتمد 100% وإمكانية الفحص الكامل قبل الدفع.
            </p>

            <div className="collection-cta-box__features">
              <div className="cta-feat">
                <span className="cta-feat__icon">✓</span>
                <span>أكثر من 20 موديلاً حصرياً</span>
              </div>
              <div className="cta-feat">
                <span className="cta-feat__icon">✓</span>
                <span>فحص ومعاينة مع المندوب</span>
              </div>
              <div className="cta-feat">
                <span className="cta-feat__icon">✓</span>
                <span>ضمان استبدال معتمد 12-24 شهر</span>
              </div>
              <div className="cta-feat">
                <span className="cta-feat__icon">✓</span>
                <span>شحن سريع لجميع المحافظات</span>
              </div>
            </div>

            <div className="collection-cta-box__actions">
              <Link href="/shop" className="btn btn--green">
                <span>تصفح كل التشكيلات الآن</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
              <Link href="/shop?filter=bestseller" className="btn btn--ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}>
                <span>استكشف الأكثر مبيعاً 🔥</span>
              </Link>
            </div>
          </div>

          <div className="collection-cta-box__visual">
            <img src="/img/ben10-classic-concept-01.png" alt="تشكيلة ساعات Ben10" />
          </div>
        </div>
      </div>
    </section>
  );
}
