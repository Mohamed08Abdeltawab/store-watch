"use client";

import { useCart, GOVERNORATES } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    totalCartCount,
    cartSubtotal,
    isFreeShipping,
    shippingFee,
    cartTotal,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    selectedGov,
    setSelectedGov,
    customerAddress,
    setCustomerAddress,
    paymentMethod,
    setPaymentMethod,
    formErrors,
    submittingOrder,
    orderCompleted,
    setOrderCompleted,
    handleOrderSubmit
  } = useCart();

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCheckoutOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900">
              تأكيد الطلب وحجز مرجع الفاتورة
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              سجل بياناتك وسيتم إنشاء كود مرجعي فريد #B10 للطلب وتأكيده فوراً
            </p>
          </div>
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition-colors text-base font-bold shrink-0 cursor-pointer"
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {orderCompleted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h3 className="font-extrabold text-xl text-neutral-900">
              تم استلام طلبك وتسجيله بنجاح!
            </h3>

            <div className="bg-emerald-50 border-2 border-dashed border-lime-400 rounded-2xl p-4 my-4 text-emerald-900">
              <span className="text-xs font-semibold text-emerald-700">كود مرجع الطلب الخاص بك:</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-wider my-1">
                #{orderCompleted.orderRef}
              </div>
              <small className="text-[11px] text-emerald-700">احتفظ بهذا الكود لتتبع شحنتك مع خدمة العملاء</small>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
              تم تجهيز رسالة الواتساب تلقائياً مع تفاصيل طلبك وكود المرجع. إذا لم تفتح تلقائياً اضغط على الزر أدناه:
            </p>

            <div className="space-y-2 pt-2">
              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold h-12 rounded-xl text-sm shadow-md"
              >
                <a
                  href={orderCompleted.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  متابعة الطلب على واتساب برقم #{orderCompleted.orderRef}
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full text-neutral-700 h-10 rounded-xl border-neutral-200"
                onClick={() => {
                  setOrderCompleted(null);
                  setIsCheckoutOpen(false);
                }}
              >
                العودة للمتجر
              </Button>
            </div>
          </div>
        ) : (
          <form className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto" onSubmit={handleOrderSubmit}>
            
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-800">الاسم بالكامل *</Label>
              <Input
                type="text"
                placeholder="اكتب اسمك الثلاثي هنا"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`h-11 rounded-xl text-sm ${formErrors.name ? "border-rose-500 ring-rose-500" : ""}`}
              />
              {formErrors.name && (
                <span className="text-[11px] font-semibold text-rose-500">{formErrors.name}</span>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-800">رقم الهاتف المحمول (واتساب) *</Label>
              <Input
                type="tel"
                placeholder="01xxxxxxxxx"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`h-11 rounded-xl text-sm ${formErrors.phone ? "border-rose-500 ring-rose-500" : ""}`}
              />
              {formErrors.phone && (
                <span className="text-[11px] font-semibold text-rose-500">{formErrors.phone}</span>
              )}
            </div>

            {/* Governorate */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-800">المحافظة *</Label>
              <select
                value={selectedGov.name}
                onChange={(e) => {
                  const g = GOVERNORATES.find(gov => gov.name === e.target.value);
                  if (g) setSelectedGov(g);
                }}
                className="w-full h-11 px-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov.name} value={gov.name}>
                    {gov.name} — مصاريف الشحن: {gov.shipping === 0 ? "مجاناً" : `${gov.shipping} ج.م`}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-800">العنوان بالتفصيل *</Label>
              <Input
                type="text"
                placeholder="المدينة / الحي / اسم الشارع / رقم العقار أو علامة مميزة"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className={`h-11 rounded-xl text-sm ${formErrors.address ? "border-rose-500 ring-rose-500" : ""}`}
              />
              {formErrors.address && (
                <span className="text-[11px] font-semibold text-rose-500">{formErrors.address}</span>
              )}
            </div>

            {/* Payment Method */}
            <div className="pt-2">
              <Label className="text-xs font-bold text-neutral-800 block mb-2">طريقة السداد المعتمدة</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  paymentMethod === "cod" ? "border-lime-500 bg-lime-50/50 text-neutral-900 ring-1 ring-lime-400" : "border-neutral-200 text-neutral-600"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-lime-500"
                  />
                  <span>الدفع عند الاستلام (بعد الفحص)</span>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                  paymentMethod === "instapay" ? "border-lime-500 bg-lime-50/50 text-neutral-900 ring-1 ring-lime-400" : "border-neutral-200 text-neutral-600"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="instapay"
                    checked={paymentMethod === "instapay"}
                    onChange={() => setPaymentMethod("instapay")}
                    className="accent-lime-500"
                  />
                  <span>إنستاباي / محفظة إلكترونية</span>
                </label>
              </div>
            </div>

            {/* Order Totals Card */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span>إجمالي الساعات ({totalCartCount}):</span>
                <span className="font-bold text-neutral-900">{cartSubtotal.toLocaleString("ar-EG")} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>مصاريف الشحن ({selectedGov.name}):</span>
                <span className="font-bold text-emerald-700">
                  {isFreeShipping || shippingFee === 0 ? "شحن مجاني 🔥" : `${shippingFee.toLocaleString("ar-EG")} ج.م`}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm sm:text-base font-extrabold text-neutral-900">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-emerald-800 text-base sm:text-lg">{cartTotal.toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>

            {/* Guarantees Note */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed flex items-center gap-2">
              <span className="text-base shrink-0">🛡️</span>
              <span>
                حق المعاينة مكفول: يمكنك فتح الشحنة وفحص ساعتك وتجربتها أمام مندوب الشحن قبل دفع أي مبلغ.
              </span>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={submittingOrder}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-extrabold h-12 rounded-xl text-sm sm:text-base shadow-lg shadow-lime-400/25 transition-transform active:scale-[0.99]"
            >
              {submittingOrder ? "جاري إنشاء مرجع الطلب..." : `تأكيد الطلب الفوري (${cartTotal.toLocaleString("ar-EG")} ج.م)`}
            </Button>

          </form>
        )}

      </div>
    </div>
  );
}
