import type { NavMegaMenu, MenuGroup, MenuSubItem } from './types';

/** Department-level display names, keyed by mega-menu id. */
export const DEPARTMENT_LABELS: Record<string, string> = {
  supplements: 'Supplements',
  sports: 'Sports',
  bath: 'Bath & Personal Care',
  beauty: 'Beauty',
  'baby-kids': 'Baby & Kids',
  pets: 'Pets',
};

export const MEGA_MENUS: NavMegaMenu[] = [
  // ─── Supplements ───────────────────────────────────────────────────────────
  {
    id: 'supplements',
    columnCount: 5,
    shopAllLabel: 'Shop all Supplements',
    shopAllCategoryId: 'supplements',
    columns: [
      {
        groups: [
          {
            id: 'amino-acids', label: 'Amino Acids',
            items: [
              { id: 'amino-acid-blends', label: 'Amino Acid Blends' },
              { id: 'l-arginine', label: 'L-Arginine' },
              { id: 'l-theanine', label: 'L-Theanine' },
            ],
          },
          {
            id: 'antioxidants', label: 'Antioxidants',
            items: [
              { id: 'alpha-lipoic-acid', label: 'Alpha Lipoic Acid' },
              { id: 'astaxanthin', label: 'Astaxanthin' },
              { id: 'coq10', label: 'CoQ10' },
              { id: 'glutathione', label: 'Glutathione' },
              { id: 'lutein-zeaxanthin', label: 'Lutein & Zeaxanthin' },
              { id: 'nac', label: 'NAC' },
              { id: 'resveratrol', label: 'Resveratrol' },
              { id: 'turmeric-curcumin', label: 'Turmeric & Curcumin' },
            ],
          },
          { id: 'bee-products', label: 'Bee Products' },
        ],
      },
      {
        groups: [
          {
            id: 'bone-joint-cartilage', label: 'Bone, Joint & Cartilage',
            items: [
              { id: 'collagen-supplements', label: 'Collagen Supplements' },
              { id: 'glucosamine', label: 'Glucosamine' },
            ],
          },
          {
            id: 'brain-cognitive', label: 'Brain & Cognitive',
            items: [
              { id: 'creatine-bc', label: 'Creatine' },
              { id: 'nad-plus', label: 'NAD+' },
              { id: 'nmn', label: 'NMN' },
            ],
          },
          { id: 'detox-cleanse', label: 'Detox & Cleanse' },
          {
            id: 'fish-oils-omegas', label: 'Fish Oils & Omegas',
            items: [
              { id: 'krill-oil', label: 'Krill Oil' },
              { id: 'omega-3-fish-oil', label: 'Omega-3 Fish Oil' },
            ],
          },
          { id: 'greens-superfoods', label: 'Greens & Superfoods' },
        ],
      },
      {
        groups: [
          {
            id: 'gut-health', label: 'Gut Health',
            items: [
              { id: 'digestive-enzymes', label: 'Digestive Enzymes' },
              { id: 'fibre', label: 'Fibre' },
              { id: 'intestinal-formulas', label: 'Intestinal Formulas' },
              { id: 'probiotics', label: 'Probiotics' },
            ],
          },
          { id: 'hair-skin-nails', label: 'Hair, Skin & Nails' },
          {
            id: 'herbs', label: 'Herbs',
            items: [
              { id: 'adaptogens', label: 'Adaptogens' },
              { id: 'ashwagandha', label: 'Ashwagandha' },
              { id: 'berberine', label: 'Berberine' },
              { id: 'elderberry', label: 'Elderberry' },
              { id: 'herbal-formulas', label: 'Herbal Formulas' },
              { id: 'maca', label: 'Maca' },
              { id: 'milk-thistle', label: 'Milk Thistle' },
            ],
          },
        ],
      },
      {
        groups: [
          { id: 'mens-health', label: "Men's Health" },
          {
            id: 'minerals', label: 'Minerals',
            items: [
              { id: 'calcium', label: 'Calcium' },
              { id: 'iron', label: 'Iron' },
              { id: 'magnesium', label: 'Magnesium' },
              { id: 'sea-moss', label: 'Sea Moss' },
              { id: 'zinc', label: 'Zinc' },
            ],
          },
          {
            id: 'mushrooms', label: 'Mushrooms',
            items: [
              { id: 'lions-mane', label: "Lion's Mane" },
              { id: 'reishi', label: 'Reishi' },
            ],
          },
          { id: 'offal', label: 'Offal' },
          { id: 'phospholipids', label: 'Phospholipids' },
          { id: 'professional-brands', label: 'Professional Brands' },
        ],
      },
      {
        groups: [
          { id: 'sleep', label: 'Sleep' },
          {
            id: 'vitamins', label: 'Vitamins',
            items: [
              { id: 'multivitamins', label: 'Multivitamins' },
              { id: 'vitamin-a', label: 'Vitamin A' },
              { id: 'vitamin-b', label: 'Vitamin B' },
              { id: 'vitamin-c', label: 'Vitamin C' },
              { id: 'vitamin-d', label: 'Vitamin D' },
              { id: 'vitamin-e', label: 'Vitamin E' },
              { id: 'vitamin-k', label: 'Vitamin K' },
            ],
          },
          { id: 'weight-management', label: 'Weight Management' },
          { id: 'womens-health', label: "Women's Health" },
        ],
      },
    ],
  },

  // ─── Sports ────────────────────────────────────────────────────────────────
  {
    id: 'sports',
    columnCount: 5,
    shopAllLabel: 'Shop all Sports',
    shopAllCategoryId: 'sports',
    columns: [
      {
        groups: [
          {
            id: 'sports-amino-acids', label: 'Amino Acids',
            items: [
              { id: 'bcaas', label: 'BCAAs' },
              { id: 'eaa', label: 'Essential Amino Acids (EAA)' },
              { id: 'l-carnitine', label: 'L-Carnitine' },
              { id: 'l-glutamine', label: 'L-Glutamine' },
              { id: 'l-taurine', label: 'L-Taurine' },
            ],
          },
          {
            id: 'creatine', label: 'Creatine',
            items: [
              { id: 'buffered-creatine', label: 'Buffered Creatine' },
              { id: 'creatine-monohydrate', label: 'Creatine Monohydrate' },
              { id: 'creatine-hcl', label: 'Creatine HCl' },
            ],
          },
        ],
      },
      {
        groups: [
          { id: 'electrolytes-hydration', label: 'Electrolytes & Hydration' },
          {
            id: 'fitness-accessories', label: 'Fitness Accessories',
            items: [
              { id: 'shaker-bottles', label: 'Shaker Bottles' },
              { id: 'water-bottles', label: 'Water Bottles' },
              { id: 'waist-belts', label: 'Waist Belts' },
            ],
          },
          {
            id: 'muscle-recovery', label: 'Muscle Recovery Supplements',
            items: [
              { id: 'carbohydrate-powders', label: 'Carbohydrate Powders' },
              { id: 'hmb', label: 'HMB' },
              { id: 'zma', label: 'Zinc Magnesium Aspartate' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'nitric-oxide', label: 'Nitric Oxide Supplements',
            items: [
              { id: 'beetroot', label: 'Beetroot' },
              { id: 'citrulline-malate', label: 'Citrulline Malate' },
              { id: 'l-arginine-sports', label: 'L-Arginine' },
              { id: 'l-arginine-citrulline', label: 'L-Arginine L-Citrulline Complex' },
              { id: 'l-citrulline', label: 'L-Citrulline' },
            ],
          },
          {
            id: 'pre-workout', label: 'Pre-Workout Supplements',
            items: [
              { id: 'caffeine', label: 'Caffeine' },
              { id: 'non-stim-preworkout', label: 'Non-Stimulant Pre-Workout' },
              { id: 'stim-preworkout', label: 'Stimulant Pre-Workout' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'protein', label: 'Protein',
            items: [
              { id: 'casein-protein', label: 'Casein Protein' },
              { id: 'weight-gainers', label: 'Weight Gainers' },
              { id: 'meal-replacements', label: 'Meal Replacements' },
              { id: 'plant-based-protein', label: 'Plant-Based Protein' },
              { id: 'ready-to-drink', label: 'Ready-to-Drink Protein' },
              { id: 'whey-protein', label: 'Whey Protein' },
            ],
          },
          {
            id: 'sports-bars-snacks', label: 'Sports Bars & Snacks',
            items: [
              { id: 'protein-bars', label: 'Protein Bars' },
              { id: 'protein-snacks', label: 'Protein Snacks' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'sports-supplements', label: 'Sports Supplements',
            items: [
              { id: 'fat-burners', label: 'Fat Burners' },
              { id: 'sports-fish-oil', label: 'Sports Fish Oil & Omegas' },
              { id: 'sports-multivitamins', label: 'Sports Multivitamins' },
            ],
          },
        ],
      },
    ],
  },

  // ─── Bath ──────────────────────────────────────────────────────────────────
  {
    id: 'bath',
    columnCount: 5,
    shopAllLabel: 'Shop all Bath & Personal Care',
    shopAllCategoryId: 'supplements',
    columns: [
      {
        groups: [
          {
            id: 'bath-shower', label: 'Bath & Shower',
            items: [
              { id: 'bar-soap', label: 'Bar Soap' },
              { id: 'bath-soaks', label: 'Bath Soaks' },
              { id: 'body-scrubs', label: 'Body Scrubs' },
              { id: 'body-wash', label: 'Body Wash & Shower Gel' },
            ],
          },
          {
            id: 'body-care', label: 'Body Care',
            items: [
              { id: 'body-massage-oils', label: 'Body & Massage Oils' },
              { id: 'hand-cream', label: 'Hand Cream' },
              { id: 'lotion', label: 'Lotion' },
              { id: 'self-tan', label: 'Self-Tan' },
              { id: 'skincare-treatments', label: 'Skincare Treatments' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'essential-oils', label: 'Essential Oils & Aromatherapy',
            items: [
              { id: 'essential-oil-blends', label: 'Essential Oil Blends' },
              { id: 'essential-oil-diffusers', label: 'Essential Oil Diffusers' },
              { id: 'essential-oil-sets', label: 'Essential Oil Sets' },
              { id: 'essential-oil-spray', label: 'Essential Oil Spray' },
              { id: 'single-essential-oils', label: 'Single Essential Oils' },
            ],
          },
          { id: 'eye-care', label: 'Eye Care', items: [{ id: 'eye-drops', label: 'Eye Drops' }] },
          { id: 'foot-care', label: 'Foot Care', items: [{ id: 'foot-cream', label: 'Foot Cream & Treatments' }] },
        ],
      },
      {
        groups: [
          {
            id: 'hair-care', label: 'Hair Care',
            items: [
              { id: 'conditioner', label: 'Conditioner' },
              { id: 'detangler', label: 'Detangler' },
              { id: 'hair-accessories', label: 'Hair Accessories' },
              { id: 'hair-colour', label: 'Hair Colour' },
              { id: 'hair-styling', label: 'Hair Styling' },
              { id: 'hair-treatments', label: 'Hair Treatments' },
              { id: 'k-beauty-hair', label: 'K-Beauty Hair Care' },
              { id: 'shampoo', label: 'Shampoo' },
            ],
          },
          { id: 'lip-care', label: 'Lip Care', items: [{ id: 'lip-balm', label: 'Lip Balm' }] },
        ],
      },
      {
        groups: [
          {
            id: 'medicine-cabinet', label: 'Medicine Cabinet',
            items: [
              { id: 'allergy-nasal', label: 'Allergy, Sinus & Nasal Care' },
              { id: 'first-aid', label: 'First Aid & Plasters' },
              { id: 'homeopathy', label: 'Homeopathy' },
              { id: 'sore-throat', label: 'Sore Throat & Cough Lozenges' },
            ],
          },
          { id: 'mens-grooming', label: "Men's Grooming" },
          {
            id: 'oral-care', label: 'Oral Care',
            items: [
              { id: 'teeth-whitening', label: 'Teeth Whitening Strips' },
              { id: 'toothpaste', label: 'Toothpaste' },
              { id: 'mouthwash', label: 'Mouthwash, Rinse & Spray' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'personal-care', label: 'Personal Care',
            items: [
              { id: 'deodorant', label: 'Deodorant' },
              { id: 'period-care', label: 'Period Care & Feminine' },
              { id: 'hygiene', label: 'Hygiene' },
              { id: 'shaving', label: 'Shaving & Hair Removal' },
            ],
          },
          {
            id: 'sunscreen-bath', label: 'Sunscreen',
            items: [
              { id: 'baby-kids-sunscreen', label: 'Baby & Kids Sunscreen' },
              { id: 'face-sunscreen', label: 'Face Sunscreen' },
              { id: 'k-beauty-sunscreen', label: 'K-Beauty Sunscreen' },
            ],
          },
        ],
      },
    ],
  },

  // ─── Beauty ────────────────────────────────────────────────────────────────
  {
    id: 'beauty',
    columnCount: 5,
    shopAllLabel: 'Shop all Beauty',
    shopAllCategoryId: 'beauty',
    columns: [
      {
        groups: [
          {
            id: 'beauty-by-ingredient', label: 'Beauty by Ingredient',
            items: [
              { id: 'centella', label: 'Centella' },
              { id: 'ceramides', label: 'Ceramides' },
              { id: 'coconut', label: 'Coconut' },
              { id: 'collagen-beauty', label: 'Collagen' },
              { id: 'glycolic-acid', label: 'Glycolic Acid' },
              { id: 'hyaluronic-acid', label: 'Hyaluronic Acid' },
              { id: 'niacinamide', label: 'Niacinamide' },
              { id: 'retinol', label: 'Retinol' },
              { id: 'rice', label: 'Rice' },
              { id: 'salicylic-acid', label: 'Salicylic Acid' },
              { id: 'vitamin-c-beauty', label: 'Vitamin C' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'beauty-face-masks', label: 'Beauty Face Masks',
            items: [
              { id: 'eye-masks', label: 'Eye Masks' },
              { id: 'lip-masks', label: 'Lip Masks' },
              { id: 'spot-patches', label: 'Spot Patches' },
              { id: 'sheet-masks', label: 'Sheet Masks' },
              { id: 'wash-off-face-masks', label: 'Wash-off Face Masks' },
            ],
          },
          {
            id: 'cleansers', label: 'Cleansers',
            items: [
              { id: 'face-scrubs', label: 'Face Scrubs & Exfoliators' },
              { id: 'face-washes', label: 'Face Washes' },
              { id: 'face-wipes', label: 'Face Wipes & Towelettes' },
              { id: 'toners', label: 'Toners' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'face-moisturisers', label: 'Face Moisturisers',
            items: [
              { id: 'eye-creams', label: 'Eye Creams' },
              { id: 'face-mist', label: 'Face Mist' },
              { id: 'face-oils', label: 'Face Oils' },
              { id: 'night-moisturisers', label: 'Night Moisturisers & Creams' },
            ],
          },
          {
            id: 'k-beauty', label: 'K-Beauty',
            items: [
              { id: 'k-beauty-cleansers', label: 'K-Beauty Cleansers' },
              { id: 'k-beauty-face-masks', label: 'K-Beauty Face Masks' },
              { id: 'k-beauty-toners', label: 'K-Beauty Toners' },
              { id: 'k-beauty-moisturisers', label: 'K-Beauty Moisturisers' },
              { id: 'k-beauty-treatments', label: 'K-Beauty Treatments & Serums' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'makeup', label: 'Makeup',
            items: [
              { id: 'makeup-eyes', label: 'Eyes' },
              { id: 'makeup-face', label: 'Face' },
              { id: 'makeup-lips', label: 'Lips' },
              { id: 'makeup-removers', label: 'Makeup Removers' },
              { id: 'makeup-nails', label: 'Nails' },
            ],
          },
          {
            id: 'makeup-accessories', label: 'Makeup Accessories',
            items: [
              { id: 'makeup-brushes', label: 'Makeup Brushes' },
              { id: 'makeup-tools', label: 'Makeup Tools' },
            ],
          },
          { id: 'makeup-skincare-gifts', label: 'Makeup & Skincare Gifts' },
        ],
      },
      {
        groups: [
          {
            id: 'sunscreen-beauty', label: 'Sunscreen',
            items: [
              { id: 'baby-kids-sunscreen-b', label: 'Baby & Kids Sunscreen' },
              { id: 'face-sunscreen-b', label: 'Face Sunscreen' },
              { id: 'k-beauty-sunscreen-b', label: 'K-Beauty Sunscreen' },
            ],
          },
          {
            id: 'treatments-serums', label: 'Treatments & Serums',
            items: [
              { id: 'acne-blemish', label: 'Acne & Blemish Treatments' },
              { id: 'anti-ageing', label: 'Anti-Ageing & Firming' },
              { id: 'serums', label: 'Serums' },
              { id: 'hydrating-serums', label: 'Hydrating Serums' },
              { id: 'vitamin-c-serums', label: 'Vitamin C Serums' },
            ],
          },
        ],
      },
    ],
  },

  // ─── Baby & Kids ───────────────────────────────────────────────────────────
  {
    id: 'baby-kids',
    columnCount: 3,
    shopAllLabel: 'Shop all Baby & Kids',
    shopAllCategoryId: 'baby-kids',
    columns: [
      {
        groups: [
          { id: 'baby-care', label: 'Baby Care' },
          { id: 'baby-formula', label: 'Baby Formula' },
          { id: 'baby-food-drinks', label: 'Baby Food & Drinks' },
        ],
      },
      {
        groups: [
          {
            id: 'baby-vitamins', label: 'Baby Vitamins & Supplements',
            items: [
              { id: 'baby-multivitamins', label: 'Baby Multivitamins' },
              { id: 'baby-omega3', label: 'Baby Omega-3' },
              { id: 'infant-probiotics', label: 'Infant Probiotics' },
            ],
          },
          {
            id: 'childrens-health', label: "Children's Health",
            items: [
              { id: 'kids-cold-flu', label: "Kids' Cold & Flu" },
              { id: 'kids-immunity', label: "Kids' Immunity" },
            ],
          },
        ],
      },
      {
        groups: [
          { id: 'kids-multivitamins', label: "Kids' Multivitamins" },
          { id: 'omega3-kids', label: 'Omega-3 for Kids' },
          { id: 'probiotics-kids', label: 'Probiotics for Kids' },
        ],
      },
    ],
  },

  // ─── Pets ──────────────────────────────────────────────────────────────────
  {
    id: 'pets',
    columnCount: 3,
    shopAllLabel: 'Shop all Pets',
    shopAllCategoryId: 'supplements',
    columns: [
      {
        groups: [
          {
            id: 'pet-grooming', label: 'Pet Grooming',
            items: [
              { id: 'cat-grooming', label: 'Cat Grooming' },
              { id: 'dog-grooming', label: 'Dog Grooming' },
            ],
          },
          {
            id: 'pet-supplements', label: 'Pet Supplements',
            items: [
              { id: 'cat-supplements', label: 'Cat Supplements' },
              { id: 'dog-supplements', label: 'Dog Supplements' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'pet-supplies', label: 'Pet Supplies',
            items: [
              { id: 'pet-stain-removers', label: 'Pet Stain & Odour Removers' },
              { id: 'dog-waste-bags', label: 'Dog Waste Bags & Training Pads' },
            ],
          },
          {
            id: 'pet-food-treats', label: 'Pet Food & Treats',
            items: [
              { id: 'cat-treats', label: 'Cat Treats' },
              { id: 'dog-treats', label: 'Dog Treats' },
            ],
          },
        ],
      },
      {
        groups: [
          {
            id: 'pet-health', label: 'Pet Health',
            items: [
              { id: 'cat-treatments', label: 'Cat Treatments & Remedies' },
              { id: 'dog-treatments', label: 'Dog Treatments & Remedies' },
            ],
          },
          { id: 'pet-toys', label: 'Pet Toys', items: [{ id: 'dog-toys', label: 'Dog Toys' }] },
        ],
      },
    ],
  },
];

// ─── Derived: All Categories ──────────────────────────────────────────────────
// Everything below is generated from MEGA_MENUS above so the "All Categories"
// mega menu and the mobile drawer stay in sync automatically — no duplicated data.

const ALL_CATEGORIES_ID = 'all-categories';
/** Max sub-categories shown per department block in the desktop mega menu. */
const ALL_CATEGORIES_ITEM_CAP = 8;

const departmentLabel = (id: string) => DEPARTMENT_LABELS[id] ?? id;

/** Flatten a department's columns → its full ordered list of top-level groups. */
export function getDepartmentGroups(menu: NavMegaMenu): MenuSubItem[] {
  return menu.columns.flatMap(col => col.groups.map(g => ({ id: g.id, label: g.label })));
}

export interface DepartmentNav {
  id: string;
  label: string;
  groups: MenuSubItem[];
}

// ─── Extra marketplace sections ───────────────────────────────────────────────
// Non-category shopping destinations (Brands, Health Goals, Deals). These are not
// product categories, so they aren't part of MEGA_MENUS — defined once here and
// consumed by both the desktop hub and the mobile drawer.
export const EXTRA_SECTIONS: DepartmentNav[] = [
  {
    id: 'brands', label: 'Brands',
    groups: [
      { id: 'shop-by-brand', label: 'Shop by Brand' },
      { id: 'popular-brands', label: 'Popular Brands' },
      { id: 'featured-brands', label: 'Featured Brands' },
      { id: 'new-brands', label: 'New to Walherb' },
    ],
  },
  {
    id: 'health-goals', label: 'Health Goals',
    groups: [
      { id: 'goal-immunity', label: 'Immunity' },
      { id: 'goal-sleep', label: 'Sleep' },
      { id: 'goal-energy', label: 'Energy' },
      { id: 'goal-heart-health', label: 'Heart Health' },
      { id: 'goal-digestion', label: 'Digestion' },
      { id: 'goal-weight-management', label: 'Weight Management' },
      { id: 'goal-stress-relief', label: 'Stress Relief' },
      { id: 'goal-joint-support', label: 'Joint Support' },
    ],
  },
  {
    id: 'deals', label: 'Deals & Offers',
    groups: [
      { id: 'new-arrivals', label: 'New Arrivals' },
      { id: 'best-sellers', label: 'Best Sellers' },
      { id: 'buy-one-get-one', label: 'Buy One Get One' },
      { id: 'on-sale', label: 'On Sale' },
      { id: 'clearance', label: 'Clearance' },
    ],
  },
];

/** Department list used by the mobile accordion drawer (full hierarchy). */
export const DEPARTMENTS: DepartmentNav[] = MEGA_MENUS.map(menu => ({
  id: menu.id,
  label: departmentLabel(menu.id),
  groups: getDepartmentGroups(menu),
}));

/**
 * Every section that appears under "All Categories" — product departments first,
 * then the extra marketplace destinations. Used by the mobile accordion drawer.
 */
export const ALL_CATEGORIES_SECTIONS: DepartmentNav[] = [
  ...DEPARTMENTS,
  ...EXTRA_SECTIONS,
];

const sectionToGroup = (section: DepartmentNav, cap?: number): MenuGroup => ({
  id: section.id,
  label: section.label,
  items: cap ? section.groups.slice(0, cap) : section.groups,
  viewAllLabel: `View All ${section.label}`,
  viewAllCategoryId: section.id,
});

/** Wide, flowing marketplace hub — one block per department + extra section. */
function buildAllCategoriesMenu(): NavMegaMenu {
  return {
    id: ALL_CATEGORIES_ID,
    layout: 'flow',
    columns: [{
      groups: [
        ...DEPARTMENTS.map(d => sectionToGroup(d, ALL_CATEGORIES_ITEM_CAP)),
        ...EXTRA_SECTIONS.map(s => sectionToGroup(s)),
      ],
    }],
  };
}

export const ALL_CATEGORIES_MENU = buildAllCategoriesMenu();

export const MEGA_MENU_MAP = new Map<string, NavMegaMenu>(
  [...MEGA_MENUS, ALL_CATEGORIES_MENU].map(m => [m.id, m]),
);
