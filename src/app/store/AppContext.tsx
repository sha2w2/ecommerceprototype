import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { Product, PRODUCTS } from '../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  key: string; // productId-size-color
}

export interface OrderItem {
  name: string;
  brand: string;
  size: string;
  color: string;
  price: number;
  img: string;
  quantity: number;
}

export interface PlacedOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  trackingCode: string;
  estimatedDelivery: string;
  items: OrderItem[];
}

export interface ToastItem {
  id: string;
  message: string;
  action?: { label: string; onClick: () => void };
  exiting?: boolean;
}

interface AppState {
  cart: CartItem[];
  wishlist: Set<number>;
  recentlyViewed: Product[];
  cartOpen: boolean;
  helpOpen: boolean;
  chatOpen: boolean;
  toasts: ToastItem[];
  cartCount: number;
  orders: PlacedOrder[];
}

type Action =
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; key: string }
  | { type: 'UPDATE_QUANTITY'; key: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; id: number }
  | { type: 'REMOVE_FROM_WISHLIST'; id: number }
  | { type: 'ADD_RECENT'; product: Product }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_HELP' }
  | { type: 'CLOSE_HELP' }
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'EXIT_TOAST'; id: string }
  | { type: 'PLACE_ORDER'; order: PlacedOrder };

const RECENT_KEY = 'vaulte_recently_viewed';

function loadRecentlyViewed(): Product[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const ids: number[] = JSON.parse(raw);
    return ids.map(id => PRODUCTS.find(p => p.id === id)).filter((p): p is Product => !!p);
  } catch (_e) {
    return [];
  }
}

function saveRecentlyViewed(products: Product[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(products.map(p => p.id)));
  } catch (_e) { /* quota exceeded or private mode */ }
}

const initialState: AppState = {
  cart: [],
  wishlist: new Set(),
  recentlyViewed: [],
  cartOpen: false,
  helpOpen: false,
  chatOpen: false,
  toasts: [],
  cartCount: 0,
  orders: [],
};

function cartCountFrom(cart: CartItem[]) {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.key === action.item.key);
      const cart = existing
        ? state.cart.map(i => i.key === action.item.key ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.cart, action.item];
      return { ...state, cart, cartCount: cartCountFrom(cart) };
    }
    case 'REMOVE_FROM_CART': {
      const cart = state.cart.filter(i => i.key !== action.key);
      return { ...state, cart, cartCount: cartCountFrom(cart) };
    }
    case 'UPDATE_QUANTITY': {
      const cart = state.cart
        .map(i => i.key === action.key ? { ...i, quantity: action.quantity } : i)
        .filter(i => i.quantity > 0);
      return { ...state, cart, cartCount: cartCountFrom(cart) };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], cartCount: 0 };
    case 'ADD_TO_WISHLIST': {
      const wishlist = new Set(state.wishlist);
      wishlist.add(action.id);
      return { ...state, wishlist };
    }
    case 'REMOVE_FROM_WISHLIST': {
      const wishlist = new Set(state.wishlist);
      wishlist.delete(action.id);
      return { ...state, wishlist };
    }
    case 'ADD_RECENT': {
      const filtered = state.recentlyViewed.filter(p => p.id !== action.product.id);
      const recentlyViewed = [action.product, ...filtered].slice(0, 8);
      saveRecentlyViewed(recentlyViewed);
      return { ...state, recentlyViewed };
    }
    case 'OPEN_CART':   return { ...state, cartOpen: true };
    case 'CLOSE_CART':  return { ...state, cartOpen: false };
    case 'OPEN_HELP':   return { ...state, helpOpen: true };
    case 'CLOSE_HELP':  return { ...state, helpOpen: false };
    case 'OPEN_CHAT':   return { ...state, chatOpen: true };
    case 'CLOSE_CHAT':  return { ...state, chatOpen: false };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'EXIT_TOAST':
      return { ...state, toasts: state.toasts.map(t => t.id === action.id ? { ...t, exiting: true } : t) };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'PLACE_ORDER':
      return { ...state, orders: [...state.orders, action.order] };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (key: string, itemToRestore?: CartItem) => void;
  updateQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  addToRecent: (product: Product) => void;
  openCart: () => void;
  closeCart: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  openChat: () => void;
  closeChat: () => void;
  showToast: (message: string, action?: { label: string; onClick: () => void }) => void;
  placeOrder: (order: PlacedOrder) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    ...initialState,
    recentlyViewed: loadRecentlyViewed(),
  }));
  const toastTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const showToast = useCallback((message: string, action?: { label: string; onClick: () => void }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD_TOAST', toast: { id, message, action } });

    toastTimers.current[id] = setTimeout(() => {
      dispatch({ type: 'EXIT_TOAST', id });
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
        delete toastTimers.current[id];
      }, 320);
    }, 5000);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', item });
    showToast(`"${item.product.name}" added to cart.`);
  }, [showToast]);

  const removeFromCart = useCallback((key: string, itemToRestore?: CartItem) => {
    dispatch({ type: 'REMOVE_FROM_CART', key });
    if (itemToRestore) {
      showToast('Item removed from cart.', {
        label: 'Undo',
        onClick: () => {
          dispatch({ type: 'ADD_TO_CART', item: itemToRestore });
        },
      });
    }
  }, [showToast]);

  const updateQuantity = useCallback((key: string, qty: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', key, quantity: qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    const isWishlisted = state.wishlist.has(product.id);
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', id: product.id });
      showToast('Item removed from wishlist.', {
        label: 'Undo',
        onClick: () => {
          dispatch({ type: 'ADD_TO_WISHLIST', id: product.id });
        },
      });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', id: product.id });
      showToast('Item saved to wishlist.');
    }
  }, [state.wishlist, showToast]);

  const addToRecent = useCallback((product: Product) => {
    dispatch({ type: 'ADD_RECENT', product });
  }, []);

  const openCart  = useCallback(() => dispatch({ type: 'OPEN_CART' }),  []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const openHelp  = useCallback(() => dispatch({ type: 'OPEN_HELP' }),  []);
  const closeHelp = useCallback(() => dispatch({ type: 'CLOSE_HELP' }), []);
  const openChat  = useCallback(() => dispatch({ type: 'OPEN_CHAT' }),  []);
  const closeChat = useCallback(() => dispatch({ type: 'CLOSE_CHAT' }), []);

  const placeOrder = useCallback((order: PlacedOrder) => {
    dispatch({ type: 'PLACE_ORDER', order });
    showToast('Order placed successfully!');
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      addToRecent,
      openCart,
      closeCart,
      openHelp,
      closeHelp,
      openChat,
      closeChat,
      showToast,
      placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // Provide a fallback for isolated component testing/preview
    return {
      state: initialState,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      toggleWishlist: () => {},
      addToRecent: () => {},
      openCart: () => {},
      closeCart: () => {},
      openHelp: () => {},
      closeHelp: () => {},
      openChat: () => {},
      closeChat: () => {},
      showToast: () => {},
      placeOrder: () => {},
    };
  }
  return ctx;
}