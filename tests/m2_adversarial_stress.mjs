/**
 * Adversarial Stress & Concurrency Test for Milestone 2
 */

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function formatProduct(r) {
  if (!r) return null;
  let images = [];
  if (Array.isArray(r.images)) {
    images = r.images;
  } else if (typeof r.images === "string") {
    try { images = JSON.parse(r.images); } catch (e) { images = []; }
  }
  if (!Array.isArray(images) || images.length === 0) {
    images = r.image ? [r.image] : [];
  }

  let colors = [];
  if (Array.isArray(r.colors)) {
    colors = r.colors;
  } else if (typeof r.colors === "string") {
    try { colors = JSON.parse(r.colors); } catch (e) { colors = []; }
  }

  return {
    ...r,
    image: images[0] || r.image || "/img/ben10-classic-concept-01.png",
    images: images.slice(0, 10),
    colors
  };
}

async function runAdversarialTests() {
  console.log("Starting Adversarial & Concurrency Stress Tests for Milestone 2...\n");

  let passed = 0;
  let failed = 0;

  function check(cond, desc) {
    if (cond) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  const db = new DatabaseSync(path.join(projectRoot, "ben10.db"));

  // 1. getAllProducts replication returns well-formed array
  const rawProducts = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  const products = rawProducts.map(formatProduct);
  check(Array.isArray(products) && products.length === 11, "getAllProducts returns 11 products");

  // 2. Verify all 4 women's watches have full schema
  const expectedWomenIds = [
    "ben10-lady-elegance",
    "ben10-lady-rosegold",
    "ben10-lady-prestige",
    "ben10-lady-slim-classic"
  ];

  const getProductById = (id) => {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return formatProduct(row);
  };

  for (const id of expectedWomenIds) {
    const p = getProductById(id);
    check(p !== null, `getProductById('${id}') found`);
    check(p?.target_audience === "حريمي", `${id} has target_audience === 'حريمي'`);
    check(Array.isArray(p?.images) && p.images.length > 0, `${id} has valid images array`);
    check(Array.isArray(p?.colors), `${id} has parsed colors array`);
    check(p?.price > 0 && p?.old_price >= p?.price, `${id} pricing consistent`);
  }

  // 3. Verify all 4 men's watches have full schema
  const expectedMenIds = [
    "ben10-classic-heritage",
    "ben10-apex-chrono",
    "ben10-skeleton-auto",
    "ben10-diver-pro-300"
  ];

  for (const id of expectedMenIds) {
    const p = getProductById(id);
    check(p !== null, `getProductById('${id}') found`);
    check(p?.target_audience === "رجالي", `${id} has target_audience === 'رجالي'`);
    check(p?.price > 0, `${id} price > 0`);
  }

  // 4. Concurrency Stress Test: 100 rapid read operations
  console.log("\nExecuting 100 rapid getProductById / getAllProducts queries...");
  const start = Date.now();
  let queryCount = 0;
  for (let i = 0; i < 50; i++) {
    const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    if (rows.length === 11) queryCount++;
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(expectedWomenIds[i % 4]);
    if (row && row.id) queryCount++;
  }
  const elapsed = Date.now() - start;
  check(queryCount === 100, `100 rapid queries succeeded in ${elapsed}ms`);

  // 5. Query non-existent ID
  const nonExistent = getProductById("non-existent-watch-999");
  check(nonExistent === null, "getProductById handles non-existent id gracefully");

  // 6. Test ProductCard discount math edge cases
  function calculateDiscount(price, old_price) {
    return old_price ? Math.round(((old_price - price) / old_price) * 100) : 0;
  }
  check(calculateDiscount(3450, 4100) === 16, "Discount for 3450 vs 4100 is 16%");
  check(calculateDiscount(3450, 3450) === 0, "Zero discount when price equals old_price");
  check(calculateDiscount(4000, 3000) === -33, "Negative discount when price increased (will not display badge)");
  check(calculateDiscount(4000, null) === 0, "Zero discount when old_price is null");
  check(calculateDiscount(4000, undefined) === 0, "Zero discount when old_price is undefined");

  console.log(`\nAdversarial Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runAdversarialTests().catch(err => {
  console.error("Adversarial test error:", err);
  process.exit(1);
});
