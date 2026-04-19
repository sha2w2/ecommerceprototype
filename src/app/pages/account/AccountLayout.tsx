import { Outlet, NavLink } from 'react-router';
import { User, Package, Award, Heart } from 'lucide-react';

const accountLinks = [
  { path: '/account', label: 'My Account', icon: <User className="w-5 h-5" />, exact: true },
  { path: '/account/orders', label: 'Orders & Returns', icon: <Package className="w-5 h-5" /> },
  { path: '/account/loyalty', label: 'Loyalty Points', icon: <Award className="w-5 h-5" /> },
  { path: '/wishlist', label: 'Saved Wishlist', icon: <Heart className="w-5 h-5" /> },
];

export function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col md:flex-row gap-12" id="main-content">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h1 
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#0a0a0a', marginBottom: 24 }}
          >
            My Account
          </h1>
          <nav aria-label="Account navigation" className="flex flex-col gap-2">
            {accountLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 transition-colors rounded-sm ${isActive ? 'bg-[#0a0a0a] text-white font-medium' : 'text-[#3a3a3a] hover:bg-[#f2f2f2]'}`
                }
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 bg-white p-6 md:p-10 shadow-sm rounded-sm" style={{ border: '1px solid #e4e4e4' }}>
          <Outlet />
        </section>

      </main>
    </div>
  );
}
