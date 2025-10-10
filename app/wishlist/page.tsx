'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { useWishlist } from '@/hooks/use-wishlist'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { Heart, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast({
      title: "Removed from wishlist",
      description: `${name} has been removed from your wishlist.`
    })
  }

  const handleAddToCart = (item: any) => {
    addItem(item)
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    })
  }

  const handleMoveAllToCart = () => {
    items.forEach(item => addItem(item))
    clearWishlist()
    toast({
      title: "Moved to cart",
      description: `All ${items.length} items have been moved to your cart.`
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Wishlist</h1>
                <p className="text-muted-foreground mt-2">
                  {items.length > 0 
                    ? `${items.length} item${items.length === 1 ? '' : 's'} saved for later.`
                    : 'Save your favorite items for later.'
                  }
                </p>
              </div>
              {items.length > 0 && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleMoveAllToCart}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Move All to Cart</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Start browsing and add items you love to your wishlist.
                  </p>
                  <Button asChild className="flex items-center space-x-2">
                    <Link href="/">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Start Shopping</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-[4/5] relative">
                      <Link href={`/products/${item.id}`}>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 rounded-full transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-medium text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold mb-3">₹{item.price}</p>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-red-600 hover:text-red-700" 
                          onClick={() => handleRemoveItem(item.id, item.name)}
                        >
                          <Heart className="h-4 w-4 mr-2 fill-current" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
