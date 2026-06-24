// src/store/wishlistStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.items.includes(productId);
          return {
            items: exists
              ? state.items.filter((id) => id !== productId)
              : [...state.items, productId],
          };
        });
      },

      isWishlisted: (productId) => {
        return get().items.includes(productId);
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),

      getWishlistCount: () => get().items.length,
    }),
    {
      name: 'nazakkat-wishlist',
    }
  )
);

export default useWishlistStore;