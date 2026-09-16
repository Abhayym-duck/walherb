'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

const SERVICE_BLOCKS = [
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
    title: 'Authentic or refunded',
    description:
      "If anything arrives not as described, you're refunded in full — no return cost, no questions asked.",
  },
  {
    icon: <ReplayIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
    title: '30-day easy returns',
    description:
      'International returns at our cost on most items shipped to your door. Pickup arranged in 48 hours.',
  },
  {
    icon: <CreditCardOutlinedIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
    title: 'Pay your way',
    description:
      'UPI, all major cards, net banking, wallets, and no-cost EMI on orders above ₹3,000.',
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />,
    title: 'Real human support',
    description:
      "Facing an issue? Hop on live chat — you'll reach a real person, not a bot, with authority to actually fix it.",
  },
];

export const WhySection = () => (
  <Box
    sx={{
      backgroundColor: walherb.greenBg,
      px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
      py: { xs: `${spacing.s48}px`, md: `${spacing.s64}px` },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing.s40}px`,
      }}
    >
      {/* Header area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s20}px` }}>
        {/* Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${spacing.s8}px`,
            backgroundColor: walherb.greenBgBadge,
            border: `1px solid ${walherb.greenBadgeBorder}`,
            borderRadius: `${radius.radiusFull}px`,
            px: `${spacing.s14}px`,
            py: `${spacing.s10}px`,
            alignSelf: 'flex-start',
          }}
        >
          <EmojiEventsOutlinedIcon sx={{ fontSize: 20, color: walherb.greenDeep }} />
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: `${fontSize.t3}px`,
              lineHeight: lineHeight.t3,
              color: walherb.greenDeep,
              whiteSpace: 'nowrap',
            }}
          >
            Why our customers come back
          </Typography>
        </Box>

        {/* Section heading + sub */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s10}px`, maxWidth: 934 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 700,
              fontSize: { xs: 28, sm: 32, md: `${fontSize.displaySmall}px` },
              lineHeight: { xs: '36px', sm: '42px', md: '44px' },
              color: walherb.greenDeep,
              letterSpacing: '-0.72px',
            }}
          >
            Why people in India trust us with their re-orders.
          </Typography>
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: `${fontSize.b2}px`,
              lineHeight: lineHeight.b2,
              color: walherb.greenLight,
            }}
          >
            First orders are easy. Re-orders are everything. Here&apos;s what keeps our customers
            coming back — every month, for years.
          </Typography>
        </Box>
      </Box>

      {/* Service blocks grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: `${spacing.s16}px`,
        }}
      >
        {SERVICE_BLOCKS.map((block) => (
          <Box
            key={block.title}
            sx={{
              backgroundColor: '#FFFFFF',
              border: `1px solid #C8ECD5`,
              borderRadius: `${radius.radius24}px`,
              p: `${spacing.s20}px`,
              display: 'flex',
              flexDirection: 'column',
              gap: `${spacing.s32}px`,
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                backgroundColor: walherb.greenIcon,
                border: `1px solid ${walherb.greenIconBorder}`,
                borderRadius: `${radius.radius12}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {block.icon}
            </Box>

            {/* Text */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s2}px` }}>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: `${fontSize.t3}px`,
                  lineHeight: lineHeight.t3,
                  color: walherb.greenDeep,
                }}
              >
                {block.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.regular,
                  fontSize: `${fontSize.b2}px`,
                  lineHeight: lineHeight.b2,
                  color: walherb.greenLight,
                }}
              >
                {block.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default WhySection;
