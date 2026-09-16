'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../design-system/tokens/typography';
import { ProductCard } from '../home/ProductCard';
import type { CatalogProduct } from '../../data/categoryData';

interface CatalogProductCardProps {
  product: CatalogProduct;
  onClick?: (product: CatalogProduct) => void;
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  'Best Seller': { bg: '#2B2B2B', color: '#FFFFFF' },
  'New Arrival': { bg: walherb.greenPrimary, color: '#FFFFFF' },
  'Sale':        { bg: '#D93F3F', color: '#FFFFFF' },
};

export const CatalogProductCard = ({ product, onClick }: CatalogProductCardProps) => {
  const badge = product.badges[0];
  const badgeStyle = badge ? BADGE_STYLES[badge] : null;

  const pcProduct = {
    id: product.id,
    title: product.title,
    rating: product.rating,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
  };

  return (
    <Box sx={{ position: 'relative', display: 'block', width: '100%' }}>
      <ProductCard product={pcProduct} onClick={() => onClick?.(product)} fluid />

      {/* Best Seller / New Arrival badge */}
      {badgeStyle && badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            px: '7px',
            py: '3px',
            borderRadius: '4px',
            backgroundColor: badgeStyle.bg,
            pointerEvents: 'none',
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: '10px',
              color: badgeStyle.color,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </Typography>
        </Box>
      )}

      {/* Wishlist button */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.88)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          '&:hover': { backgroundColor: '#FFFFFF' },
          transition: 'background-color 0.15s',
        }}
      >
        <FavoriteBorderIcon sx={{ fontSize: 15, color: '#A0A0A0', '&:hover': { color: '#D93F3F' } }} />
      </Box>
    </Box>
  );
};

export default CatalogProductCard;
