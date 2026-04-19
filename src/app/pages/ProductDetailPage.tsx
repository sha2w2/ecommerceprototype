import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router';
import { Heart, ChevronRight, ChevronDown, Truck, RotateCcw, CreditCard, ZoomIn, AlertCircle, Share2, Check, Bell } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useApp } from '../store/AppContext';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, addToCart, toggleWishlist, addToRecent, showToast } = useApp();

  const product = PRODUCTS.find(p => p.id === Number(id));

  // Detect if navigated from luxury section
  const fromLuxury = (location.state as any)?.fromLuxury === true;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({});
  const [addedEffect, setAddedEffect] = useState(false);
  const [shared, setShared] = useState(false);
  const sizeErrorRef = useRef<HTMLParagraphElement>(null);

  const isWishlisted = product ? state.wishlist.has(product.id) : false;

  // Compute a CSS filter to visually tint the product image based on selected color
  function getColorTintFilter(colorHex: string, isFirstColor: boolean): string {
    if (isFirstColor) return 'none'; // First color = original photo, no tint
    // Convert hex to approximate hue-rotate for prototype color simulation
    const hex = colorHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    if (max !== min) {
      const d = max - min;
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) hue = ((b - r) / d + 2) * 60;
      else hue = ((r - g) / d + 4) * 60;
    }
    const lightness = (max + min) / 2 / 255;
    const brightness = 0.5 + lightness * 0.7;
    const saturation = lightness < 0.15 ? 0.1 : (lightness > 0.85 ? 0.3 : 0.85);
    return `hue-rotate(${Math.round(hue)}deg) saturate(${saturation}) brightness(${brightness.toFixed(2)})`;
  }

  useEffect(() => {
    if (product) {
      addToRecent(product);
      setSelectedSize(null);
      setSelectedColor(0);
      setSizeError(false);
      setAccordionOpen({});
    }
  }, [product?.id]);

  useEffect(() => {
    if (!product) {
      // Show feedback before redirecting (fixes BestSecret's "silent redirect" issue - H9)
      const timer = setTimeout(() => navigate('/women'), 5000);
      return () => clearTimeout(timer);
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>
          Product Not Found
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#6b6b6b', marginBottom: 8 }}>
          Sorry, this product link is invalid or the item is no longer available.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#a0a0a0', marginBottom: 24 }}>
          You will be redirected to the homepage in a few seconds.
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

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      sizeErrorRef.current?.focus();
      return;
    }
    setSizeError(false);
    const colorObj = product!.colors[selectedColor];
    addToCart({
      product: product!,
      size: selectedSize,
      color: colorObj.name,
      quantity: 1,
      key: `${product!.id}-${selectedSize}-${colorObj.name}`,
    });
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1200);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${product!.brand} ${product!.name}`,
        text: `Check out this ${product!.brand} piece on VAULTÉ – ${product!.pct}% off!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShared(true);
        showToast('Link copied to clipboard!');
        setTimeout(() => setShared(false), 2000);
      });
    }
  }

  function toggleAccordion(key: string) {
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const isSoldOut = (size: string) => product.soldOutSizes?.includes(size) ?? false;
  const recentlyViewed = state.recentlyViewed.filter(p => p.id !== product.id).slice(0, 4);

  const accordions = [
    { key: 'info', title: 'Product Information', content: product.info },
    { key: 'fit', title: 'Fit & Measurements', content: `Based on size M: chest 96cm, length 68cm, sleeve 64cm. Our model is 180cm tall and wears size M. Measurements may vary slightly by style.` },
    { key: 'care', title: 'Materials & Care', content: `Premium quality materials. Machine wash at 30°C on a gentle cycle. Do not tumble dry. Iron on low heat. Store flat or hanging in a cool, dry place.` },
    { key: 'delivery', title: 'Delivery & Returns', content: `Standard delivery: 4–7 working days · Express delivery: 1–2 working days (select areas). Free returns within 30 days of delivery. See our full returns policy for details.` },
  ];

  // Theme colors based on luxury context
  const dk = fromLuxury;
  const bg = dk ? '#0a0a0a' : undefined;
  const fg = dk ? '#fafafa' : '#0a0a0a';
  const muted = dk ? '#8a8a8a' : '#6b6b6b';
  const border = dk ? '#1f1f1f' : '#e4e4e4';
  const borderLight = dk ? '#1a1a1a' : '#f2f2f2';
  const surfaceBg = dk ? '#141414' : '#f8f8f8';
  const cardBg = dk ? '#141414' : 'white';
  const accent = dk ? '#c9a96e' : '#0a0a0a';

  return (
    <div style={{ background: bg }}>
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 px-8 md:px-10 py-3.5"
        style={{ borderBottom: `1px solid ${border}`, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted }}
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:opacity-80 transition-colors" style={{ color: muted }}>Home</Link>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        <Link to={`/${product.segment.toLowerCase()}`} className="hover:opacity-80 transition-colors" style={{ color: muted }}>{product.segment}</Link>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        <Link to={`/${product.segment.toLowerCase()}/${product.subcategory.toLowerCase()}`} className="hover:opacity-80 transition-colors" style={{ color: muted }}>{product.subcategory}</Link>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        <span style={{ color: fg }}>{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* ── Gallery ── */}
        <div style={{ background: dk ? '#111' : '#f8f8f8' }} className="flex flex-col" aria-label="Product images">
          {/* Main image */}
          <div className="relative flex-1 flex items-center justify-center min-h-[400px] md:min-h-[560px] group overflow-hidden">
            <img
              src={product.image}
              alt={`${product.brand} ${product.name} – ${product.colors[selectedColor].name}`}
              className="w-full h-full object-cover absolute inset-0 transition-all duration-500"
              style={{ filter: getColorTintFilter(product.colors[selectedColor].hex, selectedColor === 0) }}
            />
            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: dk ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)' }} aria-hidden="true">
              <ZoomIn className="w-3.5 h-3.5" style={{ color: muted }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: muted }}>Hover to zoom</span>
            </div>
            {/* Color label */}
            <div className="absolute top-4 left-4 backdrop-blur-sm px-2.5 py-1 rounded-sm" style={{ background: dk ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)' }} aria-hidden="true">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {product.colors[selectedColor].name}
              </span>
            </div>
          </div>

          {/* Color thumbnails – each color variant shown as a mini preview */}
          {product.colors.length > 1 && (
            <div
              className="flex gap-2 p-4"
              style={{ borderTop: `1px solid ${border}` }}
              role="group"
              aria-label="Colour preview thumbnails"
            >
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  className="flex items-center justify-center rounded-sm overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                  style={{
                    width: 60,
                    height: 68,
                    border: `2px solid ${selectedColor === i ? accent : border}`,
                    cursor: 'pointer',
                    background: cardBg,
                    padding: 0,
                    flexShrink: 0,
                  }}
                  aria-label={`View ${c.name} colour`}
                  aria-pressed={selectedColor === i}
                >
                  <img
                    src={product.image}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    style={{ filter: getColorTintFilter(c.hex, i === 0) }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div
          className="flex flex-col gap-5 px-8 md:px-12 py-10 overflow-y-auto custom-scroll"
          aria-label="Product details"
          style={{ background: bg }}
        >
          {/* Brand + Name + Share */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginBottom: 6 }}>
                {product.brand}
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3vw,34px)', fontWeight: 300, color: fg, lineHeight: 1.2 }}>
                {product.name}
              </h1>
            </div>
            <button
              onClick={handleShare}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
              style={{ border: `1px solid ${border}`, background: dk ? '#141414' : undefined }}
              aria-label="Share this product"
              title="Share"
            >
              {shared ? <Check className="w-4 h-4 text-[#3a7d44]" /> : <Share2 className="w-4 h-4" style={{ color: muted }} />}
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 500, color: fg }}>
              €{product.price.toFixed(2)}
            </span>
            {product.oldPrice > product.price && (
              <>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#a0a0a0', textDecoration: 'line-through' }}>
                  RRP €{product.oldPrice.toFixed(2)}
                </span>
                <span
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#3a7d44', fontWeight: 500, background: '#f0f7f1', padding: '3px 8px', borderRadius: 2 }}
                  aria-label={`${product.pct}% discount`}
                >
                  -{product.pct}%
                </span>
              </>
            )}
          </div>

          <div style={{ height: 1, background: border }} />

          {/* Colour selector */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: muted, fontWeight: 500, marginBottom: 10 }}>
              Colour: <strong style={{ color: fg, fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>{product.colors[selectedColor].name}</strong>
            </p>
            <div className="flex items-center gap-2.5 flex-wrap" role="group" aria-label="Select colour">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  aria-pressed={selectedColor === i}
                  aria-label={`Select colour: ${c.name}`}
                  className="flex flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] rounded-sm p-1"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span
                    className="block rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      background: c.hex,
                      border: selectedColor === i ? '2px solid #0a0a0a' : '1px solid #d4d4d4',
                      boxShadow: selectedColor === i ? '0 0 0 2px #fafafa, 0 0 0 4px #0a0a0a' : 'none',
                      transition: 'box-shadow 0.15s',
                    }}
                  />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: muted }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: muted, fontWeight: 500 }}>
                Select Size <span style={{ textTransform: 'none', letterSpacing: 0, color: '#a0a0a0', fontWeight: 300 }}>(EU)</span>
              </p>
              <button
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/help/SizeGuide')}
                aria-label="View size guide"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
              {product.sizes.map(size => {
                const soldOut = isSoldOut(size);
                const selected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    aria-pressed={selected}
                    aria-label={`Size ${size}${soldOut ? ', sold out' : ''}`}
                    className="focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      padding: '9px 16px',
                      border: `1px solid ${selected ? accent : sizeError && !selectedSize ? '#b91c1c' : border}`,
                      borderRadius: 2,
                      background: selected ? accent : cardBg,
                      color: soldOut ? '#c0c0c0' : selected ? (dk ? '#0a0a0a' : '#fafafa') : fg,
                      cursor: 'pointer',
                      textDecoration: soldOut ? 'line-through' : 'none',
                      transition: 'all 0.15s',
                      opacity: soldOut ? 0.6 : 1,
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Size error */}
            {sizeError && !selectedSize && (
              <p
                ref={sizeErrorRef}
                role="alert"
                tabIndex={-1}
                className="flex items-center gap-1.5 mt-2"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b91c1c' }}
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Please select a size before adding to your cart.
              </p>
            )}
          </div>

          {/* Add to Cart + Wishlist */}
          <div className="flex gap-3">
            {selectedSize && isSoldOut(selectedSize) ? (
              <button
                onClick={() => showToast("We'll let you know when this is back in stock")}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  padding: '16px 24px',
                  background: dk ? '#333333' : '#e4e4e4',
                  color: dk ? '#fafafa' : '#0a0a0a',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Notify me when back in stock"
              >
                <Bell className="w-[17px] h-[17px]" aria-hidden="true" />
                Notify Me
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  padding: '16px 24px',
                  background: addedEffect ? (dk ? '#c9a96e' : '#2a2a2a') : (dk ? '#fafafa' : '#0a0a0a'),
                  color: dk ? '#0a0a0a' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label={selectedSize ? `Add ${product.name} (${selectedSize}) to cart` : 'Select a size first to add to cart'}
              >
                {addedEffect ? (
                  <>✓ Added to Cart</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17" aria-hidden="true">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                    </svg>
                    {selectedSize ? 'Add to Cart' : 'Select a Size'}
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={isWishlisted}
              className="flex items-center justify-center rounded-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
              style={{
                width: 54,
                border: `1px solid ${isWishlisted ? '#b91c1c' : border}`,
                background: cardBg,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Heart
                className="w-5 h-5"
                style={{ color: isWishlisted ? '#b91c1c' : '#6b6b6b', fill: isWishlisted ? '#b91c1c' : 'none' }}
              />
            </button>
          </div>

          {/* Delivery trust signals */}
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
            {[
              { icon: Truck,      text: 'Delivery: 4–7 working days · Free over €150' },
              { icon: RotateCcw, text: 'Free returns within 30 days' },
              { icon: CreditCard, text: 'Secure payment · Prices include VAT' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${borderLight}` }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color: muted }} aria-hidden="true" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div style={{ borderTop: `1px solid ${border}` }} role="region" aria-label="Product information">
            {accordions.map(acc => (
              <div key={acc.key} style={{ borderBottom: `1px solid ${border}` }}>
                <button
                  onClick={() => toggleAccordion(acc.key)}
                  aria-expanded={!!accordionOpen[acc.key]}
                  aria-controls={`acc-${acc.key}`}
                  className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0a0a0a]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: fg, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {acc.title}
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform"
                    style={{ color: muted, transform: accordionOpen[acc.key] ? 'rotate(180deg)' : 'none' }}
                    aria-hidden="true"
                  />
                </button>
                {accordionOpen[acc.key] && (
                  <div
                    id={`acc-${acc.key}`}
                    className="pb-4"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, lineHeight: 1.75 }}
                  >
                    {acc.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section
          className="px-8 md:px-10 py-12"
          style={{ borderTop: `1px solid ${border}`, background: surfaceBg }}
          aria-labelledby="recently-viewed-heading"
        >
          <h2
            id="recently-viewed-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: fg, marginBottom: 6 }}
          >
            Recently Viewed
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, marginBottom: 24 }}>
            Continue where you left off
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {recentlyViewed.map(p => (
              <ProductCard key={p.id} product={p} darkMode={dk} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}