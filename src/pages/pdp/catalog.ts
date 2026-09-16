// ─────────────────────────────────────────────────────────────────────────────
// PDP catalog — resolves a thin Product (+ category) into a rich ProductDetail.
//
//   resolveProductDetail(product, category)
//     1. rich per-id seed in PDP_CATALOG  → use it
//     2. otherwise synthesize from category defaults using the thin product's
//        title/brand/rating/price/image.
//
// The SUPPLEMENT defaults reproduce the original hardcoded page content verbatim,
// so every supplement product renders exactly as before.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from '../../components/home/ProductCard';
import type {
  ProductDetail, ProductCategory, CategoryAttributes, PackageOption, Review,
  RatingBar, Faq, ServiceItem, FeatureItem, InfoBlock, SpecRow,
} from './types';

// ─── Shared image assets (localized under public/Images/products) ────────────────

const THUMB_1 = '/Images/products/detail-thumb-1.png';
const THUMB_2 = '/Images/products/detail-thumb-2.png';
const DESC_IMAGES = [
  '/Images/products/detail-desc-1.png',
  '/Images/products/detail-desc-2.png',
  '/Images/products/detail-desc-3.png',
  '/Images/products/detail-desc-4.png',
  '/Images/products/detail-desc-5.png',
];
const PRODUCT_IMG = (n: number) => `/Images/products/product-${n}.png`;

// ─── Shared commerce content (services / reviews / faqs) ─────────────────────────

const SERVICES: ServiceItem[] = [
  { icon: 'shipping',  title: 'International Shipping', desc: 'Direct from USA to 50+ countries' },
  { icon: 'authentic', title: 'Authentic Products',     desc: 'Sourced from authorised company only.' },
  { icon: 'duties',    title: 'Duties Included',        desc: 'Online price, zero customs surprises' },
  { icon: 'payments',  title: 'Secure Payments',        desc: 'SSL, Razorpay, UPI & all major cards' },
  { icon: 'delivery',  title: 'Fast Delivery',          desc: '7–12 business days to India' },
  { icon: 'returns',   title: 'Easy Returns',           desc: '14-day no-questions-asked policy' },
];

const REVIEWS: Review[] = [
  { name: 'Sneha T.',       stars: 4, date: '2 days ago',  text: 'Received my product in pristine condition. Great service overall — will order again for sure.' },
  { name: 'Yash Shinde',    stars: 4, date: '3 days ago',  text: 'Great price for an authentic product. Fast international shipping too — no customs surprises.' },
  { name: 'Maya Patel',     stars: 4, date: '5 days ago',  text: 'The colors and fabric quality exceeded my expectations. Delivery was prompt and the packaging neat.' },
  { name: 'Liam Johnson',   stars: 4, date: '1 week ago',  text: 'Excellent customer service and detailed tracking updates. The item arrived exactly as described.' },
  { name: 'Sofia Martinez', stars: 4, date: '2 weeks ago', text: 'Loved the unique design and comfortable fit. The seller was responsive and helpful throughout.' },
];

const RATING_BARS: RatingBar[] = [
  { star: 5, pct: 76 }, { star: 4, pct: 55 }, { star: 3, pct: 19 }, { star: 2, pct: 27 }, { star: 1, pct: 28 },
];

const SUPPLEMENT_FAQS: Faq[] = [
  { q: 'Are the products genuine and authentic?', a: 'Yes, all products are sourced from reputable international marketplaces in US, UK, and UAE. We have a robust verification process to ensure product authenticity, and each item is inspected at our warehouse before shipping to customers. Every product comes with applicable warranties and our standard return policy for your peace of mind.' },
  { q: 'Are these supplements tested for purity and potency?', a: 'All supplements sold on Walherb are third-party tested for purity, potency, and safety. We only stock products from brands that meet NSF, USP, or equivalent quality standards.' },
  { q: 'How do you verify the source of the products?', a: 'We source directly from official brand websites, authorized US retailers, and certified distributors. Each batch is verified with purchase receipts and authenticity certificates.' },
  { q: 'What measures are taken to ensure product quality?', a: 'Our quality team inspects every item before dispatch — checking seals, expiry dates, and packaging integrity. Products are stored in climate-controlled warehouses and dispatched with tamper-evident packaging.' },
];

// ─── Related product rails ───────────────────────────────────────────────────────

const RELATED_PRODUCTS: Product[] = [
  { id: 201, title: 'Life Extension, NAD+ Cell Regenerator, 100 mg, 30 Capsules',          rating: 4.7, price: '₹1,750', originalPrice: '₹2,350', image: PRODUCT_IMG(1) },
  { id: 202, title: 'Everyone, 2 in 1 Lotion, Unscented, 32 fl oz (946 ml)',               rating: 4.7, price: '₹3,200', originalPrice: '₹4,000', image: PRODUCT_IMG(2) },
  { id: 203, title: 'Medicube, PDRN Pink Peptide Serum, 1.01 fl oz (30 ml)',               rating: 4.7, price: '₹2,100', originalPrice: '₹2,900', image: PRODUCT_IMG(3) },
  { id: 204, title: 'Forest Leaf, Quercetin Bromelain + Stinging Nettle, 120 Capsules',    rating: 4.7, price: '₹1,900', originalPrice: '₹2,450', image: PRODUCT_IMG(4) },
  { id: 205, title: 'NutriGold, Vitamin C, 1000 mg, 240 Veggie Capsules',                  rating: 4.7, price: '₹2,600', originalPrice: '₹3,100', image: PRODUCT_IMG(5) },
  { id: 206, title: 'Solgar, Zinc Picolinate, 22 mg, 100 Tablets',                         rating: 4.7, price: '₹2,300', originalPrice: '₹3,000', image: PRODUCT_IMG(6) },
  { id: 207, title: "Doctor's Best, High Absorption Magnesium, 120 Tablets",               rating: 4.7, price: '₹1,850', originalPrice: '₹2,600', image: PRODUCT_IMG(1) },
  { id: 208, title: 'California Gold Nutrition, Sport, Pure Creatine Monohydrate, 1 kg',   rating: 4.7, price: '₹2,750', originalPrice: '₹3,300', image: PRODUCT_IMG(2) },
  { id: 209, title: 'California Gold Nutrition, CollagenUP®, Hydrolysed Marine Collagen',  rating: 4.7, price: '₹2,000', originalPrice: '₹2,700', image: PRODUCT_IMG(3) },
];

const RELATED_PRODUCTS_2: Product[] = RELATED_PRODUCTS.map((p, i) => ({ ...p, id: 300 + i })).reverse();

// ─── Supplement defaults (verbatim from the original page) ───────────────────────

const SUPPLEMENT_PACKAGES: PackageOption[] = [
  { label: '110 Count', price: '₹1,099', originalPrice: '₹1,450', priceValue: 1099, originalValue: 1450, inventory: 12, sku: 'MF-BB-110', best: false },
  { label: '120 Count', price: '₹1,250', originalPrice: '₹1,700', priceValue: 1250, originalValue: 1700, inventory: 5,  sku: 'MF-BB-120', best: true },
];

const SUPPLEMENT_FEATURES: FeatureItem[] = [
  { title: 'Non-GMO',              desc: 'Made with real food ingredients' },
  { title: 'Gentle Iron',          desc: 'No constipation or nausea' },
  { title: 'Folic Acid',           desc: 'B12 & Vitamin C included' },
  { title: 'Vegan',                desc: 'Certified Kosher' },
  { title: 'Lab-Tested',           desc: 'Third party verified' },
  { title: 'Gluten Free',          desc: 'Allergen-free facility' },
  { title: 'Clinically Supported', desc: 'Backed by research' },
  { title: 'USA Made',             desc: 'Good Manufacturing Practices' },
];

const SUPPLEMENT_HERO_SPECS: SpecRow[] = [
  { label: 'Brand',                   value: 'MegaFood' },
  { label: 'Item Form',               value: 'Tablet' },
  { label: 'Primary Supplement Type', value: 'Iron' },
  { label: 'Unit Count',              value: '72 Count' },
  { label: 'Flavor',                  value: 'Unflavoured' },
];

const SUPPLEMENT_IMPORTANT_INFO: InfoBlock[] = [
  { title: 'Safety Information', body: 'Warning: Accidental overdose of iron-containing products is a leading cause of fatal poisoning in children under six. Keep this product out of reach of children. In case of accidental overdose, call a doctor or poison control center immediately. Store tightly sealed in a cool place and avoid exposure to moisture. Once open, consume within three months. Tablet color may naturally change over time. Do not use if seal under cap is broken or missing.' },
  { title: 'Indications', body: 'MegaFood Blood Builder Iron' },
  { title: 'Ingredients', body: 'Vitamin C (as ascorbic acid), Folate (as folic acid), Vitamin B12 (as cyanocobalamin), Iron (as fermented iron bisglycinate), Organic beetroot. Food Blend: Organic brown rice, organic orange, organic broccoli. Other Ingredients: Ferment media (rice protein, autolyzed yeast extract, organic brown rice, yeast [inactive]), rice protein, autolyzed yeast, stearic acid, silicon dioxide, hypromellose.' },
  { title: 'Directions', body: 'Adults take 2 tablets daily with a beverage. May be taken any time of day, even on an empty stomach. Not intended for children.' },
  { title: 'Legal Disclaimer', body: 'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Statements regarding dietary supplements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease or health condition.' },
];

const SUPPLEMENT_SPECIFICATIONS: SpecRow[] = [
  { label: 'Age Range Description', value: 'Adult' },
  { label: 'Best Sellers Rank', value: '#1,421 in Health & Household • #8 in Iron Mineral Supplements' },
  { label: 'Brand', value: 'MegaFood' },
  { label: 'Brand Name', value: 'MegaFood' },
  { label: 'Customer Reviews', value: '4.7 out of 5 stars — 15,997 Reviews' },
  { label: 'Diet Type', value: 'Vegan' },
  { label: 'Flavor', value: 'Unflavored' },
  { label: 'Item Form', value: 'Tablet' },
  { label: 'Item Volume', value: '15.8 Fluid Ounces' },
  { label: 'Item Weight', value: '5.44 ounces' },
  { label: 'Manufacturer', value: 'MEGAFOOD' },
  { label: 'Manufacturer Part Number', value: '10427' },
  { label: 'Model Number', value: '10427' },
  { label: 'Number of Items', value: '1' },
  { label: 'Primary Supplement Type', value: 'Iron' },
  { label: 'Product Benefits', value: 'Iron' },
  { label: 'UPC', value: '051494104279' },
  { label: 'Unit Count', value: '72 Count' },
];

const SUPPLEMENT_PRODUCT_DETAILS: SpecRow[] = [
  { label: 'Product Dimensions', value: '2.12 x 2.12 x 3.9 inches; 5.44 ounces' },
  { label: 'Item model number', value: '10427' },
  { label: 'Date First Available', value: 'September 17, 2020' },
  { label: 'Manufacturer', value: 'MEGAFOOD' },
  { label: 'ASIN', value: 'B089HGM4VR' },
  { label: 'Best Sellers Rank', value: '#1,421 in Health & Household • #8 in Iron Mineral Supplements' },
];

// ─── Synthesizers ────────────────────────────────────────────────────────────────

const num = (s: string) => Number(s.replace(/[^0-9.]/g, '')) || 0;

function buildSupplementDetail(p: Product): ProductDetail {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand ?? p.title.split(',')[0].split(' ')[0],
    category: 'SUPPLEMENT',
    rating: p.rating,
    reviewCount: 24132,
    gallery: [p.image, THUMB_1, THUMB_2, p.image],
    pricing: { price: p.price, originalPrice: p.originalPrice, priceValue: num(p.price), originalValue: num(p.originalPrice) },
    breadcrumbs: ['Home', 'Vitamins', 'Minerals', 'Iron Supplements'],
    packages: SUPPLEMENT_PACKAGES,
    heroSpecs: SUPPLEMENT_HERO_SPECS,
    specifications: SUPPLEMENT_SPECIFICATIONS,
    productDetails: SUPPLEMENT_PRODUCT_DETAILS,
    descriptionImages: DESC_IMAGES,
    reviews: REVIEWS,
    ratingBars: RATING_BARS,
    faqs: SUPPLEMENT_FAQS,
    services: SERVICES,
    related: RELATED_PRODUCTS,
    alsoBought: RELATED_PRODUCTS_2,
    categoryAttributes: {
      category: 'SUPPLEMENT',
      features: SUPPLEMENT_FEATURES,
      importantInfo: SUPPLEMENT_IMPORTANT_INFO,
    },
  };
}

/** Minimal but valid detail for any non-seeded product, so every category renders. */
function buildGenericDetail(p: Product, category: ProductCategory): ProductDetail {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand ?? p.title.split(',')[0].split(' ')[0],
    category,
    rating: p.rating,
    reviewCount: 1200,
    gallery: [p.image, THUMB_1, THUMB_2, p.image],
    pricing: { price: p.price, originalPrice: p.originalPrice, priceValue: num(p.price), originalValue: num(p.originalPrice) },
    breadcrumbs: ['Home', 'Shop'],
    specifications: [],
    reviews: REVIEWS,
    ratingBars: RATING_BARS,
    services: SERVICES,
    related: RELATED_PRODUCTS,
    // All attribute fields are optional, so an empty object per category is valid
    // and every generic section simply hides itself (empty-state handling).
    categoryAttributes: { category } as CategoryAttributes,
  };
}

// ─── Rich per-id seeds ───────────────────────────────────────────────────────────

const TRAVEL_POUCH: ProductDetail = {
  id: 901,
  title: 'FYY Electronic Organizer, Travel Cable Organizer Bag Pouch',
  brand: 'FYY',
  category: 'TRAVEL_ACCESSORIES',
  rating: 4.8,
  reviewCount: 8421,
  gallery: [PRODUCT_IMG(3), PRODUCT_IMG(5), PRODUCT_IMG(6), PRODUCT_IMG(4)],
  pricing: { price: '₹1,299', originalPrice: '₹1,999', priceValue: 1299, originalValue: 1999 },
  breadcrumbs: ['Home', 'Travel Accessories', 'Cable Organizers'],
  variants: {
    colors: [
      { name: 'Forest Green', swatch: '#476D59' },
      { name: 'Black',        swatch: '#222222' },
      { name: 'Navy',         swatch: '#2B3A55' },
      { name: 'Grey',         swatch: '#9AA0A6' },
      { name: 'Burgundy',     swatch: '#7B2D3B' },
      { name: 'Teal',         swatch: '#2F8E8E' },
    ],
    sizes: [
      { label: 'Cable Organizer', pricing: { price: '₹1,299', originalPrice: '₹1,999', priceValue: 1299, originalValue: 1999 }, inventory: 24, sku: 'FYY-ORG' },
      { label: 'Large',  pricing: { price: '₹1,499', originalPrice: '₹2,199', priceValue: 1499, originalValue: 2199 }, inventory: 12, sku: 'FYY-L' },
      { label: 'Medium', pricing: { price: '₹1,199', originalPrice: '₹1,799', priceValue: 1199, originalValue: 1799 }, inventory: 18, sku: 'FYY-M' },
      { label: 'Small',  pricing: { price: '₹999',  originalPrice: '₹1,499', priceValue: 999,  originalValue: 1499 }, inventory: 0,  sku: 'FYY-S' },
    ],
  },
  heroSpecs: [
    { label: 'Material', value: 'Premium water-resistant nylon' },
    { label: 'Closure',  value: 'Double-zip' },
    { label: 'Use',      value: 'Cables, chargers, power banks' },
  ],
  specifications: [
    { label: 'Brand', value: 'FYY' },
    { label: 'Colour', value: 'Forest Green' },
    { label: 'Closure Type', value: 'Zipper' },
    { label: 'Water Resistance Level', value: 'Water Resistant' },
    { label: 'Compartments', value: 'Multiple elastic loops + mesh pockets' },
    { label: 'Recommended Uses', value: 'Travel, Electronics, Cosmetics' },
  ],
  descriptionImages: DESC_IMAGES,
  reviews: REVIEWS,
  ratingBars: RATING_BARS,
  services: SERVICES,
  related: RELATED_PRODUCTS.slice(0, 6),
  alsoBought: RELATED_PRODUCTS_2.slice(0, 6),
  faqs: [
    { q: 'Is this pouch water resistant?', a: 'Yes. The exterior is made from water-resistant nylon that protects your electronics from light rain and spills. It is not fully waterproof, so avoid submersion.' },
    { q: 'Will it fit a charger and power bank together?', a: 'The Cable Organizer and Large sizes comfortably fit a charger, power bank, cables and adapters. The Medium and Small are best for cables and earphones.' },
    { q: 'What is included in the package?', a: 'One organizer pouch. See the Package Contents section for the full list of internal loops and pockets.' },
  ],
  categoryAttributes: {
    category: 'TRAVEL_ACCESSORIES',
    featureHighlights: [
      { title: 'Compact & Lightweight', desc: 'Slips into any handbag, backpack or suitcase' },
      { title: 'All-in-One Pouch',      desc: 'Keeps cables, chargers and gadgets tangle-free' },
      { title: 'Premium Build',         desc: 'Durable double-zip and reinforced stitching' },
      { title: 'Multiple Colors',       desc: 'Six colours to match your style' },
      { title: 'Elastic Loops',         desc: 'Secure hold for cables of every size' },
      { title: 'Water Resistant',       desc: 'Protects electronics from spills and light rain' },
    ],
    dimensions: '8.7 x 5.1 x 1.6 inches',
    weight: '230 g',
    material: 'Water-resistant nylon exterior, soft mesh interior',
    packageContents: [
      '1 × FYY Electronic Organizer Pouch',
      '8 × elastic cable loops',
      '2 × mesh zip pockets',
      '1 × SD/memory-card slot panel',
    ],
  },
};

const PDP_CATALOG: Record<number, ProductDetail> = {
  [TRAVEL_POUCH.id]: TRAVEL_POUCH,
};

// ─── Public resolver ─────────────────────────────────────────────────────────────

/** Catalog categoryIds that belong to the Travel Accessories template. */
const TRAVEL_CATEGORY_IDS = new Set([
  'travel-accessories', 'cable-organizers', 'travel-pouches', 'storage-bags', 'travel-kits', 'travel-cases',
]);

/** Map a categoryData `categoryId` to a PDP template category. */
export function categoryForCatalogId(categoryId?: string): ProductCategory {
  if (categoryId && TRAVEL_CATEGORY_IDS.has(categoryId)) return 'TRAVEL_ACCESSORIES';
  return 'SUPPLEMENT';
}

export function resolveProductDetail(product: Product, category: ProductCategory = 'SUPPLEMENT'): ProductDetail {
  const seeded = PDP_CATALOG[product.id];
  if (seeded) return seeded;
  if (category === 'SUPPLEMENT') return buildSupplementDetail(product);
  return buildGenericDetail(product, category);
}

export { PDP_CATALOG, TRAVEL_POUCH };
