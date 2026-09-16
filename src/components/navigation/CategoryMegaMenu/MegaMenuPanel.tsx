'use client';

import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../../design-system/tokens/typography';
import { spacing } from '../../../design-system/tokens/spacing';
import type { NavMegaMenu, MenuGroup } from './types';

// ─── Single sub-item row ──────────────────────────────────────────────────────

const SubItem = memo(({
  label, onClick,
}: { label: string; onClick: () => void }) => (
  <Box
    role="menuitem"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    sx={{
      py: '3px',
      cursor: 'pointer',
      '&:hover p': { color: walherb.greenPrimary },
      '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '2px', borderRadius: '2px' },
    }}
  >
    <Typography
      component="p"
      sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.regular,
        fontSize: `${fontSize.b3}px`,
        color: '#474743',
        lineHeight: '20px',
        transition: 'color 0.12s',
      }}
    >
      {label}
    </Typography>
  </Box>
));
SubItem.displayName = 'SubItem';

// ─── Group header row ─────────────────────────────────────────────────────────

const GroupHeader = memo(({
  label, onClick,
}: { label: string; onClick: () => void }) => (
  <Box
    role="menuitem"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      cursor: 'pointer',
      mb: '6px',
      '&:hover p': { color: walherb.greenDark },
      '&:hover svg': { color: walherb.greenDark },
      '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '2px', borderRadius: '2px' },
    }}
  >
    <Typography
      component="p"
      sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semiBold,
        fontSize: `${fontSize.b3}px`,
        color: walherb.greenPrimary,
        lineHeight: '20px',
        transition: 'color 0.12s',
      }}
    >
      {label}
    </Typography>
    <ChevronRightIcon sx={{ fontSize: 13, color: walherb.greenPrimary, transition: 'color 0.12s', flexShrink: 0 }} />
  </Box>
));
GroupHeader.displayName = 'GroupHeader';

// ─── "Shop all" footer link ───────────────────────────────────────────────────

const ShopAllLink = memo(({
  label, onClick,
}: { label: string; onClick: () => void }) => (
  <Box
    role="menuitem"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      cursor: 'pointer',
      mt: `${spacing.s8}px`,
      '&:hover p': { textDecoration: 'underline' },
      '&:focus-visible': { outline: `2px solid ${walherb.greenPrimary}`, outlineOffset: '2px', borderRadius: '2px' },
    }}
  >
    <Typography
      component="p"
      sx={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semiBold,
        fontSize: `${fontSize.b3}px`,
        color: walherb.greenPrimary,
        lineHeight: '20px',
      }}
    >
      {label}
    </Typography>
    <ChevronRightIcon sx={{ fontSize: 13, color: walherb.greenPrimary, flexShrink: 0 }} />
  </Box>
));
ShopAllLink.displayName = 'ShopAllLink';

// ─── One category block: header + items + optional "View all" ─────────────────

const GroupBlock = memo(({
  group, onItemClick,
}: { group: MenuGroup; onItemClick: (id: string) => void }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <GroupHeader label={group.label} onClick={() => onItemClick(group.id)} />
    {group.items?.map(item => (
      <SubItem key={item.id} label={item.label} onClick={() => onItemClick(item.id)} />
    ))}
    {group.viewAllLabel && (
      <ShopAllLink
        label={group.viewAllLabel}
        onClick={() => onItemClick(group.viewAllCategoryId ?? group.id)}
      />
    )}
  </Box>
));
GroupBlock.displayName = 'GroupBlock';

// ─── Full-width mega menu panel ───────────────────────────────────────────────

interface MegaMenuPanelProps {
  menu: NavMegaMenu;
  isOpen: boolean;
  onItemClick: (categoryId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MegaMenuPanel = memo(({
  menu, isOpen, onItemClick, onMouseEnter, onMouseLeave,
}: MegaMenuPanelProps) => {
  const colCount = menu.columnCount ?? 5;
  const isFlow = menu.layout === 'flow';
  // Flow layout flattens every group into one responsive auto-filling grid
  const flowGroups = isFlow ? menu.columns.flatMap(c => c.groups) : [];

  return (
    // Full-width overlay, absolutely positioned below the sticky header
    <Box
      role="menu"
      aria-label={`${menu.id} category menu`}
      aria-hidden={!isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: `1px solid ${walherb.borderNav}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        // Fade + slide animation — stays mounted for smooth exit
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 150ms ease, transform 150ms ease',
        pointerEvents: isOpen ? 'auto' : 'none',
        zIndex: 10,
      }}
    >
      {/* Inner content — respects page margins */}
      <Box
        sx={{
          maxWidth: 1728,
          mx: 'auto',
          px: { xs: `${spacing.s16}px`, md: `${spacing.s80}px` },
          py: `${spacing.s32}px`,
        }}
      >
        {isFlow ? (
          /* Flowing marketplace grid — every section wraps responsively, no h-scroll */
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              columnGap: { xs: `${spacing.s24}px`, md: `${spacing.s32}px`, xl: `${spacing.s40}px` },
              rowGap: `${spacing.s32}px`,
              alignItems: 'start',
            }}
          >
            {flowGroups.map(group => (
              <GroupBlock key={group.id} group={group} onItemClick={onItemClick} />
            ))}
          </Box>
        ) : (
          /* Fixed column grid — one menu column per data column */
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${colCount}, 1fr)`,
              columnGap: { xs: `${spacing.s24}px`, md: `${spacing.s32}px`, xl: `${spacing.s40}px` },
              rowGap: `${spacing.s24}px`,
              alignItems: 'start',
            }}
          >
            {menu.columns.map((column, colIdx) => (
              <Box
                key={colIdx}
                sx={{ display: 'flex', flexDirection: 'column', gap: `${spacing.s24}px` }}
              >
                {column.groups.map(group => (
                  <GroupBlock key={group.id} group={group} onItemClick={onItemClick} />
                ))}

                {/* "Shop all" link in the last column */}
                {colIdx === menu.columns.length - 1 && menu.shopAllLabel && (
                  <ShopAllLink
                    label={menu.shopAllLabel}
                    onClick={() => onItemClick(menu.shopAllCategoryId ?? menu.id)}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
});
MegaMenuPanel.displayName = 'MegaMenuPanel';

export default MegaMenuPanel;
