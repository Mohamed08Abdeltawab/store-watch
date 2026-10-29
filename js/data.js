/**
 * Ben10 Watch Store - Master Catalog Data
 * Reverse-engineered data model inspired by high-conversion e-commerce architecture.
 */

const STORE_CONFIG = {
  storeName: "Ben10",
  tagline: "ساعات تصنع الفرق، وفخامة تليق بك",
  phone: "01065712366",
  phoneDisplay: "0106 571 2366",
  whatsappNumber: "201065712366",
  email: "care@ben10watches.com",
  address: "القاهرة الجديدة، التجمع الخامس، مصر",
  freeShippingThreshold: 5000,
  currency: "ج.م",
  governorates: [
    { id: "cairo", name: "القاهرة", shipping: 50, days: "24-48 ساعة" },
    { id: "giza", name: "الجيزة", shipping: 50, days: "24-48 ساعة" },
    { id: "alex", name: "الإسكندرية", shipping: 60, days: "48 ساعة" },
    { id: "delta", name: "محافظات الدلتا (المنصورة، طنطا، الزقازيق...)", shipping: 65, days: "48-72 ساعة" },
    { id: "canal", name: "مدن القناة (الإسماعيلية، بورسعيد، السويس)", shipping: 70, days: "48-72 ساعة" },
    { id: "upper", name: "محافظات الصعيد (بني سويف، أسيوط، سوهاج، قنا...)", shipping: 80, days: "3-4 أيام" },
    { id: "remote", name: "المحافظات الحدودية (البحر الأحمر، مطروح، الوادي الجديد)", shipping: 95, days: "4-5 أيام" }
  ]
};

const CATEGORIES = [
  {
    id: "all",
    name: "جميع الساعات",
    short: "الكل",
    icon: "watch",
    count: 12
  },
  {
    id: "classic",
    name: "ساعات كلاسيكية",
    short: "كلاسيك",
    eyebrow: "أناقة خالدة",
    desc: "تصاميم راقية تليق بالمناسبات الرسمية والاجتماعات الهامة، خامات فاخرة ولمسات نقية.",
    image: "img/ben10-classic-concept-01.png",
    count: 3
  },
  {
    id: "chrono",
    name: "ساعات كرونوغراف",
    short: "كرونوغراف",
    eyebrow: "دقة هندسية",
    desc: "ميناء متعدد الوظائف مع مقياس سرعة تاكيميتر وعقارب دقيقة لحساب الأجزاء من الثانية.",
    image: "img/ben10-chronograph-concept-01.png",
    count: 3
  },
  {
    id: "sport",
    name: "ساعات رياضية",
    short: "رياضية",
    eyebrow: "أداء ومتانة",
    desc: "هياكل قوية مقاومة للصدمات والمياه مع أساور سيليكون مرنة تناسب أسلوب حياتك النشط.",
    image: "img/ben10-sport-concept-01.png",
    count: 2
  },
  {
    id: "automatic",
    name: "ساعات أوتوماتيك",
    short: "أوتوماتيك",
    eyebrow: "ميكانيكا حية",
    desc: "تعمل بحركة معصمك بدون بطارية، مع نافذة هيكلية تكشف تروس المحرك الداخلي الساحر.",
    image: "img/ben10-chronograph-concept-01.png",
    count: 2
  },
  {
    id: "smart",
    name: "ساعات ذكية",
    short: "ذكية",
    eyebrow: "تكنولوجيا المستقبل",
    desc: "شاشات AMOLED ساطعة مع تتبع كامل للصحة والنبض والاتصال الهاتفي وإشعارات التطبيقات.",
    image: "img/ben10-sport-concept-01.png",
    count: 2
  }
];

const PRODUCTS = [
  {
    id: "ben10-classic-heritage",
    brand: "Ben10",
    name: "ساعة Ben10 رويال هيريتدج كلاسيك",
    sub: "ستانلس ستيل 316L مصقول · زجاج ياقوتي مقاوم للخدش",
    cat: "classic",
    price: 3450,
    old: 4200,
    rating: 4.9,
    reviews: 184,
    tag: "best",
    badgeText: "الأكثر طلباً",
    image: "img/ben10-classic-concept-01.png",
    gallery: [
      "img/ben10-classic-concept-01.png",
      "img/ben10-classic-concept-01-300x300.png"
    ],
    overview: "ساعة كلاسيكية ذات حضور هادئ وفخم. مصممة لتكون رفيقك اليومي في العمل والمناسبات الرسمية، بميناء مصقول بعناية وزجاج ياقوتي لا يخدش مع مرور السنين.",
    specs: {
      movement: "كوارتز ياباني أصلي فائق الدقة (Miyota Citizen)",
      case: "ستانلس ستيل 316L صلب مقاوم للصدأ والحساسية",
      glass: "زجاج سافاير كريستال ياقوتي مضاد للخدش",
      diameter: "41 ملم سمك 8.5 ملم",
      waterResist: "5 ATM (50 متر) - مقاومة للماء والسباحة السطحية",
      strap: "جلد طبيعي إيطالي مع درزات متينة وإبزيم فراشة مريح",
      warranty: "ضمان 12 شهر استبدال فوري ضد عيوب الصناعة"
    },
    colors: [
      { h: "#1a1a1a", n: "ميناء أسود فاخر", img: "img/ben10-classic-concept-01.png" },
      { h: "#c5a059", n: "إطار ذهبي ملكي", img: "img/ben10-classic-concept-01.png" },
      { h: "#e2e8f0", n: "فضي أنيق", img: "img/ben10-classic-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-apex-chrono",
    brand: "Ben10",
    name: "ساعة Ben10 أبكس كرونوغراف سبيد",
    sub: "هيكل تيتانيوم مطفي · تاكيميتر دقيق وعقارب مضيئة",
    cat: "chrono",
    price: 4890,
    old: 5600,
    rating: 4.9,
    reviews: 215,
    tag: "best",
    badgeText: "الأعلى تقييماً",
    image: "img/ben10-chronograph-concept-01.png",
    gallery: [
      "img/ben10-chronograph-concept-01.png",
      "img/ben10-chronograph-concept-01-300x300.png"
    ],
    overview: "تحفة هندسية تجمع بين قوة الكرونوغراف وجمال التصميم المتطور. 3 مواني فرعية لقياس الثواني والدقائق بدقة متناهية مع إطار تاكيميتر خارجي لحساب السرعة.",
    specs: {
      movement: "ماكينة كرونوغراف ميكو-كوارتز يابانية متطورة",
      case: "ستانلس ستيل مطلي بطبقة DLC تيتانيوم أسود مقاوم للخدوش",
      glass: "سافاير كريستال بطبقة مانعة للانعكاس الضوئي مزدوجة",
      diameter: "43 ملم",
      waterResist: "10 ATM (100 متر) مع تاج محكم الإغلاق",
      strap: "سوار صلب من الستانلس ستيل مع قفل أمان مزدوج",
      warranty: "ضمان سنتين معتمد مع بطاقة ضمان مختومة"
    },
    colors: [
      { h: "#101211", n: "أسود تيتانيوم كامل", img: "img/ben10-chronograph-concept-01.png" },
      { h: "#1e3a5f", n: "كحلي داكن مع لمسات فضية", img: "img/ben10-chronograph-concept-01.png" },
      { h: "#A3E635", n: "إصدار Ben10 الأخضر الحصري", img: "img/ben10-chronograph-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-sport-stealth",
    brand: "Ben10",
    name: "ساعة Ben10 أكتيف سبورت إكستريم",
    sub: "مقاومة صدمات عسكرية · حزام سيليكون فنتيد مريح",
    cat: "sport",
    price: 3890,
    old: 4600,
    rating: 4.8,
    reviews: 142,
    tag: "sale",
    badgeText: "خصم 15%",
    image: "img/ben10-sport-concept-01.png",
    gallery: [
      "img/ben10-sport-concept-01.png",
      "img/ben10-sport-concept-01-300x300.png"
    ],
    overview: "صُممت لتحمل أقسى الظروف والتمارين الرياضية الشاقة. خفيفة على المعصم، مقاومة للسقوط والحرارة والماء حتى عمق 100 متر.",
    specs: {
      movement: "حركة كوارتز معيارية عالية الدقة مع حماية ماصّة للصدمات",
      case: "كربون بوليمر مركب مع حافة فولاذية قوية",
      glass: "زجاج معدني مقوى كيميائياً ضد الكسر والضغط",
      diameter: "44 ملم",
      waterResist: "10 ATM (100 متر) مناسبة للغوص والرياضات المائية",
      strap: "سيليكون مرن ناعم ومضاد للبكتيريا ومقاوم للعرق",
      warranty: "ضمان 12 شهر استبدال فوري"
    },
    colors: [
      { h: "#191d1a", n: "أسود كربوني مطفي", img: "img/ben10-sport-concept-01.png" },
      { h: "#A3E635", n: "لمسات خضراء Ben10 رياضية", img: "img/ben10-sport-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-skeleton-auto",
    brand: "Ben10",
    name: "ساعة Ben10 سكيلتون أوتوماتيك ماستر",
    sub: "حركة ميكانيكية ذاتية التعبئة · ظهر شفاف كاشف للتروس",
    cat: "automatic",
    price: 6990,
    old: 8200,
    rating: 4.95,
    reviews: 97,
    tag: "new",
    badgeText: "إصدار فاخر",
    image: "img/ben10-chronograph-concept-01.png",
    gallery: [
      "img/ben10-chronograph-concept-01.png"
    ],
    overview: "ساعة لعشاق الهندسة الميكانيكية الأصيلة. لا تحتاج إلى أي بطارية، تتغذى على طاقة حركتك اليومية وتخزن طاقة تكفي حتى 42 ساعة توقف.",
    specs: {
      movement: "ميكانيكية أوتوماتيكية بنظام التعبئة الذاتية (24 جوهرة)",
      case: "فولاذ جراحي 316L فائق الصلابة والبريق",
      glass: "سافاير أمامي وخلفي كاشف لحركة التروس والرقاص",
      diameter: "42 ملم",
      waterResist: "5 ATM (50 متر)",
      strap: "سوار من الستانلس ستيل المدمج مع وصلات قابلة للتعديل",
      warranty: "ضمان سنتين شامل الصيانة الدورية المجانية"
    },
    colors: [
      { h: "#222222", n: "فضي مع تروس ذهبية", img: "img/ben10-chronograph-concept-01.png" },
      { h: "#0f172a", n: "رمادي جان ميتال فخم", img: "img/ben10-chronograph-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-omni-smart",
    brand: "Ben10",
    name: "ساعة Ben10 أومني سمارت X",
    sub: "شاشة AMOLED 1.43 بوصة · مكالمات بلوتوث وتتبع صحي دقيق",
    cat: "smart",
    price: 3200,
    old: 3800,
    rating: 4.75,
    reviews: 168,
    tag: "new",
    badgeText: "أحدث جيل",
    image: "img/ben10-sport-concept-01.png",
    gallery: [
      "img/ben10-sport-concept-01.png"
    ],
    overview: "تجمع بين الشكل الأنيق للساعة الفاخرة وأذكى التقنيات الحديثة. شاشة فائقة الوضوح تحت أشعة الشمس، مستشعرات دقيقة لمراقبة نبض القلب والأكسجين والنوم، وبطارية تدوم حتى 10 أيام.",
    specs: {
      movement: "معالج ثنائي النواة فائق السرعة مع شاشة AMOLED 466x466",
      case: "إطار من سبائك الزنك المؤكسد مع ظهر سيراميكي ناعم",
      glass: "زجاج منحني 2.5D مقاوم للبصمات والخدوش",
      diameter: "46 ملم",
      waterResist: "معيار IP68 المقاوم للغبار والماء بعمق 1.5 متر",
      strap: "سوارين مرفقين مجاناً (سوار سيليكون + سوار جلد طبيعي)",
      warranty: "ضمان 12 شهر معتمد مع تحديثات سوفتوير مستمرة"
    },
    colors: [
      { h: "#101211", n: "أسود داكن", img: "img/ben10-sport-concept-01.png" },
      { h: "#94a3b8", n: "فضي ألومنيوم", img: "img/ben10-sport-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-monaco-vintage",
    brand: "Ben10",
    name: "ساعة Ben10 موناكو كلاسيك فينتدج",
    sub: "ميناء مربع مستوحى من سباقات السبعينات · زجاج مقبب",
    cat: "classic",
    price: 3950,
    old: 4600,
    rating: 4.85,
    reviews: 118,
    tag: "sale",
    badgeText: "وفر 650 ج.م",
    image: "img/ben10-classic-concept-01.png",
    gallery: [
      "img/ben10-classic-concept-01.png"
    ],
    overview: "تصميم هندسي مربع نادر يعود بك إلى العصر الذهبي للساعات الكلاسيكية. ميناء بأرقام كلاسيكية محفورة وعقارب دقيقة بلون أزرق حراري.",
    specs: {
      movement: "كوارتز سويسري عالي الدقة",
      case: "ستانلس ستيل بتشطيب خطي مات ناعم",
      glass: "كريستال معدني محدب بتقنية مضادة للانعكاس",
      diameter: "39 ملم × 39 ملم (مربع كلاسيكي)",
      waterResist: "5 ATM (50 متر)",
      strap: "جلد طبيعي بلون بني عسلي مخرم بنمط السباقات",
      warranty: "ضمان 12 شهر معتمد"
    },
    colors: [
      { h: "#6b4a32", n: "جلد بني عسلي", img: "img/ben10-classic-concept-01.png" },
      { h: "#111111", n: "جلد أسود كلاسيكي", img: "img/ben10-classic-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-diver-pro-300",
    brand: "Ben10",
    name: "ساعة Ben10 أوشن دايموند دايفر 300",
    sub: "مقاومة ماء احترافية حتى 300 متر · إطار سيراميك دوار",
    cat: "sport",
    price: 5250,
    old: 6200,
    rating: 4.9,
    reviews: 83,
    tag: "best",
    badgeText: "مقاومة 300M",
    image: "img/ben10-sport-concept-01.png",
    gallery: [
      "img/ben10-sport-concept-01.png"
    ],
    overview: "ساعة غوص احترافية معتمدة وفق أدق المعايير البحرية. إطار سيراميكي أحادي الاتجاه بـ 120 نقرة وصمام تفريغ هيليوم للاستخدامات الشاقة.",
    specs: {
      movement: "أوتوماتيك Seiko NH35A الياباني الموثوق (احتياطي 41 ساعة)",
      case: "ستانلس ستيل بحري 316L ثقيل ومتين",
      glass: "سافاير سميك 3.5 ملم مع طلاء سويسري مضاد للوهج",
      diameter: "42 ملم",
      waterResist: "30 ATM (300 متر) مع تاج وقاع محكمين بالبراغي",
      strap: "سوار صلب ثلاثي الوصلات مع وصلة توسيع للبدلات المائية",
      warranty: "ضمان سنتين معتمد"
    },
    colors: [
      { h: "#0d2b45", n: "أزرق محيطي داكن", img: "img/ben10-sport-concept-01.png" },
      { h: "#132a13", n: "أخضر زمردي غامق", img: "img/ben10-sport-concept-01.png" }
    ],
    inStock: true
  },
  {
    id: "ben10-pilot-chronograph",
    brand: "Ben10",
    name: "ساعة Ben10 أفياتور بايلوت كرونو",
    sub: "تصميم طيارين عسكري · ميناء واضح القراءة مع نافذة تاريخ",
    cat: "chrono",
    price: 4350,
    old: 5100,
    rating: 4.8,
    reviews: 135,
    tag: "sale",
    badgeText: "خصم خاص",
    image: "img/ben10-chronograph-concept-01.png",
    gallery: [
      "img/ben10-chronograph-concept-01.png"
    ],
    overview: "مستوحاة من لوحات قيادة الطائرات الحربية العريقة. أرقام بيضاء مضيئة كبيرة تتيح قراءة الوقت بلمح البصر في الظلام الدامس مع أزرار كرونوغراف سريعة الاستجابة.",
    specs: {
      movement: "كرونوغراف عالي السرعة يقيس 1/10 من الثانية",
      case: "فولاذ صلب مطلي بطبقة بي في دي رمادي مسامي",
      glass: "زجاج سافاير مقبب معالج حرارياً",
      diameter: "43 ملم",
      waterResist: "10 ATM (100 متر)",
      strap: "سوار قماشي عسكري ناتو مقوى مع خياطة مزدوجة",
      warranty: "ضمان 12 شهر معتمد"
    },
    colors: [
      { h: "#2b2d2f", n: "رمادي عسكري مات", img: "img/ben10-chronograph-concept-01.png" },
      { h: "#182318", n: "زيتي تكتيكي", img: "img/ben10-chronograph-concept-01.png" }
    ],
    inStock: true
  }
];

const TESTIMONIALS = [
  {
    name: "م. أحمد الشناوي",
    city: "التجمع الخامس، القاهرة",
    avatar: "أ.ش",
    stars: 5,
    quote: "الساعة وصلتني في أقل من 36 ساعة، التغليف فخم جداً وعلبة شيك تليق كهدية. عاينت الساعة وجربتها قبل ما أدفع قرش للمندوب، الكواليتي والخامات أنضف بكتير من الصور. شكراً Ben10!",
    verified: true,
    watch: "ساعة Ben10 أبكس كرونوغراف سبيد"
  },
  {
    name: "د. كريم عبد العزيز",
    city: "سموحة، الإسكندرية",
    avatar: "ك.ع",
    stars: 5,
    quote: "كنت متردد أشتري ساعة أونلاين، لكن ميزة المعاينة قبل الدفع شجعتني. الساعة رويال كلاسيك تحفة فنية بكل معنى الكلمة، وزنها محترم على الإيد والزجاج السافاير حقيقي مش بلاستيك. تقييمي 10 من 10.",
    verified: true,
    watch: "ساعة Ben10 رويال هيريتدج كلاسيك"
  },
  {
    name: "كابتن عمر الجيار",
    city: "الشيخ زايد، الجيزة",
    avatar: "ع.ج",
    stars: 5,
    quote: "الساعة الرياضية أكتيف إكستريم ممتازة في الجيم والجري ومقاومة للعرق والمياه بشكل رائع. خدمة العملاء على الواتساب سريعة ومحترمة جداً في المتابعة بعد البيع.",
    verified: true,
    watch: "ساعة Ben10 أكتيف سبورت إكستريم"
  }
];
