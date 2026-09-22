'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

const TRUST_ITEMS = [
  { title: 'Straight from the source', Icon: PublicOutlinedIcon },
  { title: 'One price. No surprises.', Icon: WorkspacePremiumOutlinedIcon },
  { title: 'Fast, tracked delivery', Icon: LocalShippingOutlinedIcon },
  { title: 'Wrong or damaged? Full refund.', Icon: VerifiedOutlinedIcon },
];

// Repeat the set so the strip has enough badges to loop seamlessly at any width.
const MARQUEE_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

const TrustBadge = ({ title, Icon }: { title: string; Icon: typeof PublicOutlinedIcon }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: `${spacing.s12}px`,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}
  >
    <Icon sx={{ fontSize: 20, color: '#FFFFFF', opacity: 0.9 }} />
    <Typography
      sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semiBold,
        fontSize: `${fontSize.b2}px`,
        lineHeight: lineHeight.b2,
        color: '#FFFFFF',
      }}
    >
      {title}
    </Typography>
  </Box>
);

const Divider = () => (
  <Box
    sx={{
      width: 4,
      height: 4,
      borderRadius: `${radius.radiusFull}px`,
      backgroundColor: 'rgba(255,255,255,0.4)',
      flexShrink: 0,
    }}
  />
);

export const TrustBar = () => (
  <Box
    sx={{
      position: 'relative',
      backgroundColor: walherb.greenPrimary,
      py: `${spacing.s16}px`,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: `${spacing.s24}px`,
        width: 'max-content',
        animation: 'walherb-trust-marquee 28s linear infinite',
        '@keyframes walherb-trust-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-25%)' },
        },
        '&:hover': { animationPlayState: 'paused' },
      }}
    >
      {MARQUEE_ITEMS.map((item, i) => (
        <React.Fragment key={`${item.title}-${i}`}>
          {i > 0 && <Divider />}
          <TrustBadge title={item.title} Icon={item.Icon} />
        </React.Fragment>
      ))}
    </Box>
  </Box>
);

export default TrustBar;
