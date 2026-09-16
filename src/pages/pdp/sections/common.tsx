'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Common PDP sections — reused across every category template.
// JSX/sx extracted verbatim from the original ProductDetailPage so the supplement
// page stays pixel-identical; data is now passed in via props.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StarRateIcon from '@mui/icons-material/StarRate';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import VerifiedIcon from '@mui/icons-material/Verified';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import LoopIcon from '@mui/icons-material/Loop';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';

import { walherb } from '../../../design-system/tokens/colors';
import { fontFamily, fontWeight, fontSize, lineHeight } from '../../../design-system/tokens/typography';
import type { Product } from '../../../components/home/ProductCard';
import { ProductCard } from '../../../components/home/ProductCard';
import type { Review, RatingBar, Faq, ServiceItem, ServiceIconKey } from '../types';

export const poppins = "'Poppins', sans-serif";
export const jakarta = "'Plus Jakarta Sans', sans-serif";

// ─── Stars ────────────────────────────────────────────────────────────────────

export const Stars = ({ count, size = 12 }: { count: number; size?: number }) => (
  <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
    {[...Array(5)].map((_, i) => (
      <StarRateIcon key={i} sx={{ fontSize: size, color: i < count ? '#F5A623' : '#E0E0E0' }} />
    ))}
  </Box>
);

// ─── Section heading + shell (shared spacing) ──────────────────────────────────

/** The repeated "py 24 / top border / 18px medium heading" section wrapper. */
export const SectionShell = ({
  title,
  gap = '12px',
  children,
}: {
  title: string;
  gap?: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap, py: '24px', borderTop: '1px solid #E7E7E7' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
      {title}
    </Typography>
    {children}
  </Box>
);

// ─── Breadcrumb ────────────────────────────────────────────────────────────────

export const Breadcrumb = ({ crumbs, current, onHome }: { crumbs: string[]; current: string; onHome: () => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
    {crumbs.map((crumb) => (
      <Box key={crumb} sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <Typography
          onClick={crumb === 'Home' ? onHome : undefined}
          sx={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: '12px',
            lineHeight: '15.6px',
            color: '#7F7D75',
            cursor: crumb === 'Home' ? 'pointer' : 'default',
            '&:hover': crumb === 'Home' ? { color: walherb.greenPrimary, textDecoration: 'underline' } : {},
          }}
        >
          {crumb}
        </Typography>
        <NavigateNextIcon sx={{ fontSize: 12, color: '#B0B0B0' }} />
      </Box>
    ))}
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '15.6px', color: '#252D28' }}>
      {current}
    </Typography>
  </Box>
);

// ─── Product Gallery ────────────────────────────────────────────────────────────

export const ProductGallery = ({ images }: { images: string[] }) => {
  const [selected, setSelected] = useState(0);
  const thumbs = images.length ? images : [''];

  return (
    <Box sx={{ width: { xs: '100%', md: 372 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '24px', height: { xs: 360, md: 420 }, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Box component="img" src={thumbs[selected]} alt="Product main view" sx={{ width: { xs: 208, md: 258 }, height: { xs: 288, md: 357 }, maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
      </Box>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        {thumbs.map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt={`View ${i + 1}`}
            loading="lazy"
            decoding="async"
            onClick={() => setSelected(i)}
            sx={{
              width: 56, height: 56, objectFit: 'cover',
              borderRadius: '8px',
              border: `2px solid ${i === selected ? walherb.greenPrimary : '#E6E6E6'}`,
              cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.2s',
              '&:hover': { borderColor: walherb.greenPrimary },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// ─── Trustpilot sidebar card ────────────────────────────────────────────────────

export const TrustpilotCard = ({ reviews }: { reviews: Review[] }) => (
  <Box sx={{ border: '1px solid #EBE8E4', borderRadius: '16px', overflow: 'hidden' }}>
    <Box sx={{ backgroundColor: '#FCFAFA', borderBottom: '1px solid #EBE8E4', px: '16px', py: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: '16px', lineHeight: '20.8px', color: '#433C50' }}>Top Reviews</Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '20.8px', color: '#433C50' }}>TrustScore 4.5 | 7,300+ reviews</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Stars count={5} size={14} />
        <Typography sx={{ fontFamily: poppins, fontWeight: 600, fontSize: '14px', lineHeight: '12px', color: '#3D4440' }}>4.7</Typography>
      </Box>
    </Box>

    <Box sx={{ backgroundColor: '#FFFFFF', p: '16px', display: 'flex', flexDirection: 'column', gap: '17px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.slice(0, 2).map((review) => (
          <Box key={review.name} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: '15.6px', color: '#252D28' }}>{review.name}</Typography>
              <Stars count={review.stars} size={12} />
            </Box>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '15.6px', color: '#6D6777' }}>{review.text}</Typography>
            {review.date && (
              <Box component="ul" sx={{ pl: '15px', m: 0 }}>
                <Typography component="li" sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '10px', lineHeight: 'normal', color: '#6D6777', listStyleType: 'disc' }}>{review.date}</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box
        component="button"
        sx={{ backgroundColor: '#FCFAFA', border: '1px solid #EBE8E4', borderRadius: '8px', px: '8px', py: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', width: '100%', '&:hover': { backgroundColor: '#F5F5F5' } }}
      >
        <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: 'normal', color: '#1F322A', textDecoration: 'underline' }}>View all reviews</Typography>
        <ArrowForwardIcon sx={{ fontSize: 14, color: '#1F322A' }} />
      </Box>
    </Box>
  </Box>
);

// ─── Related products carousel ──────────────────────────────────────────────────

export const RelatedProductsCarousel = ({
  title,
  products,
  onProductClick,
}: {
  title: string;
  products: Product[];
  onProductClick?: (p: Product) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -204 * 3 : 204 * 3, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '18px', lineHeight: '23.4px', color: '#3E3E3C' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {(['left', 'right'] as const).map((dir) => (
            <Box key={dir} component="button" onClick={() => scroll(dir)} sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: walherb.bgSection, border: `1px solid ${walherb.border}`, borderRadius: '50%', cursor: 'pointer', '&:hover': { backgroundColor: walherb.bgPage, borderColor: walherb.greenPrimary }, transition: 'all 0.2s' }}>
              {dir === 'left' ? <ChevronLeftIcon sx={{ fontSize: 16, color: walherb.textPrimary }} /> : <ChevronRightIcon sx={{ fontSize: 16, color: walherb.textPrimary }} />}
            </Box>
          ))}
        </Box>
      </Box>
      <Box ref={scrollRef} sx={{ display: 'flex', alignItems: 'stretch', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', pb: '8px', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={onProductClick} />
        ))}
      </Box>
    </Box>
  );
};

// ─── Product description images (lazy) ──────────────────────────────────────────

export const ProductDescriptionImages = ({ images, title = 'Product description' }: { images: string[]; title?: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: 500, fontSize: '18px', lineHeight: '23.4px', color: '#3E3E3C' }}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
      {images.map((src, i) => (
        <Box
          key={i}
          component="img"
          src={src}
          alt={`Product view ${i + 1}`}
          loading="lazy"
          decoding="async"
          sx={{ width: '100%', aspectRatio: '2928 / 1200', objectFit: 'cover', display: 'block' }}
        />
      ))}
    </Box>
  </Box>
);

// ─── Services grid ──────────────────────────────────────────────────────────────

const SERVICE_ICONS: Record<ServiceIconKey, typeof BoltIcon> = {
  shipping: AirplanemodeActiveIcon,
  authentic: VerifiedIcon,
  duties: ImportExportIcon,
  payments: ShieldIcon,
  delivery: BoltIcon,
  returns: LoopIcon,
};

export const ServicesSection = ({ services }: { services: ServiceItem[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
      Shop Global, Shop Safe with Walherb
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {[services.slice(0, 3), services.slice(3, 6)].map((row, ri) => (
        <Box key={ri} sx={{ display: 'flex', gap: '7px' }}>
          {row.map((svc) => {
            const Icon = SERVICE_ICONS[svc.icon];
            return (
              <Box key={svc.title} sx={{ flex: '1 0 0', minWidth: 0, backgroundColor: '#FCFCFC', border: '1px solid #F8F6F6', borderRadius: '16px', p: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #F8F6F6', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 20, color: '#476D59' }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: '12px', lineHeight: '15.6px', color: '#433C50' }}>{svc.title}</Typography>
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '15.6px', color: '#6D6777' }}>{svc.desc}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Ratings & reviews ──────────────────────────────────────────────────────────

export const ReviewsSection = ({ reviews, ratingBars, rating, reviewCount }: { reviews: Review[]; ratingBars: RatingBar[]; rating: number; reviewCount: number }) => {
  const reviewLabel = `${reviewCount.toLocaleString()} reviews`;
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: '16px', md: '8px' }, alignItems: { xs: 'stretch', md: 'flex-start' }, py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE8E4', borderRadius: '14.5px', p: '16px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0, width: { xs: '100%', md: 290 } }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: '16px', lineHeight: '20.8px', color: '#433C50' }}>
          Ratings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Typography sx={{ fontFamily: jakarta, fontWeight: 600, fontSize: '26px', lineHeight: 'normal', color: '#030303', whiteSpace: 'nowrap' }}>{rating}</Typography>
            <Box>
              <Stars count={5} size={14} />
              <Typography sx={{ fontFamily: jakarta, fontWeight: 400, fontSize: '9px', color: '#868686', mt: '4px', whiteSpace: 'nowrap' }}>{reviewLabel}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ratingBars.map((row) => (
              <Box key={row.star} sx={{ display: 'flex', gap: '11px', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '12px', color: '#AAAAAA', minWidth: 12, textAlign: 'center' }}>{row.star}</Typography>
                <Box sx={{ flex: 1, height: 7, backgroundColor: '#DBDEE1', borderRadius: '6px', overflow: 'hidden' }}>
                  <Box sx={{ width: `${row.pct}%`, height: '100%', backgroundColor: '#FBBC05', borderRadius: '6px' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ backgroundColor: '#FCFAFA', border: '1px solid #EBE8E4', borderRadius: '16px 16px 0 0', px: '16px', py: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.bold, fontSize: '16px', lineHeight: '20.8px', color: '#433C50' }}>Top Reviews</Typography>
          <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: 'normal', color: '#CAA159', textDecoration: 'underline', cursor: 'pointer' }}>{reviewLabel}</Typography>
        </Box>
        <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE8E4', borderTop: 'none', borderRadius: '0 0 16px 16px', p: '16px', display: 'flex', flexDirection: 'column', gap: '17px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((review) => (
              <Box key={review.name} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: '15.6px', color: '#252D28', whiteSpace: 'nowrap' }}>{review.name}</Typography>
                  <Stars count={review.stars} size={12} />
                </Box>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', lineHeight: '15.6px', color: '#6D6777' }}>{review.text}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ backgroundColor: '#FCFAFA', border: '1px solid #EBE8E4', borderRadius: '8px', px: '8px', py: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '12px', lineHeight: 'normal', color: '#1F322A', whiteSpace: 'nowrap' }}>
              ❤️ Product loved by over 20k+ customers
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─── FAQ accordion ──────────────────────────────────────────────────────────────

export const FaqAccordion = ({ faqs, title = 'Common Questions' }: { faqs: Faq[]; title?: string }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', py: '24px', borderTop: '1px solid #E7E7E7' }}>
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: `${fontSize.t2}px`, lineHeight: lineHeight.t2, color: '#3E3E3C' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {faqs.map((faq, i) => (
          <Box key={i} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE8E4', borderRadius: '12px', overflow: 'hidden' }}>
            <Box
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              sx={{ backgroundColor: '#FCFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '12px', cursor: 'pointer', '&:hover': { backgroundColor: '#F5F5F5' } }}
            >
              <Typography sx={{ fontFamily: poppins, fontWeight: 500, fontSize: '14px', lineHeight: 'normal', color: '#3E3E3C', pr: '12px' }}>
                {faq.q}
              </Typography>
              {openIdx === i
                ? <ExpandLessIcon sx={{ fontSize: 16, color: '#7F7F79', flexShrink: 0 }} />
                : <ExpandMoreIcon sx={{ fontSize: 16, color: '#7F7F79', flexShrink: 0 }} />
              }
            </Box>
            {openIdx === i && (
              <Box sx={{ px: '12px', pt: '8px', pb: '16px' }}>
                <Typography sx={{ fontFamily: poppins, fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: '#3E3E3C' }}>
                  {faq.a}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
