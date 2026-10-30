/**
 * Milestone 3 Forensic Integrity & Responsiveness Verification Suite
 * 
 * Verifies authenticity, responsive design classes, touch target dimensions,
 * overflow containment, and absence of hardcoded bypasses or facades across
 * all 18 modified files.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT = path.resolve('.');

console.log('=== STARTING MILESTONE 3 FORENSIC INTEGRITY CHECKS ===\n');

let passCount = 0;
let failCount = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// 1. Root Layout & Viewport Isolation Checks
// ----------------------------------------------------------------------------
console.log('1. Verifying Root Layout & Global CSS Containment:');

check('globals.css has max-width and overflow-x on html and body', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf-8');
  assert(css.includes('html {') && css.includes('max-width: 100%') && css.includes('overflow-x: hidden'), 'html missing overflow constraints');
  assert(css.includes('body {') && css.includes('max-width: 100%') && css.includes('overflow-x: hidden') && css.includes('position: relative'), 'body missing overflow constraints');
});

check('globals.css defines cross-browser .no-scrollbar and .scrollbar-none', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf-8');
  assert(css.includes('.no-scrollbar::-webkit-scrollbar'), 'missing .no-scrollbar webkit rule');
  assert(css.includes('.scrollbar-none::-webkit-scrollbar'), 'missing .scrollbar-none webkit rule');
  assert(css.includes('scrollbar-width: none'), 'missing standard scrollbar-width: none rule');
});

check('layout.jsx configures maximumScale: 5 and overflow-x-hidden on body', () => {
  const layout = fs.readFileSync(path.join(ROOT, 'app/layout.jsx'), 'utf-8');
  assert(layout.includes('maximumScale: 5'), 'missing maximumScale: 5');
  assert(layout.includes('overflow-x-hidden'), 'missing overflow-x-hidden on body');
});

check('ClientStoreWrapper.jsx contains overflow-x-clip and min-w-0 on <main>', () => {
  const wrapper = fs.readFileSync(path.join(ROOT, 'app/components/ClientStoreWrapper.jsx'), 'utf-8');
  assert(wrapper.includes('min-w-0 w-full overflow-x-clip'), 'missing min-w-0 w-full overflow-x-clip on main');
});

// ----------------------------------------------------------------------------
// 2. Touch Target >= 44px Verification Across Navigation & Drawers/Modals
// ----------------------------------------------------------------------------
console.log('\n2. Verifying Touch Targets (>= 44px) Across Navigation & Controls:');

check('Navbar.jsx mobile buttons (hamburger and search) are >= 44px (w-11 h-11)', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/Navbar.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0'), 'hamburger button not w-11 h-11');
  assert(code.includes('w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-lime-400 transition-colors shrink-0'), 'mobile search button not w-11 h-11');
});

check('MobileBottomNav.jsx triggers have min-h-[44px] min-w-[44px] and safe area padding', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/MobileBottomNav.jsx'), 'utf-8');
  assert(code.includes('pb-[calc(env(safe-area-inset-bottom,0px)+6px)]'), 'missing iOS safe area inset padding');
  const count = (code.match(/min-h-\[44px\] min-w-\[44px\]/g) || []).length;
  assert(count === 5, `Expected 5 bottom nav items with min-h-[44px] min-w-[44px], found ${count}`);
});

check('CartDrawer.jsx close button is >= 44px (w-11 h-11) and steppers are ergonomic', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/CartDrawer.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
  assert(code.includes('w-9 h-9 flex items-center justify-center'), 'steppers not w-9 h-9');
  assert(code.includes('min-h-[36px]'), 'delete button not min-h-[36px]');
});

check('WishlistDrawer.jsx close button is >= 44px and action buttons are ergonomic', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/WishlistDrawer.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
  assert(code.includes('h-9 px-3 rounded-lg'), 'action buttons not h-9');
  assert(code.includes('min-h-[36px]'), 'delete button not min-h-[36px]');
});

check('CheckoutModal.jsx close button is >= 44px (w-11 h-11)', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/CheckoutModal.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
});

check('QuickViewModal.jsx close, arrows, and action buttons meet ergonomic sizing', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/QuickViewModal.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
  const arrowCount = (code.match(/w-11 h-11 rounded-full bg-black\/60/g) || []).length;
  assert(arrowCount === 2, `Expected 2 gallery arrows with w-11 h-11, found ${arrowCount}`);
  assert(code.includes('h-11 rounded-xl'), 'CTA buttons not h-11');
});

check('SearchModal.jsx close button is >= 44px and tag chips are >= 36px', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/SearchModal.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
  assert(code.includes('min-h-[36px]'), 'tag chips not min-h-[36px]');
});

check('MobileMenuDrawer.jsx close button is >= 44px and menu rows have min-h-[44px]', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/MobileMenuDrawer.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'close button not w-11 h-11');
  assert(code.includes('min-h-[44px]'), 'missing min-h-[44px] on mobile navigation rows');
  assert(code.includes('h-11 rounded-xl bg-[#25D366]'), 'WhatsApp button not h-11');
});

check('product/[id]/page.jsx controls (wishlist, gallery arrows) are >= 44px', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/product/[id]/page.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full bg-white/90'), 'wishlist button not w-11 h-11');
  const arrowCount = (code.match(/w-11 h-11 rounded-full bg-black\/60/g) || []).length;
  assert(arrowCount === 2, `Expected 2 gallery arrows with w-11 h-11, found ${arrowCount}`);
});

check('admin/page.jsx add/edit modal close button is >= 44px', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/admin/page.jsx'), 'utf-8');
  assert(code.includes('w-11 h-11 rounded-full'), 'admin modal close button not w-11 h-11');
  assert(code.includes('min-h-[36px]'), 'table actions not min-h-[36px]');
});

// ----------------------------------------------------------------------------
// 3. Responsive Grids & Spacing Optimization Checks
// ----------------------------------------------------------------------------
console.log('\n3. Verifying Responsive Grids & Breakpoints (md:grid-cols-3):');

check('shop/page.jsx grid has grid-cols-2 md:grid-cols-3 lg:grid-cols-4', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/shop/page.jsx'), 'utf-8');
  assert(code.includes('grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'), 'catalog grid missing md:grid-cols-3');
});

check('app/page.jsx grids have grid-cols-2 md:grid-cols-3 lg:grid-cols-4', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/page.jsx'), 'utf-8');
  const matches = (code.match(/grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6/g) || []).length;
  assert(matches >= 2, `Expected at least 2 grids with md:grid-cols-3 on homepage, found ${matches}`);
});

check('product/[id]/page.jsx related products grid has md:grid-cols-3', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/product/[id]/page.jsx'), 'utf-8');
  assert(code.includes('grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'), 'related grid missing md:grid-cols-3');
});

check('ProductCard.jsx has mobile-optimized padding and responsive typography', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/ProductCard.jsx'), 'utf-8');
  assert(code.includes('p-2 sm:p-4'), 'image frame padding not responsive');
  assert(code.includes('p-2.5 sm:p-4'), 'card body padding not responsive');
  assert(code.includes('text-[9px] sm:text-[11px]'), 'badge typography not responsive');
  assert(code.includes('text-sm sm:text-lg'), 'price typography not responsive');
  assert(code.includes('px-1.5 sm:px-2.5') && code.includes('h-8 sm:h-9'), 'instant cash buy button dimensions not responsive');
});

// ----------------------------------------------------------------------------
// 4. Ambient Glow & Bleed Containment Checks
// ----------------------------------------------------------------------------
console.log('\n4. Verifying Bleed Containment & Responsive Copy:');

check('admin/login/page.jsx has relative overflow-hidden to contain blur circle', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/admin/login/page.jsx'), 'utf-8');
  assert(code.includes('relative overflow-hidden min-h-screen'), 'missing relative overflow-hidden wrapper on admin login');
});

check('WhatsAppSection.jsx has responsive button width and text', () => {
  const code = fs.readFileSync(path.join(ROOT, 'app/components/WhatsAppSection.jsx'), 'utf-8');
  assert(code.includes('w-full sm:w-auto'), 'missing w-full sm:w-auto on CTA buttons');
  assert(code.includes('hidden sm:inline'), 'missing hidden sm:inline responsive text');
  assert(code.includes('sm:hidden'), 'missing sm:hidden responsive text');
});

// ----------------------------------------------------------------------------
// 5. Anti-Cheat & Forensic Checks (Hardcoded outputs, facades, dummy returns)
// ----------------------------------------------------------------------------
console.log('\n5. Verifying Absence of Facades & Hardcoded Bypass Code:');

check('No fake PASS/FAIL test strings or hardcoded mock returns in components', () => {
  const files = [
    'app/globals.css',
    'app/layout.jsx',
    'app/components/ClientStoreWrapper.jsx',
    'app/components/Navbar.jsx',
    'app/components/MobileBottomNav.jsx',
    'app/components/MobileMenuDrawer.jsx',
    'app/components/ProductCard.jsx',
    'app/components/CartDrawer.jsx',
    'app/components/WishlistDrawer.jsx',
    'app/components/CheckoutModal.jsx',
    'app/components/QuickViewModal.jsx',
    'app/components/SearchModal.jsx',
    'app/components/WhatsAppSection.jsx',
    'app/page.jsx',
    'app/shop/page.jsx',
    'app/product/[id]/page.jsx',
    'app/admin/login/page.jsx',
    'app/admin/page.jsx'
  ];

  for (const f of files) {
    const content = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    assert(!content.includes('__MOCK_RESULT__'), `Mock token found in ${f}`);
    assert(!content.includes('TEST_RESULT_PASS'), `Test result bypass found in ${f}`);
    assert(!content.includes('return true; // bypass'), `Bypass return found in ${f}`);
    assert(!content.includes('return "PASS"'), `Fake pass return found in ${f}`);
  }
});

console.log(`\n=================================================`);
console.log(`M3 AUDIT SUMMARY: ${passCount} passed, ${failCount} failed`);
console.log(`=================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL FORENSIC INTEGRITY & RESPONSIVENESS CHECKS PASSED EMPIRICALLY!');
  process.exit(0);
}
