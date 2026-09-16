'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarRateIcon from '@mui/icons-material/StarRate';
import InboxIcon from '@mui/icons-material/Inbox';

import { walherb } from '../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize } from '../design-system/tokens/typography';
import { spacing } from '../design-system/tokens/spacing';
import { radius } from '../design-system/tokens/radius';

import { CategorySidebar } from '../components/category/CategorySidebar';
import { FilterBar, AppliedFilters, DEFAULT_FILTERS, countActiveFilters } from '../components/category/FilterSystem';
import type { FilterState } from '../components/category/FilterSystem';
import { CatalogProductCard } from '../components/category/CatalogProductCard';
import Header from '../components/home/Header';
import type { AccountSection } from '../components/Account/AccountSidebar';

import {
  CATALOG_PRODUCTS, SORT_OPTIONS, BRANDS, TYPES,
  PRICE_MIN, PRICE_MAX,
  getAllCategoryIds, getCategoryById, getCategoryPath,
} from '../data/categoryData';
import type { CatalogProduct } from '../data/categoryData';

const PAGE_SIZE = 16;

const RATING_OPTIONS = [
  { value: 4.7, label: '4.7★ & up' },
  { value: 4.5, label: '4.5★ & up' },
  { value: 4.0, label: '4.0★ & up' },
  { value: 3.5, label: '3.5★ & up' },
];

// ─── Sorting ──────────────────────────────────────────────────────────────────

function sortProducts(products: CatalogProduct[], sortBy: string): CatalogProduct[] {
  const arr = [...products];
  switch (sortBy) {
    case 'best-selling':   return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'highest-rated':  return arr.sort((a, b) => b.rating - a.rating);
    case 'price-low':      return arr.sort((a, b) => a.priceValue - b.priceValue);
    case 'price-high':     return arr.sort((a, b) => b.priceValue - a.priceValue);
    case 'newest':         return arr.sort((a, b) => (b.badges.includes('New Arrival') ? 1 : -1) - (a.badges.includes('New Arrival') ? 1 : -1));
    case 'most-reviewed':  return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    default:               return arr.sort((a, b) => (b.badges.includes('Best Seller') ? 1 : 0) - (a.badges.includes('Best Seller') ? 1 : 0));
  }
}

// ─── Module-level helper components (must not be defined inside render) ──────

const MobileFilterSection = ({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) => (
  <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: `1px solid ${walherb.borderNav}` }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: `${spacing.s16}px` }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: active ? fontWeight.semiBold : fontWeight.medium, fontSize: `${fontSize.b2}px`, color: active ? walherb.greenPrimary : walherb.textHeading }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ px: `${spacing.s16}px`, pt: 0, pb: `${spacing.s12}px` }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

const MobileCheckboxList = ({ options, selected, onToggle, searchable = false }: { options: string[]; selected: string[]; onToggle: (v: string) => void; searchable?: boolean }) => {
  const [q, setQ] = useState('');
  const filtered = searchable && q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options;
  return (
    <Box>
      {searchable && (
        <TextField size="small" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} fullWidth sx={{ mb: '8px', '& .MuiOutlinedInput-root': { fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, borderRadius: '8px' } }} />
      )}
      {filtered.map(opt => (
        <FormControlLabel
          key={opt}
          control={<Checkbox checked={selected.includes(opt)} onChange={() => onToggle(opt)} size="small" sx={{ color: walherb.borderNav, '&.Mui-checked': { color: walherb.greenPrimary }, p: '4px', mr: '4px' }} />}
          label={<Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>{opt}</Typography>}
          sx={{ display: 'flex', alignItems: 'center', mx: 0, mb: '2px' }}
        />
      ))}
    </Box>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

interface CategoryPageProps {
  initialCategoryId?: string;
  onBack: () => void;
  onProductClick: (product: CatalogProduct) => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
  onLogoClick?: () => void;
}

/** Generic words ignored when matching a category label to products. */
const CATEGORY_STOPWORDS = new Set([
  'and', 'the', 'for', 'all', 'with', 'care', 'health', 'supplement', 'supplements',
  'products', 'goods', 'more', 'kids', 'baby', 'other', 'shop',
]);

export default function CategoryPage({ initialCategoryId = 'supplements', onBack, onProductClick, onAccountClick, onAccountNavigate, onLogoClick }: CategoryPageProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [mobileFilters, setMobileFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [mobileSortBy, setMobileSortBy] = useState('featured');

  const handleCategorySelect = useCallback((id: string) => {
    setCategoryId(id);
    setFilters({ ...DEFAULT_FILTERS });
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: string) => {
    setSortBy(s);
    setPage(1);
  }, []);

  const removeFromArray = (key: keyof Pick<FilterState, 'brands' | 'types' | 'forms' | 'dietary' | 'availability'>, val: string) => {
    handleFiltersChange({ ...filters, [key]: (filters[key] as string[]).filter(v => v !== val) });
  };

  const clearAll = () => {
    handleFiltersChange({ ...DEFAULT_FILTERS });
  };

  const openMobileFilter = () => {
    setMobileFilters({ ...filters });
    setMobileSortBy(sortBy);
    setMobileFilterOpen(true);
  };

  const applyMobileFilters = () => {
    handleFiltersChange(mobileFilters);
    handleSortChange(mobileSortBy);
    setMobileFilterOpen(false);
  };

  const toggleMobileArr = (key: keyof Pick<FilterState, 'brands' | 'types'>, val: string) => {
    setMobileFilters(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  };

  // ─── Filtering ───────────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    const validIds = new Set(getAllCategoryIds(categoryId));
    let result = CATALOG_PRODUCTS.filter(p => validIds.has(p.categoryId));

    // The mega menu surfaces far more categories than the demo catalog stocks
    // directly. When a category has no exact matches, fall back to keyword
    // relevance (then to the full catalog) so the grid is never empty.
    if (result.length === 0) {
      const label = (getCategoryById(categoryId)?.label ?? categoryId).toLowerCase();
      const keywords = `${categoryId.replace(/-/g, ' ')} ${label}`
        .split(/\s+/)
        .filter(w => w.length >= 3 && !CATEGORY_STOPWORDS.has(w));
      if (keywords.length) {
        result = CATALOG_PRODUCTS.filter(p => {
          const hay = `${p.title} ${p.type} ${p.brand} ${p.categoryId}`.toLowerCase();
          return keywords.some(k => hay.includes(k));
        });
      }
      if (result.length === 0) result = [...CATALOG_PRODUCTS];
    }

    if (filters.onSale)  result = result.filter(p => p.badges.includes('Sale'));
    if (filters.buyMore) result = result.filter(p => p.originalValue > p.priceValue);
    if (filters.brands.length > 0) result = result.filter(p => filters.brands.includes(p.brand));
    if (filters.types.length > 0)  result = result.filter(p => filters.types.includes(p.type));
    if (filters.forms.length > 0)  result = result.filter(p => filters.forms.includes(p.form));
    if (filters.dietary.length > 0) result = result.filter(p => filters.dietary.every(d => p.dietary.includes(d)));
    if (filters.availability.length > 0) result = result.filter(p => filters.availability.some(a => p.availability.includes(a)));
    if (filters.minRating > 0)    result = result.filter(p => p.rating >= filters.minRating);
    if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) {
      result = result.filter(p => p.priceValue >= filters.priceRange[0] && p.priceValue <= filters.priceRange[1]);
    }

    return sortProducts(result, sortBy);
  }, [categoryId, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const categoryNode = getCategoryById(categoryId);
  const breadcrumbs = getCategoryPath(categoryId);
  // Menu-only categories aren't in CATEGORY_TREE — derive a friendly title from the id.
  const displayLabel = categoryNode?.label
    ?? categoryId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const activeFilterCount = countActiveFilters(filters);
  const search = '';

  // ─── Pagination ──────────────────────────────────────────────────────────────

  const PaginationRow = () => {
    if (totalPages <= 1) return null;
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${spacing.s8}px`, pt: `${spacing.s32}px` }}>
        <PageBtn disabled={safePage === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}>←</PageBtn>
        {pages.map((p, i) =>
          p === '...'
            ? <Typography key={`ellipsis-${i}`} sx={{ px: '8px', color: '#A0A0A0', fontFamily: fontFamily.sans }}>…</Typography>
            : <PageBtn key={p} active={p === safePage} onClick={() => { setPage(p as number); window.scrollTo(0, 0); }}>{p}</PageBtn>
        )}
        <PageBtn disabled={safePage === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}>→</PageBtn>
      </Box>
    );
  };

  const PageBtn = ({ children, active = false, disabled = false, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) => (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '8px',
        border: `1.5px solid ${active ? walherb.greenPrimary : walherb.borderNav}`,
        backgroundColor: active ? walherb.greenPrimary : '#FFFFFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        '&:hover': !disabled ? { borderColor: walherb.greenPrimary } : {},
        transition: 'border-color 0.15s',
      }}
    >
      <Typography sx={{
        fontFamily: fontFamily.sans, fontWeight: active ? fontWeight.semiBold : fontWeight.regular,
        fontSize: `${fontSize.b3}px`, color: active ? '#FFFFFF' : walherb.textPrimary, lineHeight: 1,
      }}>
        {children}
      </Typography>
    </Box>
  );

  // ─── Skeleton grid ────────────────────────────────────────────────────────────

  const SkeletonGrid = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: { xs: '12px', sm: '16px', md: '24px' } }}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '10px', mb: '8px' }} />
          <Skeleton variant="text" height={20} sx={{ mb: '4px' }} />
          <Skeleton variant="text" height={16} width="60%" />
        </Box>
      ))}
    </Box>
  );

  // ─── Empty state ──────────────────────────────────────────────────────────────

  const EmptyState = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: `${spacing.s80}px`, gap: `${spacing.s16}px` }}>
      <InboxIcon sx={{ fontSize: 56, color: walherb.borderNav }} />
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.t3}px`, color: walherb.textHeading }}>
        No products found
      </Typography>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b2}px`, color: '#A0A0A0', textAlign: 'center', maxWidth: 320 }}>
        {activeFilterCount > 0 || search
          ? 'Try adjusting your filters or clearing your search to see more results.'
          : 'No products in this category yet.'}
      </Typography>
      {(activeFilterCount > 0 || search) && (
        <Button
          onClick={clearAll}
          variant="outlined"
          sx={{
            fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold,
            fontSize: `${fontSize.b3}px`, textTransform: 'none',
            borderColor: walherb.greenPrimary, color: walherb.greenPrimary,
            borderRadius: `${radius.radiusFull}px`,
            '&:hover': { backgroundColor: walherb.greenBg },
          }}
        >
          Clear Filters
        </Button>
      )}
    </Box>
  );

  // ─── Mobile filter drawer ─────────────────────────────────────────────────────

  const MobileFilterDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      slotProps={{ paper: { sx: { width: '85vw', maxWidth: 360, display: 'flex', flexDirection: 'column' } } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: `${spacing.s16}px`, py: `${spacing.s14}px`, borderBottom: `1px solid ${walherb.borderNav}` }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.t4}px`, color: walherb.textHeading }}>
          Filter & Sort
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Sort */}
        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: `1px solid ${walherb.borderNav}` }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: `${spacing.s16}px` }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b2}px`, color: walherb.textHeading }}>
              Sort By
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: `${spacing.s16}px`, pb: `${spacing.s12}px` }}>
            {SORT_OPTIONS.map(opt => (
              <Box key={opt.value} onClick={() => setMobileSortBy(opt.value)} sx={{ display: 'flex', alignItems: 'center', gap: '8px', py: '6px', cursor: 'pointer' }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${mobileSortBy === opt.value ? walherb.greenPrimary : walherb.borderNav}`, backgroundColor: mobileSortBy === opt.value ? walherb.greenPrimary : 'transparent', flexShrink: 0 }} />
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: mobileSortBy === opt.value ? fontWeight.semiBold : fontWeight.regular, fontSize: `${fontSize.b3}px`, color: mobileSortBy === opt.value ? walherb.greenPrimary : walherb.textPrimary }}>{opt.label}</Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Brand */}
        <MobileFilterSection title="Brand" active={mobileFilters.brands.length > 0}>
          <MobileCheckboxList options={BRANDS} selected={mobileFilters.brands} onToggle={v => toggleMobileArr('brands', v)} searchable />
        </MobileFilterSection>

        {/* Price Range */}
        <MobileFilterSection title="Price Range" active={mobileFilters.priceRange[0] > PRICE_MIN || mobileFilters.priceRange[1] < PRICE_MAX}>
          <Box sx={{ px: `${spacing.s8}px`, pb: `${spacing.s8}px` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>₹{mobileFilters.priceRange[0].toLocaleString('en-IN')}</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>₹{mobileFilters.priceRange[1].toLocaleString('en-IN')}</Typography>
            </Box>
            <Slider value={mobileFilters.priceRange} onChange={(_, v) => setMobileFilters(p => ({ ...p, priceRange: v as [number, number] }))} min={PRICE_MIN} max={PRICE_MAX} step={100} disableSwap sx={{ color: walherb.greenPrimary }} />
          </Box>
        </MobileFilterSection>

        {/* Rating */}
        <MobileFilterSection title="4+ Ratings" active={mobileFilters.minRating > 0}>
          {RATING_OPTIONS.map(opt => (
            <Box key={opt.value} onClick={() => setMobileFilters(p => ({ ...p, minRating: p.minRating === opt.value ? 0 : opt.value }))} sx={{ display: 'flex', alignItems: 'center', gap: '8px', py: '6px', cursor: 'pointer' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${mobileFilters.minRating === opt.value ? walherb.greenPrimary : walherb.borderNav}`, backgroundColor: mobileFilters.minRating === opt.value ? walherb.greenPrimary : 'transparent', flexShrink: 0 }} />
              <StarRateIcon sx={{ fontSize: 15, color: '#F5A623' }} />
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b3}px`, color: walherb.textPrimary }}>{opt.label}</Typography>
            </Box>
          ))}
        </MobileFilterSection>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', gap: `${spacing.s8}px`, px: `${spacing.s16}px`, py: `${spacing.s16}px`, borderTop: `1px solid ${walherb.borderNav}` }}>
        <Button onClick={() => { setMobileFilters({ ...DEFAULT_FILTERS }); setMobileSortBy('featured'); }} variant="outlined" sx={{ flex: 1, fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.b3}px`, textTransform: 'none', borderColor: walherb.borderNav, color: walherb.textPrimary, borderRadius: `${radius.radiusFull}px`, '&:hover': { borderColor: walherb.greenPrimary } }}>
          Clear All
        </Button>
        <Button onClick={applyMobileFilters} variant="contained" sx={{ flex: 2, fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: `${fontSize.b3}px`, textTransform: 'none', backgroundColor: walherb.greenPrimary, color: '#FFFFFF', borderRadius: `${radius.radiusFull}px`, boxShadow: 'none', '&:hover': { backgroundColor: walherb.greenDark, boxShadow: 'none' } }}>
          View {filteredProducts.length} Results
        </Button>
      </Box>
    </Drawer>
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Header onAccountClick={onAccountClick} onAccountNavigate={onAccountNavigate} onLogoClick={onLogoClick} />

      <Box
        sx={{
          maxWidth: 1728,
          mx: 'auto',
          px: { xs: '16px', md: '80px' },
          pt: '24px',
          pb: '40px',
        }}
      >
        {/* Back + Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '8px', flexWrap: 'wrap' }}>
          <Box
            onClick={onBack}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', mr: '4px', '&:hover': { opacity: 0.7 } }}
          >
            <ArrowBackIcon sx={{ fontSize: 14, color: walherb.textPrimary }} />
          </Box>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.id}>
              {i > 0 && <Typography sx={{ fontFamily: fontFamily.sans, fontSize: `${fontSize.b3}px`, color: '#C0C0C0' }}>/</Typography>}
              <Typography
                onClick={() => handleCategorySelect(crumb.id)}
                sx={{
                  fontFamily: fontFamily.sans, fontWeight: fontWeight.regular,
                  fontSize: `${fontSize.b3}px`,
                  color: i === breadcrumbs.length - 1 ? walherb.textPrimary : walherb.greenPrimary,
                  cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default',
                  '&:hover': i < breadcrumbs.length - 1 ? { textDecoration: 'underline' } : {},
                }}
              >
                {crumb.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>

        {/* Sidebar + content */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* Sidebar */}
          <CategorySidebar
            activeCategoryId={categoryId}
            onCategorySelect={handleCategorySelect}
            onSaleActive={filters.onSale}
            buyMoreActive={filters.buyMore}
            onSaleToggle={() => handleFiltersChange({ ...filters, onSale: !filters.onSale })}
            buyMoreToggle={() => handleFiltersChange({ ...filters, buyMore: !filters.buyMore })}
          />

          {/* Main content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title row + filter bar */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', mb: '16px' }}>
              <Box>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: { xs: `${fontSize.t2}px`, md: '26px' }, color: walherb.textHeading, lineHeight: 1.2 }}>
                  {displayLabel}
                </Typography>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: `${fontSize.b3}px`, color: '#A0A0A0', mt: '4px' }}>
                  {filteredProducts.length.toLocaleString('en-IN')} products
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <FilterBar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  brandOptions={BRANDS}
                  typeOptions={TYPES}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  sortOptions={SORT_OPTIONS}
                  totalCount={filteredProducts.length}
                  onMobileFilterOpen={openMobileFilter}
                />
              </Box>
            </Box>

            {/* Applied filters */}
            {activeFilterCount > 0 && (
              <Box sx={{ mb: '16px' }}>
                <AppliedFilters
                  filters={filters}
                  onRemoveBrand={v => removeFromArray('brands', v)}
                  onRemoveType={v => removeFromArray('types', v)}
                  onRemoveForm={v => removeFromArray('forms', v)}
                  onRemoveDietary={v => removeFromArray('dietary', v)}
                  onRemoveAvailability={v => removeFromArray('availability', v)}
                  onClearRating={() => handleFiltersChange({ ...filters, minRating: 0 })}
                  onClearPrice={() => handleFiltersChange({ ...filters, priceRange: [PRICE_MIN, PRICE_MAX] })}
                  onClearAll={clearAll}
                />
              </Box>
            )}

            {/* Divider */}
            <Box sx={{ borderTop: `1px solid ${walherb.borderNav}`, mb: '24px' }} />

            {/* Grid / empty / loading */}
            {loading ? (
              <SkeletonGrid />
            ) : filteredProducts.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                    gap: { xs: '12px', sm: '16px', md: '24px' },
                  }}
                >
                  {pageProducts.map(product => (
                    <CatalogProductCard
                      key={product.id}
                      product={product}
                      onClick={onProductClick}
                    />
                  ))}
                </Box>

                <PaginationRow />
              </>
            )}
          </Box>
        </Box>
      </Box>

      <MobileFilterDrawer />
    </Box>
  );
}
