'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { ProductCard, type Product } from '../../components/home/ProductCard';
import { CATALOG_PRODUCTS, type CatalogProduct } from '../../data/categoryData';
import { StaticPageShell, type StaticPageProps } from './StaticPageShell';

const matches = (p: CatalogProduct, q: string) => {
  const haystack = `${p.title} ${p.brand} ${p.type} ${p.categoryId}`.toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
};

const toProduct = (p: CatalogProduct): Product => ({
  id: p.id, title: p.title, rating: p.rating, brand: p.brand,
  price: p.price, originalPrice: p.originalPrice, image: p.image,
});

interface SearchResultsPageProps extends StaticPageProps {
  query: string;
  onProductClick: (product: CatalogProduct) => void;
}

export const SearchResultsPage = ({ query, onProductClick, ...shell }: SearchResultsPageProps) => {
  const q = query.trim().toLowerCase();
  const results = q ? CATALOG_PRODUCTS.filter((p) => matches(p, q)) : [];

  return (
    <StaticPageShell
      {...shell}
      maxWidth={1200}
      eyebrow="Search results"
      title={query ? `“${query}”` : 'Search'}
      lede={q ? `${results.length} ${results.length === 1 ? 'product' : 'products'} found` : undefined}
    >
      {results.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: { xs: '12px', md: '16px' },
          }}
        >
          {results.map((p) => (
            <ProductCard key={p.id} product={toProduct(p)} fluid onClick={() => onProductClick(p)} />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', py: { xs: '48px', md: '72px' } }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#EEF2F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchOffIcon sx={{ fontSize: 30, color: '#476D59' }} />
          </Box>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#474743' }}>
            No matches{query ? ` for “${query}”` : ''}
          </Typography>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#6D6777', maxWidth: '44ch' }}>
            Try a different spelling, a brand name, or a broader term — for example “vitamin”, “probiotics”, or “magnesium”.
          </Typography>
        </Box>
      )}
    </StaticPageShell>
  );
};

export default SearchResultsPage;
