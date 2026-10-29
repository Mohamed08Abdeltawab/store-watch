"use client";

import { useCart } from "../context/CartContext";

export default function ToastContainer() {
  const { toasts } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          ✓ <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
