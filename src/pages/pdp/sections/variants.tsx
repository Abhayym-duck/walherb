'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Variant selectors — hero-region controls.
//   • PackageSelector — supplement "Package Count" toggle (extracted verbatim)
//   • ColorSwatches   — travel color variants (Figma 250-3309)
//   • SizePills       — travel size variants
// All are controlled; the shell owns selection state and derives the active price.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight } from '../../../design-system/tokens/typography';
import type { PackageOption, ColorVariant, SizeVariant } from '../types';

const poppins = "'Poppins', sans-serif";

// ─── Package Count (supplement) ────────────────────────────────────────────────

export const PackageSelector = ({
  packages,
  selected,
  onChange,
}: {
  packages: PackageOption[];
  selected: number;
  onChange: (idx: number) => void;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: '18.2px', color: '#3E3E3C' }}>
      Package Count
    </Typography>
    <Box sx={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
      {packages.map((pkg, i) => {
        const isSelected = selected === i;
        const isBest = pkg.best;
        const selBg = isBest ? '#FFFCF7' : '#F0F7F4';
        const selBorder = isBest ? '#FFEAC6' : walherb.greenPrimary;
        const selText = isBest ? '#3C3C3A' : '#1F322A';
        return (
          <Box key={i} onClick={() => onChange(i)} sx={{ position: 'relative', cursor: 'pointer', flex: 1, mt: pkg.best ? '14px' : 0 }}>
            {pkg.best && (
              <Box sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2B2B2B', borderRadius: '16px', px: '8px', py: '2px', zIndex: 1, whiteSpace: 'nowrap' }}>
                <Typography sx={{ fontFamily: poppins, fontWeight: 600, fontSize: '8px', lineHeight: '12px', color: '#FFFFFF', letterSpacing: '0.5px' }}>BEST</Typography>
              </Box>
            )}
            <Box sx={{
              backgroundColor: isSelected ? selBg : '#FFFFFF',
              border: `1px solid ${isSelected ? selBorder : '#E6E6E6'}`,
              borderRadius: '12px',
              px: '20px', py: '12px',
              display: 'flex', flexDirection: 'column', gap: '4px',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: isSelected ? selBorder : (isBest ? '#FFEAC6' : walherb.greenPrimary),
                backgroundColor: isSelected ? selBg : (isBest ? '#FFFDF9' : '#FAFAFA'),
              },
            }}>
              <Typography sx={{ fontFamily: poppins, fontWeight: 600, fontSize: '12px', lineHeight: '14.4px', color: isSelected ? selText : '#7F7F79' }}>
                {pkg.label}
              </Typography>
              <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '12px', lineHeight: '14.4px', color: isSelected ? selText : '#7F7F79' }}>
                {pkg.price}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  </Box>
);

// ─── Color swatches (travel) ────────────────────────────────────────────────────

export const ColorSwatches = ({
  colors,
  selected,
  onChange,
}: {
  colors: ColorVariant[];
  selected: number;
  onChange: (idx: number) => void;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: '18.2px', color: '#3E3E3C' }}>
        Color
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#7F7D75' }}>
        {colors[selected]?.name}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {colors.map((c, i) => {
        const isSelected = selected === i;
        return (
          <Box
            key={c.name}
            onClick={() => onChange(i)}
            title={c.name}
            sx={{
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
              backgroundColor: c.image ? undefined : c.swatch,
              backgroundImage: c.image ? `url(${c.image})` : undefined,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `2px solid ${isSelected ? walherb.greenPrimary : '#E6E6E6'}`,
              boxShadow: isSelected ? `0 0 0 2px #FFFFFF inset` : 'none',
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: walherb.greenPrimary },
            }}
          />
        );
      })}
    </Box>
  </Box>
);

// ─── Size pills (travel) ────────────────────────────────────────────────────────

export const SizePills = ({
  sizes,
  selected,
  onChange,
}: {
  sizes: SizeVariant[];
  selected: number;
  onChange: (idx: number) => void;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: '18.2px', color: '#3E3E3C' }}>
      Size
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {sizes.map((s, i) => {
        const isSelected = selected === i;
        const soldOut = s.inventory === 0;
        return (
          <Box
            key={s.label}
            onClick={() => !soldOut && onChange(i)}
            sx={{
              px: '16px', py: '8px', borderRadius: '10px',
              cursor: soldOut ? 'not-allowed' : 'pointer',
              opacity: soldOut ? 0.45 : 1,
              backgroundColor: isSelected ? '#F0F7F4' : '#FFFFFF',
              border: `1px solid ${isSelected ? walherb.greenPrimary : '#E6E6E6'}`,
              transition: 'all 0.2s',
              '&:hover': soldOut ? {} : { borderColor: walherb.greenPrimary, backgroundColor: isSelected ? '#F0F7F4' : '#FAFAFA' },
            }}
          >
            <Typography sx={{ fontFamily: poppins, fontWeight: isSelected ? 600 : 500, fontSize: '12px', lineHeight: '14.4px', color: isSelected ? '#1F322A' : '#7F7F79', whiteSpace: 'nowrap', textDecoration: soldOut ? 'line-through' : 'none' }}>
              {s.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);
