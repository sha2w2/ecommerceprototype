import { useState } from 'react';
import { Award, Gift, TrendingUp, Info, History } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const REWARDS = [
  {
    id: 'shipping',
    icon: Gift,
    title: 'Free Express Shipping',
    desc: 'Valid on your next order. Express delivery included.',
    points: 500,
    available: true,
  },
  {
    id: 'voucher10',
    icon: TrendingUp,
    title: '€10 Discount Voucher',
    desc: 'Applied at checkout automatically.',
    points: 1000,
    available: true,
  },
  {
    id: 'voucher50',
    icon: TrendingUp,
    title: '€50 Discount Voucher',
    desc: 'Apply at checkout. Single use.',
    points: 2500,
    available: true,
  },
  {
    id: 'early-access',
    icon: Award,
    title: 'Early Access: Private Sale',
    desc: 'VIP entry to our members-only flash sale.',
    points: 5000,
    available: false,
  },
];

const POINT_HISTORY = [
  { date: 'Apr 14, 2026', desc: 'Order #VLT-8493-9921 · 2 items', pts: +6180, type: 'earn' },
  { date: 'Mar 02, 2026', desc: 'Referral bonus — Emma L.', pts: +500, type: 'earn' },
  { date: 'Feb 14, 2026', desc: 'Redeemed: Free Shipping Voucher', pts: -500, type: 'redeem' },
  { date: 'Jan 22, 2026', desc: 'Order #VLT-6110-5499 · 3 items', pts: +14500, type: 'earn' },
  { date: 'Dec 10, 2025', desc: 'Redeemed: €50 Voucher', pts: -2500, type: 'redeem' },
];

export function LoyaltyPointsPage() {
  const { showToast } = useApp();
  const [currentPoints, setCurrentPoints] = useState(4250);
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());
  const nextTierPoints = 5000;
  const progress = Math.min((currentPoints / nextTierPoints) * 100, 100);

  function handleRedeem(reward: typeof REWARDS[0]) {
    if (!reward.available) return;
    if (currentPoints < reward.points) {
      showToast(`You need ${reward.points - currentPoints} more points to redeem this reward.`);
      return;
    }
    setCurrentPoints(p => p - reward.points);
    setRedeemedIds(prev => new Set(prev).add(reward.id));
    showToast(`"${reward.title}" redeemed successfully! A voucher code has been emailed to you.`);
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#0a0a0a', marginBottom: 24 }}>
        Loyalty & Rewards
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 40, lineHeight: 1.6 }}>
        As a VAULTÉ member, you earn 10 points for every €1 spent. Redeem points for exclusive rewards and early access.
      </p>

      {/* Points Summary Card */}
      <div className="bg-[#0a0a0a] text-white p-8 rounded-sm mb-10 flex flex-col md:flex-row items-center justify-between shadow-md gap-8">
        <div>
          <p className="text-[#a0a0a0] uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500 }}>
            Current Balance
          </p>
          <div className="flex items-baseline gap-3 mb-2">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300 }} aria-label={`${currentPoints.toLocaleString()} points`}>
              {currentPoints.toLocaleString()}
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>PTS</span>
          </div>
          <p className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#c4a882' }}>
            <Award className="w-4 h-4" aria-hidden="true" /> Gold Member Status
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex justify-between mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a0a0a0' }}>
            <span>Gold ({currentPoints.toLocaleString()} pts)</span>
            <span>Platinum ({nextTierPoints.toLocaleString()} pts)</span>
          </div>
          <div className="w-full bg-[#3a3a3a] h-2.5 rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={currentPoints} aria-valuemin={0} aria-valuemax={nextTierPoints} aria-label="Progress to Platinum status">
            <div className="bg-[#c4a882] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#a0a0a0' }}>
            {nextTierPoints - currentPoints > 0
              ? `${(nextTierPoints - currentPoints).toLocaleString()} points away from Platinum — unlock free express shipping and a personal stylist.`
              : 'You have reached Platinum status! 🎉'
            }
          </p>
        </div>
      </div>

      {/* Available Rewards */}
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a', marginBottom: 20 }}>
        Redeem Rewards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {REWARDS.map(reward => {
          const Icon = reward.icon;
          const isRedeemed = redeemedIds.has(reward.id);
          const canAfford = currentPoints >= reward.points;
          const isDisabled = !reward.available || isRedeemed;

          return (
            <div
              key={reward.id}
              className={`p-6 border rounded-sm flex flex-col ${isDisabled ? 'opacity-50 grayscale' : 'bg-[#fafafa] hover:border-[#0a0a0a] transition-colors'}`}
              style={{ border: '1px solid #e4e4e4' }}
            >
              <Icon className="w-7 h-7 text-[#0a0a0a] mb-4" aria-hidden="true" />
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0a0a0a', marginBottom: 4 }}>
                {reward.title}
              </h4>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', marginBottom: 16, lineHeight: 1.5 }}>
                {reward.desc}
              </p>
              <button
                onClick={() => handleRedeem(reward)}
                disabled={isDisabled || !canAfford}
                className={`mt-auto w-full py-2.5 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] ${
                  isRedeemed
                    ? 'bg-[#f0f7f1] text-[#3a7d44] cursor-default'
                    : isDisabled
                    ? 'bg-[#e4e4e4] text-[#a0a0a0] cursor-not-allowed'
                    : canAfford
                    ? 'bg-[#0a0a0a] text-white hover:bg-[#2a2a2a] cursor-pointer'
                    : 'bg-[#e4e4e4] text-[#6b6b6b] cursor-not-allowed'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                aria-label={isRedeemed ? `${reward.title} already redeemed` : `Redeem ${reward.title} for ${reward.points} points`}
              >
                {isRedeemed
                  ? '✓ Redeemed'
                  : !reward.available
                  ? `Requires ${reward.points.toLocaleString()} pts`
                  : !canAfford
                  ? `Need ${(reward.points - currentPoints).toLocaleString()} more pts`
                  : `Redeem · ${reward.points.toLocaleString()} pts`
                }
              </button>
            </div>
          );
        })}
      </div>

      {/* Points History */}
      <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>
        <History className="w-4 h-4 text-[#6b6b6b]" aria-hidden="true" />
        Points History
      </h3>
      <div className="bg-white border border-[#e4e4e4] rounded-sm divide-y divide-[#e4e4e4] mb-8">
        {POINT_HISTORY.map((entry, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#0a0a0a', marginBottom: 2 }}>{entry.desc}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#a0a0a0' }}>{entry.date}</p>
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: entry.type === 'earn' ? '#3a7d44' : '#b91c1c',
              }}
              aria-label={`${entry.type === 'earn' ? 'Earned' : 'Redeemed'} ${Math.abs(entry.pts).toLocaleString()} points`}
            >
              {entry.pts > 0 ? '+' : ''}{entry.pts.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>

      <div className="bg-[#f8f8f8] p-4 flex items-start gap-3 rounded-sm border border-[#e4e4e4]">
        <Info className="w-5 h-5 text-[#6b6b6b] mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', lineHeight: 1.5 }}>
          Points expire after 12 months of inactivity. Ensure you use them before{' '}
          <span style={{ fontWeight: 500, color: '#0a0a0a' }}>Oct 15, 2027</span>. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
