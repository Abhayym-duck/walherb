'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { CATEGORY_TREE } from '../../data/categoryData';

const VISIBLE_LIMIT = 7;

interface CategorySidebarProps {
  activeCategoryId: string;
  onCategorySelect: (id: string) => void;
  onSaleActive?: boolean;
  buyMoreActive?: boolean;
  onSaleToggle?: () => void;
  buyMoreToggle?: () => void;
}

const rowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  pl: '16px',
  pr: '12px',
  py: '13.5px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
};

const SectionHeader = ({ label }: { label: string }) => (
  <Typography sx={{
    fontFamily: fontFamily.sans,
    fontWeight: fontWeight.medium,
    fontSize: '18px',
    lineHeight: '23.4px',
    color: walherb.textHeading,
  }}>
    {label}
  </Typography>
);

const rowText = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.medium,
  fontSize: '14px',
  lineHeight: '18.2px',
  color: '#444050',
  flex: 1,
};

export const CategorySidebar = ({
  activeCategoryId,
  onCategorySelect,
  onSaleActive = false,
  buyMoreActive = false,
  onSaleToggle,
  buyMoreToggle,
}: CategorySidebarProps) => {
  const [showAll, setShowAll] = useState(false);

  const supplements = CATEGORY_TREE.find(n => n.id === 'supplements');
  const allCategories = supplements?.children ?? CATEGORY_TREE;
  const visibleCategories = showAll ? allCategories : allCategories.slice(0, VISIBLE_LIMIT);
  const hiddenCount = Math.max(0, allCategories.length - VISIBLE_LIMIT);

  return (
    <Box
      sx={{
        width: 301,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: '16px',
        position: 'sticky',
        top: 80,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        alignSelf: 'flex-start',
        backgroundColor: walherb.bgPage,
        border: `1px solid ${walherb.borderNav}`,
        borderRadius: '16px',
        p: '24px',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: walherb.borderNav, borderRadius: 4 },
      }}
    >
      {/* ── Filters ──────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SectionHeader label="Filters" />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{ ...rowSx, '&:hover': { backgroundColor: 'rgba(71,109,89,0.06)' } }}
            onClick={buyMoreToggle}
          >
            <Box sx={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {buyMoreActive
                ? <CheckBoxIcon sx={{ fontSize: 16, color: walherb.greenPrimary }} />
                : <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: walherb.textHeading }} />}
            </Box>
            <Typography sx={rowText}>Buy more save more</Typography>
          </Box>

          <Box
            sx={{ ...rowSx, '&:hover': { backgroundColor: 'rgba(71,109,89,0.06)' } }}
            onClick={onSaleToggle}
          >
            <Box sx={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {onSaleActive
                ? <CheckBoxIcon sx={{ fontSize: 16, color: walherb.greenPrimary }} />
                : <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, color: walherb.textHeading }} />}
            </Box>
            <Typography sx={rowText}>On sale</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Categories ───────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SectionHeader label="Categories" />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {visibleCategories.map(cat => {
            const isActive = cat.id === activeCategoryId;
            return (
              <Box
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                sx={{
                  ...rowSx,
                  backgroundColor: isActive ? 'rgba(71,109,89,0.08)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(71,109,89,0.08)' },
                }}
              >
                <Typography sx={{ ...rowText, color: isActive ? walherb.greenPrimary : '#444050' }}>
                  {cat.label} ({cat.count.toLocaleString()})
                </Typography>
              </Box>
            );
          })}
          {hiddenCount > 0 && !showAll && (
            <Box
              onClick={() => setShowAll(true)}
              sx={{ ...rowSx, '&:hover': { backgroundColor: 'rgba(71,109,89,0.06)' } }}
            >
              <Typography sx={{ ...rowText, color: walherb.greenPrimary, textDecoration: 'underline' }}>
                View {hiddenCount} more
              </Typography>
            </Box>
          )}
          {showAll && hiddenCount > 0 && (
            <Box
              onClick={() => setShowAll(false)}
              sx={{ ...rowSx, '&:hover': { backgroundColor: 'rgba(71,109,89,0.06)' } }}
            >
              <Typography sx={{ ...rowText, color: walherb.greenPrimary, textDecoration: 'underline' }}>
                Show less
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default CategorySidebar;
