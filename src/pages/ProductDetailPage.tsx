'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ProductDetailPage — thin, category-driven shell.
//
// Owns the page chrome (announcement / header / breadcrumb / 2-col layout /
// sticky purchase panel / footer) and the hero selection state. The category
// body is chosen by `product.category` through the template registry, so adding
// a category never touches this file. Rich content comes from the PDP catalog.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { type CheckoutPayload } from '../context/CartContext';
import { ProductPurchasePanel } from '../components/Product/ProductPurchasePanel/ProductPurchasePanel';
import type { AccountSection } from '../components/Account/AccountSidebar';
import { fontFamily, fontWeight } from '../design-system/tokens/typography';
import type { Product } from '../components/home/ProductCard';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

import { Breadcrumb, TrustpilotCard } from './pdp/sections/common';
import { DynamicCategoryTemplate } from './pdp/templates/registry';
import { resolveProductDetail } from './pdp/catalog';
import { resolveCurrentPackage } from './pdp/selection';
import { buildAllSchemas } from './pdp/seo';
import { useJsonLd } from './pdp/useJsonLd';
import type { PdpSelection } from './pdp/types';

interface Props {
  product: Product;
  onBack: () => void;
  onBuyNow: (payload: CheckoutPayload) => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
  onLogoClick?: () => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductDetailPage({ product, onBack, onBuyNow, onAccountClick, onAccountNavigate, onLogoClick, onProductClick }: Props) {
  // Resolve the rich detail for this product (seeded or synthesized by category).
  const detail = useMemo(() => resolveProductDetail(product, product.category), [product]);

  // Hero selection — defaults to the "best" package when present.
  const [selection, setSelection] = useState<PdpSelection>(() => ({
    pkgIdx: Math.max(0, detail.packages?.findIndex((p) => p.best) ?? 0),
    colorIdx: 0,
    sizeIdx: detail.variants?.sizes?.findIndex((s) => s.inventory !== 0) ?? 0,
  }));
  const onSelect = (patch: Partial<PdpSelection>) => setSelection((s) => ({ ...s, ...patch }));

  const currentPkg = resolveCurrentPackage(detail, selection);

  // SEO structured data → <head>.
  useJsonLd(useMemo(() => buildAllSchemas(detail), [detail]));

  const breadcrumbCurrent = detail.title.split(',')[0];

  const purchaseBlock = (
    <>
      <ProductPurchasePanel product={product} pkg={currentPkg} onBuyNow={onBuyNow} />
      <TrustpilotCard reviews={detail.reviews ?? []} />
    </>
  );

  return (
    <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Header onAccountClick={onAccountClick} onAccountNavigate={onAccountNavigate} onLogoClick={onLogoClick} />

      <Box sx={{ px: { xs: '16px', md: '80px' }, py: '24px' }}>
        {/* Back + Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: '24px' }}>
          <Box
            component="button"
            onClick={onBack}
            sx={{
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'transparent', border: '1px solid #E7E7E7',
              borderRadius: '50px', px: '12px', py: '6px',
              cursor: 'pointer', flexShrink: 0,
              '&:hover': { backgroundColor: '#F0F0F0' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 14, color: '#7F7D75' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#7F7D75' }}>Back</Typography>
          </Box>
          <Breadcrumb crumbs={detail.breadcrumbs} current={breadcrumbCurrent} onHome={onBack} />
        </Box>

        {/* 2-column layout (single column on mobile) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: '24px', md: '40px' }, alignItems: 'flex-start' }}>

          {/* Left: category-driven content */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <DynamicCategoryTemplate
              detail={detail}
              selection={selection}
              onSelect={onSelect}
              onProductClick={onProductClick}
              onHome={onBack}
              mobilePurchase={
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: '16px', mt: '24px' }}>
                  {purchaseBlock}
                </Box>
              }
            />
          </Box>

          {/* Right: sticky checkout — desktop only */}
          <Box
            sx={{
              width: 434,
              flexShrink: 0,
              alignSelf: 'flex-start',
              position: 'sticky',
              top: '24px',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {purchaseBlock}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
