import { useState } from 'react';
import { Package, ChevronRight, ChevronDown, ExternalLink, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp, PlacedOrder } from '../../store/AppContext';

const mockOrders: PlacedOrder[] = [
  {
    id: 'VLT-8493-9921',
    date: 'Oct 15, 2026',
    total: 618.00,
    status: 'Delivered',
    trackingCode: 'DHL-DE-4829012',
    estimatedDelivery: 'Oct 22, 2026',
    items: [
      { name: 'Heritage Check Trench Coat', brand: 'Burberry', size: 'M', color: 'Camel', price: 389.00, img: 'https://images.unsplash.com/photo-1722859031306-4c81e8d83957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
      { name: 'Slim-Fit Merino Polo', brand: 'Boss Black', size: 'L', color: 'Navy', price: 89.00, img: 'https://images.unsplash.com/photo-1720514496505-d6756368b0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
    ],
  },
  {
    id: 'VLT-7721-0043',
    date: 'Sep 02, 2026',
    total: 225.00,
    status: 'Returned',
    trackingCode: 'UPS-RETURN-8821',
    estimatedDelivery: 'Sep 09, 2026',
    items: [
      { name: 'Vulcanized Canvas Sneakers', brand: 'Off-White\u2122', size: 'EU 40', color: 'White', price: 225.00, img: 'https://images.unsplash.com/photo-1586556694812-fdae68467216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
    ],
  },
  {
    id: 'VLT-6110-5499',
    date: 'Jul 18, 2026',
    total: 1450.00,
    status: 'Delivered',
    trackingCode: 'DHL-DE-3317882',
    estimatedDelivery: 'Jul 26, 2026',
    items: [
      { name: 'Leather Business Tote', brand: 'Joop!', size: 'One Size', color: 'Black', price: 229.00, img: 'https://images.unsplash.com/photo-1761345880123-c7c3b160c1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
      { name: 'Knee-High Stretch Boots', brand: 'Stuart Weitzman', size: 'EU 38', color: 'Black', price: 299.00, img: 'https://images.unsplash.com/photo-1775704847874-1f9f403e4edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
      { name: 'Silk Wrap Midi Dress', brand: 'Max Mara', size: 'S', color: 'Sand', price: 289.00, img: 'https://images.unsplash.com/photo-1663851782559-360286c8100d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', quantity: 1 },
    ],
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: '#f0f7f1', text: '#3a7d44' },
  Returned:  { bg: '#fff1f2', text: '#b91c1c' },
  Shipped:   { bg: '#eff6ff', text: '#1d4ed8' },
  Processing:{ bg: '#fefce8', text: '#a16207' },
};

export function OrdersReturnsPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'returns'>('orders');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Merge placed orders (newest first) with mock orders
  const allOrders: PlacedOrder[] = [...[...state.orders].reverse(), ...mockOrders];

  const filteredOrders = allOrders.filter(o =>
    activeTab === 'returns' ? o.status === 'Returned' : true
  );

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#0a0a0a', marginBottom: 24 }}>
        Orders & Returns
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 40, lineHeight: 1.6 }}>
        Track your recent orders, manage returns, and download invoices.
      </p>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#e4e4e4] mb-8" role="tablist" aria-label="Orders navigation">
        {(['orders', 'returns'] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 relative transition-colors ${activeTab === tab ? 'text-[#0a0a0a]' : 'text-[#a0a0a0] hover:text-[#6b6b6b]'}`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0a0a0a]" />}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-12 h-12 text-[#d4d4d4] mx-auto mb-4" />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#6b6b6b', marginBottom: 16 }}>
            No {activeTab} yet.
          </p>
          <button
            onClick={() => navigate('/women/clothing')}
            className="px-6 py-2.5 bg-[#0a0a0a] text-white rounded-sm hover:bg-[#2a2a2a] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4" role="tabpanel">
          {filteredOrders.map(order => {
            const isExpanded = expandedId === order.id;
            const statusStyle = STATUS_STYLES[order.status] || { bg: '#f2f2f2', text: '#6b6b6b' };

            return (
              <div
                key={order.id}
                className="border border-[#e4e4e4] rounded-sm bg-white hover:border-[#0a0a0a] transition-colors"
              >
                {/* Order Header */}
                <button
                  className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0a0a0a]"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`order-${order.id}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0a0a0a' }}>
                        Order #{order.id}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-sm text-xs font-medium"
                        style={{ background: statusStyle.bg, color: statusStyle.text, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b' }}>
                      Placed {order.date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · \u20AC{order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Thumbnail stack */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.img}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-sm border-2 border-white"
                          style={{ zIndex: order.items.length - i }}
                        />
                      ))}
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-[#6b6b6b] shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-[#6b6b6b] shrink-0" />
                    }
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div id={`order-${order.id}`} className="border-t border-[#e4e4e4] p-5">
                    {/* Tracking */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#f8f8f8] rounded-sm">
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Tracking Code</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>{order.trackingCode}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          {order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>{order.estimatedDelivery}</p>
                      </div>
                      <button
                        className="flex items-center gap-1.5 ml-auto px-4 py-2 border border-[#0a0a0a] text-[#0a0a0a] rounded-sm hover:bg-[#0a0a0a] hover:text-white transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}
                        aria-label={`Track order ${order.id} externally`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        Track Package
                      </button>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-sm border border-[#e4e4e4] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b6b6b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.brand}</p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a', marginTop: 2 }} className="truncate">{item.name}</p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', marginTop: 2 }}>
                              Size {item.size} · {item.color}{item.quantity > 1 ? ` · Qty ${item.quantity}` : ''}
                            </p>
                          </div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0a0a0a', whiteSpace: 'nowrap' }}>
                            {'\u20AC'}{item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#e4e4e4]">
                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => navigate('/help/Returns')}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] text-white rounded-sm hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a0a0a]"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          Start a Return
                        </button>
                      )}
                      <button
                        className="px-4 py-2.5 border border-[#e4e4e4] text-[#0a0a0a] rounded-sm hover:bg-[#f2f2f2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
