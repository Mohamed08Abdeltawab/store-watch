/**
 * Empirical Stress Test Suite for Milestone 2 (R2):
 * Men's & Women's Collections and ProductCard Enhancements
 */

import { DatabaseSync } from "node:sqlite";
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
console.log("Starting Milestone 2 Empirical Test Suite");
console.log("=================================================\n");

// ============================================================================
// 1. SQLite Database Integrity & Seed Verification
// ============================================================================
console.log("--- 1. Testing SQLite Database & Product Seeding ---");

const dbPath = path.join(projectRoot, "ben10.db");
assert(fs.existsSync(dbPath), "ben10.db exists", `Expected SQLite database file at ${dbPath}`);

const db = new DatabaseSync(dbPath);

const allProducts = db.prepare("SELECT * FROM products").all();
console.log(`Total products in SQLite: ${allProducts.length}`);
assert(allProducts.length >= 10, "Total product count >= 10", `Found ${allProducts.length} products`);

const menProductsDb = db.prepare("SELECT * FROM products WHERE target_audience = 'رجالي'").all();
console.log(`Men's products count: ${menProductsDb.length}`);
assert(menProductsDb.length >= 4, "Men's products count in SQLite >= 4", `Found ${menProductsDb.length} men's products`);

const womenProductsDb = db.prepare("SELECT * FROM products WHERE target_audience = 'حريمي'").all();
console.log(`Women's products count: ${womenProductsDb.length}`);
assert(womenProductsDb.length >= 4, "Women's products count in SQLite >= 4", `Found ${womenProductsDb.length} women's products`);

// Validate data integrity of each product
for (const p of [...menProductsDb, ...womenProductsDb]) {
  const label = `[${p.id}] (${p.target_audience})`;
  assert(typeof p.name === "string" && p.name.trim().length > 0, `${label} has non-empty name`, `Name: ${p.name}`);
  assert(typeof p.price === "number" && p.price > 0, `${label} has valid positive price`, `Price: ${p.price}`);
  if (p.old_price !== null && p.old_price !== undefined) {
    assert(typeof p.old_price === "number" && p.old_price >= p.price, `${label} old_price >= price`, `old_price: ${p.old_price}, price: ${p.price}`);
  }
  assert(typeof p.image === "string" && p.image.trim().length > 0, `${label} has non-empty image path`, `Image: ${p.image}`);

  // Verify image asset file actually exists in public/
  if (p.image.startsWith("/")) {
    const assetPath = path.join(projectRoot, "public", p.image);
    assert(fs.existsSync(assetPath), `${label} image asset exists on disk`, `Expected file at ${assetPath}`);
  }
}

// ============================================================================
// 2. Audience Filter Logic Simulation (Homepage & /shop)
// ============================================================================
console.log("\n--- 2. Testing Filter Logic & Partitioning ---");

// Simulated homepage filter logic from app/page.jsx
const hpMenProducts = allProducts
  .filter(p => p.target_audience && (p.target_audience === "رجالي" || p.target_audience.includes("رجالي")))
  .slice(0, 4);

const hpWomenProducts = allProducts
  .filter(p => p.target_audience && (p.target_audience === "حريمي" || p.target_audience.includes("حريمي")))
  .slice(0, 4);

assert(hpMenProducts.length === 4, "Homepage menProducts has exactly 4 items", `Got ${hpMenProducts.length}`);
assert(hpWomenProducts.length === 4, "Homepage womenProducts has exactly 4 items", `Got ${hpWomenProducts.length}`);

// Check that no women's item is in menProducts
const menHasWomen = hpMenProducts.some(p => p.target_audience === "حريمي");
assert(!menHasWomen, "hpMenProducts contains no 'حريمي' items", `Found women products in men list: ${menHasWomen}`);

// Check that no men's item is in womenProducts
const womenHasMen = hpWomenProducts.some(p => p.target_audience === "رجالي");
assert(!womenHasMen, "hpWomenProducts contains no 'رجالي' items", `Found men products in women list: ${womenHasMen}`);

// Simulated /shop audience filter logic from app/shop/page.jsx
function simulateShopFilter(productsList, audienceParam) {
  let activeAudience = "all";
  if (audienceParam) {
    if (audienceParam === "men" || audienceParam === "رجالي") activeAudience = "رجالي";
    else if (audienceParam === "women" || audienceParam === "حريمي") activeAudience = "حريمي";
    else activeAudience = audienceParam;
  }

  return productsList.filter(p => {
    if (activeAudience !== "all") {
      if (!p.target_audience) return false;
      const matchesAudience = p.target_audience.includes(activeAudience) || p.target_audience === "للجنسين";
      if (!matchesAudience) return false;
    }
    return true;
  });
}

const shopMenResult = simulateShopFilter(allProducts, "men");
const shopWomenResult = simulateShopFilter(allProducts, "women");
const shopMenArabicResult = simulateShopFilter(allProducts, "رجالي");
const shopWomenArabicResult = simulateShopFilter(allProducts, "حريمي");

assert(shopMenResult.length >= 4, "/shop?audience=men returns >= 4 products", `Got ${shopMenResult.length}`);
assert(shopWomenResult.length >= 4, "/shop?audience=women returns >= 4 products", `Got ${shopWomenResult.length}`);
assert(shopMenResult.length === shopMenArabicResult.length, "English and Arabic 'men' param produce identical counts", `${shopMenResult.length} vs ${shopMenArabicResult.length}`);
assert(shopWomenResult.length === shopWomenArabicResult.length, "English and Arabic 'women' param produce identical counts", `${shopWomenResult.length} vs ${shopWomenArabicResult.length}`);

// Verify unisex items appear in both, but strictly gendered items do not cross
for (const p of shopMenResult) {
  assert(p.target_audience === "رجالي" || p.target_audience === "للجنسين", `/shop?audience=men item [${p.id}] has valid audience`, `Got: ${p.target_audience}`);
}
for (const p of shopWomenResult) {
  assert(p.target_audience === "حريمي" || p.target_audience === "للجنسين", `/shop?audience=women item [${p.id}] has valid audience`, `Got: ${p.target_audience}`);
}

// Edge case: null/empty/undefined target_audience must not leak
const mockProductsWithNull = [
  ...allProducts,
  { id: "ghost-1", name: "Ghost watch", price: 1000, target_audience: null },
  { id: "ghost-2", name: "Empty watch", price: 1000, target_audience: "" },
  { id: "ghost-3", name: "Undefined watch", price: 1000 }
];

const mockMenFilter = simulateShopFilter(mockProductsWithNull, "men");
const mockWomenFilter = simulateShopFilter(mockProductsWithNull, "women");
assert(!mockMenFilter.some(p => p.id.startsWith("ghost-")), "Items with null/empty audience do not leak into men's shop", "Ghost items filtered out");
assert(!mockWomenFilter.some(p => p.id.startsWith("ghost-")), "Items with null/empty audience do not leak into women's shop", "Ghost items filtered out");

// ============================================================================
// 3. Component Code & JSX Structure Verification
// ============================================================================
console.log("\n--- 3. Testing Component Files & Structural Requirements ---");

// Check MensCollectionSection.jsx
const mensFile = path.join(projectRoot, "app", "components", "MensCollectionSection.jsx");
assert(fs.existsSync(mensFile), "MensCollectionSection.jsx exists");
const mensContent = fs.readFileSync(mensFile, "utf-8");

assert(mensContent.includes('id="men-collection"'), "MensCollectionSection has anchor id='men-collection'");
assert(mensContent.includes('href="/shop?audience=men"'), "MensCollectionSection links to /shop?audience=men");
assert(mensContent.includes("عرض كل التشكيلة الرجالية"), "MensCollectionSection has button text 'عرض كل التشكيلة الرجالية'");
assert(mensContent.includes("تشكيلة الرجال الحصرية"), "MensCollectionSection has badge 'تشكيلة الرجال الحصرية'");
assert(mensContent.includes("grid-cols-2") && mensContent.includes("md:grid-cols-3") && mensContent.includes("lg:grid-cols-4"), "MensCollectionSection has responsive 4-column grid");
assert(mensContent.includes("<ProductCard"), "MensCollectionSection renders ProductCard");

// Check WomensCollectionSection.jsx
const womensFile = path.join(projectRoot, "app", "components", "WomensCollectionSection.jsx");
assert(fs.existsSync(womensFile), "WomensCollectionSection.jsx exists");
const womensContent = fs.readFileSync(womensFile, "utf-8");

assert(womensContent.includes('id="women-collection"'), "WomensCollectionSection has anchor id='women-collection'");
assert(womensContent.includes('href="/shop?audience=women"'), "WomensCollectionSection links to /shop?audience=women");
assert(womensContent.includes("عرض كل التشكيلة النسائية"), "WomensCollectionSection has button text 'عرض كل التشكيلة النسائية'");
assert(womensContent.includes("تشكيلة النساء الراقية"), "WomensCollectionSection has badge 'تشكيلة النساء الراقية'");
assert(womensContent.includes("grid-cols-2") && womensContent.includes("md:grid-cols-3") && womensContent.includes("lg:grid-cols-4"), "WomensCollectionSection has responsive 4-column grid");
assert(womensContent.includes("<ProductCard"), "WomensCollectionSection renders ProductCard");

// Check ProductCard.jsx enhancements
const productCardFile = path.join(projectRoot, "app", "components", "ProductCard.jsx");
assert(fs.existsSync(productCardFile), "ProductCard.jsx exists");
const cardContent = fs.readFileSync(productCardFile, "utf-8");

assert(cardContent.includes("openCheckoutWithProduct"), "ProductCard imports and uses openCheckoutWithProduct");
assert(cardContent.includes("⚡") && cardContent.includes("كاش"), "ProductCard contains instant cash buy button '⚡ كاش'");
assert(cardContent.includes("sm:hidden") && cardContent.includes("setQuickProduct"), "ProductCard has mobile quick view trigger");
assert(cardContent.includes("sendDirectWhatsApp"), "ProductCard has WhatsApp direct order trigger");
assert(cardContent.includes("addToCart"), "ProductCard has Add to Cart trigger");
assert(cardContent.includes("toggleWishlist"), "ProductCard has Wishlist toggle");
assert(
  cardContent.includes("Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100)") ||
  cardContent.includes("Math.round(((product.old_price - product.price) / product.old_price) * 100)"),
  "ProductCard calculates discount percentage correctly"
);

// Check app/page.jsx integration
const pageFile = path.join(projectRoot, "app", "page.jsx");
assert(fs.existsSync(pageFile), "app/page.jsx exists");
const pageContent = fs.readFileSync(pageFile, "utf-8");

assert(pageContent.includes("import MensCollectionSection from \"./components/MensCollectionSection\""), "app/page.jsx imports MensCollectionSection");
assert(pageContent.includes("import WomensCollectionSection from \"./components/WomensCollectionSection\""), "app/page.jsx imports WomensCollectionSection");
assert(pageContent.includes("<MensCollectionSection products={menProducts} />"), "app/page.jsx renders MensCollectionSection");
assert(pageContent.includes("<WomensCollectionSection products={womenProducts} />"), "app/page.jsx renders WomensCollectionSection");
assert(!pageContent.includes("<AudienceSection />") && !pageContent.includes("import AudienceSection"), "app/page.jsx removed old AudienceSection");

// Check supabase_schema.sql synchronization
const schemaFile = path.join(projectRoot, "supabase_schema.sql");
assert(fs.existsSync(schemaFile), "supabase_schema.sql exists");
const schemaContent = fs.readFileSync(schemaFile, "utf-8");

assert(schemaContent.includes("ben10-lady-elegance"), "supabase_schema.sql contains ben10-lady-elegance");
assert(schemaContent.includes("ben10-lady-rosegold"), "supabase_schema.sql contains ben10-lady-rosegold");
assert(schemaContent.includes("ben10-lady-prestige"), "supabase_schema.sql contains ben10-lady-prestige");
assert(schemaContent.includes("ben10-lady-slim-classic"), "supabase_schema.sql contains ben10-lady-slim-classic");
assert(schemaContent.includes("'حريمي'"), "supabase_schema.sql contains 'حريمي' target_audience");

// ============================================================================
// Final Verdict & Summary
// ============================================================================
console.log("\n=================================================");
console.log(`TEST SUMMARY: ${results.passed}/${results.total} passed (${results.failed} failed)`);
console.log("=================================================");

if (results.failed > 0) {
  console.error("\nFAILURES DETECTED:");
  for (const f of results.details.filter(d => d.status === "FAIL")) {
    console.error(` - ${f.testName}: ${f.details}`);
  }
  process.exit(1);
} else {
  console.log("\nALL TESTS PASSED EMPIRICALLY!");
  process.exit(0);
}
