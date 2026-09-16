'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

export type AccountSection =
  | 'orders'
  | 'kyc'
  | 'notifications'
  | 'account-information'
  | 'addresses'
  | 'payment-methods'
  | '2-step-verification';

const NAV_ITEMS: { key: AccountSection; label: string }[] = [
  { key: 'orders',              label: 'My Orders'                    },
  { key: 'kyc',                 label: 'Know Your Customer (KYC)'     },
  { key: 'notifications',       label: 'Notification'                 },
  { key: 'account-information', label: 'Account Information' },
  { key: 'addresses',           label: 'Address Book'       },
  { key: 'payment-methods',     label: 'Payment Methods'    },
  { key: '2-step-verification', label: '2 Step Verification' },
];

interface AccountSidebarProps {
  active: AccountSection;
  onNavigate: (section: AccountSection) => void;
}

export const AccountSidebar = ({ active, onNavigate }: AccountSidebarProps) => {
  return (
    <Box
      sx={{
        // Hidden on mobile — account navigation happens via the side drawer there.
        display: { xs: 'none', md: 'flex' },
        width: { xs: '100%', md: 240 },
        flexShrink: 0,
        backgroundColor: '#F7F8FB',
        border: '1px solid #E3E6EC',
        borderRadius: '16px',
        p: { xs: '8px', md: '16px' },
        flexDirection: 'column',
        gap: { xs: '0px', md: '16px' },
      }}
    >
      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semiBold,
          fontSize: '22px',
          lineHeight: '28.6px',
          color: '#474743',
        }}
      >
        My Account
      </Typography>

      {/* Vertical sidebar on desktop; horizontal scrollable tab bar on mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: '8px', md: '0px' },
          overflowX: { xs: 'auto', md: 'visible' },
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {NAV_ITEMS.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <Box
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate(key); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexShrink: 0,
                minHeight: 44,
                px: '16px',
                py: '13.5px',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#476D59' : 'transparent',
                transition: 'background-color 0.15s',
                '&:hover': { backgroundColor: isActive ? '#476D59' : 'rgba(71,109,89,0.08)' },
                '&:focus-visible': { outline: '2px solid #476D59', outlineOffset: '2px' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: isActive ? fontWeight.semiBold : fontWeight.medium,
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: isActive ? '#FFFFFF' : '#444050',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AccountSidebar;
