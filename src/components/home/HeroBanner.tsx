'use client';

import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';

const SLIDES = [
  '/Images/Banner1.svg',
  '/Images/Banner2.svg',
  '/Images/Banner3.svg',
];

const HEADING  = 'Stop paying 3x on\nInternational shipping';
const SUBTITLE = 'A curated import shop for Indian families who want trusted American brands – vitamins, supplements, skincare, bath essentials, and baby care – with duties prepaid and authenticity guaranteed.';

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 240, sm: 340, md: 480 },
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `url('${SLIDES[current]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.4s ease',
      }}
    >
      {/* Text overlay */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '24px', md: '80px' },
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '12px', md: '20px' },
          maxWidth: { xs: '55%', sm: '50%', md: 540 },
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: { xs: '22px', sm: '32px', md: '48px' },
            lineHeight: { xs: '28px', sm: '40px', md: '56px' },
            color: '#FFFFFF',
            letterSpacing: { xs: '-0.5px', md: '-1.5px' },
            whiteSpace: 'pre-line',
          }}
        >
          {HEADING}
        </Typography>

        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: { xs: '11px', sm: '13px', md: '15px' },
            lineHeight: { xs: '16px', sm: '19px', md: '22px' },
            color: 'rgba(255,255,255,0.85)',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {SUBTITLE}
        </Typography>

        <Box
          component="button"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            alignSelf: 'flex-start',
            backgroundColor: '#FFFFFF',
            border: 'none',
            borderRadius: `${radius.radius8}px`,
            px: { xs: '14px', md: '20px' },
            py: { xs: '8px', md: '12px' },
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': { backgroundColor: '#E8F4EE' },
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: { xs: '13px', md: '15px' },
              color: walherb.greenDark,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            Shop here
          </Typography>
          <KeyboardArrowRightIcon sx={{ fontSize: { xs: 14, md: 18 }, color: walherb.greenDark }} />
        </Box>
      </Box>

      {/* Left nav */}
      <Box
        component="button"
        onClick={prev}
        aria-label="Previous slide"
        sx={{
          position: 'absolute',
          left: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3,
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.28)' },
        }}
      >
        <KeyboardArrowLeftIcon sx={{ fontSize: { xs: 18, md: 22 }, color: '#FFFFFF' }} />
      </Box>

      {/* Right nav */}
      <Box
        component="button"
        onClick={next}
        aria-label="Next slide"
        sx={{
          position: 'absolute',
          right: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3,
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.28)' },
        }}
      >
        <KeyboardArrowRightIcon sx={{ fontSize: { xs: 18, md: 22 }, color: '#FFFFFF' }} />
      </Box>

      {/* Dot indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: `${spacing.s16}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: `${spacing.s8}px`,
          zIndex: 3,
        }}
      >
        {SLIDES.map((_, i) => (
          <Box
            key={i}
            component="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            sx={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: `${radius.radiusFull}px`,
              backgroundColor: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroBanner;
