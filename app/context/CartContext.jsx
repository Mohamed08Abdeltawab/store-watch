"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const GOVERNORATES = [
  { id: "cairo", name: "القاهرة", shipping: 50, days: "24-48 ساعة" },
  { id: "giza", name: "الجيزة", shipping: 50, days: "24-48 ساعة" },
  { id: "alex", name: "الإسكندرية", shipping: 60, days: "48 ساعة" },
  { id: "delta", name: "محافظات الدلتا (المنصورة، طنطا، الزقازيق...)", shipping: 65, days: "48-72 ساعة" },
  { id: "canal", name: "مدن القناة (الإسماعيلية، بورسعيد، السويس)", shipping: 70, days: "48-72 ساعة" },
  { id: "upper", name: "محافظات الصعيد (بني سويف، أسيوط، سوهاج...)", shipping: 80, days: "3-4 أيام" },
  { id: "remote", name: "المحافظات الحدودية (البحر الأحمر، مطروح...)", shipping: 95, days: "4-5 أيام" }
];

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals & Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Checkout State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedGov, setSelectedGov] = useState(GOVERNORATES[0]);
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formErrors, setFormErrors] = useState({});
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);

  // Load Initial Products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(err => console.error("Error loading products:", err));

    // Load saved cart & wishlist from localStorage
    try {
      const savedCart = localStorage.getItem("ben10_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {}

    try {
      const savedWish = localStorage.getItem("ben10_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch (e) {}

    setIsLoaded(true);
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ben10_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ben10_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Toast notifications
  function showToast(msg) {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  // Cart Management
  function addToCart(product, qty = 1, variant = "") {
    if (!product) return;
    const vName = variant || (product.colors && product.colors[0] ? product.colors[0].n : "");
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.variant === vName);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        variant: vName,
        qty
      }];
    });
    showToast(`تمت إضافة "${product.name}" إلى سلة التسوق`);
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

  // Wishlist Management
  function toggleWishlist(productId) {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("تمت الإزالة من المفضلة");
        return prev.filter(id => id !== productId);
      } else {
        showToast("تمت الإضافة إلى المفضلة ❤️");
        return [...prev, productId];
      }
    });
  }

  function isWishlisted(productId) {
    return wishlist.includes(productId);
  }

  // Quick WhatsApp Purchase
  function sendDirectWhatsApp(product) {
    if (!product) return;
    const text = `مرحباً، أود الاستفسار وطلب ساعة *${product.name}* بسعر *${Number(product.price).toLocaleString("ar-EG")} ج.م* بضمان الوكيل والمعاينة قبل الدفع.`;
    const url = `https://wa.me/201065712366?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // Fast Checkout opener for single product
  function openCheckoutWithProduct(product) {
    if (!product) return;
    addToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  // Calculations
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isFreeShipping = cartSubtotal >= 5000;
  const shippingFee = isFreeShipping ? 0 : selectedGov.shipping;
  const cartTotal = cartSubtotal + shippingFee;

  // Checkout submission
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

  return (
    <CartContext.Provider
      value={{
        products,
        setProducts,
        cart,
        setCart,
        wishlist,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        isWishlisted,
        sendDirectWhatsApp,
        openCheckoutWithProduct,
        totalCartCount,
        cartSubtotal,
        isFreeShipping,
        shippingFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickProduct,
        setQuickProduct,
        toasts,
        showToast,
        // Checkout state & handlers
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
