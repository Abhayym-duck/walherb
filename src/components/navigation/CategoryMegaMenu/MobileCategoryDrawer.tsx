'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../../design-system/tokens/typography';
import { spacing } from '../../../design-system/tokens/spacing';
import { radius } from '../../../design-system/tokens/radius';
import { ALL_CATEGORIES_SECTIONS } from './categoryMenuData';
import type { AccountSection } from '../../Account/AccountSidebar';
import { useAuth } from '../../../context/AuthContext';

const ACCOUNT_ITEMS: { key: AccountSection; label: string }[] = [
  { key: 'orders',              label: 'My Orders'                },
  { key: 'kyc',                 label: 'Know Your Customer (KYC)' },
  { key: 'notifications',       label: 'Notification'             },
  { key: 'account-information', label: 'Account Information'      },
  { key: 'addresses',           label: 'Address Book'            },
  { key: 'payment-methods',     label: 'Payment Methods'         },
  { key: '2-step-verification', label: '2 Step Verification'     },
];

interface MobileCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onCategoryNav?: (categoryId: string) => void;
  onAccountNavigate?: (section: AccountSection) => void;
}

export const MobileCategoryDrawer = ({ open, onClose, onCategoryNav, onAccountNavigate }: MobileCategoryDrawerProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { signedIn, openSignIn, signOut } = useAuth();

  const handleSignIn = useCallback(() => { openSignIn(); onClose(); }, [openSignIn, onClose]);
  const handleSignOut = useCallback(() => { signOut(); onClose(); }, [signOut, onClose]);

  const toggle = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const handleNav = useCallback((categoryId: string) => {
    onCategoryNav?.(categoryId);
    onClose();
  }, [onCategoryNav, onClose]);

  const handleAccount = useCallback((section: AccountSection) => {
    onAccountNavigate?.(section);
    onClose();
  }, [onAccountNavigate, onClose]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: '86vw',
          maxWidth: 360,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: walherb.greenPrimary,
          px: `${spacing.s16}px`,
          py: `${spacing.s14}px`,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semiBold,
            fontSize: `${fontSize.t3}px`,
            color: '#FFFFFF',
          }}
        >
          All Categories
        </Typography>
        <IconButton aria-label="Close categories menu" onClick={onClose} size="small" sx={{ color: '#FFFFFF', mr: '-6px' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Department accordions ──────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: `${spacing.s8}px` }}>
        {ALL_CATEGORIES_SECTIONS.map((dept) => {
          const isExpanded = expandedId === dept.id;
          return (
            <Box key={dept.id} sx={{ borderBottom: `1px solid ${walherb.borderNav}` }}>
              {/* Department row — expands sub-categories */}
              <Box
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggle(dept.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(dept.id); } }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: `${spacing.s16}px`,
                  py: `${spacing.s14}px`,
                  cursor: 'pointer',
                  userSelect: 'none',
                  '&:hover': { backgroundColor: walherb.bgPage },
                  '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.medium,
                    fontSize: `${fontSize.t4}px`,
                    color: isExpanded ? walherb.greenPrimary : walherb.textPrimary,
                  }}
                >
                  {dept.label}
                </Typography>
                <ExpandMoreIcon
                  sx={{
                    fontSize: 20,
                    color: isExpanded ? walherb.greenPrimary : '#A6ABB7',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </Box>

              {/* Sub-categories */}
              <Collapse in={isExpanded} unmountOnExit>
                <Box sx={{ backgroundColor: walherb.bgPage, pb: `${spacing.s8}px` }}>
                  {/* View all department link */}
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNav(dept.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNav(dept.id); }}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      cursor: 'pointer',
                      pl: `${spacing.s16}px`,
                      pr: `${spacing.s12}px`,
                      py: `${spacing.s8}px`,
                      '&:hover p': { textDecoration: 'underline' },
                      '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        fontFamily: fontFamily.sans,
                        fontWeight: fontWeight.semiBold,
                        fontSize: `${fontSize.b3}px`,
                        color: walherb.greenPrimary,
                      }}
                    >
                      View All {dept.label}
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 13, color: walherb.greenPrimary }} />
                  </Box>

                  {dept.groups.map((group) => (
                    <Box
                      key={group.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNav(group.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNav(group.id); }}
                      sx={{
                        px: `${spacing.s16}px`,
                        py: `${spacing.s10}px`,
                        cursor: 'pointer',
                        borderRadius: `${radius.radius8}px`,
                        '&:hover p': { color: walherb.greenPrimary },
                        '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                      }}
                    >
                      <Typography
                        component="p"
                        sx={{
                          fontFamily: fontFamily.sans,
                          fontWeight: fontWeight.regular,
                          fontSize: `${fontSize.b2}px`,
                          color: '#474743',
                          transition: 'color 0.12s',
                        }}
                      >
                        {group.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}

        {/* ── My Account section ───────────────────────────────── */}
        {onAccountNavigate && (
          <Box sx={{ mt: `${spacing.s8}px`, pt: `${spacing.s8}px`, borderTop: `1px solid ${walherb.borderNav}` }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: `${spacing.s8}px`,
                px: `${spacing.s16}px`,
                py: `${spacing.s10}px`,
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 20, color: walherb.greenPrimary }} />
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.semiBold,
                  fontSize: `${fontSize.t4}px`,
                  color: walherb.textPrimary,
                }}
              >
                My Account
              </Typography>
            </Box>

            {signedIn ? (
              <>
                {ACCOUNT_ITEMS.map(({ key, label }) => (
                  <Box
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleAccount(key)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAccount(key); }}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      minHeight: 44, px: `${spacing.s16}px`, py: `${spacing.s10}px`, cursor: 'pointer',
                      '&:hover p': { color: walherb.greenPrimary },
                      '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                    }}
                  >
                    <Typography component="p" sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b2}px`, color: '#474743', transition: 'color 0.12s' }}>
                      {label}
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 16, color: '#A6ABB7' }} />
                  </Box>
                ))}
                {/* Sign out */}
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={handleSignOut}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSignOut(); }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`,
                    minHeight: 44, px: `${spacing.s16}px`, py: `${spacing.s10}px`, mt: `${spacing.s4}px`, cursor: 'pointer',
                    borderTop: `1px solid ${walherb.borderNav}`,
                    '&:hover p': { color: walherb.greenPrimary },
                    '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 18, color: '#515854' }} />
                  <Typography component="p" sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b2}px`, color: '#515854', transition: 'color 0.12s' }}>
                    Sign out
                  </Typography>
                </Box>
              </>
            ) : (
              /* Signed out — single Sign in action */
              <Box
                role="button"
                tabIndex={0}
                onClick={handleSignIn}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSignIn(); }}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  minHeight: 44, px: `${spacing.s16}px`, py: `${spacing.s10}px`, cursor: 'pointer',
                  '&:hover p': { color: walherb.greenPrimary },
                  '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '-2px' },
                }}
              >
                <Typography component="p" sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.b2}px`, color: walherb.greenPrimary }}>
                  Sign in
                </Typography>
                <ChevronRightIcon sx={{ fontSize: 16, color: walherb.greenPrimary }} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default MobileCategoryDrawer;
