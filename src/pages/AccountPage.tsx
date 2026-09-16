'use client';

import Box from '@mui/material/Box';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import { AccountLayout } from '../components/Account/AccountLayout';
import type { AccountSection } from '../components/Account/AccountSidebar';
import { OrdersPage } from './account/OrdersPage';
import type { Order, OrderPackage } from './account/OrdersPage';
import { NotificationsPage } from './account/NotificationsPage';
import { AccountInfoPage } from './account/AccountInfoPage';
import { AddressesPage } from './account/AddressesPage';
import { PaymentMethodsPage } from './account/PaymentMethodsPage';
import { TwoStepVerificationPage } from './account/TwoStepVerificationPage';
import { KYCPage } from './account/KYCPage';

interface AccountPageProps {
  section: AccountSection;
  onNavigate: (section: AccountSection) => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onLogoClick?: () => void;
  onViewTracking?: (order: Order, pkg: OrderPackage, fromDetails: boolean) => void;
  initialDetailsOrderId?: string | null;
}

export const AccountPage = ({ section, onNavigate, onAccountClick, onLogoClick, onViewTracking, initialDetailsOrderId }: AccountPageProps) => {
  const sectionContent: Record<AccountSection, React.ReactNode> = {
    orders: <OrdersPage onOpenTracking={onViewTracking} initialDetailsOrderId={initialDetailsOrderId} />,
    kyc: <KYCPage />,
    notifications: <NotificationsPage />,
    'account-information': <AccountInfoPage />,
    addresses: <AddressesPage />,
    'payment-methods': <PaymentMethodsPage />,
    '2-step-verification': <TwoStepVerificationPage />,
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <AnnouncementBar />
      <Header onAccountClick={onAccountClick} onAccountNavigate={onNavigate} onLogoClick={onLogoClick} />
      <AccountLayout active={section} onNavigate={onNavigate}>
        {sectionContent[section]}
      </AccountLayout>
    </Box>
  );
};

export default AccountPage;
