'use client';

// Shared hero-info block for non-supplement templates (Travel + Generic).
// Brand · title · rating · price · interactive color/size variants · quick specs.
// Reuses the design-system tokens and the same chrome as the supplement hero.

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import BoltIcon from '@mui/icons-material/Bolt';

import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../../design-system/tokens/typography';
import { Stars } from '../sections/common';
import { ColorSwatches, SizePills } from '../sections/variants';
import { resolveCurrentPackage } from '../selection';
import type { ProductDetail, PdpSelection } from '../types';

const poppins = "'Poppins', sans-serif";

export const GenericHeroInfo = ({
  detail,
  selection,
  onSelect,
}: {
  detail: ProductDetail;
  selection: PdpSelection;
  onSelect: (patch: Partial<PdpSelection>) => void;
}) => {
  const pkg = resolveCurrentPackage(detail, selection);
  const colors = detail.variants?.colors;
  const sizes = detail.variants?.sizes;

  return (
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
              {detail.reviewCount.toLocaleString()} reviews
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: '#E8EFEC', borderRadius: '50px', px: '8px', py: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BoltIcon sx={{ fontSize: 12, color: '#476D59' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '10px', lineHeight: '13px', color: '#476D59', whiteSpace: 'nowrap' }}>Trending now</Typography>
          </Box>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: poppins, fontWeight: 700, fontSize: '22px', lineHeight: '28.6px', color: walherb.textProduct }}>
            {pkg.price}
          </Typography>
          <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '16px', lineHeight: '20.8px', color: walherb.priceMuted, textDecoration: 'line-through' }}>
            {pkg.originalPrice}
          </Typography>
        </Box>
      </Box>

      {/* Variant selectors */}
      {colors?.length ? <ColorSwatches colors={colors} selected={selection.colorIdx} onChange={(idx) => onSelect({ colorIdx: idx })} /> : null}
      {sizes?.length ? <SizePills sizes={sizes} selected={selection.sizeIdx} onChange={(idx) => onSelect({ sizeIdx: idx })} /> : null}

      {detail.heroSpecs?.length ? (
        <>
          <Divider sx={{ borderColor: '#E6E6E6' }} />
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
        </>
      ) : null}
    </Box>
  );
};
