import { useNavigate } from 'react-router';
import { useApp } from '../store/AppContext';

export function Footer() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  return (
    <footer
      className="bg-[#0a0a0a] text-[#fafafa]"
      style={{ padding: '48px 40px 28px' }}
      role="contentinfo"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <button
            onClick={() => navigate('/')}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: '0.22em', marginBottom: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#fafafa', padding: 0 }}
            aria-label="VAULTÉ home"
          >
            VAULT<span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>É</span>
          </button>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.5)', lineHeight: 1.75, marginBottom: 20 }}>
            Premium and luxury fashion brands at exclusive members-only prices. Over 3,000 designer labels, up to 80% off RRP.
          </p>
          {/* System status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3a7d44] inline-block" aria-hidden="true" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(250,250,248,0.4)' }}>
              All systems operational
            </span>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)', marginBottom: 16, fontWeight: 500 }}>
            Shop
          </p>
          <ul className="space-y-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Women', 'Men', 'Kids'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => navigate(`/${cat.toLowerCase()}`)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate('/wishlist')}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                className="hover:text-[#fafafa] transition-colors"
              >
                My Wishlist
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)', marginBottom: 16, fontWeight: 500 }}>
            Customer Service
          </p>
          <ul className="space-y-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <button onClick={() => navigate('/help')} className="hover:text-[#fafafa] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Help Center
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/help#faq')} className="hover:text-[#fafafa] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                FAQ
              </button>
            </li>
            {[
              { label: 'Returns & Refunds', path: '/help/Returns' },
              { label: 'Shipping Info',     path: '/help/Shipping' },
              { label: 'Size Guide',        path: '/help/SizeGuide' },
              { label: 'Orders',            path: '/help/Orders' },
              { label: 'Loyalty Program',   path: '/help/Loyalty' },
            ].map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.4)', marginBottom: 16, fontWeight: 500 }}>
            Company
          </p>
          <ul className="space-y-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'About VAULTÉ',       path: '/info/about' },
              { label: 'Careers',            path: '/info/careers' },
              { label: 'Press',              path: '/info/press' },
              { label: 'Privacy Policy',     path: '/info/privacy' },
              { label: 'Terms & Conditions', path: '/info/terms' },
            ].map(item => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter strip */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 mb-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(250,250,248,0.8)', fontWeight: 500, marginBottom: 2 }}>
            Get exclusive offers in your inbox
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(250,250,248,0.4)' }}>
            Member newsletters · New brand alerts · Early access sales
          </p>
        </div>
        <form
          className="flex gap-2 w-full sm:w-auto"
          onSubmit={e => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input') as HTMLInputElement;
            if (input.value) {
              showToast("You've been subscribed to our newsletter!");
              input.value = '';
            }
          }}
          role="search"
          aria-label="Newsletter signup"
        >
          <input
            type="email"
            placeholder="your@email.com"
            aria-label="Email address for newsletter"
            className="flex-1 sm:w-56 px-3 py-2.5 bg-[#1a1a1a] text-[#fafafa] rounded-sm outline-none focus:ring-2 focus:ring-[#fafafa]/30 placeholder:text-[rgba(250,250,248,0.3)]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#fafafa] text-[#0a0a0a] rounded-sm hover:bg-white transition-colors shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(250,250,248,0.3)' }}>
          © 2026 VAULTÉ GmbH. All rights reserved. · VAT DE 123 456 789
        </p>
        <div className="flex items-center gap-3">
          {['VISA', 'MASTERCARD', 'PAYPAL', 'APPLE PAY', 'KLARNA'].map(p => (
            <span
              key={p}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(250,250,248,0.35)', letterSpacing: '0.05em' }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}