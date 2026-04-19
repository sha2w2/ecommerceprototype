import { useNavigate } from 'react-router';
import { useApp } from '../store/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const navigate = useNavigate();
  const { state } = useApp();

  const wishlistedItems = PRODUCTS.filter(p => state.wishlist.has(p.id));

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-20" id="main-content">
        <h1 
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#0a0a0a', marginBottom: 8 }}
        >
          Your Wishlist
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 40 }}>
          {wishlistedItems.length} {wishlistedItems.length === 1 ? 'item' : 'items'} saved for later
        </p>

        {wishlistedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white" style={{ border: '1px solid #e4e4e4' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6b6b6b', marginBottom: 24 }}>
              Your wishlist is currently empty.
            </p>
            <button
              onClick={() => navigate('/women/clothing')}
              className="px-8 py-3 bg-[#0a0a0a] text-white hover:bg-[#2a2a2a] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {wishlistedItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}