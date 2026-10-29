"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AudienceSection() {
  return (
    <section className="py-14 sm:py-20 bg-neutral-100/70" id="audience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="mb-2 text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
              مجموعات مخصصة
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
              تشكيلات <span className="text-emerald-700">الرجال والنساء</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed">
            اختر ما يناسب شخصيتك وأسلوبك اليومي؛ تشكيلات رجالية تعكس الهيبة والصلابة، وتشكيلات نسائية تفيض بالأناقة والنعومة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Men Card */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 bg-[#0d1210] shadow-xl border border-white/10">
            {/* Background Image & Gradient */}
            <img
              src="/img/ben10-chronograph-concept-01.png"
              alt="تشكيلة الساعات الرجالية"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-white space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-400 text-black font-extrabold text-xs">
                قوة وهيبة لا تُضاهى
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ساعات رجالية فاخرة
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed">
                كرونوغراف عالي الدقة، ساعات رياضية وكلاسيكية صُنعت من التيتانيوم والستانلس ستيل 316L للرجل العصري.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold rounded-full px-5 h-10 shadow-lg shadow-lime-400/20">
                  <Link href="/shop?audience=men" className="flex items-center gap-2">
                    <span>تصفح تشكيلة الرجال</span>
                    <span>←</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Women Card */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 bg-[#141c18] shadow-xl border border-white/10">
            {/* Background Image & Gradient */}
            <img
              src="/img/ben10-classic-concept-01.png"
              alt="تشكيلة الساعات النسائية"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-white space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-300 text-black font-extrabold text-xs">
                رقة وفخامة ساحرة
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ساعات نسائية راقية
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed">
                تصاميم ملكية أنيقة مع لمسات ذهبية ومواني مصقولة بعناية لتكتمل إطلالتك في كل مناسبة.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button asChild className="bg-lime-400 hover:bg-lime-500 text-black font-extrabold rounded-full px-5 h-10 shadow-lg shadow-lime-400/20">
                  <Link href="/shop?audience=women" className="flex items-center gap-2">
                    <span>تصفح تشكيلة النساء</span>
                    <span>←</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
