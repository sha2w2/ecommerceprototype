import { useNavigate, useLocation } from 'react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { PRODUCTS, SEGMENT_HERO_IMAGES, SEGMENT_CATEGORY_IMAGES, getSubcategoriesForSegment, getProductCount, Segment, SubCategory } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../store/AppContext';

function getSegment(pathname: string): Segment {
  const first = pathname.split('/')[1]?.toLowerCase();
  if (first === 'men') return 'Men';
  if (first === 'kids') return 'Kids';
  return 'Women';
}

const FAKE_COUNTS: Record<string, string> = {
  Clothing: '8,239 products',
  Shoes: '4,512 products',
  Accessories: '3,104 products',
  Girls: '2,890 products',
  Boys: '2,345 products',
  Babies: '1,678 products',
};

const SEGMENT_PROMOS: Record<Segment, { label: string; deal: string; code: string }> = {
  Women: { label: 'Spring Edit', deal: 'UP TO 70% OFF + EXTRA 15%', code: 'SPRING26' },
  Men: { label: 'Tailoring Week', deal: 'UP TO 60% OFF SUITS & OUTERWEAR', code: 'SUITED26' },
  Kids: { label: 'Back to School', deal: 'UP TO 80% OFF + FREE SHIPPING', code: 'KIDS26' },
};

export function SegmentHomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();

  const segment = getSegment(location.pathname);
  const segSlug = segment.toLowerCase();
  const heroImg = SEGMENT_HERO_IMAGES[segment];
  const promo = SEGMENT_PROMOS[segment];
  const subcategories = getSubcategoriesForSegment(segment);

  const segmentProducts = PRODUCTS.filter(p => p.segment === segment);
  const featured = segmentProducts.filter(p => p.badge === 'SALE').slice(0, 4);
  const newArrivals = segmentProducts.filter(p => p.badge === 'NEW').slice(0, 4);
  const hasRecent = state.recentlyViewed.length > 0;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: '78vh', background: '#0a0a0a' }}
        aria-label="Featured promotion"
      >
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt={`${segment} fashion editorial`} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-14 pb-14 md:pb-20 w-full max-w-xl">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.5)', marginBottom: 16 }}>
            Spring / Summer 2026
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => navigate(`/${segSlug}/${subcategories[0].toLowerCase()}`)}
              className="flex items-center gap-2.5 bg-[#fafafa] text-[#0a0a0a] hover:bg-white transition-colors rounded-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px' }}
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/${segSlug}/luxury`)}
              className="flex items-center gap-2.5 text-[#fafafa] hover:bg-white/10 transition-colors rounded-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Luxury
            </button>
          </div>
        </div>
      </section>

      {/* ── SEGMENT-SPECIFIC PROMO BANNER ────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 md:px-14 py-3.5"
        style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', fontFamily: "'DM Sans', sans-serif" }}
        role="banner"
        aria-label={`${promo.label} promotion`}
      >
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a0a0a0', fontWeight: 500 }}>
            {promo.label}
          </span>
          <span style={{ fontSize: 13, color: '#fafafa', letterSpacing: '0.02em' }}>
            {promo.deal} &middot; Code: <strong>{promo.code}</strong>
          </span>
        </div>
        <button
          onClick={() => navigate(`/${segSlug}/${subcategories[0].toLowerCase()}`)}
          className="text-[#fafafa] hover:underline shrink-0"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textUnderlineOffset: 4 }}
        >
          SHOP NOW
        </button>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-16" aria-labelledby="categories-heading">
        <div className="flex items-end justify-between mb-10">
          <h2 id="categories-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a' }}>
            Shop by Category
          </h2>
        </div>
        <div className={`grid gap-4 ${subcategories.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
          {subcategories.map(sub => {
            const imgKey = `${segment}-${sub}`;
            return (
              <button
                key={sub}
                onClick={() => navigate(`/${segSlug}/${sub.toLowerCase()}`)}
                className="group relative overflow-hidden rounded-sm text-left"
                style={{ aspectRatio: '3/4', background: '#f2f2f2', cursor: 'pointer', border: 'none', padding: 0 }}
                aria-label={`Shop ${sub} – ${FAKE_COUNTS[sub] || ''}`}
              >
                <img
                  src={SEGMENT_CATEGORY_IMAGES[imgKey] || ''}
                  alt={sub}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: '#fafafa', marginBottom: 2 }}>{sub}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(250,250,248,0.6)' }}>{FAKE_COUNTS[sub] || `${getProductCount(segment, sub as SubCategory)} products`}</p>
                </div>
                <div
                  className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(250,250,248,0.9)' }}
                  aria-hidden="true"
                >
                  <ChevronRight className="w-4 h-4 text-[#0a0a0a]" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="px-8 md:px-14 pb-16" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between mb-8">
            <h2 id="featured-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a' }}>
              Featured This Week
            </h2>
            <button
              onClick={() => navigate(`/${segSlug}/${subcategories[0].toLowerCase()}`)}
              className="hidden sm:flex items-center gap-1.5 hover:gap-2.5 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0a0a0a', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ──────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="px-8 md:px-14 pb-16" aria-labelledby="new-arrivals-heading">
          <div className="flex items-end justify-between mb-8">
            <h2 id="new-arrivals-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a' }}>
              New Arrivals
            </h2>
            <button
              onClick={() => navigate(`/${segSlug}/new`)}
              className="hidden sm:flex items-center gap-1.5 hover:gap-2.5 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0a0a0a', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── MEMBERSHIP BANNER ────────────────────────────────── */}
      <section
        className="mx-8 md:mx-14 mb-16 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-12"
        style={{ background: '#0a0a0a' }}
        aria-label="Membership invitation"
      >
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: 10 }}>Members only</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#fafafa', marginBottom: 6 }}>
            Unlock Exclusive Access
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.5)', lineHeight: 1.7 }}>
            Up to 80% off 3,000+ luxury brands. Your private boutique.
          </p>
        </div>
        <button
          onClick={() => navigate('/account')}
          className="shrink-0 bg-[#fafafa] text-[#0a0a0a] hover:bg-white transition-colors rounded-sm flex items-center gap-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px' }}
        >
          Join Free <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* ── RECENTLY VIEWED ──────────────────────────────────── */}
      {hasRecent && (
        <section
          className="px-8 md:px-14 py-12"
          style={{ borderTop: '1px solid #e4e4e4', background: '#f8f8f8' }}
          aria-labelledby="recent-home-heading"
        >
          <h2 id="recent-home-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: '#0a0a0a', marginBottom: 20 }}>
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6">
            {state.recentlyViewed.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
