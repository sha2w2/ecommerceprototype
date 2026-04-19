import { useNavigate, useLocation } from 'react-router';
import { ArrowRight, Clock } from 'lucide-react';
import { PRODUCTS, Segment, SEGMENT_HERO_IMAGES, getSubcategoriesForSegment } from '../data/products';
import { ProductCard } from '../components/ProductCard';

function getSegment(pathname: string): Segment {
  const first = pathname.split('/')[1]?.toLowerCase();
  if (first === 'men') return 'Men';
  if (first === 'kids') return 'Kids';
  return 'Women';
}

export function NewArrivalsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = getSegment(location.pathname);
  const segSlug = segment.toLowerCase();
  const heroImg = SEGMENT_HERO_IMAGES[segment];
  const subcategories = getSubcategoriesForSegment(segment);

  const segProducts = PRODUCTS.filter(p => p.segment === segment);
  const newItems = segProducts.filter(p => p.badge === 'NEW');
  const previewItems = segProducts.filter(p => p.badge !== 'NEW').slice(0, 8);

  return (
    <>
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: '50vh', background: '#0a0a0a' }} aria-label="New arrivals">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="New arrivals" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-20 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-[#a0a0a0]" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a0a0a0' }}>Updated Daily · {segment}</p>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, color: '#fafafa', lineHeight: 1.1, marginBottom: 20 }}>
            New Arrivals<br />&amp; Preview
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(250,250,248,0.6)', marginBottom: 32, lineHeight: 1.75 }}>
            Be the first to shop the latest {segment.toLowerCase()} additions to the boutique.
          </p>
          <button
            onClick={() => navigate(`/${segSlug}/${subcategories[0].toLowerCase()}`)}
            className="flex items-center gap-2.5 bg-[#fafafa] text-[#0a0a0a] hover:bg-white transition-colors rounded-sm"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 26px' }}
          >
            Shop All New <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <div className="flex items-center justify-center gap-3 py-3" style={{ background: '#f8f8f8', borderBottom: '1px solid #e4e4e4', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#0a0a0a' }}>
        <Clock className="w-3.5 h-3.5 text-[#6b6b6b]" />
        <span>New items drop daily at <strong>9:00 AM CET</strong> &middot; Set alerts in your account</span>
      </div>

      <section className="px-8 md:px-10 py-14" aria-labelledby="new-heading">
        <h2 id="new-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a', marginBottom: 4 }}>Just Landed</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', marginBottom: 32 }}>{newItems.length} new pieces added this week</p>
        {newItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {newItems.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#6b6b6b' }}>Check back soon for new arrivals!</p>
          </div>
        )}
      </section>

      <section className="px-8 md:px-10 pb-16" aria-labelledby="preview-heading">
        <h2 id="preview-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a', marginBottom: 4 }}>Coming Soon &mdash; Preview</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', marginBottom: 32 }}>Get a first look at upcoming campaigns and deals</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
          {previewItems.map(product => (<ProductCard key={`preview-${product.id}`} product={product} />))}
        </div>
      </section>
    </>
  );
}
