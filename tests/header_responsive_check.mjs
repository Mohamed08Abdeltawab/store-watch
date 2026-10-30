import fs from "fs";
import assert from "assert";

const navbarCode = fs.readFileSync("app/components/Navbar.jsx", "utf-8");

console.log("Checking Navbar responsive safeguards...");

// 1. Check Search bar has min-w-0 to prevent pushing actions off-screen
assert(navbarCode.includes("min-w-0"), "Search container must have min-w-0 for fluid flex shrinkage");

// 2. Check actions container has shrink-0 to protect Cart and Admin
assert(navbarCode.includes("shrink-0"), "Action buttons container must have shrink-0");

// 3. Check Cart button is hidden on mobile < md and visible on md+
const cartMatch = navbarCode.match(/setIsCartOpen\(true\)[\s\S]*?<\/Button>/);
assert(cartMatch, "Cart button must exist");
assert(cartMatch[0].includes("hidden md:inline-flex"), "Cart button must be hidden on mobile < md and visible on md+");

// 4. Check Admin button is hidden on mobile < md and visible on md+
const adminMatch = navbarCode.match(/href="\/admin"[\s\S]*?<\/Link>/);
assert(adminMatch, "Admin link must exist");
assert(adminMatch[0].includes("hidden md:inline-flex"), "Admin link must be hidden on mobile < md and visible on md+");

// 5. Check secondary category nav does NOT have flex-wrap (which caused the ugly 2-line break)
const navMatch = navbarCode.match(/<nav[\s\S]*?<\/nav>/);
assert(navMatch, "Secondary nav must exist");
assert(!navMatch[0].includes("flex-wrap"), "Secondary category nav must NOT use flex-wrap");
assert(navMatch[0].includes("whitespace-nowrap"), "Secondary category nav must have whitespace-nowrap");
assert(navMatch[0].includes("overflow-x-auto"), "Secondary category nav must support smooth horizontal scrolling");

console.log("All Navbar responsive requirements verified successfully!");
