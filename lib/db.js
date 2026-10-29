import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import bcrypt from "bcryptjs";

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(process.cwd(), "ben10.db");
  const db = new DatabaseSync(dbPath);

  // Enable WAL mode for high performance
  db.exec("PRAGMA journal_mode = WAL;");

  // Create Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sub TEXT,
      cat TEXT NOT NULL,
      price REAL NOT NULL,
      old_price REAL,
      rating REAL DEFAULT 4.9,
      reviews INTEGER DEFAULT 120,
      tag TEXT DEFAULT 'best',
      badge_text TEXT DEFAULT 'الأكثر طلباً',
      image TEXT NOT NULL,
      overview TEXT,
      movement TEXT,
      case_material TEXT,
      glass TEXT,
      diameter TEXT,
      water_resist TEXT,
      strap TEXT,
      warranty TEXT,
      colors TEXT,
      in_stock INTEGER DEFAULT 1,
      target_audience TEXT DEFAULT '',
      color TEXT DEFAULT '',
      description TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Run safe schema migrations for existing databases
  try { db.exec("ALTER TABLE products ADD COLUMN target_audience TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN color TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN description TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]';"); } catch (e) {}

  // Create Orders Table with unique Order Reference
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      governorate TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'قيد المراجعة',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Create Admin Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default admin if none exists
  const adminCheck = db.prepare("SELECT COUNT(*) as count FROM admins").get();
  if (!adminCheck || adminCheck.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("ben10admin2026", salt);
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run("admin", hash);
    console.log("--> Default admin created: username=admin, password=ben10admin2026");
  }

  // Seed initial products if empty
  const prodCheck = db.prepare("SELECT COUNT(*) as count FROM products").get();
  if (!prodCheck || prodCheck.count === 0) {
    seedInitialProducts(db);
  }

  dbInstance = db;
  return dbInstance;
}

function seedInitialProducts(db) {
  const insertStmt = db.prepare(`
    INSERT INTO products (
      id, name, sub, cat, price, old_price, rating, reviews, tag, badge_text,
      image, overview, movement, case_material, glass, diameter, water_resist,
      strap, warranty, colors, in_stock
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const initialWatches = [
    {
      id: "ben10-classic-heritage",
      name: "ساعة Ben10 رويال هيريتدج كلاسيك",
      sub: "ستانلس ستيل 316L مصقول · زجاج ياقوتي مقاوم للخدش",
      cat: "classic",
      price: 3450,
      old_price: 4200,
      rating: 4.9,
      reviews: 184,
      tag: "best",
      badge_text: "الأكثر طلباً",
      image: "/img/ben10-classic-concept-01.png",
      overview: "ساعة كلاسيكية ذات حضور هادئ وفخم. مصممة لتكون رفيقك اليومي في العمل والمناسبات الرسمية، بميناء مصقول بعناية وزجاج ياقوتي لا يخدش مع مرور السنين.",
      movement: "كوارتز ياباني أصلي فائق الدقة (Miyota Citizen)",
      case_material: "ستانلس ستيل 316L صلب مقاوم للصدأ والحساسية",
      glass: "زجاج سافاير كريستال ياقوتي مضاد للخدش",
      diameter: "41 ملم سمك 8.5 ملم",
      water_resist: "5 ATM (50 متر) - مقاومة للماء والسباحة السطحية",
      strap: "جلد طبيعي إيطالي مع درزات متينة وإبزيم فراشة مريح",
      warranty: "ضمان 12 شهر استبدال فوري ضد عيوب الصناعة",
      colors: JSON.stringify([
        { h: "#1a1a1a", n: "ميناء أسود فاخر", img: "/img/ben10-classic-concept-01.png" },
        { h: "#c5a059", n: "إطار ذهبي ملكي", img: "/img/ben10-classic-concept-01.png" },
        { h: "#e2e8f0", n: "فضي أنيق", img: "/img/ben10-classic-concept-01.png" }
      ]),
      in_stock: 1
    },
    {
      id: "ben10-apex-chrono",
      name: "ساعة Ben10 أبكس كرونوغراف سبيد",
      sub: "هيكل تيتانيوم مطفي · تاكيميتر دقيق وعقارب مضيئة",
      cat: "chrono",
      price: 4890,
      old_price: 5600,
      rating: 4.9,
      reviews: 215,
      tag: "best",
      badge_text: "الأعلى تقييماً",
      image: "/img/ben10-chronograph-concept-01.png",
      overview: "تحفة هندسية تجمع بين قوة الكرونوغراف وجمال التصميم المتطور. 3 مواني فرعية لقياس الثواني والدقائق بدقة متناهية مع إطار تاكيميتر خارجي لحساب السرعة.",
      movement: "ماكينة كرونوغراف ميكو-كوارتز يابانية متطورة",
      case_material: "ستانلس ستيل مطلي بطبقة DLC تيتانيوم أسود مقاوم للخدوش",
      glass: "سافاير كريستال بطبقة مانعة للانعكاس الضوئي مزدوجة",
      diameter: "43 ملم",
      water_resist: "10 ATM (100 متر) مع تاج محكم الإغلاق",
      strap: "سوار صلب من الستانلس ستيل مع قفل أمان مزدوج",
      warranty: "ضمان سنتين معتمد مع بطاقة ضمان مختومة",
      colors: JSON.stringify([
        { h: "#101211", n: "أسود تيتانيوم كامل", img: "/img/ben10-chronograph-concept-01.png" },
        { h: "#1e3a5f", n: "كحلي داكن مع لمسات فضية", img: "/img/ben10-chronograph-concept-01.png" },
        { h: "#A3E635", n: "إصدار Ben10 الأخضر الحصري", img: "/img/ben10-chronograph-concept-01.png" }
      ]),
      in_stock: 1
    },
    {
      id: "ben10-sport-stealth",
      name: "ساعة Ben10 أكتيف سبورت إكستريم",
      sub: "مقاومة صدمات عسكرية · حزام سيليكون فنتيد مريح",
      cat: "sport",
      price: 3890,
      old_price: 4600,
      rating: 4.8,
      reviews: 142,
      tag: "sale",
      badge_text: "خصم 15%",
      image: "/img/ben10-sport-concept-01.png",
      overview: "صُممت لتحمل أقسى الظروف والتمارين الرياضية الشاقة. خفيفة على المعصم، مقاومة للسقوط والحرارة والماء حتى عمق 100 متر.",
      movement: "حركة كوارتز معيارية عالية الدقة مع حماية ماصّة للصدمات",
      case_material: "كربون بوليمر مركب مع حافة فولاذية قوية",
      glass: "زجاج معدني مقوى كيميائياً ضد الكسر والضغط",
      diameter: "44 ملم",
      water_resist: "10 ATM (100 متر) مناسبة للغوص والرياضات المائية",
      strap: "سيليكون مرن ناعم ومضاد للبكتيريا ومقاوم للعرق",
      warranty: "ضمان 12 شهر استبدال فوري",
      colors: JSON.stringify([
        { h: "#191d1a", n: "أسود كربوني مطفي", img: "/img/ben10-sport-concept-01.png" },
        { h: "#A3E635", n: "لمسات خضراء Ben10 رياضية", img: "/img/ben10-sport-concept-01.png" }
      ]),
      in_stock: 1
    },
    {
      id: "ben10-skeleton-auto",
      name: "ساعة Ben10 سكيلتون أوتوماتيك ماستر",
      sub: "حركة ميكانيكية ذاتية التعبئة · ظهر شفاف كاشف للتروس",
      cat: "automatic",
      price: 6990,
      old_price: 8200,
      rating: 4.95,
      reviews: 97,
      tag: "new",
      badge_text: "إصدار فاخر",
      image: "/img/ben10-chronograph-concept-01.png",
      overview: "ساعة لعشاق الهندسة الميكانيكية الأصيلة. لا تحتاج إلى أي بطارية، تتغذى على طاقة حركتك اليومية وتخزن طاقة تكفي حتى 42 ساعة توقف.",
      movement: "ميكانيكية أوتوماتيكية بنظام التعبئة الذاتية (24 جوهرة)",
      case_material: "فولاذ جراحي 316L فائق الصلابة والبريق",
      glass: "سافاير أمامي وخلفي كاشف لحركة التروس والرقاص",
      diameter: "42 ملم",
      water_resist: "5 ATM (50 متر)",
      strap: "سوار من الستانلس ستيل المدمج مع وصلات قابلة للتعديل",
      warranty: "ضمان سنتين شامل الصيانة الدورية المجانية",
      colors: JSON.stringify([
        { h: "#222222", n: "فضي مع تروس ذهبية", img: "/img/ben10-chronograph-concept-01.png" },
        { h: "#0f172a", n: "رمادي جان ميتال فخم", img: "/img/ben10-chronograph-concept-01.png" }
      ]),
      in_stock: 1
    },
    {
      id: "ben10-omni-smart",
      name: "ساعة Ben10 أومني سمارت X",
      sub: "شاشة AMOLED 1.43 بوصة · مكالمات بلوتوث وتتبع صحي دقيق",
      cat: "smart",
      price: 3200,
      old_price: 3800,
      rating: 4.75,
      reviews: 168,
      tag: "new",
      badge_text: "أحدث جيل",
      image: "/img/ben10-sport-concept-01.png",
      overview: "تجمع بين الشكل الأنيق للساعة الفاخرة وأذكى التقنيات الحديثة. شاشة فائقة الوضوح تحت أشعة الشمس، مستشعرات دقيقة لمراقبة نبض القلب والأكسجين والنوم، وبطارية تدوم حتى 10 أيام.",
      movement: "معالج ثنائي النواة فائق السرعة مع شاشة AMOLED 466x466",
      case_material: "إطار من سبائك الزنك المؤكسد مع ظهر سيراميكي ناعم",
      glass: "زجاج منحني 2.5D مقاوم للبصمات والخدوش",
      diameter: "46 ملم",
      water_resist: "معيار IP68 المقاوم للغبار والماء بعمق 1.5 متر",
      strap: "سوارين مرفقين مجاناً (سوار سيليكون + سوار جلد طبيعي)",
      warranty: "ضمان 12 شهر معتمد مع تحديثات سوفتوير مستمرة",
      colors: JSON.stringify([
        { h: "#101211", n: "أسود داكن", img: "/img/ben10-sport-concept-01.png" },
        { h: "#94a3b8", n: "فضي ألومنيوم", img: "/img/ben10-sport-concept-01.png" }
      ]),
      in_stock: 1
    },
    {
      id: "ben10-diver-pro-300",
      name: "ساعة Ben10 أوشن دايفر 300 احترافية",
      sub: "مقاومة ماء احترافية حتى 300 متر · إطار سيراميك دوار",
      cat: "sport",
      price: 5250,
      old_price: 6200,
      rating: 4.9,
      reviews: 83,
      tag: "best",
      badge_text: "مقاومة 300M",
      image: "/img/ben10-sport-concept-01.png",
      overview: "ساعة غوص احترافية معتمدة وفق أدق المعايير البحرية. إطار سيراميكي أحادي الاتجاه بـ 120 نقرة وصمام تفريغ هيليوم للاستخدامات الشاقة.",
      movement: "أوتوماتيك Seiko NH35A الياباني الموثوق (احتياطي 41 ساعة)",
      case_material: "ستانلس ستيل بحري 316L ثقيل ومتين",
      glass: "سافاير سميك 3.5 ملم مع طلاء سويسري مضاد للوهج",
      diameter: "42 ملم",
      water_resist: "30 ATM (300 متر) مع تاج وقاع محكمين بالبراغي",
      strap: "سوار صلب ثلاثي الوصلات مع وصلة توسيع للبدلات المائية",
      warranty: "ضمان سنتين معتمد",
      colors: JSON.stringify([
        { h: "#0d2b45", n: "أزرق محيطي داكن", img: "/img/ben10-sport-concept-01.png" },
        { h: "#132a13", n: "أخضر زمردي غامق", img: "/img/ben10-sport-concept-01.png" }
      ]),
      in_stock: 1
    }
  ];

  for (const w of initialWatches) {
    insertStmt.run(
      w.id, w.name, w.sub, w.cat, w.price, w.old_price, w.rating, w.reviews,
      w.tag, w.badge_text, w.image, w.overview, w.movement, w.case_material,
      w.glass, w.diameter, w.water_resist, w.strap, w.warranty, w.colors, w.in_stock
    );
  }

  console.log(`--> Seeded ${initialWatches.length} initial Ben10 watches into SQLite database.`);
}

function formatProduct(r) {
  if (!r) return null;
  let images = [];
  try {
    images = r.images ? JSON.parse(r.images) : [];
  } catch (e) {}
  if (!Array.isArray(images) || images.length === 0) {
    images = r.image ? [r.image] : [];
  }
  return {
    ...r,
    image: images[0] || r.image || "/img/ben10-classic-concept-01.png",
    images: images.slice(0, 10),
    colors: r.colors ? JSON.parse(r.colors) : []
  };
}

// Queries for Products
export function getAllProducts() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  return rows.map(formatProduct);
}

export function getProductById(id) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return formatProduct(row);
}

export function createProduct(prod) {
  const db = getDb();
  const id = prod.id || "b10-" + Date.now();
  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, sub, cat, price, old_price, rating, reviews, tag, badge_text,
      image, overview, movement, case_material, glass, diameter, water_resist,
      strap, warranty, colors, in_stock, target_audience, color, description, images
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  let imagesList = Array.isArray(prod.images)
    ? prod.images.filter(Boolean).slice(0, 10)
    : (prod.image ? [prod.image] : []);

  if (imagesList.length === 0 && prod.image) imagesList = [prod.image];
  if (imagesList.length === 0) imagesList = ["/img/ben10-classic-concept-01.png"];

  const mainImage = imagesList[0];
  const desc = prod.description || prod.overview || "";

  stmt.run(
    id, prod.name, prod.sub || "", prod.cat, prod.price, prod.old_price || null,
    prod.rating || 5.0, prod.reviews || 0, prod.tag || "new", prod.badge_text || "",
    mainImage, desc,
    prod.movement || "", prod.case_material || "", prod.glass || "",
    prod.diameter || "", prod.water_resist || "", prod.strap || "",
    prod.warranty || "ضمان 12 شهر",
    typeof prod.colors === "string" ? prod.colors : JSON.stringify(prod.colors || []),
    prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : 1,
    prod.target_audience || "",
    prod.color || "",
    desc,
    JSON.stringify(imagesList)
  );

  return getProductById(id);
}

export function updateProduct(id, prod) {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) return null;

  const stmt = db.prepare(`
    UPDATE products SET
      name = ?, sub = ?, cat = ?, price = ?, old_price = ?,
      tag = ?, badge_text = ?, image = ?, overview = ?, movement = ?,
      case_material = ?, glass = ?, diameter = ?, water_resist = ?,
      strap = ?, warranty = ?, colors = ?, in_stock = ?,
      target_audience = ?, color = ?, description = ?, images = ?
    WHERE id = ?
  `);

  let imagesList = prod.images !== undefined
    ? (Array.isArray(prod.images) ? prod.images.filter(Boolean).slice(0, 10) : [prod.image].filter(Boolean))
    : (existing.images || [existing.image]);

  if (imagesList.length === 0) {
    imagesList = [prod.image || existing.image || "/img/ben10-classic-concept-01.png"];
  }

  const mainImage = imagesList[0] || prod.image || existing.image;
  const desc = prod.description !== undefined ? prod.description : (prod.overview !== undefined ? prod.overview : (existing.description || existing.overview || ""));

  stmt.run(
    prod.name !== undefined ? prod.name : existing.name,
    prod.sub !== undefined ? prod.sub : existing.sub,
    prod.cat !== undefined ? prod.cat : existing.cat,
    prod.price !== undefined ? prod.price : existing.price,
    prod.old_price !== undefined ? prod.old_price : existing.old_price,
    prod.tag !== undefined ? prod.tag : existing.tag,
    prod.badge_text !== undefined ? prod.badge_text : existing.badge_text,
    mainImage,
    desc,
    prod.movement !== undefined ? prod.movement : existing.movement,
    prod.case_material !== undefined ? prod.case_material : existing.case_material,
    prod.glass !== undefined ? prod.glass : existing.glass,
    prod.diameter !== undefined ? prod.diameter : existing.diameter,
    prod.water_resist !== undefined ? prod.water_resist : existing.water_resist,
    prod.strap !== undefined ? prod.strap : existing.strap,
    prod.warranty !== undefined ? prod.warranty : existing.warranty,
    prod.colors !== undefined ? (typeof prod.colors === "string" ? prod.colors : JSON.stringify(prod.colors)) : JSON.stringify(existing.colors),
    prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : existing.in_stock,
    prod.target_audience !== undefined ? prod.target_audience : (existing.target_audience || ""),
    prod.color !== undefined ? prod.color : (existing.color || ""),
    desc,
    JSON.stringify(imagesList),
    id
  );

  return getProductById(id);
}

export function deleteProduct(id) {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

// Queries for Orders
export function createOrder(data) {
  const db = getDb();
  const year = new Date().getFullYear();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const orderRef = `B10-${year}-${randNum}`;

  const stmt = db.prepare(`
    INSERT INTO orders (
      order_ref, customer_name, customer_phone, governorate, address,
      payment_method, items, subtotal, shipping, total, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  stmt.run(
    orderRef,
    data.customer_name,
    data.customer_phone,
    data.governorate,
    data.address,
    data.payment_method || "cod",
    typeof data.items === "string" ? data.items : JSON.stringify(data.items),
    data.subtotal,
    data.shipping,
    data.total,
    "قيد المراجعة"
  );

  return getOrderByRef(orderRef);
}

export function getAllOrders() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  return rows.map(r => ({
    ...r,
    items: r.items ? JSON.parse(r.items) : []
  }));
}

export function getOrderByRef(orderRef) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM orders WHERE order_ref = ?").get(orderRef);
  if (!row) return null;
  return {
    ...row,
    items: row.items ? JSON.parse(row.items) : []
  };
}

export function updateOrderStatus(orderRef, status) {
  const db = getDb();
  const stmt = db.prepare("UPDATE orders SET status = ? WHERE order_ref = ?");
  const res = stmt.run(status, orderRef);
  return res.changes > 0;
}

// Admin Auth
export function verifyAdmin(username, password) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
  if (!row) return false;
  return bcrypt.compareSync(password, row.password_hash);
}
