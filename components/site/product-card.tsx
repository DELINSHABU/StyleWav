"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { getStockStatus, isProductAvailable, getStockStatusText } from "@/lib/stock-utils"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  images?: string[]
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  rating?: number
  reviews?: number
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()
  const isWishlisted = isInWishlist(product.id)
  const stockStatus = getStockStatus(product)
  const isAvailable = isProductAvailable(product)
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`
      })
    }
  }
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Cannot add to cart",
        description: `${product.name} is currently out of stock.`
      })
      return
    }
    
    // If product has sizes, redirect to product page for size selection
    if (product.sizes && product.sizes.length > 0) {
      router.push(`/products/${product.id}`)
      return
    }
    
    // If no sizes, add directly to cart
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    })
  }
  
  
  return (
    <Link href={`/products/${product.id}`}>
      <article className="rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="aspect-[4/5] w-full relative">
          <img 
            src={product.image 
              ? (product.image.startsWith('data:') || product.image.startsWith('http') 
                ? product.image 
                : `/api/images/${product.image}`)
              : "/placeholder.svg"} 
            alt={product.name} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isWishlisted 
                ? 'bg-red-500/90 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-red-500/90 hover:text-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`h-4 w-4 ${
                isWishlisted ? 'fill-current' : ''
              }`} 
            />
          </button>
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium bg-red-600 px-3 py-1 rounded">
                {getStockStatusText(product)}
              </span>
            </div>
          )}
          {stockStatus === 'low-stock' && isAvailable && (
            <div className="absolute bottom-2 left-2">
              <StockStatusBadge product={product} showIcon={false} className="text-xs" />
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium text-pretty line-clamp-2 flex-1">
              {product.name}
            </h3>
            {product.category && (
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {product.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">₹{product.price}</p>
            {product.rating && product.reviews && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.rating}</span>
                <span className="ml-1">({product.reviews})</span>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <Button 
              size="sm" 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={!isAvailable}
              variant={!isAvailable ? 'secondary' : 'default'}
            >
              {!isAvailable 
                ? getStockStatusText(product)
                : (product.sizes && product.sizes.length > 0)
                  ? 'View Product'
                  : 'Add to Cart'
              }
            </Button>
            {stockStatus === 'low-stock' && isAvailable && (
              <p className="text-xs text-orange-600 mt-1 text-center">
                {getStockStatusText(product)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
