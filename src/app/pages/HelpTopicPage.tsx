import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

// Simple mock content for each topic
const TOPIC_CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  Orders: {
    title: 'Orders',
    sections: [
      { heading: 'Tracking Your Order', body: 'Once your order is placed, you will receive a confirmation email. When it ships, we will send another email with tracking details. You can always view live status in your My Account > Orders & Returns section.' },
      { heading: 'Modifying an Order', body: 'Because we process orders quickly to ensure fast delivery, you only have a 30-minute window to modify or cancel your order. Please contact Live Chat immediately if you need assistance.' },
      { heading: 'Missing Items', body: 'If an item is missing from your package, please check if your order was shipped in multiple parcels. If not, contact our support team within 48 hours of delivery.' }
    ]
  },
  Returns: {
    title: 'Returns & Refunds',
    sections: [
      { heading: 'Return Policy', body: 'We offer free 30-day returns on all items. Items must be unworn, unwashed, and have all original tags and protective hygiene strips attached.' },
      { heading: 'How to Return', body: 'Navigate to Orders & Returns in your account, select the items you wish to return, and generate a free prepaid return label. Drop the package off at any of our partnered courier locations.' },
      { heading: 'Refund Processing', body: 'Once we receive your return at our warehouse, it takes 3–5 business days to inspect and process. Refunds are issued to the original payment method and may take 5–10 business days to appear on your statement.' }
    ]
  },
  Payment: {
    title: 'Payment Options',
    sections: [
      { heading: 'Accepted Payment Methods', body: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Klarna. In select regions, we also offer Pay Later options via Klarna or Invoice.' },
      { heading: 'Currency and VAT', body: 'All prices shown are inclusive of applicable VAT. The final amount billed will be in the currency selected during checkout based on your shipping destination.' },
      { heading: 'Payment Security', body: 'Our checkout process uses industry-standard 256-bit encryption. We do not store your full credit card details on our servers.' }
    ]
  },
  Account: {
    title: 'Account Management',
    sections: [
      { heading: 'Creating an Account', body: 'VAULTÉ is a members-only platform. To create an account, you need an invite link from an existing member or you must join our waitlist. Once approved, you can complete registration.' },
      { heading: 'Password Reset', body: 'If you forgot your password, click "Forgot Password" on the login screen to receive a reset link. For security reasons, links expire after 1 hour.' },
      { heading: 'Deleting Your Account', body: 'To permanently delete your account and all associated data, please contact customer support. Note that this action cannot be undone.' }
    ]
  },
  Shipping: {
    title: 'Shipping Information',
    sections: [
      { heading: 'Delivery Times & Costs', body: 'Standard delivery (4–7 working days) is free on orders over €150. For orders under €150, a flat rate of €5.99 applies. Express delivery (1–2 days) is available for €14.99 in select countries.' },
      { heading: 'Shipping Destinations', body: 'We currently ship to 28 EU countries, as well as the UK, Switzerland, and Norway. We are working on expanding our international shipping zones.' },
      { heading: 'Customs and Duties', body: 'For orders shipped within the EU, no additional duties apply. For non-EU destinations like the UK or Switzerland, customs duties may be applied by local authorities upon delivery.' }
    ]
  },
  Loyalty: {
    title: 'Loyalty Program',
    sections: [
      { heading: 'Earning Points', body: 'You earn 10 points for every €1 spent. Additional points can be earned by referring friends, leaving reviews, or participating in special promotional events.' },
      { heading: 'Redeeming Points', body: 'Points can be converted into vouchers at checkout. 1,000 points equals €10. You must have a minimum of 1,000 points to redeem.' },
      { heading: 'Tier Levels', body: 'Our loyalty program features three tiers: Silver, Gold, and Platinum. Higher tiers unlock exclusive perks like early access to sales, free express shipping, and a dedicated concierge.' }
    ]
  },
  SizeGuide: {
    title: 'Size Guide',
    sections: [
      { heading: 'Understanding Our Sizing', body: 'Our sizes are standard European sizes. Because we carry over 3,000 designer labels, fit can vary slightly between brands. Check the detailed measurements on each product page for exact dimensions.' },
      { heading: 'Measurement Tips', body: 'For the most accurate fit, we recommend taking your measurements over your undergarments. Keep the tape measure level and snug, but not tight.' },
      { heading: 'Still Unsure?', body: 'If you are between sizes or need brand-specific advice, please reach out to our Live Chat agents who can provide personalized styling assistance.' }
    ]
  },
};

export function HelpTopicPage() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { openChat } = useApp();
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  // Redirect to Help Center if topic doesn't exist
  if (!topic || !TOPIC_CONTENT[topic]) {
    return <Navigate to="/help" replace />;
  }

  const content = TOPIC_CONTENT[topic];

  function handleFeedback(val: 'helpful' | 'not-helpful') {
    setFeedback(val);
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }}>
          <button
            onClick={() => navigate('/')}
            className="hover:text-[#0a0a0a] transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            Home
          </button>
          <span aria-hidden="true">›</span>
          <button
            onClick={() => navigate('/help')}
            className="hover:text-[#0a0a0a] transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            Help Center
          </button>
          <span aria-hidden="true">›</span>
          <span style={{ color: '#0a0a0a' }}>{content.title}</span>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => navigate('/help')}
          className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors mb-12 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] rounded-sm pr-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Back to Help Center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Help Center
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          {/* Main Article */}
          <article>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#0a0a0a', marginBottom: 40 }}>
              {content.title}
            </h1>
            
            <div className="space-y-12">
              {content.sections.map((section, idx) => (
                <section key={idx} aria-labelledby={`section-${idx}`}>
                  <h2 id={`section-${idx}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 500, color: '#0a0a0a', marginBottom: 16 }}>
                    {section.heading}
                  </h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#4a4a4a', lineHeight: 1.7 }}>
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Helpful feedback */}
            <div className="mt-16 pt-10 border-t border-[#e4e4e4]">
              {feedback === null ? (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b' }}>
                    Was this article helpful?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFeedback('helpful')}
                      className="flex items-center gap-2 px-4 py-2 border border-[#e4e4e4] rounded-sm text-[#0a0a0a] hover:bg-[#f2f2f2] hover:border-[#0a0a0a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}
                    >
                      <ThumbsUp className="w-4 h-4" /> Yes
                    </button>
                    <button
                      onClick={() => handleFeedback('not-helpful')}
                      className="flex items-center gap-2 px-4 py-2 border border-[#e4e4e4] rounded-sm text-[#0a0a0a] hover:bg-[#f2f2f2] hover:border-[#0a0a0a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}
                    >
                      <ThumbsDown className="w-4 h-4" /> No
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-[#f0f7f1] rounded-sm border border-[#d4edda]" role="status" aria-live="polite">
                  <CheckCircle className="w-5 h-5 text-[#3a7d44] shrink-0" />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#3a7d44' }}>
                    {feedback === 'helpful'
                      ? 'Thank you! We\'re glad this article was helpful.'
                      : 'Thank you for your feedback. We\'ll use it to improve our help content.'}
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* Contact Sidebar */}
          <aside>
            <div className="bg-white p-6 rounded-sm border border-[#e4e4e4] sticky top-24">
              <div className="w-12 h-12 bg-[#f2f2f2] rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-[#0a0a0a]" />
              </div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 8 }}>
                Still need answers?
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 20 }}>
                We're here to help. Reach out to our dedicated support team via Live Chat.
              </p>
              <button
                onClick={openChat}
                className="w-full py-3 bg-[#0a0a0a] text-white rounded-sm hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
              >
                Start Live Chat
              </button>
              <div className="mt-4 pt-4 border-t border-[#e4e4e4] space-y-3">
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }}>
                  Or contact us at
                </p>
                <a href="mailto:support@vaulte.com" className="block text-[#0a0a0a] hover:underline" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
                  support@vaulte.com
                </a>
                <a href="tel:+49800123456" className="block text-[#0a0a0a] hover:underline" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
                  +49 800 123 456
                </a>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}