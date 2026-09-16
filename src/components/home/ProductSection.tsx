'use client';

import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';
import { ProductCard, type Product } from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const NavArrow = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) => (
  <Box
    component="button"
    onClick={onClick}
    aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
    sx={{
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: walherb.bgSection,
      border: `1px solid ${walherb.border}`,
      borderRadius: `${radius.radiusFull}px`,
      cursor: 'pointer',
      flexShrink: 0,
      '&:hover': { backgroundColor: walherb.bgPage, borderColor: walherb.greenPrimary },
      transition: 'all 0.2s',
    }}
  >
    {direction === 'left' ? (
      <ChevronLeftIcon sx={{ fontSize: 16, color: walherb.textPrimary }} />
    ) : (
      <ChevronRightIcon sx={{ fontSize: 16, color: walherb.textPrimary }} />
    )}
  </Box>
);

export const ProductSection = ({ title, products, onProductClick }: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 204 * 3; // 3 cards at a time
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      sx={{
        px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
        py: `${spacing.s40}px`,
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: `${spacing.s16}px`,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: `${fontSize.t1}px`,
            lineHeight: lineHeight.t1,
            color: walherb.textHeading,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: `${spacing.s8}px` }}>
          <NavArrow direction="left" onClick={() => scroll('left')} />
          <NavArrow direction="right" onClick={() => scroll('right')} />
        </Box>
      </Box>

      {/* Scrollable row — align-items: stretch equalises all card heights */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: `${spacing.s16}px`,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: `${spacing.s8}px`,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          position: 'relative',
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={onProductClick} />
        ))}

        {/* Right fade gradient */}
        <Box
          sx={{
            position: 'sticky',
            right: 0,
            width: 80,
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.95))',
            flexShrink: 0,
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductSection;
