'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Package } from 'lucide-react'
import { getSizeStock, isSizeAvailable } from '@/lib/stock-utils'

interface SizeSelectionModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, size: string) => void
}

export function SizeSelectionModal({ product, isOpen, onClose, onAddToCart }: SizeSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleAddToCart = () => {
    if (product && selectedSize) {
      onAddToCart(product, selectedSize)
      setSelectedSize('')
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedSize('')
    onClose()
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Size</DialogTitle>
          <DialogDescription>
            Choose your preferred size for {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image.startsWith('data:') || product.image.startsWith('http')
                    ? product.image
                    : `/api/images/${product.image}`} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-lg font-semibold">₹{product.price}</p>
            </div>
          </div>

          <Separator />

          {/* Size Selection */}
          <div className="space-y-3">
            <p className="font-medium">Available Sizes:</p>
            
            {product.sizes && product.sizes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const sizeStock = getSizeStock(product, size)
                  const isAvailable = isSizeAvailable(product, size)
                  const isSelected = selectedSize === size
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable ? handleSizeSelect(size) : null}
                      disabled={!isAvailable}
                      className={`
                        relative p-3 text-sm font-medium border rounded-lg transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : isAvailable
                            ? 'border-border bg-background hover:border-primary hover:bg-muted'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{size}</div>
                        <div className="text-xs mt-1">
                          {isAvailable ? (
                            product.sizeStock ? `${sizeStock} left` : 'Available'
                          ) : (
                            'Out of Stock'
                          )}
                        </div>
                      </div>
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg">
                          <span className="text-xs font-medium text-muted-foreground">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No size options available for this product</p>
              </div>
            )}
          </div>

          {/* Size Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <p>📏 Need help with sizing? Check our size guide for the perfect fit.</p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart} 
              disabled={!selectedSize}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart {selectedSize && `(${selectedSize})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}