"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerServicePage() {
  // Order Tracking State
  const [orderRefInput, setOrderRefInput] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingError, setTrackingError] = useState("");

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubject, setFormSubject] = useState("استشارة لاختيار ساعة");
  const [formNotes, setFormNotes] = useState("");

  // Handle Live Order Tracking
  async function handleTrackOrder(e) {
    e.preventDefault();
    const cleanRef = orderRefInput.trim().replace(/^#/, "");
    if (!cleanRef) return;

    setTrackingLoading(true);
    setTrackingError("");
    setTrackedOrder(null);

    try {
      const res = await fetch(`/api/orders/${cleanRef}`);
      const data = await res.json();
      if (data.success && data.order) {
        setTrackedOrder(data.order);
      } else {
        setTrackingError(data.error || "لم يتم العثور على طلب بهذا المرجع. يرجى التأكد من الرقم أو التواصل معنا.");
      }
    } catch (err) {
      setTrackingError("حدث خطأ أثناء محاولة تتبع الطلب. يرجى المحاولة لاحقاً.");
    } finally {
      setTrackingLoading(false);
    }
  }

  // Handle Quick WhatsApp Dispatch
  function handleWhatsAppFormSubmit(e) {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert("يرجى ملء الاسم ورقم الهاتف للتواصل");
      return;
    }

    const message = `مرحباً متجر Ben10 للساعات،
أنا: ${formName}
هاتف: ${formPhone}
الموضوع: ${formSubject}
${formNotes ? `التفاصيل: ${formNotes}` : ""}`;

    const url = `https://wa.me/201065712366?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  const faqs = [
    {
      q: "كيف تتم ميزة المعاينة والتجربة قبل الدفع؟",
      a: "عند وصول مندوب الشحن لباب منزلك، يمنحك الحق الكامل في فتح الطرد ومعاينة الساعة وتجربتها على معصمك والتأكد من سلامتها وأصالتها ومطابقتها للمواصفات المعروضة، وبعدها فقط تقوم بسداد قيمة الطلب للمندوب نقداً."
    },
    {
      q: "ما هي مدة وتكلفة الشحن لجميع المحافظات؟",
      a: "الشحن يتم خلال 24 إلى 48 ساعة كحد أقصى للقاهرة والجيزة والإسكندرية، وخلال 48 إلى 72 ساعة لباقي محافظات الجمهورية. الشحن مجاني على كافة العروض الخاصة وأكثر من ساعة، وبرسوم رمزية محددة لباقي الطلبات."
    },
    {
      q: "ما هي شروط وسياسة الاستبدال خلال 14 يوماً؟",
      a: "يحق لك استبدال الساعة بأي موديل آخر أو تغيير اللون خلال 14 يوماً من تاريخ الاستلام، بشرط أن تكون الساعة بحالتها الأصلية مع ملصقات الحماية والعلبة وبطاقة الضمان دون أي تلف أو خدوش."
    },
    {
      q: "ماذا يغطي ضمان الساعة المعتمد؟",
      a: "الضمان رسمي ومختوم لمدة 12 إلى 24 شهراً ضد أي عيوب تصنيع، دقة الماكينة الداخلية، وتوقف العقارب أو التاريخ، مع صيانة فورية أو استبدال الساعة في حال ثبوت أي عيب مصنعي."
    },
    {
      q: "هل يمكنني طلب تقصير أو تعديل سوار الساعة ليناسب معصمي؟",
      a: "نعم، يمكنك كتابة محيط معصمك أو إبلاغنا عبر واتساب عند تأكيد الطلب، وسيقوم فني الساعات بضبط مقاس السوار بدقة، كما نرفق أداة مخصصة لضبط السوار مع الساعات الستانلس ستيل مجاناً."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-[#f8faf8] min-h-screen text-[#131715]" dir="rtl">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090d0b] via-[#121815] to-[#090d0b] text-white pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-white/10">
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#25D366]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <Link href="/" className="hover:text-lime-400 transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-[#25D366] font-bold">خدمة العملاء والدعم</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <Badge className="bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 text-xs font-bold px-3 py-1">
              💬 كونسيرج ودعم فوري VIP
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              مركز خدمة العملاء والدعم<br />
              <span className="text-[#25D366]">فريق Ben10 معك على مدار الساعة</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
              سواء كنت بحاجة إلى استشارة لاختيار الساعة الأنسب لمعصمك، تتبع حالة شحنتك، الاستفسار عن الضمان وسياسة الاستبدال، نحن هنا لخدمتك دائماً بأعلى معايير الرقي والسرعة.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {/* WhatsApp */}
            <a
              href="https://wa.me/201065712366?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20Ben10%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9"
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-[#25D366]/40 rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] flex items-start gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-black transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                </svg>
              </div>
              <div>
                <span className="text-[11px] text-[#25D366] font-bold">المحادثة الفورية</span>
                <div className="text-sm font-black text-white mt-0.5">واتساب خدمة العملاء</div>
                <div className="text-xs text-neutral-400 mt-1">0106 571 2366</div>
                <div className="text-[10px] text-lime-400 font-bold mt-1">رد فوري خلال دقائق ↗</div>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href="tel:+201065712366"
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] flex items-start gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-bold">هاتف المبيعات</span>
                <div className="text-sm font-black text-white mt-0.5">اتصال هاتفي مباشر</div>
                <div className="text-xs text-neutral-400 mt-1">0106 571 2366</div>
                <div className="text-[10px] text-neutral-400 mt-1">يومياً 10 ص - 11 م</div>
              </div>
            </a>

            {/* Working Hours */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <span className="text-[11px] text-sky-400 font-bold">مواعيد العمل</span>
                <div className="text-sm font-black text-white mt-0.5">طوال أيام الأسبوع</div>
                <div className="text-xs text-neutral-300 mt-1">10:00 ص - 11:00 م</div>
                <div className="text-[10px] text-neutral-400 mt-1">الجمعة من 1:00 م</div>
              </div>
            </div>

            {/* Headquarters */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <span className="text-[11px] text-amber-400 font-bold">المقر الإداري</span>
                <div className="text-sm font-black text-white mt-0.5">التجمع الخامس</div>
                <div className="text-xs text-neutral-300 mt-1">القاهرة الجديدة، مصر</div>
                <div className="text-[10px] text-neutral-400 mt-1">شحن لجميع المحافظات</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* SECTION 1: LIVE ORDER TRACKING BY REF CODE */}
        <section className="mb-14 sm:mb-20 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="max-w-3xl">
            <Badge className="bg-lime-400/20 text-emerald-900 border-lime-400/40 text-xs font-bold px-3 py-1 mb-2">
              🔍 تتبع الشحنة الحي
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
              تتبع مسار وحالة طلبك بكود المرجع
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 mb-6 leading-relaxed">
              إذا كنت قد قمت بالطلب مسبقاً، يمكنك كتابة كود المرجع الخاص بك (الذي استلمته في رسالة تأكيد الطلب أو عبر واتساب) لمعرفة حالة تجهيز وشحن ساعتك فوراً.
            </p>

            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="أدخل كود المرجع (مثال: B10-84920)"
                value={orderRefInput}
                onChange={(e) => setOrderRefInput(e.target.value)}
                required
                className="flex-1 h-12 bg-neutral-50 border border-neutral-300 focus:border-lime-400 focus:bg-white rounded-2xl px-4 text-sm font-bold outline-none transition-all"
              />
              <Button
                type="submit"
                disabled={trackingLoading}
                className="h-12 px-8 bg-lime-400 hover:bg-lime-500 text-black font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                {trackingLoading ? "جاري الاستعلام..." : "استعلام عن الطلب"}
              </Button>
            </form>

            {/* Tracking Result Card */}
            {trackedOrder && (
              <div className="mt-6 p-6 rounded-2xl bg-neutral-900 text-white border border-lime-400/30 shadow-xl space-y-4 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs text-neutral-400">كود المرجع</span>
                    <div className="text-lg font-black text-lime-400 font-mono">#{trackedOrder.order_ref}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block mb-1">حالة الطلب الحالية</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      trackedOrder.status === "تم التسليم"
                        ? "bg-lime-400 text-black"
                        : trackedOrder.status === "جاري الشحن"
                        ? "bg-sky-400 text-black"
                        : trackedOrder.status === "تم التأكيد"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-400 text-black"
                    }`}>
                      {trackedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400">اسم العميل:</span>
                    <div className="font-bold text-white text-sm mt-0.5">{trackedOrder.customer_name}</div>
                  </div>
                  <div>
                    <span className="text-neutral-400">المحافظة والعنوان:</span>
                    <div className="font-bold text-white text-sm mt-0.5">{trackedOrder.governorate} - {trackedOrder.address}</div>
                  </div>
                  <div>
                    <span className="text-neutral-400">الساعات المطلوبة:</span>
                    <div className="font-bold text-neutral-200 mt-1 space-y-1">
                      {Array.isArray(trackedOrder.items) && trackedOrder.items.map((it, idx) => (
                        <div key={idx}>• {it.name} ({it.qty}x)</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-400">المبلغ الإجمالي عند الاستلام:</span>
                    <div className="font-black text-lime-400 text-base mt-0.5">
                      {Number(trackedOrder.total).toLocaleString("ar-EG")} ج.م
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-neutral-400">لأي استفسار بخصوص هذا الطلب تواصل معنا مباشرة</span>
                  <a
                    href={`https://wa.me/201065712366?text=${encodeURIComponent(`مرحباً أستفسر عن طلبي كود مرجع: #${trackedOrder.order_ref}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold no-underline transition-colors"
                  >
                    <span>متابعة الشحنة على واتساب</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            )}

            {trackingError && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                ✕ {trackingError}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: QUICK INQUIRY FORM & FAQS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <Badge className="bg-lime-400/20 text-emerald-900 border-lime-400/40 text-xs font-bold px-3 py-1 mb-2">
              📝 رسالة سريعة
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              تواصل مع مستشار الساعات
            </h2>
            <p className="text-xs text-neutral-500 mt-1 mb-5">
              املأ البيانات وسيقوم فريق الدعم بالرد الفوري عليك عبر واتساب.
            </p>

            <form onSubmit={handleWhatsAppFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-11 bg-neutral-50 border border-neutral-300 focus:border-lime-400 rounded-xl px-3.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">رقم الهاتف (واتساب) *</label>
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full h-11 bg-neutral-50 border border-neutral-300 focus:border-lime-400 rounded-xl px-3.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">موضوع الاستفسار</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-11 bg-neutral-50 border border-neutral-300 focus:border-lime-400 rounded-xl px-3.5 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="استشارة لاختيار ساعة تناسبني">استشارة لاختيار ساعة تناسبني</option>
                  <option value="الاستفسار عن الشحن وميعاد الوصول">الاستفسار عن الشحن وميعاد الوصول</option>
                  <option value="تأكيد كود طلب وحجز فوري">تأكيد كود طلب وحجز فوري</option>
                  <option value="طلب استبدال خلال 14 يوماً">طلب استبدال خلال 14 يوماً</option>
                  <option value="تغليف إهداء خاص لمناسبة">تغليف إهداء خاص لمناسبة</option>
                  <option value="موضوع آخر">موضوع آخر</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">تفاصيل الاستفسار أو كود الساعة (اختياري)</label>
                <textarea
                  rows={3}
                  placeholder="اكتب أي ملاحظة أو موديل محدد تسأل عنه..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-lime-400 rounded-xl p-3 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                </svg>
                <span>إرسال الاستفسار عبر واتساب ↗</span>
              </Button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <Badge className="bg-lime-400/20 text-emerald-900 border-lime-400/40 text-xs font-bold px-3 py-1 mb-2">
                ❓ إجابات سريعة
              </Badge>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                الأسئلة الأكثر شيوعاً
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                إليك إجابات وافية لأهم الأسئلة التي يطرحها عملاؤنا قبل الشراء.
              </p>
            </div>

            <div className="divide-y divide-neutral-100 pt-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-right text-sm font-extrabold text-neutral-900 gap-3 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-base text-neutral-400 font-bold shrink-0">
                      {openFaq === idx ? "▲" : "▼"}
                    </span>
                  </button>

                  {openFaq === idx && (
                    <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-xs font-bold text-neutral-700 block">هل لديك سؤال لم تجد إجابته هنا؟</span>
              <a
                href="https://wa.me/201065712366"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-xs font-black text-emerald-700 hover:text-emerald-800 underline"
              >
                تحدث مع مستشارنا عبر واتساب وسنجيبك فوراً ←
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
