'use client';

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnnouncementBar from '../../components/home/AnnouncementBar';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { AccountSection } from '../../components/Account/AccountSidebar';

export interface StaticPageProps {
  onBack: () => void;
  onLogoClick?: () => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
}

interface ShellProps extends StaticPageProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  /** Optional intro paragraph under the title. */
  lede?: string;
  /** Constrain the content column width. Defaults to 880px. */
  maxWidth?: number;
  children: React.ReactNode;
}

export const StaticPageShell = ({
  onBack, onLogoClick, onAccountClick, onAccountNavigate,
  eyebrow, title, lede, maxWidth = 880, children,
}: ShellProps) => {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Header onAccountClick={onAccountClick} onAccountNavigate={onAccountNavigate} onLogoClick={onLogoClick} />

      <Box sx={{ px: { xs: '16px', md: '80px' }, py: { xs: '24px', md: '40px' } }}>
        <Box sx={{ maxWidth, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Back */}
          <Box
            component="button"
            onClick={onBack}
            sx={{
              alignSelf: 'flex-start',
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'transparent', border: '1px solid #E7E7E7',
              borderRadius: '50px', px: '12px', py: '6px', mb: '24px',
              cursor: 'pointer', flexShrink: 0,
              '&:hover': { backgroundColor: '#F0F0F0' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 14, color: '#7F7D75' }} />
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#7F7D75' }}>Back</Typography>
          </Box>

          {/* Heading block */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: { xs: '24px', md: '32px' } }}>
            {eyebrow && (
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#476D59' }}>
                {eyebrow}
              </Typography>
            )}
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: { xs: '26px', md: '32px' }, lineHeight: 1.2, color: '#1F322A' }}>
              {title}
            </Typography>
            {lede && (
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '15px', lineHeight: 1.6, color: '#6D6777', maxWidth: '64ch' }}>
                {lede}
              </Typography>
            )}
          </Box>

          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default StaticPageShell;
