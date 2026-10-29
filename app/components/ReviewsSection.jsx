"use client";

export default function ReviewsSection() {
  return (
    <section className="section" id="reviews" style={{ background: "var(--cream)" }} aria-label="تقييمات المشترين">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>تجارب حقيقية</div>
            <h2 className="section-title">ماذا يقول عملاء <span>Ben10</span>؟</h2>
          </div>
          <p className="section-note">
            شهادات موثقة من عملاء قاموا بمعاينة واستلام ساعاتهم في مختلف المحافظات.
          </p>
        </div>

        <div className="t-grid">
          <div className="t-card">
            <div className="t-card__stars">★★★★★</div>
            <p className="t-card__quote">
              "الساعة وصلتني في أقل من 36 ساعة، التغليف فخم جداً وعلبة شيك تليق كهدية. عاينت الساعة وجربتها قبل ما أدفع قرش للمندوب، الكواليتي والخامات أنضف بكتير من الصور. شكراً Ben10!"
            </p>
            <div className="t-card__author">
              <div className="t-avatar">أ.ش</div>
              <div>
                <div className="t-name">م. أحمد الشناوي</div>
                <div className="t-city">التجمع الخامس، القاهرة · اشترى ساعة أبكس كرونوغراف</div>
              </div>
            </div>
          </div>

          <div className="t-card">
            <div className="t-card__stars">★★★★★</div>
            <p className="t-card__quote">
              "كنت متردد أشتري ساعة أونلاين، لكن ميزة المعاينة قبل الدفع شجعتني. الساعة رويال كلاسيك تحفة فنية بكل معنى الكلمة، وزنها محترم على الإيد والزجاج السافاير حقيقي مش بلاستيك. تقييمي 10 من 10."
            </p>
            <div className="t-card__author">
              <div className="t-avatar">ك.ع</div>
              <div>
                <div className="t-name">د. كريم عبد العزيز</div>
                <div className="t-city">سموحة، الإسكندرية · اشترى ساعة رويال هيريتدج</div>
              </div>
            </div>
          </div>

          <div className="t-card">
            <div className="t-card__stars">★★★★★</div>
            <p className="t-card__quote">
              "الساعة الرياضية أكتيف إكستريم ممتازة في الجيم والجري ومقاومة للعرق والمياه بشكل رائع. خدمة العملاء على الواتساب سريعة ومحترمة جداً في المتابعة بعد البيع."
            </p>
            <div className="t-card__author">
              <div className="t-avatar">ع.ج</div>
              <div>
                <div className="t-name">كابتن عمر الجيار</div>
                <div className="t-city">الشيخ زايد، الجيزة · اشترى ساعة أكتيف سبورت</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
