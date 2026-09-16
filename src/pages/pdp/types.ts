// ─────────────────────────────────────────────────────────────────────────────
// PDP data contract
//
// A single scalable schema that drives every Product Detail Page. The shell +
// common sections read the top-level fields; category-specific content lives in
// the discriminated `categoryAttributes` union. Every optional field that is
// absent causes its section to render nothing (see empty-state handling in the
// section components), so new categories never require touching the core.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from '../../components/home/ProductCard';
import type { PackageOption } from '../../components/Product/ProductPurchasePanel/ProductPurchasePanel';

export type { PackageOption };

/** The set of PDP templates. Adding a category = extend this + add a registry entry. */
export type ProductCategory =
  | 'SUPPLEMENT'
  | 'SPORTS'
  | 'BEAUTY'
  | 'BABY'
  | 'PETS'
  | 'TRAVEL_ACCESSORIES'
  | 'PERSONAL_CARE'
  | 'GENERAL';

// ─── Shared value objects ────────────────────────────────────────────────────

export interface Pricing {
  price: string;
  originalPrice: string;
  priceValue: number;
  originalValue: number;
}

/** Label / value row used by every spec-style table (Specifications, Dimensions, Nutrition…). */
export interface SpecRow {
  label: string;
  value: string;
}

/** Titled paragraph used by generic info sections (Benefits, Safety, How To Use…). */
export interface InfoBlock {
  title: string;
  body: string;
}

/** Short feature with optional supporting copy (supplement "Description" checklist, travel highlights). */
export interface FeatureItem {
  title: string;
  desc?: string;
}

export interface ColorVariant {
  /** Display name, e.g. "Forest Green". */
  name: string;
  /** CSS color or hex for the swatch fill. */
  swatch: string;
  /** Optional swatch image (overrides the solid fill when present). */
  image?: string;
}

export interface SizeVariant {
  label: string;
  /** Optional per-size price override; falls back to the product pricing. */
  pricing?: Pricing;
  inventory?: number;
  sku?: string;
}

export interface Review {
  name: string;
  stars: number;
  date?: string;
  text: string;
}

export interface RatingBar {
  star: number;
  pct: number;
}

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceItem {
  /** Key into the shared service-icon map (see sections/common). */
  icon: ServiceIconKey;
  title: string;
  desc: string;
}

export type ServiceIconKey =
  | 'shipping'
  | 'authentic'
  | 'duties'
  | 'payments'
  | 'delivery'
  | 'returns';

// ─── Category attribute unions (discriminated by `category`) ──────────────────

export interface SupplementAttributes {
  /** Bespoke supplement "Description" feature checklist. */
  features?: FeatureItem[];
  /** "Important Information" titled blocks (Safety, Ingredients, Directions, Legal…). */
  importantInfo?: InfoBlock[];
  ingredients?: string;
  supplementFacts?: SpecRow[];
  dosage?: string;
  certifications?: string[];
  legalDisclaimer?: string;
}

export interface SportsAttributes {
  nutritionFacts?: SpecRow[];
  aminoAcidProfile?: SpecRow[];
  proteinContent?: string;
  workoutGuide?: InfoBlock[];
  ingredients?: string;
  certifications?: string[];
  performanceBenefits?: FeatureItem[];
  storage?: string;
}

export interface BeautyAttributes {
  ingredients?: string;
  skinTypes?: string[];
  hairTypes?: string[];
  benefits?: FeatureItem[];
  howToUse?: InfoBlock[];
  safetyWarnings?: string;
  expiry?: string;
  certifications?: string[];
}

export interface BabyAttributes {
  recommendedAge?: string;
  ingredients?: string;
  material?: string;
  usage?: InfoBlock[];
  careInstructions?: InfoBlock[];
  safetyCertifications?: string[];
  warnings?: string;
}

export interface PetsAttributes {
  petType?: string;
  breedSize?: string;
  ingredients?: string;
  feedingGuide?: InfoBlock[];
  nutrition?: SpecRow[];
  storage?: string;
  safety?: string;
}

export interface TravelAttributes {
  featureHighlights?: FeatureItem[];
  dimensions?: string;
  weight?: string;
  material?: string;
  packageContents?: string[];
}

export interface PersonalCareAttributes {
  ingredients?: string;
  benefits?: FeatureItem[];
  howToUse?: InfoBlock[];
  safety?: string;
  certifications?: string[];
}

export interface GeneralAttributes {
  features?: FeatureItem[];
  dimensions?: string;
  material?: string;
  warranty?: string;
}

/** Discriminated union so each template gets typed access to its own attributes. */
export type CategoryAttributes =
  | ({ category: 'SUPPLEMENT' } & SupplementAttributes)
  | ({ category: 'SPORTS' } & SportsAttributes)
  | ({ category: 'BEAUTY' } & BeautyAttributes)
  | ({ category: 'BABY' } & BabyAttributes)
  | ({ category: 'PETS' } & PetsAttributes)
  | ({ category: 'TRAVEL_ACCESSORIES' } & TravelAttributes)
  | ({ category: 'PERSONAL_CARE' } & PersonalCareAttributes)
  | ({ category: 'GENERAL' } & GeneralAttributes);

// ─── The product detail aggregate ────────────────────────────────────────────

export interface ProductDetail {
  id: number;
  title: string;
  brand: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;

  /** [main, ...thumbnails] — first entry is the hero image. */
  gallery: string[];
  pricing: Pricing;

  breadcrumbs: string[];

  /** Supplement "Package Count" options; absent for products without packs. */
  packages?: PackageOption[];
  /** Interactive variant selectors (travel = colors + sizes). */
  variants?: { colors?: ColorVariant[]; sizes?: SizeVariant[] };

  /** Short spec list shown inside the hero ("Details" on supplement). */
  heroSpecs?: SpecRow[];
  /** Generic label/value specs shown by every template that has them. */
  specifications?: SpecRow[];
  /** Secondary spec table ("Product Details" on supplement). */
  productDetails?: SpecRow[];
  /** Stacked, lazy-loaded description banners. */
  descriptionImages?: string[];

  reviews?: Review[];
  ratingBars?: RatingBar[];
  faqs?: Faq[];
  services?: ServiceItem[];

  related?: Product[];
  alsoBought?: Product[];

  categoryAttributes: CategoryAttributes;
}

/** Tracks the user's hero selections; the shell derives the active PackageOption from it. */
export interface PdpSelection {
  pkgIdx: number;
  colorIdx: number;
  sizeIdx: number;
}
