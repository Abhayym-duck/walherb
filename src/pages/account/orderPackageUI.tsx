'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { OrderPackage, OrderProduct, OrderStatus } from './OrdersPage';

// ─── Price helpers ──────────────────────────────────────────────────────────────

export const parsePrice = (s?: string) => (s ? Number(s.replace(/[^0-9.]/g, '')) || 0 : 0);
export const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const shortDate = () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

// ─── Status config + package logic (single source of truth) ─────────────────────

export const STATUS_DOT: Record<OrderStatus, string> = {
  Confirmed: '#2D6A1F', Processing: '#B7791F', Shipped: '#185FA5',
  'Out For Delivery': '#1F6FA8', Delivered: '#185FA5', Cancelled: '#C0392B',
  Refunded: '#5A6454', Returned: '#5A6454',
};

/** Amazon-style delivery-expectation heading (no pills/banners). */
export const statusHeading = (pkg: OrderPackage): string => {
  switch (pkg.status) {
    case 'Out For Delivery': return 'Out for delivery';
    case 'Shipped':
    case 'Confirmed':
    case 'Processing':       return pkg.eta ? `Arriving by ${pkg.eta}` : 'Arriving soon';
    case 'Delivered':        return pkg.statusMessage || 'Delivered';
    case 'Cancelled':        return pkg.cancelledOn ? `Cancelled on ${pkg.cancelledOn}` : 'Order cancelled';
    case 'Returned':         return 'Returned';
    case 'Refunded':         return 'Refunded';
    default:                 return 'Arriving';
  }
};

export const STATUS_SUBTEXT: Record<OrderStatus, string> = {
  Confirmed:          'Confirmed',
  Processing:         'Processing',
  Shipped:            'Shipped',
  'Out For Delivery': 'Expected today',
  Delivered:          'Package delivered',
  Cancelled:          'Order cancelled',
  Refunded:           'Refunded',
  Returned:           'Returned',
};

export const isCancellable = (s: OrderStatus) => s === 'Confirmed' || s === 'Processing';
export const isReturnable  = (s: OrderStatus) => s === 'Delivered';
export const hasTracking   = (s: OrderStatus) => s !== 'Cancelled' && s !== 'Refunded' && s !== 'Returned';
export const canBuyAgain   = (s: OrderStatus) =>
  s === 'Delivered' || s === 'Confirmed' || s === 'Processing' || s === 'Refunded' || s === 'Returned';

// ─── Small reusable sub-components ───────────────────────────────────────────────

const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <Box sx={{ width: 61, height: 61, borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, p: '8px' }}>
    <Box component="img" src={src} alt={alt} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </Box>
);

const ProductInfo = ({ product, showTotal }: { product: OrderProduct; showTotal?: boolean }) => {
  const total = product.unitPrice ? fmt(parsePrice(product.unitPrice) * product.qty) : undefined;
  return (
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Typography
        sx={{
          fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold,
          fontSize: '14px', lineHeight: '19.6px', color: '#41403B',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}
      >
        {product.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>
          QTY: {product.qty}
        </Typography>
        {product.unitPrice && (
          <>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79' }}>|</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>
              Unit Price:{' '}
              <Box component="span" sx={{ fontWeight: fontWeight.bold }}>{product.unitPrice}</Box>
            </Typography>
            {showTotal && total && (
              <>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79' }}>|</Typography>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>
                  Total:{' '}
                  <Box component="span" sx={{ fontWeight: fontWeight.bold, color: '#41403B' }}>{total}</Box>
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const BuyAgainButton = ({ onClick }: { onClick: () => void }) => (
  <Box
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    sx={{
      display: 'flex', alignItems: 'center', gap: '4px',
      px: '12px', py: '6px', borderRadius: '8px',
      border: '1px solid #E3E6EC', backgroundColor: '#FFFFFF',
      cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start',
      '&:hover': { backgroundColor: '#F7F8FB' },
    }}
  >
    <AutorenewIcon sx={{ fontSize: 14, color: '#5A6454' }} />
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#5A6454', whiteSpace: 'nowrap' }}>
      Buy again
    </Typography>
  </Box>
);

const ActionColumn = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      borderTop: { xs: '1px solid #E3E6EC', md: 'none' },
      px: { xs: '8px', md: '16px' }, py: { xs: '16px', md: '8px' },
      display: 'flex', flexDirection: { xs: 'row', md: 'column' },
      flexWrap: 'wrap', gap: '8px', flexShrink: 0,
      alignItems: 'stretch', justifyContent: 'flex-start',
    }}
  >
    {children}
  </Box>
);

type ActionVariant = 'primary' | 'secondary';

const ACTION_VARIANTS: Record<ActionVariant, { bg: string; border: string; fg: string }> = {
  primary:   { bg: '#2D6A1F', border: 'none',              fg: '#FFFFFF' },
  secondary: { bg: '#FFFFFF', border: '1px solid #E3E6EC', fg: '#5A6454' },
};

const ActionBtn = ({ label, variant = 'secondary', onClick }: { label: string; variant?: ActionVariant; onClick?: () => void }) => {
  const v = ACTION_VARIANTS[variant];
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        px: '12px', py: '8px', borderRadius: '8px',
        width: { xs: 'auto', md: 150 },
        flex: { xs: '1 1 140px', md: 'none' },
        minHeight: 44, cursor: 'pointer',
        backgroundColor: v.bg, border: v.border,
        '&:hover': { opacity: 0.85 },
      }}
    >
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: v.fg, whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
    </Box>
  );
};

// ─── PackageGroup — the shared package card section (Orders + Order Details) ──────

export interface PackageGroupProps {
  pkg: OrderPackage;
  index: number;
  packageCount: number;
  /** Order Details shows the per-product Total Price. */
  expanded?: boolean;
  onViewTracking: (pkg: OrderPackage) => void;
  onRequestReturn: (pkg: OrderPackage) => void;
  onCancel: (pkg: OrderPackage) => void;
  onBuyAgain: (product: OrderProduct) => void;
}

export const PackageGroup = ({
  pkg, index, packageCount, expanded,
  onViewTracking, onRequestReturn, onCancel, onBuyAgain,
}: PackageGroupProps) => {
  const multiPackage = packageCount > 1;
  const showTracking = hasTracking(pkg.status);
  const cancellable = isCancellable(pkg.status);
  const returnable = isReturnable(pkg.status);
  const buyAgain = canBuyAgain(pkg.status);
  const hasActions = showTracking || cancellable || returnable;

  return (
    <Box sx={{ borderTop: index > 0 ? '1px solid #E3E6EC' : 'none' }}>
      {/* Status heading + subtext */}
      <Box sx={{ px: '20px', pt: '14px', pb: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', lineHeight: '20.8px', color: '#1A1F1A' }}>
            {statusHeading(pkg)}
          </Typography>
          {multiPackage && (
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>
              Package {index + 1} of {packageCount} · {pkg.products.length} {pkg.products.length === 1 ? 'item' : 'items'}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: STATUS_DOT[pkg.status], flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '13px', lineHeight: '18.2px', color: '#5A6454' }}>
            {STATUS_SUBTEXT[pkg.status]}
          </Typography>
        </Box>
      </Box>

      {/* Products + actions */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {pkg.products.map((product, pi) => (
            <Box key={pi} sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', p: '8px' }}>
              <ProductImage src={product.image} alt={product.title} />
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ProductInfo product={product} showTotal={expanded} />
                {buyAgain && <BuyAgainButton onClick={() => onBuyAgain(product)} />}
              </Box>
            </Box>
          ))}
        </Box>

        {hasActions && (
          <ActionColumn>
            {showTracking && <ActionBtn label="View Tracking History" variant="primary" onClick={() => onViewTracking(pkg)} />}
            {cancellable && <ActionBtn label="Cancel Order" variant="secondary" onClick={() => onCancel(pkg)} />}
            {returnable && <ActionBtn label="Return / Replace" variant="secondary" onClick={() => onRequestReturn(pkg)} />}
          </ActionColumn>
        )}
      </Box>
    </Box>
  );
};
