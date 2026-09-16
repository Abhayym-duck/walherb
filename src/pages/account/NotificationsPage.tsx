'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'How was your iHerb experience?',                                       date: '05/06/2026', read: true  },
  { id: '2', message: 'Earn 500 bonus points when you refer a friend to our app.',             date: '05/12/2026', read: true  },
  { id: '3', message: 'Limited-time offer: Free shipping on orders over ₹4,000!',             date: '05/18/2026', read: true  },
  { id: '4', message: 'Join our newsletter and get exclusive discounts every week.',           date: '05/24/2026', read: true  },
  { id: '5', message: 'Flash sale: 20% off all electronics this weekend only.',               date: '05/30/2026', read: false },
  { id: '6', message: 'Complete your profile and receive a ₹400 gift card.',                  date: '06/05/2026', read: false },
  { id: '7', message: 'Try our new feature and earn double rewards points.',                  date: '06/11/2026', read: false },
  { id: '8', message: 'Participate in our survey and get a chance to win a ₹8,000 voucher.', date: '06/17/2026', read: false },
  { id: '9', message: 'Download our app update for improved performance and new perks.',      date: '06/23/2026', read: false },
];

const FILTER_CHIPS = ['View all', 'Unread', 'Last 30 days', 'Last 6 Months', 'This year', 'Last year'];

// ─── NotificationsPage ───────────────────────────────────────────────────────

export const NotificationsPage = () => {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('View all');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    return true;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title + filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: '22px',
            lineHeight: '28.6px',
            color: '#474743',
          }}
        >
          Notification
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#433C50', whiteSpace: 'nowrap' }}>
            Quick Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {FILTER_CHIPS.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <Box
                  key={chip}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveFilter(chip)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveFilter(chip); }}
                  sx={{
                    px: '16px',
                    py: '6px',
                    borderRadius: '500px',
                    border: '1px solid #E3E6EC',
                    backgroundColor: isActive ? '#476D59' : '#FFFFFF',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isActive ? '#476D59' : '#F7F8FB' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: '12px',
                      color: isActive ? '#FFFFFF' : '#433C50',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chip}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Notification table */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E3E6EC',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #E3E6EC',
            backgroundColor: '#F7F8FB',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, px: '20px', py: '14px', borderRight: '1px solid #E3E6EC' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#1A1F1A' }}>Message</Typography>
          </Box>
          <Box sx={{ width: { xs: 96, md: 160 }, flexShrink: 0, px: '8px', py: '14px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#1A1F1A', textAlign: 'center' }}>Date</Typography>
          </Box>
        </Box>

        {/* Rows */}
        {filtered.map((n, i) => (
          <Box
            key={n.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #E3E6EC' : 'none',
              backgroundColor: n.read ? '#FFFFFF' : '#F0F7FF',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, px: '20px', py: '12px', borderRight: '1px solid #E3E6EC' }}>
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: n.read ? fontWeight.medium : fontWeight.semiBold,
                  fontSize: '12px',
                  lineHeight: '16.8px',
                  color: '#41403B',
                }}
              >
                {n.message}
              </Typography>
            </Box>
            <Box sx={{ width: { xs: 96, md: 160 }, flexShrink: 0, px: '8px', py: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '12px', color: '#41403B', textAlign: 'center' }}>
                {n.date}
              </Typography>
            </Box>
          </Box>
        ))}

        {filtered.length === 0 && (
          <Box sx={{ py: '40px', textAlign: 'center' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '14px', color: '#7F7F79' }}>No notifications found.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
