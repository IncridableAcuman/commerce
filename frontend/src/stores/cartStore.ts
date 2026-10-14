import { create } from "zustand";
import type { Product } from "../interfaces/product.interface";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Calculations
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const STORAGE_KEY = "commerce_cart_items";

const loadInitialCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Savatni saqlashda xatolik:", e);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialCart(),
  isCartOpen: false,

  addItem: (product: Product, quantity = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
          : item
      );
    } else {
      updated = [...items, { product, quantity: Math.min(quantity, product.stock || 99) }];
    }

    saveCart(updated);
    set({ items: updated, isCartOpen: true });
  },

  removeItem: (productId: number) => {
    const updated = get().items.filter((i) => i.product.id !== productId);
    saveCart(updated);
    set({ items: updated });
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const updated = get().items.map((item) => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: Math.min(quantity, item.product.stock || 99),
        };
      }
      return item;
    });
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
}));
