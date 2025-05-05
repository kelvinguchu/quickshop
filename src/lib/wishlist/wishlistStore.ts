import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the wishlist item type
export interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
}

// Define the wishlist store state and actions
interface WishlistState {
  items: WishlistItem[]
  itemCount: number
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

// Create a Zustand store with persistence to localStorage
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addItem: (item: WishlistItem) => {
        // Only add if it doesn't already exist
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) {
            return state // Item already exists, return state unchanged
          }

          const updatedItems = [...state.items, item]
          return {
            items: updatedItems,
            itemCount: updatedItems.length,
          }
        })
      },

      removeItem: (id: string) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id)
          return {
            items: updatedItems,
            itemCount: updatedItems.length,
          }
        })
      },

      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id)
      },

      clearWishlist: () => {
        set({ items: [], itemCount: 0 })
      },
    }),
    {
      name: 'wishlist-storage', // unique name for localStorage
    },
  ),
)
