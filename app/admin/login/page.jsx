"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1210",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "'Almarai', sans-serif"
    }} dir="rtl">
      <div style={{
        width: "min(420px, 100%)",
        background: "#141c18",
        border: "1px solid rgba(163, 230, 53, 0.3)",
        borderRadius: "20px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            margin: "0 auto 1rem",
            borderRadius: "14px",
            background: "rgba(163, 230, 53, 0.15)",
            border: "1px solid #A3E635",
            color: "#A3E635",
            display: "grid",
            placeItems: "center"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 7 12 12 15 14"></polyline>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "800", margin: "0 0 0.4rem" }}>
            لوحة تحكم <span style={{ color: "#A3E635" }}>Ben10</span>
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
            تسجيل دخول مسؤول المتجر لإدارة الساعات والطلبات
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            fontSize: "0.82rem",
            marginBottom: "1.2rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.4rem", color: "#e2e8f0" }}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              style={{
                width: "100%",
                height: "46px",
                background: "#090d0b",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                paddingInline: "1rem",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.6rem" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.4rem", color: "#e2e8f0" }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: "100%",
                height: "46px",
                background: "#090d0b",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                paddingInline: "1rem",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              background: "#A3E635",
              color: "#0d1210",
              border: 0,
              borderRadius: "999px",
              fontWeight: "800",
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(163, 230, 53, 0.35)",
              transition: "transform 0.2s"
            }}
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div style={{
          marginTop: "1.8rem",
          paddingTop: "1.2rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          fontSize: "0.72rem",
          color: "#94a3b8"
        }}>
          💡 <b>بيانات الدخول الافتراضية:</b><br />
          المستخدم: <code>admin</code> · كلمة المرور: <code>ben10admin2026</code>
        </div>
      </div>
    </div>
  );
}
