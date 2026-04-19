import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNum = (location.state as any)?.orderNum || `VLT-${Date.now().toString().slice(-8).toUpperCase()}`;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh] px-8 py-20 text-center"
      role="main"
      aria-label="Order confirmation"
    >
      {/* Success icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#f0f7f1] mb-8" aria-hidden="true">
        <CheckCircle className="w-10 h-10 text-[#3a7d44]" />
      </div>

      <h1
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}
        aria-live="assertive"
      >
        Order Confirmed
      </h1>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#6b6b6b', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
        Thank you for your purchase. A confirmation email has been sent to your address.
        Your items will be dispatched within 1 business day.
      </p>

      {/* Order number */}
      <div
        className="rounded-sm px-10 py-6 mb-10"
        style={{ background: '#f8f8f8', border: '1px solid #e4e4e4', minWidth: 280 }}
        role="region"
        aria-label="Order number"
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: 8 }}>
          Your Order Number
        </p>
        <p
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, letterSpacing: '0.1em', color: '#0a0a0a' }}
          aria-label={`Order number: ${orderNum}`}
        >
          {orderNum}
        </p>
      </div>

      {/* What happens next */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl w-full mb-12">
        {[
          { step: '1', title: 'Order Processing', desc: 'We\'re preparing your items for dispatch.' },
          { step: '2', title: 'Dispatched',        desc: 'You\'ll receive a tracking email within 24h.' },
          { step: '3', title: 'Delivered',         desc: 'Expected delivery in 4-7 working days.' },
        ].map(item => (
          <div key={item.step} className="text-center px-4 py-5 rounded-sm" style={{ background: '#f8f8f8', border: '1px solid #e4e4e4' }}>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#0a0a0a', color: '#fafafa', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}
            >
              {item.step}
            </span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-sm hover:bg-[#1a1a1a] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px', background: '#0a0a0a', color: '#fafafa', border: 'none', cursor: 'pointer' }}
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/account/orders')}
          className="flex items-center gap-2 rounded-sm hover:bg-[#f2f2f2] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, padding: '13px 28px', background: 'transparent', color: '#0a0a0a', border: '1px solid #e4e4e4', cursor: 'pointer' }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
