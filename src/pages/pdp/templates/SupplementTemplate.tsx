'use client';

// ─────────────────────────────────────────────────────────────────────────────
// SupplementTemplate — the original supplement PDP body, preserved pixel-for-pixel.
// Hero markup is the former ProductHeroInfo; sections are the former section
// components, now reading from ProductDetail. Order matches the original page.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import BoltIcon from '@mui/icons-material/Bolt';

import { fontFamily, fontWeight, fontSize, lineHeight } from '../../../design-system/tokens/typography';
import {
  Stars, ProductGallery, RelatedProductsCarousel, ProductDescriptionImages,
  ServicesSection, ReviewsSection, FaqAccordion,
} from '../sections/common';
import { PackageSelector } from '../sections/variants';
import { FeaturesSection, ImportantInfoSection, SpecTable } from '../sections/category';
import type { TemplateProps } from './types';
import type { ProductDetail, PdpSelection } from '../types';

const poppins = "'Poppins', sans-serif";

// ─── Hero info (verbatim from the original ProductHeroInfo) ──────────────────────

const SupplementHeroInfo = ({
  detail,
  selection,
  onSelect,
}: {
  detail: ProductDetail;
  selection: PdpSelection;
  onSelect: (patch: Partial<PdpSelection>) => void;
}) => (
  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px', py: '8px' }}>
    {/* Brand + actions */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '16px', color: '#7F7D75' }}>By:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', lineHeight: '16px', color: '#476D59', whiteSpace: 'nowrap' }}>
            {detail.brand}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '4px' }}>
          {[FavoriteBorderIcon, IosShareIcon].map((Icon, i) => (
            <Box key={i} sx={{ backgroundColor: '#FCFAFA', border: '1px solid #EBE8E4', borderRadius: '50%', p: '6px', display: 'flex', cursor: 'pointer', '&:hover': { backgroundColor: '#F0F0F0' } }}>
              <Icon sx={{ fontSize: 12, color: '#433C50' }} />
            </Box>
          ))}
        </Box>
      </Box>

      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#000000' }}>
        {detail.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stars count={5} size={12} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', lineHeight: '16.8px', color: '#3D4440' }}>{detail.rating}</Typography>
          </Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', lineHeight: '16.8px', color: '#CAA159', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            24k+ reviews
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: '#E8EFEC', borderRadius: '50px', px: '8px', py: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BoltIcon sx={{ fontSize: 12, color: '#476D59' }} />
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '10px', lineHeight: '13px', color: '#476D59', whiteSpace: 'nowrap' }}>5,000+ sold in 30 days</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <Box sx={{ backgroundColor: '#FAF3E8', borderRadius: '50px', px: '8px', py: '4px' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '10px', color: '#AC873E', whiteSpace: 'nowrap' }}>#1 Ferrous Sulfate</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#7F7D75' }}>Condition:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#7F7D75' }}>New</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#7F7D75' }}>Product ID:</Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#7F7D75' }}>211447297</Typography>
        </Box>
      </Box>
    </Box>

    {/* Package Count toggle */}
    {detail.packages?.length ? (
      <PackageSelector packages={detail.packages} selected={selection.pkgIdx} onChange={(idx) => onSelect({ pkgIdx: idx })} />
    ) : null}

    <Divider sx={{ borderColor: '#E6E6E6' }} />

    {/* Spec details */}
    {detail.heroSpecs?.length ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography sx={{ fontFamily: poppins, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: 'normal', color: '#3E3E3C' }}>Details</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {detail.heroSpecs.map((row) => (
            <Box key={row.label} sx={{ display: 'flex', gap: '16px', py: '4px' }}>
              <Typography sx={{ fontFamily: poppins, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '14.4px', color: '#252D28', width: 200, flexShrink: 0 }}>{row.label}</Typography>
              <Typography sx={{ fontFamily: poppins, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '14.4px', color: '#7F7F79' }}>{row.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    ) : null}
  </Box>
);

// ─── Template ───────────────────────────────────────────────────────────────────

export default function SupplementTemplate({ detail, selection, onSelect, onProductClick, mobilePurchase }: TemplateProps) {
  const attrs = detail.categoryAttributes.category === 'SUPPLEMENT' ? detail.categoryAttributes : undefined;

  return (
    <>
      {/* Hero */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px', alignItems: 'flex-start' }}>
        <ProductGallery images={detail.gallery} />
        <SupplementHeroInfo detail={detail} selection={selection} onSelect={onSelect} />
      </Box>

      {mobilePurchase}

      {attrs?.features?.length ? <FeaturesSection features={attrs.features} /> : null}
      {detail.related?.length ? <RelatedProductsCarousel title="You Might Also Like" products={detail.related} onProductClick={onProductClick} /> : null}
      {attrs?.importantInfo?.length ? <ImportantInfoSection blocks={attrs.importantInfo} /> : null}
      {detail.descriptionImages?.length ? <ProductDescriptionImages images={detail.descriptionImages} /> : null}
      {detail.alsoBought?.length ? <RelatedProductsCarousel title="Customers Also Bought" products={detail.alsoBought} onProductClick={onProductClick} /> : null}
      {detail.services?.length ? <ServicesSection services={detail.services} /> : null}
      <SpecTable title="Specifications" rows={detail.specifications} />
      <SpecTable title="Product Details" rows={detail.productDetails} />
      {detail.reviews?.length ? <ReviewsSection reviews={detail.reviews} ratingBars={detail.ratingBars ?? []} rating={detail.rating} reviewCount={detail.reviewCount} /> : null}
      {detail.faqs?.length ? <FaqAccordion faqs={detail.faqs} /> : null}
    </>
  );
}
