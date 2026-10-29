"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import ProductCard from "./components/ProductCard";
import AudienceSection from "./components/AudienceSection";
import CollectionCTA from "./components/CollectionCTA";
import WhatsAppSection from "./components/WhatsAppSection";
import GuaranteesSection from "./components/GuaranteesSection";
import ReviewsSection from "./components/ReviewsSection";

export default function HomePage() {
  const { products, openCheckoutWithProduct } = useCart();

  // Countdown timer for today's deal
  const [timeLeft, setTimeLeft] = useState({ hours: 18, mins: 42, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let s = prev.secs - 1;
        let m = prev.mins;
        let h = prev.hours;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; }
        return { hours: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter 4 Best Sellers
  const bestSellers = products
    .filter(p => p.tag === "best" || (p.badge_text && (p.badge_text.includes("طلباً") || p.badge_text.includes("مبيعاً"))))
    .slice(0, 4);
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  // Filter 4 Top Rated / Trending
  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const displayTopRated = topRated.length > 0 ? topRated : products.slice(2, 6);

  // Deal product
  const dealProduct = products.find(p => p.id === "ben10-apex-chrono") || products[0];

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <div className="eyebrow">
              <span className="eyebrow__dot"></span>
              <span>تشكيلات الساعات الحصرية لعام 2026</span>
            </div>

            <h1 className="hero__title">
              ساعات تصنع الفرق،<br />
              <span className="accent">وفخامة تليق بمعصمك</span>
            </h1>

            <p className="hero__lead">
              استكشف عالم Ben10 للساعات الفاخرة؛ تصاميم ميكانيكية وكلاسيكية ورياضية متقنة الصنع بزجاج ياقوتي لا يخدش، مع ميزة الفحص والمعاينة الكاملة قبل الدفع وضمان استبدال معتمد.
            </p>

            <div className="hero__actions">
              <Link href="/shop" className="btn btn--green">
                <span>تصفح كل التشكيلات</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
              <a href="#deal" className="btn btn--ghost">
                <span>عروض التخفيض الحصرية 🔥</span>
              </a>
            </div>

            <div className="hero__proof">
              <div className="hero__stars">★★★★★</div>
              <div className="hero__proof-text">
                <b>4.9 / 5 تقييم العملاء</b> · أكثر من 15,000 عميل راضٍ في جميع محافظات مصر
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__ring"></div>
            <div className="float-chip float-chip--top">
              <div className="float-chip__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <b>ضمان معتمد 12-24 شهر</b>
                <small>استبدال فوري بدون تعقيد</small>
              </div>
            </div>

            <div className="hero__arch">
              <div className="hero__arch-inner">
                <img src="/img/ben10-classic-concept-01.png" alt="ساعة Ben10 رويال كلاسيك" />
              </div>
            </div>

            <div className="float-chip float-chip--bottom">
              <div className="float-chip__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <div>
                <b>شحن سريع 24-48 ساعة</b>
                <small>معاينة وفحص قبل الاستلام</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          <div className="ticker__group">
            <span className="ticker__item">فحص ومعاينة الساعة قبل الدفع للمندوب</span>
            <span className="ticker__item">ساعات أصلية 100% بضمان الوكيل المعتمد</span>
            <span className="ticker__item">تتبع الطلبات برقم مرجع فريد #B10 عبر الواتساب</span>
            <span className="ticker__item">شحن سريع لجميع محافظات مصر خلال 24 - 48 ساعة</span>
            <span className="ticker__item">علبة هدايا جلدية فاخرة مجانية مع كل ساعة</span>
          </div>
          <div className="ticker__group">
            <span className="ticker__item">فحص ومعاينة الساعة قبل الدفع للمندوب</span>
            <span className="ticker__item">ساعات أصلية 100% بضمان الوكيل المعتمد</span>
            <span className="ticker__item">تتبع الطلبات برقم مرجع فريد #B10 عبر الواتساب</span>
            <span className="ticker__item">شحن سريع لجميع محافظات مصر خلال 24 - 48 ساعة</span>
            <span className="ticker__item">علبة هدايا جلدية فاخرة مجانية مع كل ساعة</span>
          </div>
        </div>
      </div>

      {/* 1. Watch Categories / Types (Bento Grid) + View More */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-head-flex">
            <div>
              <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>أنواع وفئات الساعات</div>
              <h2 className="section-title">اختر فئتك المفضلة من <span>Ben10</span></h2>
            </div>
            <Link href="/shop" className="btn-view-more">
              <span>عرض كل الأقسام</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </Link>
          </div>

          <div className="cat-grid-bento">
            <Link href="/shop?category=classic" className="cat-card-bento">
              <img src="/img/ben10-classic-concept-01.png" alt="عادية (كلاسيكية)" />
              <div className="cat-card-bento__content">
                <span className="cat-card-bento__tag">الأكثر شهرة وفخامة</span>
                <h3 className="cat-card-bento__title">عادية (كلاسيكية)</h3>
                <p className="cat-card-bento__sub">ستانلس ستيل مصقول وتصاميم ملكية فاخرة</p>
              </div>
            </Link>

            <Link href="/shop?category=chrono" className="cat-card-bento">
              <img src="/img/ben10-chronograph-concept-01.png" alt="كرونوغراف (Chronograph)" />
              <div className="cat-card-bento__content">
                <span className="cat-card-bento__tag">دقة هندسية</span>
                <h3 className="cat-card-bento__title">كرونوغراف (Chronograph)</h3>
                <p className="cat-card-bento__sub">3 مواني فرعية وتاكيميتر لقياس السرعة</p>
              </div>
            </Link>

            <Link href="/shop?category=digital" className="cat-card-bento">
              <img src="/img/ben10-sport-concept-01.png" alt="رقمية (Digital)" />
              <div className="cat-card-bento__content">
                <span className="cat-card-bento__tag">عصرية وعملية</span>
                <h3 className="cat-card-bento__title">رقمية (Digital)</h3>
                <p className="cat-card-bento__sub">شاشات رقمية دقيقة وتنبيهات متعددة</p>
              </div>
            </Link>

            <Link href="/shop?category=smart" className="cat-card-bento">
              <img src="/img/ben10-sport-concept-01.png" alt="ذكية (Smartwatch)" />
              <div className="cat-card-bento__content">
                <span className="cat-card-bento__tag">شاشة AMOLED</span>
                <h3 className="cat-card-bento__title">ذكية (Smartwatch)</h3>
                <p className="cat-card-bento__sub">مكالمات وتتبع صحي وبطارية طويلة</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Best Sellers Section + View More */}
      <section className="section" id="best-sellers" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="section-head-flex">
            <div>
              <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>الأعلى مبيعاً هذا الشهر</div>
              <h2 className="section-title">الساعات <span>الأكثر مبيعاً</span></h2>
              <p className="section-note" style={{ margin: 0 }}>
                الساعات الأكثر طلباً واختياراً من عملائنا مع تقييمات إيجابية ممتازة وفحص كامل قبل الاستلام.
              </p>
            </div>
            <Link href="/shop?filter=bestseller" className="btn-view-more">
              <span>عرض المزيد من الأكثر مبيعاً</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </Link>
          </div>

          <div className="p-grid">
            {displayBestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending & Top Rated Section + View More */}
      <section className="section" id="trending">
        <div className="container">
          <div className="section-head-flex">
            <div>
              <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>إصدارات مختارة بعناية</div>
              <h2 className="section-title">الساعات <span>الأعلى طلباً وتقييماً</span></h2>
              <p className="section-note" style={{ margin: 0 }}>
                موديلات نالت إعجاب عشاق الفخامة بفضل جودة الزجاج الياقوتي والماكينات اليابانية المتقنة.
              </p>
            </div>
            <Link href="/shop?filter=top-rated" className="btn-view-more">
              <span>عرض المزيد من الأعلى طلباً</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </Link>
          </div>

          <div className="p-grid">
            {displayTopRated.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Men & Women Collections Spotlight */}
      <AudienceSection />

      {/* 5. Explore Collections Full Banner CTA */}
      <CollectionCTA />

      {/* 6. Deal of the Day Countdown */}
      <section className="section deal-section" id="deal">
        <div className="container deal__inner">
          <div>
            <div className="eyebrow" style={{ background: "rgba(163,230,53,0.18)" }}>عرض حصري لفترة محدودة</div>
            <h2 className="deal__title">
              ساعة Ben10 أبكس كرونوغراف سبيد<br />
              <span>بخصم استثنائي 700 ج.م</span>
            </h2>
            <p className="deal__desc">
              احصل على أقوى ساعات الكرونوغراف بهيكل التيتانيوم المقاوم للخدش وزجاج السافاير الياقوتي، مع شحن مجاني لكافة المحافظات وعلبة خشبية فاخرة للإهداء.
            </p>

            <div className="countdown">
              <div className="cd-box">
                <b>{String(timeLeft.hours).padStart(2, "0")}</b>
                <span>ساعة</span>
              </div>
              <div className="cd-box">
                <b>{String(timeLeft.mins).padStart(2, "0")}</b>
                <span>دقيقة</span>
              </div>
              <div className="cd-box">
                <b>{String(timeLeft.secs).padStart(2, "0")}</b>
                <span>ثانية</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.9rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn--green"
                onClick={() => {
                  if (dealProduct) openCheckoutWithProduct(dealProduct);
                }}
              >
                اطلب العرض الآن بـ 4,890 ج.م
              </button>
              <Link href={`/product/${dealProduct?.id || 'ben10-apex-chrono'}`} className="btn btn--ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                تفاصيل الساعة كاملة
              </Link>
            </div>
          </div>

          <div className="deal__poster">
            <div className="deal__stamp">
              <b>وفر</b>
              <span>700 ج.م</span>
            </div>
            <img src="/img/ben10-chronograph-concept-01.png" alt="ساعة Ben10 أبكس كرونوغراف" />
          </div>
        </div>
      </section>

      {/* 7. WhatsApp VIP Concierge Support & Order */}
      <WhatsAppSection />

      {/* 8. Guarantees Section */}
      <GuaranteesSection />

      {/* 9. Real Customer Reviews */}
      <ReviewsSection />
    </>
  );
}
