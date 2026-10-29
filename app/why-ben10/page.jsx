"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function WhyBen10Page() {
  const pillars = [
    {
      num: "01",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
      title: "أصالة 100% وضمان معتمد ومختوم",
      desc: "كل ساعة في متجر Ben10 أصلية ومطابقة لأعلى المواصفات القياسية. تأتيك مع شهادة ضمان رسمية مختومة من 12 إلى 24 شهراً تغطي الماكينة وأي عيوب تصنيع، مع بطاقة رقم تسلسلي معتمد."
    },
    {
      num: "02",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      title: "حق المعاينة والفحص الكامل قبل الدفع",
      desc: "نحن نثق في جودة منتجاتنا بنسبة 100%؛ لذلك يمنحك مندوب الشحن حق فتح الطرد، معاينة الساعة وتجربتها على معصمك والتأكد من وزنها وجودتها قبل سداد أي جنيه. لن تدفع إلا وأنت راضٍ تماماً."
    },
    {
      num: "03",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: "شحن سريع خلال 24 - 48 ساعة لكافة المحافظات",
      desc: "شبكة لوجستية تغطي القاهرة الكبرى، الإسكندرية، الدلتا، القناة والصعيد. نصل إليك بأقصى سرعة مع متابعة وإشعار حي بحالة الشحنة بكود المرجع الخاص بك #B10."
    },
    {
      num: "04",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      ),
      title: "تغليف هدايا ملكي فاخر مجاناً",
      desc: "تصلك الساعة داخل علبة خشبية فاخرة مبطنة بالمخمل الأسود، ومحكمة الغلق مع حقيبة إهداء مخصصة وكارت إهداء راقٍ؛ لتكون جاهزة للإهداء المباشر لأحبائك دون أي تكلفة إضافية."
    },
    {
      num: "05",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
        </svg>
      ),
      title: "سياسة استبدال مرنة وفورية خلال 14 يوماً",
      desc: "إذا أردت تغيير لون الساعة أو اختيار موديل آخر، تتيح لك سياستنا استبدالاً فورياً وسلساً خلال 14 يوماً من الاستلام دون أي تعقيد أو إجراءات روتينية مرهقة."
    },
    {
      num: "06",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      title: "خدمة كونسيرج ومستشار ساعات شخصي VIP",
      desc: "مستشارو الساعات لدينا متاحون عبر واتساب على مدار الساعة؛ لإرسال فيديوهات حية من واقع الطبيعة للساعة، ترشيح المقاس المناسب لمعصمك، ومتابعة أدق تفاصيل طلبك."
    }
  ];

  const comparisons = [
    {
      feature: "المعاينة والتجربة قبل الدفع",
      ben10: "نعم، حق أساسي تفحص الساعة وتجربها قبل دفع أي جنيه",
      others: "دفع مسبق إجباري أو منع فتح الشحنة أمام المندوب"
    },
    {
      feature: "زجاج الساعة الخارجي",
      ben10: "زجاج سافاير ياقوتي شديد الصلابة ومقاوم للخدوش تماماً",
      others: "زجاج بلاستيكي أو زجاج عادي رديء يخدش بسهولة"
    },
    {
      feature: "خامة الهيكل والسوار",
      ben10: "ستانلس ستيل 316L نقي ومقاوم للتآكل مع طلاء بتقنية PVD",
      others: "معادن تجارية مخلوطة يتغير لونها وتسبب حساسية الجلد"
    },
    {
      feature: "دقة الماكينة الداخلية",
      ben10: "ماكينات كوارتز وكرونوغراف وأوتوماتيك متقنة الصنع",
      others: "ماكينات مقلدة تتوقف عن العمل بعد فترة قصيرة"
    },
    {
      feature: "الضمان المعتمد",
      ben10: "شهادة ضمان رسمية مختومة بمدة 12 إلى 24 شهراً",
      others: "بدون ضمان أو وعود شفهية وهمية لا يمكن تطبيقها"
    },
    {
      feature: "علبة وتغليف الإهداء",
      ben10: "علبة خشبية فاخرة مبطنة بالمخمل وحقيبة راقية مجاناً",
      others: "أكياس بلاستيكية أو علب كرتونية رخيصة برسوم إضافية"
    }
  ];

  return (
    <div className="bg-[#f8faf8] min-h-screen text-[#131715]" dir="rtl">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090d0b] via-[#121815] to-[#090d0b] text-white pt-10 pb-16 sm:pt-14 sm:pb-24 border-b border-white/10">
        {/* Glow circles */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <Link href="/" className="hover:text-lime-400 transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-lime-400 font-bold">لماذا Ben10؟</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <Badge className="bg-lime-400/15 text-lime-400 border border-lime-400/30 text-xs font-bold px-3 py-1">
              ✨ معايير الفخامة والضمان المعتمد
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              لماذا يختار آلاف العملاء<br />
              <span className="text-lime-400">ساعات Ben10 الفاخرة؟</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
              نحن في <span className="text-white font-bold">Ben10</span> لا نقدم مجرد ساعات لمعرفة الوقت، بل نوفر قطعاً فنية فريدة تعبر عن شخصيتك وتليق بذوقك الرفيع، مع منظومة أمان كاملة تتيح لك المعاينة والفحص والتجربة قبل دفع أي مليم.
            </p>

            <div className="flex items-center gap-3 pt-4 flex-wrap">
              <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-12 px-7 rounded-full shadow-lg shadow-lime-400/20 text-sm">
                <Link href="/shop" className="flex items-center gap-2">
                  <span>تصفح تشكيلات الساعات</span>
                  <span>←</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-6 rounded-full text-sm">
                <Link href="/customer-service">
                  تواصل مع خدمة العملاء
                </Link>
              </Button>
            </div>
          </div>

          {/* Stat highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-10 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-lime-400">+15,000</div>
              <div className="text-xs text-neutral-300 mt-1 font-bold">عميل راضٍ في مصر</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-lime-400">100%</div>
              <div className="text-xs text-neutral-300 mt-1 font-bold">معاينة وفحص قبل الدفع</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-lime-400">24-48 ساعة</div>
              <div className="text-xs text-neutral-300 mt-1 font-bold">أسرع شحن للمحافظات</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-lime-400">12 - 24 شهر</div>
              <div className="text-xs text-neutral-300 mt-1 font-bold">ضمان رسمي معتمد</div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Pillars */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge variant="outline" className="text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
            ضمان وثقة تامة
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            6 أسباب تجعل Ben10 وجهتك الأولى
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            تجربة تسوق فاخرة خالية تماماً من أي مخاطرة، ترتكز على الشفافية والاهتمام بأدق تفاصيل ساعتك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/80 hover:border-lime-400 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-lime-400/20 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    {item.icon}
                  </div>
                  <span className="font-black text-2xl text-neutral-200 group-hover:text-lime-400/50 transition-colors">
                    {item.num}
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg text-neutral-900 mb-2.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-emerald-700 text-xs font-extrabold">
                <span>✓ ميزة مضمونة في كل طلب</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table: Ben10 vs Other Stores */}
      <section className="py-14 sm:py-20 bg-neutral-900 text-white border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
            <Badge className="bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold px-3 py-1">
              مقارنة الجودة والمصداقية
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              الفرق بين ساعات <span className="text-lime-400">Ben10</span> والمتاجر الأخرى
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              شفافية مطلقة لنضمن لك معرفة ما تدفع مقابله بالضبط قبل أن تقرر الشراء.
            </p>
          </div>

          <div className="bg-[#121815] border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
            <table className="w-full border-collapse text-right min-w-[620px]">
              <thead>
                <tr className="bg-[#090d0b] border-b border-white/15 text-xs text-neutral-400">
                  <th className="p-4 sm:p-5 font-bold">المعيار / الميزة</th>
                  <th className="p-4 sm:p-5 font-black text-lime-400 text-sm">متجر Ben10 للساعات</th>
                  <th className="p-4 sm:p-5 font-bold text-neutral-400">المتاجر الأخرى / الساعات المقلدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {comparisons.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white whitespace-nowrap">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-lime-300 font-extrabold flex items-start gap-2">
                      <span className="text-lime-400 text-base">✓</span>
                      <span>{row.ben10}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-400 font-medium">
                      <span className="text-rose-400 font-bold ml-1">✕</span>
                      <span>{row.others}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Customer Trust Quote Section */}
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-4xl text-lime-500">❝</span>
        <blockquote className="text-lg sm:text-2xl font-bold text-neutral-900 leading-relaxed max-w-3xl mx-auto">
          "أفضل تجربة شراء ساعة أونلاين في مصر بلا منازع. المندوب انتظرني حتى فتحت العلبة وتأكدت من وزن الساعة ونقائها على يدي، التغليف فخم جداً والضمان مختوم داخل العلبة."
        </blockquote>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-amber-500 text-base mb-1">
            ★★★★★
          </div>
          <span className="font-extrabold text-sm text-neutral-900">م. طارق عبد الحميد</span>
          <span className="text-xs text-neutral-500">عميل موثق · ساعة كرونوغراف سبيد هيريتدج</span>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1210] via-[#152019] to-[#0d1210] border border-white/10 p-8 sm:p-14 text-white text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <Badge className="bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold px-3 py-1">
              ابدأ تجربتك الفاخرة الآن
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              اختر ساعتك الآن وعاينها بنفسك قبل الدفع
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              شحن سريع لجميع المحافظات خلال 24 - 48 ساعة مع ضمان 14 يوماً للاستبدال الفوري.
            </p>
            <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
              <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-black h-12 px-8 rounded-full shadow-lg shadow-lime-400/25 text-sm">
                <Link href="/shop">
                  تسوق تشكيلات 2026 الحصرية ←
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-6 rounded-full text-sm">
                <a href="https://wa.me/201065712366" target="_blank" rel="noreferrer">
                  استشرنا عبر واتساب 💬
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
