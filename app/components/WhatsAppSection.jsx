"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WhatsAppSection() {
  const waNumber = "201065712366";
  const defaultMsg = encodeURIComponent("مرحباً متجر Ben10، أود الاستفسار والمساعدة في اختيار ساعة مناسبة.");

  return (
    <section className="py-14 sm:py-20" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-[#0d1210] border border-white/10 p-6 sm:p-10 lg:p-14 text-white shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#25D366]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-5">
            <Badge className="bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 text-xs font-bold px-3 py-1">
              خدمة العملاء VIP
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              محتار تختار أي ساعة؟<br />
              <span className="text-[#25D366]">فريق Ben10 معك خطوة بخطوة على واتساب</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              تحدث مباشرة مع مستشار الساعات لدينا على مدار الساعة. نساعدك في اختيار المقاس المناسب لمعصمك، إرسال فيديوهات حية للساعة قبل الشحن، وتتبع طلبك بكود المرجع الخاص بك #B10.
            </p>

            {/* Benefits */}
            <div className="space-y-2 py-1">
              {[
                "رد فوري خلال دقائق معدودة",
                "فيديوهات وتصوير حقيقي للساعات قبل الشحن",
                "حجز سريع وتأكيد الشحن دون انتظار"
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <Button asChild className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold h-11 px-6 rounded-full shadow-lg shadow-[#25D366]/25">
                <a
                  href={`https://wa.me/${waNumber}?text=${defaultMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                  </svg>
                  <span className="hidden sm:inline">محادثة فورية عبر واتساب (0106 571 2366)</span>
                  <span className="sm:hidden">محادثة واتساب مباشرة</span>
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-11 px-6 rounded-full">
                <a href="tel:+201065712366" className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>اتصال هاتفي</span>
                </a>
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
