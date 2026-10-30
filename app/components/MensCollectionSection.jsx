"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MensCollectionSection({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-neutral-100/70" id="men-collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="mb-2 text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
              تشكيلة الرجال الحصرية
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
              ساعات رجالية <span className="text-emerald-700">تعكس الهيبة والصلابة</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg">
              تصاميم كرونوغراف، أوتوماتيك وكلاسيكية صُنعت من الستانلس ستيل 316L والتيتانيوم للرجل العصري.
            </p>
          </div>
          
          <Button asChild variant="outline" className="border-neutral-300 rounded-full h-10 px-5 text-xs font-bold self-start sm:self-auto">
            <Link href="/shop?audience=men" className="flex items-center gap-2">
              <span>عرض كل التشكيلة الرجالية</span>
              <span>←</span>
            </Link>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </section>
  );
}
