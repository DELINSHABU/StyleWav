"use client"

import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CartProductSuggestions from "@/components/site/CartProductSuggestions"

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
            {items.map((it, index) => (
              <div key={`${it.id}-${it.size || 'no-size'}-${it.color || 'no-color'}-${index}`} className="flex items-center gap-4 border border-border rounded-lg p-3">
                <img
                  src={it.image || `/placeholder.svg?height=96&width=96&query=product-thumbnail`}
                  alt={`${it.name} thumbnail`}
                  className="h-24 w-24 rounded-md border border-border object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=96&width=96&query=product-thumbnail`
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground font-medium">
                    {it.size && (
                      <span>Size: {it.size}</span>
                    )}
                    {it.color && (
                      <span>Color: {it.color}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">₹{it.price}</p>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label={`Decrease ${it.name}${it.size ? ` (${it.size})` : ''}${it.color ? ` - ${it.color}` : ''}`}
                      onClick={() => decrement(it.id, it.size, it.color)}
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{it.qty}</span>
                    <button
                      className="h-7 w-7 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label={`Increase ${it.name}${it.size ? ` (${it.size})` : ''}${it.color ? ` - ${it.color}` : ''}`}
                      onClick={() => increment(it.id, it.size, it.color)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{it.price * it.qty}</p>
                  <button 
                    className="text-sm text-red-600 hover:text-red-800 underline mt-1" 
                    onClick={() => removeItem(it.id, it.size, it.color)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="border border-border rounded-lg p-4 h-fit">
            <h2 className="font-medium">Order Summary</h2>
            
            {/* Item Details with Sizes */}
            <div className="mt-3 space-y-2">
              {items.map((item, index) => (
                <div key={`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}-${index}`} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate flex-1 pr-2">
                    {item.name}{item.size ? ` (${item.size})` : ''}{item.color ? ` - ${item.color}` : ''} × {item.qty}
                  </span>
                  <span className="font-medium">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shipping calculated at checkout.</p>
            </div>
            
            <Button asChild className="w-full mt-4">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <button className="w-full text-xs underline mt-3" onClick={clear}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}

      {/* Product Suggestions - Show only when cart has items */}
      {items.length > 0 && (
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Continue Shopping</h2>
            <p className="text-muted-foreground">Discover more products you might like</p>
          </div>
          <CartProductSuggestions excludeIds={items.map(item => item.id)} />
        </div>
      )}
    </main>
  )
}
