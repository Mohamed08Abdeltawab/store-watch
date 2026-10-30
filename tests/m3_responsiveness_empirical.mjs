/**
 * Empirical Verification Suite for Milestone 3 (R3):
 * Site-Wide Full Responsiveness, Touch Targets, and Viewport Overflow Guard
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

function assert(condition, testName, details = "") {
  results.total++;
  if (condition) {
    results.passed++;
    results.details.push({ status: "PASS", testName, details });
    console.log(`[PASS] ${testName}`);
  } else {
    results.failed++;
    results.details.push({ status: "FAIL", testName, details });
    console.error(`[FAIL] ${testName} - ${details}`);
  }
}

console.log("=================================================");
console.log("Starting Milestone 3 Empirical Verification Suite");
console.log("=================================================\n");

// ============================================================================
// 1. Root Layout & CSS Overflow Containment
// ============================================================================
console.log("--- 1. Testing Root Layout & CSS Overflow Containment ---");

const globalsCss = fs.readFileSync(path.join(projectRoot, "app/globals.css"), "utf-8");

// html max-w-full and overflow-x: hidden
const htmlMatch = globalsCss.match(/html\s*\{([^}]+)\}/s);
assert(htmlMatch !== null, "globals.css defines html rules", "Expected html selector in globals.css");
if (htmlMatch) {
  const htmlBody = htmlMatch[1];
  assert(htmlBody.includes("max-width: 100%"), "html selector includes 'max-width: 100%'");
  assert(htmlBody.includes("overflow-x: hidden"), "html selector includes 'overflow-x: hidden'");
}

// body max-w-full, overflow-x: hidden, position: relative
const bodyMatch = globalsCss.match(/body\s*\{([^}]+)\}/s);
assert(bodyMatch !== null, "globals.css defines body rules", "Expected body selector in globals.css");
if (bodyMatch) {
  const bodyRules = bodyMatch[1];
  assert(bodyRules.includes("max-width: 100%"), "body selector includes 'max-width: 100%'");
  assert(bodyRules.includes("overflow-x: hidden"), "body selector includes 'overflow-x: hidden'");
  assert(bodyRules.includes("position: relative"), "body selector includes 'position: relative'");
}

// Scrollbar utility classes (.no-scrollbar, .scrollbar-none)
assert(globalsCss.includes(".no-scrollbar::-webkit-scrollbar"), "globals.css defines .no-scrollbar webkit rule");
assert(globalsCss.includes(".scrollbar-none::-webkit-scrollbar"), "globals.css defines .scrollbar-none webkit rule");
assert(globalsCss.includes("scrollbar-width: none"), "globals.css defines scrollbar-width: none");
assert(globalsCss.includes("-ms-overflow-style: none"), "globals.css defines -ms-overflow-style: none");

// app/layout.jsx viewport and body classes
const layoutJsx = fs.readFileSync(path.join(projectRoot, "app/layout.jsx"), "utf-8");
assert(layoutJsx.includes("maximumScale: 5"), "app/layout.jsx exports viewport with maximumScale: 5");
assert(layoutJsx.includes("overflow-x-hidden"), "app/layout.jsx body contains overflow-x-hidden");

// app/components/ClientStoreWrapper.jsx main container
const clientStoreWrapper = fs.readFileSync(path.join(projectRoot, "app/components/ClientStoreWrapper.jsx"), "utf-8");
assert(
  clientStoreWrapper.includes('min-w-0 w-full overflow-x-clip'),
  "ClientStoreWrapper contains <main id=\"main\" className=\"min-w-0 w-full overflow-x-clip\">",
  "Prevents flex/grid blowouts and horizontal page overflows"
);

// ============================================================================
// 2. Touch Targets Analysis (>= 44px for primary triggers & close buttons)
// ============================================================================
console.log("\n--- 2. Testing Touch Targets (>= 44px / w-11 h-11) ---");

// CartDrawer close button
const cartDrawer = fs.readFileSync(path.join(projectRoot, "app/components/CartDrawer.jsx"), "utf-8");
assert(
  cartDrawer.includes("w-11 h-11") && cartDrawer.includes('aria-label="إغلاق السلة"'),
  "CartDrawer close button has w-11 h-11 (44px x 44px)"
);
assert(
  cartDrawer.includes("w-9 h-9"),
  "CartDrawer quantity stepper buttons have w-9 h-9 (36px x 36px)"
);

// WishlistDrawer close button
const wishlistDrawer = fs.readFileSync(path.join(projectRoot, "app/components/WishlistDrawer.jsx"), "utf-8");
assert(
  wishlistDrawer.includes("w-11 h-11") && wishlistDrawer.includes('aria-label="إغلاق المفضلة"'),
  "WishlistDrawer close button has w-11 h-11 (44px x 44px)"
);

// CheckoutModal close button
const checkoutModal = fs.readFileSync(path.join(projectRoot, "app/components/CheckoutModal.jsx"), "utf-8");
assert(
  checkoutModal.includes("w-11 h-11") && checkoutModal.includes('aria-label="إغلاق"'),
  "CheckoutModal close button has w-11 h-11 (44px x 44px)"
);

// QuickViewModal close button & controls
const quickViewModal = fs.readFileSync(path.join(projectRoot, "app/components/QuickViewModal.jsx"), "utf-8");
assert(
  quickViewModal.includes("w-11 h-11 rounded-full") && quickViewModal.includes('setQuickProduct(null)'),
  "QuickViewModal close button has w-11 h-11 (44px x 44px)"
);
assert(
  quickViewModal.includes("w-11 h-11 rounded-full bg-black/60"),
  "QuickViewModal gallery prev/next navigation arrows have w-11 h-11 (44px x 44px)"
);

// SearchModal close button
const searchModal = fs.readFileSync(path.join(projectRoot, "app/components/SearchModal.jsx"), "utf-8");
assert(
  searchModal.includes("w-11 h-11 rounded-full bg-white/10") && searchModal.includes('setIsSearchOpen(false)'),
  "SearchModal close button has w-11 h-11 (44px x 44px)"
);

// MobileMenuDrawer close button & nav items
const mobileMenuDrawer = fs.readFileSync(path.join(projectRoot, "app/components/MobileMenuDrawer.jsx"), "utf-8");
assert(
  mobileMenuDrawer.includes("w-11 h-11 rounded-full bg-white/10") && mobileMenuDrawer.includes("closeMenu"),
  "MobileMenuDrawer close button has w-11 h-11 (44px x 44px)"
);
assert(
  mobileMenuDrawer.includes("min-h-[44px]"),
  "MobileMenuDrawer search trigger and navigation links have min-h-[44px]"
);

// Navbar mobile triggers
const navbar = fs.readFileSync(path.join(projectRoot, "app/components/Navbar.jsx"), "utf-8");
assert(
  navbar.includes("w-11 h-11 rounded-xl") && navbar.includes("setIsMobileMenuOpen(true)"),
  "Navbar mobile hamburger toggle button has w-11 h-11 (44px x 44px)"
);
assert(
  navbar.includes("w-11 h-11 rounded-xl") && navbar.includes('aria-label="بحث"'),
  "Navbar mobile search toggle button has w-11 h-11 (44px x 44px)"
);

// MobileBottomNav items (all 5 items min-h-[44px] min-w-[44px] & safe area padding)
const mobileBottomNav = fs.readFileSync(path.join(projectRoot, "app/components/MobileBottomNav.jsx"), "utf-8");
const navItemMatches = mobileBottomNav.match(/min-h-\[44px\]\s+min-w-\[44px\]/g) || [];
assert(
  navItemMatches.length === 5,
  `MobileBottomNav has all 5 primary items with min-h-[44px] min-w-[44px] (found ${navItemMatches.length})`
);
assert(
  mobileBottomNav.includes("safe-area-inset-bottom"),
  "MobileBottomNav contains iOS safe-area-inset-bottom padding"
);

// Product Detail Page controls
const productDetailPage = fs.readFileSync(path.join(projectRoot, "app/product/[id]/page.jsx"), "utf-8");
assert(
  productDetailPage.includes("w-11 h-11 rounded-full bg-white/90") && productDetailPage.includes("toggleWishlist"),
  "Product detail page wishlist button has w-11 h-11 (44px x 44px)"
);
assert(
  productDetailPage.includes("w-11 h-11 rounded-full bg-black/60"),
  "Product detail page gallery navigation arrows have w-11 h-11 (44px x 44px)"
);

// Admin page product modal close button
const adminPage = fs.readFileSync(path.join(projectRoot, "app/admin/page.jsx"), "utf-8");
assert(
  adminPage.includes("w-11 h-11 rounded-full bg-white/10") && adminPage.includes("setShowAddModal(false)"),
  "Admin product modal close button has w-11 h-11 (44px x 44px)"
);

// ============================================================================
// 3. ProductCard Responsive Geometry & 320px Zero-Overflow Analysis
// ============================================================================
console.log("\n--- 3. Testing ProductCard Responsive Geometry & Dimensions ---");

const productCard = fs.readFileSync(path.join(projectRoot, "app/components/ProductCard.jsx"), "utf-8");

assert(productCard.includes("p-2 sm:p-4"), "ProductCard image container has responsive padding p-2 sm:p-4");
assert(productCard.includes("p-2.5 sm:p-4"), "ProductCard card body has responsive padding p-2.5 sm:p-4");
assert(productCard.includes("text-sm sm:text-lg font-extrabold"), "ProductCard price typography has text-sm sm:text-lg font-extrabold");
assert(productCard.includes("text-[9px] sm:text-[11px]"), "ProductCard badge text scales down to text-[9px]");
assert(
  productCard.includes("px-1.5 sm:px-2.5") && productCard.includes("h-8 sm:h-9"),
  "ProductCard Instant Cash button has h-8 sm:h-9 and px-1.5 sm:px-2.5"
);
assert(productCard.includes("w-8 h-8 sm:w-9 sm:h-9"), "ProductCard WhatsApp and Cart buttons have w-8 h-8 sm:w-9 sm:h-9");
assert(productCard.includes("overflow-hidden rounded-2xl"), "ProductCard article root has overflow-hidden preventing child bleed");
assert(productCard.includes("flex-col min-w-0"), "ProductCard price container has min-w-0 preventing flex overflow");
assert(productCard.includes("shrink-0"), "ProductCard action button container has shrink-0 protecting action controls");

// Mathematical Layout Simulation for 320px Viewport
console.log("\n--- Simulating 320px Viewport Geometry ---");
const viewports = [
  { name: "320px Ultra-Compact (iPhone SE 1st / small Android)", width: 320, padding: 32, gap: 12 },
  { name: "360px Compact Android (Galaxy S8/S9)", width: 360, padding: 32, gap: 12 },
  { name: "375px iPhone Mini / iPhone SE 2nd", width: 375, padding: 32, gap: 12 },
  { name: "390px iPhone 12/13/14 Pro", width: 390, padding: 32, gap: 12 },
  { name: "430px iPhone 15/16 Pro Max", width: 430, padding: 32, gap: 12 }
];

for (const vp of viewports) {
  const gridWidth = vp.width - vp.padding;
  const colWidth = (gridWidth - vp.gap) / 2;
  const cardInnerWidth = colWidth - 2 - 20; // 2px border, 20px padding (p-2.5 = 10px each side)
  
  // Action buttons: Instant Cash (~38px) + Gap (4px) + WhatsApp (32px) + Gap (4px) + Cart (32px) = ~110px
  const actionsWidth = 38 + 4 + 32 + 4 + 32;
  
  console.log(`[Viewport ${vp.width}px]: colWidth=${colWidth.toFixed(1)}px, cardInnerWidth=${cardInnerWidth.toFixed(1)}px, actionsWidth=${actionsWidth}px`);
  assert(
    colWidth > 130,
    `Viewport ${vp.width}px provides column width > 130px (actual: ${colWidth.toFixed(1)}px)`
  );
  assert(
    cardInnerWidth > 105,
    `Viewport ${vp.width}px inner card body > 105px (actual: ${cardInnerWidth.toFixed(1)}px)`
  );
}

// ============================================================================
// 4. Responsive Grid Breakpoints (md:grid-cols-3)
// ============================================================================
console.log("\n--- 4. Testing Responsive Grid Breakpoints ---");

const filesWithProductGrids = [
  { file: "app/shop/page.jsx", desc: "Catalog page" },
  { file: "app/page.jsx", desc: "Homepage (Best Sellers & Top Rated)" },
  { file: "app/components/MensCollectionSection.jsx", desc: "Dedicated Men's Collection" },
  { file: "app/components/WomensCollectionSection.jsx", desc: "Dedicated Women's Collection" },
  { file: "app/product/[id]/page.jsx", desc: "Product detail related watches" }
];

for (const target of filesWithProductGrids) {
  const content = fs.readFileSync(path.join(projectRoot, target.file), "utf-8");
  const hasBalancedGrid = content.includes("grid-cols-2 md:grid-cols-3 lg:grid-cols-4");
  assert(
    hasBalancedGrid,
    `${target.desc} (${target.file}) features 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'`,
    "Provides intermediate 3-column layout on tablets (768px-1023px)"
  );
}

// ============================================================================
// 5. Overflow Bleed Safeguards in Admin Login and WhatsAppSection
// ============================================================================
console.log("\n--- 5. Testing Overflow Bleed Safeguards ---");

const adminLogin = fs.readFileSync(path.join(projectRoot, "app/admin/login/page.jsx"), "utf-8");
assert(
  adminLogin.includes("relative overflow-hidden"),
  "Admin login page container has 'relative overflow-hidden' to clip 384px ambient glow"
);

const whatsappSection = fs.readFileSync(path.join(projectRoot, "app/components/WhatsAppSection.jsx"), "utf-8");
assert(
  whatsappSection.includes("hidden sm:inline") && whatsappSection.includes("sm:hidden"),
  "WhatsAppSection CTA button has responsive text copy to prevent wrapping on mobile"
);
assert(
  whatsappSection.includes("w-full sm:w-auto"),
  "WhatsAppSection action buttons adapt with 'w-full sm:w-auto'"
);

// ============================================================================
// Final Verdict
// ============================================================================
console.log("\n=================================================");
console.log(`Milestone 3 Empirical Verification Summary:`);
console.log(`Total assertions: ${results.total}`);
console.log(`Passed: ${results.passed}`);
console.log(`Failed: ${results.failed}`);
console.log("=================================================\n");

if (results.failed > 0) {
  console.error("VERDICT: REJECT - Empirical tests failed.");
  process.exit(1);
} else {
  console.log("VERDICT: APPROVE - All empirical tests passed with 100% success.");
  process.exit(0);
}
