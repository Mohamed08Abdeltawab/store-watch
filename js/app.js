/**
 * Ben10 Watch Store - Interactive Application Logic
 * Reverse-engineered interactive e-commerce core:
 * - Dynamic Catalog Renderer with Color Switchers
 * - Reactive Cart Drawer with LocalStorage Sync & Free Shipping Meter
 * - Direct Fast Checkout Engine with Egyptian Governorate Shipping Calculations
 * - One-Click WhatsApp Order Builder
 * - Quick View Modal & Technical Specifications Inspector
 * - Instant Live Search Overlay with Keyword Tags
 * - Wishlist Favorites Management
 * - Deal of the Day Countdown Timer
 * - Toast Notification System
 */

(function () {
  "use strict";

  // State Management
  const state = {
    cart: JSON.parse(localStorage.getItem("ben10_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("ben10_wishlist") || "[]"),
    activeCategory: "all",
    activeSort: "featured",
    searchQuery: "",
    selectedGovernorate: STORE_CONFIG.governorates[0],
    selectedPayment: "cod",
    activeQuickProduct: null
  };

  // DOM Elements Cache
  const el = {
    productsGrid: document.getElementById("productsGrid"),
    filterTabs: document.getElementById("filterTabs"),
    sortSelect: document.getElementById("sortSelect"),
    cartTrigger: document.getElementById("cartTrigger"),
    cartCount: document.getElementById("cartCount"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartClose: document.getElementById("cartClose"),
    cartBody: document.getElementById("cartBody"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartShippingBar: document.getElementById("cartShippingBar"),
    cartShippingFill: document.getElementById("cartShippingFill"),
    cartShippingText: document.getElementById("cartShippingText"),
    btnCheckoutDrawer: document.getElementById("btnCheckoutDrawer"),
    checkoutModal: document.getElementById("checkoutModal"),
    checkoutClose: document.getElementById("checkoutClose"),
    checkoutForm: document.getElementById("checkoutForm"),
    coGovernorate: document.getElementById("co-governorate"),
    coSubtotal: document.getElementById("co-subtotal"),
    coShipping: document.getElementById("co-shipping"),
    coTotal: document.getElementById("co-total"),
    btnSubmitOrder: document.getElementById("btnSubmitOrder"),
    btnWaOrder: document.getElementById("btnWaOrder"),
    quickViewModal: document.getElementById("quickViewModal"),
    quickViewClose: document.getElementById("quickViewClose"),
    quickViewContent: document.getElementById("quickViewContent"),
    searchTrigger: document.getElementById("searchTrigger"),
    searchOverlay: document.getElementById("searchOverlay"),
    searchClose: document.getElementById("searchClose"),
    searchInput: document.getElementById("searchInput"),
    searchResults: document.getElementById("searchResults"),
    toastWrap: document.getElementById("toastWrap"),
    scrollTopBtn: document.getElementById("scrollTopBtn"),
    cdHours: document.getElementById("cd-hours"),
    cdMins: document.getElementById("cd-mins"),
    cdSecs: document.getElementById("cd-secs")
  };

  /* ==========================================================================
     Helper Functions
     ========================================================================== */
  function formatMoney(amount) {
    return Number(amount).toLocaleString("ar-EG") + " " + STORE_CONFIG.currency;
  }

  function showToast(message, icon = "check") {
    if (!el.toastWrap) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    el.toastWrap.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  /* ==========================================================================
     Product Catalog Rendering
     ========================================================================== */
  function renderProducts() {
    if (!el.productsGrid) return;

    let filtered = PRODUCTS.filter(p => {
      if (state.activeCategory !== "all" && p.cat !== state.activeCategory) return false;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q);
      }
      return true;
    });

    if (state.activeSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.activeSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.activeSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
      el.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem;">
          <p style="color: var(--muted); font-size: 1.1rem; font-weight: 700;">لا توجد ساعات مطابقة لخيارات البحث الحالية.</p>
          <button type="button" class="btn btn--green" style="margin-top: 1rem;" onclick="window.ben10App.resetFilters()">عرض كل الساعات</button>
        </div>
      `;
      return;
    }

    el.productsGrid.innerHTML = filtered.map(p => {
      const isFav = state.wishlist.includes(p.id);
      const discount = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;

      let badgeHtml = "";
      if (p.tag === "best") {
        badgeHtml = `<span class="badge badge--best">${p.badgeText || "الأكثر طلباً"}</span>`;
      } else if (p.tag === "sale") {
        badgeHtml = `<span class="badge badge--sale">${p.badgeText || `خصم ${discount}%`}</span>`;
      } else if (p.tag === "new") {
        badgeHtml = `<span class="badge badge--new">${p.badgeText || "وصل حديثاً"}</span>`;
      }

      const colorsHtml = (p.colors || []).map((c, i) => `
        <span class="color-dot ${i === 0 ? "is-active" : ""}" 
              style="background-color: ${c.h};" 
              title="${c.n}"
              data-product-id="${p.id}"
              data-color-index="${i}"></span>
      `).join("");

      return `
        <article class="p-card" data-id="${p.id}">
          <div class="p-card__frame">
            <img class="p-card__img" src="${p.image}" alt="${p.name}" loading="lazy" id="img-${p.id}">
            <div class="p-card__badges">
              ${badgeHtml}
            </div>
            <button type="button" class="p-card__fav ${isFav ? "is-active" : ""}" 
                    aria-label="إضافة إلى المفضلة" 
                    onclick="window.ben10App.toggleWishlist('${p.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div class="p-card__hover-bar">
              <button type="button" class="p-card__btn-quick" onclick="window.ben10App.openQuickView('${p.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>نظرة سريعة</span>
              </button>
            </div>
          </div>

          <div class="p-card__body">
            <div class="p-card__meta">
              <span>${p.brand}</span>
              <span class="p-card__rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <b>${p.rating}</b>
                <small style="color: var(--muted);">(${p.reviews})</small>
              </span>
            </div>

            <h3 class="p-card__title" onclick="window.ben10App.openQuickView('${p.id}')" style="cursor: pointer;">
              ${p.name}
            </h3>
            <p class="p-card__sub">${p.sub}</p>

            <div class="p-card__colors">
              ${colorsHtml}
            </div>

            <div class="p-card__foot">
              <div class="price">
                ${p.old ? `<s>${formatMoney(p.old)}</s>` : ""}
                <div class="price__now">
                  <b>${p.price.toLocaleString("ar-EG")}</b>
                  <span>${STORE_CONFIG.currency}</span>
                </div>
              </div>

              <button type="button" class="p-card__add-btn" 
                      aria-label="إضافة إلى السلة" 
                      onclick="window.ben10App.addToCart('${p.id}', 1)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Attach color switcher listeners
    document.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", e => {
        const pid = dot.dataset.productId;
        const cidx = parseInt(dot.dataset.colorIndex, 10);
        const prod = PRODUCTS.find(p => p.id === pid);
        if (prod && prod.colors[cidx]) {
          const imgEl = document.getElementById(`img-${pid}`);
          if (imgEl && prod.colors[cidx].img) {
            imgEl.src = prod.colors[cidx].img;
          }
          dot.parentElement.querySelectorAll(".color-dot").forEach(d => d.classList.remove("is-active"));
          dot.classList.add("is-active");
        }
      });
    });
  }

  /* ==========================================================================
     Cart Management & Drawer
     ========================================================================== */
  function saveCart() {
    localStorage.setItem("ben10_cart", JSON.stringify(state.cart));
    updateCartUI();
  }

  function addToCart(productId, qty = 1, selectedVariant = "") {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    const variantName = selectedVariant || (prod.colors && prod.colors[0] ? prod.colors[0].n : "");
    const existing = state.cart.find(item => item.id === productId && item.variant === variantName);

    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        variant: variantName,
        qty: qty
      });
    }

    saveCart();
    showToast(`تمت إضافة "${prod.name}" إلى سلة التسوق`);
    openCartDrawer();

    if (el.cartCount) {
      el.cartCount.classList.remove("bump");
      void el.cartCount.offsetWidth;
      el.cartCount.classList.add("bump");
    }
  }

  function updateQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }

  function removeFromCart(index) {
    if (!state.cart[index]) return;
    const removedName = state.cart[index].name;
    state.cart.splice(index, 1);
    saveCart();
    showToast(`تم حذف "${removedName}" من السلة`);
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = getCartSubtotal();

    if (el.cartCount) {
      el.cartCount.textContent = totalItems;
      el.cartCount.style.display = totalItems > 0 ? "grid" : "none";
    }

    if (!el.cartBody) return;

    // Free shipping threshold progress bar
    if (el.cartShippingBar) {
      const needed = STORE_CONFIG.freeShippingThreshold - subtotal;
      if (needed <= 0) {
        el.cartShippingText.innerHTML = `🎉 مبروك! طلبك مؤهل لـ <b>شحن مجاني بالكامل</b>!`;
        el.cartShippingFill.style.width = "100%";
      } else {
        const pct = Math.min(100, Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100));
        el.cartShippingText.innerHTML = `متبقي <b>${needed.toLocaleString("ar-EG")} ${STORE_CONFIG.currency}</b> للحصول على <b>شحن مجاني</b>`;
        el.cartShippingFill.style.width = `${pct}%`;
      }
    }

    if (state.cart.length === 0) {
      el.cartBody.innerHTML = `
        <div class="drawer__empty">
          <div class="drawer__empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.4rem;">سلتك فارغة حالياً</h3>
          <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 1.4rem;">استكشف تشكيلات Ben10 الحصرية واختر ساعتك المفضلة</p>
          <button type="button" class="btn btn--green" onclick="window.ben10App.closeCartDrawer()">تصفح الساعات الآن</button>
        </div>
      `;
      if (el.cartSubtotal) el.cartSubtotal.textContent = formatMoney(0);
      if (el.btnCheckoutDrawer) el.btnCheckoutDrawer.disabled = true;
      return;
    }

    if (el.btnCheckoutDrawer) el.btnCheckoutDrawer.disabled = false;
    if (el.cartSubtotal) el.cartSubtotal.textContent = formatMoney(subtotal);

    el.cartBody.innerHTML = state.cart.map((item, idx) => `
      <div class="cart-item">
        <img class="cart-item__img" src="${item.image}" alt="${item.name}">
        <div class="cart-item__info">
          <h4 class="cart-item__name">${item.name}</h4>
          ${item.variant ? `<div class="cart-item__variant">اللون: ${item.variant}</div>` : ""}
          <div class="cart-item__price">${formatMoney(item.price)}</div>
          <div class="cart-item__controls">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" onclick="window.ben10App.updateQty(${idx}, -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button type="button" class="qty-btn" onclick="window.ben10App.updateQty(${idx}, 1)">+</button>
            </div>
            <button type="button" class="cart-item__del" onclick="window.ben10App.removeFromCart(${idx})">حذف</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function openCartDrawer() {
    if (el.cartDrawer) {
      el.cartDrawer.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
  }

  function closeCartDrawer() {
    if (el.cartDrawer) {
      el.cartDrawer.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  }

  /* ==========================================================================
     Direct Fast Checkout Modal & Calculation
     ========================================================================== */
  function populateGovernorates() {
    if (!el.coGovernorate) return;
    el.coGovernorate.innerHTML = STORE_CONFIG.governorates.map(gov => `
      <option value="${gov.id}" data-shipping="${gov.shipping}">
        ${gov.name} (${gov.shipping === 0 ? "شحن مجاني" : gov.shipping + " ج.م"} · توصيل خلال ${gov.days})
      </option>
    `).join("");

    el.coGovernorate.addEventListener("change", () => {
      const selectedId = el.coGovernorate.value;
      const gov = STORE_CONFIG.governorates.find(g => g.id === selectedId);
      if (gov) {
        state.selectedGovernorate = gov;
        updateCheckoutSummary();
      }
    });
  }

  function updateCheckoutSummary() {
    const subtotal = getCartSubtotal();
    const isFree = subtotal >= STORE_CONFIG.freeShippingThreshold;
    const shipping = isFree ? 0 : (state.selectedGovernorate ? state.selectedGovernorate.shipping : 50);
    const total = subtotal + shipping;

    if (el.coSubtotal) el.coSubtotal.textContent = formatMoney(subtotal);
    if (el.coShipping) {
      el.coShipping.innerHTML = isFree ? `<b style="color: var(--ben10-forest)">شحن مجاني</b>` : formatMoney(shipping);
    }
    if (el.coTotal) el.coTotal.textContent = formatMoney(total);
    if (el.btnSubmitOrder) el.btnSubmitOrder.textContent = `اضغط لتأكيد الطلب (${formatMoney(total)})`;
  }

  function openCheckoutModal(singleProductId = null) {
    closeCartDrawer();
    closeQuickView();

    if (singleProductId) {
      const prod = PRODUCTS.find(p => p.id === singleProductId);
      if (prod) {
        // If single order, check if already in cart, otherwise add it
        const inCart = state.cart.some(item => item.id === prod.id);
        if (!inCart) {
          state.cart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.image,
            variant: prod.colors && prod.colors[0] ? prod.colors[0].n : "",
            qty: 1
          });
          saveCart();
        }
      }
    }

    if (state.cart.length === 0) {
      showToast("سلة التسوق فارغة، يرجى اختيار ساعة أولاً!");
      return;
    }

    updateCheckoutSummary();

    if (el.checkoutModal) {
      el.checkoutModal.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
  }

  function closeCheckoutModal() {
    if (el.checkoutModal) {
      el.checkoutModal.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  }

  function handleOrderSubmission(e) {
    if (e) e.preventDefault();

    const name = document.getElementById("co-name")?.value.trim();
    const phone = document.getElementById("co-phone")?.value.trim();
    const address = document.getElementById("co-addr")?.value.trim();

    let hasErr = false;

    if (!name) {
      document.getElementById("field-name")?.classList.add("has-err");
      hasErr = true;
    } else {
      document.getElementById("field-name")?.classList.remove("has-err");
    }

    const egPhoneRegex = /^01[0125][0-9]{8}$/;
    if (!phone || !egPhoneRegex.test(phone)) {
      document.getElementById("field-phone")?.classList.add("has-err");
      hasErr = true;
    } else {
      document.getElementById("field-phone")?.classList.remove("has-err");
    }

    if (!address) {
      document.getElementById("field-addr")?.classList.add("has-err");
      hasErr = true;
    } else {
      document.getElementById("field-addr")?.classList.remove("has-err");
    }

    if (hasErr) return;

    const subtotal = getCartSubtotal();
    const isFree = subtotal >= STORE_CONFIG.freeShippingThreshold;
    const shipping = isFree ? 0 : state.selectedGovernorate.shipping;
    const total = subtotal + shipping;

    const orderData = {
      orderId: "B10-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      customer: { name, phone, address, governorate: state.selectedGovernorate.name },
      payment: state.selectedPayment,
      items: [...state.cart],
      subtotal,
      shipping,
      total
    };

    // Reset Cart
    state.cart = [];
    saveCart();
    closeCheckoutModal();

    // Show Success Modal / Dialog
    alert(`🎉 تم تأكيد طلبك بنجاح يا ${name}!\n\nرقم الطلب: ${orderData.orderId}\nالإجمالي شامل الشحن: ${total.toLocaleString("ar-EG")} ج.م\n\nسيتواصل معك فريق خدمة عملاء Ben10 فوراً لتأكيد ميعاد التسليم.`);
  }

  function handleWhatsAppOrder() {
    const name = document.getElementById("co-name")?.value.trim() || "عميل Ben10";
    const phone = document.getElementById("co-phone")?.value.trim() || "غير محدد";
    const address = document.getElementById("co-addr")?.value.trim() || "غير محدد";
    const gov = state.selectedGovernorate.name;

    const subtotal = getCartSubtotal();
    const isFree = subtotal >= STORE_CONFIG.freeShippingThreshold;
    const shipping = isFree ? 0 : state.selectedGovernorate.shipping;
    const total = subtotal + shipping;

    let itemsText = state.cart.map((item, i) => `${i + 1}. ${item.name} (${item.variant}) × ${item.qty} = ${(item.price * item.qty).toLocaleString("ar-EG")} ج.م`).join("\n");

    const message = `مرحباً متجر Ben10 للساعات ⌚، أرغب بتأكيد الطلب التالي:

📋 *بيانات العميل:*
• الاسم: ${name}
• الموبايل: ${phone}
• المحافظة: ${gov}
• العنوان بالتفصيل: ${address}

📦 *تفاصيل الساعات:*
${itemsText}

💰 *الحساب:*
• إجمالي الساعات: ${subtotal.toLocaleString("ar-EG")} ج.م
• مصاريف الشحن: ${isFree ? "مجاني" : shipping + " ج.م"}
• الإجمالي المطلوب دفعه: *${total.toLocaleString("ar-EG")} ج.م*

طريقة الدفع: الدفع عند الاستلام بعد المعاينة`;

    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  /* ==========================================================================
     Quick View Modal
     ========================================================================== */
  function openQuickView(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod || !el.quickViewContent) return;

    state.activeQuickProduct = prod;

    const discount = prod.old ? Math.round(((prod.old - prod.price) / prod.old) * 100) : 0;

    el.quickViewContent.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-media">
          <img src="${prod.image}" alt="${prod.name}" id="qv-main-img">
        </div>

        <div class="quick-view-details">
          <div style="font-size: 0.72rem; color: var(--ben10-forest); font-weight: 800; margin-bottom: 0.2rem;">
            ${prod.brand} · ${CATEGORIES.find(c => c.id === prod.cat)?.name || ""}
          </div>
          <h2 style="font-size: 1.35rem; font-weight: 800; line-height: 1.3; margin-bottom: 0.4rem;">
            ${prod.name}
          </h2>
          <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.8rem;">
            ${prod.sub}
          </p>

          <div style="display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 1rem;">
            <b style="font-size: 1.5rem; font-weight: 800; color: var(--ink);">
              ${prod.price.toLocaleString("ar-EG")} <span style="font-size: 0.8rem; font-weight: 700;">${STORE_CONFIG.currency}</span>
            </b>
            ${prod.old ? `<s style="color: var(--muted-light); font-size: 0.9rem;">${formatMoney(prod.old)}</s>` : ""}
            ${discount > 0 ? `<span class="badge badge--sale">وفر ${discount}%</span>` : ""}
          </div>

          <p style="font-size: 0.82rem; line-height: 1.8; color: var(--text); margin-bottom: 1rem;">
            ${prod.overview || ""}
          </p>

          <ul class="specs-list">
            <li><span>نوع الماكينة:</span> <b>${prod.specs?.movement || "كوارتز ياباني"}</b></li>
            <li><span>خامة الهيكل:</span> <b>${prod.specs?.case || "ستانلس ستيل 316L"}</b></li>
            <li><span>نوع الزجاج:</span> <b>${prod.specs?.glass || "ياقوت كريستال ضد الخدش"}</b></li>
            <li><span>قطر الميناء:</span> <b>${prod.specs?.diameter || "42 ملم"}</b></li>
            <li><span>مقاومة الماء:</span> <b>${prod.specs?.waterResist || "5 ATM"}</b></li>
            <li><span>الضمان:</span> <b>${prod.specs?.warranty || "ضمان 12 شهر"}</b></li>
          </ul>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.2rem;">
            <button type="button" class="btn btn--green" style="flex: 1;" onclick="window.ben10App.addToCart('${prod.id}', 1); window.ben10App.closeQuickView();">
              أضف إلى السلة
            </button>
            <button type="button" class="btn btn--ghost" style="color: var(--ink); border-color: var(--line-strong);" onclick="window.ben10App.openCheckoutModal('${prod.id}')">
              طلب فوري الآن
            </button>
          </div>
        </div>
      </div>
    `;

    if (el.quickViewModal) {
      el.quickViewModal.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
  }

  function closeQuickView() {
    if (el.quickViewModal) {
      el.quickViewModal.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  }

  /* ==========================================================================
     Wishlist Management
     ========================================================================== */
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const prod = PRODUCTS.find(p => p.id === productId);

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`تم حذف "${prod?.name || ""}" من المفضلة`);
    } else {
      state.wishlist.push(productId);
      showToast(`تمت إضافة "${prod?.name || ""}" إلى قائمة المفضلة ❤️`);
    }

    localStorage.setItem("ben10_wishlist", JSON.stringify(state.wishlist));
    renderProducts();
  }

  /* ==========================================================================
     Search Overlay
     ========================================================================== */
  function openSearch() {
    if (el.searchOverlay) {
      el.searchOverlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      if (el.searchInput) {
        el.searchInput.value = "";
        el.searchInput.focus();
      }
      renderSearchResults("");
    }
  }

  function closeSearch() {
    if (el.searchOverlay) {
      el.searchOverlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  }

  function renderSearchResults(query) {
    if (!el.searchResults) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      el.searchResults.innerHTML = "";
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sub.toLowerCase().includes(q) || 
      (p.overview && p.overview.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      el.searchResults.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">
          لا توجد نتائج بحث مطابقة لـ "${query}"
        </div>
      `;
      return;
    }

    el.searchResults.innerHTML = matches.map(p => `
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.8rem; display: flex; gap: 0.8rem; align-items: center; cursor: pointer;"
           onclick="window.ben10App.openQuickView('${p.id}'); window.ben10App.closeSearch();">
        <img src="${p.image}" alt="${p.name}" style="width: 54px; height: 54px; object-fit: contain; background: #fff; border-radius: 8px; padding: 4px;">
        <div>
          <h4 style="font-size: 0.86rem; color: #fff; font-weight: 700; margin-bottom: 2px;">${p.name}</h4>
          <span style="font-size: 0.72rem; color: var(--ben10-green); font-weight: 800;">${formatMoney(p.price)}</span>
        </div>
      </div>
    `).join("");
  }

  /* ==========================================================================
     Countdown Timer for Deals
     ========================================================================== */
  function startDealCountdown() {
    let target = new Date();
    target.setHours(target.getHours() + 18, 42, 15);

    function tick() {
      const now = new Date();
      const diff = Math.max(0, Math.floor((target - now) / 1000));

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      if (el.cdHours) el.cdHours.textContent = String(h).padStart(2, "0");
      if (el.cdMins) el.cdMins.textContent = String(m).padStart(2, "0");
      if (el.cdSecs) el.cdSecs.textContent = String(s).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ==========================================================================
     Event Listeners & Initialization
     ========================================================================== */
  function initEvents() {
    // Filter tabs
    if (el.filterTabs) {
      el.filterTabs.addEventListener("click", e => {
        const btn = e.target.closest(".filter-tab");
        if (!btn) return;
        el.filterTabs.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.activeCategory = btn.dataset.category || "all";
        renderProducts();
      });
    }

    // Sort select
    if (el.sortSelect) {
      el.sortSelect.addEventListener("change", e => {
        state.activeSort = e.target.value;
        renderProducts();
      });
    }

    // Cart trigger & drawer
    el.cartTrigger?.addEventListener("click", openCartDrawer);
    el.cartClose?.addEventListener("click", closeCartDrawer);
    el.cartDrawer?.querySelector(".drawer__scrim")?.addEventListener("click", closeCartDrawer);
    el.btnCheckoutDrawer?.addEventListener("click", () => openCheckoutModal());

    // Checkout modal
    el.checkoutClose?.addEventListener("click", closeCheckoutModal);
    el.checkoutModal?.querySelector(".modal__scrim")?.addEventListener("click", closeCheckoutModal);
    el.checkoutForm?.addEventListener("submit", handleOrderSubmission);
    el.btnWaOrder?.addEventListener("click", handleWhatsAppOrder);

    // Payment method selection
    document.querySelectorAll(".pay-opt").forEach(opt => {
      opt.addEventListener("click", () => {
        document.querySelectorAll(".pay-opt").forEach(o => o.classList.remove("is-active"));
        opt.classList.add("is-active");
        const radio = opt.querySelector("input");
        if (radio) {
          radio.checked = true;
          state.selectedPayment = radio.value;
        }
      });
    });

    // Quick view modal
    el.quickViewClose?.addEventListener("click", closeQuickView);
    el.quickViewModal?.querySelector(".modal__scrim")?.addEventListener("click", closeQuickView);

    // Search overlay
    el.searchTrigger?.addEventListener("click", openSearch);
    el.searchClose?.addEventListener("click", closeSearch);
    el.searchInput?.addEventListener("input", e => renderSearchResults(e.target.value));

    // Search popular chips
    document.querySelectorAll(".search-popular button").forEach(btn => {
      btn.addEventListener("click", () => {
        if (el.searchInput) {
          el.searchInput.value = btn.textContent.trim();
          renderSearchResults(btn.textContent.trim());
        }
      });
    });

    // Scroll to top
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        el.scrollTopBtn?.classList.add("is-visible");
      } else {
        el.scrollTopBtn?.classList.remove("is-visible");
      }
    });

    el.scrollTopBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Escape key closes modals
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeCartDrawer();
        closeCheckoutModal();
        closeQuickView();
        closeSearch();
      }
    });
  }

  // Global API
  window.ben10App = {
    addToCart,
    updateQty,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    openCheckoutModal,
    closeCheckoutModal,
    openQuickView,
    closeQuickView,
    toggleWishlist,
    openSearch,
    closeSearch,
    resetFilters: () => {
      state.activeCategory = "all";
      state.searchQuery = "";
      el.filterTabs?.querySelectorAll(".filter-tab")?.forEach((t, i) => {
        t.classList.toggle("is-active", i === 0);
      });
      renderProducts();
    }
  };

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    populateGovernorates();
    renderProducts();
    updateCartUI();
    initEvents();
    startDealCountdown();
  });

})();
