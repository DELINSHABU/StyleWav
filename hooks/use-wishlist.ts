'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WishlistItem = {
  id: string
  name: string
  price: number
  image: string
}

type WishlistState = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(i => i.id === item.id)
        
        if (!existingItem) {
          set({ items: [...currentItems, item] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'stylewave-wishlist',
    }
  )
)