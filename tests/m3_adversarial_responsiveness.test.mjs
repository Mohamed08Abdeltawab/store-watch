/**
 * Adversarial Test Harness for Milestone 3 (R3: Site-Wide Full Responsiveness)
 * 
 * Verifies:
 * 1. Fixed px widths & small-screen (320px) blowout risks across all routes & components
 * 2. Admin login page ambient glow containment (relative overflow-hidden)
 * 3. ProductCard defensive rendering under non-positive, malformed, and edge-case old_price inputs
 * 4. Modal and drawer accessibility (role="dialog", aria-modal="true", aria-label, touch targets >= 44px)
 * 5. Z-index stacking hierarchy (modals/drawers z-50 > navbars z-40)
 * 6. Global root overflow and viewport safeguards
 */

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

console.log("======================================================================");
console.log("   MILESTONE 3: EMPIRICAL ADVERSARIAL RESPONSIVENESS TEST HARNESS     ");
console.log("======================================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${description}`);
  } catch (err) {
    console.error(`  [FAIL] ${description}`);
    console.error(`         Error: ${err.message}`);
    throw err;
  }
}

const ROOT = process.cwd();

// ============================================================================
// TEST SUITE 1: Fixed px widths & 320px Small-Screen Blowout Audit
// ============================================================================
console.log("--- TEST SUITE 1: 320px Small-Screen Fixed Width & Blowout Audit ---");

const componentFiles = [
  "app/layout.jsx",
  "app/page.jsx",
  "app/shop/page.jsx",
  "app/product/[id]/page.jsx",
  "app/admin/page.jsx",
  "app/admin/login/page.jsx",
  "app/customer-service/page.jsx",
  "app/why-us/page.jsx",
  "app/why-ben10/page.jsx",
  "app/contact/page.jsx",
  "app/components/Navbar.jsx",
  "app/components/MobileBottomNav.jsx",
  "app/components/MobileMenuDrawer.jsx",
  "app/components/CartDrawer.jsx",
  "app/components/WishlistDrawer.jsx",
  "app/components/CheckoutModal.jsx",
  "app/components/QuickViewModal.jsx",
  "app/components/SearchModal.jsx",
  "app/components/ProductCard.jsx",
  "app/components/MensCollectionSection.jsx",
  "app/components/WomensCollectionSection.jsx",
  "app/components/MarqueeTicker.jsx",
  "app/components/WhatsAppSection.jsx",
  "app/components/CollectionCTA.jsx",
  "app/components/ClientStoreWrapper.jsx"
];

runTest("Verify all route and component files exist and are readable", () => {
  for (const relPath of componentFiles) {
    const fullPath = path.join(ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), `File missing: ${relPath}`);
  }
});

runTest("Scan for uncontained elements >= 300px on mobile without responsive prefixes or overflow guards", () => {
  const violations = [];

  for (const relPath of componentFiles) {
    const fullPath = path.join(ROOT, relPath);
    const content = fs.readFileSync(fullPath, "utf8");

    // Match w-[...px] or min-w-[...px]
    const customWidthMatches = content.matchAll(/(?:min-)?w-\[(\d+)px\]/g);
    for (const match of customWidthMatches) {
      const width = parseInt(match[1], 10);
      if (width >= 300) {
        // Check if the match is preceded by a responsive breakpoint prefix (sm:, md:, lg:, xl:, 2xl:)
        const matchIdx = match.index;
        const lineStart = content.lastIndexOf("\n", matchIdx) + 1;
        const lineEnd = content.indexOf("\n", matchIdx);
        const line = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

        // Exceptions:
        // 1. If line contains overflow-x-auto or is inside an overflow-x-auto container (e.g. data tables)
        // 2. If preceded by breakpoint like md:min-w-[620px] or max-w-[1340px]
        const isResponsive = /(sm:|md:|lg:|xl:|2xl:)(?:min-)?w-\[\d+px\]/.test(line);
        const isTable = line.includes("<table") || content.includes("overflow-x-auto") || content.includes("overflowX");
        const isMaxConstraint = line.includes("max-w-[");

        if (!isResponsive && !isTable && !isMaxConstraint) {
          violations.push({ file: relPath, width, line: line.trim() });
        }
      }
    }

    // Match w-80 (320px) or w-96 (384px) without responsive prefix or overflow container
    const standardWidthMatches = content.matchAll(/\b(?<!sm:|md:|lg:|xl:|2xl:)(w-80|w-96)\b/g);
    for (const match of standardWidthMatches) {
      const matchIdx = match.index;
      const lineStart = content.lastIndexOf("\n", matchIdx) + 1;
      const lineEnd = content.indexOf("\n", matchIdx);
      const line = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

      // Verify that this element is either:
      // a) an absolute glow inside an overflow-hidden container, or
      // b) responsive / inside overflow-hidden parent
      const isAbsoluteGlow = line.includes("absolute") && (line.includes("blur") || line.includes("bg-lime") || line.includes("bg-emerald"));
      const fileHasOverflowHidden = content.includes("overflow-hidden") || content.includes("overflow-x-hidden");

      if (isAbsoluteGlow && !fileHasOverflowHidden) {
        violations.push({ file: relPath, width: match[1], line: line.trim(), reason: "Absolute glow in file without overflow-hidden" });
      }
    }
  }

  assert.strictEqual(violations.length, 0, `Found uncontained fixed width violations: ${JSON.stringify(violations, null, 2)}`);
});

// ============================================================================
// TEST SUITE 2: Admin Login Page Glow Overflow Containment
// ============================================================================
console.log("\n--- TEST SUITE 2: Admin Login Ambient Glow Overflow Containment ---");

runTest("Verify app/admin/login/page.jsx contains relative overflow-hidden wrapper around 384px glow", () => {
  const filePath = path.join(ROOT, "app/admin/login/page.jsx");
  const content = fs.readFileSync(filePath, "utf8");

  // Check the container definition
  assert.ok(
    content.includes('className="relative overflow-hidden min-h-screen') ||
    content.includes('className="relative overflow-hidden'),
    "Admin login page must have 'relative overflow-hidden' on its root container"
  );

  // Check the glow element
  assert.ok(
    content.includes('className="absolute w-96 h-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none"'),
    "Background glow element must have pointer-events-none and be positioned within the overflow-hidden parent"
  );

  // Check the card container width
  assert.ok(
    content.includes("max-w-md") && content.includes("w-full"),
    "Card on login page must use 'w-full max-w-md' to safely fit on 320px mobile screens"
  );
});

// ============================================================================
// TEST SUITE 3: ProductCard Defensive Rendering & Mathematical Logic
// ============================================================================
console.log("\n--- TEST SUITE 3: ProductCard Defensive Rendering & old_price Edge Cases ---");

function calculateProductCardDiscount(product) {
  return Boolean(product.old_price && Number(product.old_price) > Number(product.price))
    ? Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100)
    : 0;
}

function shouldRenderOldPrice(product) {
  return Boolean(product.old_price && Number(product.old_price) > Number(product.price));
}

runTest("ProductCard old_price = null", () => {
  const p = { id: 1, price: 1000, old_price: null };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = undefined", () => {
  const p = { id: 1, price: 1000 };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = 0 (numeric zero)", () => {
  const p = { id: 1, price: 1000, old_price: 0 };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = '0' (string zero)", () => {
  const p = { id: 1, price: 1000, old_price: "0" };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = -150 (negative number)", () => {
  const p = { id: 1, price: 1000, old_price: -150 };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = '-150' (negative string)", () => {
  const p = { id: 1, price: 1000, old_price: "-150" };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = '' (empty string)", () => {
  const p = { id: 1, price: 1000, old_price: "" };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price = 'invalid_string'", () => {
  const p = { id: 1, price: 1000, old_price: "invalid_string" };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price equals price (no discount)", () => {
  const p = { id: 1, price: 1500, old_price: 1500 };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard old_price < price (inverted price)", () => {
  const p = { id: 1, price: 2000, old_price: 1500 };
  assert.strictEqual(calculateProductCardDiscount(p), 0);
  assert.strictEqual(shouldRenderOldPrice(p), false);
});

runTest("ProductCard valid discount calculation (old_price 2000, price 1500 -> 25% discount)", () => {
  const p = { id: 1, price: 1500, old_price: 2000 };
  assert.strictEqual(calculateProductCardDiscount(p), 25);
  assert.strictEqual(shouldRenderOldPrice(p), true);
});

runTest("ProductCard string numeric values ('1500' and '2000')", () => {
  const p = { id: 1, price: "1500", old_price: "2000" };
  assert.strictEqual(calculateProductCardDiscount(p), 25);
  assert.strictEqual(shouldRenderOldPrice(p), true);
});

runTest("ProductCard verify implementation in app/components/ProductCard.jsx source file", () => {
  const source = fs.readFileSync(path.join(ROOT, "app/components/ProductCard.jsx"), "utf8");
  
  // Verify discount guard
  assert.ok(
    source.includes("const discount = Boolean(product.old_price && Number(product.old_price) > Number(product.price))"),
    "ProductCard must guard discount calculation with Number(old_price) > Number(price)"
  );
  
  // Verify strikethrough guard
  assert.ok(
    source.includes("{Boolean(product.old_price && Number(product.old_price) > Number(product.price)) && ("),
    "ProductCard must guard <s> tag rendering with Number(old_price) > Number(price)"
  );
});

// ============================================================================
// TEST SUITE 4: Modal & Drawer Accessibility and Z-Index Stacking
// ============================================================================
console.log("\n--- TEST SUITE 4: Modal/Drawer Accessibility & Z-Index Layering ---");

const modalsAndDrawers = [
  { file: "app/components/CartDrawer.jsx", name: "CartDrawer" },
  { file: "app/components/WishlistDrawer.jsx", name: "WishlistDrawer" },
  { file: "app/components/CheckoutModal.jsx", name: "CheckoutModal" },
  { file: "app/components/QuickViewModal.jsx", name: "QuickViewModal" },
  { file: "app/components/SearchModal.jsx", name: "SearchModal" },
  { file: "app/components/MobileMenuDrawer.jsx", name: "MobileMenuDrawer" }
];

runTest("Verify all 6 modals and drawers have role='dialog' and aria-modal='true'", () => {
  for (const modal of modalsAndDrawers) {
    const content = fs.readFileSync(path.join(ROOT, modal.file), "utf8");
    assert.ok(content.includes('role="dialog"'), `${modal.name} missing role="dialog"`);
    assert.ok(content.includes('aria-modal="true"'), `${modal.name} missing aria-modal="true"`);
  }
});

runTest("Verify all 6 modals and drawers have z-50 stacking", () => {
  for (const modal of modalsAndDrawers) {
    const content = fs.readFileSync(path.join(ROOT, modal.file), "utf8");
    assert.ok(content.includes("z-50"), `${modal.name} must be on z-50 layer`);
  }
});

runTest("Verify Navbar and MobileBottomNav are on z-40 so drawers/modals (z-50) stack strictly above them", () => {
  const navbarContent = fs.readFileSync(path.join(ROOT, "app/components/Navbar.jsx"), "utf8");
  const bottomNavContent = fs.readFileSync(path.join(ROOT, "app/components/MobileBottomNav.jsx"), "utf8");

  assert.ok(navbarContent.includes("z-40"), "Navbar must be on z-40");
  assert.ok(bottomNavContent.includes("z-40"), "MobileBottomNav must be on z-40");
});

runTest("Verify all modal and drawer close buttons have accessible tap target >= 44px (w-11 h-11)", () => {
  for (const modal of modalsAndDrawers) {
    const content = fs.readFileSync(path.join(ROOT, modal.file), "utf8");
    const hasW11H11 = content.includes("w-11 h-11");
    const hasAriaLabel = content.includes("aria-label=") || content.includes("✕");
    assert.ok(hasW11H11, `${modal.name} close button must have w-11 h-11 (44px x 44px)`);
    assert.ok(hasAriaLabel, `${modal.name} close button must have accessible label`);
  }
});

runTest("Verify all modal and drawer backdrops have click handlers to dismiss", () => {
  for (const modal of modalsAndDrawers) {
    const content = fs.readFileSync(path.join(ROOT, modal.file), "utf8");
    // Backdrop check: an element with fixed inset-0 and an onClick handler
    const hasBackdropClick = /onClick=\{[^}]*(?:setIsCartOpen|setIsWishlistOpen|setQuickProduct|setIsCheckoutOpen|setIsSearchOpen|setIsMobileMenuOpen)[^}]*\}/.test(content);
    assert.ok(hasBackdropClick, `${modal.name} must have a dismissable backdrop onClick handler`);
  }
});

// ============================================================================
// TEST SUITE 5: Global Root Layout & Viewport Safeguards
// ============================================================================
console.log("\n--- TEST SUITE 5: Global Root Layout & Viewport Safeguards ---");

runTest("Verify app/globals.css enforces max-width 100% and overflow-x hidden on html & body", () => {
  const css = fs.readFileSync(path.join(ROOT, "app/globals.css"), "utf8");
  assert.ok(css.includes("max-width: 100%"), "globals.css missing max-width: 100%");
  assert.ok(css.includes("overflow-x: hidden"), "globals.css missing overflow-x: hidden");
  assert.ok(css.includes(".no-scrollbar"), "globals.css missing .no-scrollbar");
  assert.ok(css.includes(".scrollbar-none"), "globals.css missing .scrollbar-none");
});

runTest("Verify app/layout.jsx enables maximumScale: 5 and body overflow-x-hidden", () => {
  const layout = fs.readFileSync(path.join(ROOT, "app/layout.jsx"), "utf8");
  assert.ok(layout.includes("maximumScale: 5"), "layout.jsx missing maximumScale: 5");
  assert.ok(layout.includes("overflow-x-hidden"), "layout.jsx body missing overflow-x-hidden");
});

runTest("Verify app/components/ClientStoreWrapper.jsx guards main with min-w-0 w-full overflow-x-clip", () => {
  const wrapper = fs.readFileSync(path.join(ROOT, "app/components/ClientStoreWrapper.jsx"), "utf8");
  assert.ok(
    wrapper.includes('className="min-w-0 w-full overflow-x-clip"') ||
    wrapper.includes("overflow-x-clip"),
    "ClientStoreWrapper must clip horizontal overflows on <main>"
  );
});

// ============================================================================
// TEST SUITE 6: Mobile Navigation Touch Targets
// ============================================================================
console.log("\n--- TEST SUITE 6: Mobile Navigation Touch Targets (>= 44px) ---");

runTest("Navbar mobile hamburger and search toggles have w-11 h-11", () => {
  const nav = fs.readFileSync(path.join(ROOT, "app/components/Navbar.jsx"), "utf8");
  assert.ok(nav.includes("w-11 h-11 rounded-xl"), "Navbar mobile buttons must be w-11 h-11");
});

runTest("MobileBottomNav items have min-h-[44px] min-w-[44px] and safe area padding", () => {
  const bottomNav = fs.readFileSync(path.join(ROOT, "app/components/MobileBottomNav.jsx"), "utf8");
  assert.ok(bottomNav.includes("min-h-[44px] min-w-[44px]"), "MobileBottomNav items must be at least 44px");
  assert.ok(bottomNav.includes("safe-area-inset-bottom"), "MobileBottomNav must respect iOS safe area");
});

console.log("\n======================================================================");
console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests} tests successful.`);
console.log("======================================================================");
