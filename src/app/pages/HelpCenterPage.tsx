import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, Package, RotateCcw, CreditCard, User, Truck, Star, ChevronDown, MessageSquare } from 'lucide-react';
import { useApp } from '../store/AppContext';

const HELP_CATEGORIES = [
  { icon: Package,    title: 'Orders',   sub: 'Track, modify, cancel',   path: '/help/Orders' },
  { icon: RotateCcw, title: 'Returns',  sub: 'Free 30-day returns',      path: '/help/Returns' },
  { icon: CreditCard,title: 'Payment',  sub: 'Cards, PayPal, invoices',  path: '/help/Payment' },
  { icon: User,      title: 'Account',  sub: 'Profile, password',        path: '/help/Account' },
  { icon: Truck,     title: 'Shipping', sub: 'Delivery times & costs',   path: '/help/Shipping' },
  { icon: Star,      title: 'Loyalty',  sub: 'Points & membership',      path: '/help/Loyalty' },
];

const FAQS = [
  { q: 'How do I return an item?', a: 'You have 30 days from delivery to return any item. Go to Orders & Returns in your account, select the item, and print the prepaid label. Drop it at any partner location.' },
  { q: 'When will I be refunded?', a: 'Refunds are processed within 3–5 business days of us receiving the return. The money will appear in your original payment method within 5–10 working days.' },
  { q: 'Which countries do you ship to?', a: 'We ship to 28 EU countries plus the UK, Switzerland, and Norway. Standard delivery takes 4–7 working days. Express (1–2 days) is available in select countries.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking email. You can also view live tracking under Orders & Returns in your account at any time.' },
  { q: 'Are the prices inclusive of VAT?', a: 'Yes, all displayed prices include VAT. Shipping costs (if applicable) are shown separately at checkout.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via live chat (available 8am–10pm daily), email at support@vaulte.com, or phone at +49 800 123 456.' },
];

export function HelpCenterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (location.hash === '#faq') {
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  const filteredFaqs = FAQS.filter(f =>
    searchQuery.trim() === '' ||
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Header */}
      <div 
        className="bg-[#0a0a0a] text-[#fafafa] py-20 px-6 text-center"
        role="region"
        aria-label="Help Center Search"
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, marginBottom: 16 }}>
          How can we help?
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(250,250,248,0.7)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Search our knowledge base or browse categories below to find the answers you need.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#a0a0a0]" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for answers..."
            className="w-full bg-white text-[#0a0a0a] rounded-sm py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#fafafa]/20 transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, border: 'none' }}
            aria-label="Search help center"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Main Content */}
        <div className="flex flex-col gap-16">
          
          {/* Browse Topics */}
          {searchQuery.trim() === '' && (
            <section aria-labelledby="browse-topics">
              <h2 id="browse-topics" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b', fontWeight: 500, marginBottom: 24 }}>
                Browse Topics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {HELP_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.title}
                      onClick={() => navigate(cat.path)}
                      className="text-left p-6 rounded-sm hover:border-[#0a0a0a] hover:shadow-md transition-all group bg-white focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                      style={{ border: '1px solid #e4e4e4', cursor: 'pointer' }}
                      aria-label={`Go to ${cat.title} help page`}
                    >
                      <Icon className="w-6 h-6 text-[#6b6b6b] mb-4 group-hover:text-[#0a0a0a] transition-colors" />
                      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: '#0a0a0a', marginBottom: 4 }}>
                        {cat.title}
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                        {cat.sub}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAQs Subheading */}
          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b', fontWeight: 500, marginBottom: 24 }}>
              {searchQuery.trim() ? `Search Results (${filteredFaqs.length})` : 'Frequently Asked Questions'}
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-sm border border-[#e4e4e4]">
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#0a0a0a', marginBottom: 8 }}>No results found for "{searchQuery}"</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>Try a different search term, or contact our support team below.</p>
              </div>
            ) : (
              <div className="bg-white rounded-sm border border-[#e4e4e4] divide-y divide-[#e4e4e4]">
                {filteredFaqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0a0a0a]"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: '#0a0a0a' }}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 text-[#6b6b6b] shrink-0 ml-4 transition-transform"
                        style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                      />
                    </button>
                    {openFaq === i && (
                      <div 
                        className="px-6 pb-6 pt-2" 
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', lineHeight: 1.6 }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-sm border border-[#e4e4e4]">
            <div className="w-12 h-12 bg-[#f2f2f2] rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 8 }}>
              Need more help?
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 20 }}>
              Our dedicated support team is available 8am–10pm, 7 days a week to assist you with any inquiries.
            </p>
            <button
              onClick={openChat}
              className="w-full py-3 bg-[#0a0a0a] text-white rounded-sm hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Start Live Chat
            </button>
          </div>
          
          <div className="bg-[#f8f8f8] p-6 rounded-sm border border-[#e4e4e4]">
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0a0a0a', marginBottom: 12 }}>
              Other Contact Methods
            </h3>
            <ul className="space-y-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              <li>
                <span className="block text-[#6b6b6b] mb-1">Email us at</span>
                <a href="mailto:support@vaulte.com" className="text-[#0a0a0a] hover:underline font-medium">support@vaulte.com</a>
              </li>
              <li>
                <span className="block text-[#6b6b6b] mb-1">Call us at</span>
                <a href="tel:+49800123456" className="text-[#0a0a0a] hover:underline font-medium">+49 800 123 456</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      
      {/* Mobile contact CTA */}
      <div className="lg:hidden px-6 pb-16">
        <div className="bg-white p-6 rounded-sm border border-[#e4e4e4] text-center">
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 8 }}>
            Still need assistance?
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 20 }}>
            Our dedicated support team is available 8am–10pm, 7 days a week.
          </p>
          <button
            onClick={openChat}
            className="w-full py-3 bg-[#0a0a0a] text-white rounded-sm hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}