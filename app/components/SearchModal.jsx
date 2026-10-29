"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function SearchModal() {
  const {
    products,
    isSearchOpen,
    setIsSearchOpen,
    setQuickProduct
  } = useCart();

  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const filtered = products.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.sub && p.sub.toLowerCase().includes(q)) ||
      (p.cat && p.cat.toLowerCase().includes(q)) ||
      (p.target_audience && p.target_audience.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-[#141c18] border border-white/15 rounded-3xl p-5 sm:p-6 text-white shadow-2xl mt-6 sm:mt-12 animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <svg className="w-5 h-5 text-lime-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="ابحث عن ساعة، كرونوغراف، أوتوماتيك، ذكية..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Popular Tags */}
        <div className="py-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-neutral-400 font-semibold">كلمات شائعة:</span>
          {["كرونوغراف", "رويال كلاسيك", "تيتانيوم", "أوتوماتيك سكيلتون", "ساعة ذكية AMOLED", "رجالي", "نسائي"].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-lime-400 hover:text-black text-neutral-300 font-medium transition-colors border border-white/5"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="col-span-full py-8 text-center text-neutral-400 text-sm">
              لم نجد ساعات مطابقة لبحثك "{query}"
            </div>
          ) : (
            filtered.slice(0, 8).map(p => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                onClick={() => {
                  setQuickProduct(p);
                  setIsSearchOpen(false);
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-contain bg-white p-1 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-lime-400 transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-extrabold text-lime-400">
                      {Number(p.price).toLocaleString("ar-EG")} ج.م
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      {p.cat}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
