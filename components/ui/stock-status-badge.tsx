import { Badge } from "@/components/ui/badge"
import { getStockStatus, getStockStatusText, getStockStatusVariant, type StockStatus } from "@/lib/stock-utils"
import type { Product } from "@/lib/products"
import { AlertTriangle, CheckCircle, XCircle, Infinity } from "lucide-react"

interface StockStatusBadgeProps {
  product: Product
  showIcon?: boolean
  showText?: boolean
  className?: string
}

export function StockStatusBadge({ 
  product, 
  showIcon = true, 
  showText = true,
  className 
}: StockStatusBadgeProps) {
  const status = getStockStatus(product)
  const text = getStockStatusText(product)
  const variant = getStockStatusVariant(status)

  const getIcon = (status: StockStatus) => {
    if (product.unlimitedStock) {
      return <Infinity className="h-3 w-3" />
    }

    switch (status) {
      case 'out-of-stock':
        return <XCircle className="h-3 w-3" />
      case 'low-stock':
        return <AlertTriangle className="h-3 w-3" />
      case 'in-stock':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <CheckCircle className="h-3 w-3" />
    }
  }

  return (
    <Badge variant={variant} className={`flex items-center gap-1 ${className}`}>
      {showIcon && getIcon(status)}
      {showText && (
        <span className="text-xs">
          {product.unlimitedStock ? 'Unlimited Stock' : text}
        </span>
      )}
    </Badge>
  )
}

interface StockQuantityDisplayProps {
  product: Product
  className?: string
}

export function StockQuantityDisplay({ product, className }: StockQuantityDisplayProps) {
  if (product.unlimitedStock) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Infinity className="h-4 w-4 text-blue-500" />
        <span className="text-muted-foreground">Unlimited Stock</span>
      </div>
    )
  }

  const stockQuantity = product.stockQuantity || 0
  const lowStockThreshold = product.lowStockThreshold || 0
  const status = getStockStatus(product)

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Stock:</span>
        <span className={`font-medium ${
          status === 'out-of-stock' ? 'text-red-600' : 
          status === 'low-stock' ? 'text-orange-600' : 'text-green-600'
        }`}>
          {stockQuantity}
        </span>
      </div>
      {lowStockThreshold > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Low Stock Alert:</span>
          <span className="text-muted-foreground">{lowStockThreshold}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-300 ${
            status === 'out-of-stock' ? 'bg-red-500' :
            status === 'low-stock' ? 'bg-orange-500' : 'bg-green-500'
          }`}
          style={{
            width: `${Math.max(5, Math.min(100, (stockQuantity / Math.max(lowStockThreshold * 2, 50)) * 100))}%`
          }}
        />
      </div>
    </div>
  )
}