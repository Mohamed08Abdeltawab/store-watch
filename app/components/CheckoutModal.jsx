"use client";

import { useCart, GOVERNORATES } from "../context/CartContext";

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

  return (
    <div className={`modal ${isCheckoutOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
      <div className="modal__scrim" onClick={() => setIsCheckoutOpen(false)}></div>
      <div className="modal__panel">
        <div className="modal__head">
          <div className="modal__title">
            تأكيد الطلب وحجز مرجع الفاتورة
            <span>سجل بياناتك وسيتم إنشاء كود مرجعي فريد #B10 للطلب وتأكيده عبر واتساب فوراً</span>
          </div>
          <button className="modal__close" type="button" onClick={() => setIsCheckoutOpen(false)} aria-label="إغلاق">✕</button>
        </div>

        {orderCompleted ? (
          <div style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#101211", margin: "0 0 0.5rem" }}>
              تم استلام طلبك وتسجيله بنجاح!
            </h3>
            <div
              style={{
                background: "#f0fdf4",
                border: "2px dashed #A3E635",
                borderRadius: "14px",
                padding: "1.2rem",
                margin: "1.2rem 0",
                color: "#166534"
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>كود مرجع الطلب الخاص بك:</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#14532d", letterSpacing: "1px" }}>
                #{orderCompleted.orderRef}
              </div>
              <small style={{ display: "block", marginTop: "4px" }}>احتفظ بهذا الكود لتتبع شحنتك مع خدمة العملاء</small>
            </div>

            <p style={{ fontSize: "0.86rem", color: "#64748b", lineHeight: "1.8", marginBottom: "1.5rem" }}>
              تم تجهيز رسالة الواتساب تلقائياً مع تفاصيل طلبك وكود المرجع. إذا لم تفتح تلقائياً اضغط على الزر أدناه:
            </p>

            <a
              href={orderCompleted.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--green"
              style={{ width: "100%", textDecoration: "none", marginBottom: "0.8rem", display: "inline-block" }}
            >
              متابعة الطلب على واتساب برقم #{orderCompleted.orderRef}
            </a>

            <button
              type="button"
              className="btn btn--ghost"
              style={{ color: "#101211", borderColor: "#cbd5e1", width: "100%" }}
              onClick={() => {
                setOrderCompleted(null);
                setIsCheckoutOpen(false);
              }}
            >
              العودة للمتجر
            </button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleOrderSubmit}>
            <div className={`field ${formErrors.name ? "has-err" : ""}`}>
              <label>الاسم بالكامل *</label>
              <input
                type="text"
                placeholder="اكتب اسمك الثلاثي هنا"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <div className="field__err">اكتب الاسم بشكل صحيح</div>
            </div>

            <div className={`field ${formErrors.phone ? "has-err" : ""}`}>
              <label>رقم الموبايل *</label>
              <input
                type="tel"
                placeholder="010xxxxxxxx أو 011/012/015"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
              <div className="field__err">رقم الموبايل يجب أن يتكون من 11 رقم ويبدأ بـ 01</div>
            </div>

            <div className="field">
              <label>المحافظة (حساب الشحن التلقائي) *</label>
              <select
                value={selectedGov.id}
                onChange={(e) => {
                  const gov = GOVERNORATES.find(g => g.id === e.target.value);
                  if (gov) setSelectedGov(gov);
                }}
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name} ({gov.shipping} ج.م · شحن خلال {gov.days})
                  </option>
                ))}
              </select>
            </div>

            <div className={`field ${formErrors.addr ? "has-err" : ""}`}>
              <label>العنوان بالتفصيل *</label>
              <input
                type="text"
                placeholder="المنطقة - الشارع - رقم العقار / الشقة"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />
              <div className="field__err">يرجى توضيح العنوان لضمان سرعة التسليم</div>
            </div>

            <div className="field">
              <label>طريقة الدفع</label>
              <div className="pay-methods">
                <label className={`pay-opt ${paymentMethod === "cod" ? "is-active" : ""}`}>
                  <input type="radio" name="pay" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <span>عند الاستلام</span>
                </label>
                <label className={`pay-opt ${paymentMethod === "instapay" ? "is-active" : ""}`}>
                  <input type="radio" name="pay" checked={paymentMethod === "instapay"} onChange={() => setPaymentMethod("instapay")} />
                  <span>إنستاباي / محفظة</span>
                </label>
                <label className={`pay-opt ${paymentMethod === "card" ? "is-active" : ""}`}>
                  <input type="radio" name="pay" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <span>بطاقة بنكية</span>
                </label>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>قيمة الساعات ({totalCartCount}):</span>
                <b>{cartSubtotal.toLocaleString("ar-EG")} ج.م</b>
              </div>
              <div className="summary-row">
                <span>مصاريف الشحن:</span>
                <b>{isFreeShipping ? "شحن مجاني 🎉" : `${shippingFee} ج.م`}</b>
              </div>
              <div className="summary-row summary-row--total">
                <span>الإجمالي شامل الشحن:</span>
                <b>{cartTotal.toLocaleString("ar-EG")} ج.م</b>
              </div>
            </div>

            <button type="submit" className="btn-submit-order" disabled={submittingOrder}>
              {submittingOrder ? "جاري إنشاء مرجع الطلب..." : `اضغط لتأكيد الطلب (${cartTotal.toLocaleString("ar-EG")} ج.م)`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
