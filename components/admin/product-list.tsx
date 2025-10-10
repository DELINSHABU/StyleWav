"use client"

import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StockStatusBadge, StockQuantityDisplay } from "@/components/ui/stock-status-badge"
import { Edit, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isEditing: boolean
  isLoading?: boolean
}

export function ProductList({ products, onEdit, onDelete, isEditing, isLoading = false }: ProductListProps) {
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteProductId) {
      onDelete(deleteProductId)
      setDeleteProductId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=48&width=48&text=No Image"
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {product.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.id}</Badge>
                </TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell className="min-w-[160px]">
                  <div className="space-y-1">
                    {product.sizes && product.sizes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => {
                          const sizeStock = product.sizeStock?.[size] || 0
                          return (
                            <div key={size} className="flex items-center gap-1">
                              <Badge 
                                variant={sizeStock > 0 ? "secondary" : "destructive"} 
                                className="text-xs"
                              >
                                {size}
                              </Badge>
                              <span className={`text-xs ${sizeStock > 0 ? 'text-foreground' : 'text-destructive'}`}>
                                ({sizeStock})
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No sizes</span>
                    )}
                    {product.sizeStock && (
                      <div className="text-xs text-muted-foreground">
                        Total: {Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <div className="space-y-2">
                    <StockStatusBadge product={product} />
                    <StockQuantityDisplay product={product} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(product.image, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      disabled={isEditing || isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteProductId(product.id)}
                          disabled={isEditing || isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteProductId(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No products found. Add your first product to get started.
        </div>
      )}
    </div>
  )
}