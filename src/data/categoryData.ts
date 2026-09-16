// Category tree, mock products, and filter metadata for the Category Listing page

export interface CategoryNode {
  id: string;
  label: string;
  count: number;
  children?: CategoryNode[];
}

export interface CatalogProduct {
  id: number;
  title: string;
  brand: string;
  categoryId: string;
  type: string;
  form: string;
  dietary: string[];
  availability: string[];
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice: string;
  priceValue: number;
  originalValue: number;
  image: string;
  badges: string[];  // 'Best Seller' | 'New Arrival' | 'Sale'
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: 'supplements',
    label: 'All Supplements',
    count: 8500,
    children: [
      {
        id: 'vitamins',
        label: 'Vitamins',
        count: 2400,
        children: [
          { id: 'vitamin-c', label: 'Vitamin C', count: 380 },
          { id: 'vitamin-d', label: 'Vitamin D', count: 420 },
          { id: 'vitamin-b', label: 'Vitamin B Complex', count: 290 },
          { id: 'multivitamins', label: 'Multivitamins', count: 680 },
        ],
      },
      {
        id: 'minerals',
        label: 'Minerals',
        count: 1200,
        children: [
          { id: 'magnesium', label: 'Magnesium', count: 310 },
          { id: 'zinc', label: 'Zinc', count: 240 },
          { id: 'iron', label: 'Iron', count: 180 },
          { id: 'calcium', label: 'Calcium', count: 270 },
        ],
      },
      { id: 'probiotics', label: 'Probiotics', count: 680, children: [] },
      {
        id: 'herbal',
        label: 'Herbal Supplements',
        count: 1560,
        children: [
          { id: 'ashwagandha', label: 'Ashwagandha', count: 210 },
          { id: 'turmeric', label: 'Turmeric', count: 190 },
          { id: 'mushrooms', label: 'Mushroom Blends', count: 140 },
        ],
      },
      {
        id: 'sports',
        label: 'Sports Nutrition',
        count: 960,
        children: [
          { id: 'protein', label: 'Protein', count: 320 },
          { id: 'creatine', label: 'Creatine', count: 140 },
          { id: 'pre-workout', label: 'Pre-Workout', count: 180 },
        ],
      },
      { id: 'digestive', label: 'Digestive Health', count: 480, children: [] },
      { id: 'immune', label: 'Immune Support', count: 560, children: [] },
      { id: 'womens', label: "Women's Health", count: 390, children: [] },
      { id: 'mens', label: "Men's Health", count: 340, children: [] },
      { id: 'baby-kids', label: 'Baby & Kids', count: 290, children: [] },
      { id: 'beauty', label: 'Beauty Supplements', count: 220, children: [] },
    ],
  },
  {
    id: 'travel-accessories',
    label: 'Travel Accessories',
    count: 320,
    children: [
      { id: 'cable-organizers', label: 'Cable Organizers', count: 90 },
      { id: 'travel-pouches', label: 'Travel Pouches', count: 110 },
      { id: 'storage-bags', label: 'Storage Bags', count: 70 },
      { id: 'travel-kits', label: 'Travel Kits', count: 50 },
    ],
  },
];

export const BRANDS = [
  'California Gold Nutrition',
  'NOW Foods',
  'Life Extension',
  'Thorne',
  "Doctor's Best",
  'Solgar',
  'MegaFood',
  "Nature's Way",
  'Jarrow Formulas',
  'Nordic Naturals',
  'Garden of Life',
  'Natrol',
  'NutriGold',
];

export const TYPES = [
  'Multivitamins',
  'Vitamin C',
  'Vitamin D',
  'Vitamin B Complex',
  'Magnesium',
  'Zinc',
  'Iron',
  'Calcium',
  'Probiotics',
  'Fish Oil / Omega-3',
  'CoQ10',
  'Collagen',
  'Creatine',
  'Ashwagandha',
  'Turmeric',
  'Elderberry',
  'Melatonin',
];

export const FORMS = ['Capsules', 'Tablets', 'Gummies', 'Powder', 'Liquid', 'Softgels', 'Chewables'];

export const DIETARY_OPTIONS = [
  'Vegan',
  'Vegetarian',
  'Gluten Free',
  'Dairy Free',
  'Non GMO',
  'Organic',
];

export const AVAILABILITY_OPTIONS = ['In Stock', 'Fast Delivery', 'New Arrival', 'Best Seller'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'most-reviewed', label: 'Most Reviewed' },
];

const IMGS = [
  '/Images/products/product-1.png',
  '/Images/products/product-2.png',
  '/Images/products/product-3.png',
  '/Images/products/product-4.png',
  '/Images/products/product-5.png',
  '/Images/products/product-6.png',
];
const img = (i: number) => IMGS[i % IMGS.length];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 101, title: "MegaFood Blood Builder Iron Supplement, 72 Tablets",
    brand: 'MegaFood', categoryId: 'iron', type: 'Iron', form: 'Tablets',
    dietary: ['Vegan', 'Gluten Free', 'Non GMO'], availability: ['In Stock', 'Best Seller'],
    rating: 4.7, reviewCount: 15997, price: '₹1,099', originalPrice: '₹1,450',
    priceValue: 1099, originalValue: 1450, image: img(0), badges: ['Best Seller'],
  },
  {
    id: 102, title: "Life Extension NAD+ Cell Regenerator, 300mg, 30 Capsules",
    brand: 'Life Extension', categoryId: 'multivitamins', type: 'Multivitamins', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 8200, price: '₹1,750', originalPrice: '₹2,350',
    priceValue: 1750, originalValue: 2350, image: img(1), badges: [],
  },
  {
    id: 103, title: "Jarrow Formulas Quercetin 500mg with Bromelain, 100 Capsules",
    brand: 'Jarrow Formulas', categoryId: 'immune', type: 'Elderberry', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Best Seller'],
    rating: 4.7, reviewCount: 5600, price: '₹1,900', originalPrice: '₹2,450',
    priceValue: 1900, originalValue: 2450, image: img(2), badges: ['Best Seller'],
  },
  {
    id: 104, title: "NutriGold Vitamin C Gold, Whole-Food Form, 240 Veggie Caps",
    brand: 'NutriGold', categoryId: 'vitamin-c', type: 'Vitamin C', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock'],
    rating: 4.8, reviewCount: 9800, price: '₹2,600', originalPrice: '₹3,100',
    priceValue: 2600, originalValue: 3100, image: img(3), badges: [],
  },
  {
    id: 105, title: "Solgar Zinc Picolinate 22mg, 100 Tablets",
    brand: 'Solgar', categoryId: 'zinc', type: 'Zinc', form: 'Tablets',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 11200, price: '₹2,300', originalPrice: '₹3,000',
    priceValue: 2300, originalValue: 3000, image: img(4), badges: [],
  },
  {
    id: 106, title: "Doctor's Best High Absorption Magnesium Glycinate, 240 Tablets",
    brand: "Doctor's Best", categoryId: 'magnesium', type: 'Magnesium', form: 'Tablets',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Best Seller'],
    rating: 4.8, reviewCount: 22000, price: '₹1,850', originalPrice: '₹2,600',
    priceValue: 1850, originalValue: 2600, image: img(5), badges: ['Best Seller'],
  },
  {
    id: 107, title: "California Gold Nutrition Creatine Monohydrate, Unflavored, 1000g",
    brand: 'California Gold Nutrition', categoryId: 'creatine', type: 'Creatine', form: 'Powder',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.7, reviewCount: 7800, price: '₹2,750', originalPrice: '₹3,300',
    priceValue: 2750, originalValue: 3300, image: img(6), badges: [],
  },
  {
    id: 108, title: "NOW Foods Vitamin D3 2000 IU, 240 Softgels",
    brand: 'NOW Foods', categoryId: 'vitamin-d', type: 'Vitamin D', form: 'Softgels',
    dietary: ['Non GMO'], availability: ['In Stock', 'Best Seller'],
    rating: 4.8, reviewCount: 31000, price: '₹899', originalPrice: '₹1,200',
    priceValue: 899, originalValue: 1200, image: img(7), badges: ['Best Seller'],
  },
  {
    id: 109, title: "Jarrow Formulas Jarro-Dophilus EPS Probiotics, 60 Caps",
    brand: 'Jarrow Formulas', categoryId: 'probiotics', type: 'Probiotics', form: 'Capsules',
    dietary: ['Vegan', 'Gluten Free'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.7, reviewCount: 12000, price: '₹2,400', originalPrice: '₹2,900',
    priceValue: 2400, originalValue: 2900, image: img(8), badges: [],
  },
  {
    id: 110, title: "Thorne Magnesium Bisglycinate Powder, 6.3 oz",
    brand: 'Thorne', categoryId: 'magnesium', type: 'Magnesium', form: 'Powder',
    dietary: ['Gluten Free'], availability: ['In Stock'],
    rating: 4.9, reviewCount: 8100, price: '₹3,200', originalPrice: '₹3,800',
    priceValue: 3200, originalValue: 3800, image: img(0), badges: [],
  },
  {
    id: 111, title: "Nature's Way Ashwagandha Root 470mg, 100 Veggie Caps",
    brand: "Nature's Way", categoryId: 'ashwagandha', type: 'Ashwagandha', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.6, reviewCount: 6700, price: '₹1,400', originalPrice: '₹1,900',
    priceValue: 1400, originalValue: 1900, image: img(1), badges: [],
  },
  {
    id: 112, title: "Nordic Naturals Ultimate Omega, 1280mg Omega-3, 120 Soft Gels",
    brand: 'Nordic Naturals', categoryId: 'vitamins', type: 'Fish Oil / Omega-3', form: 'Softgels',
    dietary: ['Non GMO'], availability: ['In Stock', 'Best Seller'],
    rating: 4.8, reviewCount: 18000, price: '₹2,900', originalPrice: '₹3,500',
    priceValue: 2900, originalValue: 3500, image: img(2), badges: ['Best Seller'],
  },
  {
    id: 113, title: "Garden of Life mykind Organics Women's Once Daily Multi, 60 Tablets",
    brand: 'Garden of Life', categoryId: 'multivitamins', type: 'Multivitamins', form: 'Tablets',
    dietary: ['Vegan', 'Organic', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 9200, price: '₹3,800', originalPrice: '₹4,500',
    priceValue: 3800, originalValue: 4500, image: img(3), badges: [],
  },
  {
    id: 114, title: "Natrol Melatonin Fast Dissolve Strawberry Gummies, 10mg, 60ct",
    brand: 'Natrol', categoryId: 'immune', type: 'Melatonin', form: 'Gummies',
    dietary: ['Vegan'], availability: ['In Stock', 'Fast Delivery', 'New Arrival'],
    rating: 4.5, reviewCount: 14000, price: '₹1,200', originalPrice: '₹1,600',
    priceValue: 1200, originalValue: 1600, image: img(4), badges: ['New Arrival'],
  },
  {
    id: 115, title: "Solgar Vitamin B-Complex with Vitamin C, 100 Tablets",
    brand: 'Solgar', categoryId: 'vitamin-b', type: 'Vitamin B Complex', form: 'Tablets',
    dietary: ['Non GMO'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 7800, price: '₹2,100', originalPrice: '₹2,700',
    priceValue: 2100, originalValue: 2700, image: img(5), badges: [],
  },
  {
    id: 116, title: "Doctor's Best NMN 12000 Nicotinamide Mononucleotide, 60 Caps",
    brand: "Doctor's Best", categoryId: 'vitamins', type: 'Multivitamins', form: 'Capsules',
    dietary: ['Vegan', 'Gluten Free', 'Non GMO'], availability: ['New Arrival'],
    rating: 4.6, reviewCount: 2100, price: '₹4,200', originalPrice: '₹5,000',
    priceValue: 4200, originalValue: 5000, image: img(6), badges: ['New Arrival'],
  },
  {
    id: 117, title: "NOW Foods Iron Complex with B12 & Folic Acid, 100 Veg Caps",
    brand: 'NOW Foods', categoryId: 'iron', type: 'Iron', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.5, reviewCount: 5600, price: '₹1,100', originalPrice: '₹1,450',
    priceValue: 1100, originalValue: 1450, image: img(7), badges: [],
  },
  {
    id: 118, title: "California Gold Nutrition Vitamin C Gummies, Wild Berry Flavored, 90ct",
    brand: 'California Gold Nutrition', categoryId: 'vitamin-c', type: 'Vitamin C', form: 'Gummies',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock'],
    rating: 4.6, reviewCount: 8900, price: '₹1,350', originalPrice: '₹1,700',
    priceValue: 1350, originalValue: 1700, image: img(8), badges: [],
  },
  {
    id: 119, title: "Thorne Vitamin D/K2 Liquid, 30 ml",
    brand: 'Thorne', categoryId: 'vitamin-d', type: 'Vitamin D', form: 'Liquid',
    dietary: ['Gluten Free'], availability: ['In Stock'],
    rating: 4.8, reviewCount: 7100, price: '₹2,800', originalPrice: '₹3,400',
    priceValue: 2800, originalValue: 3400, image: img(0), badges: [],
  },
  {
    id: 120, title: "Nordic Naturals Children's DHA Strawberry, 90 Count",
    brand: 'Nordic Naturals', categoryId: 'baby-kids', type: 'Fish Oil / Omega-3', form: 'Softgels',
    dietary: ['Non GMO'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.8, reviewCount: 11000, price: '₹2,200', originalPrice: '₹2,800',
    priceValue: 2200, originalValue: 2800, image: img(1), badges: [],
  },
  {
    id: 121, title: "Garden of Life Sport Organic Plant-Based Protein Chocolate, 840g",
    brand: 'Garden of Life', categoryId: 'protein', type: 'Creatine', form: 'Powder',
    dietary: ['Vegan', 'Organic', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.6, reviewCount: 5300, price: '₹4,500', originalPrice: '₹5,200',
    priceValue: 4500, originalValue: 5200, image: img(2), badges: [],
  },
  {
    id: 122, title: "Jarrow Formulas Turmeric 95 Curcuminoids, 500mg, 60 Caps",
    brand: 'Jarrow Formulas', categoryId: 'turmeric', type: 'Turmeric', form: 'Capsules',
    dietary: ['Vegan', 'Gluten Free', 'Non GMO'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 9300, price: '₹1,800', originalPrice: '₹2,300',
    priceValue: 1800, originalValue: 2300, image: img(3), badges: [],
  },
  {
    id: 123, title: "NOW Foods Probiotic-10 100 Billion, 30 Veg Capsules",
    brand: 'NOW Foods', categoryId: 'probiotics', type: 'Probiotics', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Best Seller'],
    rating: 4.7, reviewCount: 16000, price: '₹2,100', originalPrice: '₹2,600',
    priceValue: 2100, originalValue: 2600, image: img(4), badges: ['Best Seller'],
  },
  {
    id: 124, title: "Nature's Way Collagen + Berry Gummies with Vitamin C, 80ct",
    brand: "Nature's Way", categoryId: 'beauty', type: 'Collagen', form: 'Gummies',
    dietary: ['Non GMO'], availability: ['New Arrival'],
    rating: 4.5, reviewCount: 1800, price: '₹1,900', originalPrice: '₹2,400',
    priceValue: 1900, originalValue: 2400, image: img(5), badges: ['New Arrival'],
  },
  {
    id: 125, title: "MegaFood Women's One Daily Multi, 60 Tablets",
    brand: 'MegaFood', categoryId: 'womens', type: 'Multivitamins', form: 'Tablets',
    dietary: ['Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 7600, price: '₹3,100', originalPrice: '₹3,700',
    priceValue: 3100, originalValue: 3700, image: img(6), badges: [],
  },
  {
    id: 126, title: "Life Extension Super-Absorbable CoQ10 with d-Limonene, 60 Softgels",
    brand: 'Life Extension', categoryId: 'vitamins', type: 'CoQ10', form: 'Softgels',
    dietary: ['Gluten Free', 'Non GMO'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.8, reviewCount: 12000, price: '₹3,400', originalPrice: '₹4,100',
    priceValue: 3400, originalValue: 4100, image: img(7), badges: [],
  },
  {
    id: 127, title: "NOW Foods Ashwagandha 450mg, 90 Veg Capsules",
    brand: 'NOW Foods', categoryId: 'ashwagandha', type: 'Ashwagandha', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Best Seller'],
    rating: 4.6, reviewCount: 8700, price: '₹1,550', originalPrice: '₹2,000',
    priceValue: 1550, originalValue: 2000, image: img(8), badges: ['Best Seller'],
  },
  {
    id: 128, title: "Solgar Men's Multi Vitamin, 60 Tablets",
    brand: 'Solgar', categoryId: 'mens', type: 'Multivitamins', form: 'Tablets',
    dietary: ['Non GMO'], availability: ['In Stock'],
    rating: 4.6, reviewCount: 4200, price: '₹3,600', originalPrice: '₹4,200',
    priceValue: 3600, originalValue: 4200, image: img(0), badges: [],
  },
  {
    id: 129, title: "California Gold Nutrition Collagen Peptides Powder, Unflavored, 250g",
    brand: 'California Gold Nutrition', categoryId: 'beauty', type: 'Collagen', form: 'Powder',
    dietary: ['Non GMO'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.7, reviewCount: 6100, price: '₹2,300', originalPrice: '₹2,900',
    priceValue: 2300, originalValue: 2900, image: img(1), badges: [],
  },
  {
    id: 130, title: "Thorne Creatine Monohydrate, Micronized, 450g",
    brand: 'Thorne', categoryId: 'creatine', type: 'Creatine', form: 'Powder',
    dietary: ['Non GMO', 'Gluten Free'], availability: ['New Arrival'],
    rating: 4.8, reviewCount: 3200, price: '₹3,200', originalPrice: '₹3,900',
    priceValue: 3200, originalValue: 3900, image: img(2), badges: ['New Arrival'],
  },
  {
    id: 131, title: "Jarrow Formulas Immune Defense Pack, 30-Day Supply",
    brand: 'Jarrow Formulas', categoryId: 'immune', type: 'Elderberry', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.6, reviewCount: 5100, price: '₹2,500', originalPrice: '₹3,000',
    priceValue: 2500, originalValue: 3000, image: img(3), badges: [],
  },
  {
    id: 132, title: "Nature's Way Sambucus Elderberry Gummies, 60ct",
    brand: "Nature's Way", categoryId: 'immune', type: 'Elderberry', form: 'Gummies',
    dietary: ['Vegan', 'Non GMO'], availability: ['In Stock', 'Best Seller'],
    rating: 4.7, reviewCount: 9800, price: '₹1,750', originalPrice: '₹2,200',
    priceValue: 1750, originalValue: 2200, image: img(4), badges: ['Best Seller'],
  },
  {
    id: 133, title: "NutriGold Calcium Gold with Vitamins D3 + K2, 120 Veggie Caps",
    brand: 'NutriGold', categoryId: 'calcium', type: 'Calcium', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.7, reviewCount: 3900, price: '₹2,050', originalPrice: '₹2,600',
    priceValue: 2050, originalValue: 2600, image: img(5), badges: [],
  },
  {
    id: 134, title: "Life Extension Zinc Citrate 30mg, 90 Vegetarian Caps",
    brand: 'Life Extension', categoryId: 'zinc', type: 'Zinc', form: 'Capsules',
    dietary: ['Vegan', 'Non GMO', 'Gluten Free'], availability: ['In Stock', 'Best Seller'],
    rating: 4.7, reviewCount: 4500, price: '₹1,600', originalPrice: '₹2,000',
    priceValue: 1600, originalValue: 2000, image: img(6), badges: ['Best Seller'],
  },
  {
    id: 135, title: "Natrol Biotin 10,000mcg Maximum Strength, 100 Tablets",
    brand: 'Natrol', categoryId: 'beauty', type: 'Multivitamins', form: 'Tablets',
    dietary: ['Vegan'], availability: ['In Stock', 'Fast Delivery'],
    rating: 4.6, reviewCount: 21000, price: '₹1,450', originalPrice: '₹1,900',
    priceValue: 1450, originalValue: 1900, image: img(7), badges: [],
  },
  {
    id: 136, title: "Garden of Life Dr. Formulated Probiotic 50 Billion CFU, 30 Caps",
    brand: 'Garden of Life', categoryId: 'probiotics', type: 'Probiotics', form: 'Capsules',
    dietary: ['Vegan', 'Organic', 'Non GMO', 'Gluten Free'], availability: ['In Stock'],
    rating: 4.8, reviewCount: 13500, price: '₹3,600', originalPrice: '₹4,200',
    priceValue: 3600, originalValue: 4200, image: img(8), badges: [],
  },

  // ── Travel Accessories (drives the Travel PDP template) ──────────────────────
  {
    id: 901, title: 'FYY Electronic Organizer, Travel Cable Organizer Bag Pouch',
    brand: 'FYY', categoryId: 'cable-organizers', type: 'Travel', form: 'Pouch',
    dietary: [], availability: ['In Stock', 'Best Seller'],
    rating: 4.8, reviewCount: 8421, price: '₹1,299', originalPrice: '₹1,999',
    priceValue: 1299, originalValue: 1999, image: img(2), badges: ['Best Seller'],
  },
  {
    id: 902, title: 'BAGSMART Toiletry Bag, Hanging Travel Wash Pouch',
    brand: 'BAGSMART', categoryId: 'travel-pouches', type: 'Travel', form: 'Pouch',
    dietary: [], availability: ['In Stock'],
    rating: 4.7, reviewCount: 5210, price: '₹1,499', originalPrice: '₹2,200',
    priceValue: 1499, originalValue: 2200, image: img(4), badges: [],
  },
  {
    id: 903, title: 'Gonex Packing Cubes Set, 6-Piece Luggage Storage Bags',
    brand: 'Gonex', categoryId: 'storage-bags', type: 'Travel', form: 'Bag',
    dietary: [], availability: ['In Stock', 'New Arrival'],
    rating: 4.6, reviewCount: 3120, price: '₹1,799', originalPrice: '₹2,600',
    priceValue: 1799, originalValue: 2600, image: img(5), badges: ['New Arrival'],
  },
  {
    id: 904, title: 'Travel Essentials Kit, Compact Multi-Pocket Organizer',
    brand: 'Walherb', categoryId: 'travel-kits', type: 'Travel', form: 'Kit',
    dietary: [], availability: ['In Stock'],
    rating: 4.5, reviewCount: 1980, price: '₹999', originalPrice: '₹1,500',
    priceValue: 999, originalValue: 1500, image: img(0), badges: [],
  },
];

// Collect all IDs under a given category node (inclusive)
function collectIds(node: CategoryNode): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    for (const child of node.children) ids.push(...collectIds(child));
  }
  return ids;
}

export function getAllCategoryIds(id: string, tree: CategoryNode[] = CATEGORY_TREE): string[] {
  for (const node of tree) {
    if (node.id === id) return collectIds(node);
    if (node.children) {
      const found = getAllCategoryIds(id, node.children);
      if (found.length > 0) return found;
    }
  }
  return [id];
}

function findNode(id: string, tree: CategoryNode[]): CategoryNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

export function getCategoryById(id: string): CategoryNode | null {
  return findNode(id, CATEGORY_TREE);
}

export function getCategoryPath(id: string, tree: CategoryNode[] = CATEGORY_TREE, path: CategoryNode[] = []): CategoryNode[] {
  for (const node of tree) {
    const current = [...path, node];
    if (node.id === id) return current;
    if (node.children) {
      const found = getCategoryPath(id, node.children, current);
      if (found.length > 0) return found;
    }
  }
  return [];
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 6000;
