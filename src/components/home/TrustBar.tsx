'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

const TRUST_ITEMS = [
  {
    title: 'Straight from the source',
    description: 'USA, UK, India, UAE, Japan & more. No middlemen.',
  },
  {
    title: 'One price. No surprises.',
    description: 'Customs & duties included. Always.',
  },
  {
    title: 'Fast, tracked delivery',
    description: 'Most orders arrive in 3–7 days.',
  },
  {
    title: 'Wrong or damaged? Full refund.',
    description:
      "If your item arrives broken, missing, or not as described, you're refunded in full.",
  },
];

const TrustIcon = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: `${radius.radiusFull}px`,
      background: `linear-gradient(141.7deg, ${walherb.greenPrimary} 32.95%, #4DBE5C 89.66%)`,
      flexShrink: 0,
    }}
  >
    <CheckIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
  </Box>
);

export const TrustBar = () => (
  <Box
    sx={{
      backgroundColor: walherb.bgSection,
      borderTop: `1px solid ${walherb.border}`,
      borderBottom: `1px solid ${walherb.border}`,
      px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
      py: `${spacing.s40}px`,
    }}
  >
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: { xs: `${spacing.s24}px`, md: `${spacing.s32}px` },
      }}
    >
      {TRUST_ITEMS.map((item) => (
        <Box
          key={item.title}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: `${spacing.s16}px`,
          }}
        >
          <TrustIcon />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s4}px` }}>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.semiBold,
                fontSize: `${fontSize.t3}px`,
                lineHeight: lineHeight.t3,
                color: walherb.textPrimary,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: `${fontSize.b3}px`,
                lineHeight: lineHeight.b3,
                color: walherb.textSubtle,
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default TrustBar;
