"use client"

import useSWR from "swr"

export type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  size?: string
  color?: string
  qty: number
}

const CART_KEY = "stylewav_cart_v1"

function readCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {}
}

export function useCart() {
  const { data, mutate } = useSWR<CartItem[]>(CART_KEY, () => readCart(), {
    fallbackData: [],
    revalidateOnFocus: false,
  })

  const items = data ?? []
  const total = items.reduce((acc, it) => acc + it.price * it.qty, 0)

  function addItem(p: { id: string; name: string; price: number; image?: string; size?: string; color?: string }, quantity: number = 1) {
    const next = [...items]
    // Find item with same id, size AND color (or all matching undefined values)
    const idx = next.findIndex((i) => i.id === p.id && i.size === p.size && i.color === p.color)
    if (idx >= 0) {
      next[idx] = { ...next[idx], qty: next[idx].qty + quantity }
    } else {
      next.push({ id: p.id, name: p.name, price: p.price, image: p.image, size: p.size, color: p.color, qty: quantity })
    }
    writeCart(next)
    mutate(next, false)
  }

  function removeItem(id: string, size?: string, color?: string) {
    const next = items.filter((i) => {
      if (size !== undefined || color !== undefined) {
        return !(i.id === id && i.size === size && i.color === color)
      }
      return i.id !== id
    })
    writeCart(next)
    mutate(next, false)
  }

  function increment(id: string, size?: string, color?: string) {
    const next = items.map((i) => {
      if (size !== undefined || color !== undefined) {
        return (i.id === id && i.size === size && i.color === color) ? { ...i, qty: i.qty + 1 } : i
      }
      return (i.id === id) ? { ...i, qty: i.qty + 1 } : i
    })
    writeCart(next)
    mutate(next, false)
  }

  function decrement(id: string, size?: string, color?: string) {
    const next = items.map((i) => {
      if (size !== undefined || color !== undefined) {
        return (i.id === id && i.size === size && i.color === color) ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      }
      return (i.id === id) ? { ...i, qty: Math.max(1, i.qty - 1) } : i
    })
    writeCart(next)
    mutate(next, false)
  }

  function clear() {
    writeCart([])
    mutate([], false)
  }

  return { items, total, addItem, removeItem, increment, decrement, clear }
}
