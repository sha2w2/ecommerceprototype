import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { X, Maximize2, Minimize2, Send, Bot, User as UserIcon } from 'lucide-react';

type Message = { sender: 'bot' | 'user'; text: string; timestamp: Date };

const BOT_RESPONSES: { keywords: string[]; reply: string }[] = [
  { keywords: ['return', 'refund', 'send back'], reply: 'Our returns policy allows free returns within 30 days of delivery. Go to Account → Orders & Returns, select your item, and print the prepaid label. Refunds are processed within 3–5 business days of us receiving the item.' },
  { keywords: ['ship', 'delivery', 'deliver', 'tracking', 'when'], reply: 'Standard delivery takes 4–7 working days and is free on orders over €150. Express delivery (1–2 days) is available for €14.99. Once shipped, you\'ll receive a tracking email with live updates.' },
  { keywords: ['size', 'fit', 'measurement'], reply: 'Our sizes are standard European sizing. You can find specific measurements on each product page. We also have a full Size Guide at /help/SizeGuide if you need more help.' },
  { keywords: ['payment', 'pay', 'card', 'visa', 'paypal', 'klarna'], reply: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Klarna (Pay Later). All payments are secured with 256-bit SSL encryption.' },
  { keywords: ['account', 'login', 'password', 'sign in'], reply: 'To reset your password, use the "Forgot Password" link on the login screen. For account-specific questions, our team can look into your account directly — just share your registered email.' },
  { keywords: ['discount', 'promo', 'code', 'sale', 'offer'], reply: 'As a VAULTÉ member, all our prices are already discounted up to 80% off RRP. Keep an eye on your inbox for exclusive member-only flash sales and additional vouchers.' },
  { keywords: ['loyalty', 'points', 'reward'], reply: 'You earn 10 points for every €1 spent. Points can be redeemed as vouchers at checkout (1,000 pts = €10). Check your balance in Account → Loyalty & Rewards.' },
  { keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'], reply: 'Hello! Welcome to VAULTÉ support. How can I help you today? You can ask me about orders, returns, shipping, sizing, payments, or anything else.' },
  { keywords: ['thank', 'thanks', 'great', 'perfect', 'helpful'], reply: 'You\'re very welcome! Is there anything else I can help you with today?' },
  { keywords: ['cancel', 'cancellation', 'stop order'], reply: 'We process orders quickly, so cancellations are only possible within 30 minutes of placing the order. Please contact us immediately via this chat if you need to cancel.' },
  { keywords: ['member', 'join', 'invite', 'register', 'sign up'], reply: 'VAULTÉ is a members-only platform. You can join via an existing member\'s invite link, or add yourself to our waitlist at vaulte.com/join. Approved members receive an email within 48 hours.' },
  { keywords: ['human', 'agent', 'person', 'real', 'support'], reply: 'Connecting you to a live agent… Please hold on. Our agents are available 8am–10pm daily. Average wait time right now: ~3 minutes.' },
];

function getBotReply(userMsg: string): string {
  const lower = userMsg.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply;
    }
  }
  return "I'm not sure about that specific question, but I'd love to help. Could you give me a bit more detail, or would you like me to connect you to a live support agent?";
}

export function LiveChat() {
  const { state, closeChat } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [msg, setMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([
    { sender: 'bot', text: 'Hi! I\'m the VAULTÉ virtual assistant. I can help with orders, returns, shipping, sizing, and more. What do you need today?', timestamp: new Date() }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusId = 'chat-status';

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [state.chatOpen]);

  if (!state.chatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const userMsg = msg.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setMsg('');
    setIsTyping(true);

    // Simulate typing delay
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      setIsTyping(false);
      setChatLog(prev => [...prev, {
        sender: 'bot',
        text: getBotReply(userMsg),
        timestamp: new Date(),
      }]);
    }, delay);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const QUICK_REPLIES = ['Track my order', 'Start a return', 'Shipping info', 'Size guide'];

  return (
    <div
      className={`fixed z-[1000] bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
        expanded
          ? 'bottom-0 right-0 w-full sm:w-[600px] h-[80vh] sm:h-[620px]'
          : 'bottom-0 right-5 w-[90vw] sm:w-[360px] h-[520px]'
      }`}
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        border: '1px solid #e4e4e4',
        borderBottom: 'none',
      }}
      role="dialog"
      aria-label="VAULTÉ Live Chat"
      aria-describedby={statusId}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] text-white shrink-0"
        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>Live Support</p>
            <p id={statusId} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1 align-middle" aria-hidden="true" />
              Online · Usually replies in a few minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 hover:bg-white/10 rounded-sm transition-colors"
            aria-label={expanded ? 'Minimize chat window' : 'Expand chat window'}
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scroll bg-[#fafafa]"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {chatLog.map((c, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${c.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1"
              style={{ background: c.sender === 'bot' ? '#0a0a0a' : '#e4e4e4' }}
              aria-hidden="true"
            >
              {c.sender === 'bot'
                ? <Bot className="w-3.5 h-3.5 text-white" />
                : <UserIcon className="w-3.5 h-3.5 text-[#0a0a0a]" />
              }
            </div>
            <div className={`flex flex-col gap-1 max-w-[78%] ${c.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-lg ${
                  c.sender === 'user'
                    ? 'bg-[#0a0a0a] text-white rounded-br-none'
                    : 'bg-white text-[#0a0a0a] shadow-sm rounded-bl-none'
                }`}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.55,
                  border: c.sender === 'bot' ? '1px solid #e4e4e4' : 'none',
                }}
              >
                {c.text}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#a0a0a0' }}>
                {formatTime(c.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2" aria-label="Agent is typing" role="status">
            <div className="w-7 h-7 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0" aria-hidden="true">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-3.5 py-3 bg-white border border-[#e4e4e4] rounded-lg rounded-bl-none shadow-sm flex gap-1 items-center">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#a0a0a0]"
                  style={{ animation: `bounce 1.2s ${delay}s infinite` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {chatLog.length === 1 && !isTyping && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 bg-[#fafafa] shrink-0" aria-label="Quick reply options">
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr}
              onClick={() => {
                setChatLog(prev => [...prev, { sender: 'user', text: qr, timestamp: new Date() }]);
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  setChatLog(prev => [...prev, { sender: 'bot', text: getBotReply(qr), timestamp: new Date() }]);
                }, 900);
              }}
              className="px-3 py-1.5 border border-[#e4e4e4] rounded-full text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, background: 'white' }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white flex items-center gap-2 shrink-0"
        style={{ borderTop: '1px solid #e4e4e4' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type your message…"
          aria-label="Chat message input"
          className="flex-1 outline-none px-3 py-2 bg-[#f8f8f8] rounded-full text-[#0a0a0a] focus:ring-2 focus:ring-[#0a0a0a] focus:bg-white transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, border: '1px solid #e4e4e4' }}
        />
        <button
          type="submit"
          disabled={!msg.trim() || isTyping}
          className="w-9 h-9 bg-[#0a0a0a] text-white rounded-full hover:bg-[#2a2a2a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
