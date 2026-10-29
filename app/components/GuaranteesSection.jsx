"use client";

export default function GuaranteesSection() {
  return (
    <section className="section" id="guarantees" aria-label="ضمانات المتجر">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: "600px", marginInline: "auto" }}>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>ضمان وثقة تامة</div>
            <h2 className="section-title">لماذا تشتري ساعتك من <span>Ben10</span>؟</h2>
            <p className="section-note" style={{ marginInline: "auto" }}>
              نحرص على تقديم تجربة شراء إلكترونية آمنة بنسبة 100% وبدون أي مخاطرة على الإطلاق.
            </p>
          </div>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <span className="value-card__num">01</span>
            <div className="value-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>ساعات أصلية بضمان معتمد</h3>
            <p>جميع الساعات أصلية ومفحوصة بدقة مع بطاقة ضمان رسمية مختومة لمدة 12 إلى 24 شهراً ضد عيوب الصناعة.</p>
          </div>

          <div className="value-card">
            <span className="value-card__num">02</span>
            <div className="value-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3>معاينة وفحص قبل الدفع</h3>
            <p>من حقك فحص الساعة وفتح العلبة وتجربتها على معصمك أمام مندوب الشحن قبل سداد أي مبلغ مالي.</p>
          </div>

          <div className="value-card">
            <span className="value-card__num">03</span>
            <div className="value-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h3>شحن سريع 24-48 ساعة</h3>
            <p>شبكة شحن تغطي كافة مدن ومحافظات مصر مع إمكانية تتبع مسار الشحنة خطوة بخطوة حتى باب منزلك.</p>
          </div>

          <div className="value-card">
            <span className="value-card__num">04</span>
            <div className="value-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>تغليف هدايا فاخر مجاناً</h3>
            <p>تصلك الساعة داخل علبة فخمة مبطنة بالمخمل ومحكمة الغلق مع حقيبة ورقية فاخرة تناسب تقديمها كهدية راقية.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
