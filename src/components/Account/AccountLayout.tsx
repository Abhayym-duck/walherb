'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { AccountSidebar, type AccountSection } from './AccountSidebar';

interface AccountLayoutProps {
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
  children: React.ReactNode;
}

export const AccountLayout = ({ active, onNavigate, children }: AccountLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'flex-start' },
        gap: { xs: '16px', md: '24px' },
        px: { xs: '16px', md: '80px' },
        pt: { xs: '24px', md: '40px' },
        pb: { xs: '48px', md: '80px' },
        minHeight: 'calc(100vh - 140px)',
      }}
    >
      <AccountSidebar active={active} onNavigate={onNavigate} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AccountLayout;
