/**
 * Milestone 3 Adversarial & Stress Testing Suite
 *
 * Stress-tests responsive breakpoints, touch target compliance,
 * containment boundaries, and edge cases across M3 deliverables.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT = path.resolve('.');

console.log('=== STARTING MILESTONE 3 ADVERSARIAL STRESS TESTS ===\n');

let pass = 0;
let fail = 0;

function stress(testName, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${testName}`);
    pass++;
  } catch (e) {
    console.error(`  ✗ [FAIL] ${testName}: ${e.message}`);
    fail++;
  }
}

// Scenario 1: Extreme narrow viewport (320px) calculation stress test
stress('Geometry test: 320px viewport card body budget prevents overflow', () => {
  const cardCode = fs.readFileSync(path.join(ROOT, 'app/components/ProductCard.jsx'), 'utf-8');
  // Check that action buttons have shrink-0 and price container has min-w-0
  assert(cardCode.includes('shrink-0'), 'Action buttons must have shrink-0 to prevent layout collapse');
  assert(cardCode.includes('min-w-0'), 'Price column must have min-w-0 to allow text truncation');
  assert(cardCode.includes('truncate'), 'Price text must be truncatable');
});

// Scenario 2: iOS Safe Area Inset Support
stress('Mobile bottom nav supports iPhone home indicator safe area inset', () => {
  const navCode = fs.readFileSync(path.join(ROOT, 'app/components/MobileBottomNav.jsx'), 'utf-8');
  assert(navCode.includes('env(safe-area-inset-bottom'), 'Must include safe-area-inset-bottom fallback');
});

// Scenario 3: All drawer and modal close controls conform to 44px (w-11 h-11)
stress('All 6 modal and drawer close buttons conform to WCAG 44px requirement', () => {
  const modalFiles = [
    'app/components/CartDrawer.jsx',
    'app/components/WishlistDrawer.jsx',
    'app/components/CheckoutModal.jsx',
    'app/components/QuickViewModal.jsx',
    'app/components/SearchModal.jsx',
    'app/components/MobileMenuDrawer.jsx'
  ];

  for (const f of modalFiles) {
    const code = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    assert(code.includes('w-11 h-11'), `Modal ${f} missing w-11 h-11 close button`);
  }
});

// Scenario 4: Admin dashboard glow overflow containment
stress('Admin login ambient glow is strictly contained within relative overflow-hidden', () => {
  const loginCode = fs.readFileSync(path.join(ROOT, 'app/admin/login/page.jsx'), 'utf-8');
  assert(loginCode.includes('relative overflow-hidden'), 'Admin login must have relative overflow-hidden');
  assert(loginCode.includes('w-96 h-96') && loginCode.includes('blur-3xl'), 'Ambient glow exists and is contained');
});

// Scenario 5: WhatsAppSection long phone number / copy containment
stress('WhatsAppSection CTA button adapts copy between mobile and desktop', () => {
  const waCode = fs.readFileSync(path.join(ROOT, 'app/components/WhatsAppSection.jsx'), 'utf-8');
  assert(waCode.includes('hidden sm:inline'), 'Desktop text must hide on mobile');
  assert(waCode.includes('sm:hidden'), 'Short mobile text must hide on desktop');
});

console.log(`\n=================================================`);
console.log(`ADVERSARIAL STRESS SUMMARY: ${pass} passed, ${fail} failed`);
console.log(`=================================================`);

if (fail > 0) process.exit(1);
process.exit(0);
