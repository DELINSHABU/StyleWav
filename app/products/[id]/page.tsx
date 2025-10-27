'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { SizeChartModal } from '@/components/site/size-chart-modal'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/hooks/use-toast'
import { getProductById } from '@/lib/products'
import type { Product } from '@/lib/products'
import { StockStatusBadge, StockQuantityDisplay } from '@/components/ui/stock-status-badge'
import { getStockStatus, isProductAvailable, getStockStatusText } from '@/lib/stock-utils'
import { Heart, Star, ArrowLeft, ShoppingBag, Truck, Shield, RotateCcw, Ruler, Share2 } from 'lucide-react'
import ProductSuggestions from '@/components/site/ProductSuggestions'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const fetchProduct = async () => {
    try {
      // First try to fetch from API for latest data
      const response = await fetch('/api/products')
      if (response.ok) {
        const products = await response.json()
        const productData = products.find((p: Product) => p.id === productId)
        if (productData) {
          console.log(`Loading product ${productData.name}:`, {
            stockQuantity: productData.stockQuantity,
            inStock: productData.inStock,
            unlimitedStock: productData.unlimitedStock
          })
          setProduct(productData)
          setSelectedImage(productData.image)
          if (productData.sizes?.length) setSelectedSize(productData.sizes[0])
          if (productData.colors?.length) setSelectedColor(productData.colors[0])
          return
        }
      }
      
      // Fallback to local data if API fails
      const productData = getProductById(productId)
      if (productData) {
        console.log(`Loading product from fallback ${productData.name}:`, {
          stockQuantity: productData.stockQuantity,
          inStock: productData.inStock,
          unlimitedStock: productData.unlimitedStock
        })
        setProduct(productData)
        setSelectedImage(productData.image)
        if (productData.sizes?.length) setSelectedSize(productData.sizes[0])
        if (productData.colors?.length) setSelectedColor(productData.colors[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      // Fallback to local data on error
      const productData = getProductById(productId)
      if (productData) {
        setProduct(productData)
        setSelectedImage(productData.image)
        if (productData.sizes?.length) setSelectedSize(productData.sizes[0])
        if (productData.colors?.length) setSelectedColor(productData.colors[0])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])

  // Refresh product data when window gains focus (user comes back from checkout)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing product data...')
      fetchProduct()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)
  const stockStatus = getStockStatus(product)
  const isAvailable = isProductAvailable(product)

  const handleWishlistToggle = () => {
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

  const handleAddToCart = () => {
    console.log('Adding to cart with quantity:', quantity)
    
    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Cannot add to cart",
        description: `${product.name} is currently out of stock.`
      })
      return
    }

    // Create cart item with selected size and color (quantity handled by addItem function)
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    }

    console.log('Cart item to add:', cartItem)
    console.log('Adding', quantity, 'items to cart')

    // Add the item with the specified quantity
    addItem(cartItem, quantity)
    console.log(`Added ${quantity} items to cart successfully`)
    
    const sizeText = selectedSize ? ` (${selectedSize})` : ''
    const colorText = selectedColor ? ` - ${selectedColor}` : ''
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name}${sizeText}${colorText} added to your cart.`
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ₹${product.price}`,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard!"
      })
    }
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1 space-y-4">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted">
              <img
                src={(selectedImage || product.image)
                  ? ((selectedImage || product.image).startsWith('data:') || (selectedImage || product.image).startsWith('http')
                    ? (selectedImage || product.image)
                    : `/api/images/${selectedImage || product.image}`)
                  : "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square w-20 rounded-lg overflow-hidden bg-muted shrink-0 border-2 ${
                      selectedImage === image ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image
                        ? (image.startsWith('data:') || image.startsWith('http')
                          ? image
                          : `/api/images/${image}`)
                        : "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {product.category && (
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                  )}
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-full transition-colors ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-red-500 hover:text-white'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold">₹{product.price}</p>
                {product.rating && product.reviews && (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                <StockStatusBadge product={product} className="mb-2" />
                <StockQuantityDisplay product={product} />
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSizeChart(true)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Ruler className="h-4 w-4" />
                    Size Chart
                  </Button>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Decreasing quantity from', quantity, 'to', Math.max(1, quantity - 1))
                    setQuantity(Math.max(1, quantity - 1))
                  }}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  -
                </Button>
                <div className="flex items-center justify-center min-w-[60px] h-10 px-4 border rounded-md bg-background">
                  <span className="text-lg font-medium">{quantity}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Increasing quantity from', quantity, 'to', quantity + 1)
                    setQuantity(quantity + 1)
                  }}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Maximum 10 items per order</p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                variant={!isAvailable ? 'secondary' : 'default'}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isAvailable ? 'Add to Cart' : getStockStatusText(product)}
              </Button>

              {!isAvailable && (
                <p className="text-sm text-red-600 text-center">
                  {getStockStatusText(product)} - This item is currently unavailable
                </p>
              )}

              {stockStatus === 'low-stock' && isAvailable && (
                <p className="text-sm text-orange-600 text-center">
                  ⚠️ {getStockStatusText(product)} - Order soon!
                </p>
              )}
            </div>

            <Separator />

            {/* Product Features */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Free shipping on orders over ₹999</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Easy returns within 30 days</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">1 year quality guarantee</span>
              </div>
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <ProductSuggestions 
              currentProductId={product.id} 
              currentCategory={product.category}
            />
          </div>
        </div>

        {/* Mobile Suggestions */}
        <div className="mt-8 lg:hidden">
          <ProductSuggestions 
            currentProductId={product.id} 
            currentCategory={product.category}
          />
        </div>

        {/* Additional Product Info */}
        <div className="mt-16 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Material</h4>
                  <p className="text-sm text-muted-foreground">100% Premium Cotton</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fit</h4>
                  <p className="text-sm text-muted-foreground">Regular/Oversized</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Care Instructions</h4>
                  <p className="text-sm text-muted-foreground">Machine wash cold, tumble dry low</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Origin</h4>
                  <p className="text-sm text-muted-foreground">Made in India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-50">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="w-14 shrink-0"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="flex-1 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Size Chart Modal */}
      <SizeChartModal 
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />
    </div>
  )
}
