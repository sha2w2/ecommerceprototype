import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { Product } from '../data/products';
import { useApp } from '../store/AppContext';

interface ProductCardProps {
  product: Product;
  onView?: () => void;
  darkMode?: boolean;
}

export function ProductCard({ product, onView, darkMode }: ProductCardProps) {
  const navigate = useNavigate();
  const { state, toggleWishlist, addToRecent } = useApp();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const isWishlisted = state.wishlist.has(product.id);

  function handleWishlist(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 350);
    toggleWishlist(product);
  }

  function handleCardClick() {
    addToRecent(product);
    onView?.();
    navigate(`/product/${product.id}`, darkMode ? { state: { fromLuxury: true } } : undefined);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }

  const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <article
      className="product-card group cursor-pointer focus-within:outline-none"
      role="article"
      aria-label={`${product.brand} ${product.name}, €${product.price.toFixed(2)}`}
    >
      {/* Image container */}
      <div
        className={`product-img-container relative overflow-hidden ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f2f2f2]'} focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] rounded-sm`}
        style={{ aspectRatio: '3/4' }}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View ${product.brand} ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-[#fafafa] px-2 py-0.5 rounded-sm"
            style={{
              background: '#0a0a0a',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.06em',
              fontWeight: 500,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist heart */}
        <button
          className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
          onClick={handleWishlist}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWishlist(e); } }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart
            className={`w-4 h-4 transition-all ${heartAnimating ? 'heart-pulse' : ''}`}
            style={{
              color: isWishlisted ? '#b91c1c' : '#6b6b6b',
              fill: isWishlisted ? '#b91c1c' : 'none',
            }}
          />
        </button>

        {/* Quick view overlay on hover */}
        <div
          className="absolute inset-x-0 bottom-0 bg-[#0a0a0a]/85 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200 pointer-events-none"
          aria-hidden="true"
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fafafa', fontWeight: 500 }}>
            View Product
          </span>
        </div>
      </div>

      {/* Card info – clickable */}
      <div
        className="pt-3 pb-1 cursor-pointer focus:outline-none"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="presentation"
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: darkMode ? '#8a8a8a' : '#6b6b6b', marginBottom: 3 }}>
          {product.brand}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: darkMode ? '#e4e4e4' : '#0a0a0a', marginBottom: 8, lineHeight: 1.4 }}>
          {product.name}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: darkMode ? '#fafafa' : '#0a0a0a' }}>
            €{product.price.toFixed(2)}
          </span>
          {product.oldPrice > product.price && (
            <>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#a0a0a0', textDecoration: 'line-through' }}>
                €{product.oldPrice.toFixed(2)}
              </span>
              <span
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#3a7d44', fontWeight: 500, background: '#f0f7f1', padding: '2px 6px', borderRadius: 2 }}
                aria-label={`${discountPct}% discount`}
              >
                -{discountPct}%
              </span>
            </>
          )}
        </div>

        {/* Color dots */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-2.5" aria-label={`Available in ${product.colors.length} colours`}>
            {product.colors.map(c => (
              <span
                key={c.name}
                title={c.name}
                aria-label={c.name}
                className="rounded-full transition-transform hover:scale-125"
                style={{
                  width: 13,
                  height: 13,
                  background: c.hex,
                  border: c.hex === '#fafafa' || c.hex === '#f5f5f5' || c.hex === '#fff' || c.hex === '#f5f5f0' ? '1px solid #d4d4d4' : '1px solid transparent',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}