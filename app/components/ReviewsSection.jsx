"use client";

import { Badge } from "@/components/ui/badge";

export default function ReviewsSection() {
  const reviews = [
    {
      stars: "★★★★★",
      quote: "الساعة وصلتني في أقل من 36 ساعة، التغليف فخم جداً وعلبة شيك تليق كهدية. عاينت الساعة وجربتها قبل ما أدفع قرش للمندوب، الكواليتي والخامات أنضف بكتير من الصور. شكراً Ben10!",
      avatar: "أ.ش",
      name: "م. أحمد الشناوي",
      detail: "التجمع الخامس، القاهرة · اشترى ساعة أبكس كرونوغراف"
    },
    {
      stars: "★★★★★",
      quote: "كنت متردد أشتري ساعة أونلاين، لكن ميزة المعاينة قبل الدفع شجعتني. الساعة رويال كلاسيك تحفة فنية بكل معنى الكلمة، وزنها محترم على الإيد والزجاج السافاير حقيقي مش بلاستيك. تقييمي 10 من 10.",
      avatar: "ك.ع",
      name: "د. كريم عبد العزيز",
      detail: "سموحة، الإسكندرية · اشترى ساعة رويال هيريتدج"
    },
    {
      stars: "★★★★★",
      quote: "الساعة الرياضية أكتيف إكستريم ممتازة في الجيم والجري ومقاومة للعرق والمياه بشكل رائع. خدمة العملاء على الواتساب سريعة ومحترمة جداً في المتابعة بعد البيع.",
      avatar: "ع.ج",
      name: "كابتن عمر الجيار",
      detail: "الشيخ زايد، الجيزة · اشترى ساعة أكتيف سبورت"
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-neutral-100/70" id="reviews" aria-label="تقييمات المشترين">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="mb-2 text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
              تجارب حقيقية
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
              ماذا يقول عملاء <span className="text-emerald-700">Ben10</span>؟
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed">
            شهادات موثقة من عملاء قاموا بمعاينة واستلام ساعاتهم في مختلف المحافظات.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div>
                <div className="text-amber-500 font-bold text-base tracking-widest mb-3">
                  {rev.stars}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-lime-400 text-black font-extrabold text-xs flex items-center justify-center shrink-0">
                  {rev.avatar}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
                    {rev.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    {rev.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
