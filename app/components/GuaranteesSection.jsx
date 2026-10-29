"use client";

import { Badge } from "@/components/ui/badge";

export default function GuaranteesSection() {
  const items = [
    {
      num: "01",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "ساعات أصلية بضمان معتمد",
      desc: "جميع الساعات أصلية ومفحوصة بدقة مع بطاقة ضمان رسمية مختومة لمدة 12 إلى 24 شهراً ضد عيوب الصناعة."
    },
    {
      num: "02",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      title: "معاينة وفحص قبل الدفع",
      desc: "من حقك فحص الساعة وفتح العلبة وتجربتها على معصمك أمام مندوب الشحن قبل سداد أي مبلغ مالي."
    },
    {
      num: "03",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: "شحن سريع 24-48 ساعة",
      desc: "شبكة شحن تغطي كافة مدن ومحافظات مصر مع إمكانية تتبع مسار الشحنة خطوة بخطوة حتى باب منزلك."
    },
    {
      num: "04",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: "تغليف هدايا فاخر مجاناً",
      desc: "تصلك الساعة داخل علبة فخمة مبطنة بالمخمل ومحكمة الغلق مع حقيبة ورقية فاخرة تناسب تقديمها كهدية راقية."
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-neutral-100" id="guarantees" aria-label="ضمانات المتجر">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
            ضمان وثقة تامة
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            لماذا تشتري ساعتك من <span className="text-emerald-700">Ben10</span>؟
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            نحرص على تقديم تجربة شراء إلكترونية آمنة بنسبة 100% وبدون أي مخاطرة على الإطلاق.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl p-6 bg-neutral-50/80 border border-neutral-200/80 hover:border-lime-400 hover:bg-white transition-all duration-300 hover:shadow-xl group"
            >
              <span className="absolute top-4 left-4 font-black text-2xl text-neutral-200 group-hover:text-lime-400/40 transition-colors">
                {item.num}
              </span>
              
              <div className="w-12 h-12 rounded-xl bg-lime-400/20 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="font-extrabold text-base text-neutral-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
