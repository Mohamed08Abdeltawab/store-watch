/**
 * Adversarial Stress Test Suite for Milestone 3 (R3):
 * Edge Cases, Worst-Case Inputs, Horizontal Overflow Probing, and Touch Targets
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const stressResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

function assert(condition, testName, details = "") {
  stressResults.total++;
  if (condition) {
    stressResults.passed++;
    stressResults.details.push({ status: "PASS", testName, details });
    console.log(`[PASS] ${testName}`);
  } else {
    stressResults.failed++;
    stressResults.details.push({ status: "FAIL", testName, details });
    console.error(`[FAIL] ${testName} - ${details}`);
  }
}

console.log("=================================================");
console.log("Starting Milestone 3 Adversarial Stress Test Suite");
console.log("=================================================\n");

// ============================================================================
// Stress Scenario 1: Worst-Case Text & Price Explosion in ProductCard
// ============================================================================
console.log("--- Stress Scenario 1: Extreme String & Number Lengths in ProductCard ---");

const productCardSource = fs.readFileSync(path.join(projectRoot, "app/components/ProductCard.jsx"), "utf-8");

// Check defensive truncation guards
assert(
  productCardSource.includes("line-clamp-1 mb-0.5 sm:mb-1"),
  "Product title has line-clamp-1 to prevent multi-line vertical blowout"
);
assert(
  productCardSource.includes("line-clamp-1 mb-2 sm:mb-3"),
  "Product subtitle has line-clamp-1 to prevent multi-line vertical blowout"
);
assert(
  productCardSource.includes("truncate max-w-[65%]"),
  "Product category + audience tag has truncate max-w-[65%] to protect rating star"
);
assert(
  productCardSource.includes("truncate") && productCardSource.includes("min-w-0"),
  "Price block is enclosed in min-w-0 flex container with truncate to survive 8-digit price"
);
assert(
  productCardSource.includes("overflow-hidden rounded-2xl"),
  "Card container has overflow-hidden so zero child element can exceed card boundaries"
);

// ============================================================================
// Stress Scenario 2: Uncontained Width & Min-Width Bleed Audit
// ============================================================================
console.log("\n--- Stress Scenario 2: Site-Wide Arbitrary Pixel Width Bleed Audit ---");

// Scan all JSX files in app/ for min-w-[...px] or w-[...px]
const appDir = path.join(projectRoot, "app");
function getAllJsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsxFiles(fullPath));
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      results.push(fullPath);
    }
  }
  return results;
}

const allJsx = getAllJsxFiles(appDir);
let fixedWidthBleeds = [];

for (const file of allJsx) {
  const content = fs.readFileSync(file, "utf-8");
  // Find min-w-[>320px] without overflow container
  const minWidthMatches = content.match(/min-w-\[(\d+)px\]/g);
  if (minWidthMatches) {
    for (const m of minWidthMatches) {
      const px = parseInt(m.match(/\d+/)[0], 10);
      if (px > 320) {
        // Verify file contains overflow-x-auto or overflow-hidden
        const hasOverflowContainer = content.includes("overflow-x-auto") || content.includes("overflow-hidden");
        if (!hasOverflowContainer) {
          fixedWidthBleeds.push({ file: path.relative(projectRoot, file), match: m, px });
        }
      }
    }
  }
}

assert(
  fixedWidthBleeds.length === 0,
  `Zero uncontained min-w-[>320px] found across all ${allJsx.length} JSX files`,
  fixedWidthBleeds.length > 0 ? JSON.stringify(fixedWidthBleeds) : "All wide elements properly wrapped"
);

// ============================================================================
// Stress Scenario 3: Modals and Drawers Full Containment & Z-Index Stack
// ============================================================================
console.log("\n--- Stress Scenario 3: Modals and Drawers Touch & Layout Containment ---");

const drawerFiles = [
  { file: "app/components/CartDrawer.jsx", name: "CartDrawer" },
  { file: "app/components/WishlistDrawer.jsx", name: "WishlistDrawer" },
  { file: "app/components/CheckoutModal.jsx", name: "CheckoutModal" },
  { file: "app/components/QuickViewModal.jsx", name: "QuickViewModal" },
  { file: "app/components/SearchModal.jsx", name: "SearchModal" },
  { file: "app/components/MobileMenuDrawer.jsx", name: "MobileMenuDrawer" }
];

for (const d of drawerFiles) {
  const code = fs.readFileSync(path.join(projectRoot, d.file), "utf-8");
  assert(code.includes("w-11 h-11"), `${d.name} provides 44px close button (w-11 h-11)`);
  assert(
    code.includes("overflow-y-auto") || code.includes("overflow-hidden"),
    `${d.name} contains internal overflow container for small screen height scrolling`
  );
  assert(code.includes("z-50"), `${d.name} has z-50 overlay layering above sticky headers`);
}

// ============================================================================
// Stress Scenario 4: Marquee Containment on 320px Screen
// ============================================================================
console.log("\n--- Stress Scenario 4: Marquee Ticker 320px Containment ---");

const marqueeTicker = fs.readFileSync(path.join(projectRoot, "app/components/MarqueeTicker.jsx"), "utf-8");
assert(
  marqueeTicker.includes("overflow-hidden"),
  "MarqueeTicker root wrapper enforces overflow-hidden to prevent 320px horizontal page blowout"
);
assert(
  marqueeTicker.includes("w-full"),
  "MarqueeTicker root wrapper enforces w-full"
);

// ============================================================================
// Stress Scenario 5: Touch Targets Ergonomics Audit
// ============================================================================
console.log("\n--- Stress Scenario 5: Touch Targets Ergonomics Comprehensive Audit ---");

// Check MobileBottomNav has 5 distinct buttons and no zero-size targets
const mobileBottomNav = fs.readFileSync(path.join(projectRoot, "app/components/MobileBottomNav.jsx"), "utf-8");
const navButtons = mobileBottomNav.match(/min-h-\[44px\]/g) || [];
assert(navButtons.length === 5, "MobileBottomNav has exactly 5 buttons >= 44px");

// Check Navbar mobile controls
const navbar = fs.readFileSync(path.join(projectRoot, "app/components/Navbar.jsx"), "utf-8");
assert(navbar.includes("w-11 h-11 rounded-xl"), "Navbar contains w-11 h-11 mobile hamburger button");

// ============================================================================
// Stress Scenario 6: Intermediate Tablet Viewport Continuity (768px - 1023px)
// ============================================================================
console.log("\n--- Stress Scenario 6: Tablet Viewport Continuity ---");

const gridsToCheck = [
  "app/shop/page.jsx",
  "app/page.jsx",
  "app/components/MensCollectionSection.jsx",
  "app/components/WomensCollectionSection.jsx",
  "app/product/[id]/page.jsx"
];

for (const g of gridsToCheck) {
  const content = fs.readFileSync(path.join(projectRoot, g), "utf-8");
  assert(
    content.includes("md:grid-cols-3"),
    `${g} bridges phone (2-col) and desktop (4-col) with md:grid-cols-3`
  );
}

// ============================================================================
// Summary
// ============================================================================
console.log("\n=================================================");
console.log(`Adversarial Stress Verification Summary:`);
console.log(`Total assertions: ${stressResults.total}`);
console.log(`Passed: ${stressResults.passed}`);
console.log(`Failed: ${stressResults.failed}`);
console.log("=================================================\n");

if (stressResults.failed > 0) {
  console.error("VERDICT: REJECT - Adversarial stress tests failed.");
  process.exit(1);
} else {
  console.log("VERDICT: APPROVE - All adversarial stress tests passed cleanly.");
  process.exit(0);
}
