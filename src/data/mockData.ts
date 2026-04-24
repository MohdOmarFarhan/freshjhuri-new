export interface Product {
  id: string;
  name: string;
  bnName: string;
  category: string;      // category tree id, e.g. 'honey'
  subCategory: string;   // e.g. 'Litchi Flower'
  price: number;
  originalPrice?: number;
  unit: string;          // display: '1 kg', '500g', '250ml', etc.
  weight: string;        // filter key: '250g' | '500g' | '1kg' | '5kg'
  description: string;
  longDescription?: string;
  image: string;         // Primary thumbnail
  images?: string[];     // For gallery (optional)
  badge?: string;
  isTopSelling?: boolean;
  inStock: boolean;
  stockCount?: number;   // For scarcity pulse
  isOrganic?: boolean;
  isPreOrder?: boolean;
  isSugarFree?: boolean;
  attributes: Record<string, string>;
  reviews?: {
    rating: number;
    count: number;
  };
  originStory?: string;
  nutritionalInfo?: Record<string, string>;
}

export interface CategoryNode {
  id: string;
  name: string;
  bnName: string;
  icon: string;
  subCategories: string[];
}

export const categoryTree: CategoryNode[] = [
  { id: 'honey',      name: 'Honey',               bnName: 'মধু',              icon: '🍯',
    subCategories: ['Litchi Flower', 'Mustard Flower', 'Sundarban', 'Black Seed', 'Jujube Flower', 'Hill Multiflora', 'Raw Honeycomb'] },
  { id: 'fruits',     name: 'Seasonal Fruits',      bnName: 'তাজা ফল',          icon: '🥭',
    subCategories: ['Gopalbhog Mango', 'Fazli Mango', 'Himsagar Mango', 'Amrapali Mango', 'Bedana Litchi', 'Bombai Litchi', 'Madhupur Pineapple'] },
  { id: 'dates',      name: 'Premium Dates',        bnName: 'প্রিমিয়াম খেজুর', icon: '🌴',
    subCategories: ['Ajwa', 'Medjool', 'Sukkari', 'Maryam', 'Kalmi', 'Mabroom'] },
  { id: 'cooking',    name: 'Cooking Essentials',   bnName: 'রান্নার সামগ্রী',  icon: '🧈',
    subCategories: ['Deshi Ghee', 'Mustard Oil', 'Coconut Oil', 'Olive Oil', 'Sesame Oil'] },
  { id: 'spices',     name: 'Spices',               bnName: 'মসলা',             icon: '🌶️',
    subCategories: ['Red Chilli', 'Turmeric', 'Coriander', 'Cumin', 'Garam Masala', 'Panch Phoron'] },
  { id: 'nuts',       name: 'Nuts & Dry Fruits',    bnName: 'বাদাম',            icon: '🥜',
    subCategories: ['Cashews', 'Almonds', 'Pistachios', 'Raisins', 'Dried Figs', 'Honey-Nut Mix'] },
  { id: 'superfoods', name: 'Superfoods & Seeds',   bnName: 'সুপারফুড',         icon: '🌱',
    subCategories: ['Black Seed', 'Chia Seeds', 'Basil Seeds', 'Psyllium Husk', 'Pumpkin Seeds'] },
  { id: 'pickles',    name: 'Traditional Pickles',  bnName: 'আচার',             icon: '🫙',
    subCategories: ['Garlic Pickle', 'Mango Pickle', 'Olive Pickle', 'Chilli Pickle'] },
  { id: 'tea',        name: 'Tea & Sweeteners',     bnName: 'চা ও মিষ্টি',     icon: '🍵',
    subCategories: ['Green Tea', 'Black Tea', 'Cane Jaggery', 'Date Jaggery', 'Palm Candy'] },
];

// Backward-compatible export for Header, CategoryRibbon, etc.
export const categories = categoryTree.map(c => ({ id: c.id, name: c.name, icon: c.icon }));

export const mockProducts: Product[] = [
  // ═══════════════ HONEY ═══════════════
  { id: 'h1', name: 'Litchi Flower Honey', bnName: 'লিচু ফুলের মধু', category: 'honey', subCategory: 'Litchi Flower',
    price: 850, originalPrice: 1000, unit: '1 kg', weight: '1kg',
    description: '100% pure litchi flower honey from Rajshahi apiaries. Light golden color with a floral sweetness.',
    longDescription: 'Our Litchi Flower Honey is harvested from the vast litchi orchards of Rajshahi during the blossoming season. It is characterized by its light golden hue, thin consistency, and a distinct floral aroma that carries the essence of fresh litchis.',
    image: '/images/honey.png', images: ['/images/honey.png', '/images/honey.png', '/images/honey.png'],
    badge: 'Best Seller', isTopSelling: true, inStock: true, stockCount: 12, isOrganic: true, 
    attributes: { flowerType: 'Litchi', harvestSource: 'Rajshahi' },
    reviews: { rating: 4.8, count: 124 },
    originStory: 'Sourced directly from the experienced beekeepers of Rajshahi, our honey undergoes minimal processing to preserve its natural enzymes and antioxidants.',
    nutritionalInfo: { 'Energy': '304 kcal', 'Carbohydrates': '82g', 'Sugars': '82g', 'Protein': '0.3g' } },

  { id: 'h1s', name: 'Litchi Flower Honey', bnName: 'লিচু ফুলের মধু', category: 'honey', subCategory: 'Litchi Flower',
    price: 440, originalPrice: 520, unit: '500g', weight: '500g',
    description: '100% pure litchi flower honey from Rajshahi apiaries.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { flowerType: 'Litchi' } },

  { id: 'h2', name: 'Mustard Flower Honey', bnName: 'সরিষা ফুলের মধু', category: 'honey', subCategory: 'Mustard Flower',
    price: 650, unit: '1 kg', weight: '1kg',
    description: 'Creamy mustard flower honey with a rich earthy flavor, harvested in winter.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { flowerType: 'Mustard' } },

  { id: 'h3', name: 'Sundarban Wild Honey', bnName: 'সুন্দরবনের মধু', category: 'honey', subCategory: 'Sundarban',
    price: 1500, originalPrice: 1700, unit: '1 kg', weight: '1kg',
    description: 'Authentic wild forest honey from Sundarban, harvested by traditional Mowali honey hunters.',
    longDescription: 'This is the most authentic wild honey available in Bangladesh, collected from the deep forests of the Sundarbans. It has a unique dark color and a slightly pungent, woody taste that reflects the diverse flora of the mangrove forest.',
    image: '/images/honey.png', images: ['/images/honey.png', '/images/honey.png'],
    badge: 'Wild', isTopSelling: true, inStock: true, stockCount: 5, isOrganic: true, 
    attributes: { flowerType: 'Wild Forest', source: 'Sundarban Mangrove' },
    reviews: { rating: 4.9, count: 86 },
    originStory: 'Harvested by the brave Mowalis who traverse the treacherous Sundarban forests, this honey is raw, unfiltered, and deeply potent.',
    nutritionalInfo: { 'Energy': '310 kcal', 'Carbohydrates': '81g', 'Natural Enzymes': 'High' } },

  { id: 'h3s', name: 'Sundarban Wild Honey', bnName: 'সুন্দরবনের মধু', category: 'honey', subCategory: 'Sundarban',
    price: 780, unit: '500g', weight: '500g',
    description: 'Authentic wild forest honey, multi-floral from the Sundarbans.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { flowerType: 'Wild Forest' } },

  { id: 'h4', name: 'Black Seed Honey', bnName: 'কালোজিরা ফুলের মধু', category: 'honey', subCategory: 'Black Seed',
    price: 1200, originalPrice: 1400, unit: '500g', weight: '500g',
    description: 'Highly medicinal black seed honey — powerful anti-inflammatory and immune-boosting properties.',
    image: '/images/honey.png', badge: 'Premium',
    inStock: true, isOrganic: true, isSugarFree: true, attributes: { flowerType: 'Black Seed' } },

  { id: 'h5', name: 'Jujube Flower Honey', bnName: 'বরই ফুলের মধু', category: 'honey', subCategory: 'Jujube Flower',
    price: 950, unit: '500g', weight: '500g',
    description: 'Rare Jujube flower honey with a light amber color and delicate floral sweetness.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { flowerType: 'Jujube' } },

  { id: 'h6', name: 'Hill Multiflora Honey', bnName: 'পাহাড়ি মিশ্র ফুলের মধু', category: 'honey', subCategory: 'Hill Multiflora',
    price: 1100, unit: '1 kg', weight: '1kg',
    description: 'Collected from diverse hill-track wildflowers of the Chittagong Hill Tracts.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { flowerType: 'Multiflora' } },

  { id: 'h7', name: 'Raw Honeycomb', bnName: 'চাকসহ মধু', category: 'honey', subCategory: 'Raw Honeycomb',
    price: 1800, unit: '500g', weight: '500g',
    description: 'Untouched raw wax honeycomb straight from the hive. The purest form of honey.',
    image: '/images/honey.png', badge: 'Rare',
    inStock: true, isOrganic: true, attributes: { form: 'Raw Comb' } },

  // ═══════════════ SEASONAL FRUITS ═══════════════
  { id: 'sf1', name: 'Gopalbhog Mango', bnName: 'গোপালভোগ আম', category: 'fruits', subCategory: 'Gopalbhog Mango',
    price: 120, originalPrice: 150, unit: '1 kg', weight: '1kg',
    description: 'Sweet aromatic Gopalbhog mangoes handpicked from Rajshahi orchards.',
    longDescription: 'Known as one of the sweetest varieties in the world, the Gopalbhog mango has a beautiful orange flesh and a rich juice. Our mangoes are carbide-free and naturally ripened.',
    image: '/images/mango.png', images: ['/images/mango.png', '/images/mango.png'],
    badge: 'New Harvest', isTopSelling: true, inStock: true, stockCount: 50, isOrganic: true, 
    attributes: { breed: 'Gopalbhog', ripeness: 'Ready to Eat' },
    reviews: { rating: 4.7, count: 210 },
    originStory: 'Picked at the peak of maturity from the historical mango belts of Rajshahi, ensuring that classic "queen of taste" profile.',
    nutritionalInfo: { 'Vit C': '36.4mg', 'Vit A': '1082IU', 'Fiber': '1.6g' } },

  { id: 'sf2', name: 'Fazli Mango', bnName: 'ফজলি আম', category: 'fruits', subCategory: 'Fazli Mango',
    price: 90, unit: '1 kg', weight: '1kg',
    description: 'Giant fleshy Fazli mangoes known for their mouth-watering sweetness.',
    image: '/images/mango.png',
    inStock: true, isOrganic: true, attributes: { breed: 'Fazli' } },

  { id: 'sf3', name: 'Himsagar Mango', bnName: 'ক্ষীরশাপাত/হিমসাগর আম', category: 'fruits', subCategory: 'Himsagar Mango',
    price: 110, unit: '1 kg', weight: '1kg',
    description: 'The famous creamy Himsagar — prized across Bengal for centuries for its ambrosial taste.',
    image: '/images/mango.png', badge: 'Pre-Order',
    isPreOrder: true, inStock: false, isOrganic: true, attributes: { breed: 'Himsagar' } },

  { id: 'sf4', name: 'Amrapali Mango', bnName: 'আম্রপালি আম', category: 'fruits', subCategory: 'Amrapali Mango',
    price: 80, unit: '1 kg', weight: '1kg',
    description: 'Medium-sized, high-yielding Amrapali mangoes with a perfect balance of sweet and tart.',
    image: '/images/mango.png',
    inStock: true, isOrganic: true, attributes: { breed: 'Amrapali' } },

  { id: 'sf5', name: 'Bedana Litchi', bnName: 'দিনাজপুরের বেদানা লিচু', category: 'fruits', subCategory: 'Bedana Litchi',
    price: 180, unit: '1 kg', weight: '1kg',
    description: 'Famous Dinajpur Bedana litchi — seedless with deep crimson skin and exquisite sweetness.',
    image: '/images/mango.png', badge: 'Pre-Order',
    isPreOrder: true, inStock: false, attributes: { variety: 'Bedana' } },

  { id: 'sf6', name: 'Bombai Litchi', bnName: 'রাজশাহীর বোম্বাই লিচু', category: 'fruits', subCategory: 'Bombai Litchi',
    price: 160, unit: '1 kg', weight: '1kg',
    description: 'Premium Bombai litchi from Rajshahi — large, juicy and intensely fragrant.',
    image: '/images/mango.png',
    inStock: true, attributes: { variety: 'Bombai' } },

  // ═══════════════ DATES ═══════════════
  { id: 'd1', name: 'Ajwa Dates', bnName: 'আজওয়া খেজুর', category: 'dates', subCategory: 'Ajwa',
    price: 1600, originalPrice: 1800, unit: '1 kg', weight: '1kg',
    description: 'Premium Saudi Ajwa dates — the most prized dates in Islam, known for rich taste and health value.',
    longDescription: 'Directly imported from Madinah, Saudi Arabia, these Ajwa dates are known for their dark color, soft texture, and fine white lines. They are naturally sweet and packed with minerals.',
    image: '/images/dates.png', images: ['/images/dates.png', '/images/dates.png', '/images/dates.png'],
    badge: 'Imported', isTopSelling: true, inStock: true, stockCount: 24, isSugarFree: true, 
    attributes: { variety: 'Ajwa', origin: 'Madinah' },
    reviews: { rating: 5.0, count: 340 },
    originStory: 'Sourced from the blessed palm groves of Madinah through our direct import channel to ensure freshness.',
    nutritionalInfo: { 'Potassium': '696mg', 'Magnesium': '54mg', 'Iron': '0.9mg' } },

  { id: 'd1s', name: 'Ajwa Dates', bnName: 'আজওয়া খেজুর', category: 'dates', subCategory: 'Ajwa',
    price: 850, unit: '500g', weight: '500g',
    description: 'Premium Saudi Ajwa dates — half-kilo gift box.',
    image: '/images/dates.png',
    inStock: true, isSugarFree: true, attributes: { variety: 'Ajwa' } },

  { id: 'd2', name: 'Medjool Dates', bnName: 'মেদজুল খেজুর', category: 'dates', subCategory: 'Medjool',
    price: 2200, unit: '1 kg', weight: '1kg',
    description: 'The king of dates — large, soft and caramel-sweet Medjool straight from Jordan.',
    image: '/images/dates.png',
    inStock: true, isSugarFree: true, attributes: { variety: 'Medjool' } },

  { id: 'd3', name: 'Sukkari Dates', bnName: 'সুক্কারি খেজুর', category: 'dates', subCategory: 'Sukkari',
    price: 1400, unit: '500g', weight: '500g',
    description: 'Soft, crumbly and intensely sweet Saudi Sukkari dates with a dry golden peel.',
    image: '/images/dates.png',
    inStock: true, isSugarFree: true, attributes: { variety: 'Sukkari' } },

  { id: 'd4', name: 'Maryam Dates', bnName: 'মরিয়ম/পিয়ারম খেজুর', category: 'dates', subCategory: 'Maryam',
    price: 1100, unit: '500g', weight: '500g',
    description: 'Chocolate-brown Piarom dates from Iran with a rich, slightly smoky caramel flavor.',
    image: '/images/dates.png',
    inStock: true, isSugarFree: true, attributes: { variety: 'Maryam' } },

  { id: 'd5', name: 'Safawi Dates', bnName: 'কালমি/সাফাওয়ি খেজুর', category: 'dates', subCategory: 'Kalmi',
    price: 1200, unit: '1 kg', weight: '1kg',
    description: 'Dark chocolate-hued Safawi dates with a smooth, mildly sweet flesh.',
    image: '/images/dates.png',
    inStock: true, isSugarFree: true, attributes: { variety: 'Safawi' } },

  // ═══════════════ COOKING ESSENTIALS ═══════════════
  { id: 'c1', name: 'Deshi Gawa Ghee', bnName: 'দেশি গাওয়া ঘি', category: 'cooking', subCategory: 'Deshi Ghee',
    price: 950, originalPrice: 1100, unit: '500g', weight: '500g',
    description: 'Pure A2 cow ghee made by the traditional bilona method — golden, aromatic and rich.',
    image: '/images/honey.png', badge: 'Traditional',
    isTopSelling: true, inStock: true, isOrganic: true, attributes: { type: 'Ghee' } },

  { id: 'c1L', name: 'Deshi Gawa Ghee — Large', bnName: 'দেশি গাওয়া ঘি ১ কেজি', category: 'cooking', subCategory: 'Deshi Ghee',
    price: 1800, unit: '1 kg', weight: '1kg',
    description: 'Pure A2 cow ghee, family-size glass jar.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { type: 'Ghee' } },

  { id: 'c2', name: 'Cold-Pressed Mustard Oil', bnName: 'ঘানির ভাঙানো সরিষার তেল', category: 'cooking', subCategory: 'Mustard Oil',
    price: 380, unit: '1L', weight: '1kg',
    description: 'Wood-pressed cold-extracted mustard oil retaining all natural pungency and nutrition.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { type: 'Oil' } },

  { id: 'c3', name: 'Extra Virgin Coconut Oil', bnName: 'ভোজ্য নারকেল তেল', category: 'cooking', subCategory: 'Coconut Oil',
    price: 550, unit: '500ml', weight: '500g',
    description: 'Cold-pressed virgin coconut oil — perfect for cooking, baking and hair care.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, attributes: { type: 'Oil' } },

  { id: 'c4', name: 'Extra Virgin Olive Oil', bnName: 'এক্সট্রা ভার্জিন অলিভ অয়েল', category: 'cooking', subCategory: 'Olive Oil',
    price: 1200, unit: '500ml', weight: '500g',
    description: 'Spanish first-cold-press EVOO — fruity, peppery finish, perfect for salads.',
    image: '/images/honey.png', badge: 'Imported',
    inStock: true, attributes: { type: 'Oil' } },

  // ═══════════════ SPICES ═══════════════
  { id: 'sp1', name: 'Red Chilli Powder', bnName: 'লাল মরিচের গুঁড়া', category: 'spices', subCategory: 'Red Chilli',
    price: 250, unit: '250g', weight: '250g',
    description: 'Vibrant sun-dried red chilli powder with bold heat and deep color.',
    image: '/images/spices.png',
    isTopSelling: true, inStock: true, isOrganic: true, attributes: { type: 'Powder' } },

  { id: 'sp2', name: 'Turmeric Powder', bnName: 'হলুদের গুঁড়া', category: 'spices', subCategory: 'Turmeric',
    price: 200, unit: '250g', weight: '250g',
    description: 'High-curcumin turmeric powder for rich color and powerful anti-inflammatory benefits.',
    image: '/images/spices.png',
    isTopSelling: true, inStock: true, isOrganic: true, attributes: { type: 'Powder' } },

  { id: 'sp3', name: 'Coriander Powder', bnName: 'ধনিয়ার গুঁড়া', category: 'spices', subCategory: 'Coriander',
    price: 190, unit: '250g', weight: '250g',
    description: 'Freshly stone-ground coriander with a warm citrusy, nutty aroma.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { type: 'Powder' } },

  { id: 'sp4', name: 'Shahi Garam Masala', bnName: 'শাহী গরম মসলা', category: 'spices', subCategory: 'Garam Masala',
    price: 320, unit: '250g', weight: '250g',
    description: 'Royal blend of 11 premium whole spices stone-ground to perfection. Our signature product.',
    image: '/images/spices.png', badge: 'Signature',
    inStock: true, isOrganic: true, attributes: { type: 'Blend' } },

  { id: 'sp5', name: 'Special Panch Phoron', bnName: 'স্পেশাল পাঁচফোড়ন', category: 'spices', subCategory: 'Panch Phoron',
    price: 160, unit: '250g', weight: '250g',
    description: 'Classic Bengali five-spice blend: fenugreek, nigella, cumin, fennel, and mustard.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { type: 'Blend' } },

  // ═══════════════ NUTS & DRY FRUITS ═══════════════
  { id: 'n1', name: 'Premium Cashew Nuts', bnName: 'প্রিমিয়াম কাজুবাদাম', category: 'nuts', subCategory: 'Cashews',
    price: 750, originalPrice: 900, unit: '250g', weight: '250g',
    description: 'W240-grade whole cashews — crunchy, creamy and naturally sweet.',
    image: '/images/dates.png', badge: 'Premium',
    inStock: true, attributes: { grade: 'W240' } },

  { id: 'n2', name: 'Roasted Almonds', bnName: 'রোস্টেড কাঠবাদাম', category: 'nuts', subCategory: 'Almonds',
    price: 680, unit: '250g', weight: '250g',
    description: 'Light-roasted California almonds — nutrient-dense and wonderfully satisfying.',
    image: '/images/dates.png',
    inStock: true, attributes: { variety: 'California' } },

  { id: 'n3', name: 'Premium Pistachios', bnName: 'পেস্তাবাদাম', category: 'nuts', subCategory: 'Pistachios',
    price: 1100, unit: '250g', weight: '250g',
    description: 'Large Iranian pistachios, lightly roasted. Rich in protein and healthy fats.',
    image: '/images/dates.png',
    inStock: true, attributes: { origin: 'Iranian' } },

  { id: 'n4', name: 'Afghani Raisins', bnName: 'আফগানি কিসমিস', category: 'nuts', subCategory: 'Raisins',
    price: 350, unit: '250g', weight: '250g',
    description: 'Plump, juicy golden raisins sun-dried in the Afghan highlands.',
    image: '/images/dates.png',
    inStock: true, attributes: { origin: 'Afghan' } },

  { id: 'n5', name: 'Honey-Nut Power Mix', bnName: 'মধু-বাদাম মিক্স', category: 'nuts', subCategory: 'Honey-Nut Mix',
    price: 850, unit: '500g', weight: '500g',
    description: 'Our bestseller: cashews, almonds and raisins glazed in raw organic honey. The perfect snack.',
    image: '/images/honey.png', badge: 'Bestseller',
    isTopSelling: true, inStock: true, attributes: { type: 'Mix' } },

  // ═══════════════ SUPERFOODS ═══════════════
  { id: 'su1', name: 'Original Black Seed', bnName: 'অরিজিনাল কালোজিরা', category: 'superfoods', subCategory: 'Black Seed',
    price: 280, unit: '250g', weight: '250g',
    description: '"A cure for everything except death." Premium Egyptian Nigella Sativa black seed.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { origin: 'Egyptian' } },

  { id: 'su2', name: 'Chia Seeds', bnName: 'চিয়া সিড', category: 'superfoods', subCategory: 'Chia Seeds',
    price: 350, unit: '250g', weight: '250g',
    description: 'Omega-3 rich chia seeds — perfect for smoothies, puddings and healthy desserts.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { type: 'Seed' } },

  { id: 'su3', name: 'Psyllium Husk', bnName: 'ইসবগুলের ভুষি', category: 'superfoods', subCategory: 'Psyllium Husk',
    price: 320, unit: '250g', weight: '250g',
    description: 'Fine-grade psyllium husk for superior digestive health and cholesterol management.',
    image: '/images/spices.png',
    inStock: true, attributes: { grade: 'Premium' } },

  { id: 'su4', name: 'Pumpkin Seeds', bnName: 'মিষ্টি কুমড়ার বীজ', category: 'superfoods', subCategory: 'Pumpkin Seeds',
    price: 290, unit: '250g', weight: '250g',
    description: 'Raw organic pumpkin seeds — rich in zinc, magnesium and antioxidants.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { type: 'Seed' } },

  // ═══════════════ PICKLES ═══════════════
  { id: 'p1', name: 'Garlic Pickle', bnName: 'রসুনের আচার', category: 'pickles', subCategory: 'Garlic Pickle',
    price: 220, unit: '250g', weight: '250g',
    description: 'Tangy Bangladeshi-style garlic pickle made with cold-pressed mustard oil.',
    image: '/images/spices.png',
    inStock: true, isOrganic: true, attributes: { style: 'Traditional' } },

  { id: 'p2', name: 'Sweet Mango Pickle', bnName: 'আমের টক-মিষ্টি আচার', category: 'pickles', subCategory: 'Mango Pickle',
    price: 200, unit: '250g', weight: '250g',
    description: 'Classic Bengali sweet-and-sour raw mango pickle — the perfect accompaniment.',
    image: '/images/mango.png', badge: 'Seasonal',
    inStock: true, attributes: { style: 'Sweet-Sour' } },

  { id: 'p3', name: 'Olive Pickle', bnName: 'জলপাইয়ের আচার', category: 'pickles', subCategory: 'Olive Pickle',
    price: 240, unit: '250g', weight: '250g',
    description: 'Tangy olive pickle with a nigella seed and mustard base.',
    image: '/images/spices.png',
    inStock: true, attributes: { style: 'Traditional' } },

  { id: 'p4', name: 'Chilli Pickle', bnName: 'বোম্বাই মরিচের আচার', category: 'pickles', subCategory: 'Chilli Pickle',
    price: 210, unit: '250g', weight: '250g',
    description: 'Fiery Naga chilli pickle for all you heat lovers — handle with care!',
    image: '/images/spices.png', badge: 'Spicy 🔥',
    inStock: true, attributes: { style: 'Spicy' } },

  // ═══════════════ TEA & SWEETENERS ═══════════════
  { id: 't1', name: 'Panchagarh Green Tea', bnName: 'পঞ্চগড়ের প্রিমিয়াম গ্রিন টি', category: 'tea', subCategory: 'Green Tea',
    price: 380, unit: '250g', weight: '250g',
    description: 'First-flush green tea from Panchagarh highlands — fresh, grassy and naturally detoxifying.',
    image: '/images/spices.png', badge: 'Single Origin',
    inStock: true, isOrganic: true, attributes: { origin: 'Panchagarh' } },

  { id: 't2', name: 'Sylhet Black Tea', bnName: 'সিলেটের ব্ল্যাক টি', category: 'tea', subCategory: 'Black Tea',
    price: 320, unit: '250g', weight: '250g',
    description: 'Premium Sylhet garden black tea with a bold malty taste perfect for milk tea.',
    image: '/images/spices.png',
    inStock: true, attributes: { origin: 'Sylhet' } },

  { id: 't3', name: 'Authentic Cane Jaggery', bnName: 'আসল আখের গুড়', category: 'tea', subCategory: 'Cane Jaggery',
    price: 180, unit: '1 kg', weight: '1kg',
    description: 'Traditional raw cane jaggery — the original natural sweetener of Bengal, unrefined.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, isSugarFree: true, attributes: { form: 'Solid' } },

  { id: 't4', name: 'Liquid Date Jaggery', bnName: 'ঝোলা খেজুরের গুড়', category: 'tea', subCategory: 'Date Jaggery',
    price: 350, unit: '500g', weight: '500g',
    description: 'The precious liquid date jaggery of Bangladesh — a rare winter seasonal delicacy.',
    image: '/images/honey.png', badge: 'Seasonal',
    isPreOrder: true, inStock: false, isOrganic: true, isSugarFree: true, attributes: { form: 'Liquid' } },

  { id: 't5', name: 'Palm Candy', bnName: 'তালমিছরি', category: 'tea', subCategory: 'Palm Candy',
    price: 150, unit: '250g', weight: '250g',
    description: 'Natural palm candy crystals — cooling, soothing and perfect for summer drinks.',
    image: '/images/honey.png',
    inStock: true, isOrganic: true, isSugarFree: true, attributes: { form: 'Crystal' } },
];
