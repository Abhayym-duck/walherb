'use client';

import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  MegaMenuPanel,
  MobileCategoryDrawer,
  useMegaMenuHover,
  MEGA_MENU_MAP,
} from '../navigation/CategoryMegaMenu';
import type { AccountSection } from '../Account/AccountSidebar';

// ─── Nav item config ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'All Categories', id: 'all-categories' },
  { label: 'Supplements',    id: 'supplements'    },
  { label: 'Sports',         id: 'sports'         },
  { label: 'Bath',           id: 'bath'           },
  { label: 'Beauty',         id: 'beauty'         },
  { label: 'Baby',           id: 'baby-kids'      },
  { label: 'Pets',           id: 'pets'           },
];

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  onCategoryNav?: (categoryId: string) => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
  onLogoClick?: () => void;
}

/** Navigate to the search results route; App's popstate listener resolves the view. */
const goToSearch = (q: string) => {
  const term = q.trim();
  if (!term || typeof window === 'undefined') return;
  window.history.pushState({}, '', `/search?q=${encodeURIComponent(term)}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const SEARCH_INPUT_SX = {
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.regular,
  fontSize: `${fontSize.b3}px`,
  color: '#433C50',
  '&::placeholder': { color: '#A6ABB7', fontWeight: fontWeight.regular },
} as const;

export const Header = ({ onCategoryNav, onAccountClick, onAccountNavigate, onLogoClick }: HeaderProps = {}) => {
  const [query, setQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.location.pathname === '/search'
      ? new URLSearchParams(window.location.search).get('q') ?? ''
      : '';
  });
  const { totalItems, openDrawer } = useCart();
  const { signedIn, openSignIn } = useAuth();
  const cartDisplay = totalItems > 99 ? '99+' : String(totalItems).padStart(2, '0');

  const handleAccountButton = (anchor: HTMLElement) => {
    if (signedIn) onAccountClick?.(anchor);
    else openSignIn();
  };

  const { openMenuId, open, scheduleClose, cancelClose, closeImmediate } = useMegaMenuHover();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleNavMouseEnter = useCallback((id: string) => {
    if (window.innerWidth < 768) return;
    if (!MEGA_MENU_MAP.has(id)) return;
    open(id);
  }, [open]);

  const handleNavClick = useCallback((id: string) => {
    onCategoryNav?.(id);
    closeImmediate();
  }, [onCategoryNav, closeImmediate]);

  return (
    // sticky wrapper — mega menu panels use position:absolute relative to this
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        backgroundColor: '#FFFFFF',
        borderBottom: `1px solid ${walherb.borderNav}`,
        // overflow must remain visible so the absolute panel isn't clipped
        overflow: 'visible',
      }}
    >
      {/* ── Top row: logo / search / cart ─────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
          py: `${spacing.s16}px`,
        }}
      >
        {/* Logo + Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: `${spacing.s8}px`, md: `${spacing.s40}px` }, flex: 1 }}>
          {/* Mobile menu trigger — opens the All Categories drawer */}
          <IconButton
            aria-label="Open categories menu"
            aria-haspopup="true"
            aria-expanded={mobileDrawerOpen}
            onClick={() => setMobileDrawerOpen(true)}
            sx={{
              display: { xs: 'inline-flex', sm: 'none' },
              color: walherb.greenPrimary,
              ml: '-8px',
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <Typography
            onClick={onLogoClick}
            sx={{
              fontFamily: "var(--font-pacifico, 'Pacifico', cursive)",
              fontWeight: 400,
              fontSize: { xs: 20, md: 24 },
              color: walherb.greenPrimary,
              whiteSpace: 'nowrap',
              lineHeight: 'normal',
              userSelect: 'none',
              cursor: onLogoClick ? 'pointer' : 'default',
            }}
          >
            Walherb
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: `${spacing.s8}px`,
              backgroundColor: walherb.bgPage,
              border: `1px solid ${walherb.borderNav}`,
              borderRadius: `${radius.radiusFull}px`,
              px: `${spacing.s16}px`,
              py: `${spacing.s12}px`,
              flex: 1,
              maxWidth: 560,
            }}
          >
            <SearchIcon
              onClick={() => goToSearch(query)}
              sx={{ fontSize: 18, color: '#A6ABB7', cursor: 'pointer', flexShrink: 0, '&:hover': { color: '#476D59' } }}
            />
            <Box
              component="input"
              value={query}
              placeholder="Search 50,000+ wellness products"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') goToSearch(query); }}
              sx={SEARCH_INPUT_SX}
            />
          </Box>
        </Box>

        {/* Account + Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s12}px` }}>
          <Box
            onClick={(e) => handleAccountButton(e.currentTarget)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: `${spacing.s4}px`,
              px: `${spacing.s12}px`,
              py: `${spacing.s6}px`,
              borderRadius: `${radius.radiusFull}px`,
              cursor: 'pointer',
              '&:hover': { backgroundColor: walherb.bgPage },
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: walherb.greenPrimary }} />
            <Typography
              sx={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: `${fontSize.b3}px`,
                color: walherb.greenPrimary,
              }}
            >
              {signedIn ? 'My Account' : 'Sign in'}
            </Typography>
          </Box>

          <Box
            onClick={openDrawer}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: `${spacing.s12}px`,
              backgroundColor: walherb.greenPrimary,
              border: `1px solid #5B816D`,
              borderRadius: `${radius.radiusFull}px`,
              pl: `${spacing.s16}px`,
              pr: `${spacing.s8}px`,
              py: `${spacing.s6}px`,
              cursor: 'pointer',
              '&:hover': { backgroundColor: walherb.greenDark },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px` }}>
              <ShoppingCartIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.regular,
                  fontSize: `${fontSize.b3}px`,
                  color: '#FFFFFF',
                }}
              >
                Cart
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: walherb.greenIconDark,
                border: `1px solid #517763`,
                borderRadius: `${radius.radiusFull}px`,
                width: 32,
                height: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: `${fontSize.b3}px`,
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}
              >
                {cartDisplay}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Mobile search row (xs only) ──────────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          gap: `${spacing.s8}px`,
          backgroundColor: walherb.bgPage,
          border: `1px solid ${walherb.borderNav}`,
          borderRadius: `${radius.radiusFull}px`,
          px: `${spacing.s16}px`,
          py: `${spacing.s12}px`,
          mx: `${spacing.s16}px`,
          mb: `${spacing.s12}px`,
        }}
      >
        <SearchIcon
          onClick={() => goToSearch(query)}
          sx={{ fontSize: 18, color: '#A6ABB7', cursor: 'pointer', flexShrink: 0 }}
        />
        <Box
          component="input"
          value={query}
          placeholder="Search 50,000+ wellness products"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') goToSearch(query); }}
          sx={SEARCH_INPUT_SX}
        />
      </Box>

      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: walherb.bgPage,
          borderTop: `1px solid ${walherb.borderNav}`,
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: `${spacing.s24}px`,
          px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
          py: `${spacing.s14}px`,
          overflowX: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const hasMegaMenu = MEGA_MENU_MAP.has(item.id);
          const isMenuOpen = openMenuId === item.id;

          return (
            <Box
              key={item.id}
              role="button"
              tabIndex={0}
              aria-haspopup={hasMegaMenu ? 'true' : undefined}
              aria-expanded={hasMegaMenu ? isMenuOpen : undefined}
              onMouseEnter={() => handleNavMouseEnter(item.id)}
              onMouseLeave={scheduleClose}
              onClick={() => handleNavClick(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNavClick(item.id);
                if (e.key === 'Escape') closeImmediate();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: `${spacing.s4}px`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                py: '2px',
                borderBottom: isMenuOpen
                  ? `2px solid ${walherb.greenPrimary}`
                  : '2px solid transparent',
                transition: 'border-color 0.15s',
                '&:hover > p': { color: walherb.greenPrimary },
                '&:hover > svg': { color: walherb.greenPrimary },
                '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '4px' },
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: `${fontSize.t4}px`,
                  lineHeight: lineHeight.t4,
                  color: isMenuOpen ? walherb.greenPrimary : walherb.textPrimary,
                  transition: 'color 0.15s',
                }}
              >
                {item.label}
              </Typography>
              {hasMegaMenu && (
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 16,
                    color: isMenuOpen ? walherb.greenPrimary : walherb.textPrimary,
                    transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s, color 0.15s',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── Mega menu panels — absolutely positioned below nav bar ─────── */}
      {/*
        All panels are always rendered (opacity:0 / pointerEvents:none when closed)
        so CSS transitions work on both open and close.
      */}
      {NAV_ITEMS.map((item) => {
        const config = MEGA_MENU_MAP.get(item.id);
        if (!config) return null;
        return (
          <MegaMenuPanel
            key={item.id}
            menu={config}
            isOpen={openMenuId === item.id}
            onMouseEnter={() => { cancelClose(); open(item.id); }}
            onMouseLeave={scheduleClose}
            onItemClick={(categoryId) => {
              onCategoryNav?.(categoryId);
              closeImmediate();
            }}
          />
        );
      })}

      {/* ── Mobile: All Categories accordion drawer ────────────────────── */}
      <MobileCategoryDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onCategoryNav={onCategoryNav}
        onAccountNavigate={onAccountNavigate}
      />
    </Box>
  );
};

export default Header;
