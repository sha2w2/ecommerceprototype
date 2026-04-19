import { Outlet, ScrollRestoration } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartSidebar } from '../components/CartSidebar';
import { LiveChat } from '../components/LiveChat';
import { ToastContainer } from '../components/ToastContainer';

import { AppProvider } from '../store/AppContext';

export function Root() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-[#fafafa]">
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartSidebar />
        <LiveChat />
        <ToastContainer />
        <ScrollRestoration />
      </div>
    </AppProvider>
  );
}