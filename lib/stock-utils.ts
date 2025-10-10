import type { Product } from './products'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

/**
 * Get stock status for a product
 */
export function getStockStatus(product: Product): StockStatus {
  // If unlimited stock is enabled, always in stock
  if (product.unlimitedStock) {
    return 'in-stock'
  }
  
  // Check if product is out of stock
  if (!product.inStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0)) {
    return 'out-of-stock'
  }
  
  // Check if product is low stock
  if (
    product.stockQuantity !== undefined && 
    product.lowStockThreshold !== undefined &&
    product.stockQuantity <= product.lowStockThreshold
  ) {
    return 'low-stock'
  }
  
  return 'in-stock'
}

/**
 * Check if product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  const status = getStockStatus(product)
  return status !== 'out-of-stock'
}

/**
 * Get stock status display text
 */
export function getStockStatusText(product: Product): string {
  const status = getStockStatus(product)
  
  switch (status) {
    case 'out-of-stock':
      return 'Out of Stock'
    case 'low-stock':
      if (product.unlimitedStock) {
        return 'In Stock'
      }
      return `Low Stock (${product.stockQuantity} left)`
    case 'in-stock':
      if (product.unlimitedStock) {
        return 'In Stock'
      }
      return product.stockQuantity !== undefined ? `${product.stockQuantity} in stock` : 'In Stock'
    default:
      return 'In Stock'
  }
}

/**
 * Get stock status variant for badges
 */
export function getStockStatusVariant(status: StockStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'out-of-stock':
      return 'destructive'
    case 'low-stock':
      return 'secondary'
    case 'in-stock':
      return 'default'
    default:
      return 'outline'
  }
}

/**
 * Calculate total stock from size-specific stock
 */
export function calculateTotalStockFromSizes(sizeStock: { [size: string]: number }): number {
  return Object.values(sizeStock).reduce((total, stock) => total + stock, 0)
}

/**
 * Update stock quantity after purchase (supports size-specific stock)
 */
export function updateStockAfterPurchase(product: Product, quantity: number, size?: string): Partial<Product> {
  // If unlimited stock, don't update quantity
  if (product.unlimitedStock) {
    return {}
  }
  
  // Handle size-specific stock
  if (product.sizeStock && size) {
    const currentSizeStock = product.sizeStock[size] || 0
    const newSizeStock = Math.max(0, currentSizeStock - quantity)
    
    const updatedSizeStock = {
      ...product.sizeStock,
      [size]: newSizeStock
    }
    
    const newTotalStock = calculateTotalStockFromSizes(updatedSizeStock)
    
    return {
      sizeStock: updatedSizeStock,
      stockQuantity: newTotalStock,
      inStock: newTotalStock > 0
    }
  }
  
  // Handle regular stock
  const currentStock = product.stockQuantity || 0
  const newStock = Math.max(0, currentStock - quantity)
  
  return {
    stockQuantity: newStock,
    inStock: newStock > 0
  }
}

/**
 * Get stock for a specific size
 */
export function getSizeStock(product: Product, size: string): number {
  return product.sizeStock?.[size] || 0
}

/**
 * Check if specific size is available
 */
export function isSizeAvailable(product: Product, size: string): boolean {
  if (product.unlimitedStock) {
    return product.inStock !== false
  }
  
  if (product.sizeStock) {
    return getSizeStock(product, size) > 0
  }
  
  return isProductAvailable(product)
}

/**
 * Calculate stock percentage for progress bars
 */
export function getStockPercentage(product: Product): number {
  if (product.unlimitedStock) {
    return 100
  }
  
  const currentStock = product.stockQuantity || 0
  const threshold = product.lowStockThreshold || 0
  
  if (currentStock === 0) {
    return 0
  }
  
  if (threshold === 0) {
    return currentStock > 0 ? 100 : 0
  }
  
  // Calculate percentage based on low stock threshold as minimum viable stock
  const maxStock = Math.max(threshold * 3, 100) // Assume normal stock is 3x threshold or minimum 100
  return Math.min(100, (currentStock / maxStock) * 100)
}