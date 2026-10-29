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
    <div className="search-overlay is-open" role="dialog" aria-modal="true">
      <div className="search-panel">
        <div className="search-panel__head">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ben10-green)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="ابحث عن ساعة، كرونوغراف، أوتوماتيك، ذكية..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            style={{ color: "#fff", padding: "0.5rem", background: "transparent", border: 0, cursor: "pointer", fontSize: "1.2rem" }}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className="search-popular">
          <span>كلمات شائعة:</span>
          {["كرونوغراف", "رويال كلاسيك", "تيتانيوم", "أوتوماتيك سكيلتون", "ساعة ذكية AMOLED", "رجالي", "نسائي"].map(tag => (
            <button key={tag} type="button" onClick={() => setQuery(tag)}>
              {tag}
            </button>
          ))}
        </div>

        <div className="search-results-grid">
          {filtered.slice(0, 8).map(p => (
            <div
              key={p.id}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "0.8rem",
                display: "flex",
                gap: "0.8rem",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onClick={() => {
                setQuickProduct(p);
                setIsSearchOpen(false);
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "52px", height: "52px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "3px" }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "0.88rem", color: "#fff", fontWeight: "700", margin: "0 0 4px" }}>{p.name}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", color: "#A3E635", fontWeight: "800" }}>
                    {Number(p.price).toLocaleString("ar-EG")} ج.م
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                    {p.cat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
