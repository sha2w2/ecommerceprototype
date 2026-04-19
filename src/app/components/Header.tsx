import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ShoppingBag, Heart, User, HelpCircle, Search, X, Menu } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SEGMENT_SUBNAV, Segment } from '../data/products';

const SEGMENTS: Segment[] = ['Women', 'Men', 'Kids'];

function getActiveSegment(pathname: string): Segment {
  const seg = pathname.split('/')[1];
  if (seg === 'men') return 'Men';
  if (seg === 'kids') return 'Kids';
  return 'Women';
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, openCart } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const activeSegment = getActiveSegment(location.pathname);
  const segSlug = activeSegment.toLowerCase();
  const subNav = SEGMENT_SUBNAV[activeSegment];

  const isLuxuryPage = location.pathname.includes('/luxury');

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAccountOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${segSlug}/clothing?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  function isSubNavActive(subPath: string): boolean {
    const fullPath = `/${segSlug}${subPath}`;
    if (subPath === '') {
      return location.pathname === `/${segSlug}` || location.pathname === `/${segSlug}/`;
    }
    return location.pathname.startsWith(fullPath);
  }

  const wishCount = state.wishlist.size;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className="sticky top-0 z-[500] bg-[#fafafa]" style={{ borderBottom: '1px solid #e4e4e4' }}>
        {/* Top announcement bar */}
        <div
          className="bg-[#0a0a0a] text-[#fafafa] text-center py-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em' }}
          role="banner"
        >
          FREE SHIPPING ON ORDERS OVER €150 &nbsp;·&nbsp; FREE 30-DAY RETURNS &nbsp;·&nbsp; MEMBERS-ONLY PRICES
        </div>

        {/* Main header row */}
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          {/* Left: Mobile menu + Segment selector */}
          <div className="flex items-center gap-4">
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-sm hover:bg-[#f2f2f2] transition-colors"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-[#0a0a0a]" />
            </button>

            {/* WOMEN | MEN | KIDS selector – like BestSecret */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Segment selector">
              {SEGMENTS.map(seg => (
                <button
                  key={seg}
                  onClick={() => navigate(`/${seg.toLowerCase()}`)}
                  className="px-2 py-1 transition-colors"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontWeight: activeSegment === seg ? 600 : 400,
                    color: '#0a0a0a',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeSegment === seg ? '2px solid #0a0a0a' : '2px solid transparent',
                    cursor: 'pointer',
                    paddingBottom: 2,
                  }}
                  aria-current={activeSegment === seg ? 'true' : undefined}
                >
                  {seg}
                </button>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <button
            onClick={() => navigate(`/${segSlug}`)}
            aria-label="VAULTÉ homepage"
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 300,
              letterSpacing: '0.28em',
              color: '#0a0a0a',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            VAULT<span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>É</span>
          </button>

          {/* Right icon group */}
          <div className="flex items-center gap-1" role="toolbar" aria-label="Account actions">
            {/* Search toggle */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-sm hover:bg-[#f2f2f2] transition-colors group"
              onClick={() => setSearchOpen(v => !v)}
              aria-label={searchOpen ? 'Close search (Esc)' : 'Open search (Ctrl+K)'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="w-5 h-5 text-[#0a0a0a]" /> : <Search className="w-5 h-5 text-[#0a0a0a]" />}
              {!searchOpen && (
                <span className="absolute -bottom-8 bg-[#0a0a0a] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Ctrl+K
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-sm hover:bg-[#f2f2f2] transition-colors"
              onClick={() => navigate('/wishlist')}
              aria-label={`Wishlist, ${wishCount} saved item${wishCount !== 1 ? 's' : ''}`}
            >
              <Heart
                className="w-5 h-5"
                style={{ color: wishCount > 0 ? '#b91c1c' : '#0a0a0a', fill: wishCount > 0 ? '#b91c1c' : 'none' }}
              />
              {wishCount > 0 && (
                <span
                  className="absolute top-1 right-1 bg-[#b91c1c] text-white rounded-full flex items-center justify-center"
                  style={{ width: 15, height: 15, fontSize: 9, fontWeight: 600, lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {wishCount > 9 ? '9+' : wishCount}
                </span>
              )}
            </button>

            {/* Account dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-sm hover:bg-[#f2f2f2] transition-colors"
                onClick={() => setAccountOpen(v => !v)}
                aria-label="Account menu"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <User className="w-5 h-5 text-[#0a0a0a]" />
              </button>
              {accountOpen && (
                <div
                  className="absolute top-12 right-0 bg-[#fafafa] shadow-xl rounded-sm z-50 min-w-[200px]"
                  style={{ border: '1px solid #e4e4e4' }}
                  role="menu"
                  aria-label="Account options"
                >
                  <AccountMenu onClose={() => setAccountOpen(false)} />
                </div>
              )}
            </div>

            {/* Cart bag with badge */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-sm hover:bg-[#f2f2f2] transition-colors"
              onClick={openCart}
              aria-label={`Open shopping cart, ${state.cartCount} item${state.cartCount !== 1 ? 's' : ''}`}
              id="cartBtn"
            >
              <ShoppingBag className="w-5 h-5 text-[#0a0a0a]" />
              {state.cartCount > 0 && (
                <span
                  className="absolute top-1 right-1 bg-[#0a0a0a] text-white rounded-full flex items-center justify-center"
                  style={{ width: 16, height: 16, fontSize: 9, fontWeight: 600, lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {state.cartCount > 9 ? '9+' : state.cartCount}
                </span>
              )}
            </button>

            {/* Help & FAQ */}
            <button
              className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-sm hover:bg-[#f2f2f2] transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                letterSpacing: '0.03em',
                color: '#6b6b6b',
                border: '1px solid #e4e4e4',
                background: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/help')}
              aria-label="Open Help & FAQ center"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help & FAQ
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="px-6 md:px-10 py-3" style={{ borderTop: '1px solid #e4e4e4', background: '#f8f8f8' }}>
            <form onSubmit={handleSearch} role="search" className="flex items-center gap-3 max-w-2xl mx-auto">
              <Search className="w-4 h-4 text-[#6b6b6b] shrink-0" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products and designers..."
                aria-label="Search products"
                className="flex-1 bg-transparent outline-none text-[#0a0a0a] placeholder-[#a0a0a0]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, border: 'none' }}
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0a0a0a] text-[#fafafa] rounded-sm hover:bg-[#2a2a2a] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em' }}
              >
                SEARCH
              </button>
            </form>
          </div>
        )}

        {/* Sub-navigation (segment-specific) */}
        <nav
          className="hidden md:flex items-center gap-5 px-10 h-11"
          style={{
            borderTop: isLuxuryPage ? '1px solid #1f1f1f' : '1px solid #e4e4e4',
            background: isLuxuryPage ? '#0a0a0a' : undefined,
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {isLuxuryPage && (
            <div className="w-px h-5 mr-1" style={{ background: '#c9a96e' }} aria-hidden="true" />
          )}
          {subNav.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(`/${segSlug}${link.path}`)}
              aria-current={isSubNavActive(link.path) ? 'page' : undefined}
              className={`relative transition-colors pb-px ${isLuxuryPage ? 'text-[#d4d4d4] hover:text-[#fafafa]' : 'text-[#0a0a0a] hover:text-[#0a0a0a]'}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                paddingBottom: 0,
                borderBottom: isSubNavActive(link.path)
                  ? `2px solid ${isLuxuryPage ? '#c9a96e' : '#0a0a0a'}`
                  : '2px solid transparent',
                fontWeight: isSubNavActive(link.path) ? 500 : 400,
                color: isSubNavActive(link.path) && isLuxuryPage ? '#c9a96e' : undefined,
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Inline search in nav */}
          <div className="ml-auto flex items-center gap-2" style={{ border: `1px solid ${isLuxuryPage ? '#3a3a3a' : '#e4e4e4'}`, borderRadius: 20, padding: '5px 14px' }}>
            <Search className={`w-3.5 h-3.5 ${isLuxuryPage ? 'text-[#6b6b6b]' : 'text-[#a0a0a0]'}`} aria-hidden="true" />
            <form onSubmit={handleSearch} role="search">
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products and designers..."
                aria-label="Search products (Ctrl+K)"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  width: 200,
                  background: 'transparent',
                  color: isLuxuryPage ? '#d4d4d4' : '#0a0a0a',
                }}
              />
              <span className={`text-[10px] pointer-events-none hidden lg:inline ${isLuxuryPage ? 'text-[#6b6b6b]' : 'text-[#a0a0a0]'}`}>⌘K</span>
            </form>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav
            className="flex md:hidden flex-col"
            style={{ borderTop: '1px solid #e4e4e4', background: '#fafafa' }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Mobile segment selector */}
            <div className="flex border-b border-[#e4e4e4]">
              {SEGMENTS.map(seg => (
                <button
                  key={seg}
                  onClick={() => { navigate(`/${seg.toLowerCase()}`); setMobileMenuOpen(false); }}
                  className="flex-1 py-3 text-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    background: activeSegment === seg ? '#f2f2f2' : 'none',
                    border: 'none',
                    fontWeight: activeSegment === seg ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* Sub-nav links */}
            {subNav.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(`/${segSlug}${link.path}`); setMobileMenuOpen(false); }}
                className="text-left px-6 py-3.5 hover:bg-[#f2f2f2] transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#0a0a0a',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #f2f2f2',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { navigate('/help'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-6 py-3.5 text-[#6b6b6b] hover:bg-[#f2f2f2]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <HelpCircle className="w-4 h-4" /> Help & FAQ
            </button>
          </nav>
        )}
      </header>
    </>
  );
}

function AccountMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const items = [
    { label: 'My Account',       action: () => { onClose(); navigate('/account'); } },
    { label: 'Orders & Returns', action: () => { onClose(); navigate('/account/orders'); } },
    { label: 'Saved Wishlist',   action: () => { onClose(); navigate('/wishlist'); } },
    { label: 'Loyalty Points',   action: () => { onClose(); navigate('/account/loyalty'); } },
    { label: 'Help & FAQ',       action: () => { onClose(); navigate('/help'); }, highlight: true },
    { label: 'Sign Out',         action: () => { onClose(); navigate('/women'); } },
  ];

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }} role="menu">
      {items.map(item => (
        <li key={item.label} role="none">
          <button
            role="menuitem"
            onClick={item.action}
            className="w-full text-left px-4 py-2.5 hover:bg-[#f2f2f2] transition-colors flex items-center gap-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: item.highlight ? '#0a0a0a' : '#3a3a3a',
              fontWeight: item.highlight ? 500 : 400,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {item.highlight && <HelpCircle className="w-3.5 h-3.5 text-[#6b6b6b]" />}
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}