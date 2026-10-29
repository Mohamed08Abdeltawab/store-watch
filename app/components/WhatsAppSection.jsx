"use client";

export default function WhatsAppSection() {
  const waNumber = "201065712366";
  const defaultMsg = encodeURIComponent("مرحباً متجر Ben10، أود الاستفسار والمساعدة في اختيار ساعة مناسبة.");

  return (
    <section className="section wa-section" id="contact">
      <div className="container">
        <div className="wa-concierge-card">
          <div className="wa-concierge-card__body">
            <div className="eyebrow" style={{ background: "rgba(37,211,102,0.18)", color: "#25D366", borderColor: "rgba(37,211,102,0.3)" }}>
              خدمة العملاء VIP
            </div>
            <h2 className="wa-concierge-card__title">
              محتار تختار أي ساعة؟<br />
              <span>فريق Ben10 معك خطوة بخطوة على واتساب</span>
            </h2>
            <p className="wa-concierge-card__desc">
              تحدث مباشرة مع مستشار الساعات لدينا على مدار الساعة. نساعدك في اختيار المقاس المناسب لمعصمك، إرسال فيديوهات حية للساعة قبل الشحن، وتتبع طلبك بكود المرجع الخاص بك #B10.
            </p>

            <div className="wa-benefits">
              <div className="wa-benefit-item">
                <span className="wa-benefit-item__dot"></span>
                <span>رد فوري خلال دقائق معدودة</span>
              </div>
              <div className="wa-benefit-item">
                <span className="wa-benefit-item__dot"></span>
                <span>فيديوهات وتصوير حقيقي للساعات قبل الشحن</span>
              </div>
              <div className="wa-benefit-item">
                <span className="wa-benefit-item__dot"></span>
                <span>حجز سريع وتأكيد الشحن دون انتظار</span>
              </div>
            </div>

            <div className="wa-concierge-card__actions">
              <a
                href={`https://wa.me/${waNumber}?text=${defaultMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa-direct"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                </svg>
                <span>محادثة فورية عبر واتساب (0106 571 2366)</span>
              </a>

              <a href="tel:+201065712366" className="btn-call-direct">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
