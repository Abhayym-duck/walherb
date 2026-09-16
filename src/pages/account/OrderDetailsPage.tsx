'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import type { Order, OrderPackage, PaymentMethod } from './OrdersPage';
import { PackageGroup, parsePrice, fmt } from './orderPackageUI';

// ─── Mock recipient details + payment helpers ───────────────────────────────────

const FULL_ADDRESS = 'KH.No. 419-420, Rangpuri Near Security Barrier Western Green, New Delhi, Delhi 110037';
const PHONE = '+91 98765 43210';

const PAYMENT_ICON: Record<PaymentMethod['kind'], React.ReactNode> = {
  card: <CreditCardOutlinedIcon sx={{ fontSize: 22, color: '#41403B' }} />,
  upi:  <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 22, color: '#41403B' }} />,
  cod:  <PaymentsOutlinedIcon sx={{ fontSize: 22, color: '#41403B' }} />,
};
const DEFAULT_PAYMENT: PaymentMethod = { kind: 'card', label: 'Card', detail: 'Ending in 2012' };

// ─── Small pieces ───────────────────────────────────────────────────────────────

const LINK_SX = {
  fontFamily: fontFamily.sans,
  fontWeight: fontWeight.semiBold,
  fontSize: '14px',
  lineHeight: '18.2px',
  color: '#2D6A1F',
  textDecoration: 'underline',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  '&:hover': { color: '#235417' },
} as const;

const HeaderCol = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>{label}</Typography>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: '19.6px', color: '#1A1F1A', whiteSpace: 'nowrap' }}>{value}</Typography>
  </Box>
);

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ flex: 1, minWidth: 0, border: '1px solid #E3E6EC', borderRadius: '12px', p: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#474743' }}>{title}</Typography>
    {children}
  </Box>
);

// ─── OrderDetailsPage ───────────────────────────────────────────────────────────

interface OrderDetailsPageProps {
  order: Order;
  onBack: () => void;
  onViewTracking: (pkg: OrderPackage) => void;
  onRequestReturn?: (pkg: OrderPackage) => void;
  onCancelPackage?: (pkg: OrderPackage) => void;
}

export const OrderDetailsPage = ({ order, onBack, onViewTracking, onRequestReturn, onCancelPackage }: OrderDetailsPageProps) => {
  const allProducts = order.packages.flatMap((p) => p.products);
  const itemCount = allProducts.reduce((sum, p) => sum + p.qty, 0);
  const itemsTotal = allProducts.reduce((sum, p) => sum + parsePrice(p.unitPrice) * p.qty, 0);
  const discount = parsePrice(order.discount);
  const grandTotal = parsePrice(order.total);
  const payment = order.payment ?? DEFAULT_PAYMENT;
  const customerName = order.shipTo.split(',')[0].trim();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(e) => { if (e.key === 'Enter') onBack(); }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid #E3E6EC', cursor: 'pointer', flexShrink: 0, '&:hover': { backgroundColor: '#F7F8FB' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18, color: '#474743' }} />
        </Box>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '22px', lineHeight: '28.6px', color: '#474743' }}>
          Order Details
        </Typography>
      </Box>

      {/* Order meta bar */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          px: '20px', py: '14px', backgroundColor: '#F7F8FB',
          border: '1px solid #E3E6EC', borderRadius: '12px', flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', gap: { xs: '20px', md: '40px' }, flexWrap: 'wrap' }}>
          <HeaderCol label="Order" value={order.id} />
          <HeaderCol label="Order Placed" value={order.date} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: '6px' }}>
          <Typography role="button" tabIndex={0} sx={LINK_SX}>View Invoice</Typography>
          <Typography role="button" tabIndex={0} sx={LINK_SX}>Printable Order Summary</Typography>
        </Box>
      </Box>

      {/* Top information section: Ship To · Payment Method · Order Summary */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '16px', alignItems: 'stretch' }}>
        {/* Ship To */}
        <InfoCard title="Ship To">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#1A1F1A' }}>
              {customerName}
            </Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', lineHeight: '18.2px', color: '#6D6777' }}>
              {FULL_ADDRESS}
            </Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#6D6777' }}>
              {PHONE}
            </Typography>
          </Box>
        </InfoCard>

        {/* Payment Method */}
        <InfoCard title="Payment Method">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#F7F8FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {PAYMENT_ICON[payment.kind]}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#41403B' }}>{payment.label}</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '13px', color: '#7F7F79' }}>{payment.detail}</Typography>
            </Box>
          </Box>
          <Box sx={{ borderTop: '1px solid #EDEDED', pt: '10px', mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#6D6777' }}>Amount Paid</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '15px', color: '#1A1F1A', whiteSpace: 'nowrap' }}>{fmt(grandTotal)}</Typography>
          </Box>
        </InfoCard>

        {/* Order Summary */}
        <InfoCard title="Order Summary">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Items Total + duties-included note */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#41403B' }}>
                  Items Total ({itemCount})
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: '#41403B' }} />
                  <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '12px', color: '#41403B' }}>
                    Duties &amp; Taxes Included
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#3E3E3C', whiteSpace: 'nowrap' }}>
                {fmt(itemsTotal)}
              </Typography>
            </Box>

            {/* Shipping */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#41403B' }}>Shipping</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#33944A' }}>Free</Typography>
            </Box>

            {/* Duties & Taxes */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#41403B' }}>Duties &amp; Taxes</Typography>
              <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#3E3E3C' }}>--</Typography>
            </Box>

            {/* Discounts (only when applicable) */}
            {discount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', color: '#41403B' }}>Discounts</Typography>
                <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '16px', color: '#33944A', whiteSpace: 'nowrap' }}>−{fmt(discount)}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ borderBottom: '1px solid #EDEDED' }} />

          {/* Total amount */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '18px', color: '#3E3E3C' }}>Total amount</Typography>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#3E3E3C' }}>{fmt(grandTotal)}</Typography>
          </Box>
        </InfoCard>
      </Box>

      {/* Packages — same card layout as the Orders page (expanded with totals) */}
      <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '12px', overflow: 'hidden' }}>
        {order.packages.map((pkg, i) => (
          <PackageGroup
            key={pkg.id}
            pkg={pkg}
            index={i}
            packageCount={order.packages.length}
            expanded
            onViewTracking={(p) => onViewTracking(p)}
            onRequestReturn={(p) => onRequestReturn?.(p)}
            onCancel={(p) => onCancelPackage?.(p)}
            onBuyAgain={() => { /* reorder: add the item back to the cart */ }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OrderDetailsPage;
