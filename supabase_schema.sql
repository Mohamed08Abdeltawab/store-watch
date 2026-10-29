-- ==============================================================================
-- Ben10 Luxury Watch Store - Supabase Database Schema & Initial Data
-- ==============================================================================

-- 1. جدول المنتجات (Products Table)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sub TEXT DEFAULT '',
  cat TEXT NOT NULL,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  rating NUMERIC DEFAULT 4.9,
  reviews INTEGER DEFAULT 120,
  tag TEXT DEFAULT 'best',
  badge_text TEXT DEFAULT 'الأكثر طلباً',
  image TEXT NOT NULL,
  overview TEXT DEFAULT '',
  movement TEXT DEFAULT '',
  case_material TEXT DEFAULT '',
  glass TEXT DEFAULT '',
  diameter TEXT DEFAULT '',
  water_resist TEXT DEFAULT '',
  strap TEXT DEFAULT '',
  warranty TEXT DEFAULT 'ضمان 12 شهر',
  colors JSONB DEFAULT '[]'::jsonb,
  in_stock INTEGER DEFAULT 1,
  target_audience TEXT DEFAULT '',
  color TEXT DEFAULT '',
  description TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول الطلبات (Orders Table)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'قيد المراجعة',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول المشرفين (Admin Users Table)
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة حساب المشرف الافتراضي
-- Username: admin
-- Password: ben10admin2026
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$wO4qQh/o9wP7W2k0lK3fQeM1ZtH8tG.7qCgPzU7D8c.m1Q2s4u/2C')
ON CONFLICT (username) DO NOTHING;

-- 4. إدخال الساعات الأولية (Initial Seed Products)
INSERT INTO products (
  id, name, sub, cat, price, old_price, rating, reviews, tag, badge_text,
  image, overview, movement, case_material, glass, diameter, water_resist,
  strap, warranty, in_stock, images, colors, description
) VALUES 
(
  'ben10-classic-heritage',
  'ساعة Ben10 رويال هيريتدج كلاسيك',
  'ستانلس ستيل 316L مصقول · زجاج ياقوتي مقاوم للخدش',
  'classic',
  3450, 4200, 4.9, 184, 'best', 'الأكثر طلباً',
  '/img/ben10-classic-concept-01.png',
  'ساعة كلاسيكية ذات حضور هادئ وفخم. مصممة لتكون رفيقك اليومي في العمل والمناسبات الرسمية، بميناء مصقول بعناية وزجاج ياقوتي لا يخدش مع مرور السنين.',
  'كوارتز ياباني أصلي فائق الدقة (Miyota Citizen)',
  'ستانلس ستيل 316L صلب مقاوم للصدأ والحساسية',
  'زجاج سافاير كريستال ياقوتي مضاد للخدش',
  '41 ملم سمك 8.5 ملم',
  '5 ATM (50 متر) - مقاومة للماء والسباحة السطحية',
  'جلد طبيعي إيطالي مع درزات متينة وإبزيم فراشة مريح',
  'ضمان 12 شهر استبدال فوري ضد عيوب الصناعة',
  1,
  '["/img/ben10-classic-concept-01.png"]'::jsonb,
  '[{"h":"#1a1a1a","n":"ميناء أسود فاخر","img":"/img/ben10-classic-concept-01.png"},{"h":"#c5a059","n":"إطار ذهبي ملكي","img":"/img/ben10-classic-concept-01.png"},{"h":"#e2e8f0","n":"فضي أنيق","img":"/img/ben10-classic-concept-01.png"}]'::jsonb,
  'ساعة كلاسيكية ذات حضور هادئ وفخم. مصممة لتكون رفيقك اليومي في العمل والمناسبات الرسمية، بميناء مصقول بعناية وزجاج ياقوتي لا يخدش مع مرور السنين.'
),
(
  'ben10-apex-chrono',
  'ساعة Ben10 أبكس كرونوغراف سبيد',
  'هيكل تيتانيوم مطفي · تاكيميتر دقيق وعقارب مضيئة',
  'chrono',
  4890, 5600, 4.9, 215, 'best', 'الأعلى تقييماً',
  '/img/ben10-chronograph-concept-01.png',
  'تحفة هندسية تجمع بين قوة الكرونوغراف وجمال التصميم المتطور. 3 مواني فرعية لقياس الثواني والدقائق بدقة متناهية مع إطار تاكيميتر خارجي لحساب السرعة.',
  'ماكينة كرونوغراف ميكو-كوارتز يابانية متطورة',
  'ستانلس ستيل مطلي بطبقة DLC تيتانيوم أسود مقاوم للخدوش',
  'سافاير كريستال بطبقة مانعة للانعكاس الضوئي مزدوجة',
  '43 ملم',
  '10 ATM (100 متر) مع تاج محكم الإغلاق',
  'سوار صلب من الستانلس ستيل مع قفل أمان مزدوج',
  'ضمان سنتين معتمد مع بطاقة ضمان مختومة',
  1,
  '["/img/ben10-chronograph-concept-01.png"]'::jsonb,
  '[{"h":"#101211","n":"أسود تيتانيوم كامل","img":"/img/ben10-chronograph-concept-01.png"},{"h":"#1e3a5f","n":"كحلي داكن مع لمسات فضية","img":"/img/ben10-chronograph-concept-01.png"},{"h":"#A3E635","n":"إصدار Ben10 الأخضر الحصري","img":"/img/ben10-chronograph-concept-01.png"}]'::jsonb,
  'تحفة هندسية تجمع بين قوة الكرونوغراف وجمال التصميم المتطور. 3 مواني فرعية لقياس الثواني والدقائق بدقة متناهية مع إطار تاكيميتر خارجي لحساب السرعة.'
),
(
  'ben10-sport-stealth',
  'ساعة Ben10 أكتيف سبورت إكستريم',
  'مقاومة صدمات عسكرية · حزام سيليكون فنتيد مريح',
  'sport',
  3890, 4600, 4.8, 142, 'sale', 'خصم 15%',
  '/img/ben10-sport-concept-01.png',
  'صُممت لتحمل أقسى الظروف والتمارين الرياضية الشاقة. خفيفة على المعصم، مقاومة للسقوط والحرارة والماء حتى عمق 100 متر.',
  'حركة كوارتز معيارية عالية الدقة مع حماية ماصّة للصدمات',
  'كربون بوليمر مركب مع حافة فولاذية قوية',
  'زجاج معدني مقوى كيميائياً ضد الكسر والضغط',
  '44 ملم',
  '10 ATM (100 متر) مناسبة للغوص والرياضات المائية',
  'سيليكون مرن ناعم ومضاد للبكتيريا ومقاوم للعرق',
  'ضمان 12 شهر استبدال فوري',
  1,
  '["/img/ben10-sport-concept-01.png"]'::jsonb,
  '[{"h":"#191d1a","n":"أسود كربوني مطفي","img":"/img/ben10-sport-concept-01.png"},{"h":"#A3E635","n":"لمسات خضراء Ben10 رياضية","img":"/img/ben10-sport-concept-01.png"}]'::jsonb,
  'صُممت لتحمل أقسى الظروف والتمارين الرياضية الشاقة. خفيفة على المعصم، مقاومة للسقوط والحرارة والماء حتى عمق 100 متر.'
),
(
  'ben10-skeleton-auto',
  'ساعة Ben10 سكيلتون أوتوماتيك ماستر',
  'حركة ميكانيكية ذاتية التعبئة · ظهر شفاف كاشف للتروس',
  'automatic',
  6990, 8200, 4.95, 97, 'new', 'إصدار فاخر',
  '/img/ben10-chronograph-concept-01.png',
  'ساعة لعشاق الهندسة الميكانيكية الأصيلة. لا تحتاج إلى أي بطارية، تتغذى على طاقة حركتك اليومية وتخزن طاقة تكفي حتى 42 ساعة توقف.',
  'ميكانيكية أوتوماتيكية بنظام التعبئة الذاتية (24 جوهرة)',
  'فولاذ جراحي 316L فائق الصلابة والبريق',
  'سافاير أمامي وخلفي كاشف لحركة التروس والرقاص',
  '42 ملم',
  '5 ATM (50 متر)',
  'سوار من الستانلس ستيل المدمج مع وصلات قابلة للتعديل',
  'ضمان سنتين شامل الصيانة الدورية المجانية',
  1,
  '["/img/ben10-chronograph-concept-01.png"]'::jsonb,
  '[{"h":"#222222","n":"فضي مع تروس ذهبية","img":"/img/ben10-chronograph-concept-01.png"},{"h":"#0f172a","n":"رمادي جان ميتال فخم","img":"/img/ben10-chronograph-concept-01.png"}]'::jsonb,
  'ساعة لعشاق الهندسة الميكانيكية الأصيلة. لا تحتاج إلى أي بطارية، تتغذى على طاقة حركتك اليومية وتخزن طاقة تكفي حتى 42 ساعة توقف.'
),
(
  'ben10-omni-smart',
  'ساعة Ben10 أومني سمارت X',
  'شاشة AMOLED 1.43 بوصة · مكالمات بلوتوث وتتبع صحي دقيق',
  'smart',
  3200, 3800, 4.75, 168, 'new', 'أحدث جيل',
  '/img/ben10-sport-concept-01.png',
  'تجمع بين الشكل الأنيق للساعة الفاخرة وأذكى التقنيات الحديثة. شاشة فائقة الوضوح تحت أشعة الشمس ومستشعرات دقيقة لمراقبة نبض القلب والنشاط.',
  'معالج ثنائي النواة فائق السرعة مع شاشة AMOLED 466x466',
  'إطار من سبائك الزنك المؤكسد مع ظهر سيراميكي ناعم',
  'زجاج منحني 2.5D مقاوم للبصمات والخدوش',
  '46 ملم',
  'معيار IP68 المقاوم للغبار والماء بعمق 1.5 متر',
  'سوارين مرفقين مجاناً (سوار سيليكون + سوار جلد طبيعي)',
  'ضمان 12 شهر معتمد مع تحديثات سوفتوير مستمرة',
  1,
  '["/img/ben10-sport-concept-01.png"]'::jsonb,
  '[{"h":"#101211","n":"أسود داكن","img":"/img/ben10-sport-concept-01.png"},{"h":"#94a3b8","n":"فضي ألومنيوم","img":"/img/ben10-sport-concept-01.png"}]'::jsonb,
  'تجمع بين الشكل الأنيق للساعة الفاخرة وأذكى التقنيات الحديثة.'
),
(
  'ben10-diver-pro-300',
  'ساعة Ben10 أوشن دايفر 300 احترافية',
  'مقاومة ماء احترافية حتى 300 متر · إطار سيراميك دوار',
  'sport',
  5250, 6200, 4.9, 83, 'best', 'مقاومة 300M',
  '/img/ben10-sport-concept-01.png',
  'ساعة غوص احترافية معتمدة وفق أدق المعايير البحرية. إطار سيراميكي أحادي الاتجاه بـ 120 نقرة وصمام تفريغ هيليوم للاستخدامات الشاقة.',
  'أوتوماتيك Seiko NH35A الياباني الموثوق (احتياطي 41 ساعة)',
  'ستانلس ستيل بحري 316L ثقيل ومتين',
  'سافاير سميك 3.5 ملم مع طلاء سويسري مضاد للوهج',
  '42 ملم',
  '30 ATM (300 متر) مع تاج وقاع محكمين بالبراغي',
  'سوار صلب ثلاثي الوصلات مع وصلة توسيع للبدلات المائية',
  'ضمان سنتين معتمد',
  1,
  '["/img/ben10-sport-concept-01.png"]'::jsonb,
  '[{"h":"#0d2b45","n":"أزرق محيطي داكن","img":"/img/ben10-sport-concept-01.png"},{"h":"#132a13","n":"أخضر زمردي غامق","img":"/img/ben10-sport-concept-01.png"}]'::jsonb,
  'ساعة غوص احترافية معتمدة وفق أدق المعايير البحرية.'
)
ON CONFLICT (id) DO NOTHING;

-- 5. تفعيل Row Level Security (RLS) للسماح بالقراءة العامة لجدول المنتجات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- سياسة السماح للجميع بقراءة المنتجات المعروضة
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

-- سياسة السماح للزوار بإنشاء طلبات شراء جديدة
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- سياسة المشرف للتحكم الكامل (باستخدام Service Role Key من السيرفر)
-- الـ Service Role Key يتجاوز RLS تلقائياً
