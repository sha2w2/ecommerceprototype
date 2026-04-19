import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, AlertCircle, CheckCircle, Lock, CreditCard, Truck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PlacedOrder } from '../store/AppContext';

interface FieldState {
  value: string;
  error: string;
  valid: boolean;
  touched: boolean;
}

function initField(): FieldState { return { value: '', error: '', valid: false, touched: false }; }

function validateName(v: string) {
  if (!v.trim()) return 'This field is required.';
  if (v.trim().length < 2) return 'Must be at least 2 characters.';
  return '';
}

function validateEmail(v: string) {
  if (!v.trim()) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address (e.g. you@example.com).';
  return '';
}

function validatePhone(v: string) {
  if (!v.trim()) return 'Phone number is required.';
  if (/[a-zA-Z]/.test(v)) return 'Phone number should contain only digits, spaces, or symbols (+, -). Please remove any letters.';
  const digits = v.replace(/\D/g, '');
  if (digits.length < 9) return `Please include the missing ${9 - digits.length} digit${9 - digits.length !== 1 ? 's' : ''} in your phone number.`;
  if (digits.length > 13) return 'Phone number is too long. Please check and try again.';
  if (/^(\d)\1+$/.test(digits)) return 'This doesn\'t look like a real phone number. Please double-check.';
  return '';
}

function validatePostcode(v: string) {
  if (!v.trim()) return 'Postcode is required.';
  const cleaned = v.trim().replace(/\s+/g, '');
  if (cleaned.length < 4) return 'Postcode is too short. Most postcodes are at least 4 characters.';
  if (cleaned.length > 10) return 'Postcode is too long. Please check and try again.';
  if (!/^[A-Za-z0-9\s\-]+$/.test(v.trim())) return 'Postcode should only contain letters, numbers, spaces, or hyphens.';
  if (/^(.)\1+$/.test(cleaned)) return 'This doesn\'t look like a valid postcode. Please double-check.';
  return '';
}

function validateCard(v: string) {
  const digits = v.replace(/\D/g, '');
  if (!v.trim()) return 'Card number is required.';
  if (digits.length < 16) return `Please enter the remaining ${16 - digits.length} digit${16 - digits.length !== 1 ? 's' : ''} of your card number.`;
  if (digits.length > 16) return 'Card number is too long. Most cards have 16 digits.';
  // Luhn algorithm check
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[digits.length - 1 - i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  if (sum % 10 !== 0) return 'This card number doesn\'t appear to be valid. Please check for typos.';
  return '';
}

function validateExpiry(v: string) {
  if (!v.trim()) return 'Expiry date is required.';
  if (!/^\d{2}\/\d{2}$/.test(v)) return 'Please enter a valid expiry date in MM/YY format.';
  const [mm, yy] = v.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Month must be between 01 and 12.';
  const now = new Date();
  const fullYear = 2000 + yy;
  if (fullYear < now.getFullYear() || (fullYear === now.getFullYear() && mm < now.getMonth() + 1)) {
    return 'This card appears to have expired. Please check the date.';
  }
  return '';
}

function validateCvv(v: string) {
  const digits = v.replace(/\D/g, '');
  if (!v.trim()) return 'CVV is required.';
  if (digits.length < 3) return 'CVV must be 3–4 digits. Please check your card.';
  return '';
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  validate: (v: string) => string;
  format?: (v: string) => string;
  maxLength?: number;
  full?: boolean;
}

const DELIVERY_FIELDS: FormField[] = [
  { id: 'firstName',  label: 'First Name',       placeholder: 'Emma',          autoComplete: 'given-name',    validate: validateName, full: false },
  { id: 'lastName',   label: 'Last Name',        placeholder: 'Laurent',       autoComplete: 'family-name',   validate: validateName, full: false },
  { id: 'street',     label: 'Street & Number',  placeholder: '12 Bond Street',autoComplete: 'street-address',validate: validateName, full: true  },
  { id: 'postcode',   label: 'Postcode',         placeholder: 'W1S 4TB',       autoComplete: 'postal-code',   validate: validatePostcode, full: false },
  { id: 'city',       label: 'City',             placeholder: 'London',        autoComplete: 'address-level2',validate: validateName, full: false },
  { id: 'phone',      label: 'Phone Number',     placeholder: '+44 7700 900123',type: 'tel', autoComplete: 'tel', validate: validatePhone, full: true },
  { id: 'email',      label: 'Email Address',    placeholder: 'you@example.com',type: 'email', autoComplete: 'email', validate: validateEmail, full: true },
];

const PAYMENT_FIELDS: FormField[] = [
  {
    id: 'cardNum', label: 'Card Number', placeholder: '1234 5678 9012 3456',
    autoComplete: 'cc-number', validate: validateCard, maxLength: 19,
    format: (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(),
    full: true,
  },
  { id: 'cardExp', label: 'Expiry (MM/YY)', placeholder: 'MM/YY', autoComplete: 'cc-exp', validate: validateExpiry, maxLength: 5, format: (v) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d; }, full: false },
  { id: 'cardCvv', label: 'CVV / CVC', placeholder: '•••', autoComplete: 'cc-csc', validate: validateCvv, maxLength: 4, type: 'password', full: false },
];

function FormFieldComponent({
  field,
  state,
  onChange,
  onBlur,
}: {
  field: FormField;
  state: FieldState;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const hasError = state.touched && !!state.error;
  const hasSuccess = state.touched && state.valid;
  const errId = `${field.id}-error`;
  const okId  = `${field.id}-ok`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={field.id}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.04em', fontWeight: 500, color: '#0a0a0a' }}
      >
        {field.label} <span aria-hidden="true" style={{ color: '#b91c1c' }}>*</span>
      </label>
      <div className="relative">
        <input
          id={field.id}
          type={field.type || 'text'}
          value={state.value}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby={`${hasError ? errId : ''} ${hasSuccess ? okId : ''}`.trim() || undefined}
          onChange={e => onChange(field.format ? field.format(e.target.value) : e.target.value)}
          onBlur={onBlur}
          className="w-full"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: '#0a0a0a',
            padding: '11px 14px',
            paddingRight: (hasError || hasSuccess) ? 38 : 14,
            border: `1px solid ${hasError ? '#b91c1c' : hasSuccess ? '#3a7d44' : '#e4e4e4'}`,
            borderRadius: 2,
            outline: 'none',
            background: 'white',
            transition: 'border-color 0.2s',
          }}
        />
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b91c1c] pointer-events-none" aria-hidden="true" />
        )}
        {hasSuccess && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a7d44] pointer-events-none" aria-hidden="true" />
        )}
      </div>

      {/* Inline error – plain language, no error codes */}
      {hasError && (
        <p
          id={errId}
          role="alert"
          className="flex items-center gap-1.5"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b91c1c' }}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}
      {hasSuccess && !hasError && (
        <p
          id={okId}
          className="flex items-center gap-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#3a7d44' }}
          aria-live="polite"
        >
          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> Looks good
        </p>
      )}
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state, clearCart, placeOrder } = useApp();

  // Build field state map
  const allFields = [...DELIVERY_FIELDS, ...PAYMENT_FIELDS];
  const initState = () => Object.fromEntries(allFields.map(f => [f.id, initField()]));
  const [fields, setFields] = useState<Record<string, FieldState>>(initState);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = state.cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const vat = subtotal * 0.21;

  const allValid = allFields.every(f => fields[f.id].valid);

  function handleChange(id: string, value: string, validate: (v: string) => string) {
    const error = validate(value);
    setFields(prev => ({ ...prev, [id]: { ...prev[id], value, error, valid: !error, touched: prev[id].touched } }));
  }

  function handleBlur(id: string, validate: (v: string) => string) {
    setFields(prev => {
      const v = prev[id].value;
      const error = validate(v);
      return { ...prev, [id]: { ...prev[id], error, valid: !error, touched: true } };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Touch all fields to show errors
    setFields(prev => {
      const next = { ...prev };
      allFields.forEach(f => {
        const err = f.validate(next[f.id].value);
        next[f.id] = { ...next[f.id], error: err, valid: !err, touched: true };
      });
      return next;
    });

    if (!allValid) return;

    setSubmitting(true);

    // Build the order from cart items
    const orderNum = `VLT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const orderDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const deliveryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrder: PlacedOrder = {
      id: orderNum,
      date: orderDate,
      total: subtotal,
      status: 'Processing',
      trackingCode: `DHL-VLT-${Date.now().toString().slice(-7)}`,
      estimatedDelivery: deliveryDate,
      items: state.cart.map(item => ({
        name: item.product.name,
        brand: item.product.brand,
        size: item.size,
        color: item.color,
        price: item.product.price * item.quantity,
        img: item.product.image,
        quantity: item.quantity,
      })),
    };

    setTimeout(() => {
      placeOrder(newOrder);
      clearCart();
      navigate('/confirmation', { state: { orderNum } });
    }, 1400);
  }

  if (state.cart.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#0a0a0a', marginBottom: 10 }}>Your cart is empty</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 24 }}>Add some items before checking out.</p>
        <button onClick={() => navigate('/women/clothing')} className="px-6 py-3 bg-[#0a0a0a] text-[#fafafa] rounded-sm hover:bg-[#2a2a2a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 px-8 md:px-10 py-3.5" style={{ borderBottom: '1px solid #e4e4e4', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }} aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#0a0a0a] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        <span className="hover:text-[#0a0a0a] cursor-pointer transition-colors" onClick={() => navigate(-1)}>Cart</span>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        <span style={{ color: '#0a0a0a' }}>Checkout</span>
      </nav>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 px-8 py-4" style={{ borderBottom: '1px solid #e4e4e4', background: '#f8f8f8' }}>
        {['Cart', 'Checkout', 'Confirmation'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i <= 1 ? 'text-[#0a0a0a]' : 'text-[#a0a0a0]'}`}>
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ background: i <= 1 ? '#0a0a0a' : '#e4e4e4', color: i <= 1 ? '#fafafa' : '#a0a0a0', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500 }}
              >
                {i + 1}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{step}</span>
            </div>
            {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-[#d4d4d4]" aria-hidden="true" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="px-8 md:px-12 py-10" style={{ borderRight: '1px solid #e4e4e4' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a', marginBottom: 32 }}>
              Checkout
            </h1>

            {/* Step 1: Delivery */}
            <section className="mb-10" aria-labelledby="delivery-heading">
              <h2 id="delivery-heading" className="flex items-center gap-3 mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
                <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center text-xs" style={{ fontSize: 12, fontWeight: 500 }}>1</span>
                <Truck className="w-4 h-4 text-[#6b6b6b]" aria-hidden="true" />
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 gap-y-4">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  {DELIVERY_FIELDS.filter(f => f.id === 'firstName' || f.id === 'lastName').map(f => (
                    <FormFieldComponent
                      key={f.id}
                      field={f}
                      state={fields[f.id]}
                      onChange={v => handleChange(f.id, v, f.validate)}
                      onBlur={() => handleBlur(f.id, f.validate)}
                    />
                  ))}
                </div>
                {/* Street */}
                {DELIVERY_FIELDS.filter(f => f.id === 'street').map(f => (
                  <FormFieldComponent
                    key={f.id}
                    field={f}
                    state={fields[f.id]}
                    onChange={v => handleChange(f.id, v, f.validate)}
                    onBlur={() => handleBlur(f.id, f.validate)}
                  />
                ))}
                {/* Postcode + City */}
                <div className="grid grid-cols-2 gap-4">
                  {DELIVERY_FIELDS.filter(f => f.id === 'postcode' || f.id === 'city').map(f => (
                    <FormFieldComponent
                      key={f.id}
                      field={f}
                      state={fields[f.id]}
                      onChange={v => handleChange(f.id, v, f.validate)}
                      onBlur={() => handleBlur(f.id, f.validate)}
                    />
                  ))}
                </div>
                {/* Phone + Email */}
                {DELIVERY_FIELDS.filter(f => f.id === 'phone' || f.id === 'email').map(f => (
                  <FormFieldComponent
                    key={f.id}
                    field={f}
                    state={fields[f.id]}
                    onChange={v => handleChange(f.id, v, f.validate)}
                    onBlur={() => handleBlur(f.id, f.validate)}
                  />
                ))}
              </div>
            </section>

            <div style={{ height: 1, background: '#e4e4e4', marginBottom: 32 }} />

            {/* Step 2: Payment */}
            <section aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="flex items-center gap-3 mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
                <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center" style={{ fontSize: 12, fontWeight: 500 }}>2</span>
                <CreditCard className="w-4 h-4 text-[#6b6b6b]" aria-hidden="true" />
                Payment Details
              </h2>

              <div className="flex gap-2 mb-5">
                {['VISA', 'MC', 'PAYPAL', 'APPLE'].map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-sm" style={{ border: '1px solid #e4e4e4', fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#6b6b6b', letterSpacing: '0.05em' }}>{p}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-y-4">
                {PAYMENT_FIELDS.filter(f => f.id === 'cardNum').map(f => (
                  <FormFieldComponent
                    key={f.id}
                    field={f}
                    state={fields[f.id]}
                    onChange={v => handleChange(f.id, v, f.validate)}
                    onBlur={() => handleBlur(f.id, f.validate)}
                  />
                ))}
                <div className="grid grid-cols-2 gap-4">
                  {PAYMENT_FIELDS.filter(f => f.id !== 'cardNum').map(f => (
                    <FormFieldComponent
                      key={f.id}
                      field={f}
                      state={fields[f.id]}
                      onChange={v => handleChange(f.id, v, f.validate)}
                      onBlur={() => handleBlur(f.id, f.validate)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Submit – Error Prevention: disabled until all fields valid */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 rounded-sm transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  padding: '17px 24px',
                  background: !allValid ? '#c8c8c8' : '#0a0a0a',
                  color: '#fafafa',
                  border: 'none',
                  cursor: !allValid ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
                aria-disabled={!allValid}
                aria-describedby="submit-hint"
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                {submitting ? 'Processing...' : 'Place Order Securely'}
              </button>

              <p
                id="submit-hint"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: 8 }}
                role="note"
              >
                {!allValid
                  ? 'Complete all required fields to enable checkout'
                  : 'Your payment is encrypted and secure'}
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="px-8 py-10 bg-[#f8f8f8]" aria-label="Order summary">
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 20 }}>
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {state.cart.map(item => (
                <div key={item.key} className="flex gap-3 items-start">
                  <div className="shrink-0 rounded-sm overflow-hidden" style={{ width: 56, height: 64, border: '1px solid #e4e4e4', background: 'white' }}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#0a0a0a', marginBottom: 2 }} className="truncate">{item.product.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b6b6b' }}>Size {item.size} · {item.color} · Qty {item.quantity}</p>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', whiteSpace: 'nowrap' }}>
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#e4e4e4', marginBottom: 16 }} />

            <div className="space-y-2 mb-4">
              {[
                { label: 'Subtotal', value: `€${subtotal.toFixed(2)}` },
                { label: 'Shipping', value: 'Free', valueColor: '#3a7d44' },
                { label: 'VAT (included)', value: `€${vat.toFixed(2)}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                  <span>{row.label}</span>
                  <span style={{ color: (row as any).valueColor || '#6b6b6b' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#e4e4e4', marginBottom: 16 }} />

            <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
              <span>Total</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            {/* Trust signals */}
            <div className="mt-8 space-y-3">
              {[
                { icon: Lock, text: '256-bit SSL encrypted checkout' },
                { icon: RotateCcwIcon, text: 'Free returns within 30 days' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#6b6b6b] shrink-0" aria-hidden="true" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Small inline icon to avoid import clutter
function RotateCcwIcon({ className, 'aria-hidden': ariaHidden }: { className?: string; 'aria-hidden'?: boolean }) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
    </svg>
  );
}