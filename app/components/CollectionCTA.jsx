"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CollectionCTA() {
  return (
    <section className="py-14 sm:py-20" id="collections-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d1210] via-[#141c18] to-[#0a150e] border border-white/10 p-6 sm:p-10 lg:p-14 text-white shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-lime-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Copy Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/30 text-xs font-bold px-3 py-1">
                تشكيلات Ben10 الحصرية 2026
              </Badge>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                جاهز لاكتشاف ساعتك القادمة؟<br />
                <span className="text-lime-400">تصفح كل التشكيلات والموديلات في مكان واحد</span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                سواء كنت تبحث عن فخامة الكلاسيك، أو دقة الكرونوغراف والسرعة، أو الساعات الذكية المتطورة.. ستجد ساعتك المثالية بضمان معتمد 100% وإمكانية الفحص الكامل قبل الدفع.
              </p>

              {/* Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "أكثر من 20 موديلاً حصرياً",
                  "فحص ومعاينة مع المندوب",
                  "ضمان استبدال معتمد 12-24 شهر",
                  "شحن سريع لجميع المحافظات"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-neutral-200">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 text-xs">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 flex-wrap">
                <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-11 px-6 rounded-full shadow-lg shadow-lime-400/20">
                  <Link href="/shop" className="flex items-center gap-2">
                    <span>تصفح كل التشكيلات الآن</span>
                    <span>←</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-11 px-6 rounded-full">
                  <Link href="/shop?filter=bestseller">
                    استكشف الأكثر مبيعاً 🔥
                  </Link>
                </Button>
              </div>

            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 rounded-full bg-lime-400/20 blur-2xl" />
                <img
                  src="/img/ben10-classic-concept-01.png"
                  alt="تشكيلة ساعات Ben10"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
