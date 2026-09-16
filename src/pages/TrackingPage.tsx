'use client';

import Box from '@mui/material/Box';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { TrackingHistoryPage } from './account/TrackingHistoryPage';
import type { Order, OrderPackage } from './account/OrdersPage';
import type { AccountSection } from '../components/Account/AccountSidebar';

interface TrackingPageProps {
  order: Order;
  pkg: OrderPackage;
  onBack: () => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
  onLogoClick?: () => void;
}

/**
 * Standalone shipment-tracking experience — full site chrome (Header + Footer),
 * NOT wrapped in the My Account layout/sidebar. Feels like a dedicated carrier
 * tracking page (Amazon / DHL / FedEx style).
 */
export default function TrackingPage({ order, pkg, onBack, onAccountClick, onAccountNavigate, onLogoClick }: TrackingPageProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <AnnouncementBar />
      <Header onAccountClick={onAccountClick} onAccountNavigate={onAccountNavigate} onLogoClick={onLogoClick} />
      <Box sx={{ flex: 1, px: { xs: '16px', md: '80px' }, py: { xs: '24px', md: '40px' } }}>
        <TrackingHistoryPage order={order} pkg={pkg} onBack={onBack} />
      </Box>
      <Footer />
    </Box>
  );
}
