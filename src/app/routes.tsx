import { createBrowserRouter, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Root } from './pages/Root';
import { SegmentHomePage } from './pages/SegmentHomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountLayout } from './pages/account/AccountLayout';
import { MyAccountPage } from './pages/account/MyAccountPage';
import { OrdersReturnsPage } from './pages/account/OrdersReturnsPage';
import { LoyaltyPointsPage } from './pages/account/LoyaltyPointsPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { HelpTopicPage } from './pages/HelpTopicPage';
import { InfoPage } from './pages/InfoPage';
import { LuxuryPage } from './pages/LuxuryPage';
import { DesignersPage } from './pages/DesignersPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';

function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = '/women';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Page Not Found</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6b6b6b', marginBottom: 8 }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#a0a0a0', marginBottom: 24 }}>
        You will be redirected to the homepage in {countdown} second{countdown !== 1 ? 's' : ''}.
      </p>
      <a
        href="/women"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '13px 26px', background: '#0a0a0a', color: '#fafafa', borderRadius: 2, textDecoration: 'none' }}
      >
        Back to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      // Root redirects to /women
      { index: true, element: <Navigate to="/women" replace /> },

      // ── Global routes (static — matched first by router ranking) ──
      { path: 'product/:id', Component: ProductDetailPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'confirmation', Component: ConfirmationPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: 'help', Component: HelpCenterPage },
      { path: 'help/:topic', Component: HelpTopicPage },
      { path: 'info/:slug', Component: InfoPage },
      {
        path: 'account',
        Component: AccountLayout,
        children: [
          { index: true, Component: MyAccountPage },
          { path: 'orders', Component: OrdersReturnsPage },
          { path: 'loyalty', Component: LoyaltyPointsPage },
        ]
      },

      // ── Segment sub-pages (specific paths before catch-all) ──
      { path: 'women/luxury', Component: LuxuryPage },
      { path: 'women/designers', Component: DesignersPage },
      { path: 'women/new', Component: NewArrivalsPage },
      { path: 'women/clothing', Component: ShopPage },
      { path: 'women/shoes', Component: ShopPage },
      { path: 'women/accessories', Component: ShopPage },

      { path: 'men/luxury', Component: LuxuryPage },
      { path: 'men/designers', Component: DesignersPage },
      { path: 'men/new', Component: NewArrivalsPage },
      { path: 'men/clothing', Component: ShopPage },
      { path: 'men/shoes', Component: ShopPage },
      { path: 'men/accessories', Component: ShopPage },

      { path: 'kids/luxury', Component: LuxuryPage },
      { path: 'kids/designers', Component: DesignersPage },
      { path: 'kids/new', Component: NewArrivalsPage },
      { path: 'kids/girls', Component: ShopPage },
      { path: 'kids/boys', Component: ShopPage },
      { path: 'kids/babies', Component: ShopPage },

      // ── Segment home pages ──
      { path: 'women', Component: SegmentHomePage },
      { path: 'men', Component: SegmentHomePage },
      { path: 'kids', Component: SegmentHomePage },

      { path: '*', Component: NotFound },
    ],
  },
]);