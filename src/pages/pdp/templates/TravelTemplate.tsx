'use client';

// ─────────────────────────────────────────────────────────────────────────────
// TravelTemplate — Travel Accessories PDP (Figma node 250-3309).
// Color/size variants in the hero, feature highlights, lifestyle description
// images, spec-based info (dimensions / material / weight / package contents),
// reviews and FAQ. Deliberately omits supplement facts, dosage and legal-medical
// disclaimers (acceptance #3 / #4).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Box from '@mui/material/Box';

import {
  ProductGallery, RelatedProductsCarousel, ProductDescriptionImages,
  ServicesSection, ReviewsSection, FaqAccordion,
} from '../sections/common';
import { FeatureChecklist, SpecTable, BulletList } from '../sections/category';
import { GenericHeroInfo } from './GenericHeroInfo';
import type { TemplateProps } from './types';
import type { SpecRow } from '../types';

export default function TravelTemplate({ detail, selection, onSelect, onProductClick, mobilePurchase }: TemplateProps) {
  const attrs = detail.categoryAttributes.category === 'TRAVEL_ACCESSORIES' ? detail.categoryAttributes : undefined;

  // Compose dimension/material/weight strings into a single spec table.
  const physicalSpecs: SpecRow[] = [
    attrs?.dimensions ? { label: 'Dimensions', value: attrs.dimensions } : null,
    attrs?.weight ? { label: 'Weight', value: attrs.weight } : null,
    attrs?.material ? { label: 'Material', value: attrs.material } : null,
  ].filter(Boolean) as SpecRow[];

  return (
    <>
      {/* Hero */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px', alignItems: 'flex-start' }}>
        <ProductGallery images={detail.gallery} />
        <GenericHeroInfo detail={detail} selection={selection} onSelect={onSelect} />
      </Box>

      {mobilePurchase}

      <FeatureChecklist title="Product Features" features={attrs?.featureHighlights} />
      {detail.related?.length ? <RelatedProductsCarousel title="Frequently Bought Together" products={detail.related} onProductClick={onProductClick} /> : null}
      {detail.descriptionImages?.length ? <ProductDescriptionImages images={detail.descriptionImages} /> : null}
      <SpecTable title="Specifications" rows={detail.specifications} />
      <SpecTable title="Dimensions & Material" rows={physicalSpecs} />
      <BulletList title="Package Contents" items={attrs?.packageContents} />
      {detail.services?.length ? <ServicesSection services={detail.services} /> : null}
      {detail.alsoBought?.length ? <RelatedProductsCarousel title="You Might Also Like" products={detail.alsoBought} onProductClick={onProductClick} /> : null}
      {detail.reviews?.length ? <ReviewsSection reviews={detail.reviews} ratingBars={detail.ratingBars ?? []} rating={detail.rating} reviewCount={detail.reviewCount} /> : null}
      {detail.faqs?.length ? <FaqAccordion faqs={detail.faqs} /> : null}
    </>
  );
}
