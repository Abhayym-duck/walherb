// ─────────────────────────────────────────────────────────────────────────────
// SEO — JSON-LD structured-data builders
//
// Pure functions that turn a ProductDetail into schema.org objects. The shell
// feeds the result to `useJsonLd`, which injects them into <head>. Kept pure so
// they're trivially unit-testable and free of DOM concerns.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductDetail } from './types';

const num = (s: string) => Number(s.replace(/[^0-9.]/g, '')) || 0;

/** schema.org/Product including offers + aggregateRating. */
export function buildProductSchema(d: ProductDetail) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: d.title,
    image: d.gallery,
    brand: { '@type': 'Brand', name: d.brand },
    sku: `WLH-${d.id}`,
    aggregateRating: d.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: d.rating,
          reviewCount: d.reviewCount,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: num(d.pricing.price),
      availability: 'https://schema.org/InStock',
    },
  };
}

/** schema.org/Review list (omitted when there are no reviews). */
export function buildReviewSchema(d: ProductDetail) {
  if (!d.reviews?.length) return null;
  return d.reviews.map((r) => ({
    '@context': 'https://schema.org/',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: d.title },
    author: { '@type': 'Person', name: r.name },
    reviewRating: { '@type': 'Rating', ratingValue: r.stars, bestRating: 5 },
    reviewBody: r.text,
  }));
}

/** schema.org/BreadcrumbList from the product's breadcrumb trail. */
export function buildBreadcrumbSchema(d: ProductDetail) {
  const trail = [...d.breadcrumbs, d.title];
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((name, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
    })),
  };
}

/** schema.org/FAQPage (omitted when the product has no FAQs). */
export function buildFaqSchema(d: ProductDetail) {
  if (!d.faqs?.length) return null;
  return {
    '@context': 'https://schema.org/',
    '@type': 'FAQPage',
    mainEntity: d.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** All JSON-LD objects for a product, with empties dropped. */
export function buildAllSchemas(d: ProductDetail): object[] {
  return [
    buildProductSchema(d),
    buildBreadcrumbSchema(d),
    buildReviewSchema(d),
    buildFaqSchema(d),
  ]
    .flat()
    .filter(Boolean) as object[];
}
