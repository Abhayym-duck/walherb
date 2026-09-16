'use client';

// ─────────────────────────────────────────────────────────────────────────────
// GenericTemplate — schema-driven body for the categories without a bespoke
// Figma design (Sports, Beauty, Baby, Pets, Personal Care, General + fallback).
// A per-category config maps each attribute to a reusable generic section. Every
// section hides itself when its data is missing, so partial data is safe and new
// categories only need a config entry + data.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Box from '@mui/material/Box';

import {
  ProductGallery, RelatedProductsCarousel, ProductDescriptionImages,
  ServicesSection, ReviewsSection, FaqAccordion,
} from '../sections/common';
import {
  FeatureChecklist, InfoBlockList, SpecTable, TextBlock, BulletList, ChipRow,
} from '../sections/category';
import { GenericHeroInfo } from './GenericHeroInfo';
import type { TemplateProps } from './types';
import type { CategoryAttributes } from '../types';

/** Category-specific middle sections, ordered per the spec. */
function renderCategorySections(a: CategoryAttributes): React.ReactNode {
  switch (a.category) {
    case 'SPORTS':
      return (
        <>
          <FeatureChecklist title="Performance Benefits" features={a.performanceBenefits} />
          <SpecTable title="Nutrition Facts" rows={a.nutritionFacts} />
          <TextBlock title="Protein Content" body={a.proteinContent} />
          <SpecTable title="Amino Acid Profile" rows={a.aminoAcidProfile} />
          <TextBlock title="Ingredients" body={a.ingredients} />
          <InfoBlockList title="Workout Usage Guide" blocks={a.workoutGuide} />
          <ChipRow title="Certifications" items={a.certifications} />
          <TextBlock title="Storage Instructions" body={a.storage} />
        </>
      );
    case 'BEAUTY':
      return (
        <>
          <FeatureChecklist title="Benefits" features={a.benefits} />
          <TextBlock title="Ingredients" body={a.ingredients} />
          <ChipRow title="Skin Type Compatibility" items={a.skinTypes} />
          <ChipRow title="Hair Type Compatibility" items={a.hairTypes} />
          <InfoBlockList title="How To Use" blocks={a.howToUse} />
          <TextBlock title="Safety Warnings" body={a.safetyWarnings} />
          <TextBlock title="Expiry Information" body={a.expiry} />
          <ChipRow title="Certifications" items={a.certifications} />
        </>
      );
    case 'BABY':
      return (
        <>
          <TextBlock title="Recommended Age" body={a.recommendedAge} />
          <TextBlock title="Ingredients" body={a.ingredients} />
          <TextBlock title="Material Information" body={a.material} />
          <InfoBlockList title="Usage Instructions" blocks={a.usage} />
          <InfoBlockList title="Care Instructions" blocks={a.careInstructions} />
          <ChipRow title="Safety Certifications" items={a.safetyCertifications} />
          <TextBlock title="Warnings" body={a.warnings} />
        </>
      );
    case 'PETS':
      return (
        <>
          <TextBlock title="Pet Type" body={a.petType} />
          <TextBlock title="Breed Size" body={a.breedSize} />
          <TextBlock title="Ingredients" body={a.ingredients} />
          <InfoBlockList title="Feeding Guide" blocks={a.feedingGuide} />
          <SpecTable title="Nutritional Information" rows={a.nutrition} />
          <TextBlock title="Storage Instructions" body={a.storage} />
          <TextBlock title="Safety Information" body={a.safety} />
        </>
      );
    case 'PERSONAL_CARE':
      return (
        <>
          <FeatureChecklist title="Benefits" features={a.benefits} />
          <TextBlock title="Ingredients" body={a.ingredients} />
          <InfoBlockList title="How To Use" blocks={a.howToUse} />
          <TextBlock title="Safety Information" body={a.safety} />
          <ChipRow title="Certifications" items={a.certifications} />
        </>
      );
    case 'GENERAL':
      return (
        <>
          <FeatureChecklist title="Product Features" features={a.features} />
          <TextBlock title="Material Information" body={a.material} />
          <TextBlock title="Dimensions" body={a.dimensions} />
          <TextBlock title="Warranty Information" body={a.warranty} />
        </>
      );
    default:
      return null;
  }
}

export default function GenericTemplate({ detail, selection, onSelect, onProductClick, mobilePurchase }: TemplateProps) {
  return (
    <>
      {/* Hero */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px', alignItems: 'flex-start' }}>
        <ProductGallery images={detail.gallery} />
        <GenericHeroInfo detail={detail} selection={selection} onSelect={onSelect} />
      </Box>

      {mobilePurchase}

      {renderCategorySections(detail.categoryAttributes)}

      {detail.descriptionImages?.length ? <ProductDescriptionImages images={detail.descriptionImages} /> : null}
      <SpecTable title="Specifications" rows={detail.specifications} />
      {detail.related?.length ? <RelatedProductsCarousel title="You Might Also Like" products={detail.related} onProductClick={onProductClick} /> : null}
      {detail.services?.length ? <ServicesSection services={detail.services} /> : null}
      {detail.reviews?.length ? <ReviewsSection reviews={detail.reviews} ratingBars={detail.ratingBars ?? []} rating={detail.rating} reviewCount={detail.reviewCount} /> : null}
      {detail.faqs?.length ? <FaqAccordion faqs={detail.faqs} /> : null}
      {detail.alsoBought?.length ? <RelatedProductsCarousel title="Customers Also Bought" products={detail.alsoBought} onProductClick={onProductClick} /> : null}
    </>
  );
}
