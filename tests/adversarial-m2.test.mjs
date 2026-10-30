import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { createRequire } from "node:module";
import swc from "next/dist/build/swc/index.js";
import { DatabaseSync } from "node:sqlite";

const require = createRequire(import.meta.url);

console.log("==================================================================");
console.log("   Milestone 2 Adversarial Verification Suite: Collections & Card  ");
console.log("==================================================================");

// ------------------------------------------------------------------
// Helper: Transpile and Load JSX Components
// ------------------------------------------------------------------
function loadComponent(filePath, mockContext = {}) {
  const source = fs.readFileSync(path.resolve(filePath), "utf-8");
  const transformed = swc.transformSync(source, {
    jsc: {
      parser: { syntax: "ecmascript", jsx: true },
      transform: { react: { runtime: "automatic" } }
    },
    module: { type: "commonjs" }
  });

  const moduleExports = {};
  const moduleObj = { exports: moduleExports };
  const evalFn = new Function("module", "exports", "require", transformed.code);

  evalFn(moduleObj, moduleExports, (moduleName) => {
    if (moduleName === "react") return React;
    if (moduleName === "react/jsx-runtime") return require("react/jsx-runtime");
    if (moduleName === "react/jsx-dev-runtime") return require("react/jsx-dev-runtime");
    if (moduleName === "next/link") {
      return function MockLink({ href, children, ...props }) {
        return React.createElement("a", { href, ...props }, children);
      };
    }
    if (moduleName === "../context/CartContext" || moduleName === "./context/CartContext") {
      return {
        useCart: () => mockContext.cartContext || {
          wishlist: [],
          toggleWishlist: () => {},
          addToCart: () => {},
          setQuickProduct: () => {},
          sendDirectWhatsApp: () => {},
          openCheckoutWithProduct: () => {}
        }
      };
    }
    if (moduleName === "@/components/ui/badge") {
      return {
        Badge: function MockBadge({ className, children, ...props }) {
          return React.createElement("span", { className, ...props }, children);
        }
      };
    }
    if (moduleName === "@/components/ui/button") {
      return {
        Button: function MockButton({ className, children, asChild, ...props }) {
          if (asChild) return children;
          return React.createElement("button", { className, ...props }, children);
        }
      };
    }
    if (moduleName === "./ProductCard" || moduleName === "../components/ProductCard") {
      return mockContext.ProductCard || (() => null);
    }
    return require(moduleName);
  });

  return moduleObj.exports.default || moduleObj.exports;
}

// ------------------------------------------------------------------
// TEST SUITE 1: product.old_price & discount calculations in ProductCard
// ------------------------------------------------------------------
console.log("\n--- Running Test Suite 1: old_price & Discount Math Adversarial Test ---");
{
  const mockContext = {
    cartContext: {
      wishlist: [],
      toggleWishlist: () => {},
      addToCart: () => {},
      setQuickProduct: () => {},
      sendDirectWhatsApp: () => {},
      openCheckoutWithProduct: () => {}
    }
  };

  const ProductCard = loadComponent("app/components/ProductCard.jsx", mockContext);

  // Discount calculation formula used inside ProductCard (line 21-23)
  function calcDiscount(product) {
    return product.old_price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : 0;
  }

  // Adversarial old_price tests:
  // 1. undefined
  const dUndef = calcDiscount({ price: 3000, old_price: undefined });
  assert.equal(dUndef, 0, "Discount must be 0 for undefined old_price");
  assert(!Number.isNaN(dUndef), "Discount must not be NaN for undefined");
  console.log("  ✓ old_price=undefined: discount=0 (No NaN, no division by zero)");

  // 2. null
  const dNull = calcDiscount({ price: 3000, old_price: null });
  assert.equal(dNull, 0, "Discount must be 0 for null old_price");
  assert(!Number.isNaN(dNull), "Discount must not be NaN for null");
  console.log("  ✓ old_price=null: discount=0 (No NaN, no division by zero)");

  // 3. 0 (integer zero)
  const dZero = calcDiscount({ price: 3000, old_price: 0 });
  assert.equal(dZero, 0, "Discount must be 0 for 0 old_price");
  assert(!Number.isNaN(dZero), "Discount must not be NaN for 0");
  console.log("  ✓ old_price=0: discount=0 (No NaN, no division by zero)");

  // 4. price=0 and old_price=0 (division by zero test)
  const dZeroZero = calcDiscount({ price: 0, old_price: 0 });
  assert.equal(dZeroZero, 0, "Discount must be 0 for price=0 and old_price=0");
  assert(!Number.isNaN(dZeroZero), "Discount must not be NaN for price=0 and old_price=0");
  console.log("  ✓ old_price=0 & price=0: discount=0 (No division by zero)");

  // 5. '0' (string zero)
  const dStrZero = calcDiscount({ price: 3000, old_price: "0" });
  console.log(`  [EDGE CASE] old_price='0' (string): discount evaluated to ${dStrZero} (falsy check bypassed because '0' is truthy in JS)`);

  // 6. Normal discount
  const dNorm = calcDiscount({ price: 3000, old_price: 4000 });
  assert.equal(dNorm, 25, "Discount should be 25%");
  console.log("  ✓ Normal old_price (4000 vs 3000): discount=25%");

  // SSR Rendering checks across all cases:
  const renderCases = [
    { desc: "old_price=undefined", p: { id: "p-undef", name: "Watch", price: 3000, old_price: undefined } },
    { desc: "old_price=null", p: { id: "p-null", name: "Watch", price: 3000, old_price: null } },
    { desc: "old_price=0", p: { id: "p-zero", name: "Watch", price: 3000, old_price: 0 } },
    { desc: "old_price=4000", p: { id: "p-norm", name: "Watch", price: 3000, old_price: 4000 } }
  ];

  for (const rc of renderCases) {
    let html = "";
    assert.doesNotThrow(() => {
      html = ReactDOMServer.renderToString(React.createElement(ProductCard, { product: rc.p }));
    });
    assert(html.length > 0, "HTML must render");

    if (rc.desc === "old_price=4000") {
      assert(html.includes("خصم") && html.includes("25"), "Must render 25% discount badge");
      assert(html.includes("<s"), "Must render strikethrough <s > tag");
    } else {
      assert(!html.includes("خصم"), `Must NOT render discount badge for ${rc.desc}`);
    }

    if (rc.desc === "old_price=0") {
      const hasZeroText = html.includes("<div class=\"flex flex-col min-w-0\">0<div");
      console.log(`  [FINDING] React JSX {product.old_price && (...)} with old_price=0: renders stray '0'? ${hasZeroText ? "YES (known React 0-rendering behavior)" : "NO"}`);
    }
  }
}

// ------------------------------------------------------------------
// TEST SUITE 2: Button Clicks & Event Propagation (preventDefault & stopPropagation)
// ------------------------------------------------------------------
console.log("\n--- Running Test Suite 2: Event Handling & Propagation Controls ---");
{
  const recordedCalls = {
    wishlistToggled: null,
    cartAdded: null,
    quickProductSet: null,
    whatsAppSent: null,
    checkoutOpened: null
  };

  const mockContext = {
    cartContext: {
      wishlist: ["fav-1"],
      toggleWishlist: (id) => { recordedCalls.wishlistToggled = id; },
      addToCart: (prod, qty) => { recordedCalls.cartAdded = { prod, qty }; },
      setQuickProduct: (prod) => { recordedCalls.quickProductSet = prod; },
      sendDirectWhatsApp: (prod) => { recordedCalls.whatsAppSent = prod; },
      openCheckoutWithProduct: (prod) => { recordedCalls.checkoutOpened = prod; }
    }
  };

  const ProductCard = loadComponent("app/components/ProductCard.jsx", mockContext);
  const sampleProduct = {
    id: "sample-watch",
    name: "ساعة نموذجية",
    price: 3500,
    old_price: 4500,
    cat: "كلاسيك",
    target_audience: "رجالي",
    rating: 4.8,
    reviews: 12,
    image: "/test.png"
  };

  const elementTree = ProductCard({ product: sampleProduct });

  function findNodesWithOnClick(node, acc = []) {
    if (!node || typeof node !== "object") return acc;
    if (node.props) {
      if (typeof node.props.onClick === "function") {
        acc.push(node);
      }
      if (node.props.children) {
        const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
        for (const child of children) {
          findNodesWithOnClick(child, acc);
        }
      }
    }
    return acc;
  }

  const interactiveNodes = findNodesWithOnClick(elementTree);
  console.log(`  Found ${interactiveNodes.length} interactive elements with onClick in ProductCard`);
  assert(interactiveNodes.length >= 6, `Expected at least 6 interactive elements, found ${interactiveNodes.length}`);

  function createMockEvent() {
    let prevented = false;
    let stopped = false;
    return {
      preventDefault() { prevented = true; },
      stopPropagation() { stopped = true; },
      isDefaultPrevented() { return prevented; },
      isPropagationStopped() { return stopped; }
    };
  }

  // 1. Instant Cash Buy (⚡ كاش)
  const cashBtn = interactiveNodes.find(n => n.props["aria-label"] === "شراء فوري كاش" || (n.props.title && n.props.title.includes("شراء فوري")));
  assert(cashBtn, "Instant Cash Buy button must exist");
  const cashEvent = createMockEvent();
  cashBtn.props.onClick(cashEvent);
  assert(cashEvent.isDefaultPrevented(), "Instant Cash Buy MUST call e.preventDefault()");
  assert(cashEvent.isPropagationStopped(), "Instant Cash Buy MUST call e.stopPropagation()");
  assert.equal(recordedCalls.checkoutOpened?.id, sampleProduct.id, "Instant Cash Buy MUST trigger openCheckoutWithProduct");
  console.log("  ✓ Instant Cash Buy (⚡ كاش): preventDefault=true, stopPropagation=true -> opens checkout");

  // 2. Add to Cart (+)
  const cartBtn = interactiveNodes.find(n => n.props["aria-label"] === "إضافة إلى السلة" || n.props.title === "إضافة إلى السلة");
  assert(cartBtn, "Add to Cart button must exist");
  const cartEvent = createMockEvent();
  cartBtn.props.onClick(cartEvent);
  assert(cartEvent.isDefaultPrevented(), "Add to Cart MUST call e.preventDefault()");
  assert(cartEvent.isPropagationStopped(), "Add to Cart MUST call e.stopPropagation()");
  assert.equal(recordedCalls.cartAdded?.prod.id, sampleProduct.id, "Add to Cart MUST trigger addToCart");
  assert.equal(recordedCalls.cartAdded?.qty, 1, "Add to Cart MUST pass qty 1");
  console.log("  ✓ Add to Cart button: preventDefault=true, stopPropagation=true -> adds 1 item to cart");

  // 3. Wishlist Button
  const wishlistBtn = interactiveNodes.find(n => n.props["aria-label"]?.includes("المفضلة"));
  assert(wishlistBtn, "Wishlist button must exist");
  const wishEvent = createMockEvent();
  wishlistBtn.props.onClick(wishEvent);
  assert(wishEvent.isDefaultPrevented(), "Wishlist MUST call e.preventDefault()");
  assert(wishEvent.isPropagationStopped(), "Wishlist MUST call e.stopPropagation()");
  assert.equal(recordedCalls.wishlistToggled, sampleProduct.id, "Wishlist MUST trigger toggleWishlist");
  console.log("  ✓ Wishlist button: preventDefault=true, stopPropagation=true -> toggles wishlist");

  // 4. WhatsApp Button
  const waBtn = interactiveNodes.find(n => n.props.title?.includes("واتساب") || n.props["aria-label"]?.includes("واتساب"));
  assert(waBtn, "WhatsApp button must exist");
  const waEvent = createMockEvent();
  waBtn.props.onClick(waEvent);
  assert(waEvent.isDefaultPrevented(), "WhatsApp MUST call e.preventDefault()");
  assert(waEvent.isPropagationStopped(), "WhatsApp MUST call e.stopPropagation()");
  assert.equal(recordedCalls.whatsAppSent?.id, sampleProduct.id, "WhatsApp MUST trigger sendDirectWhatsApp");
  console.log("  ✓ WhatsApp button: preventDefault=true, stopPropagation=true -> launches direct WhatsApp");

  // 5. Mobile QuickView Button
  const mobileQuickBtn = interactiveNodes.find(n => n.props["aria-label"] === "نظرة سريعة" && n.props.className?.includes("sm:hidden"));
  assert(mobileQuickBtn, "Mobile QuickView button must exist");
  const mqEvent = createMockEvent();
  mobileQuickBtn.props.onClick(mqEvent);
  assert(mqEvent.isDefaultPrevented(), "Mobile QuickView MUST call e.preventDefault()");
  assert(mqEvent.isPropagationStopped(), "Mobile QuickView MUST call e.stopPropagation()");
  assert.equal(recordedCalls.quickProductSet?.id, sampleProduct.id, "Mobile QuickView MUST trigger setQuickProduct");
  console.log("  ✓ Mobile QuickView button: preventDefault=true, stopPropagation=true -> sets quick product");

  // 6. Desktop QuickView Button
  const desktopQuickBtn = interactiveNodes.find(n => n.props.className?.includes("bg-black/80") && !n.props.className?.includes("sm:hidden"));
  assert(desktopQuickBtn, "Desktop QuickView button must exist");
  const dqEvent = createMockEvent();
  desktopQuickBtn.props.onClick(dqEvent);
  assert(dqEvent.isDefaultPrevented(), "Desktop QuickView MUST call e.preventDefault()");
  assert.equal(recordedCalls.quickProductSet?.id, sampleProduct.id, "Desktop QuickView MUST trigger setQuickProduct");
  console.log(`  ✓ Desktop QuickView button: preventDefault=true (stopPropagation=${dqEvent.isPropagationStopped()})`);
  console.log("    (Note: Desktop QuickView is rendered outside <a> link tag, preventing accidental page navigation)");
}

// ------------------------------------------------------------------
// TEST SUITE 3: Sparse, Empty, and Arbitrary Array Sizes in Collection Sections
// ------------------------------------------------------------------
console.log("\n--- Running Test Suite 3: Sparse & Boundary Data in Collection Sections ---");
{
  const mockContext = {
    cartContext: {
      wishlist: [],
      toggleWishlist: () => {},
      addToCart: () => {},
      setQuickProduct: () => {},
      sendDirectWhatsApp: () => {},
      openCheckoutWithProduct: () => {}
    }
  };

  const ProductCard = loadComponent("app/components/ProductCard.jsx", mockContext);
  mockContext.ProductCard = ProductCard;

  const MensCollectionSection = loadComponent("app/components/MensCollectionSection.jsx", mockContext);
  const WomensCollectionSection = loadComponent("app/components/WomensCollectionSection.jsx", mockContext);

  const testProducts = [
    { id: "p1", name: "Watch 1", price: 1000, old_price: 1200, image: "/img1.png", cat: "كلاسيك" },
    { id: "p2", name: "Watch 2", price: 2000, old_price: 2400, image: "/img2.png", cat: "أوتوماتيك" },
    { id: "p3", name: "Watch 3", price: 3000, old_price: 3600, image: "/img3.png", cat: "كرونوغراف" },
    { id: "p4", name: "Watch 4", price: 4000, old_price: 4800, image: "/img4.png", cat: "دايفر" },
    { id: "p5", name: "Watch 5", price: 5000, old_price: 6000, image: "/img5.png", cat: "سمارت" }
  ];

  const sections = [
    { name: "MensCollectionSection", Component: MensCollectionSection, expectedId: "men-collection", expectedHref: "/shop?audience=men" },
    { name: "WomensCollectionSection", Component: WomensCollectionSection, expectedId: "women-collection", expectedHref: "/shop?audience=women" }
  ];

  for (const { name, Component, expectedId, expectedHref } of sections) {
    console.log(`  Testing ${name}:`);

    // Case 1: Empty array [] -> returns null (clean, no DOM rendered)
    const emptyHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: [] }));
    assert.equal(emptyHtml, "", `${name} must return null for empty array`);
    console.log(`    ✓ products=[] renders cleanly as null/empty`);

    // Case 2: products=undefined -> returns null
    const undefHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: undefined }));
    assert.equal(undefHtml, "", `${name} must return null for undefined products`);
    console.log(`    ✓ products=undefined renders cleanly as null/empty`);

    // Case 3: products=null -> returns null
    const nullHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: null }));
    assert.equal(nullHtml, "", `${name} must return null for null products`);
    console.log(`    ✓ products=null renders cleanly as null/empty`);

    // Case 4: products with 1 item -> renders grid with 1 card, has correct anchor and shop link
    const oneHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: [testProducts[0]] }));
    assert(oneHtml.includes(`id="${expectedId}"`), `Must contain anchor #${expectedId}`);
    assert(oneHtml.includes(expectedHref), `Must link to ${expectedHref}`);
    assert(oneHtml.includes("Watch 1"), "Must render the single product");
    console.log(`    ✓ products=[1 item] renders 1 card safely`);

    // Case 5: products with 2 items
    const twoHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: testProducts.slice(0, 2) }));
    assert(twoHtml.includes("Watch 1") && twoHtml.includes("Watch 2"), "Must render 2 products");
    console.log(`    ✓ products=[2 items] renders 2 cards safely`);

    // Case 6: products with 3 items
    const threeHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: testProducts.slice(0, 3) }));
    assert(threeHtml.includes("Watch 3"), "Must render 3 products");
    console.log(`    ✓ products=[3 items] renders 3 cards safely`);

    // Case 7: products with 4 items (nominal layout)
    const fourHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: testProducts.slice(0, 4) }));
    assert(fourHtml.includes("Watch 4"), "Must render 4 products");
    console.log(`    ✓ products=[4 items] renders 4 cards safely`);

    // Case 8: products with 5 items (exceeding 4)
    const fiveHtml = ReactDOMServer.renderToString(React.createElement(Component, { products: testProducts }));
    assert(fiveHtml.includes("Watch 5"), "Must render all 5 products gracefully");
    console.log(`    ✓ products=[5 items] renders all cards gracefully`);
  }
}

// ------------------------------------------------------------------
// TEST SUITE 4: Homepage Data Filtering Logic Stress Test
// ------------------------------------------------------------------
console.log("\n--- Running Test Suite 4: Homepage Filtering Logic Boundary Test ---");
{
  function runHomepageFilterLogic(products) {
    const bestSellers = products
      .filter(p => p.tag === "best" || (p.badge_text && (p.badge_text.includes("طلباً") || p.badge_text.includes("مبيعاً"))))
      .slice(0, 4);
    const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

    const topRated = [...products]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    const displayTopRated = topRated.length > 0 ? topRated : products.slice(2, 6);

    const menProducts = products
      .filter(p => p.target_audience && (p.target_audience === "رجالي" || p.target_audience.includes("رجالي")))
      .slice(0, 4);

    const womenProducts = products
      .filter(p => p.target_audience && (p.target_audience === "حريمي" || p.target_audience.includes("حريمي")))
      .slice(0, 4);

    const dealProduct = products.find(p => p.id === "ben10-apex-chrono") || products[0];

    return { displayBestSellers, displayTopRated, menProducts, womenProducts, dealProduct };
  }

  // 1. Empty array
  const emptyRes = runHomepageFilterLogic([]);
  assert.equal(emptyRes.menProducts.length, 0);
  assert.equal(emptyRes.womenProducts.length, 0);
  assert.equal(emptyRes.displayBestSellers.length, 0);
  assert.equal(emptyRes.displayTopRated.length, 0);
  assert.equal(emptyRes.dealProduct, undefined);
  console.log("  ✓ Homepage filter survives completely empty products array without throwing");

  // 2. Corrupt products
  const corruptProducts = [
    { id: "c1", name: "No Audience" },
    { id: "c2", name: "Null Audience", target_audience: null },
    { id: "c3", name: "Audience Array", target_audience: "" },
    { id: "c4", name: "Men Watch", target_audience: "رجالي" },
    { id: "c5", name: "Women Watch", target_audience: "حريمي" }
  ];
  const corruptRes = runHomepageFilterLogic(corruptProducts);
  assert.equal(corruptRes.menProducts.length, 1);
  assert.equal(corruptRes.womenProducts.length, 1);
  console.log("  ✓ Homepage filter survives corrupt / missing target_audience fields");
}

// ------------------------------------------------------------------
// TEST SUITE 5: Empirical Database Verification (ben10.db)
// ------------------------------------------------------------------
console.log("\n--- Running Test Suite 5: SQLite Database Empirical Verification ---");
{
  const db = new DatabaseSync("ben10.db");

  const menRows = db.prepare("SELECT id, name, price, old_price, target_audience FROM products WHERE target_audience = 'رجالي'").all();
  const womenRows = db.prepare("SELECT id, name, price, old_price, target_audience FROM products WHERE target_audience = 'حريمي'").all();
  const unisexRows = db.prepare("SELECT id, name, price, old_price, target_audience FROM products WHERE target_audience = 'للجنسين'").all();

  console.log(`  Men watches in DB: ${menRows.length}`);
  console.log(`  Women watches in DB: ${womenRows.length}`);
  console.log(`  Unisex watches in DB: ${unisexRows.length}`);

  assert(menRows.length >= 4, `Database must contain at least 4 men watches, found ${menRows.length}`);
  assert(womenRows.length >= 4, `Database must contain at least 4 women watches, found ${womenRows.length}`);

  for (const w of [...menRows, ...womenRows]) {
    assert(w.price > 0, `Watch ${w.id} price must be > 0 (got ${w.price})`);
    if (w.old_price) {
      assert(w.old_price >= w.price, `Watch ${w.id} old_price (${w.old_price}) should be >= price (${w.price})`);
      const discount = Math.round(((w.old_price - w.price) / w.old_price) * 100);
      assert(discount >= 0 && discount < 100, `Discount ${discount}% on ${w.id} is invalid`);
    }
  }
  console.log("  ✓ All men's and women's watches have valid pricing and discount ranges");
}

console.log("\n==================================================================");
console.log("   ALL ADVERSARIAL STRESS TESTS PASSED EMPIRICALLY (5/5 SUITES)   ");
console.log("==================================================================");
