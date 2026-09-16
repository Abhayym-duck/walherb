'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StarRateIcon from '@mui/icons-material/StarRate';
import AddIcon from '@mui/icons-material/Add';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';
import { useCart } from '../../context/CartContext';
import type { ProductCategory } from '../../pages/pdp/types';

// Turn a price string like "₹1,750" into the number 1750.
const parsePrice = (s: string) => Number(s.replace(/[^0-9.]/g, '')) || 0;

export interface Product {
  id: number;
  title: string;
  rating: number;
  price: string;
  originalPrice: string;
  image: string;
  /** Manufacturer / brand, shown as "By: {brand}" on the product page. */
  brand?: string;
  /** Drives which PDP template renders. Defaults to SUPPLEMENT when omitted. */
  category?: ProductCategory;
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  /** When true, the card fills its parent's width (used inside responsive grids
   *  like the category page). Defaults to the fixed rail width used on the home page. */
  fluid?: boolean;
}

export const ProductCard = ({ product, onClick, fluid = false }: ProductCardProps) => {
  const { addItem, openDrawer } = useCart();

  const handleAdd = () => {
    addItem({
      product,
      pkgIdx: 0,
      pkgLabel: '',
      priceValue: parsePrice(product.price),
      originalValue: parsePrice(product.originalPrice),
      formattedPrice: product.price,
      qty: 1,
      sku: `SKU-${product.id}`,
    });
    openDrawer();
  };

  return (
  <Box
    onClick={() => onClick?.(product)}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing.s12}px`,
      width: fluid ? '100%' : { xs: 160, md: 188 },
      flexShrink: 0,
      cursor: 'pointer',
    }}
  >
    {/* Image container */}
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        border: `1px solid ${walherb.border}`,
        borderRadius: `${radius.radius16}px`,
        p: `${spacing.s24}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { borderColor: walherb.greenPrimary },
        transition: 'border-color 0.2s',
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.title}
        sx={{
          width: { xs: 112, md: 140 },
          height: { xs: 112, md: 140 },
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* ADD + button */}
      <Box
        component="button"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAdd(); }}
        sx={{
          position: 'absolute',
          bottom: `${spacing.s8}px`,
          right: `${spacing.s8}px`,
          display: 'flex',
          alignItems: 'center',
          gap: `${spacing.s4}px`,
          backgroundColor: walherb.addToCartBg,
          border: `1px solid ${walherb.greenPrimary}`,
          borderRadius: `${radius.radius8}px`,
          px: `${spacing.s12}px`,
          py: `${spacing.s6}px`,
          cursor: 'pointer',
          '&:hover': { backgroundColor: walherb.greenBg },
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: `${fontSize.b3}px`,
            lineHeight: lineHeight.b3,
            color: walherb.addToCartText,
            whiteSpace: 'nowrap',
          }}
        >
          ADD
        </Typography>
        <AddIcon sx={{ fontSize: 14, color: walherb.addToCartText }} />
      </Box>
    </Box>

    {/* Product info — flex: 1 fills remaining card height so price stays at bottom */}
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Title — 2-line clamp */}
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          fontSize: `${fontSize.b2}px`,
          lineHeight: lineHeight.b2,
          color: walherb.textPrimary,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {product.title}
      </Typography>

      {/* Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`, mt: `${spacing.s6}px` }}>
        <Box sx={{ display: 'flex', gap: `${spacing.s2}px` }}>
          {[...Array(5)].map((_, i) => (
            <StarRateIcon
              key={i}
              sx={{ fontSize: 14, color: '#F5A623' }}
            />
          ))}
        </Box>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: `${fontSize.b2}px`,
            lineHeight: lineHeight.b2,
            color: walherb.textRating,
          }}
        >
          {product.rating}
        </Typography>
      </Box>

      {/* Price — mt: auto pins this to the bottom of the info area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s6}px`, mt: 'auto', pt: `${spacing.s8}px` }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.bold,
            fontSize: `${fontSize.t2}px`,
            lineHeight: lineHeight.t2,
            color: walherb.textProduct,
          }}
        >
          {product.price}
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: `${fontSize.t3}px`,
            lineHeight: lineHeight.t3,
            color: walherb.priceMuted,
            textDecoration: 'line-through',
          }}
        >
          {product.originalPrice}
        </Typography>
      </Box>
    </Box>
  </Box>
  );
};

export default ProductCard;
