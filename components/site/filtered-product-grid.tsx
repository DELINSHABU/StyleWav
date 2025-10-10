"use client"

import { useState, useEffect, useMemo } from "react"
import { Product, getAdminProducts } from "@/lib/products"
import { ProductGrid } from "./product-grid"

interface FilteredProductGridProps {
  fallbackProducts: Product[]
  initialCategory?: string
  maxItems?: number
}

export function FilteredProductGrid({ 
  fallbackProducts, 
  initialCategory,
  maxItems 
}: FilteredProductGridProps) {
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(initialCategory)

  // Map URL category params to product category values
  const categoryMapping: { [key: string]: string } = {
    'oversized-tees': 'Oversized Tees',
    'graphic-tees': 'Graphic Tees', 
    'co-ords': 'Co-ords',
    'new-arrivals': 'New Arrivals'
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products', {
        // Add cache-busting to ensure fresh data
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched fresh product data from API')
        setProducts(data)
      }
    } catch (error) {
      console.warn('Could not load products from API, using fallback:', error)
      // Fallback to localStorage products
      const fallbackData = getAdminProducts()
      setProducts(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (!currentCategory) {
      return maxItems ? products.slice(0, maxItems) : products
    }

    const categoryName = categoryMapping[currentCategory]
    if (!categoryName) {
      return maxItems ? products.slice(0, maxItems) : products
    }

    const filtered = products.filter(product => 
      product.category === categoryName
    )

    return maxItems ? filtered.slice(0, maxItems) : filtered
  }, [products, currentCategory, maxItems])

  // Update category when initialCategory changes (e.g., from URL params)
  useEffect(() => {
    setCurrentCategory(initialCategory)
  }, [initialCategory])

  return (
    <div className="space-y-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentCategory(undefined)}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
            !currentCategory
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:border-primary'
          }`}
        >
          All Products
        </button>
        {Object.entries(categoryMapping).map(([urlParam, displayName]) => (
          <button
            key={urlParam}
            onClick={() => setCurrentCategory(urlParam)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              currentCategory === urlParam
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary'
            }`}
          >
            {displayName}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {currentCategory && ` in ${categoryMapping[currentCategory]}`}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products found in this category.
          </p>
          <button
            onClick={() => setCurrentCategory(undefined)}
            className="text-sm underline hover:opacity-80"
          >
            View all products
          </button>
        </div>
      )}
    </div>
  )
}