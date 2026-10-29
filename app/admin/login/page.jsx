"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <div className="min-h-screen bg-[#0d1210] text-white flex items-center justify-center p-4" dir="rtl">
      
      {/* Background Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md bg-[#141c18] border-white/10 text-white shadow-2xl rounded-3xl p-4 sm:p-6">
        
        <CardHeader className="text-center pb-6 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-lime-400/15 border border-lime-400/40 text-lime-400 flex items-center justify-center mb-2 shadow-inner">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 7 12 12 15 14"></polyline>
            </svg>
          </div>

          <CardTitle className="text-2xl font-black text-white">
            لوحة تحكم <span className="text-lime-400">Ben10</span>
          </CardTitle>

          <CardDescription className="text-xs text-neutral-400">
            تسجيل دخول مسؤول المتجر لإدارة الساعات والطلبات
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500 text-rose-300 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-300">اسم المستخدم</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="h-11 rounded-xl bg-[#090d0b] border-white/15 text-white placeholder-neutral-500 text-sm focus:border-lime-400 focus:ring-lime-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-300">كلمة المرور</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="h-11 rounded-xl bg-[#090d0b] border-white/15 text-white placeholder-neutral-500 text-sm focus:border-lime-400 focus:ring-lime-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-12 rounded-xl text-sm shadow-lg shadow-lime-400/25 transition-transform active:scale-[0.99] mt-2"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="pt-4 mt-4 border-t border-white/10 text-center text-xs text-neutral-400 space-y-1">
            <p className="text-[11px] text-neutral-500">
              بوابة مخصصة للإدارة فقط · مشفرة ومحمية بالكامل
            </p>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}
