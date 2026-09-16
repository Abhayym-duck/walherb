import React, { useState, useEffect, useRef } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './app/page';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import TrackingPage from './pages/TrackingPage';
import { ContentPage, type ContentSlug } from './pages/static/ContentPage';
import { ReportInfringementPage } from './pages/static/ReportInfringementPage';
import { SearchResultsPage } from './pages/static/SearchResultsPage';
import { CartDrawer } from './components/Cart/CartDrawer/CartDrawer';
import { RazorpayModal } from './components/Checkout/RazorpayModal';
import { SettingsPopup } from './components/Account/SettingsPopup';
import { SignInModal } from './components/Account/SignInModal';
import type { Product } from './components/home/ProductCard';
import type { CatalogProduct } from './data/categoryData';
import type { CheckoutPayload } from './context/CartContext';
import type { AccountSection } from './components/Account/AccountSidebar';
import type { Order, OrderPackage } from './pages/account/OrdersPage';
import { findPackageByTracking } from './pages/account/OrdersPage';
import { categoryForCatalogId } from './pages/pdp/catalog';

/** Where the user opened tracking from, so Back can return there. */
type TrackingOrigin = { type: 'orders' } | { type: 'details'; orderId: string };

type AppView =
  | { kind: 'home' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'product'; product: Product }
  | { kind: 'checkout' }
  | { kind: 'account'; section: AccountSection }
  | { kind: 'tracking'; order: Order; pkg: OrderPackage; from: TrackingOrigin }
  | { kind: 'content'; slug: ContentSlug }
  | { kind: 'report-infringement' }
  | { kind: 'search'; query: string };

const TRACK_ROUTE = /^\/track-order\/(.+)$/;

/** Footer-linked static pages → URL paths (used for nav + deep links). */
const CONTENT_ROUTES: Record<string, ContentSlug> = {
  '/about-us': 'about',
  '/privacy-policy': 'privacy',
  '/terms-and-conditions': 'terms',
};

/** Map the current URL to an app view (deep links / refresh / share / back-forward). */
function viewFromUrl(): AppView | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;

  const track = path.match(TRACK_ROUTE);
  if (track) {
    const found = findPackageByTracking(decodeURIComponent(track[1]));
    return found ? { kind: 'tracking', order: found.order, pkg: found.pkg, from: { type: 'orders' } } : null;
  }

  // /account/kyc, /account/kyc/status, /account/kyc/verified all open the KYC section;
  // KYCPage reads the sub-path to show the right step.
  if (path.startsWith('/account/kyc')) return { kind: 'account', section: 'kyc' };

  if (path === '/report-infringement') return { kind: 'report-infringement' };
  if (CONTENT_ROUTES[path]) return { kind: 'content', slug: CONTENT_ROUTES[path] };

  if (path === '/search') {
    return { kind: 'search', query: new URLSearchParams(window.location.search).get('q') ?? '' };
  }

  return null;
}

function AppRoutes() {
  // Deep-link support: resolve /track-order/... and /account/kyc... on first load.
  const [view, setView]               = useState<AppView>(() => viewFromUrl() ?? { kind: 'home' });
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);
  // When returning from tracking, reopen the order's details if that's where we came from.
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);
  const { addItem, openDrawer, closeDrawer } = useCart();
  const { signedIn, signOut } = useAuth();

  const handleSignOut = () => signOut();

  // Keep a live ref so effects/handlers can read the current view.
  const viewRef = useRef(view);
  viewRef.current = view;

  // Signing out (from anywhere) leaves account / tracking pages.
  useEffect(() => {
    if (signedIn) return;
    const cur = viewRef.current;
    if (cur.kind === 'account' || cur.kind === 'tracking') {
      setDetailsOrderId(null);
      window.history.pushState({}, '', '/');
      setView({ kind: 'home' });
    }
  }, [signedIn]);

  // Sync browser back/forward with the tracking route.
  useEffect(() => {
    const onPopState = () => {
      const next = viewFromUrl();
      if (next) { setView(next); return; }
      // Left a routed URL (back to "/"): restore the right view.
      const cur = viewRef.current;
      if (cur.kind === 'tracking') {
        if (cur.from.type === 'details') setDetailsOrderId(cur.from.orderId);
        setView({ kind: 'account', section: 'orders' });
      } else {
        setView({ kind: 'home' });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToTracking = (order: Order, pkg: OrderPackage, fromDetails: boolean) => {
    window.history.pushState({}, '', `/track-order/${encodeURIComponent(pkg.trackingNumber)}`);
    setDetailsOrderId(null);
    setView({ kind: 'tracking', order, pkg, from: fromDetails ? { type: 'details', orderId: order.id } : { type: 'orders' } });
  };

  const handleAccountNavigate = (section: AccountSection) => {
    setSettingsAnchor(null);
    setDetailsOrderId(null);
    window.history.pushState({}, '', section === 'kyc' ? '/account/kyc' : '/');
    setView({ kind: 'account', section });
  };

  const handleBuyNow = (payload: CheckoutPayload) => {
    addItem({
      product:        payload.product,
      pkgIdx:         payload.pkgIdx,
      pkgLabel:       payload.pkgLabel,
      priceValue:     payload.priceValue,
      originalValue:  payload.originalValue,
      formattedPrice: payload.formattedPrice,
      qty:            payload.qty,
      sku:            payload.sku,
    });
    openDrawer();
  };

  const handleProceedToCheckout = () => {
    closeDrawer();
    setView({ kind: 'checkout' });
  };

  const handleQuickCheckout = () => {
    closeDrawer();
    setRazorpayOpen(true);
  };

  const renderView = () => {
    const goHome = () => setView({ kind: 'home' });

    if (view.kind === 'tracking') {
      const from = view.from;
      return (
        <TrackingPage
          order={view.order}
          pkg={view.pkg}
          onBack={() => {
            // Return to where we came from — Order Details or Orders.
            if (from.type === 'details') setDetailsOrderId(from.orderId);
            window.history.pushState({}, '', '/');
            setView({ kind: 'account', section: 'orders' });
          }}
          onAccountClick={(anchor) => setSettingsAnchor(anchor)}
          onAccountNavigate={handleAccountNavigate}
          onLogoClick={goHome}
        />
      );
    }

    if (view.kind === 'account') {
      return (
        <AccountPage
          section={view.section}
          onNavigate={(section) => { setDetailsOrderId(null); window.history.pushState({}, '', section === 'kyc' ? '/account/kyc' : '/'); setView({ kind: 'account', section }); }}
          onAccountClick={(anchor) => setSettingsAnchor(anchor)}
          onLogoClick={goHome}
          onViewTracking={navigateToTracking}
          initialDetailsOrderId={detailsOrderId}
        />
      );
    }

    if (view.kind === 'checkout') {
      return (
        <CheckoutPage
          onBack={goHome}
          onQuickCheckout={handleQuickCheckout}
        />
      );
    }

    if (view.kind === 'content' || view.kind === 'report-infringement') {
      const back = () => { window.history.pushState({}, '', '/'); goHome(); };
      const shared = {
        onBack: back,
        onLogoClick: back,
        onAccountClick: (anchor: HTMLElement) => setSettingsAnchor(anchor),
        onAccountNavigate: handleAccountNavigate,
      };
      return view.kind === 'content'
        ? <ContentPage slug={view.slug} {...shared} />
        : <ReportInfringementPage {...shared} />;
    }

    if (view.kind === 'search') {
      const back = () => { window.history.pushState({}, '', '/'); goHome(); };
      const openProduct = (p: CatalogProduct) => {
        const product: Product = {
          id: p.id, title: p.title, rating: p.rating, brand: p.brand,
          price: p.price, originalPrice: p.originalPrice, image: p.image,
          category: categoryForCatalogId(p.categoryId),
        };
        window.history.pushState({}, '', '/');
        setView({ kind: 'product', product });
      };
      return (
        <SearchResultsPage
          query={view.query}
          onProductClick={openProduct}
          onBack={back}
          onLogoClick={back}
          onAccountClick={(anchor) => setSettingsAnchor(anchor)}
          onAccountNavigate={handleAccountNavigate}
        />
      );
    }

    if (view.kind === 'product') {
      return (
        <ProductDetailPage
          product={view.product}
          onBack={goHome}
          onBuyNow={handleBuyNow}
          onAccountClick={(anchor) => setSettingsAnchor(anchor)}
          onAccountNavigate={handleAccountNavigate}
          onLogoClick={goHome}
          onProductClick={(p) => { window.scrollTo({ top: 0 }); setView({ kind: 'product', product: p }); }}
        />
      );
    }

    if (view.kind === 'category') {
      const handleProductClick = (p: CatalogProduct) => {
        const product: Product = {
          id: p.id, title: p.title, rating: p.rating, brand: p.brand,
          price: p.price, originalPrice: p.originalPrice, image: p.image,
          category: categoryForCatalogId(p.categoryId),
        };
        setView({ kind: 'product', product });
      };
      return (
        <CategoryPage
          initialCategoryId={view.categoryId}
          onBack={goHome}
          onProductClick={handleProductClick}
          onAccountClick={(anchor) => setSettingsAnchor(anchor)}
          onAccountNavigate={handleAccountNavigate}
          onLogoClick={goHome}
        />
      );
    }

    return (
      <HomePage
        onProductClick={(p) => setView({ kind: 'product', product: p })}
        onCategoryNav={(categoryId) => setView({ kind: 'category', categoryId })}
        onAccountClick={(anchor) => setSettingsAnchor(anchor)}
        onAccountNavigate={handleAccountNavigate}
        onLogoClick={goHome}
      />
    );
  };

  return (
    <>
      {renderView()}
      <CartDrawer
        onProceedToCheckout={handleProceedToCheckout}
        onQuickCheckout={handleQuickCheckout}
      />
      <RazorpayModal
        open={razorpayOpen}
        onClose={() => setRazorpayOpen(false)}
      />
      <SettingsPopup
        anchorEl={settingsAnchor}
        onClose={() => setSettingsAnchor(null)}
        onNavigate={handleAccountNavigate}
        onSignOut={handleSignOut}
      />
      <SignInModal />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </CartProvider>
  );
}
