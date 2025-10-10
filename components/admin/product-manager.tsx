"use client"

import { useState } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "./product-list"
import { ProductForm } from "./product-form"
import { Plus } from "lucide-react"

interface ProductManagerProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  onRefresh: () => void
}

export function ProductManager({ products, setProducts, onRefresh }: ProductManagerProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
                Manage your product catalog
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
            products={products}
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