import { useNavigate } from 'react-router';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function CartSidebar() {
  const navigate = useNavigate();
  const { state, closeCart, removeFromCart, updateQuantity, addToCart, showToast } = useApp();
  const { cartOpen, cart } = state;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const vat = subtotal * 0.21;

  function handleCheckout() {
    closeCart();
    navigate('/checkout');
  }

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[800] overlay-enter"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-[#fafafa] z-[900] flex flex-col shadow-2xl panel-enter"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid #e4e4e4' }}
        >
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
            Your Cart
            <span style={{ color: '#6b6b6b', fontWeight: 400 }}>
              &nbsp;({state.cartCount} {state.cartCount === 1 ? 'item' : 'items'})
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-9 h-9 rounded-sm hover:bg-[#f2f2f2] transition-colors text-[#6b6b6b] hover:text-[#0a0a0a]"
            aria-label="Close shopping cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto custom-scroll px-6 py-4 flex flex-col gap-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#d4d4d4] mb-4" />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#6b6b6b', marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#a0a0a0' }}>Add items to get started.</p>
            </div>
          ) : (
            cart.map(item => (
              <CartItem
                key={item.key}
                item={item}
                onRemove={() => {
                  const removedItem = { ...item };
                  removeFromCart(item.key);
                  showToast(`"${item.product.name}" removed from cart.`, {
                    label: 'Undo',
                    onClick: () => {
                      addToCart(removedItem);
                    },
                  });
                }}
                onQtyChange={(qty) => updateQuantity(item.key, qty)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid #e4e4e4' }}>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                <span>Shipping</span>
                <span style={{ color: '#3a7d44' }}>Free</span>
              </div>
              <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                <span>VAT (included)</span>
                <span>€{vat.toFixed(2)}</span>
              </div>
              <div className="h-px bg-[#e4e4e4] my-3" />
              <div className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
                <span>Total</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#0a0a0a] text-[#fafafa] py-4 rounded-sm hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
            >
              Proceed to Checkout →
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: 10 }}>
              Prices include VAT · Secure checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItem({
  item,
  onRemove,
  onQtyChange,
}: {
  item: import('../store/AppContext').CartItem;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  return (
    <div className="flex gap-3" role="listitem">
      {/* Image */}
      <div
        className="shrink-0 rounded-sm overflow-hidden bg-[#f2f2f2]"
        style={{ width: 72, height: 84 }}
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b6b6b' }}>
          {item.product.brand}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#0a0a0a', margin: '2px 0 3px' }} className="truncate">
          {item.product.name}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }}>
          Size: {item.size} &nbsp;·&nbsp; {item.color}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0a0a0a', marginTop: 6 }}>
          €{(item.product.price * item.quantity).toFixed(2)}
        </p>

        {/* Quantity + remove */}
        <div className="flex items-center gap-2 mt-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-[#f2f2f2] transition-colors"
            style={{ border: '1px solid #e4e4e4' }}
            onClick={() => onQtyChange(item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.product.name}`}
          >
            <Minus className="w-3 h-3 text-[#0a0a0a]" />
          </button>
          <span
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, minWidth: 20, textAlign: 'center', color: '#0a0a0a' }}
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-[#f2f2f2] transition-colors"
            style={{ border: '1px solid #e4e4e4' }}
            onClick={() => onQtyChange(item.quantity + 1)}
            aria-label={`Increase quantity of ${item.product.name}`}
          >
            <Plus className="w-3 h-3 text-[#0a0a0a]" />
          </button>
          <button
            onClick={onRemove}
            className="ml-auto flex items-center gap-1 text-[#a0a0a0] hover:text-[#b91c1c] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}