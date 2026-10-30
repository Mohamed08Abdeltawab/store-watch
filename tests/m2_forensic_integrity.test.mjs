import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

console.log("=== STARTING MILESTONE 2 FORENSIC INTEGRITY CHECKS ===");

const projectRoot = process.cwd();

// ----------------------------------------------------
// Check 1: Database records in ben10.db
// ----------------------------------------------------
console.log("\n[Check 1] Inspecting SQLite database (ben10.db)...");
const dbPath = path.join(projectRoot, "ben10.db");
assert(fs.existsSync(dbPath), "ben10.db must exist");

const db = new DatabaseSync(dbPath);
const allProducts = db.prepare("SELECT * FROM products").all();
console.log(`Total products in ben10.db: ${allProducts.length}`);
assert(allProducts.length >= 11, `Expected at least 11 products, found ${allProducts.length}`);

const menProducts = allProducts.filter(p => p.target_audience === "رجالي");
const womenProducts = allProducts.filter(p => p.target_audience === "حريمي");
const unisexProducts = allProducts.filter(p => p.target_audience === "للجنسين");

console.log(`Men's products count: ${menProducts.length}`);
console.log(`Women's products count: ${womenProducts.length}`);
console.log(`Unisex products count: ${unisexProducts.length}`);

assert(menProducts.length >= 4, `Expected at least 4 men's watches, got ${menProducts.length}`);
assert(womenProducts.length >= 4, `Expected at least 4 women's watches, got ${womenProducts.length}`);

// Inspect each women's watch for authentic attributes
const expectedWomenIds = [
  "ben10-lady-elegance",
  "ben10-lady-rosegold",
  "ben10-lady-prestige",
  "ben10-lady-slim-classic"
];

for (const wid of expectedWomenIds) {
  const watch = womenProducts.find(p => p.id === wid);
  assert(watch, `Women's watch ${wid} must exist in ben10.db`);
  assert(watch.name && watch.name.trim().length > 5, `Watch ${wid} name must be authentic: ${watch.name}`);
  assert(Number(watch.price) > 1000, `Watch ${wid} price must be realistic (>1000 EGP): ${watch.price}`);
  assert(Number(watch.old_price) > Number(watch.price), `Watch ${wid} old_price (${watch.old_price}) must exceed price (${watch.price})`);
  assert(Number(watch.rating) >= 4.5, `Watch ${wid} rating must be valid: ${watch.rating}`);
  assert(Number(watch.reviews) > 0, `Watch ${wid} reviews count must be > 0: ${watch.reviews}`);
  assert(watch.movement && watch.movement.trim().length > 5, `Watch ${wid} specs_movement must be authentic`);
  assert(watch.case_material && watch.case_material.trim().length > 5, `Watch ${wid} specs_case must be authentic`);
  assert(watch.glass && watch.glass.trim().length > 5, `Watch ${wid} specs_glass must be authentic`);
  assert(watch.diameter && watch.diameter.trim().length > 2, `Watch ${wid} specs_diameter must be authentic`);
  assert(watch.water_resist && watch.water_resist.trim().length > 2, `Watch ${wid} specs_water must be authentic`);
  assert(watch.strap && watch.strap.trim().length > 5, `Watch ${wid} specs_strap must be authentic`);
  assert(watch.warranty && watch.warranty.trim().length > 5, `Watch ${wid} specs_warranty must be authentic`);
  
  // Verify image file
  const imgRel = watch.image.startsWith("/") ? watch.image.slice(1) : watch.image;
  const imgFull = path.join(projectRoot, "public", imgRel);
  assert(fs.existsSync(imgFull), `Image for ${wid} must exist at ${imgFull}`);
  console.log(`  ✓ Verified women's watch: ${watch.id} ("${watch.name}", ${watch.price} EGP, image: ${watch.image})`);
}

// ----------------------------------------------------
// Check 2: supabase_schema.sql Synchronization
// ----------------------------------------------------
console.log("\n[Check 2] Inspecting supabase_schema.sql synchronization...");
const sqlContent = fs.readFileSync(path.join(projectRoot, "supabase_schema.sql"), "utf-8");
assert(sqlContent.includes("target_audience"), "supabase_schema.sql must include target_audience column in schema / insert");
assert(sqlContent.includes("color"), "supabase_schema.sql must include color column");
for (const wid of expectedWomenIds) {
  assert(sqlContent.includes(wid), `supabase_schema.sql must seed ${wid}`);
}
console.log("  ✓ Verified supabase_schema.sql contains all women's products and updated columns.");

// ----------------------------------------------------
// Check 3: ProductCard.jsx Wiring
// ----------------------------------------------------
console.log("\n[Check 3] Inspecting ProductCard.jsx wiring and authenticity...");
const pcContent = fs.readFileSync(path.join(projectRoot, "app", "components", "ProductCard.jsx"), "utf-8");

assert(pcContent.includes("openCheckoutWithProduct"), "ProductCard.jsx must import and use openCheckoutWithProduct");
assert(pcContent.includes("useCart()"), "ProductCard.jsx must consume useCart");

// Check Cash Buy button
assert(pcContent.includes("openCheckoutWithProduct(product)"), "Cash Buy button must invoke openCheckoutWithProduct(product)");
assert(pcContent.includes("⚡"), "Cash Buy button must feature the lightning bolt indicator");
assert(pcContent.includes("كاش"), "Cash Buy button must label 'كاش'");

// Check Mobile Quick View trigger
assert(pcContent.includes("sm:hidden"), "Mobile quick view trigger must be present for small screens");
assert(pcContent.includes("setQuickProduct(product)"), "Mobile quick view trigger must invoke setQuickProduct(product)");

// Check Desktop Quick View trigger
assert(pcContent.includes("hidden sm:block"), "Desktop quick view trigger must be present");

// Check event propagation stop
assert(pcContent.includes("e.stopPropagation()"), "Card action buttons must stop event propagation to avoid Link trigger");

console.log("  ✓ Verified ProductCard.jsx has genuine openCheckoutWithProduct and mobile Quick View wiring.");

// ----------------------------------------------------
// Check 4: MensCollectionSection.jsx & WomensCollectionSection.jsx
// ----------------------------------------------------
console.log("\n[Check 4] Inspecting MensCollectionSection and WomensCollectionSection...");
const mensFile = path.join(projectRoot, "app", "components", "MensCollectionSection.jsx");
const womensFile = path.join(projectRoot, "app", "components", "WomensCollectionSection.jsx");

assert(fs.existsSync(mensFile), "MensCollectionSection.jsx must exist");
assert(fs.existsSync(womensFile), "WomensCollectionSection.jsx must exist");

const mensContent = fs.readFileSync(mensFile, "utf-8");
const womensContent = fs.readFileSync(womensFile, "utf-8");

// Check Men's section details
assert(mensContent.includes('id="men-collection"'), "MensCollectionSection must have id='men-collection'");
assert(mensContent.includes('/shop?audience=men'), "MensCollectionSection must link to /shop?audience=men");
assert(mensContent.includes("<ProductCard"), "MensCollectionSection must render ProductCard");
assert(mensContent.includes("grid-cols-2"), "MensCollectionSection must have responsive grid");

// Check Women's section details
assert(womensContent.includes('id="women-collection"'), "WomensCollectionSection must have id='women-collection'");
assert(womensContent.includes('/shop?audience=women'), "WomensCollectionSection must link to /shop?audience=women");
assert(womensContent.includes("<ProductCard"), "WomensCollectionSection must render ProductCard");
assert(womensContent.includes("grid-cols-2"), "WomensCollectionSection must have responsive grid");

console.log("  ✓ Verified MensCollectionSection and WomensCollectionSection are genuine components.");

// ----------------------------------------------------
// Check 5: app/page.jsx Integration
// ----------------------------------------------------
console.log("\n[Check 5] Inspecting app/page.jsx integration...");
const pageContent = fs.readFileSync(path.join(projectRoot, "app", "page.jsx"), "utf-8");

assert(pageContent.includes("import MensCollectionSection"), "app/page.jsx must import MensCollectionSection");
assert(pageContent.includes("import WomensCollectionSection"), "app/page.jsx must import WomensCollectionSection");
assert(pageContent.includes("<MensCollectionSection products={menProducts} />"), "app/page.jsx must render MensCollectionSection");
assert(pageContent.includes("<WomensCollectionSection products={womenProducts} />"), "app/page.jsx must render WomensCollectionSection");

// Verify filtering logic doesn't hardcode IDs
assert(!pageContent.includes("menProducts = ['ben10-classic-heritage'"), "menProducts must be dynamically filtered, not hardcoded array");
assert(!pageContent.includes("womenProducts = ['ben10-lady-elegance'"), "womenProducts must be dynamically filtered, not hardcoded array");

console.log("  ✓ Verified app/page.jsx cleanly filters and mounts both collection sections.");

// ----------------------------------------------------
// Check 6: app/shop/page.jsx Audience Filter Logic
// ----------------------------------------------------
console.log("\n[Check 6] Inspecting app/shop/page.jsx filter logic...");
const shopContent = fs.readFileSync(path.join(projectRoot, "app", "shop", "page.jsx"), "utf-8");

assert(shopContent.includes('audienceParam === "men" || audienceParam === "رجالي"'), "Shop must handle men/رجالي params");
assert(shopContent.includes('audienceParam === "women" || audienceParam === "حريمي"'), "Shop must handle women/حريمي params");
assert(shopContent.includes('if (!p.target_audience) return false;'), "Shop filter must safely handle missing target_audience");

console.log("  ✓ Verified app/shop/page.jsx audience filtering logic.");

// ----------------------------------------------------
// Check 7: Facade and Hardcoded Bypass Detection
// ----------------------------------------------------
console.log("\n[Check 7] Checking for facades, mock return stubs, or hardcoded bypasses...");
const filesToCheck = [
  mensFile,
  womensFile,
  path.join(projectRoot, "app", "components", "ProductCard.jsx"),
  path.join(projectRoot, "app", "page.jsx"),
  path.join(projectRoot, "app", "shop", "page.jsx")
];

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, "utf-8");
  // Check for common facade patterns
  assert(!content.includes("TODO: implement"), `File ${file} contains unfinished TODO: implement`);
  assert(!content.includes("throw new Error('Not implemented')"), `File ${file} contains NotImplemented stub`);
  assert(!content.includes("return true; // bypass"), `File ${file} contains hardcoded bypass`);
}

console.log("  ✓ No facades, stubs, or hardcoded bypasses detected.");

console.log("\n=== ALL FORENSIC INTEGRITY UNIT CHECKS PASSED ===");
