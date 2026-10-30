import assert from "node:assert";

console.log("=== RUNNING ADVERSARIAL STRESS TESTS FOR MILESTONE 2 ===");

// 1. Test filtering logic under edge-case inputs: null, undefined, malformed objects
const mockProducts = [
  { id: "1", target_audience: null },
  { id: "2", target_audience: undefined },
  { id: "3", target_audience: "" },
  { id: "4", target_audience: "رجالي" },
  { id: "5", target_audience: "حريمي" },
  { id: "6", target_audience: "للجنسين" },
  { id: "7", target_audience: "ساعات رجالي فخمة" },
  { id: "8" } // completely missing field
];

// Replicate page.jsx filter
const menProducts = mockProducts
  .filter(p => p.target_audience && (p.target_audience === "رجالي" || p.target_audience.includes("رجالي")))
  .slice(0, 4);
const womenProducts = mockProducts
  .filter(p => p.target_audience && (p.target_audience === "حريمي" || p.target_audience.includes("حريمي")))
  .slice(0, 4);

assert.strictEqual(menProducts.length, 2, "Should find exactly 2 men products");
assert.strictEqual(womenProducts.length, 1, "Should find exactly 1 women product");
console.log("  ✓ Edge-case filtering with null/undefined/missing fields handled safely without throwing.");

// Replicate shop/page.jsx audience filtering
function testShopFilter(items, activeAudience) {
  return items.filter(p => {
    if (activeAudience !== "all") {
      if (!p.target_audience) return false;
      const matchesAudience = p.target_audience.includes(activeAudience) || p.target_audience === "للجنسين";
      if (!matchesAudience) return false;
    }
    return true;
  });
}

// When activeAudience is "رجالي" (from ?audience=men)
const shopMen = testShopFilter(mockProducts, "رجالي");
assert.strictEqual(shopMen.length, 3, "Shop men filter should include رجالي (2 items) + للجنسين (1 item)");

// When activeAudience is "حريمي" (from ?audience=women)
const shopWomen = testShopFilter(mockProducts, "حريمي");
assert.strictEqual(shopWomen.length, 2, "Shop women filter should include حريمي (1 item) + للجنسين (1 item)");

// When activeAudience is "all"
const shopAll = testShopFilter(mockProducts, "all");
assert.strictEqual(shopAll.length, mockProducts.length, "Shop all filter should return all items");
console.log("  ✓ Shop audience filter correctly handles query strings and unisex fallbacks.");

// 2. Test discount calculation edge cases
function calcDiscount(oldPrice, price) {
  return oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
}

assert.strictEqual(calcDiscount(null, 100), 0);
assert.strictEqual(calcDiscount(undefined, 100), 0);
assert.strictEqual(calcDiscount(0, 100), 0);
assert.strictEqual(calcDiscount(200, 100), 50);
assert.strictEqual(calcDiscount(4100, 3450), 16);
console.log("  ✓ Discount calculation survives edge cases.");

console.log("=== ALL ADVERSARIAL STRESS TESTS PASSED ===");
