"use client";

import { useCart } from "../context/CartContext";

export default function ToastContainer() {
  const { toasts } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900/95 text-white text-xs sm:text-sm font-bold shadow-2xl border border-lime-400/30 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-lime-400 text-black font-extrabold text-xs">
            ✓
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
