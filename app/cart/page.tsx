"use client"

import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { items, total, increment, decrement, removeItem, clear } = useCart()

  return (
    <main className="container mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-6 text-sm">
          Your cart is empty.{" "}
          <Link href="/" className="underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 mt-6">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 border border-border rounded-lg p-3">
                <img
                  src={`/placeholder.svg?height=96&width=96&query=product-thumbnail`}
                  alt={`${it.name} thumbnail`}
                  className="h-24 w-24 rounded-md border border-border object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-muted-foreground">₹{it.price}</p>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded-md border border-border"
                      aria-label={`Decrease ${it.name}`}
                      onClick={() => decrement(it.id)}
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{it.qty}</span>
                    <button
                      className="h-7 w-7 rounded-md border border-border"
                      aria-label={`Increase ${it.name}`}
                      onClick={() => increment(it.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="text-sm underline hover:opacity-80" onClick={() => removeItem(it.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <aside className="border border-border rounded-lg p-4 h-fit">
            <h2 className="font-medium">Order Summary</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Shipping calculated at checkout.</p>
            <Button asChild className="w-full mt-4">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <button className="w-full text-xs underline mt-3" onClick={clear}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}
