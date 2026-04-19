import { useNavigate, useLocation } from 'react-router';
import { ArrowRight, Diamond } from 'lucide-react';
import { PRODUCTS, Segment } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const LUXURY_BRANDS: Record<Segment, string[]> = {
  Women: ['Burberry', 'Max Mara', 'Karl Lagerfeld', 'Marc Cain', 'Stuart Weitzman', 'Joop!', 'Liebeskind Berlin'],
  Men: ['Versace', 'Boss Black', 'Ted Baker', 'Off-White™', 'A. Testoni', 'Selected Homme'],
  Kids: ['Burberry Kids', 'Karl Lagerfeld Kids', 'Boss Kids', 'Max Mara Baby', 'Petit Bateau'],
};

const LUXURY_HERO_IMAGES: Record<Segment, string> = {
  Women: 'https://images.unsplash.com/photo-1646930981992-a23ea998edda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
  Men: 'https://images.unsplash.com/photo-1658042525385-5538ccb3aeab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
  Kids: 'https://images.unsplash.com/photo-1670014541811-9b0ec280ed60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
};

function getSegment(pathname: string): Segment {
  const first = pathname.split('/')[1]?.toLowerCase();
  if (first === 'men') return 'Men';
  if (first === 'kids') return 'Kids';
  return 'Women';
}

export function LuxuryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = getSegment(location.pathname);
  const segSlug = segment.toLowerCase();
  const brands = LUXURY_BRANDS[segment];
  const luxuryProducts = PRODUCTS.filter(p => p.segment === segment && brands.includes(p.brand));
  const heroImg = LUXURY_HERO_IMAGES[segment];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '60vh' }} aria-label="Luxury collection">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt={`${segment} luxury fashion editorial`} className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-20 pb-14 md:pb-20 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Diamond className="w-4 h-4 text-[#c9a96e]" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e' }}>
              Exclusive Collection
            </p>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(250,250,248,0.6)', marginBottom: 32, lineHeight: 1.75 }}>
            Handpicked pieces from the world's most coveted fashion houses. Authenticated luxury at members-only prices.
          </p>
          <button
            onClick={() => navigate(`/${segSlug}/clothing`)}
            className="flex items-center gap-2.5 bg-[#fafafa] text-[#0a0a0a] hover:bg-white transition-colors rounded-sm"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 26px' }}
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── GOLD DIVIDER ──────────────────────────────────── */}
      <div className="flex items-center gap-4 px-8 md:px-10" aria-hidden="true">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a96e33)' }} />
        <Diamond className="w-3 h-3 text-[#c9a96e] opacity-60" />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a96e33)' }} />
      </div>

      {/* ── FEATURED LUXURY BRANDS ──────────────────────────── */}
      <section className="px-8 md:px-10 py-14" aria-labelledby="luxury-brands-heading">
        <h2 id="luxury-brands-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#fafafa', marginBottom: 6 }}>
          Featured Luxury Brands
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', marginBottom: 28 }}>
          Up to 80% off recommended retail prices
        </p>
        <div className="flex flex-wrap gap-3 mb-12">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => navigate(`/${segSlug}/clothing?q=${encodeURIComponent(brand)}`)}
              className="px-5 py-2.5 rounded-sm hover:bg-[#fafafa] hover:text-[#0a0a0a] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.04em', border: '1px solid #3a3a3a', background: 'none', cursor: 'pointer', color: '#d4d4d4' }}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* ── GOLD DIVIDER ──────────────────────────────────── */}
      <div className="flex items-center gap-4 px-8 md:px-10" aria-hidden="true">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a96e33)' }} />
        <Diamond className="w-3 h-3 text-[#c9a96e] opacity-60" />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a96e33)' }} />
      </div>

      {/* ── LUXURY PRODUCTS ─────────────────────────────────── */}
      <section className="px-8 md:px-10 pb-16" aria-labelledby="luxury-products-heading">
        <h2 id="luxury-products-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#fafafa', marginBottom: 4 }}>
          {luxuryProducts.length} Luxury Pieces
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', marginBottom: 32 }}>
          All items verified authentic with certificate
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
          {luxuryProducts.map(product => (
            <ProductCard key={product.id} product={product} darkMode />
          ))}
        </div>
      </section>

      {/* ── GOLD DIVIDER ──────────────────────────────────── */}
      <div className="flex items-center gap-4 px-8 md:px-10 mb-4" aria-hidden="true">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a96e33)' }} />
        <Diamond className="w-3 h-3 text-[#c9a96e] opacity-60" />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a96e33)' }} />
      </div>

      {/* ── TRUST STRIP ────────────────────────────────────── */}
      <section className="mx-8 md:mx-10 mb-16 py-10 px-8 rounded-sm" style={{ background: '#141414', border: '1px solid #1f1f1f' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { title: '100% Authentic', desc: 'Every item verified by our authentication team' },
            { title: 'Members Only Pricing', desc: 'Up to 80% below recommended retail price' },
            { title: 'Free Returns', desc: '30-day free returns on all luxury items' },
          ].map(item => (
            <div key={item.title}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#fafafa', marginBottom: 4 }}>{item.title}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}