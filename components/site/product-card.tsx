"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { getStockStatus, isProductAvailable, getStockStatusText } from "@/lib/stock-utils"
import { Heart, Star, ShoppingCart, Eye, Zap } from "lucide-react"
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

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
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
    <div className="group">
      {/* Removed conflicting motion.div wrapper - animation handled by ProductGrid */}
      <Link href={`/products/${product.id}`}>
        <article className="relative rounded-lg border-2 border-gray-300 dark:border dark:border-white/30 overflow-hidden bg-white dark:bg-black hover:shadow-lg transition-shadow cursor-pointer" style={{minHeight: '350px'}}>
          {/* Image Container */}
          <div className="aspect-[4/5] w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.img 
              src={product.image 
                ? (product.image.startsWith('data:') || product.image.startsWith('http') 
                  ? product.image 
                  : `/api/images/${product.image}`)
                : "/placeholder.svg"} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7 }}
            />
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <motion.button
                  onClick={handleWishlistToggle}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                    isWishlisted 
                      ? 'bg-red-500/90 text-white' 
                      : 'bg-white/90 text-gray-700 hover:bg-red-500/90 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isWishlisted ? 'fill-current scale-110' : 'group-hover:scale-110'
                    }`} 
                  />
                </motion.button>
                
                <motion.button
                  className="p-2.5 rounded-full backdrop-blur-md bg-white/90 text-gray-700 hover:bg-primary/90 hover:text-white transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
              </div>
              
              {/* Quick Add to Cart Button */}
              {isAvailable && (
                <motion.div 
                  className="absolute bottom-3 left-3 right-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-white/95 text-gray-900 hover:bg-white border border-white/20 shadow-lg backdrop-blur-md font-medium"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {(product.sizes && product.sizes.length > 0) ? 'View' : 'Add to Cart'}
                  </Button>
                </motion.div>
              )}
            </div>
            
            {/* Status Badges */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="shadow-lg">
                  {getStockStatusText(product)}
                </Badge>
              </div>
            )}
            
            {product.category === 'New Arrivals' && (
              <motion.div
                className="absolute top-3 left-3"
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  New
                </Badge>
              </motion.div>
            )}
            
            {stockStatus === 'low-stock' && isAvailable && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  Low Stock
                </Badge>
              </div>
            )}
          </div>
          
            {/* Content */}
          <div className="p-4 space-y-3 bg-white dark:bg-black text-gray-900 dark:text-white">
            {/* Category and Title */}
            <div className="space-y-1">
              {product.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {product.category}
                </span>
              )}
              <h3 className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-white">
                {product.name}
              </h3>
            </div>
            
            {/* Rating and Reviews */}
            {product.rating && product.reviews && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating!) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-300 text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {/* You could add originalPrice here if available */}
              </div>
              
              {/* Size indicator */}
              {product.sizes && product.sizes.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {product.sizes.length} sizes
                </Badge>
              )}
            </div>
            
            {/* Action Button (visible on mobile) */}
            <div className="md:hidden">
              <Button 
                size="sm" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900" 
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
            </div>
            
            {stockStatus === 'low-stock' && isAvailable && (
              <p className="text-xs text-orange-600 dark:text-orange-400 text-center font-medium">
                {getStockStatusText(product)}
              </p>
            )}
          </div>
        </article>
      </Link>
    </div>
  )
}
