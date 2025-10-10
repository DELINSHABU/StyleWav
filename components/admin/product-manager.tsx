"use client"

import { useState, useMemo } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "./product-list"
import { ProductForm } from "./product-form"
import { ProductFilters } from "./product-filters"
import { Plus } from "lucide-react"

interface ProductManagerProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  onRefresh: () => void
}

// Filter types
export type FilterOptions = {
  category: string
  stockStatus: string
  searchTerm: string
}

export function ProductManager({ products, setProducts, onRefresh }: ProductManagerProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    stockStatus: '',
    searchTerm: ''
  })
  
  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    return uniqueCategories.sort()
  }, [products])
  
  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false
      }
      
      // Stock status filter
      if (filters.stockStatus) {
        const totalStock = product.sizeStock 
          ? Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0)
          : (product.stockQuantity || 0)
        
        const isInStock = product.unlimitedStock || (totalStock > 0 && product.inStock !== false)
        const isLowStock = !product.unlimitedStock && totalStock > 0 && totalStock <= (product.lowStockThreshold || 10)
        const isOutOfStock = !product.unlimitedStock && (totalStock === 0 || product.inStock === false)
        
        switch (filters.stockStatus) {
          case 'in-stock':
            if (!isInStock) return false
            break
          case 'low-stock':
            if (!isLowStock) return false
            break
          case 'out-of-stock':
            if (!isOutOfStock) return false
            break
          case 'unlimited':
            if (!product.unlimitedStock) return false
            break
        }
      }
      
      // Search term filter (searches in name and ID)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const nameMatch = product.name.toLowerCase().includes(searchLower)
        const idMatch = product.id.toLowerCase().includes(searchLower)
        if (!nameMatch && !idMatch) {
          return false
        }
      }
      
      return true
    })
  }, [products, filters])

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      
      if (response.ok) {
        const newProduct = await response.json()
        setProducts([...products, newProduct])
        setIsAddingProduct(false)
      } else {
        const error = await response.json()
        alert(`Error adding product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })
      
      if (response.ok) {
        const updated = await response.json()
        setProducts(products.map(p => p.id === updated.id ? updated : p))
        setEditingProduct(null)
      } else {
        const error = await response.json()
        alert(`Error updating product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        const error = await response.json()
        alert(`Error deleting product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setIsAddingProduct(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product catalog ({filteredProducts.length} of {products.length} products)
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsAddingProduct(true)}
              disabled={isAddingProduct || !!editingProduct || isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Product Filters */}
          <div className="mb-6">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              productCount={filteredProducts.length}
              totalCount={products.length}
            />
          </div>

          {(isAddingProduct || editingProduct) && (
            <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={handleCancelEdit}
                isEditing={!!editingProduct}
              />
            </div>
          )}

          <ProductList
            products={filteredProducts}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
            isEditing={!!editingProduct || isAddingProduct}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}