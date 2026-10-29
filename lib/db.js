import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

let sqliteInstance = null;

// ==============================================================================
// SQLite Fallback Layer (Used when Supabase credentials are not yet configured)
// ==============================================================================

function getSqliteDb() {
  if (sqliteInstance) return sqliteInstance;

  const dbPath = path.join(process.cwd(), "ben10.db");
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL;");

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

  try { db.exec("ALTER TABLE products ADD COLUMN target_audience TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN color TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN description TEXT DEFAULT '';"); } catch (e) {}
  try { db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]';"); } catch (e) {}

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const adminCheck = db.prepare("SELECT COUNT(*) as count FROM admins").get();
  if (!adminCheck || adminCheck.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("ben10admin2026", salt);
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run("admin", hash);
  }

  sqliteInstance = db;
  return sqliteInstance;
}

// Helpers
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

function formatOrder(r) {
  if (!r) return null;
  let items = [];
  if (Array.isArray(r.items)) {
    items = r.items;
  } else if (typeof r.items === "string") {
    try { items = JSON.parse(r.items); } catch (e) { items = []; }
  }
  return {
    ...r,
    items
  };
}

// ==============================================================================
// Unified Async Database Operations (Supabase Primary with SQLite Fallback)
// ==============================================================================

export async function getAllProducts() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase Error - getAllProducts]:", error);
      throw error;
    }
    return (data || []).map(formatProduct);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  return rows.map(formatProduct);
}

export async function getProductById(id) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[Supabase Error - getProductById]:", error);
      throw error;
    }
    return formatProduct(data);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return formatProduct(row);
}

export async function createProduct(prod) {
  const id = prod.id || "b10-" + Date.now();

  let imagesList = Array.isArray(prod.images)
    ? prod.images.filter(Boolean).slice(0, 10)
    : (prod.image ? [prod.image] : []);

  if (imagesList.length === 0 && prod.image) imagesList = [prod.image];
  if (imagesList.length === 0) imagesList = ["/img/ben10-classic-concept-01.png"];

  const mainImage = imagesList[0];
  const desc = prod.description || prod.overview || "";

  let colorsList = [];
  if (Array.isArray(prod.colors)) {
    colorsList = prod.colors;
  } else if (typeof prod.colors === "string") {
    try { colorsList = JSON.parse(prod.colors); } catch (e) { colorsList = []; }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const newProduct = {
      id,
      name: prod.name,
      sub: prod.sub || "",
      cat: prod.cat,
      price: Number(prod.price),
      old_price: prod.old_price ? Number(prod.old_price) : null,
      rating: prod.rating ? Number(prod.rating) : 5.0,
      reviews: prod.reviews ? Number(prod.reviews) : 0,
      tag: prod.tag || "new",
      badge_text: prod.badge_text || "",
      image: mainImage,
      overview: desc,
      movement: prod.movement || "",
      case_material: prod.case_material || "",
      glass: prod.glass || "",
      diameter: prod.diameter || "",
      water_resist: prod.water_resist || "",
      strap: prod.strap || "",
      warranty: prod.warranty || "ضمان 12 شهر",
      colors: colorsList,
      in_stock: prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : 1,
      target_audience: prod.target_audience || "",
      color: prod.color || "",
      description: desc,
      images: imagesList
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error("[Supabase Error - createProduct]:", error);
      throw error;
    }
    return formatProduct(data);
  }

  // SQLite Fallback
  const db = getSqliteDb();
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

  stmt.run(
    id, prod.name, prod.sub || "", prod.cat, prod.price, prod.old_price || null,
    prod.rating || 5.0, prod.reviews || 0, prod.tag || "new", prod.badge_text || "",
    mainImage, desc,
    prod.movement || "", prod.case_material || "", prod.glass || "",
    prod.diameter || "", prod.water_resist || "", prod.strap || "",
    prod.warranty || "ضمان 12 شهر",
    JSON.stringify(colorsList),
    prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : 1,
    prod.target_audience || "",
    prod.color || "",
    desc,
    JSON.stringify(imagesList)
  );

  return getProductById(id);
}

export async function updateProduct(id, prod) {
  const existing = await getProductById(id);
  if (!existing) return null;

  let imagesList = prod.images !== undefined
    ? (Array.isArray(prod.images) ? prod.images.filter(Boolean).slice(0, 10) : [prod.image].filter(Boolean))
    : (existing.images || [existing.image]);

  if (imagesList.length === 0) {
    imagesList = [prod.image || existing.image || "/img/ben10-classic-concept-01.png"];
  }

  const mainImage = imagesList[0] || prod.image || existing.image;
  const desc = prod.description !== undefined ? prod.description : (prod.overview !== undefined ? prod.overview : (existing.description || existing.overview || ""));

  let colorsList = existing.colors || [];
  if (prod.colors !== undefined) {
    if (Array.isArray(prod.colors)) {
      colorsList = prod.colors;
    } else if (typeof prod.colors === "string") {
      try { colorsList = JSON.parse(prod.colors); } catch (e) { colorsList = []; }
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const updateData = {
      name: prod.name !== undefined ? prod.name : existing.name,
      sub: prod.sub !== undefined ? prod.sub : existing.sub,
      cat: prod.cat !== undefined ? prod.cat : existing.cat,
      price: prod.price !== undefined ? Number(prod.price) : Number(existing.price),
      old_price: prod.old_price !== undefined ? (prod.old_price ? Number(prod.old_price) : null) : existing.old_price,
      tag: prod.tag !== undefined ? prod.tag : existing.tag,
      badge_text: prod.badge_text !== undefined ? prod.badge_text : existing.badge_text,
      image: mainImage,
      overview: desc,
      movement: prod.movement !== undefined ? prod.movement : existing.movement,
      case_material: prod.case_material !== undefined ? prod.case_material : existing.case_material,
      glass: prod.glass !== undefined ? prod.glass : existing.glass,
      diameter: prod.diameter !== undefined ? prod.diameter : existing.diameter,
      water_resist: prod.water_resist !== undefined ? prod.water_resist : existing.water_resist,
      strap: prod.strap !== undefined ? prod.strap : existing.strap,
      warranty: prod.warranty !== undefined ? prod.warranty : existing.warranty,
      colors: colorsList,
      in_stock: prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : existing.in_stock,
      target_audience: prod.target_audience !== undefined ? prod.target_audience : (existing.target_audience || ""),
      color: prod.color !== undefined ? prod.color : (existing.color || ""),
      description: desc,
      images: imagesList
    };

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Supabase Error - updateProduct]:", error);
      throw error;
    }
    return formatProduct(data);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const stmt = db.prepare(`
    UPDATE products SET
      name = ?, sub = ?, cat = ?, price = ?, old_price = ?,
      tag = ?, badge_text = ?, image = ?, overview = ?, movement = ?,
      case_material = ?, glass = ?, diameter = ?, water_resist = ?,
      strap = ?, warranty = ?, colors = ?, in_stock = ?,
      target_audience = ?, color = ?, description = ?, images = ?
    WHERE id = ?
  `);

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
    JSON.stringify(colorsList),
    prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : existing.in_stock,
    prod.target_audience !== undefined ? prod.target_audience : (existing.target_audience || ""),
    prod.color !== undefined ? prod.color : (existing.color || ""),
    desc,
    JSON.stringify(imagesList),
    id
  );

  return getProductById(id);
}

export async function deleteProduct(id) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      console.error("[Supabase Error - deleteProduct]:", error);
      throw error;
    }
    return (count || 0) > 0;
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

// Queries for Orders
export async function createOrder(data) {
  const year = new Date().getFullYear();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const orderRef = `B10-${year}-${randNum}`;

  let itemsList = [];
  if (Array.isArray(data.items)) {
    itemsList = data.items;
  } else if (typeof data.items === "string") {
    try { itemsList = JSON.parse(data.items); } catch (e) { itemsList = []; }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const orderRecord = {
      order_ref: orderRef,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      governorate: data.governorate,
      address: data.address,
      payment_method: data.payment_method || "cod",
      items: itemsList,
      subtotal: Number(data.subtotal),
      shipping: Number(data.shipping),
      total: Number(data.total),
      status: "قيد المراجعة"
    };

    const { data: created, error } = await supabase
      .from("orders")
      .insert([orderRecord])
      .select()
      .single();

    if (error) {
      console.error("[Supabase Error - createOrder]:", error);
      throw error;
    }
    return formatOrder(created);
  }

  // SQLite Fallback
  const db = getSqliteDb();
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
    JSON.stringify(itemsList),
    data.subtotal,
    data.shipping,
    data.total,
    "قيد المراجعة"
  );

  return getOrderByRef(orderRef);
}

export async function getAllOrders() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase Error - getAllOrders]:", error);
      throw error;
    }
    return (data || []).map(formatOrder);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  return rows.map(formatOrder);
}

export async function getOrderByRef(orderRef) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_ref", orderRef)
      .maybeSingle();

    if (error) {
      console.error("[Supabase Error - getOrderByRef]:", error);
      throw error;
    }
    return formatOrder(data);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const row = db.prepare("SELECT * FROM orders WHERE order_ref = ?").get(orderRef);
  return formatOrder(row);
}

export async function updateOrderStatus(orderRef, status) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("order_ref", orderRef);

    if (error) {
      console.error("[Supabase Error - updateOrderStatus]:", error);
      throw error;
    }
    return true;
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const stmt = db.prepare("UPDATE orders SET status = ? WHERE order_ref = ?");
  const res = stmt.run(status, orderRef);
  return res.changes > 0;
}

// Admin Auth
export async function verifyAdmin(username, password) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error || !data) return false;
    return bcrypt.compareSync(password, data.password_hash);
  }

  // SQLite Fallback
  const db = getSqliteDb();
  const row = db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
  if (!row) return false;
  return bcrypt.compareSync(password, row.password_hash);
}
