'use client';

import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import { walherb } from '../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../../design-system/tokens/typography';
import { spacing } from '../../design-system/tokens/spacing';
import { radius } from '../../design-system/tokens/radius';
import { PRICE_MIN, PRICE_MAX } from '../../data/categoryData';

// ─── Filter state type ────────────────────────────────────────────────────────

export interface FilterState {
  brands: string[];
  types: string[];
  forms: string[];
  dietary: string[];
  availability: string[];
  minRating: number;
  priceRange: [number, number];
  onSale: boolean;
  buyMore: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  brands: [],
  types: [],
  forms: [],
  dietary: [],
  availability: [],
  minRating: 0,
  priceRange: [PRICE_MIN, PRICE_MAX],
  onSale: false,
  buyMore: false,
};

export function countActiveFilters(f: FilterState): number {
  let n = f.brands.length + f.types.length + f.forms.length + f.dietary.length + f.availability.length;
  if (f.minRating > 0) n++;
  if (f.priceRange[0] > PRICE_MIN || f.priceRange[1] < PRICE_MAX) n++;
  if (f.onSale) n++;
  if (f.buyMore) n++;
  return n;
}

// ─── Shared popover wrapper ───────────────────────────────────────────────────

interface PopoverWrapperProps {
  label: string;
  active: boolean;
  count?: number;
  icon?: React.ReactNode;
  hideArrow?: boolean;
  children: (onClose: () => void) => React.ReactNode;
  onApply: () => void;
  onClear: () => void;
}

const PopoverWrapper = ({ label, active, count, icon, hideArrow = false, children, onApply, onClear }: PopoverWrapperProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleApply = () => { onApply(); handleClose(); };
  const handleClear = () => { onClear(); };

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          px: '16px',
          py: '12px',
          border: `1px solid ${active ? walherb.greenPrimary : walherb.borderNav}`,
          borderRadius: '32px',
          cursor: 'pointer',
          backgroundColor: active ? walherb.greenBg : '#FFFFFF',
          transition: 'border-color 0.15s, background-color 0.15s',
          '&:hover': { borderColor: walherb.greenPrimary },
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {icon}
        <Typography
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: '16px',
            lineHeight: '22.4px',
            color: active ? walherb.greenPrimary : walherb.textHeading,
          }}
        >
          {label}{count ? ` (${count})` : ''}
        </Typography>
        {!hideArrow && (
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 16,
              color: active ? walherb.greenPrimary : walherb.textHeading,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        )}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: '6px',
              borderRadius: '10px',
              border: `1px solid ${walherb.borderNav}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              minWidth: 280,
              maxWidth: 340,
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
          {children(handleClose)}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: `${spacing.s8}px`,
            px: `${spacing.s16}px`,
            py: `${spacing.s12}px`,
            borderTop: `1px solid ${walherb.borderNav}`,
            backgroundColor: '#FAFAFA',
          }}
        >
          <Button
            onClick={handleClear}
            variant="outlined"
            size="small"
            sx={{
              flex: 1,
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: `${fontSize.b3}px`,
              textTransform: 'none',
              borderColor: walherb.borderNav,
              color: walherb.textPrimary,
              borderRadius: `${radius.radiusFull}px`,
              '&:hover': { borderColor: walherb.greenPrimary, color: walherb.greenPrimary },
            }}
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            size="small"
            sx={{
              flex: 2,
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semiBold,
              fontSize: `${fontSize.b3}px`,
              textTransform: 'none',
              backgroundColor: walherb.greenPrimary,
              color: '#FFFFFF',
              borderRadius: `${radius.radiusFull}px`,
              boxShadow: 'none',
              '&:hover': { backgroundColor: walherb.greenDark, boxShadow: 'none' },
            }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
};

// ─── Checkbox filter content ──────────────────────────────────────────────────

interface CheckboxFilterProps {
  options: string[];
  selected: string[];
  pending: string[];
  onToggle: (v: string) => void;
  searchable?: boolean;
}

const CheckboxFilterContent = ({ options, pending, onToggle, searchable = false }: CheckboxFilterProps) => {
  const [query, setQuery] = useState('');
  const filtered = searchable && query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <Box sx={{ px: `${spacing.s16}px`, pt: `${spacing.s12}px`, pb: `${spacing.s4}px` }}>
      {searchable && (
        <TextField
          size="small"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          fullWidth
          sx={{
            mb: `${spacing.s8}px`,
            '& .MuiOutlinedInput-root': {
              fontFamily: fontFamily.sans,
              fontSize: `${fontSize.b3}px`,
              borderRadius: '8px',
              '& fieldset': { borderColor: walherb.borderNav },
              '&:hover fieldset': { borderColor: walherb.greenPrimary },
              '&.Mui-focused fieldset': { borderColor: walherb.greenPrimary },
            },
          }}
        />
      )}
      {filtered.map(option => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={pending.includes(option)}
              onChange={() => onToggle(option)}
              size="small"
              sx={{
                color: walherb.borderNav,
                '&.Mui-checked': { color: walherb.greenPrimary },
                p: '4px',
                mr: '4px',
              }}
            />
          }
          label={
            <Typography sx={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: `${fontSize.b3}px`,
              color: walherb.textPrimary,
            }}>
              {option}
            </Typography>
          }
          sx={{ display: 'flex', alignItems: 'center', mx: 0, mb: '2px' }}
        />
      ))}
    </Box>
  );
};

// ─── Rating filter content ────────────────────────────────────────────────────

const RATING_OPTIONS = [
  { value: 4.7, label: '4.7★ & up' },
  { value: 4.5, label: '4.5★ & up' },
  { value: 4.0, label: '4.0★ & up' },
  { value: 3.5, label: '3.5★ & up' },
];

interface RatingFilterProps {
  pending: number;
  onSelect: (v: number) => void;
}

const RatingFilterContent = ({ pending, onSelect }: RatingFilterProps) => (
  <Box sx={{ px: `${spacing.s16}px`, py: `${spacing.s12}px` }}>
    {RATING_OPTIONS.map(opt => (
      <Box
        key={opt.value}
        onClick={() => onSelect(pending === opt.value ? 0 : opt.value)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          py: '6px',
          cursor: 'pointer',
          borderRadius: '6px',
          px: '8px',
          mx: '-8px',
          backgroundColor: pending === opt.value ? walherb.greenBg : 'transparent',
          '&:hover': { backgroundColor: walherb.bgPage },
        }}
      >
        <Box
          sx={{
            width: 16, height: 16,
            borderRadius: '50%',
            border: `2px solid ${pending === opt.value ? walherb.greenPrimary : walherb.borderNav}`,
            backgroundColor: pending === opt.value ? walherb.greenPrimary : 'transparent',
            flexShrink: 0,
          }}
        />
        <StarRateIcon sx={{ fontSize: 16, color: '#F5A623' }} />
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: `${fontSize.b3}px`,
          color: walherb.textPrimary,
        }}>
          {opt.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

// ─── Price filter content ─────────────────────────────────────────────────────

interface PriceFilterProps {
  pending: [number, number];
  onChange: (v: [number, number]) => void;
}

const PriceFilterContent = ({ pending, onChange }: PriceFilterProps) => (
  <Box sx={{ px: `${spacing.s20}px`, pt: `${spacing.s16}px`, pb: `${spacing.s8}px` }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: `${spacing.s8}px` }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>
        ₹{pending[0].toLocaleString('en-IN')}
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>
        ₹{pending[1].toLocaleString('en-IN')}
      </Typography>
    </Box>
    <Slider
      value={pending}
      onChange={(_, v) => onChange(v as [number, number])}
      min={PRICE_MIN}
      max={PRICE_MAX}
      step={100}
      disableSwap
      sx={{
        color: walherb.greenPrimary,
        '& .MuiSlider-thumb': {
          width: 18, height: 18,
          '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 8px ${walherb.greenBg}` },
        },
        '& .MuiSlider-track': { border: 'none' },
        '& .MuiSlider-rail': { backgroundColor: walherb.borderNav, opacity: 1 },
      }}
    />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '2px' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b4}px`, color: '#A0A0A0' }}>
        ₹{PRICE_MIN.toLocaleString('en-IN')}
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b4}px`, color: '#A0A0A0' }}>
        ₹{PRICE_MAX.toLocaleString('en-IN')}
      </Typography>
    </Box>
  </Box>
);

// ─── Filter bar (all chips) ───────────────────────────────────────────────────

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  brandOptions: string[];
  typeOptions: string[];
  sortBy: string;
  onSortChange: (s: string) => void;
  sortOptions: { value: string; label: string }[];
  totalCount: number;
  onMobileFilterOpen: () => void;
}

export const FilterBar = ({
  filters, onFiltersChange,
  brandOptions, typeOptions,
  sortBy, onSortChange, sortOptions, totalCount, onMobileFilterOpen,
}: FilterBarProps) => {
  const [pending, setPending] = useState<FilterState>({ ...filters });

  const toggle = (key: keyof Pick<FilterState, 'brands' | 'types'>, val: string) => {
    setPending(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  };

  const syncAndOpen = () => setPending({ ...filters });

  const apply = (patch: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const clearKey = (key: keyof FilterState) => {
    if (key === 'priceRange') {
      setPending(p => ({ ...p, priceRange: [PRICE_MIN, PRICE_MAX] }));
    } else if (key === 'minRating') {
      setPending(p => ({ ...p, minRating: 0 }));
    } else {
      setPending(p => ({ ...p, [key]: [] }));
    }
  };

  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const sortOpen = Boolean(sortAnchorEl);
  const currentSortLabel = sortOptions.find(s => s.value === sortBy)?.label ?? 'Featured';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: `${spacing.s8}px`,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        pb: '2px',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Mobile filter/sort buttons */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: `${spacing.s8}px`, flexShrink: 0 }}>
        <Box
          onClick={onMobileFilterOpen}
          sx={{
            display: 'flex', alignItems: 'center', gap: '4px',
            px: `${spacing.s12}px`, py: '6px',
            border: `1.5px solid ${countActiveFilters(filters) > 0 ? walherb.greenPrimary : walherb.borderNav}`,
            borderRadius: `${radius.radiusFull}px`,
            cursor: 'pointer',
            backgroundColor: countActiveFilters(filters) > 0 ? walherb.greenBg : '#FFFFFF',
          }}
        >
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b3}px`, color: countActiveFilters(filters) > 0 ? walherb.greenPrimary : walherb.textPrimary }}>
            Filters{countActiveFilters(filters) > 0 ? ` (${countActiveFilters(filters)})` : ''}
          </Typography>
        </Box>
      </Box>

      {/* Desktop filter chips */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: `${spacing.s8}px`, flexWrap: 'nowrap' }}>
        {/* Rating */}
        <PopoverWrapper
          label="4+ Ratings"
          icon={<StarRateIcon sx={{ fontSize: 16, color: filters.minRating > 0 ? walherb.greenPrimary : '#F5A623' }} />}
          active={filters.minRating > 0}
          onApply={() => apply({ minRating: pending.minRating })}
          onClear={() => { clearKey('minRating'); apply({ minRating: 0 }); }}
        >
          {() => (
            <RatingFilterContent
              pending={pending.minRating}
              onSelect={v => setPending(p => ({ ...p, minRating: v }))}
            />
          )}
        </PopoverWrapper>

        {/* Brand */}
        <PopoverWrapper
          label="Brand"
          active={filters.brands.length > 0}
          count={filters.brands.length || undefined}
          onApply={() => apply({ brands: pending.brands })}
          onClear={() => { clearKey('brands'); apply({ brands: [] }); }}
        >
          {() => (
            <CheckboxFilterContent
              options={brandOptions}
              selected={filters.brands}
              pending={pending.brands}
              onToggle={v => toggle('brands', v)}
              searchable
            />
          )}
        </PopoverWrapper>

        {/* Price Range */}
        <PopoverWrapper
          label="Price Range"
          hideArrow
          active={filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX}
          onApply={() => apply({ priceRange: pending.priceRange })}
          onClear={() => { clearKey('priceRange'); apply({ priceRange: [PRICE_MIN, PRICE_MAX] }); }}
        >
          {() => (
            <PriceFilterContent
              pending={pending.priceRange}
              onChange={v => setPending(p => ({ ...p, priceRange: v }))}
            />
          )}
        </PopoverWrapper>
      </Box>

      {/* Sort */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`, flexShrink: 0 }}>
        <Box
          onClick={e => setSortAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex', alignItems: 'center', gap: '6px',
            px: '16px', py: '12px',
            border: `1px solid ${walherb.borderNav}`,
            borderRadius: '32px',
            cursor: 'pointer',
            backgroundColor: '#FFFFFF',
            '&:hover': { borderColor: walherb.greenPrimary },
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '16px', lineHeight: '22.4px', color: walherb.textHeading }}>
            Sort by
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: walherb.textHeading, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </Box>
        <Popover
          open={sortOpen}
          anchorEl={sortAnchorEl}
          onClose={() => setSortAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                mt: '6px', borderRadius: '10px',
                border: `1px solid ${walherb.borderNav}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                minWidth: 200, overflow: 'hidden',
              },
            },
          }}
        >
          <Box sx={{ py: `${spacing.s8}px` }}>
            {sortOptions.map(opt => (
              <Box
                key={opt.value}
                onClick={() => { onSortChange(opt.value); setSortAnchorEl(null); }}
                sx={{
                  px: `${spacing.s16}px`, py: '8px',
                  cursor: 'pointer',
                  backgroundColor: sortBy === opt.value ? walherb.greenBg : 'transparent',
                  '&:hover': { backgroundColor: walherb.bgPage },
                }}
              >
                <Typography sx={{
                  fontFamily: fontFamily.sans,
                  fontWeight: sortBy === opt.value ? fontWeight.semiBold : fontWeight.regular,
                  fontSize: `${fontSize.b3}px`,
                  color: sortBy === opt.value ? walherb.greenPrimary : walherb.textPrimary,
                }}>
                  {opt.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
};

// ─── Applied filter chips ─────────────────────────────────────────────────────

interface AppliedFiltersProps {
  filters: FilterState;
  onRemoveBrand: (v: string) => void;
  onRemoveType: (v: string) => void;
  onRemoveForm: (v: string) => void;
  onRemoveDietary: (v: string) => void;
  onRemoveAvailability: (v: string) => void;
  onClearRating: () => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const AppliedFilters = ({
  filters, onRemoveBrand, onRemoveType, onRemoveForm,
  onRemoveDietary, onRemoveAvailability, onClearRating, onClearPrice, onClearAll,
}: AppliedFiltersProps) => {
  const chips: { label: string; onRemove: () => void }[] = [
    ...filters.brands.map(v => ({ label: v, onRemove: () => onRemoveBrand(v) })),
    ...filters.types.map(v => ({ label: v, onRemove: () => onRemoveType(v) })),
    ...filters.forms.map(v => ({ label: v, onRemove: () => onRemoveForm(v) })),
    ...filters.dietary.map(v => ({ label: v, onRemove: () => onRemoveDietary(v) })),
    ...filters.availability.map(v => ({ label: v, onRemove: () => onRemoveAvailability(v) })),
    ...(filters.minRating > 0 ? [{ label: `${filters.minRating}★ & up`, onRemove: onClearRating }] : []),
    ...(filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX
      ? [{ label: `${fmt(filters.priceRange[0])} – ${fmt(filters.priceRange[1])}`, onRemove: onClearPrice }]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: `${spacing.s8}px`, flexWrap: 'wrap' }}>
      {chips.map(chip => (
        <Chip
          key={chip.label}
          label={chip.label}
          onDelete={chip.onRemove}
          deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
          size="small"
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: `${fontSize.b3}px`,
            backgroundColor: walherb.greenBg,
            color: walherb.greenPrimary,
            border: `1px solid ${walherb.greenBadgeBorder}`,
            '& .MuiChip-deleteIcon': { color: walherb.greenPrimary },
            '& .MuiChip-deleteIcon:hover': { color: walherb.greenDark },
          }}
        />
      ))}
      <Box
        onClick={onClearAll}
        sx={{
          cursor: 'pointer',
          px: '8px', py: '2px',
          borderRadius: `${radius.radiusFull}px`,
          '&:hover': { backgroundColor: walherb.bgPage },
        }}
      >
        <Typography sx={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: `${fontSize.b3}px`,
          color: walherb.textPrimary,
          textDecoration: 'underline',
        }}>
          Clear All
        </Typography>
      </Box>
    </Box>
  );
};
