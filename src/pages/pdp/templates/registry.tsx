'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Template registry — the PDP extension point.
// Map a category to its template component here. Categories without a bespoke
// design fall through to GenericTemplate (schema-driven). Adding a new category
// = add its enum value (types.ts) + an entry here; the shell never changes.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import type { ProductCategory } from '../types';
import type { TemplateProps } from './types';
import SupplementTemplate from './SupplementTemplate';
import TravelTemplate from './TravelTemplate';
import GenericTemplate from './GenericTemplate';

type TemplateComponent = React.ComponentType<TemplateProps>;

const REGISTRY: Partial<Record<ProductCategory, TemplateComponent>> = {
  SUPPLEMENT: SupplementTemplate,
  TRAVEL_ACCESSORIES: TravelTemplate,
  // SPORTS / BEAUTY / BABY / PETS / PERSONAL_CARE / GENERAL → GenericTemplate
};

export function resolveTemplate(category: ProductCategory): TemplateComponent {
  return REGISTRY[category] ?? GenericTemplate;
}

/** Renders the category-specific body. Kept as a component so the shell stays declarative. */
export const DynamicCategoryTemplate = (props: TemplateProps) => {
  const Template = resolveTemplate(props.detail.category);
  return <Template {...props} />;
};
