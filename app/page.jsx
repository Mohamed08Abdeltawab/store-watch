"use client";

import { useState, useEffect } from "react";

const GOVERNORATES = [
  { id: "cairo", name: "القاهرة", shipping: 50, days: "24-48 ساعة" },
  { id: "giza", name: "الجيزة", shipping: 50, days: "24-48 ساعة" },
  { id: "alex", name: "الإسكندرية", shipping: 60, days: "48 ساعة" },
  { id: "delta", name: "محافظات الدلتا (المنصورة، طنطا، الزقازيق...)", shipping: 65, days: "48-72 ساعة" },
  { id: "canal", name: "مدن القناة (الإسماعيلية، بورسعيد، السويس)", shipping: 70, days: "48-72 ساعة" },
  { id: "upper", name: "محافظات الصعيد (بني سويف، أسيوط، سوهاج...)", shipping: 80, days: "3-4 أيام" },
  { id: "remote", name: "المحافظات الحدودية (البحر الأحمر، مطروح...)", shipping: 95, days: "4-5 أيام" }
];

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState(null);
  const [quickImgIndex, setQuickImgIndex] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedGov, setSelectedGov] = useState(GOVERNORATES[0]);
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formErrors, setFormErrors] = useState({});
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 18, mins: 42, secs: 15 });

  // Load Initial Data from SQLite API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(err => console.error(err));

    // LocalStorage sync
    const savedCart = localStorage.getItem("ben10_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    const savedWish = localStorage.getItem("ben10_wishlist");
    if (savedWish) {
      try { setWishlist(JSON.parse(savedWish)); } catch (e) {}
    }
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("ben10_cart", JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem("ben10_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Deal Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let s = prev.secs - 1;
        let m = prev.mins;
        let h = prev.hours;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; }
        return { hours: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function showToast(msg) {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  // Cart operations
  function addToCart(p, qty = 1, variant = "") {
    const vName = variant || (p.colors && p.colors[0] ? p.colors[0].n : "");
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id && item.variant === vName);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        variant: vName,
        qty
      }];
    });
    showToast(`تمت إضافة "${p.name}" إلى سلة التسوق`);
    setIsCartOpen(true);
  }

  function updateCartQty(index, delta) {
    setCart(prev => {
      const copy = [...prev];
      copy[index].qty += delta;
      if (copy[index].qty <= 0) {
        copy.splice(index, 1);
      }
      return copy;
    });
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast("تم حذف المنتج من السلة");
  }

  function toggleWishlist(pid) {
    setWishlist(prev => {
      const exists = prev.includes(pid);
      if (exists) {
        showToast("تمت الإزالة من المفضلة");
        return prev.filter(id => id !== pid);
      } else {
        showToast("تمت الإضافة إلى المفضلة ❤️");
        return [...prev, pid];
      }
    });
  }

  const cartSubtotal = cart.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const isFreeShipping = cartSubtotal >= 5000;
  const shippingFee = isFreeShipping ? 0 : selectedGov.shipping;
  const cartTotal = cartSubtotal + shippingFee;
  const totalCartCount = cart.reduce((sum, it) => sum + it.qty, 0);

  // Submit Order to API & WhatsApp
  async function handleOrderSubmit(e) {
    e.preventDefault();
    const errs = {};

    if (!customerName.trim()) errs.name = true;
    if (!customerPhone.trim() || !/^01[0125][0-9]{8}$/.test(customerPhone.trim())) errs.phone = true;
    if (!customerAddress.trim()) errs.addr = true;

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmittingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          governorate: selectedGov.name,
          address: customerAddress.trim(),
          payment_method: paymentMethod,
          items: cart,
          subtotal: cartSubtotal,
          shipping: shippingFee,
          total: cartTotal
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderCompleted(data);
        setCart([]);
        // Open WhatsApp directly with the generated link
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        }
      } else {
        alert(data.error || "حدث خطأ أثناء حفظ الطلب");
      }
    } catch (err) {
      alert("فشل الاتصال بقاعدة البيانات");
    } finally {
      setSubmittingOrder(false);
    }
  }

  // Filtered & Sorted products
  let filteredProducts = products.filter(p => {
    if (activeCategory !== "all" && p.cat !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sub && p.sub.toLowerCase().includes(q));
    }
    return true;
  });

  if (activeSort === "price-low") filteredProducts.sort((a, b) => a.price - b.price);
  else if (activeSort === "price-high") filteredProducts.sort((a, b) => b.price - a.price);
  else if (activeSort === "rating") filteredProducts.sort((a, b) => b.rating - a.rating);

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="announcement" aria-label="شريط الإعلانات">
        <div className="container announcement__inner">
          <div className="announcement__group">
            <span>⌚ <strong>متجر Ben10 للساعات:</strong> معاينة وفحص الساعة بالكامل مع المندوب قبل دفع أي مليم!</span>
            <span className="announcement__dot"></span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>شحن مجاني للطلبات أكثر من 5,000 ج.م</span>
          </div>
          <div className="announcement__group">
            <a className="announcement__link" href="/admin" target="_blank" style={{ color: "#A3E635", fontWeight: "700" }}>
              ⚙️ لوحة تحكم الأدمن
            </a>
            <span className="announcement__dot"></span>
            <a className="announcement__link" href="tel:+201065712366">
              خدمة العملاء: 0106 571 2366
            </a>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="site-header" id="siteHeader">
        <div className="container">
          <div className="header-main">
            <a className="brand" href="#">
              <span className="brand__mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"></circle>
                  <polyline points="12 7 12 12 15 14"></polyline>
                </svg>
              </span>
              <span className="brand__text">
                <span className="brand__name">BEN<span>10</span></span>
                <span className="brand__sub">WATCHES & CHRONO</span>
              </span>
            </a>

            <button className="simple-search-trigger" type="button" onClick={() => setIsSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>ابحث عن ساعة، كرونوغراف، أوتوماتيك، ذكية...</span>
            </button>

            <div className="header-actions">
              <a className="header-action header-action--wa" href="https://wa.me/201065712366" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"></path>
                </svg>
                <span>طلب واتساب</span>
              </a>

              <button className="header-action header-action--cart" type="button" onClick={() => setIsCartOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>السلة</span>
                {totalCartCount > 0 && (
                  <span className="header-action__count">{totalCartCount}</span>
                )}
              </button>
            </div>
          </div>

          <nav className="simple-desktop-nav" aria-label="أقسام الساعات">
            <a href="#hero" className="is-active">الرئيسية</a>
            <a href="#categories">أقسام الساعات</a>
            <a href="#catalog">تشكيلات Ben10</a>
            <a href="#deal" className="is-hot">🔥 عروض اليوم</a>
            <a href="#guarantees">لماذا Ben10؟</a>
            <a href="#reviews">آراء العملاء</a>
            <a href="/admin">لوحة الأدمن</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main">
        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="container hero__inner">
            <div className="hero__copy">
              <div className="eyebrow">
                <span className="eyebrow__dot"></span>
                <span>تشكيلات الساعات الحصرية لعام 2026</span>
              </div>

              <h1 className="hero__title">
                ساعات تصنع الفرق،<br />
                <span className="accent">وفخامة تليق بمعصمك</span>
              </h1>

              <p className="hero__lead">
                استكشف عالم Ben10 للساعات الفاخرة؛ تصاميم ميكانيكية وكلاسيكية ورياضية متقنة الصنع بزجاج ياقوتي لا يخدش، مع ميزة الفحص والمعاينة الكاملة قبل الدفع وضمان استبدال معتمد.
              </p>

              <div className="hero__actions">
                <a href="#catalog" className="btn btn--green">
                  <span>تصفح تشكيلات الساعات</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </a>
                <a href="#deal" className="btn btn--ghost">
                  <span>عروض التخفيض الحصرية</span>
                </a>
              </div>

              <div className="hero__proof">
                <div className="hero__stars">★★★★★</div>
                <div className="hero__proof-text">
                  <b>4.9 / 5 تقييم العملاء</b> · أكثر من 15,000 عميل راضٍ في جميع محافظات مصر
                </div>
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__ring"></div>
              <div className="float-chip float-chip--top">
                <div className="float-chip__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <b>ضمان معتمد 12 شهر</b>
                  <small>استبدال فوري بدون تعقيد</small>
                </div>
              </div>

              <div className="hero__arch">
                <div className="hero__arch-inner">
                  <img src="/img/ben10-classic-concept-01.png" alt="ساعة Ben10 رويال كلاسيك" />
                </div>
              </div>

              <div className="float-chip float-chip--bottom">
                <div className="float-chip__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <div>
                  <b>شحن سريع 48 ساعة</b>
                  <small>معاينة وفحص قبل الاستلام</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Ticker */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            <div className="ticker__group">
              <span className="ticker__item">فحص ومعاينة الساعة قبل الدفع للمندوب</span>
              <span className="ticker__item">ساعات أصلية 100% بضمان الوكيل المعتمد</span>
              <span className="ticker__item">تتبع الطلبات برقم مرجع فريد #B10 عبر الواتساب</span>
              <span className="ticker__item">شحن سريع لجميع محافظات مصر خلال 24 - 48 ساعة</span>
              <span className="ticker__item">علبة هدايا جلدية فاخرة مجانية مع كل ساعة</span>
            </div>
            <div className="ticker__group">
              <span className="ticker__item">فحص ومعاينة الساعة قبل الدفع للمندوب</span>
              <span className="ticker__item">ساعات أصلية 100% بضمان الوكيل المعتمد</span>
              <span className="ticker__item">تتبع الطلبات برقم مرجع فريد #B10 عبر الواتساب</span>
              <span className="ticker__item">شحن سريع لجميع محافظات مصر خلال 24 - 48 ساعة</span>
              <span className="ticker__item">علبة هدايا جلدية فاخرة مجانية مع كل ساعة</span>
            </div>
          </div>
        </div>

        {/* Bento Categories */}
        <section className="section" id="categories">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>أقسام الساعات المتخصصة</div>
                <h2 className="section-title">اختر فئتك المفضلة من <span>Ben10</span></h2>
              </div>
              <p className="section-note">
                صُممت كل مجموعة لتلبي احتياجات متباينة، من الساعات الكلاسيكية للمناسبات الرسمية إلى كرونوغراف السرعة وساعات المغامرات الرياضية.
              </p>
            </div>

            <div className="cat-grid-bento">
              <div className="cat-card-bento" onClick={() => { setActiveCategory("عادية (كلاسيكية)"); location.href = "#catalog"; }}>
                <img src="/img/ben10-classic-concept-01.png" alt="عادية (كلاسيكية)" />
                <div className="cat-card-bento__content">
                  <span className="cat-card-bento__tag">الأكثر شهرة وفخامة</span>
                  <h3 className="cat-card-bento__title">عادية (كلاسيكية)</h3>
                  <p className="cat-card-bento__sub">ستانلس ستيل مصقول وتصاميم ملكية فاخرة</p>
                </div>
              </div>

              <div className="cat-card-bento" onClick={() => { setActiveCategory("كرونوغراف (Chronograph)"); location.href = "#catalog"; }}>
                <img src="/img/ben10-chronograph-concept-01.png" alt="كرونوغراف (Chronograph)" />
                <div className="cat-card-bento__content">
                  <span className="cat-card-bento__tag">دقة هندسية</span>
                  <h3 className="cat-card-bento__title">كرونوغراف (Chronograph)</h3>
                  <p className="cat-card-bento__sub">3 مواني فرعية وتاكيميتر لقياس السرعة</p>
                </div>
              </div>

              <div className="cat-card-bento" onClick={() => { setActiveCategory("رقمية (Digital)"); location.href = "#catalog"; }}>
                <img src="/img/ben10-sport-concept-01.png" alt="رقمية (Digital)" />
                <div className="cat-card-bento__content">
                  <span className="cat-card-bento__tag">عصرية وعملية</span>
                  <h3 className="cat-card-bento__title">رقمية (Digital)</h3>
                  <p className="cat-card-bento__sub">شاشات رقمية دقيقة وتنبيهات متعددة</p>
                </div>
              </div>

              <div className="cat-card-bento" onClick={() => { setActiveCategory("ذكية (Smartwatch)"); location.href = "#catalog"; }}>
                <img src="/img/ben10-sport-concept-01.png" alt="ذكية (Smartwatch)" />
                <div className="cat-card-bento__content">
                  <span className="cat-card-bento__tag">شاشة AMOLED</span>
                  <h3 className="cat-card-bento__title">ذكية (Smartwatch)</h3>
                  <p className="cat-card-bento__sub">مكالمات وتتبع صحي وبطارية طويلة</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Catalog */}
        <section className="section catalog-section" id="catalog">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>الكتالوج الكامل</div>
                <h2 className="section-title">ساعات <span>Ben10</span> المتاحة في قاعدة البيانات</h2>
              </div>
              <p className="section-note">
                جميع الساعات مصحوبة ببطاقة ضمان رسمية، علبة فاخرة مناسبة للإهداء، ومشمولة بسياسة المعاينة قبل الاستلام.
              </p>
            </div>

            <div className="catalog-toolbar">
              <div className="filter-tabs">
                {[
                  { id: "all", label: "جميع الساعات" },
                  { id: "عادية (كلاسيكية)", label: "عادية (كلاسيكية)" },
                  { id: "رقمية (Digital)", label: "رقمية (Digital)" },
                  { id: "ذكية (Smartwatch)", label: "ذكية (Smartwatch)" },
                  { id: "كرونوغراف (Chronograph)", label: "كرونوغراف (Chronograph)" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`filter-tab ${activeCategory === tab.id ? "is-active" : ""}`}
                    onClick={() => setActiveCategory(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <label htmlFor="sortSelect" style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--muted)" }}>ترتيب حسب:</label>
                <select
                  className="sort-select"
                  id="sortSelect"
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                >
                  <option value="featured">المميز أولاً</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-grid">
              {filteredProducts.map(p => {
                const isFav = wishlist.includes(p.id);
                const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0;

                return (
                  <article className="p-card" key={p.id}>
                    <div className="p-card__frame">
                      <img className="p-card__img" src={p.image} alt={p.name} loading="lazy" />
                      <div className="p-card__badges">
                        {p.badge_text && <span className="badge badge--best">{p.badge_text}</span>}
                        {discount > 0 && <span className="badge badge--sale">خصم {discount}%</span>}
                      </div>
                      <button
                        type="button"
                        className={`p-card__fav ${isFav ? "is-active" : ""}`}
                        onClick={() => toggleWishlist(p.id)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <div className="p-card__hover-bar">
                        <button type="button" className="p-card__btn-quick" onClick={() => { setQuickProduct(p); setQuickImgIndex(0); }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>نظرة سريعة</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-card__body">
                      <div className="p-card__meta">
                        <span>{p.cat} {p.target_audience ? `· ${p.target_audience}` : ""}</span>
                        <span className="p-card__rating">
                          ★ <b>{p.rating}</b> <small style={{ color: "var(--muted)" }}>({p.reviews})</small>
                        </span>
                      </div>

                      <h3 className="p-card__title" onClick={() => { setQuickProduct(p); setQuickImgIndex(0); }} style={{ cursor: "pointer" }}>
                        {p.name}
                      </h3>
                      <p className="p-card__sub">{p.sub}</p>

                      <div className="p-card__foot">
                        <div className="price">
                          {p.old_price && <s>{Number(p.old_price).toLocaleString("ar-EG")} ج.م</s>}
                          <div className="price__now">
                            <b>{Number(p.price).toLocaleString("ar-EG")}</b>
                            <span>ج.م</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="p-card__add-btn"
                          aria-label="إضافة إلى السلة"
                          onClick={() => addToCart(p, 1)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Deal Section */}
        <section className="section deal-section" id="deal">
          <div className="container deal__inner">
            <div>
              <div className="eyebrow" style={{ background: "rgba(163,230,53,0.18)" }}>عرض لفترة محدودة</div>
              <h2 className="deal__title">
                ساعة Ben10 أبكس كرونوغراف سبيد<br />
                <span>بخصم استثنائي 700 ج.م</span>
              </h2>
              <p className="deal__desc">
                احصل على أقوى ساعات الكرونوغراف بهيكل التيتانيوم المقاوم للخدش وزجاج السافاير الياقوتي، مع شحن مجاني لكافة المحافظات وعلبة خشبية فاخرة للإهداء.
              </p>

              <div className="countdown">
                <div className="cd-box">
                  <b>{String(timeLeft.hours).padStart(2, "0")}</b>
                  <span>ساعة</span>
                </div>
                <div className="cd-box">
                  <b>{String(timeLeft.mins).padStart(2, "0")}</b>
                  <span>دقيقة</span>
                </div>
                <div className="cd-box">
                  <b>{String(timeLeft.secs).padStart(2, "0")}</b>
                  <span>ثانية</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.9rem", marginTop: "2rem" }}>
                <button
                  type="button"
                  className="btn btn--green"
                  onClick={() => {
                    const apex = products.find(p => p.id === "ben10-apex-chrono") || products[0];
                    if (apex) {
                      addToCart(apex, 1);
                      setIsCheckoutOpen(true);
                    }
                  }}
                >
                  اطلب العرض الآن بـ 4,890 ج.م
                </button>
              </div>
            </div>

            <div className="deal__poster">
              <div className="deal__stamp">
                <b>وفر</b>
                <span>700 ج.م</span>
              </div>
              <img src="/img/ben10-chronograph-concept-01.png" alt="ساعة Ben10 أبكس كرونوغراف" />
            </div>
          </div>
        </section>
      </main>

      {/* Slide-out Cart Drawer */}
      <div className={`drawer ${isCartOpen ? "is-open" : ""}`} role="dialog">
        <div className="drawer__scrim" onClick={() => setIsCartOpen(false)}></div>
        <aside className="drawer__panel">
          <div className="drawer__head">
            <div className="drawer__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>سلة التسوق ({totalCartCount})</span>
            </div>
            <button className="drawer__close" type="button" onClick={() => setIsCartOpen(false)}>✕</button>
          </div>

          <div className="drawer__progress">
            <div className="drawer__progress-text">
              {isFreeShipping
                ? "🎉 مبروك! طلبك مؤهل لشحن مجاني بالكامل"
                : `متبقي ${(5000 - cartSubtotal).toLocaleString("ar-EG")} ج.م على الشحن المجاني`}
            </div>
            <div className="drawer__progress-bar">
              <div
                className="drawer__progress-fill"
                style={{ width: `${Math.min(100, (cartSubtotal / 5000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="drawer__body">
            {cart.length === 0 ? (
              <div className="drawer__empty">
                <h3>سلتك فارغة حالياً</h3>
                <p>تصفح كتالوج ساعات Ben10 واختر ساعتك المميزة</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  <img className="cart-item__img" src={item.image} alt={item.name} />
                  <div className="cart-item__info">
                    <h4 className="cart-item__name">{item.name}</h4>
                    <div className="cart-item__price">{Number(item.price).toLocaleString("ar-EG")} ج.م</div>
                    <div className="cart-item__controls">
                      <div className="qty-stepper">
                        <button type="button" className="qty-btn" onClick={() => updateCartQty(idx, -1)}>-</button>
                        <span className="qty-val">{item.qty}</span>
                        <button type="button" className="qty-btn" onClick={() => updateCartQty(idx, 1)}>+</button>
                      </div>
                      <button type="button" className="cart-item__del" onClick={() => removeFromCart(idx)}>حذف</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="drawer__foot">
              <div className="drawer__subtotal">
                <span>إجمالي الساعات:</span>
                <b>{cartSubtotal.toLocaleString("ar-EG")} ج.م</b>
              </div>
              <button
                type="button"
                className="btn btn--green"
                style={{ width: "100%" }}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              >
                متابعة تأكيد الطلب الفوري (معاينة قبل الدفع)
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Direct Fast Checkout Modal with Order Reference and WhatsApp */}
      <div className={`modal ${isCheckoutOpen ? "is-open" : ""}`} role="dialog">
        <div className="modal__scrim" onClick={() => setIsCheckoutOpen(false)}></div>
        <div className="modal__panel">
          <div className="modal__head">
            <div className="modal__title">
              تأكيد الطلب وحجز مرجع الفاتورة
              <span>سجل بياناتك وسيتم توليد كود مرجعي فريد #B10 للطلب والتواصل عبر واتساب فوراً</span>
            </div>
            <button className="modal__close" type="button" onClick={() => setIsCheckoutOpen(false)}>✕</button>
          </div>

          {orderCompleted ? (
            <div style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🎉</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#101211", margin: "0 0 0.5rem" }}>
                تم استلام طلبك وتسجيله في قاعدة البيانات!
              </h3>
              <div style={{
                background: "#f0fdf4",
                border: "2px dashed #A3E635",
                borderRadius: "14px",
                padding: "1.2rem",
                margin: "1.2rem 0",
                color: "#166534"
              }}>
                <span style={{ fontSize: "0.85rem" }}>كود مرجع الطلب الخاص بك:</span>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#14532d", letterSpacing: "1px" }}>
                  #{orderCompleted.orderRef}
                </div>
                <small style={{ display: "block", marginTop: "4px" }}>احتفظ بهذا الكود لتتبع شحنتك مع خدمة العملاء</small>
              </div>

              <p style={{ fontSize: "0.86rem", color: "#64748b", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                تم فتح محادثة الواتساب تلقائياً مع تفاصيل طلبك وكود المرجع. إذا لم تفتح تلقائياً اضغط على الزر أدناه:
              </p>

              <a
                href={orderCompleted.whatsappUrl}
                target="_blank"
                className="btn btn--green"
                style={{ width: "100%", textDecoration: "none", marginBottom: "0.8rem" }}
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

      {/* Quick View Modal */}
      {quickProduct && (
        <div className="modal is-open" role="dialog">
          <div className="modal__scrim" onClick={() => setQuickProduct(null)}></div>
          <div className="modal__panel" style={{ width: "min(740px, 100%)" }}>
            <div className="modal__head">
              <div className="modal__title">تفاصيل ومواصفات الساعة</div>
              <button className="modal__close" type="button" onClick={() => setQuickProduct(null)}>✕</button>
            </div>
            <div className="quick-view-grid">
              <div className="quick-view-media" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ position: "relative", width: "100%", background: "#fff", borderRadius: "12px", overflow: "hidden", display: "grid", placeItems: "center", minHeight: "260px", padding: "10px" }}>
                  <img
                    src={(quickProduct.images && quickProduct.images[quickImgIndex]) || quickProduct.image}
                    alt={quickProduct.name}
                    style={{ maxHeight: "260px", maxWidth: "100%", objectFit: "contain", transition: "all 0.2s ease" }}
                  />

                  {quickProduct.images && quickProduct.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setQuickImgIndex(prev => (prev > 0 ? prev - 1 : quickProduct.images.length - 1))}
                        style={{
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          border: 0,
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "0.85rem",
                          zIndex: 3
                        }}
                      >
                        ◀
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickImgIndex(prev => (prev < quickProduct.images.length - 1 ? prev + 1 : 0))}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          border: 0,
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "0.85rem",
                          zIndex: 3
                        }}
                      >
                        ▶
                      </button>

                      <span style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.75)",
                        color: "#A3E635",
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "999px"
                      }}>
                        {quickImgIndex + 1} / {quickProduct.images.length}
                      </span>
                    </>
                  )}
                </div>

                {quickProduct.images && quickProduct.images.length > 1 && (
                  <div style={{
                    display: "flex",
                    gap: "6px",
                    overflowX: "auto",
                    paddingBottom: "4px"
                  }}>
                    {quickProduct.images.slice(0, 10).map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuickImgIndex(idx)}
                        style={{
                          flexShrink: 0,
                          width: "50px",
                          height: "50px",
                          background: "#fff",
                          border: quickImgIndex === idx ? "2px solid #A3E635" : "1px solid rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          padding: "2px",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          boxShadow: quickImgIndex === idx ? "0 0 10px rgba(163,230,53,0.3)" : "none",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <img src={imgUrl} alt={`صورة ${idx + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="quick-view-details">
                <h2 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.4rem" }}>{quickProduct.name}</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.8rem" }}>{quickProduct.sub}</p>
                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--ink)", marginBottom: "1rem" }}>
                  {Number(quickProduct.price).toLocaleString("ar-EG")} ج.م
                </div>
                <ul className="specs-list">
                  <li><span>نوع الساعة:</span> <b>{quickProduct.cat}</b></li>
                  {quickProduct.target_audience && <li><span>الفئة المستهدفة:</span> <b>{quickProduct.target_audience}</b></li>}
                  {quickProduct.color && <li><span>لون الساعة:</span> <b>{quickProduct.color}</b></li>}
                  <li><span>الضمان:</span> <b>{quickProduct.warranty || "ضمان 12 شهر معتمد"}</b></li>
                </ul>

                {(quickProduct.description || quickProduct.overview) && (
                  <div style={{ marginTop: "0.9rem", padding: "0.85rem", background: "rgba(0,0,0,0.03)", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: "800", marginBottom: "0.3rem", color: "var(--ink)" }}>الوصف الكامل للساعة:</div>
                    <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: "1.7", margin: 0, whiteSpace: "pre-line" }}>
                      {quickProduct.description || quickProduct.overview}
                    </p>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem" }}>
                  <button
                    type="button"
                    className="btn btn--green"
                    style={{ flex: 1 }}
                    onClick={() => {
                      addToCart(quickProduct, 1);
                      setQuickProduct(null);
                    }}
                  >
                    أضف إلى السلة
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ color: "var(--ink)", borderColor: "var(--line-strong)" }}
                    onClick={() => {
                      addToCart(quickProduct, 1);
                      setQuickProduct(null);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    طلب فوري الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay is-open" role="dialog">
          <div className="search-panel">
            <div className="search-panel__head">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ben10-green)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                placeholder="اكتب اسم الساعة أو الموديل..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} style={{ color: "#fff", padding: "0.5rem" }}>✕</button>
            </div>

            <div className="search-popular">
              <span>كلمات شائعة:</span>
              {["كرونوغراف", "رويال كلاسيك", "تيتانيوم", "أوتوماتيك سكيلتون", "ساعة ذكية AMOLED"].map(w => (
                <button key={w} type="button" onClick={() => setSearchQuery(w)}>{w}</button>
              ))}
            </div>

            <div className="search-results-grid">
              {filteredProducts.map(p => (
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
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setQuickProduct(p);
                    setIsSearchOpen(false);
                  }}
                >
                  <img src={p.image} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "2px" }} />
                  <div>
                    <h4 style={{ fontSize: "0.86rem", color: "#fff", fontWeight: "700", margin: "0 0 2px" }}>{p.name}</h4>
                    <span style={{ fontSize: "0.75rem", color: "#A3E635", fontWeight: "800" }}>{Number(p.price).toLocaleString("ar-EG")} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div className="toast" key={t.id}>
            ✓ <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}
