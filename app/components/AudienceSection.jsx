"use client";

import Link from "next/link";

export default function AudienceSection() {
  return (
    <section className="section" style={{ background: "var(--cream-2)" }} id="audience">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>مجموعات مخصصة</div>
            <h2 className="section-title">تشكيلات <span>الرجال والنساء</span></h2>
          </div>
          <p className="section-note">
            اختر ما يناسب شخصيتك وأسلوبك اليومي؛ تشكيلات رجالية تعكس الهيبة والصلابة، وتشكيلات نسائية تفيض بالأناقة والنعومة.
          </p>
        </div>

        <div className="audience-grid">
          {/* Men Collection Card */}
          <div className="audience-card audience-card--men">
            <div className="audience-card__overlay"></div>
            <img src="/img/ben10-chronograph-concept-01.png" alt="تشكيلة الساعات الرجالية" className="audience-card__bg" />
            <div className="audience-card__content">
              <span className="audience-card__tag">قوة وهيبة لا تُضاهى</span>
              <h3 className="audience-card__title">ساعات رجالية فاخرة</h3>
              <p className="audience-card__desc">
                كرونوغراف عالي الدقة، ساعات رياضية وكلاسيكية صُنعت من التيتانيوم والستانلس ستيل 316L للرجل العصري.
              </p>
              <div className="audience-card__actions">
                <Link href="/shop?audience=men" className="btn btn--green">
                  <span>تصفح تشكيلة الرجال</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </Link>
                <Link href="/shop?audience=men" className="btn-link-more">
                  عرض المزيد ←
                </Link>
              </div>
            </div>
          </div>

          {/* Women Collection Card */}
          <div className="audience-card audience-card--women">
            <div className="audience-card__overlay"></div>
            <img src="/img/ben10-classic-concept-01.png" alt="تشكيلة الساعات النسائية" className="audience-card__bg" />
            <div className="audience-card__content">
              <span className="audience-card__tag">رقة وفخامة ساحرة</span>
              <h3 className="audience-card__title">ساعات نسائية راقية</h3>
              <p className="audience-card__desc">
                تصاميم ملكية أنيقة مع لمسات ذهبية ومواني مصقولة بعناية لتكتمل إطلالتك في كل مناسبة.
              </p>
              <div className="audience-card__actions">
                <Link href="/shop?audience=women" className="btn btn--green">
                  <span>تصفح تشكيلة النساء</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </Link>
                <Link href="/shop?audience=women" className="btn-link-more">
                  عرض المزيد ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
