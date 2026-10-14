import { create } from "zustand";
import type { Product } from "../interfaces/product.interface";

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const STORAGE_KEY = "commerce_wishlist";

const loadWishlist = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Wishlist saqlashda xatolik:", e);
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: loadWishlist(),

  toggleWishlist: (product: Product) => {
    const { wishlist } = get();
    const exists = wishlist.some((item) => item.id === product.id);

    let updated: Product[];
    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    saveWishlist(updated);
    set({ wishlist: updated });
  },

  isInWishlist: (productId: number) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  clearWishlist: () => {
    saveWishlist([]);
    set({ wishlist: [] });
  },
}));
