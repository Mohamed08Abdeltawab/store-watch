"use client";

import { useState } from "react";

const DEFAULT_TICKER_ITEMS = [
  { icon: "🛡️", text: "فحص ومعاينة الساعة بالكامل مع المندوب قبل دفع أي مليم" },
  { icon: "★", text: "ساعات أصلية 100% بضمان الوكيل المعتمد 12 - 24 شهر" },
  { icon: "🚚", text: "شحن سريع لجميع محافظات مصر خلال 24 - 48 ساعة" },
  { icon: "🎁", text: "علبة هدايا جلدية فاخرة مجانية مع كل ساعة" },
  { icon: "💎", text: "زجاج ياقوتي سافاير فائق الصلابة ومقاوم للخدش والكسر" },
  { icon: "📱", text: "تتبع مباشر للطلب برقم مرجع فريد #B10 عبر الواتساب" },
  { icon: "💳", text: "دفع عند الاستلام كاش أو إنستاباي والمحافظ الذكية" },
  { icon: "🔄", text: "استبدال فوري مجاني معتمد خلال 14 يوماً بدون تعقيد" }
];

export default function MarqueeTicker({ items = DEFAULT_TICKER_ITEMS }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="relative w-full bg-lime-400 text-black py-2.5 sm:py-3 overflow-hidden select-none border-y border-lime-500/20 shadow-sm group cursor-pointer"
      aria-label="شريط مميزات وإعلانات المتجر"
      role="region"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
      title="اضغط أو مرر المؤشر للتوقف المؤقت"
    >
      {/* Isolated LTR track ensures seamless mathematical leftward translation */}
      <div className="w-full overflow-hidden" dir="ltr">
        <div
          className="animate-marquee flex items-center group-hover:[animation-play-state:paused] active:[animation-play-state:paused]"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {/* Group 1 (Primary) */}
          <div className="flex shrink-0 items-center gap-8 px-4 font-extrabold text-xs sm:text-sm tracking-wide" dir="rtl">
            {items.map((item, idx) => (
              <span key={`ticker-1-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                <span className="text-sm sm:text-base leading-none">{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-black/30 font-black mr-4 text-xs select-none">•</span>
              </span>
            ))}
          </div>

          {/* Group 2 (Clone for infinite seamless wrap) */}
          <div className="flex shrink-0 items-center gap-8 px-4 font-extrabold text-xs sm:text-sm tracking-wide" dir="rtl" aria-hidden="true">
            {items.map((item, idx) => (
              <span key={`ticker-2-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                <span className="text-sm sm:text-base leading-none">{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-black/30 font-black mr-4 text-xs select-none">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
