import { useNavigate, useLocation } from 'react-router';
import { PRODUCTS, Segment, SEGMENT_HERO_IMAGES } from '../data/products';

function getSegment(pathname: string): Segment {
  const first = pathname.split('/')[1]?.toLowerCase();
  if (first === 'men') return 'Men';
  if (first === 'kids') return 'Kids';
  return 'Women';
}

export function DesignersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = getSegment(location.pathname);
  const segSlug = segment.toLowerCase();
  const heroImg = SEGMENT_HERO_IMAGES[segment];

  const segProducts = PRODUCTS.filter(p => p.segment === segment);
  const brandMap = new Map<string, number>();
  segProducts.forEach(p => brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1));
  const brands = Array.from(brandMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const grouped = new Map<string, [string, number][]>();
  brands.forEach(([brand, count]) => {
    const letter = brand[0].toUpperCase().replace(/[^A-Z]/, '#');
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push([brand, count]);
  });
  const letters = Array.from(grouped.keys()).sort();

  return (
    <>
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: '40vh', background: '#0a0a0a' }} aria-label="Designers collection">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Designer collection" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-20">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: 16 }}>
            {brands.length} Labels · {segment}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 300, color: '#fafafa', lineHeight: 1.1, marginBottom: 12 }}>
            Our Designers
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(250,250,248,0.6)', maxWidth: 500 }}>
            Browse the full directory of {segment.toLowerCase()} brands available exclusively to VAULTE members.
          </p>
        </div>
      </section>

      <nav className="sticky top-[105px] z-40 bg-[#fafafa] px-8 md:px-10 py-3 flex flex-wrap gap-2" style={{ borderBottom: '1px solid #e4e4e4' }} aria-label="Jump to letter">
        {letters.map(letter => (
          <a key={letter} href={`#designer-${letter}`} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#0a0a0a] hover:text-[#fafafa] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#0a0a0a', textDecoration: 'none' }}>
            {letter}
          </a>
        ))}
      </nav>

      <section className="px-8 md:px-10 py-12" aria-label="Designer directory">
        {letters.map(letter => (
          <div key={letter} id={`designer-${letter}`} className="mb-10">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#0a0a0a', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e4e4e4' }}>
              {letter}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {grouped.get(letter)!.map(([brand, count]) => (
                <button key={brand} onClick={() => navigate(`/${segSlug}/clothing?q=${encodeURIComponent(brand)}`)} className="text-left py-2 hover:bg-[#f2f2f2] px-3 rounded-sm transition-colors group flex items-center justify-between" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a' }}>{brand}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#a0a0a0' }}>({count})</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
