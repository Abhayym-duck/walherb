'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { PackageGroup, shortDate } from './orderPackageUI';
import { TrackingHistoryPage } from './TrackingHistoryPage';
import { OrderDetailsPage } from './OrderDetailsPage';
import { ReturnRequestPage } from './ReturnRequestPage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'Processing'
  | 'Confirmed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'
  | 'Returned';

export interface TrackingEvent {
  date: string;
  status: string;
  description?: string;
  location?: string;
}

export interface OrderProduct {
  title: string;
  qty: number;
  unitPrice?: string;
  image: string;
}

/**
 * A shipment. International orders split across multiple packages, so each
 * package carries its OWN status, delivery message, tracking history and
 * eligible actions — independent of the other packages in the same order.
 */
export interface OrderPackage {
  id: string;
  trackingNumber: string;
  /** Carrier handling this shipment (different packages may use different carriers). */
  carrier?: string;
  status: OrderStatus;
  statusMessage: string;
  /** Expected arrival date for in-transit shipments (e.g. "Jun 09"). */
  eta?: string;
  deliveredOn?: string;
  /** Date the shipment was cancelled, e.g. "Jun 05". */
  cancelledOn?: string;
  events: TrackingEvent[];
  products: OrderProduct[];
}

export interface PaymentMethod {
  kind: 'card' | 'upi' | 'cod';
  label: string;
  detail: string;
}

export interface Order {
  id: string;
  date: string;
  /** Grand total actually paid (post-discount), e.g. "₹5,246". */
  total: string;
  /** Coupon / discount savings, e.g. "₹350". Omitted when none applies. */
  discount?: string;
  /** Recipient / shipping destination shown in the order header. */
  shipTo: string;
  /** How the order was paid. */
  payment?: PaymentMethod;
  /** Representative status for the whole order (used for the order-details header). */
  status: OrderStatus;
  packages: OrderPackage[];
}

// ─── Order-status ranking (for deriving an order's overall status) ──────────────

/** Lower rank = earlier in the lifecycle. Used to derive an order's overall status. */
const STATUS_RANK: Record<OrderStatus, number> = {
  Confirmed: 0, Processing: 0, Shipped: 1, 'Out For Delivery': 2,
  Delivered: 3, Returned: 4, Refunded: 4, Cancelled: 5,
};

/** Overall order status = the least-advanced still-active package (else Cancelled). */
const overallStatus = (packages: OrderPackage[]): OrderStatus => {
  const active = packages.filter((p) => p.status !== 'Cancelled');
  if (active.length === 0) return 'Cancelled';
  return active.reduce<OrderStatus>(
    (acc, p) => (STATUS_RANK[p.status] < STATUS_RANK[acc] ? p.status : acc),
    active[0].status,
  );
};

// ─── Mock data (Order → Package → Products) ─────────────────────────────────────

const PRODUCT_IMG = '/Images/products/product-1.png';

const MOCK_ORDERS: Order[] = [
  {
    id: '#946028311',
    date: 'June 14, 2026',
    total: '₹3,897',
    shipTo: 'Ramesh Kumar, New Delhi',
    payment: { kind: 'card', label: 'Visa', detail: 'Ending in 1048' },
    status: 'Confirmed',
    packages: [
      {
        id: 'pkg-0a',
        trackingNumber: '901224653W-0',
        status: 'Confirmed',
        statusMessage: 'Order confirmed',
        eta: 'Jun 20',
        events: [
          { date: 'Jun 14 2026, 10:05:00', status: 'Confirmed', description: 'Order confirmed.' },
        ],
        products: [
          { title: 'Now Foods Magnesium Glycinate - Highly Absorbable - Supports Muscle, Bone & Nerve Health - 180 Tablets', qty: 1, unitPrice: '₹899', image: PRODUCT_IMG },
          { title: 'Nordic Naturals Ultimate Omega - High-Potency Omega-3 - Lemon Flavor - 120 Soft Gels', qty: 2, unitPrice: '₹1,499', image: PRODUCT_IMG },
        ],
      },
    ],
  },
  {
    // Multi-package order: one shipment still in transit, one already delivered.
    id: '#944718843',
    date: 'May 28, 2026',
    total: '₹5,694',
    shipTo: 'Ramesh Kumar, New Delhi',
    payment: { kind: 'upi', label: 'UPI', detail: 'Razorpay · ramesh@okhdfcbank' },
    status: 'Shipped',
    packages: [
      {
        id: 'pkg-1a',
        trackingNumber: '872345178W-0',
        status: 'Shipped',
        statusMessage: 'Estimated delivery: Jun 06 – Jun 09',
        eta: 'Jun 09',
        events: [
          { date: '10 June 2026 at 07:27', status: 'Out For Delivery' },
          { date: 'Jun 8 2026, 14:22:00', status: 'In Transit', location: 'Chicago, IL' },
          { date: 'Jun 6 2026, 09:10:00', status: 'Label created', location: 'Easton, PA' },
        ],
        products: [
          { title: 'MegaFood Blood Builder Iron Supplement for Women & Men - Increase Iron Levels Without Side Effects - Combats Fatigue', qty: 2, unitPrice: '₹649', image: PRODUCT_IMG },
          { title: "Nature's Way Vitamin D3 5000 IU - Supports Bone Health & Immune System - Non-GMO, Gluten-Free", qty: 1, unitPrice: '₹499', image: PRODUCT_IMG },
        ],
      },
      {
        id: 'pkg-1b',
        trackingNumber: '872345178W-1',
        status: 'Delivered',
        statusMessage: 'Delivered on Jun 14',
        deliveredOn: 'Wed, 14 Jun 2026',
        events: [
          { date: '14 June 2026 at 11:48', status: 'Delivered', description: 'Your package has been delivered.' },
          { date: 'Jun 6 2026, 11:00:00', status: 'In Transit', location: 'Newark, NJ' },
          { date: 'Jun 5 2026, 17:07:00', status: 'Label created', location: 'Easton, PA' },
        ],
        products: [
          { title: 'Garden of Life Organic Plant Protein - Vegan, Gluten-Free, Non-GMO - 20g Protein per Serving - Chocolate Flavor', qty: 3, unitPrice: '₹1,299', image: PRODUCT_IMG },
        ],
      },
    ],
  },
  {
    id: '#942315672',
    date: 'June 3, 2026',
    total: '₹5,246',
    discount: '₹350',
    shipTo: 'Ramesh Kumar, New Delhi',
    payment: { kind: 'card', label: 'Mastercard', detail: 'Ending in 4242' },
    status: 'Delivered',
    packages: [
      {
        id: 'pkg-2a',
        trackingNumber: '763218940W-0',
        status: 'Delivered',
        statusMessage: 'Delivered on Jun 14',
        deliveredOn: 'Wed, 14 Jun 2026',
        events: [
          { date: '14 June 2026 at 12:15', status: 'Delivered', description: 'Your order has been delivered.' },
          { date: '14 June 2026 at 07:27', status: 'Out For Delivery' },
          { date: 'Jun 12 2026, 17:26:00', status: 'In Transit', location: 'JAMAICA, NY' },
          { date: 'Jun 10 2026, 17:07:00', status: 'Label created', location: 'Easton, PA' },
        ],
        products: [
          { title: "Vitafusion Women's Gummy Vitamins, Multivitamin with Iron & Vitamin D3 - 250 Gummies", qty: 1, unitPrice: '₹1,299', image: PRODUCT_IMG },
          { title: 'Nature Made Vitamin B12 1000 mcg - Supports Energy Metabolism', qty: 2, unitPrice: '₹899', image: PRODUCT_IMG },
          { title: 'Bulletproof Brain Octane Oil - Medium Chain Triglycerides (MCT) - 32 fl oz', qty: 1, unitPrice: '₹2,499', image: PRODUCT_IMG },
        ],
      },
    ],
  },
  {
    // Multi-package: one shipment still being prepared, one already delivered.
    id: '#948176234',
    date: 'June 5, 2026',
    total: '₹7,846',
    shipTo: 'Ramesh Kumar, New Delhi',
    payment: { kind: 'cod', label: 'Cash on Delivery', detail: 'Paid on delivery' },
    status: 'Processing',
    packages: [
      {
        id: 'pkg-3a',
        trackingNumber: '544891237W-0',
        status: 'Processing',
        statusMessage: 'Order confirmed',
        eta: 'Jun 12',
        events: [
          { date: 'Jun 5 2026, 09:30:00', status: 'Confirmed', description: 'Order confirmed.' },
        ],
        products: [
          { title: 'Optimum Nutrition Gold Standard 100% Whey Protein Powder - Double Rich Chocolate - 5 lbs', qty: 1, unitPrice: '₹3,299', image: PRODUCT_IMG },
        ],
      },
      {
        id: 'pkg-3b',
        trackingNumber: '544891237W-1',
        status: 'Delivered',
        statusMessage: 'Delivered on Jun 15',
        deliveredOn: 'Sun, 15 Jun 2026',
        events: [
          { date: '15 June 2026 at 14:30', status: 'Delivered', description: 'Your order has been delivered.' },
          { date: '15 June 2026 at 08:12', status: 'Out For Delivery' },
          { date: 'Jun 13 2026, 19:44:00', status: 'In Transit', location: 'Philadelphia, PA' },
          { date: 'Jun 12 2026, 10:00:00', status: 'Label created', location: 'Easton, PA' },
        ],
        products: [
          { title: 'Garden of Life Dr. Formulated Probiotics Mood+ - Supports Stress Response & Mental Wellbeing', qty: 2, unitPrice: '₹1,899', image: PRODUCT_IMG },
          { title: 'NOW Foods Omega-3 Fish Oil - 1000 mg - Supports Heart, Brain & Joint Health - 200 Softgels', qty: 1, unitPrice: '₹749', image: PRODUCT_IMG },
        ],
      },
    ],
  },
];

const FILTER_CHIPS = ['All Order', 'Delivered', 'Processing', 'Shipped', 'Cancelled'];

/**
 * Resolve a shipment from its tracking number. Drives the standalone
 * /track-order/:trackingNumber route (deep links, refresh, share). Scales to
 * many orders / packages / carriers since lookup is keyed by tracking number.
 */
export const findPackageByTracking = (trackingNumber: string): { order: Order; pkg: OrderPackage } | null => {
  for (const order of MOCK_ORDERS) {
    const pkg = order.packages.find((p) => p.trackingNumber === trackingNumber);
    if (pkg) return { order, pkg };
  }
  return null;
};

// Shared link-style for the order header's secondary actions.
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

// ─── HeaderCol (labelled summary column for the order header) ────────────────────

const HeaderCol = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', lineHeight: '16.8px', color: '#7F7F79', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', lineHeight: '19.6px', color: '#1A1F1A', whiteSpace: 'nowrap' }}>
      {value}
    </Typography>
  </Box>
);

// ─── OrderCard ────────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
  onViewTracking: (pkg: OrderPackage) => void;
  onRequestReturn: (pkg: OrderPackage) => void;
  onCancelPackage: (pkg: OrderPackage) => void;
  onBuyAgain: (product: OrderProduct) => void;
}

const OrderCard = ({ order, onViewDetails, onViewTracking, onRequestReturn, onCancelPackage, onBuyAgain }: OrderCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E6EC',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* ── Order header: structured summary (Order Placed · Total · Order | Actions) ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          px: '20px',
          py: '14px',
          backgroundColor: '#F7F8FB',
          borderBottom: '1px solid #E3E6EC',
          flexWrap: 'wrap',
        }}
      >
        {/* Summary columns */}
        <Box sx={{ display: 'flex', gap: { xs: '20px', md: '48px' }, flexWrap: 'wrap' }}>
          <HeaderCol label="Order Placed" value={order.date} />
          <HeaderCol label="Total" value={order.total} />
          <HeaderCol label="Order" value={order.id} />
        </Box>

        {/* Actions — secondary text links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: '6px' }}>
          <Typography
            role="button"
            tabIndex={0}
            onClick={onViewDetails}
            onKeyDown={(e) => { if (e.key === 'Enter') onViewDetails(); }}
            sx={LINK_SX}
          >
            View Order Details
          </Typography>
          <Typography
            role="button"
            tabIndex={0}
            onClick={() => {}}
            sx={LINK_SX}
          >
            Printable Order Summary
          </Typography>
        </Box>
      </Box>

      {/* ── Package groups (shared card layout, reused on Order Details) ── */}
      {order.packages.map((pkg, pkgIdx) => (
        <PackageGroup
          key={pkg.id}
          pkg={pkg}
          index={pkgIdx}
          packageCount={order.packages.length}
          onViewTracking={onViewTracking}
          onRequestReturn={onRequestReturn}
          onCancel={onCancelPackage}
          onBuyAgain={onBuyAgain}
        />
      ))}
    </Box>
  );
};

// ─── OrdersPage ───────────────────────────────────────────────────────────────

type OrderView = 'list' | 'tracking' | 'details' | 'return';

interface OrdersPageProps {
  /** When provided, "View Tracking History" navigates to the standalone
   *  /track-order/:trackingNumber route (outside the account layout).
   *  `fromDetails` records the origin so Back can return there. */
  onOpenTracking?: (order: Order, pkg: OrderPackage, fromDetails: boolean) => void;
  /** When set, open straight into this order's details (used when returning from tracking). */
  initialDetailsOrderId?: string | null;
}

export const OrdersPage = ({ onOpenTracking, initialDetailsOrderId }: OrdersPageProps = {}) => {
  const initialOrder = initialDetailsOrderId
    ? MOCK_ORDERS.find((o) => o.id === initialDetailsOrderId) ?? null
    : null;

  const [activeFilter, setActiveFilter] = useState('All Order');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<OrderView>(initialOrder ? 'details' : 'list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialOrder);
  const [selectedPackage, setSelectedPackage] = useState<OrderPackage | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [confirmCancel, setConfirmCancel] = useState<{ order: Order; pkg: OrderPackage } | null>(null);

  // Open tracking: standalone /track-order route when wired from App, else in-account fallback.
  const openTracking = (o: Order, pkg: OrderPackage, fromDetails: boolean) => {
    if (onOpenTracking) { onOpenTracking(o, pkg, fromDetails); return; }
    setSelectedOrder(o);
    setSelectedPackage(pkg);
    setView('tracking');
  };

  // Cancelling is package-specific: only the chosen (not-yet-shipped) package is cancelled.
  const handleCancelPackage = (orderId: string, pkgId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const packages = o.packages.map((p) =>
          p.id === pkgId
            ? { ...p, status: 'Cancelled' as OrderStatus, statusMessage: 'Order cancelled', cancelledOn: shortDate() }
            : p,
        );
        return { ...o, packages, status: overallStatus(packages) };
      }),
    );
  };

  const confirmCancelOrder = () => {
    if (confirmCancel) {
      handleCancelPackage(confirmCancel.order.id, confirmCancel.pkg.id);
      // Reflect the cancellation in the currently-open Order Details view.
      setSelectedOrder((o) => {
        if (!o || o.id !== confirmCancel.order.id) return o;
        const packages = o.packages.map((p) =>
          p.id === confirmCancel.pkg.id
            ? { ...p, status: 'Cancelled' as OrderStatus, statusMessage: 'Order cancelled', cancelledOn: shortDate() }
            : p,
        );
        return { ...o, packages, status: overallStatus(packages) };
      });
    }
    setConfirmCancel(null);
  };

  const filtered = orders.filter((o) => {
    // An order matches a status filter if ANY of its packages is in that status.
    if (activeFilter !== 'All Order' && !o.packages.some((p) => p.status === activeFilter)) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.date.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Cancel-confirmation dialog — rendered over both the list and the details view.
  const cancelDialog = (
    <Dialog
      open={!!confirmCancel}
      onClose={() => setConfirmCancel(null)}
      PaperProps={{ sx: { borderRadius: '16px', maxWidth: 420, width: '100%', m: 2 } }}
    >
      <Box sx={{ p: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', lineHeight: '23.4px', color: '#1A1F1A' }}>
          Cancel this shipment?
        </Typography>
        <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: '19.6px', color: '#5A6454' }}>
          This package from order {confirmCancel?.order.id} will be cancelled and a refund issued to your original payment method. This can’t be undone.
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', mt: '16px' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setConfirmCancel(null)}
            onKeyDown={(e) => { if (e.key === 'Enter') setConfirmCancel(null); }}
            sx={{
              px: '16px', py: '10px', borderRadius: '8px', cursor: 'pointer',
              border: '1px solid #E3E6EC', backgroundColor: '#FFFFFF',
              '&:hover': { backgroundColor: '#F7F8FB' },
            }}
          >
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '14px', color: '#5A6454', whiteSpace: 'nowrap' }}>
              Keep It
            </Typography>
          </Box>
          <Box
            role="button"
            tabIndex={0}
            onClick={confirmCancelOrder}
            onKeyDown={(e) => { if (e.key === 'Enter') confirmCancelOrder(); }}
            sx={{
              px: '16px', py: '10px', borderRadius: '8px', cursor: 'pointer',
              backgroundColor: '#C0392B',
              '&:hover': { backgroundColor: '#A93226' },
            }}
          >
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              Yes, Cancel
            </Typography>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );

  if (view === 'return' && selectedOrder) {
    return (
      <ReturnRequestPage
        order={selectedOrder}
        onBack={() => { setView('list'); setSelectedOrder(null); setSelectedPackage(null); }}
      />
    );
  }

  if (view === 'tracking' && selectedOrder && selectedPackage) {
    return (
      <TrackingHistoryPage
        order={selectedOrder}
        pkg={selectedPackage}
        onBack={() => { setView('list'); setSelectedOrder(null); setSelectedPackage(null); }}
        onRequestReturn={selectedPackage.status === 'Delivered' ? () => { setView('return'); } : undefined}
      />
    );
  }

  if (view === 'details' && selectedOrder) {
    return (
      <>
        <OrderDetailsPage
          order={selectedOrder}
          onBack={() => { setView('list'); setSelectedOrder(null); }}
          onViewTracking={(pkg) => openTracking(selectedOrder, pkg, true)}
          onRequestReturn={(pkg) => { setSelectedOrder({ ...selectedOrder, packages: [pkg] }); setSelectedPackage(pkg); setView('return'); }}
          onCancelPackage={(pkg) => setConfirmCancel({ order: selectedOrder, pkg })}
        />
        {cancelDialog}
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page title + search */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <Typography
            sx={{
              fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold,
              fontSize: '22px', lineHeight: '28.6px', color: '#474743',
            }}
          >
            My Orders
          </Typography>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#F7F8FB', border: '1px solid #E3E6EC',
              borderRadius: '16px', px: '16px', py: '8px',
              width: { xs: '100%', md: 300 },
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: '#A6ABB7', flexShrink: 0 }} />
            <Box
              component="input"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search orders..."
              sx={{
                border: 'none', outline: 'none', background: 'transparent',
                fontFamily: fontFamily.sans, fontSize: '12px', color: '#433C50', width: '100%',
                '&::placeholder': { color: '#A6ABB7' },
              }}
            />
          </Box>
        </Box>

        {/* Quick filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '14px', color: '#433C50', whiteSpace: 'nowrap' }}>
            Quick Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {FILTER_CHIPS.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <Box
                  key={chip}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveFilter(chip)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveFilter(chip); }}
                  sx={{
                    px: '16px', py: '6px', borderRadius: '500px',
                    border: '1px solid #E3E6EC',
                    backgroundColor: isActive ? '#476D59' : '#FFFFFF',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isActive ? '#476D59' : '#F7F8FB' },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontFamily.sans, fontWeight: fontWeight.medium,
                      fontSize: '12px', color: isActive ? '#FFFFFF' : '#433C50', whiteSpace: 'nowrap',
                    }}
                  >
                    {chip}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Order cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <Typography sx={{ fontFamily: fontFamily.sans, fontSize: '14px', color: '#7F7F79', py: '40px', textAlign: 'center' }}>
            No orders found.
          </Typography>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => { setSelectedOrder(order); setView('details'); }}
              onViewTracking={(pkg) => openTracking(order, pkg, false)}
              onRequestReturn={(pkg) => { setSelectedOrder({ ...order, packages: [pkg] }); setSelectedPackage(pkg); setView('return'); }}
              onCancelPackage={(pkg) => setConfirmCancel({ order, pkg })}
              onBuyAgain={() => { /* reorder: add the item back to the cart */ }}
            />
          ))
        )}
      </Box>

      {/* Cancel confirmation */}
      {cancelDialog}
    </Box>
  );
};

export default OrdersPage;
