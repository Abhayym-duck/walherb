'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

export const AnnouncementBar = () => (
  <Box
    sx={{
      backgroundColor: walherb.announcement,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
      py: `${spacing.s8}px`,
      overflow: 'hidden',
    }}
  >
    {/* Left — status message */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s16}px`, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s6}px`, minWidth: 0 }}>
        <FiberManualRecordIcon
          sx={{ fontSize: 10, color: walherb.greenBgBadge, flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: `${fontSize.b3}px`,
            lineHeight: lineHeight.b3,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          Fully operational. Shipping worldwide, on schedule
        </Typography>
      </Box>

      <Typography
        component="span"
        sx={{
          display: { xs: 'none', sm: 'inline' },
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: `${fontSize.b3}px`,
          color: '#FFFFFF',
        }}
      >
        •
      </Typography>

      <Typography
        sx={{
          display: { xs: 'none', sm: 'block' },
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: `${fontSize.b3}px`,
          lineHeight: lineHeight.b3,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}
      >
        Customs duties &amp; taxes included in the price.
      </Typography>
    </Box>

    {/* Right — utility links */}
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: `${spacing.s24}px`,
      }}
    >
      {/* Ship to */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`, cursor: 'pointer' }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: `${fontSize.b3}px`,
            color: '#FFFFFF',
          }}
        >
          Ship to India
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
      </Box>

      {/* Help */}
      <Typography
        sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: `${fontSize.b3}px`,
          color: '#FFFFFF',
          cursor: 'pointer',
        }}
      >
        Help
      </Typography>

      {/* Track order */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: `${spacing.s6}px`,
          backgroundColor: '#FFFFFF',
          borderRadius: `${radius.radiusFull}px`,
          px: `${spacing.s10}px`,
          py: `${spacing.s4}px`,
          cursor: 'pointer',
          border: '1px solid #FFFFFF',
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: `${fontSize.b4}px`,
            color: walherb.greenDark,
            lineHeight: 'normal',
          }}
        >
          Track order
        </Typography>
        <LocationSearchingIcon sx={{ fontSize: 12, color: walherb.greenDark }} />
      </Box>
    </Box>
  </Box>
);

export default AnnouncementBar;
